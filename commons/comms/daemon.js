// daemon.js — commons conversation protocol v1: the ledger-keeper.
//
// Implements commons/comms/PROTOCOL.md. One process:
//   - tails the Orin server log over ssh (chat ground truth: the three
//     citizens' chat lines, nothing else is believed);
//   - polls the three state feeds on this box (busy/idle/stage/position);
//   - maintains chat.jsonl — append-only: every citizen chat line plus the
//     daemon's own events (queued / confirmed / failed / loop-guard-fired);
//   - publishes digest-<citizen>.json (refreshed every poll, <= 60 s):
//     pending inbox, unconfirmed outbox, peer busy/idle/stage/position,
//     loop-guard allowance per pair.
//
// Delivery semantics (PROTOCOL rule 4): a message is PENDING when spoken
// and DELIVERED only on the addressee's confirmation — a reply in chat
// naming the sender, a commons-ledger note, or an observable act (the
// daemon watches for "arriving": addressee closing to <= 6 blocks of the
// sender after being > 6 away at send time). Unconfirmed after two of the
// addressee's pulses (counted as tick-activity epochs in their tick logs,
// >= 10 min old) -> FAILED, on the record. Past 3 exchanges per pair per
// hour the daemon withholds the tail from digests (loop-guard-fired).
//
// The daemon never speaks in chat and never grades the exam.
// Run from this directory: node daemon.js   (see start-daemon.sh)
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
process.chdir(__dirname);

const DIR = __dirname;
const LEAGUE = path.join(DIR, "..", "..");
const LEDGER = path.join(DIR, "chat.jsonl");
const CITIZENS = ["Cody", "Vega", "Geist"];
const FEEDS = {
  Cody: {
    file: path.join(LEAGUE, "pulse", "cody-state.json"), posKey: "pos",
    tickFile: path.join(LEAGUE, "pulse", "ledger.jsonl"),
  },
  Vega: {
    file: path.join(LEAGUE, "lineage-b", "vega-state.json"), posKey: "position",
    tickFile: path.join(LEAGUE, "lineage-b", "logs", "ticks.jsonl"),
  },
  Geist: {
    file: path.join(LEAGUE, "lineage-c", "geist-state.json"), posKey: "position",
    tickFile: path.join(LEAGUE, "lineage-c", "logs", "ticks.jsonl"),
  },
};
const POLL_MS = 15000;
const GUARD_MAX = 3;
const GUARD_WINDOW_MS = 3600 * 1000;
const FAIL_MIN_AGE_MS = 10 * 60 * 1000;
const EPOCH_GAP_MS = 150 * 1000; // tick-log growth bursts closer than this are one pulse

function log(...a) { console.log(new Date().toISOString(), "[COMMS]", ...a); }
function nowIso() { return new Date().toISOString(); }
function appendLedger(o) { fs.appendFileSync(LEDGER, JSON.stringify(o) + "\n"); }
function readJson(p, fb) { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fb; } }
function dist(a, b) { if (!a || !b) return null; return +Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z).toFixed(1); }
function pairKey(a, b) { return [a, b].sort().join("|"); }

// ---------------- message state (rebuilt from the ledger on boot) --------
const messages = new Map(); // id -> msg
let seq = 0;
function rebuild() {
  let raw = "";
  try { raw = fs.readFileSync(LEDGER, "utf8"); } catch { return; }
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    if (o.kind === "chat" && o.id) {
      messages.set(o.id, {
        id: o.id, ts: o.ts, from: o.from, to: o.to, text: o.text,
        status: o.guarded ? "withheld" : "pending", distAtSend: o.distAtSend != null ? o.distAtSend : null,
      });
      const n = parseInt(String(o.id).slice(1), 10); if (n > seq) seq = n;
    } else if (o.kind === "event" && o.id && messages.has(o.id)) {
      const m = messages.get(o.id);
      if (o.event === "confirmed") { m.status = "confirmed"; m.confirmMethod = o.method; m.confirmedAt = o.ts; }
      if (o.event === "failed") { m.status = "failed"; m.failedAt = o.ts; }
    }
  }
  log("ledger rebuilt:", messages.size, "tracked messages");
}

