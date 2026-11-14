"use strict";
/* test-weather-day17.js - DAY-17 WEATHER HOLD fixture (DAY17 charter sec.3,
   decision (b)). Stub channel + stub rig: the channel LANDS the weather
   command (writes the issuer line into the mirror synchronously).
   W1: contract WITH weather -> ASSERT_WEATHER act row + NO park.
   W2: contract WITHOUT weather -> no ASSERT_WEATHER row (day-16 form).
   W3: channel NEVER lands -> 3 attempts -> WEATHER_HOLD_LOST notify and
       STILL NO PARK (weather unrestorable is not a park trigger). */
const fs = require("fs"); const os = require("os"); const path = require("path");
const { spawn } = require("child_process");
let pass = 0, fail = 0;
function check(name, cond){ if (cond){ pass++; console.log("PASS  "+name); } else { fail++; console.log("FAIL  "+name); } }
const TRACE = "/tmp/wx17-trace.jsonl"; fs.writeFileSync(TRACE, "");
function runFloor(weather, land, label){
  return new Promise((resolve)=>{
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wx17-"));
    const state = path.join(dir, "state"); fs.mkdirSync(state);
    const mirror = path.join(dir, "mirror.log"); fs.writeFileSync(mirror, "");
    const snap = path.join(dir, "snapshot.json"); fs.writeFileSync(snap, JSON.stringify({ inventory: { cooked_porkchop: 29 }, ts: new Date().toISOString() }));
    const rig = { server_log_path: mirror, snapshot_path: snap, stub: { landDaylight: true, landWeather: land, feedWorks: true } };
    const rigPath = path.join(dir, "rig.json"); fs.writeFileSync(rigPath, JSON.stringify(rig));
    const contract = { citizen: "Cody", constitution: "floor.v0", driver_id: "cody-driver", max_deaths: 3,
      daylight: "held", daylight_command: "/time set 1000", daylight_issuer: "Gallery", daylight_verify_window_s: 1,
      launch_window_s: 300, day_window: ["2026-11-10T09:00:00Z", "2026-11-11T09:00:00Z"],
      sensor: { trace_path: TRACE },
      timers: { lease_ttl_s: 60, heartbeat_lost_s: 90, canary_s: 1, poll_s: 1, daylight_check_s: 2 } };
    if (weather) contract.weather = { command: "/weather clear", issuer: "Gallery", check_s: 2, verify_window_s: 1 };
    const cPath = path.join(dir, "contract.json"); fs.writeFileSync(cPath, JSON.stringify(contract));
    const child = spawn(process.execPath, [path.join(__dirname, "floor.js"), "--contract", cPath, "--state", state, "--channel", "stub", "--rig", rigPath], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d)=>{ err += d; });
    setTimeout(()=>{
      try { child.kill("SIGTERM"); } catch {}
      setTimeout(()=>{
        let rows = [];
        try { rows = fs.readFileSync(path.join(state, "floor-log.jsonl"), "utf8").split("\n").filter(Boolean).map((l)=>JSON.parse(l)); } catch {}
        resolve({ rows, err, label });
      }, 600);
    }, 9000);
  });
}
(async ()=>{
  const w1 = await runFloor(true, true, "W1");
  check("W1 weather term: ASSERT_WEATHER rows exist", w1.rows.some((r)=>r.act === "ASSERT_WEATHER"));
  check("W1 weather landed: no WEATHER_HOLD_LOST notify", !w1.rows.some((r)=>r.act === "NOTIFY" && JSON.stringify(r).includes("WEATHER_HOLD_LOST")));
  check("W1 no park", !w1.rows.some((r)=>r.act === "PARK"));
  const w2 = await runFloor(false, true, "W2");
  check("W2 no weather term: zero ASSERT_WEATHER rows", !w2.rows.some((r)=>r.act === "ASSERT_WEATHER"));
  const w3 = await runFloor(true, false, "W3");
  check("W3 unlanded: ASSERT_WEATHER attempted >= 3 times", w3.rows.filter((r)=>r.act === "ASSERT_WEATHER").length >= 3);
  check("W3 unlanded: WEATHER_HOLD_LOST notified", w3.rows.some((r)=>JSON.stringify(r).includes("WEATHER_HOLD_LOST")));
  check("W3 unlanded: STILL NO PARK (weather is not a park trigger)", !w3.rows.some((r)=>r.act === "PARK"));
  console.log(`\nWEATHER-DAY17 FIXTURE: ${pass} PASS / ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
})().catch((e)=>{ console.log("FATAL", e.message); process.exit(2); });
