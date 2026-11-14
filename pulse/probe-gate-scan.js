"use strict";
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { Vec3 } = require(NM + "/vec3");
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "GateScan", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function groundY(x, z) {
  for (let y = 90; y > 50; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (b && b.boundingBox === "block") return { y, name: b.name };
  }
  return null;
}
bot.once("spawn", async () => {
  console.log("[SCAN] spawned at", JSON.stringify(bot.entity.position));
  await sleep(3000);
  // grid around pulse anchor (24,67,-111) and around Cody (49,66,-83)
  for (const [cx, cz, label] of [[24,-111,"ANCHOR"],[49,-83,"CODY"]]) {
    console.log("=== " + label + " centre " + cx + "," + cz + " (groundY rows z, cols x) ===");
    for (let z = cz-14; z <= cz+14; z += 2) {
      let row = [];
      for (let x = cx-14; x <= cx+14; x += 2) {
        const g = groundY(x, z);
        row.push(g ? String(g.y) : "..");
      }
      console.log("z=" + z + ": " + row.join(" "));
    }
  }
  // detailed line profiles: east from Cody, west from Cody, anchor->spawn
  function profile(x0,z0,x1,z1,label){
    const n = Math.max(Math.abs(x1-x0), Math.abs(z1-z0));
    let out=[];
    for(let i=0;i<=n;i++){
      const x=Math.round(x0+(x1-x0)*i/n), z=Math.round(z0+(z1-z0)*i/n);
      const g=groundY(x,z);
      out.push(x+","+z+"="+(g?g.y+":"+g.name:"?"));
    }
    console.log("[PROFILE] "+label+": "+out.join(" | "));
  }
  profile(49,-83, 29,-83, "CODY west 20");
  profile(49,-83, 49,-103, "CODY south 20");
  profile(49,-83, 69,-83, "CODY east 20");
  profile(24,-111, 44,-111, "ANCHOR east 20");
  profile(32,-96, 24,-111, "SPAWN to ANCHOR");
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("[SCAN] error", e.message));
setTimeout(() => { console.log("[SCAN] TIMEOUT"); process.exit(1); }, 60000);
