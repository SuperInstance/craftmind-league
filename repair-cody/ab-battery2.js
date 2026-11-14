"use strict";
// A/B BATTERY v2 — RAW east 4s -> prims.gotoNear 20E -> DIRECT pathfinder goto same target.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const PULSE = "/home/caseydigennaro/craftmind-league/pulse";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const { goals, Movements } = pf;
const mcData = require(NM + "/minecraft-data");
const prims = require(PULSE + "/lib/prims.js");
const USER = process.env.AB_USER;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(3) + "," + p.y.toFixed(3) + "," + p.z.toFixed(3);
let phase = "pre";
const pkt = {};
bot._client.on("packet", (data, meta) => { if (meta && meta.name === "position") pkt[phase] = (pkt[phase] || 0) + 1; });
bot.once("spawn", async () => {
  try {
    console.log("[AB2]", USER, "spawn pos", fmt(bot.entity.position), "onGround", bot.entity.onGround);
    phase = "idle";
    await sleep(3000);
    const S = bot.entity.position.clone();
    console.log("[AB2]", USER, "BATTERY START", fmt(S), "onGround", bot.entity.onGround, "idlePosPkts", pkt.idle || 0);
    phase = "raw";
    await bot.lookAt(S.offset(6, 0, 0), true);
    await sleep(120);
    bot.setControlState("jump", true);
    bot.setControlState("forward", true);
    await sleep(4000);
    bot.setControlState("forward", false);
    bot.setControlState("jump", false);
    const E1 = bot.entity.position.clone();
    console.log("[AB2]", USER, "RAW east fwd+jump 4s: end", fmt(E1), "disp3d", S.distanceTo(E1).toFixed(3), "dx", (E1.x - S.x).toFixed(3), "rawPosPkts", pkt.raw || 0);
    await sleep(400);
    phase = "goto";
    const t1 = Date.now();
    const r2 = await prims.gotoNear(bot, S.x + 20, S.y, S.z, 1.5, 60000);
    const E2 = bot.entity.position.clone();
    console.log("[AB2]", USER, "GOTO prims.gotoNear target", (S.x + 20).toFixed(1) + "," + S.y.toFixed(1) + "," + S.z.toFixed(1), "result", JSON.stringify(r2), "ms", Date.now() - t1, "end", fmt(E2), "dispFromRawEnd", E1.distanceTo(E2).toFixed(3), "gotoPosPkts", pkt.goto || 0);
    try { bot.pathfinder.setGoal(null); } catch {}
    try { bot.clearControlStates(); } catch {}
    await sleep(600);
    phase = "pfdirect";
    const mv = new Movements(bot, mcData(bot.version));
    mv.canDig = false;
    bot.pathfinder.setMovements(mv);
    const t2 = Date.now();
    let pfRes = "pending";
    try {
      await Promise.race([
        bot.pathfinder.goto(new goals.GoalNear(S.x + 20, S.y, S.z, 1.5)).then(() => { pfRes = "RESOLVED"; }),
        sleep(60000).then(() => { pfRes = "TIMEOUT60s"; }),
      ]);
    } catch (e) { pfRes = "ERROR: " + e.message; }
    try { bot.pathfinder.setGoal(null); } catch {}
    const E3 = bot.entity.position.clone();
    console.log("[AB2]", USER, "PFDIRECT pathfinder goto same target:", pfRes, "ms", Date.now() - t2, "end", fmt(E3), "dispFromGotoEnd", E2.distanceTo(E3).toFixed(3), "dxFromStart", (E3.x - S.x).toFixed(3), "pfPosPkts", pkt.pfdirect || 0);
    console.log("[AB2]", USER, "DONE");
  } catch (e) { console.log("[AB2]", USER, "EXCEPTION", (e && e.stack) || e); }
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("[AB2] error", e.message));
bot.on("kicked", (r) => console.log("[AB2] kicked", String(r)));
setTimeout(() => { console.log("[AB2] TIMEOUT"); process.exit(1); }, 300000);
