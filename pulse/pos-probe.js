"use strict";
// POS PROBE - operator probe (not a citizen). Reads Cody entity position at full precision.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "PosProbe", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  await sleep(3000);
  for (let i = 0; i < 12; i++) {
    const e = Object.values(bot.entities || {}).find((x) => x && x.username === "Cody");
    if (e) console.log(i, e.position.toString(), "onGround", e.onGround);
    else console.log(i, "CODY NOT VISIBLE; entities:", Object.values(bot.entities||{}).map(x=>x&&x.username).filter(Boolean).join(","));
    await sleep(1000);
  }
  bot.quit(); process.exit(0);
});