// ---------------- state feeds + busy -------------------------------------
const feedState = {}; // name -> {feed, pos, stage, online, busy, moved}
const posHist = {};   // name -> [{ts, pos}]
function pollFeeds() {
  for (const name of CITIZENS) {
    const spec = FEEDS[name];
    const f = readJson(spec.file, null);
    const prev = feedState[name];
    if (!f) { feedState[name] = { online: false, busy: null, stage: null, pos: null }; continue; }
    const pos = f[spec.posKey] || f.position || f.pos || null;
    const fresh = f.ts ? (Date.now() - Date.parse(f.ts) < 90000) : true;
    const st = { online: !!fresh, pos, stage: f.stage || null, feed: f };
    // motion in the last ~60 s (executing something physical)
    if (pos) {
      const h = (posHist[name] = posHist[name] || []);
      h.push({ ts: Date.now(), pos });
      while (h.length && Date.now() - h[0].ts > 90000) h.shift();
      const old = h[0];
      st.movedRecently = old && dist(old.pos, pos) > 2.5 && Date.now() - old.ts > 20000;
    }
    if (name === "Cody") {
      const r = f.runner || {};
      st.busy = r.status ? r.status !== "no-active-skills" : !!st.movedRecently;
    } else {
      st.busy = !!st.movedRecently || tickEpochRecent(name);
    }
    if (!st.online) st.busy = null;
    feedState[name] = st;
    void prev;
  }
}

// ---------------- tick epochs (for the two-pulse failure rule) -----------
// A "pulse" is one TICK, identified by the tick id the citizen's own log
// stamps on every line of that tick (Geist: the line's ts IS the tick id;
// Vega: the line's "tick" field; Cody: the ledger line's minute bucket).
// (v1.0 counted raw file growth, which mistook Vega's per-attempt log
// lines for separate pulses and failed m1 early — corrected the same
// night; the m1 failure stands in the ledger, earned under either count:
// she had a full tick with the message in her digest and answered the
// wrong citizen.)
const tickSeen = {}; // name -> Map(tickId -> firstSeenMs)
function tickIdOf(name, o) {
  if (!o || typeof o !== "object") return null;
  if (name === "Vega") return o.tick || null;
  if (name === "Geist") return o.ts || null;
  return o.ts ? String(o.ts).slice(0, 16) : null; // Cody: minute bucket
}
function pollTickFiles() {
  for (const name of CITIZENS) {
    const seen = (tickSeen[name] = tickSeen[name] || new Map());
    let raw = "";
    try {
      const fd = fs.openSync(FEEDS[name].tickFile, "r");
      const size = fs.fstatSync(fd).size;
      const len = Math.min(size, 65536);
      const buf = Buffer.alloc(len);
      fs.readSync(fd, buf, 0, len, size - len);
      fs.closeSync(fd);
      raw = buf.toString("utf8");
    } catch { continue; }
    for (const line of raw.split("\n")) {
      if (!line.trim()) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      const id = tickIdOf(name, o);
      if (id && !seen.has(id)) {
        seen.set(id, Date.now());
        log("tick epoch:", name, id);
      }
    }
  }
}
function tickEpochRecent(name) {
  const seen = tickSeen[name];
  if (!seen) return false;
  for (const t of seen.values()) if (Date.now() - t < 120000) return true;
  return false;
}
function epochsAfter(name, tsMs) {
  const seen = tickSeen[name];
  if (!seen) return 0;
  let n = 0;
  for (const t of seen.values()) if (t > tsMs) n++;
  return n;
}

