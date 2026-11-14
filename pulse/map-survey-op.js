"use strict";
// map-survey-op.js — day-6 operator probe (Gallery, OPPED): proves the
// operator mechanics on THROWAWAY targets before any Cody launch:
// /give with a name pattern + discard path. Body = SurveyOp6.
const { createBot } = require("/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js");
const bot = createBot({ host: "192.168.0.50", port: 25565, username: "SurveyOp6", version: "26.1", plugins: [], skipPlugins: ["wanderer","flee-on-danger","combat","behavior-script","npc-system","onboarding","game-hub"] });
bot.on("error", (e) => console.log("bot error:", e && e.message));
bot.on("kicked", (r) => console.log("kicked:", String(r)));
bot.on("message", (m) => { try { console.log("SRV:", m.toString().slice(0,220)); } catch {} });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  try {
    await sleep(1500);
    bot.chat("/give SurveyOp6 cooked_porkchop 4");
    await sleep(2000);
    const inv = bot.inventory.items().map((i) => i.name + " x" + i.count).join(", ");
    console.log("INV-AFTER-GIVE:", inv || "(empty)");
    bot.chat("/clear SurveyOp6");
    await sleep(1500);
    bot.chat("/data get entity SurveyOp6 Pos");
    await sleep(2000);
  } catch (e) { console.log("probe error:", e.message); }
  finally { try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); }
});
