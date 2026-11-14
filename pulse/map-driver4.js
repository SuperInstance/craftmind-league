const mineflayer = require("../bots/craftmind/node_modules/mineflayer");
const { GoalNear } = require("../bots/craftmind/node_modules/mineflayer-pathfinder");
const prismarine = null /* unused */;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const b = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "Gallery", version: "26.1", viewDistance: 6 });
b.once("spawn", async () => {
  try {
    b.chat("/op MapProbe4");
    const p = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "MapProbe4", version: "26.1", viewDistance: 10 });
    p.once("spawn", async () => {
      await sleep(6000);
      p.chat("/tp MapProbe4 64 78 -92");
      await sleep(6000);
      const solid = (blk) => blk && blk.name !== "air" && blk.name !== "cave_air" && blk.boundingBox === "block";
      const out = [];
      for (let x = 63; x <= 67; x++) for (let z = -95; z <= -90; z++) {
        const cells = [];
        for (let y = 56; y <= 72; y++) { const blk = p.blockAt(new (require("../bots/craftmind/node_modules/vec3").Vec3)(x, y, z)); if (solid(blk)) cells.push(y + ":" + blk.name); }
        out.push(x + "," + z + " " + cells.join(" "));
      }
      console.log(out.join("\n"));
      console.log("DONE-v4");
      p.quit(); b.quit(); process.exit(0);
    });
  } catch (e) { console.log("ERR", e.message); process.exit(1); }
});
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 90000);
