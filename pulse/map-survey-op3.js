"use strict";
// map-survey-op3.js — op mechanics proof on THROWAWAY targets.
// Gallery is opped (ops.json, level 4). Tests, in order:
// (1) /give to a DIFFERENT named online body (the throwaway),
// (2) a selector-summon of that body to the pen,
// (3) /data get on that body. Throws nothing at Cody.
const { createBot } = require("/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js");
const opts = (u) => ({ host: "192.168.0.50", port: 25565, username: u, version: "26.1", plugins: ["pathfinder"], skipPlugins: ["wanderer","flee-on-danger","combat","behavior-script","npc-system","onboarding","game-hub"] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const target = createBot(opts("SurveyOp6"));
target.on("error", (e) => console.log("target error:", e && e.message));
target.once("spawn", async () => {
  console.log("target spawned at", JSON.stringify(target.entity.position));
  const op = createBot(opts("Gallery"));
  op.on("error", (e) => console.log("op error:", e && e.message));
  op.on("message", (m) => { try { const s = m.toString(); if (!s.includes("BOT_MSG")) console.log("OP-SRV:", s.slice(0, 240)); } catch {} });
  op.once("spawn", async () => {
    try {
      await sleep(1500);
      op.chat("/give SurveyOp6 cooked_porkchop 4");
      await sleep(2000);
      console.log("TARGET-INV:", target.inventory.items().map((i) => i.name + " x" + i.count).join(", ") || "(empty)");
      op.chat("/execute in minecraft:overworld run tp SurveyOp6 64 67 -101");
      await sleep(2500);
      console.log("TARGET-POS-AFTER-TP:", JSON.stringify(target.entity.position));
      op.chat("/data get entity SurveyOp6 Pos");
      await sleep(2000);
    } catch (e) { console.log("probe error:", e.message); }
    finally { try { op.quit(); target.quit(); } catch {} setTimeout(() => process.exit(0), 800); }
  });
});
