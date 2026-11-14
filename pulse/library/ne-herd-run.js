// ne-herd-run — OPERATOR SKILL (charter §1.5, league relaunch resume 2026-11-09).
// Pulse skill form: module.exports = { meta, run(ctx) }, ctx = {bot, prims, Vec3, goals, anchor, stage, log}.
// Route discipline (measured v8, triple-020/FLATTEN): per-cell committed hops over the
// SURVEYED centreline (run-line profiles filed in the gate verification), a hop consumed
// at <=2.2 blocks, progress = DISPLACEMENT (goto ok flags are not evidence), walk pace
// only (sprint never set), dig-step movement mode NEVER armed (setDigStep untouched).
// Charter waypoints: WP0 park -> WP1 midground (88,-112) -> WP2 chicken ground (104,-122)
// -> herd edge (109,-127)/(110,-128) -> hunt -> eat-on-drop to food>=18 -> stand-regen
// to hp>=10 -> return reverse line -> success park at the anchor (64,-93), food>=14/hp>=10.
// Aborts (charter §1.5): food<=6 at any waypoint evaluation; any damage event while
// hp<=2 (pre-regen: any damage is an emergency stop); 60 s no-displacement pin;
// no cow within 24 blocks at WP2 (NO-GO return); herd not reached in deadline.
// After success park the SAME run() invocation returns; the runner re-invokes and the
// done() check parks him at the anchor (idempotent ensure).

const meta = { name: 'ne-herd-run', stage: 'S1', summary: 'Charter §1 NE food run: graded legs to the cow herd, sword craft, eat-on-drop, regen, return to anchor' };

// Centreline cells (x, z, floorY) — from gate_verify_resume.py run-line measurement.
const LINE_OUT = [
  [72, -102, 62], [73, -103, 63], [74, -103, 63], [75, -104, 63], [76, -104, 64],
  [77, -105, 64], [78, -106, 64], [79, -107, 65], [80, -107, 65], [81, -108, 66],
  [82, -109, 66], [83, -109, 66], [84, -110, 67], [85, -110, 67], [86, -111, 67],
  [87, -111, 68], [88, -112, 68],
  [89, -113, 69], [90, -113, 69], [91, -114, 69], [92, -114, 69], [93, -115, 70],
  [94, -116, 70], [95, -116, 70], [96, -117, 70], [97, -118, 70], [98, -118, 70],
  [99, -119, 70], [100, -119, 70], [101, -120, 70], [102, -121, 70], [103, -121, 70],
  [104, -122, 70],
  [105, -123, 70], [106, -124, 69], [107, -125, 69], [108, -126, 69], [109, -127, 69],
  [110, -128, 69],
];
const WP1 = { x: 88, z: -112 };            // index 16 in LINE_OUT
const WP2 = { x: 104, z: -122 };           // index 33
const HERD_EDGE = { x: 110, z: -128 };     // index 39 (end)
const ANCHOR = { x: 64, y: 67, z: -93 };
const LINE_HOME = [ // anchor <- park, from route_survey.json cody-park-to-anchor centreline
  [72, -102], [71, -101], [71, -100], [70, -100], [69, -99], [69, -98], [68, -97],
  [67, -96], [66, -95], [66, -94], [65, -94], [64, -93],
];
const EDIBLES = ['beef', 'porkchop', 'mutton', 'chicken', 'rabbit', 'cooked_beef', 'cooked_porkchop',
  'cooked_mutton', 'cooked_chicken', 'cooked_rabbit', 'apple', 'bread', 'carrot', 'baked_potato', 'potato'];
const DEADLINE_MS = 1500000; // 25 min overall; per-phase caps inside

