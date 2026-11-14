"use strict";
// DECISIVE A/B BATTERY — identical for every login.
// settle+idle packets -> RAW east fwd+jump 4s -> prims.gotoNear 20 east of battery start.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const PULSE = "/home/caseydigennaro/craftmind-league/pulse";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const prims = require(PULSE + "/lib/prims.js");
const USER = process.env.AB_USER;
const APPROACH = process.env.AB_APPROACH === "1";
const CX = parseFloat(process.env.AB_CX || "0"), CY = parseFloat(process.env.AB_CY || "0"), CZ = parseFloat(process.env.AB_CZ || "0");
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(3) + "," + p.y.toFixed(3) + "," + p.z.toFixed(3);
let phase = "pre";
const pkt = {}; const samples = [];
bot._client.on("packet", (data, meta) => {
  if (meta && meta.name === "position") {
    pkt[phase] = (pkt[phase] || 0) + 1;
    if (samples.length < 12) samples.push({ phase, x: +data.x.toFixed(3), y: +data.y.toFixed(3), z: +data.z.toFixed(3), teleportId: data.teleportId !== undefined ? data.teleportId : data.id });
  }
});
bot.once("spawn", async () => {
  try {
    console.log("[AB]", USER, "spawn pos", fmt(bot.entity.position), "onGround", bot.entity.onGround, "vehicle", String(bot.entity.vehicle));
    phase = "idle";
    await sleep(3000);
    console.log("[AB]", USER, "settled pos", fmt(bot.entity.position), "onGround", bot.entity.onGround, "idlePosPkts", pkt.idle || 0);
    if (APPROACH) {
      phase = "approach";
      const t0 = Date.now();
      const r = await prims.gotoNear(bot, CX, CY, CZ, 2.0, 60000);
      console.log("[AB]", USER, "approach gotoNear cell", CX + "," + CY + "," + CZ, "result", JSON.stringify(r), "ms", Date.now() - t0, "pos", fmt(bot.entity.position), "onGround", bot.entity.onGround, "approachPosPkts", pkt.approach || 0);
    }
    const S = bot.entity.position.clone();
    console.log("[AB]", USER, "BATTERY START", fmt(S), "onGround", bot.entity.onGround);
    phase = "raw";
    await bot.lookAt(S.offset(6, 0, 0), true);
    await sleep(120);
    bot.setControlState("jump", true);
    bot.setControlState("forward", true);
    await sleep(4000);
    bot.setControlState("forward", false);
    bot.setControlState("jump", false);
    const E1 = bot.entity.position.clone();
    console.log("[AB]", USER, "RAW east fwd+jump 4s: end", fmt(E1), "disp3d", S.distanceTo(E1).toFixed(3), "dx", (E1.x - S.x).toFixed(3), "rawPosPkts", pkt.raw || 0);
    await sleep(400);
    phase = "goto";
    const t1 = Date.now();
    const r2 = await prims.gotoNear(bot, S.x + 20, S.y, S.z, 1.5, 60000);
    const E2 = bot.entity.position.clone();
    console.log("[AB]", USER, "GOTO gotoNear target", (S.x + 20).toFixed(1) + "," + S.y.toFixed(1) + "," + S.z.toFixed(1), "result", JSON.stringify(r2), "ms", Date.now() - t1, "end", fmt(E2), "dispFromStart", S.distanceTo(E2).toFixed(3), "dxFromStart", (E2.x - S.x).toFixed(3), "gotoPosPkts", pkt.goto || 0);
    console.log("[AB]", USER, "position packet samples", JSON.stringify(samples));
    console.log("[AB]", USER, "DONE");
  } catch (e) { console.log("[AB]", USER, "EXCEPTION", (e && e.stack) || e); }
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("[AB] error", e.message));
bot.on("kicked", (r) => console.log("[AB] kicked", String(r)));
setTimeout(() => { console.log("[AB] TIMEOUT"); process.exit(1); }, 300000);
