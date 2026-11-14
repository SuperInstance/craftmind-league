import sys

# ---------- floor.js ----------
p = "floor/floor.js"
s = open(p).read()

old_chunk = """  const cmdText = contract.daylight_command || '/time set 1000';
  const logPath = rig.server_log_path;
  const needle = `${contract.daylight_issuer} issued server command: ${cmdText}`;
  for (let attempt = 1; attempt <= 3; attempt++) { // retries: 3, then PARK (C.2)
    let before = 0;
    try { before = fs.statSync(logPath).size; } catch { /* log may not exist yet */ }
    act('ASSERT_DAYLIGHT', 'contract_daylight_held', `log:${logPath}@${before}`, { attempt });
    await channel.issue({ cmd: 'chat', id: opId('daylight'), text: cmdText });
    const t0 = now();
    let landed = false;
    while (now() - t0 < 2000) {
      try {
        const fresh = fs.readFileSync(logPath, 'utf8').slice(before);
        if (fresh.includes(needle)) { landed = true; break; }
      } catch { /* keep waiting */ }
      await new Promise((r) => setTimeout(r, 100));
    }
    if (landed) { asserting = false; return; }
  }"""

new_chunk = """  const cmdText = contract.daylight_command || '/time set 1000';
  const logPath = rig.server_log_path;
  const needle = `${contract.daylight_issuer} issued server command: ${cmdText}`;
  // Verify window (rig-repair charter, RIG-REPAIR-20261109.md): a
  // CONTRACT TERM, daylight_verify_window_s, pinned by the day's
  // charter. The FileOpChannel's response arrives only after the op bot
  // has observed the server apply the command (day 11: the three 01:06
  // responses took 2.75 / 2.73 / 2.72 s — the landing line was already
  // in the log when each response returned), so the window only has to
  // cover the mirror's refresh cadence (the rig's 1 s loop) plus slack:
  // the fallback below is 5000 ms, reasoned from that measurement, not
  // from the old 2000 ms constant. A contract may widen it; it may not
  // narrow it below the response it must outlast.
  const verifyMs = (typeof contract.daylight_verify_window_s === 'number' && contract.daylight_verify_window_s > 0)
    ? contract.daylight_verify_window_s * 1000 : 5000;
  // Look-behind: NEVER search only
  // slice(before). The mirror is a regenerated tail-snapshot and can
  // shift lines a few bytes against the recorded offset (day 11: a
  // trailing echo newline in the mirror shifted every landing line to
  // before-1, outside the old slice — three landed commands read as
  // unlanded and the day parked). The search window therefore ends at
  // the file's CURRENT end: [before - LOOKBACK_BYTES, EOF). A hit is
  // accepted only on a line whose start was not already verified
  // (lineStart >= floor — the high-water below), so one landing can
  // never satisfy two assertions, and finding an OLD line in the
  // look-behind region costs nothing but a poll.
  const LOOKBACK_BYTES = 65536;
  for (let attempt = 1; attempt <= 3; attempt++) { // retries: 3, then PARK (C.2)
    let before = 0;
    try { before = fs.statSync(logPath).size; } catch { /* log may not exist yet */ }
    act('ASSERT_DAYLIGHT', 'contract_daylight_held', `log:${logPath}@${before}`, { attempt });
    await channel.issue({ cmd: 'chat', id, text: cmdText });
    const t0 = now();
    let landed = false;
    while (now() - t0 < verifyMs) {
      try {
        const buf = fs.readFileSync(logPath);
        const from = Math.max(0, before - LOOKBACK_BYTES);
        const slice = buf.toString('utf8', from);
        let idx = 0;
        while (!landed && (idx = slice.indexOf(needle, idx)) >= 0) {
          // ignore a partial line at the very start of the region (the
          // look-behind may begin mid-line after a snapshot rewrite)
          const lineStart = from + Buffer.byteLength(slice.slice(0, idx), 'utf8');
          idx += needle.length;
          if (from > 0 && lineStart === from && buf[from - 1] !== 10) continue;
          if (lineStart >= daylightVerifiedFloor) {
            daylightVerifiedFloor = lineStart + 1;
            landed = true;
          }
        }
        if (landed) break;
      } catch { /* keep waiting */ }
      await new Promise((r) => setTimeout(r, 100));
    }
    if (landed) { asserting = false; return; }
  }"""

assert old_chunk in s, "floor.js daylight chunk not found"
s = s.replace(old_chunk, new_chunk)

old_decl = """let asserting = false;
let lastAssertMs = 0;"""
new_decl = """let asserting = false;
let lastAssertMs = 0;
// Byte offset (in the mirror's CURRENT framing) below which daylight
// landing lines have already been consumed by a verified assertion.
// Persists across assertions within the process; resets on floor open
// (a reopened floor re-verifies from the tail, and an old landing under
// a previous lease is never proof for a new assertion round).
let daylightVerifiedFloor = 0;"""
assert old_decl in s, "floor.js asserting decl not found"
s = s.replace(old_decl, new_decl)
open(p, "w").write(s)

# ---------- constitution.js ----------
p = "floor/constitution.js"
s = open(p).read()
old_val = """  if (c.launch_window_s != null && !(typeof c.launch_window_s === 'number' && c.launch_window_s > 0)) {
    bad.push('launch_window_s must be a positive number when present');
  }"""
new_val = """  if (c.launch_window_s != null && !(typeof c.launch_window_s === 'number' && c.launch_window_s > 0)) {
    bad.push('launch_window_s must be a positive number when present');
  }
  // daylight_verify_window_s (rig-repair charter, RIG-REPAIR-20261109.md):
  // how long ASSERT_DAYLIGHT polls the server-log mirror for the
  // issuer-specific landing line after the op channel responds. The
  // response itself takes ~2.7 s live (the op bot answers only after it
  // sees the server apply the command), so a window below 3 s can be
  // structurally too short; the charter pins a value reasoned from that
  // measurement (5000 ms class). Optional; when present it must be a
  // positive number. When absent the floor falls back to 5000 ms
  // (documented fallback in floor.js, not a second constant).
  if (c.daylight_verify_window_s != null && !(typeof c.daylight_verify_window_s === 'number' && c.daylight_verify_window_s > 0)) {
    bad.push('daylight_verify_window_s must be a positive number when present');
  }"""
assert old_val in s, "constitution.js launch_window block not found"
s = s.replace(old_val, new_val)
open(p, "w").write(s)
print("patched floor.js + constitution.js")
