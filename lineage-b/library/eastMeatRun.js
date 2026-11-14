// skill: eastMeatRun
// eastMeatRun v3 (operator skill, lineage-b) — food-first run, east herd.
// CONTRACT (learned the hard way, 2026-11-08): lineage-b skills export a
// FUNCTION (bot, helpers, ctx) with .post attached; helpers is PASSED IN,
// never required. v1 (function-style) ran; the v2 rewrite used a lineage-A
// {run,post} object + a bogus require and died at the latch ("skill exports
// no function" / "Cannot find module ./helpers"). v3 keeps v2's engine:
// short 9 s goto caps so a server veto surfaces to the SKILL (a 25 s
// gotoDirect hides the stall inside the follower's stuck-reset loop and
// digFaceToward never engages — run 1 evidence), then the skill aims
// helpers.digFaceToward at the waypoint itself (the vetoing face is the
// diagonal cell toward it), up to 3 dig+hop cycles per waypoint; <0.5 blocks
// net progress after the cycles ABORTS (no grind — triple-010's fence).
// Cancellation rides the executor-bound run via helpers' fallback (no run
// arg passed). Corridor: stationary scan 2026-11-08, BFS up<=+1 / down<=-2
// from her 09:41 park cell (56,-66) to the herd ground (112,-59): 57 cells,
// 10 +1 faces, tops 64..71, no drop >1, no surface hostiles east.
// Foods: raw beef/porkchop +3. Absolute bar (post): food>=18 (the REGEN
// threshold — the apple route's +2 could never reach it from food 3) and
// hp>=10 on two rising samples in-run, >=1 food eaten.
// STATE AT v3 FREEZE: she is parked AT VEGA_FOOD_FLOOR=2 (food exactly 2) —
// a same-floor relaunch is a 5 s no-op (triple-010). Firing v3 needs a fresh
// ledgered floor decision AND a margin case; see triple-011.
const FOODS = ['beef', 'porkchop', 'cooked_beef', 'cooked_porkchop', 'mutton', 'cooked_mutton', 'chicken', 'cooked_chicken', 'rabbit', 'bread', 'apple', 'carrot', 'potato', 'baked_potato']
const WAYPOINTS = [
  [58, -68], [61, -71], [64, -74], [67, -75], [70, -76], [73, -79], [76, -82],
  [79, -82], [82, -82], [85, -82], [88, -82], [91, -80], [94, -77], [97, -74],
  [100, -71], [103, -68], [106, -65], [109, -62], [112, -59]
]
const HERD = { x: 112, z: -59 }
const FOOD_FLOOR = 2
const DEADLINE_MS = 265000
let LAST = { kills: 0, foodsEaten: 0 }

function dist2d(bot, x, z) {
  const p = bot.entity.position
  return Math.hypot(p.x - x, p.z - z)
}
function foodCount(bot) {
  return bot.inventory.items().filter(i => FOODS.includes(i.name)).reduce((a, i) => a + i.count, 0)
}

