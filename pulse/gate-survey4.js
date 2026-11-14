"use strict";
// GATE SURVEY 4 — operator probe (not a citizen, not curriculum).
// Route-side survey for Gate 0 re-run 7, after four helm generations
// (v3.3-v3.6) pinned at the x53.69 stand / x54 face pair on the
// z=-84 line (ledger route-z84-traverse-verify-4). This probe NEVER
// MOVES: it sits at spawn and reads column profiles via blockAt over
// a wide box (x 44..78, z -96..-72), then scores candidate corridors
// — straight rows and two-segment bent paths — against selection
// criteria stated BEFORE any traverse (also in the ledger):
//   H1 no unloaded (null) ground top in the walked span;
//   H2 no trunk-obstructed column in the walked span;
//   H3 max up-step <= 1 in BOTH travel directions;
//   H4 +1 climb faces isolated: consecutive faces >= 4 columns
//      apart (the x52->54 pair, faces 2 apart, is the known killer);
//   H5 every climb has >= 2 flat columns of run-up at stand height
//      immediately before its face;
//   H6 no leaf-litter cap on any climb-face column (litter sitting
//      at groundTop+1 on the column being climbed onto).
// Soft metrics: litter-on-surface count in span, landing-shelf
// violations (a climb immediately followed by a drop), climb count.
// "Ground top" = highest boundingBox block that is not leaves and
// not a log (a standing trunk is an obstruction, not a surface).
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3").Vec3;
const USER = process.env.SURVEY_USER;
if (!USER) { console.error("SURVEY_USER required"); process.exit(2); }
const OUT_PATH = "/home/caseydigennaro/craftmind-league/pulse/survey4-result-" + USER + ".json";
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(2) + "," + p.y.toFixed(2) + "," + p.z.toFixed(2);

const X0 = 44, X1 = 78, Z0 = -96, Z1 = -72;

function column(x, z) {
  let groundTop = null, groundName = null, anyTop = null, anyTopName = null, litterY = null;
  let bodyBlock = null; // solid non-litter block at groundTop+1 (found after ground level known — second pass below)
  for (let y = 95; y > 45; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (!b) continue;
    if (b.name === "leaf_litter" && litterY === null) litterY = y;
    if (b.boundingBox === "block" && !/_leaves$/.test(b.name)) {
      if (anyTop === null) { anyTop = y; anyTopName = b.name; }
      if (groundTop === null && !/_(log|wood)$/.test(b.name)) { groundTop = y; groundName = b.name; }
    }
    if (groundTop !== null && anyTop !== null && y < groundTop - 2) break;
  }
  let trunk = false;
  if (anyTop !== null && groundTop !== null && /_(log|wood)$/.test(anyTopName) && anyTop > groundTop) trunk = true;
  let head1 = null, head2 = null;
  if (groundTop !== null) {
    const b1 = bot.blockAt(new Vec3(x, groundTop + 1, z));
    const b2 = bot.blockAt(new Vec3(x, groundTop + 2, z));
    if (b1 && b1.boundingBox === "block" && b1.name !== "leaf_litter") head1 = b1.name;
    if (b2 && b2.boundingBox === "block") head2 = b2.name;
  }
  return { top: groundTop, name: groundName, anyTop, anyTopName, litterY, trunk, head1, head2 };
}

// Directional analysis over a path (array of {x, z, col}) in travel order.
// Returns climbs (path indices of the HIGHER column of each +1), maxUp,
// and criterion checks H3-H6 (H1/H2 checked by caller over the path).
function analysePath(path) {
  const tops = path.map((c) => c.col.top);
  let maxUp = -99;
  const climbs = []; // {i (index of higher col), faceKey}
  for (let i = 1; i < tops.length; i++) {
    const d = tops[i] - tops[i - 1];
    if (d > maxUp) maxUp = d;
    if (d === 1) climbs.push(i);
  }
  // H4 isolation: face positions along path >= 4 apart
  let isoOk = true;
  for (let k = 1; k < climbs.length; k++) if (climbs[k] - climbs[k - 1] < 4) isoOk = false;
  // H5 run-up: two columns before the face at stand height (top-1)
  let runupOk = true; const runupBad = [];
  for (const i of climbs) {
    if (i < 2 || tops[i - 1] !== tops[i] - 1 || tops[i - 2] !== tops[i] - 1) { runupOk = false; runupBad.push(path[i].x + "," + path[i].z); }
  }
  // H6 litter cap on face column: litterY == top+1 at the higher column
  let litterOk = true; const litterBad = [];
  for (const i of climbs) {
    const c = path[i].col;
    if (c.litterY !== null && c.litterY === c.top + 1) { litterOk = false; litterBad.push(path[i].x + "," + path[i].z); }
  }
  // soft: landing shelf violations (climb immediately followed by a drop)
  let shelfBad = 0;
  for (const i of climbs) if (i + 1 < tops.length && tops[i + 1] < tops[i]) shelfBad++;
  const litterCols = path.filter((c) => c.col.litterY !== null && c.col.litterY === c.col.top + 1).length;
  return { maxUp, climbs: climbs.map((i) => path[i].x + "," + path[i].z), isoOk, runupOk, runupBad, litterOk, litterBad, shelfBad, litterCols };
}

