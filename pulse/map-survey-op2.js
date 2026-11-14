"use strict";
// map-survey-op2.js — Gallery probe v2: FULL messages for one command.
const { createBot } = require("/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js");
const bot = createBot({ host: "192.168.0.50", port: 25565, username: "Gallery", version: "26.1", plugins: [], skipPlugins: ["wanderer","flee-on-danger","combat","behavior-script","npc-system","onboarding","game-hub"] });
bot.on("error", (e) => console.log("bot error:", e && e.message));
bot.on("kicked", (r) => console.log("kicked:", String(r)));
bot.on("message", (m) => { try { const s = m.toString(); if (!s.includes("BOT_MSG")) console.log("SRV:", s.slice(0,300)); } catch {} });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  try {
    await sleep(1500);
    bot.chat("/team list noplates");
    await sleep(2500);
  } catch (e) { console.log("probe error:", e.message); }
  finally { try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); }
});
