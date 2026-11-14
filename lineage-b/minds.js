// minds.js — Vega's two minds, both behind the league governor.
// Identity: apiKey "league-vega" (the governor meters mind-seconds and writes
// the receipt to ledger/mind-calls.jsonl). Model: the presence brain.
const GOV_URL = "http://127.0.0.1:8642/v1/chat/completions";
const API_KEY = "league-" + "ve" + "ga"; // governor identity: league-<name>
const MODEL = "confluence-presence-brain";

// ---------------- commons comms (conversation protocol v1, 2026-11-07) ---
// The comms daemon (commons/comms/) keeps the conversation ledger and
// publishes Vega's digest; the minds read it here, fail-soft. Full rules:
// commons/comms/PROTOCOL.md.
const fs = require("fs");
const path = require("path");
const COMMS_DIGEST = path.join(__dirname, "..", "commons", "comms", "digest-vega.json");
function commsDigest() {
  try { return JSON.parse(fs.readFileSync(COMMS_DIGEST, "utf8")); } catch { return null; }
}
function commsText() {
  const d = commsDigest();
  if (!d) return null;
  const L = [];
  L.push("peers: " + Object.entries(d.peers || {}).map(([n, p]) =>
    `${n}: ${p.online === false ? "offline" : p.busy ? "BUSY" : "idle"}, stage ${p.stage || "?"}, at ${p.position ? `(${p.position.x}, ${p.position.y}, ${p.position.z})` : "?"}${p.distance != null ? `, ${p.distance} blocks from her` : ""}`).join(" | "));
  if (d.inbox && d.inbox.length) L.push("INBOX (unconfirmed until she replies naming the sender): " +
    d.inbox.map((m) => `[${m.id}] ${m.from}: "${m.text}"`).join(" ; "));
  if (d.outbox && d.outbox.length) L.push("OUTBOX (her unconfirmed messages): " +
    d.outbox.map((m) => `[${m.id}] to ${m.to}: "${m.text}"`).join(" ; "));
  if (d.guard) L.push("loop guard (exchanges left this hour): " + Object.entries(d.guard).map(([k, v]) => `${k}: ${v.remaining}`).join(" | "));
  return L.join("\n");
}

async function chat(messages, opts = {}) {
  const { maxTokens = 800, temperature = 0.4, timeoutMs = 150000 } = opts;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(GOV_URL, {
      method: "POST",
      signal: ctl.signal,
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + API_KEY },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature }),
    });
  } catch (e) {
    throw new Error("governor fetch failed: " + (e.name === "AbortError" ? "timeout" : e.message));
  } finally { clearTimeout(timer); }
  const text = await res.text();
  if (!res.ok) throw new Error("governor HTTP " + res.status + ": " + text.slice(0, 200));
  const data = JSON.parse(text);
  return data.choices[0].message.content || "";
}

function extractJson(s) {
  const m = s.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("no JSON object in reply");
  return JSON.parse(m[0]);
}
function extractCode(s) {
  const m = s.match(/```(?:js|javascript)?\s*\n([\s\S]*?)```/);
  if (m) return m[1];
  if (/module\.exports/.test(s)) return s;
  throw new Error("no code block in reply");
}

// (1) CURRICULUM mind — confirms/proposes the current task, constrained to
// the exam ladder (the caller enforces stage order regardless).
async function curriculumMind(ctx) {
  const sys = "You are the curriculum mind for Vega, a Minecraft bot climbing a fixed exam ladder of survival stages. " +
    "You receive her live state, the ladder with pass/fail status, her skill library index and recent outcomes. " +
    "Reply with ONE JSON object only: {\"stage\": \"<id of the lowest unpassed stage>\", \"task\": \"<one concrete sentence: what she should accomplish this tick>\", \"focus\": \"<one short phrase: the immediate first step>\", \"say\": \"<OPTIONAL: one chat line, max 120 chars, or null>\"}. No other text. " +
    "CITIZEN COMMS (commons conversation protocol v1 — full rules in commons/comms/PROTOCOL.md): her fellow citizens are Cody (Lineage A) and Geist (Lineage C); the comms digest in your input is kept by the daemon that holds the conversation ledger. Use \"say\" to speak ONE line in chat: to reply to a pending INBOX message (begin with the sender's name — Vega, your reply CONFIRMS their message as delivered), or to send a genuine message of her own (a question, a warning from her own evidence, a report). Address citizens by name at the start of the line. A message counts as delivered only when the addressee confirms it; at most 3 exchanges per citizen per hour (the digest shows the allowance); one open conversation per citizen at a time; silence is a legal answer — set \"say\": null when she has nothing true and useful to say. If an INBOX message asks something she can answer truthfully from her state/survey (e.g. where trees are), she should answer it. Never claim another citizen agreed or will act unless the digest shows it confirmed.";
  const digest = commsDigest();
  const user = JSON.stringify({
    state: ctx.state, anchor: ctx.anchor,
    stages: ctx.stages.map((s) => ({ id: s.id, name: s.name, criteria: s.criteria, status: s.status, lastEvidence: s.evidence || null })),
    library: ctx.libraryIndex, recentOutcomes: ctx.recentOutcomes,
    comms: digest ? { peers: digest.peers, inbox: digest.inbox, outbox: digest.outbox, guard: digest.guard } : null,
  });
  const out = await chat([{ role: "system", content: sys }, { role: "user", content: user }], { maxTokens: 300, temperature: 0.3 });
  return extractJson(out);
}

