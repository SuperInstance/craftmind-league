"use strict";
// LINK PROBE — asks resident Cody a question in open chat and records
// whether his reply is real mind output (post mind-link repair) rather
// than the "..." fallback. Fresh-named visitor; read-only on the world
// apart from standing and talking.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const USER = process.env.PROBE_USER || ("LinkProbe" + Math.floor(Math.random() * 900000 + 100000));
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now();
const stamp = () => ((Date.now() - t0) / 1000).toFixed(0) + "s";
let codyReplies = [];
bot.on("chat", (user, msg) => {
  console.log("[PROBE]", stamp(), "CHAT", user + ":", msg);
  if (user === "Cody") codyReplies.push(msg);
});
bot.on("error", (e) => console.log("[PROBE] error", e.message));
bot.once("spawn", async () => {
  console.log("[PROBE]", USER, "spawned; Cody link probe begins");
  await sleep(4000);
  bot.chat("Cody, hello! The yard radio says your mind link was repaired. What can you see around you right now?");
  console.log("[PROBE]", stamp(), "question sent");
  await sleep(90000);
  console.log("[PROBE] DONE. Cody replies:", JSON.stringify(codyReplies));
  try { bot.quit(); } catch {}
  process.exit(0);
});