function run(ctx) {
  return (async () => {
    const bot = ctx.bot, prims = ctx.prims, Vec3 = ctx.Vec3;
    const log = (...a) => console.log('[NE-HERD]', ...a);
    const t0 = Date.now();
    const pos = () => bot.entity.position;
    const distTo = (x, z) => Math.hypot(pos().x - (x + 0.5), pos().z - (z + 0.5));
    const invCount = (n) => prims.countItem(bot, n);
    const foodItems = () => bot.inventory.items().filter((i) => EDIBLES.includes(i.name));
    const beefCount = () => invCount('beef');
    let lastHp = bot.health;
    let lastFood = bot.food;
    let damageEvents = 0;
    let kills = 0;

    function base() {
      return { hp: bot.health, food: bot.food, pos: { x: +pos().x.toFixed(1), y: +pos().y.toFixed(1), z: +pos().z.toFixed(1) }, kills, damageEvents };
    }
    function abort(reason, fault) {
      log('ABORT:', reason);
      try { bot.pathfinder.setGoal(null); } catch {}
      try { bot.clearControlStates(); } catch {}
      const r = base(); r.ok = false; r.abort = reason; r.fault_owner = fault || 'world';
      return r;
    }
    // Damage watch: call in every loop. Returns an abort object or null.
    function damageCheck(phase) {
      if (bot.health < lastHp - 0.01) {
        damageEvents++;
        const dropped = lastHp - bot.health;
        log('DAMAGE EVENT in', phase, ':', lastHp.toFixed(2), '->', bot.health.toFixed(2));
        lastHp = bot.health;
        if (bot.health > 0 && bot.health <= 2.01) return abort('damage event at hp ' + bot.health.toFixed(2) + ' during ' + phase + ' — charter §1.5: stop, hold, reassess', 'world');
      }
      lastHp = bot.health;
      return null;
    }
    function foodFloorCheck(where) {
      if (bot.food <= 6) return abort('food floor: food ' + bot.food + ' <= 6 at ' + where + ' — charter §1.5 park', 'agent');
      return null;
    }

    async function eatOne() {
      const items = foodItems();
      // cows before chicken (charter): deprioritise raw chicken
      const pick = items.find((i) => i.name !== 'chicken') || items[0];
      if (!pick) return false;
      try {
        await bot.equip(pick, 'hand');
        await Promise.race([bot.consume(), prims.sleep(6000)]);
        log('ate', pick.name, '-> food', bot.food);
        return true;
      } catch (e) { log('eat failed:', e.message); return false; }
    }
    async function eatTo(target) {
      for (let i = 0; i < 8 && bot.food < target; i++) { if (!(await eatOne())) break; }
    }

    // Committed per-cell hop chain over `cells` ([x,z,floorY?]); returns null on
    // completion or an abort object. Progress measured as displacement per charter.
    async function hopChain(cells, label, floorWatch) {
      log(label, ': chain of', cells.length, 'cells engaged from', pos().x.toFixed(1), pos().z.toFixed(1));
      let idx = 0;
      let lastProgAt = Date.now();
      let lastProgPos = { x: pos().x, z: pos().z };
      const chainDeadline = Date.now() + 480000;
      while (idx < cells.length) {
        if (Date.now() > chainDeadline) return abort(label + ': chain deadline at cell ' + idx, 'world');
        if (Date.now() > t0 + DEADLINE_MS) return abort(label + ': overall deadline', 'world');
        const dc = damageCheck(label); if (dc) return dc;
        // skip cells already consumed (within 2.2 of centre)
        while (idx < cells.length && distTo(cells[idx][0], cells[idx][1]) <= 2.2) idx++;
        if (idx >= cells.length) break;
        const cell = cells[idx];
        const feetY = cell[2] != null ? cell[2] + 1 : Math.floor(pos().y);
        const dBefore = distTo(cell[0], cell[1]);
        await prims.gotoNear(bot, cell[0] + 0.5, feetY, cell[1] + 0.5, 0.6, 9000).catch(() => {});
        const dAfter = distTo(cell[0], cell[1]);
        const disp = Math.hypot(pos().x - lastProgPos.x, pos().z - lastProgPos.z);
        if (disp >= 1.0) { lastProgAt = Date.now(); lastProgPos = { x: pos().x, z: pos().z }; }
        if (Date.now() - lastProgAt > 60000) return abort(label + ': 60s no-displacement pin at cell ' + idx + ' (' + cell[0] + ',' + cell[1] + ')', 'world');
        if (dAfter <= 2.2) { idx++; continue; }
        if (floorWatch) { const fc = foodFloorCheck(label + ' cell ' + idx); if (fc) return fc; }
        log(label, 'hop', idx, '->', cell[0], cell[1], 'dist', dBefore.toFixed(1), '->', dAfter.toFixed(1), 'pos', pos().x.toFixed(1), pos().z.toFixed(1));
      }
      log(label, ': chain complete at', pos().x.toFixed(1), pos().z.toFixed(1));
      return null;
    }

    // ── done check (idempotent park) ──────────────────────────────────────
    const dAnchor = Math.hypot(pos().x - ANCHOR.x, pos().z - ANCHOR.z);
    if (dAnchor <= 4.5 && bot.food >= 14 && bot.health >= 10) {
      return { ok: true, done: true, ...base(), note: 'success park already holds' };
    }
    log('run start', JSON.stringify(base()), 'inv', JSON.stringify(prims.inv(bot)));

    // ── WP0 -> WP1 (graded leg 1) ─────────────────────────────────────────
    let r = await hopChain(LINE_OUT.slice(0, 17), 'LEG1', true); if (r) return r;
    log('WP1 midground reached; food', bot.food, 'hp', bot.health);
    r = foodFloorCheck('WP1'); if (r) return r;
    if (bot.food < 8) log('WP1 food', bot.food, '(expect >=8; continuing — floor is 6)');

    // ── WP1 -> WP2 (leg 2) ────────────────────────────────────────────────
    r = await hopChain(LINE_OUT.slice(16, 34), 'LEG2', true); if (r) return r;
    log('WP2 chicken ground reached; food', bot.food);
    r = foodFloorCheck('WP2'); if (r) return r;

    // ── WP2 entity re-acquisition ─────────────────────────────────────────
    const cowsNear = () => Object.values(bot.entities || {}).filter((e) => e && e.position && e.name === 'cow' &&
      e.position.distanceTo(pos()) <= 24);
    if (!cowsNear().length) {
      // NO-GO per charter: return on legs 2-1 (reverse), park at WP0 area.
      log('WP2 NO-GO: no cow within 24 blocks — returning per charter');
      r = await hopChain(LINE_OUT.slice(0, 34).reverse(), 'RETURN-NOGO', true); if (r) return r;
      const rr = base(); rr.ok = false; rr.abort = 'WP2 no-cow NO-GO; returned to park'; rr.fault_owner = 'world';
      return rr;
    }

    // ── WP2 -> herd edge (leg 3, waypoint rule) ───────────────────────────
    r = await hopChain(LINE_OUT.slice(33), 'LEG3', true); if (r) return r;
    log('herd edge reached', pos().x.toFixed(1), pos().z.toFixed(1));

    // ── sword craft at his carried table ──────────────────────────────────
    // (Fallback if no table item: craft planks->table from birch logs; else fists.)
    if (!prims.hasItem(bot, 'wooden_sword')) {
      let tablePos = null;
      if (prims.hasItem(bot, 'crafting_table')) {
        const bx = Math.floor(pos().x), bz = Math.floor(pos().z);
        const placed = await prims.placeOnTop(bot, 'crafting_table', new Vec3(bx, Math.floor(pos().y) - 1, bz)).catch((e) => ({ ok: false, error: e.message }));
        log('table place:', JSON.stringify(placed).slice(0, 160));
        if (placed && placed.ok) tablePos = new Vec3(placed.at.x, placed.at.y, placed.at.z);
        else {
          const near = prims.findBlocks(bot, ['crafting_table'], 6, 1);
          if (near && near.length) tablePos = near[0];
        }
      }
      if (tablePos) {
        const cr = await prims.craftByName(bot, 'wooden_sword', 1, tablePos).catch((e) => ({ ok: false, error: e.message }));
        log('sword craft:', JSON.stringify(cr).slice(0, 160));
      } else {
        log('no table placed/found — hunting unarmed (cows do not fight back)');
      }
    }
    if (prims.hasItem(bot, 'wooden_sword')) { try { await bot.equip(await bot.inventory.items().find((i) => i.name === 'wooden_sword'), 'hand'); } catch {} }

    // ── hunt: cows first, chicken last; eat on each drop ──────────────────
    const huntDeadline = Date.now() + 600000;
    while (bot.food < 18 && Date.now() < huntDeadline) {
      const dc = damageCheck('hunt'); if (dc) return dc;
      await eatTo(18);
      if (bot.food >= 18) break;
      const prey = Object.values(bot.entities || {})
        .filter((e) => e && e.position && (e.name === 'cow' || e.name === 'chicken') && e.position.distanceTo(pos()) <= 26)
        .sort((a, b) => ((a.name === 'chicken') - (b.name === 'chicken')) || (a.position.distanceTo(pos()) - b.position.distanceTo(pos())))[0];
      if (!prey) return abort('herd ground: no prey within 26 blocks at food ' + bot.food, 'world');
      log('hunting', prey.name, 'at dist', prey.position.distanceTo(pos()).toFixed(1));
      const e = prey;
      const tHunt = Date.now();
      let wasValid = true;
      while (Date.now() - tHunt < 45000 && e && e.isValid && e.position) {
        const dc2 = damageCheck('hunt-chase'); if (dc2) return dc2;
        const d = e.position.distanceTo(pos());
        if (d > 2.1) { await prims.gotoNear(bot, e.position.x, e.position.y, e.position.z, 1.4, 5000).catch(() => {}); }
        else {
          try { await bot.lookAt(e.position.offset(0, 0.6, 0), true); } catch {}
          try { bot.attack(e); } catch {}
          await prims.sleep(550);
        }
      }
      if (e && !e.isValid) { kills++; log('kill', kills, '—', prey.name); }
      await prims.collectDrops(bot, 7, 6000).catch(() => {});
      await eatTo(18);
      log('after drop: food', bot.food, 'beef held', beefCount());
    }
    if (bot.food < 18) return abort('hunt ended below food 18 (food ' + bot.food + ', kills ' + kills + ')', 'world');

    // ── stand-and-regen to hp >= 10 on herd ground ────────────────────────
    log('food >=18 — standing to regen from hp', bot.health);
    const tRegen = Date.now();
    while (bot.health < 10 && Date.now() - tRegen < 600000) {
      const dc = damageCheck('regen'); if (dc) return dc;
      if (bot.food < 18) { await eatTo(19); if (bot.food < 18) return abort('regen: food fell below 18 with no food in hand', 'world'); }
      await prims.sleep(5000);
    }
    if (bot.health < 10) return abort('regen incomplete: hp ' + bot.health.toFixed(2) + ' after 10 min at food>=18', 'world');
    log('regen complete: hp', bot.health, 'food', bot.food);

    // ── return: herd -> WP2 -> WP1 -> park -> anchor ──────────────────────
    r = await hopChain(LINE_OUT.slice().reverse(), 'RETURN', false); if (r) return r;
    r = await hopChain(LINE_HOME.slice().reverse(), 'HOME', false); if (r) return r;
    const fin = base();
    fin.ok = fin.food >= 14 && fin.hp >= 10;
    fin.note = fin.ok ? 'SUCCESS PARK at anchor' : 'reached anchor below success targets';
    if (!fin.ok) fin.fault_owner = 'world';
    log('run end', JSON.stringify(fin));
    return fin;
  })();
}

module.exports = { meta, run };