// ---------------- ingestion: chat ground truth ---------------------------
function confirm(m, method, evidence) {
  if (m.status !== "pending") return;
  m.status = "confirmed"; m.confirmMethod = method; m.confirmedAt = nowIso();
  appendLedger({ ts: m.confirmedAt, kind: "event", event: "confirmed", id: m.id, from: m.from, to: m.to, method, evidence });
  log("CONFIRMED", m.id, m.from, "->", m.to, "via", method);
}
function ingestChat(from, text) {
  const ts = nowIso();
  // (1) reply-confirmation: any pending message TO the speaker whose sender
  // is named in this line is confirmed by the reply (protocol rule 4).
  const pendIn = [...messages.values()].filter((m) => m.to === from && m.status === "pending").sort((a, b) => a.ts.localeCompare(b.ts));
  for (const m of pendIn) {
    if (new RegExp("\\b" + m.from + "\\b").test(text)) { confirm(m, "reply", { line: text.slice(0, 200) }); break; }
  }
  // (1b) Cody is a RECEIVE-ONLY presence in protocol v1 (declared
  // asymmetry): his framework social layer speaks on its own terms — it
  // greets newcomers BY NAME ("Geist: Back again? ..."), which is a reflex,
  // not a deliberate protocol send. His lines are recorded as ground truth
  // (and, per (1), they can confirm a message addressed to him), but they
  // are never delivery-tracked: no inbox entries, no guard consumption.
  if (from === "Cody") {
    appendLedger({ ts, kind: "chat", from, to: null, text, tracked: false, note: "Cody is receive-only in protocol v1; framework social line, not delivery-tracked" });
    return;
  }
  // (2) is this line itself an addressed message? Name at the start, or @Name.
  let to = null;
  for (const name of CITIZENS) {
    if (name === from) continue;
    if (new RegExp("^\\s*" + name + "\\b").test(text) || text.includes("@" + name)) { to = name; break; }
  }
  if (!to) { appendLedger({ ts, kind: "chat", from, to: null, text }); return; }
  // (3) loop guard: 3 exchanges per pair per hour; beyond that, withhold.
  const key = pairKey(from, to);
  const inWindow = [...messages.values()].filter((m) => pairKey(m.from, m.to) === key && m.status !== "withheld" && Date.now() - Date.parse(m.ts) < GUARD_WINDOW_MS).length;
  const id = "m" + ++seq;
  const dSend = dist((feedState[from] || {}).pos, (feedState[to] || {}).pos);
  if (inWindow >= GUARD_MAX) {
    appendLedger({ ts, kind: "chat", id, from, to, text, guarded: true, distAtSend: dSend });
    messages.set(id, { id, ts, from, to, text, status: "withheld", distAtSend: dSend });
    appendLedger({ ts, kind: "event", event: "loop-guard-fired", id, pair: key, note: "message recorded but withheld from digests (politeness-loop guard, protocol rule 6)" });
    log("LOOP-GUARD", id, from, "->", to, "withheld");
    return;
  }
  const m = { id, ts, from, to, text, status: "pending", distAtSend: dSend };
  messages.set(id, m);
  appendLedger({ ts, kind: "chat", id, from, to, text, distAtSend: dSend });
  const addr = feedState[to] || {};
  if (addr.busy) {
    appendLedger({ ts, kind: "event", event: "queued", id, from, to, note: "addressee busy at send time; message waits in their inbox (protocol rule 3)" });
    log("QUEUED", id, from, "->", to, "(addressee busy)");
  } else {
    log("PENDING", id, from, "->", to, ":", text.slice(0, 80));
  }
}

// ---------------- server-log tail (ssh, reconnecting) --------------------
let tailChild = null;
function startTail() {
  log("starting server-log tail via ssh orin-lan");
  tailChild = spawn("ssh", [
    "-o", "BatchMode=yes", "-o", "ServerAliveInterval=20", "-o", "ServerAliveCountMax=3",
    "orin-lan", "tail -F -n 0 ~/minecraft-server/logs/latest.log",
  ], { stdio: ["ignore", "pipe", "pipe"] });
  let buf = "";
  tailChild.stdout.on("data", (d) => {
    buf += d.toString();
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i); buf = buf.slice(i + 1);
      const m = line.match(/<([A-Za-z0-9_]+)>\s(.*)$/);
      if (m && CITIZENS.includes(m[1])) ingestChat(m[1], m[2].trim());
    }
  });
  tailChild.stderr.on("data", (d) => log("tail stderr:", String(d).trim().slice(0, 200)));
  tailChild.on("close", (code) => { log("tail closed (", code, ") — reconnecting in 10 s"); setTimeout(startTail, 10000); });
  tailChild.on("error", (e) => log("tail spawn error:", e.message));
}

