"use strict";
const { spawn } = require("child_process");
const NM = process.env.HOME + "/.nvm/versions/node/v22.23.4/bin/node";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function run(script, label) {
  return new Promise((resolve) => {
    const ch = spawn(NM, [script], { cwd: __dirname, stdio: "inherit" });
    ch.on("exit", (c) => { console.log("[" + label + " exited " + c + "]"); resolve(); });
  });
}
(async () => {
  const standin = spawn(NM, ["map-standin.js"], { cwd: __dirname, stdio: "inherit" });
  // stand-in spawns AT world spawn; give the server time to actually place it before the probe joins
  await sleep(25000);
  await run("map-driver4.js", "probe4");
  standin.kill("SIGTERM");
  process.exit(0);
})();