function checkPath(path) {
  // H1 nulls, H2 trunks over the path cells
  const nulls = path.filter((c) => c.col.top === null).map((c) => c.x + "," + c.z);
  const trunks = path.filter((c) => c.col.trunk).map((c) => c.x + "," + c.z + "(" + c.col.anyTopName + "@" + c.col.anyTop + " over " + c.col.top + ")");
  const heads = path.filter((c) => c.col.head1).map((c) => c.x + "," + c.z + ":" + c.col.head1);
  const e = analysePath(path);
  const w = analysePath(path.slice().reverse());
  const ok = nulls.length === 0 && trunks.length === 0 &&
    e.maxUp <= 1 && w.maxUp <= 1 && e.isoOk && w.isoOk && e.runupOk && w.runupOk && e.litterOk && w.litterOk;
  return { ok, nulls, trunks, heads, east: e, west: w };
}

bot.once("spawn", async () => {
  try {
    console.log("[SURVEY4]", USER, "spawn", fmt(bot.entity.position), "health", bot.health);
    // wait for chunks: centre of the box must read non-null
    for (let i = 0; i < 20; i++) {
      const probe = bot.blockAt(new Vec3(60, 67, -84));
      if (probe) break;
      await sleep(1500);
    }
    await sleep(2000);
    console.log("[SURVEY4] settled", fmt(bot.entity.position), "onGround", bot.entity.onGround, "health", bot.health);

    const grid = {}; // grid[z][x] = column
    for (let z = Z0; z <= Z1; z++) {
      grid[z] = {};
      for (let x = X0; x <= X1; x++) grid[z][x] = column(x, z);
    }
    const out = { user: USER, ts: new Date().toISOString(), box: { x0: X0, x1: X1, z0: Z0, z1: Z1 }, rows: {}, straight: [], bent: [] };
    for (let z = Z0; z <= Z1; z++) {
      const tops = [], lits = [], trunks = [];
      for (let x = X0; x <= X1; x++) {
        const c = grid[z][x];
        tops.push(c.top);
        if (c.litterY !== null && c.top !== null && c.litterY === c.top + 1) lits.push(x);
        if (c.trunk) trunks.push(x + "(" + c.anyTopName + "@" + c.anyTop + ")");
      }
      out.rows[z] = { tops, litterOnSurface: lits, trunks };
      console.log("[SURVEY4] ROW z=" + z, "tops(x" + X0 + ".." + X1 + "):", tops.map((t) => (t === null ? "?" : t)).join(","), "| litter:", lits.join(",") || "none", "| trunks:", trunks.join(",") || "none");
    }

    const cell = (x, z) => ({ x, z, col: grid[z][x] });
    // ── straight rows, span x49..69 ──
    for (let z = Z0; z <= Z1; z++) {
      const path = [];
      for (let x = 49; x <= 69; x++) path.push(cell(x, z));
      const chk = checkPath(path);
      const rec = { kind: "straight", z, startTop: grid[z][49].top, endTop: grid[z][69].top, ...chk };
      out.straight.push(rec);
      console.log("[SURVEY4] STRAIGHT z=" + z, "ok=" + chk.ok, "maxUpE=" + chk.east.maxUp, "maxUpW=" + chk.west.maxUp, "climbsE=" + JSON.stringify(chk.east.climbs), "climbsW=" + JSON.stringify(chk.west.climbs), "nulls=" + chk.nulls.length, "trunks=" + JSON.stringify(chk.trunks), "isoE=" + chk.east.isoOk, "isoW=" + chk.west.isoOk, "runupBadE=" + JSON.stringify(chk.east.runupBad), "runupBadW=" + JSON.stringify(chk.west.runupBad), "litterBadE=" + JSON.stringify(chk.east.litterBad), "litterBadW=" + JSON.stringify(chk.west.litterBad), "litterCols=" + chk.east.litterCols, "shelfBad=" + (chk.east.shelfBad + chk.west.shelfBad));
    }
    // ── bent paths: east on zA to xs, shift rows to zB, east to 69 ──
    for (let zA = Z0; zA <= Z1; zA++) for (let zB = Z0; zB <= Z1; zB++) {
      if (zA === zB || Math.abs(zA - zB) > 5) continue;
      for (let xs = 54; xs <= 64; xs++) {
        const path = [];
        for (let x = 49; x <= xs; x++) path.push(cell(x, zA));
        const dz = zB > zA ? 1 : -1;
        for (let z = zA + dz; dz > 0 ? z <= zB : z >= zB; z += dz) path.push(cell(xs, z));
        for (let x = xs + 1; x <= 69; x++) path.push(cell(x, zB));
        const chk = checkPath(path);
        if (chk.ok) {
          const rec = { kind: "bent", zA, zB, xs, startTop: grid[zA][49].top, endTop: grid[zB][69].top, ...chk };
          out.bent.push(rec);
          console.log("[SURVEY4] BENT ok zA=" + zA, "zB=" + zB, "xs=" + xs, "climbsE=" + JSON.stringify(chk.east.climbs), "climbsW=" + JSON.stringify(chk.west.climbs), "litterCols=" + chk.east.litterCols, "shelfBad=" + (chk.east.shelfBad + chk.west.shelfBad));
        }
      }
    }
    console.log("[SURVEY4] bent qualifying:", out.bent.length, "straight qualifying:", out.straight.filter((s) => s.ok).length);
    out.healthEnd = bot.health;
    out.deaths = 0;
    fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1));
    console.log("[SURVEY4] DONE ->", OUT_PATH);
  } catch (e) { console.log("[SURVEY4] EXCEPTION", (e && e.stack) || e); }
  bot.quit();
  process.exit(0);
});
bot.on("death", () => console.log("[SURVEY4] DEATH at", fmt(bot.entity.position)));
bot.on("error", (e) => console.log("[SURVEY4] error", e.message));
bot.on("kicked", (r) => console.log("[SURVEY4] kicked", String(r)));
setTimeout(() => { console.log("[SURVEY4] TIMEOUT"); process.exit(1); }, 420000);