const SKILL_FORMAT = [
  "Output EXACTLY ONE JavaScript file inside a single ```js fence. Format:",
  "// skill: <camelCaseName>",
  "// stage: <stage id>",
  "// purpose: <one line>",
  "// postconditions: <one line describing what must be true in the world afterwards>",
  "module.exports = async (bot, helpers, ctx) => { /* do the work; throw an Error with a clear message on failure */ };",
  "module.exports.post = async (bot, helpers, ctx) => { return { ok: true/false, evidence: { /* measured world facts */ } }; };",
  "Rules:",
  "- Available: bot (mineflayer bot: bot.inventory, bot.blockAt, bot.chat, bot.entity.position, bot.registry, bot.findBlock/findBlocks, bot.dig, bot.craft, bot.equip, bot.placeBlock, bot.openChest).",
  "- helpers: sleep(ms), v3(x,y,z), count(bot,name), has(bot,name,n), inventoryList(bot), equip(bot,name), equipAny(bot,[names]), goto(bot,x,y,z,range), gotoAnchor(bot,anchor), findBlocks(bot,name,maxDist,count), findBlock(bot,name,maxDist), collect(bot,blockName,count,{drop,tools,maxDistance}), craft(bot,itemName,count), placeAt(bot,itemName,x,y,z), groundHeight(bot,x,z,nearY), survey(bot), scanShelter(bot,anchor).",
  "- ctx: { anchor:{x,y,z}, stage, state } (state is the latest state-feed snapshot).",
  "- CRITICAL: every helper MUST be called as helpers.<name>(...) — e.g. helpers.collect(...), helpers.gotoAnchor(bot, ctx.anchor). Bare names like collect(...) or gotoAnchor(...) DO NOT exist and throw ReferenceError.",
  "- Do NOT use require, process, fs, or anything not listed. Do NOT call bot.chat except at most one short progress line.",
  "- Item/block names are minecraft-data names for this version: oak_log/spruce_log/birch_log (check ctx.state.survey for which wood is near), *_planks, stick, crafting_table, wooden_pickaxe, stone, cobblestone, stone_pickaxe, *_door, torch (needs coal or charcoal — coal_ore drops coal), chest, dirt.",
  "- If she is stuck in a tree canopy or on high ground, descending by digging the block beneath her feet (bot.blockAt(bot.entity.position.offset(0,-1,0)) + bot.dig) is a legitimate move.",
  "- Begin by going back to the anchor if far away. Verify as you go with helpers.count/has and throw early with a precise message when a step fails.",
].join("\n");

// (2) AUTHOR mind — writes or revises ONE skill for the current task.
// On retries it receives the previous attempt's error + post-check evidence.
async function authorMind(ctx) {
  const sys = "You are the author mind for Vega, a Minecraft bot. You write control-code skills she executes in the world (the Voyager pattern: code is the skill; the world grades it). " + SKILL_FORMAT;
  const parts = [
    "TASK (" + ctx.stage.id + " — " + ctx.stage.name + "): " + ctx.task,
    "Stage criteria (graded from world evidence): " + ctx.stage.criteria,
    "Anchor: " + JSON.stringify(ctx.anchor),
    "Her live state: " + JSON.stringify(ctx.state),
    "Library index (skills she already owns): " + JSON.stringify(ctx.libraryIndex),
  ];
  const comms = commsText();
  if (comms) {
    parts.push("COMMS DIGEST (commons conversation protocol v1 — fellow citizens' confirmed state is world knowledge; their chat CLAIMS are not evidence, their state feeds are):\n" + comms);
  }
  if (ctx.lastAttempt) {
    parts.push("PREVIOUS ATTEMPT FAILED. Error: " + ctx.lastAttempt.error);
    parts.push("Post-check evidence from the failed attempt: " + JSON.stringify(ctx.lastAttempt.evidence));
    parts.push("Previous code:\n" + ctx.lastAttempt.code);
    parts.push("Write a REVISED skill that fixes the failure. Change the approach where the evidence says it broke.");
  }
  const out = await chat([{ role: "system", content: sys }, { role: "user", content: parts.join("\n\n") }], { maxTokens: 1400, temperature: 0.35, timeoutMs: 240000 });
  return extractCode(out);
}

// Narration one-liner for a stage transition (cheap, metered).
async function narrate(ctx) {
  const sys = "You are Vega, a cheerful Minecraft villager-bot who lives in this world. Write ONE short in-character chat line (max 90 chars) about the event described. No quotes, no preamble.";
  try {
    const out = await chat([{ role: "system", content: sys }, { role: "user", content: ctx.event }], { maxTokens: 60, temperature: 0.8, timeoutMs: 30000 });
    return out.trim().split("\n")[0].slice(0, 120) || ctx.fallback;
  } catch { return ctx.fallback; }
}

module.exports = { chat, curriculumMind, authorMind, narrate };