module.exports = async (bot, helpers, ctx) => {
  LAST = { kills: 0, foodsEaten: 0 }
  const t0 = Date.now()
  const check = (what) => {
    if (Date.now() - t0 > DEADLINE_MS) throw new Error('eastMeatRun: internal time budget spent during ' + what)
    if (bot.health < 3) throw new Error(`eastMeatRun: HEALTH ${bot.health} < 3 during ${what} - aborting`)
  }
  const eatIfUseful = async () => {
    while (bot.food < 20) {
      const f = bot.inventory.items().find(i => FOODS.includes(i.name))
      if (!f) return
      check('eat')
      await bot.equip(f, 'hand'); await bot.consume()
      LAST.foodsEaten++
      console.log(`[VEGA] eastMeatRun: ate ${f.name} -> food ${bot.food}`)
    }
  }
  const gotoOnce = async (x, z, range, ms) => {
    const gy = Math.floor(bot.entity.position.y)
    await helpers.goto(bot, x, gy, z, range, ms).catch(e => { if (!/moved|range|timeout/i.test(e.message)) throw e })
  }

  // ---- corridor with dig-face escalation -------------------------------
  const startIdx = (() => {
    let best = 0, bd = 1e9
    WAYPOINTS.forEach(([x, z], i) => { const d = dist2d(bot, x + 0.5, z + 0.5); if (d < bd) { bd = d; best = i } })
    return bd < 2.2 ? Math.min(best + 1, WAYPOINTS.length - 1) : best
  })()
  console.log(`[VEGA] eastMeatRun v3: resuming corridor at waypoint ${startIdx}/${WAYPOINTS.length} from ${bot.entity.position}`)
  for (let i = startIdx; i < WAYPOINTS.length; i++) {
    const [wx, wz] = WAYPOINTS[i]
    const dStart = dist2d(bot, wx + 0.5, wz + 0.5)
    if (dStart <= 1.1) continue
    let arrived = false
    for (let cycle = 0; cycle < 3 && !arrived; cycle++) {
      check(`corridor wp ${i}`)
      await gotoOnce(wx + 0.5, wz + 0.5, 0.8, 9000)
      if (dist2d(bot, wx + 0.5, wz + 0.5) <= 1.1) { arrived = true; break }
      if (bot.food <= FOOD_FLOOR) throw new Error(`eastMeatRun: FOOD FLOOR at corridor wp ${i}`)
      console.log(`[VEGA] eastMeatRun: wp ${i} (${wx},${wz}) cycle ${cycle} stalled at ${bot.entity.position} - digFaceToward`)
      await helpers.digFaceToward(bot, wx + 0.5, wz + 0.5).catch(() => {})
      await helpers.sleep(bot, 500)
    }
    if (!arrived && dist2d(bot, wx + 0.5, wz + 0.5) > 1.1) {
      const dNow = dist2d(bot, wx + 0.5, wz + 0.5)
      if (dStart - dNow < 0.5) throw new Error(`eastMeatRun: corridor stalled at waypoint ${i} (${wx},${wz}) - no progress after dig-face cycles, aborting (no grind)`)
      console.log(`[VEGA] eastMeatRun: wp ${i} partial progress ${dStart.toFixed(1)} -> ${dNow.toFixed(1)}, continuing`)
    }
    await eatIfUseful()
    if (bot.food <= FOOD_FLOOR) throw new Error(`eastMeatRun: FOOD FLOOR after corridor wp ${i}`)
  }

  // ---- hunt -------------------------------------------------------------
  const PREY = ['pig', 'cow']
  for (let round = 0; round < 6; round++) {
    check('hunt')
    if (bot.food >= 18) break
    await eatIfUseful()
    if (bot.food >= 18) break
    if (bot.food <= FOOD_FLOOR && foodCount(bot) === 0) throw new Error('eastMeatRun: FOOD FLOOR in hunt with no food in hand')
    const prey = Object.values(bot.entities)
      .filter(e => e !== bot.entity && PREY.includes(e.name) && e.position && e.position.distanceTo(bot.entity.position) < 42)
      .sort((a, b) => a.position.distanceTo(bot.entity.position) - b.position.distanceTo(bot.entity.position))[0]
    if (!prey) {
      if (dist2d(bot, HERD.x + 0.5, HERD.z + 0.5) > 6) {
        await gotoOnce(HERD.x + 0.5, HERD.z + 0.5, 1.2, 12000)
        continue
      }
      throw new Error(`eastMeatRun: no prey within 42 of herd ground (food ${bot.food}, in-hand ${foodCount(bot)})`)
    }
    console.log(`[VEGA] eastMeatRun: hunting ${prey.name} at ${prey.position}`)
    let killed = false
    for (let attempt = 0; attempt < 24 && !killed; attempt++) {
      check('hunt chase')
      if (!prey.isValid) { killed = true; break }
      const d = prey.position.distanceTo(bot.entity.position)
      if (d > 2.6) {
        await gotoOnce(prey.position.x, prey.position.z, 1.4, 7000)
      } else {
        await bot.lookAt(prey.position.offset(0, 0.9, 0))
        bot.attack(prey)
        await helpers.sleep(bot, 550)
      }
      await eatIfUseful()
    }
    if (killed || !prey.isValid) {
      LAST.kills++
      await helpers.sleep(bot, 900)
      await eatIfUseful()
      console.log(`[VEGA] eastMeatRun: kill ${LAST.kills} done - food ${bot.food}, in-hand ${foodCount(bot)}`)
    }
  }

  await eatIfUseful()
  if (bot.food < 18) throw new Error(`eastMeatRun: hunt ended at food ${bot.food} (<18) with ${foodCount(bot)} food in hand, ${LAST.kills} kills`)

  // ---- regen ------------------------------------------------------------
  console.log(`[VEGA] eastMeatRun: food ${bot.food} >= 18 - holding for regen from hp ${bot.health}`)
  const h0 = bot.health
  while (Date.now() - t0 < DEADLINE_MS - 5000) {
    check('regen hold')
    if (bot.health >= 10) break
    if (bot.food < 18) await eatIfUseful()
    await helpers.sleep(bot, 4000)
    console.log(`[VEGA] eastMeatRun: regen sample hp ${bot.health} food ${bot.food}`)
  }
  if (bot.health < 10) throw new Error(`eastMeatRun: regen incomplete - hp ${h0} -> ${bot.health}, food ${bot.food}`)
  console.log(`[VEGA] eastMeatRun: SUCCESS food ${bot.food} hp ${bot.health} kills ${LAST.kills} eaten ${LAST.foodsEaten}`)
}

module.exports.post = async (bot, helpers, ctx) => {
  const ok = bot.food >= 18 && bot.health >= 10 && LAST.foodsEaten >= 1
  return {
    ok,
    evidence: {
      food: bot.food, health: bot.health, kills: LAST.kills, foodsEaten: LAST.foodsEaten,
      position: { x: +bot.entity.position.x.toFixed(1), y: +bot.entity.position.y.toFixed(1), z: +bot.entity.position.z.toFixed(1) },
      bar: 'food>=18, hp>=10, eaten>=1'
    }
  }
}
