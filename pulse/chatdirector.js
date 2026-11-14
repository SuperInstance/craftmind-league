"use strict";
// CHAT DIRECTOR — operator probe. Tests whether the framework
// resident (Cody, vanilla Craftmind stack) answers chat direction —
// the one movement stack that has verifiably travelled cross-country
// tonight is Cody's own framework. The probe takes the high shelf NE
// of Cody's pit (stand ~69, z=-93 row) as a follow target and issues
// plain social commands in chat, logging everything Cody says back.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const PULSE = "/home/caseydigennaro/craftmind-league/pulse";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const prims = require(PULSE + "/lib/prims.js");
const Vec3 = require(NM + "/vec3").Vec3;
const USER = process.env.DIRECTOR_USER;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(2) + "," + p.y.toFixed(2) + "," + p.z.toFixed(2);
const t0 = Date.now();
const stamp = () => ((Date.now() - t0) / 1000).toFixed(0) + "s";
bot.on("chat", (user, msg) => { console.log("[DIRECTOR]", stamp(), "CHAT", user + ":", msg); });

bot.once("spawn", async () => {
  try {
    console.log("[DIRECTOR]", USER, "spawn", fmt(bot.entity.position));
    await sleep(3000);
    for (const [lx, ly, lz] of [[36, 69, -93.5], [41, 69, -92.5]]) {
      const r = await prims.gotoNear(bot, lx, ly, lz, 1.6, 45000);
      console.log("[DIRECTOR] leg", lx, lz, JSON.stringify(r), "at", fmt(bot.entity.position));
      if (!r.ok) break;
    }
    console.log("[DIRECTOR] in position at", fmt(bot.entity.position), "— issuing chat commands");
    const cmds = [
      "Cody, follow me",
      "follow me",
      "Cody, come here",
      "come here Cody",
      "Cody follow me please, this way",
    ];
    for (const c of cmds) {
      bot.chat(c);
      console.log("[DIRECTOR]", stamp(), "SENT:", c, "| probe at", fmt(bot.entity.position));
      await sleep(25000);
      console.log("[DIRECTOR]", stamp(), "probe still at", fmt(bot.entity.position));
    }
    console.log("[DIRECTOR] DONE");
  } catch (e) { console.log("[DIRECTOR] EXCEPTION", (e && e.stack) || e); }
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("[DIRECTOR] error", e.message));
bot.on("kicked", (r) => console.log("[DIRECTOR] kicked", String(r)));
setTimeout(() => { console.log("[DIRECTOR] TIMEOUT"); process.exit(1); }, 480000);