// ---------------- confirmations by act + failures ------------------------
function pollResolutions() {
  for (const m of messages.values()) {
    if (m.status !== "pending") continue;
    const a = feedState[m.from] || {}, b = feedState[m.to] || {};
    // arriving: addressee closed to <= 6 blocks having been > 6 at send
    if (a.pos && b.pos && m.distAtSend != null && m.distAtSend > 6) {
      const d = dist(a.pos, b.pos);
      if (d != null && d <= 6) confirm(m, "act", { act: "arrived", distanceNow: d, distanceAtSend: m.distAtSend });
    }
    if (m.status === "pending") {
      const age = Date.now() - Date.parse(m.ts);
      if (age > FAIL_MIN_AGE_MS && epochsAfter(m.to, Date.parse(m.ts)) >= 2) {
        m.status = "failed"; m.failedAt = nowIso();
        appendLedger({ ts: m.failedAt, kind: "event", event: "failed", id: m.id, from: m.from, to: m.to, reason: "unconfirmed after two of the addressee's pulses (protocol rule 5)" });
        log("FAILED", m.id, m.from, "->", m.to);
      }
    }
  }
}

// ---------------- digests -------------------------------------------------
function guardFor(name) {
  const out = {};
  for (const other of CITIZENS) {
    if (other === name) continue;
    const key = pairKey(name, other);
    const used = [...messages.values()].filter((m) => pairKey(m.from, m.to) === key && m.status !== "withheld" && Date.now() - Date.parse(m.ts) < GUARD_WINDOW_MS).length;
    out[key] = { used, remaining: Math.max(0, GUARD_MAX - used), max: GUARD_MAX, windowMinutes: 60 };
  }
  return out;
}
function writeDigests() {
  for (const name of CITIZENS) {
    const me = feedState[name] || {};
    const peers = {};
    for (const other of CITIZENS) {
      if (other === name) continue;
      const o = feedState[other] || {};
      peers[other] = { online: !!o.online, busy: o.busy, stage: o.stage, position: o.pos, distance: dist(me.pos, o.pos) };
    }
    const slim = (m) => ({ id: m.id, from: m.from, to: m.to, text: m.text, ts: m.ts, status: m.status, addresseeBusy: !!(feedState[m.to] || {}).busy });
    const digest = {
      citizen: name, ts: nowIso(), protocol: "commons/comms/PROTOCOL.md (v1)",
      self: { busy: me.busy, stage: me.stage, position: me.pos },
      peers,
      inbox: [...messages.values()].filter((m) => m.to === name && m.status === "pending").map(slim),
      outbox: [...messages.values()].filter((m) => m.from === name && m.status === "pending").map(slim),
      recentConfirmed: [...messages.values()].filter((m) => m.status === "confirmed" && (m.from === name || m.to === name)).slice(-3)
        .map((m) => ({ id: m.id, from: m.from, to: m.to, text: m.text, method: m.confirmMethod, confirmedAt: m.confirmedAt })),
      recentFailed: [...messages.values()].filter((m) => m.status === "failed" && (m.from === name || m.to === name)).slice(-3).map(slim),
      guard: guardFor(name),
      note: "A message counts as DELIVERED only when the addressee confirms (reply naming the sender, a ledger note, or an observable act). Silence is a legal answer.",
    };
    fs.writeFileSync(path.join(DIR, "digest-" + name.toLowerCase() + ".json"), JSON.stringify(digest, null, 2));
  }
}

// ---------------- main ----------------------------------------------------
rebuild();
pollFeeds(); pollTickFiles(); writeDigests();
startTail();
setInterval(() => { pollFeeds(); pollTickFiles(); pollResolutions(); writeDigests(); }, POLL_MS);
log("comms daemon up; poll", POLL_MS, "ms; ledger", LEDGER);
