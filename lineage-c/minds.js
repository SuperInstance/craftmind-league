// minds.js — Lineage C's three minds, all behind the league governor.
// Identity: apiKey "league-geist-mind". Model: the presence brain.
//
// GITM's shape, faithfully: three text roles over a knowledge base of FILES.
//   PLANNER    — goal + state + facts + retrieved memories -> an ordered plan
//                composed ONLY of the closed action vocabulary (JSON).
//   CALCULATOR — validates the plan against the facts (recipes satisfiable?
//                quantities right?) and either passes it, revises counts and
//                targets, or bounces it back with the reason.
//   REFLECTION — after execution, writes one memory entry: situation, plan,
//                outcome. Successful plans become retrievable text memory.
// Nobody here writes code. The minds compose; the executors execute.
const fs = require("fs");
const path = require("path");
const { VOCABULARY } = require("./executors");

const GOV_URL = "http://127.0.0.1:8642/v1/chat/completions";
const API_KEY = "league-geist-mind";
const MODEL = "confluence-presence-brain";
const FACTS_DIR = path.join(__dirname, "facts");
const MEMORY_FILE = path.join(__dirname, "memory", "plans.md");

const factCache = {};
function fact(name) {
  if (!(name in factCache)) {
    try { factCache[name] = fs.readFileSync(path.join(FACTS_DIR, name), "utf8"); }
    catch { factCache[name] = ""; }
  }
  return factCache[name];
}

// ---------------- commons comms (conversation protocol v1, 2026-11-07) ---
// The comms daemon (commons/comms/) keeps the conversation ledger and
// publishes Geist's digest; the minds read it here, fail-soft. PROTOCOL.md
// in that directory is the full rulebook; the operative rules are also in
// the PLANNER's system prompt below.
const COMMS_DIGEST = path.join(__dirname, "..", "commons", "comms", "digest-geist.json");
function commsDigest() {
  try { return JSON.parse(fs.readFileSync(COMMS_DIGEST, "utf8")); } catch { return null; }
}
function commsText() {
  const d = commsDigest();
  if (!d) return null;
  const L = [];
  L.push("peers: " + Object.entries(d.peers || {}).map(([n, p]) =>
    `${n}: ${p.online === false ? "offline" : p.busy ? "BUSY" : "idle"}, stage ${p.stage || "?"}, at ${p.position ? `(${p.position.x}, ${p.position.y}, ${p.position.z})` : "?"}${p.distance != null ? `, ${p.distance} blocks from you` : ""}`).join(" | "));
  if (d.inbox && d.inbox.length) {
    L.push("INBOX — messages addressed to you, UNCONFIRMED until you reply naming the sender:\n" +
      d.inbox.map((m) => `  [${m.id}] ${m.from}: "${m.text}"`).join("\n"));
  } else L.push("INBOX: empty.");
  if (d.outbox && d.outbox.length) {
    L.push("OUTBOX — messages you sent that are NOT yet confirmed (not delivered, in the ledger's eyes):\n" +
      d.outbox.map((m) => `  [${m.id}] to ${m.to}: "${m.text}"`).join("\n"));
  }
  if (d.guard) L.push("loop guard (exchanges left this hour): " + Object.entries(d.guard).map(([k, v]) => `${k}: ${v.remaining}`).join(" | "));
  return L.join("\n");
}

// ---------------- governor transport ----------------
async function chat(messages, opts = {}) {
  const { maxTokens = 1200, temperature = 0.3, timeoutMs = 180000 } = opts;
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
  if (!res.ok) throw new Error("governor HTTP " + res.status + ": " + text.slice(0, 300));
  const data = JSON.parse(text);
  return data.choices[0].message.content || "";
}

// ---------------- plan parsing + substrate validation ----------------
// Declared substrate (not deliberation): a plan is only ever a JSON list of
// vocabulary actions with object args. Malformed output is bounced to the
// planner once with the parse errors — the repair pass GITM's interface had.
function parsePlan(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return { plan: null, errors: ["no JSON object in reply"] };
  let obj;
  try { obj = JSON.parse(m[0]); } catch (e) { return { plan: null, errors: ["JSON.parse failed: " + e.message] }; }
  return validatePlan(obj);
}
function validatePlan(obj) {
  const errors = [];
  if (!obj || typeof obj !== "object") return { plan: null, errors: ["plan is not an object"] };
  const actions = obj.actions;
  if (!Array.isArray(actions) || !actions.length) return { plan: null, errors: ["plan.actions missing or empty"] };
  actions.forEach((a, i) => {
    if (!a || typeof a.action !== "string") errors.push(`action ${i}: missing .action`);
    else if (!VOCABULARY.includes(a.action)) errors.push(`action ${i}: "${a.action}" is not in the closed vocabulary [${VOCABULARY.join(", ")}]`);
    if (a && a.args != null && (typeof a.args !== "object" || Array.isArray(a.args))) errors.push(`action ${i}: .args must be an object`);
  });
  if (errors.length) return { plan: null, errors };
  return { plan: { goal: obj.goal || null, usedPond: Array.isArray(obj.usedPond) ? obj.usedPond : [], actions: actions.map((a) => ({ action: a.action, args: a.args || {} })) }, errors: [] };
}

const VOCAB_DOC = [
  "The closed action vocabulary (the ONLY actions that exist — compose these, nothing else):",
  '  goto    {"place":"anchor"|"spawn"|"shelter"} or {"x":n,"y":n,"z":n} or {"block":"<blockName>"} or {"entity":"<playerName>"}',
  '  collect {"block":"<blockName>"|"log"|"stone","count":n}   ("log" = any tree log; digs and picks up)',
  '  descend {}   (dig the block beneath you and drop, step by step, until standing on ground — use when stuck in a tree canopy)',
  '  craft   {"item":"<itemName>","count":n}   (ONE recipe step, n times; you must decompose chains yourself using the facts)',
  '  equip   {"item":"<itemName>"}',
  '  place   {"item":"<itemName>","x":n,"y":n,"z":n} or {"item":"<itemName>","near":"self"}',
  '  store   {"item":"<itemName>","count":n}   (into the nearest chest)',
  '  eat {}, shelter-enter {}, shelter-exit {}, flee {}, attack-nearest {}, wait {"seconds":n}, say {"text":"..."}',
].join("\n");

// ---------------- ROLLING PLANS (Application B, 2026-11-07) ----------------
// Plan-delta drafting, per DESIGN-ROLLING-PRIMITIVES section 3. The planner
// no longer re-derives from scratch on every derivation: the base is the
// last COMMITTED plan (the one reflection recorded, with its per-step
// execution results), and a derivation in CONTINUATION mode asks the
// planner only for the suffix after the first invalidated step. The
// calculator is unchanged and still verifies every produced plan against
// current state. Counterweights are structural, not optional:
//   (a) continuation depth is capped (rolling.json maxContinuationDepth):
//       a full derivation happens at least every K derivations (K = cap+1)
//       and at every stage boundary;
//   (b) SURPRISE INVALIDATION — a death since the base was committed, an
//       inventory contradiction against the base plan's own accounting, or
//       an unexplained position drift discards the base and forces a full
//       derivation, logged mode "invalidated";
//   (c) a lock-in guard: the same step failing the same way out of two
//       consecutive continuation commits forces a full derivation.
// A/B protocol: arms rotate by block of blockTicks TICKS (arm B =
// continuation-enabled, arm A = full-only control). The flag lives in
// rolling.json and can be flipped without code edits ("arm": "auto" |
// "A" | "B"; "enabled": false is the kill switch — behaviour is then
// exactly today's). All rolling code is fail-soft: any error degrades to
// a full derivation and logs the degradation.
const ROLLING_CFG_FILE = path.join(__dirname, "rolling.json");
const PLAN_STATE_FILE = path.join(__dirname, "plan-state.json");
const TICKS_FILE = path.join(__dirname, "logs", "ticks.jsonl");

function rollingCfg() {
  const dflt = { enabled: true, arm: "auto", blockTicks: 3, maxContinuationDepth: 3, positionDriftBlocks: 16 };
  try { return { ...dflt, ...JSON.parse(fs.readFileSync(ROLLING_CFG_FILE, "utf8")) }; } catch { return dflt; }
}
function rollingState() {
  try { return JSON.parse(fs.readFileSync(PLAN_STATE_FILE, "utf8")); } catch { return null; }
}
function saveRollingState(st) {
  try { fs.writeFileSync(PLAN_STATE_FILE, JSON.stringify(st, null, 1)); } catch {}
}
function freshRollingState() {
  return {
    base: null, pending: null,
    rotation: { arm: "B", blockIndex: 1, ticksInBlock: 0, blockStartedAt: null, lastFingerprint: null },
    counters: { derivations: 0, continuations: 0, fulls: 0, invalidations: 0 },
    prevContFailSig: null, contFailStrikes: 0,
  };
}
function rollingLog(obj) {
  try { fs.appendFileSync(TICKS_FILE, JSON.stringify({ ts: new Date().toISOString(), ...obj }) + "\n"); } catch {}
}

// --- inventory accounting for the base plan's executed prefix -----------
// Parses facts/recipes.md (the generated table the planner itself reads)
// into first-recipe effects, with the table's material GROUPS kept as
// groups (log(any wood), planks(any wood)). Used only to DETECT a
// contradiction between what the verified steps should have produced and
// what the live inventory holds — never to plan.
let recipeCache = null;
function recipeTable() {
  if (recipeCache) return recipeCache;
  const table = {};
  let cur = null;
  for (const line of fact("recipes.md").split("\n")) {
    const h = line.match(/^- ([a-z0-9_]+):\s*$/);
    if (h) { cur = h[1]; continue; }
    const r = line.match(/^\s+.*?:\s*(.+?)\s*->\s*(\d+)x\s*([a-z0-9_]+)\s*$/);
    if (r && cur && !table[cur] && r[3] === cur) {
      const ings = r[1].split("+").map((s) => {
        const m = s.trim().match(/^(\d+)x\s*(.+)$/);
        if (!m) return null;
        let name = m[2].trim();
        let group = null;
        if (/\(any wood\)/.test(name)) {
          group = /log/.test(name) ? "LOG" : (/planks/.test(name) ? "PLANKS" : null);
          if (!group) return null;
          name = name.replace(/\s*\(any wood\)/, "");
        }
        return { n: parseInt(m[1], 10), name, group };
      });
      if (ings.every(Boolean)) table[cur] = { ings, out: parseInt(r[2], 10), outItem: r[3] };
    }
  }
  recipeCache = table;
  return table;
}
const GROUP_MATCH = { LOG: (n) => /_log$/.test(n), PLANKS: (n) => /_planks$/.test(n) };
const FOOD_ITEMS = new Set(["apple", "bread", "beef", "cooked_beef", "porkchop", "cooked_porkchop", "chicken", "cooked_chicken", "mutton", "cooked_mutton", "cod", "cooked_cod", "salmon", "cooked_salmon", "carrot", "potato", "baked_potato", "rotten_flesh", "melon_slice", "sweet_berries", "glow_berries", "golden_carrot", "pumpkin_pie", "beetroot", "dried_kelp", "poisonous_potato", "rabbit", "cooked_rabbit", "honey_bottle"]);

// Simulate the executed prefix's inventory effects from the base state.
// Evidence-first: collect uses the executor's measured `gained`, craft
// uses its measured `operations`. Returns the expected inventory, which
// step produced each item last, and whether the simulation stayed
// reliable (an unreliable sim disables the inventory trigger only).
function simPrefix(baseInv, plan, results) {
  const inv = { ...(baseInv || {}) };
  const producer = {};
  let reliable = true;
  const notes = [];
  const table = recipeTable();
  const add = (item, n, step) => { inv[item] = (inv[item] || 0) + n; if (n > 0) producer[item] = step; };
  const subOne = (item, n) => { if ((inv[item] || 0) < n) return false; inv[item] -= n; return true; };
  const subGroup = (group, n) => {
    let left = n;
    for (const k of Object.keys(inv)) {
      if (left <= 0) break;
      if (GROUP_MATCH[group](k) && inv[k] > 0) { const take = Math.min(inv[k], left); inv[k] -= take; left -= take; }
    }
    return left <= 0;
  };
  const steps = (plan && plan.actions) || [];
  for (let i = 0; i < (results || []).length; i++) {
    const r = results[i];
    if (!r || !r.ok) break;
    const a = steps[i];
    if (!a) break;
    const args = a.args || {};
    if (a.action === "collect") {
      const g = r.evidence && typeof r.evidence.gained === "number" ? r.evidence.gained : null;
      const blk = r.evidence && typeof r.evidence.block === "string" ? r.evidence.block : null;
      if (g == null || !blk) { reliable = false; notes.push("collect step " + i + ": no gained/block evidence"); }
      else add(blk, g, i);
    } else if (a.action === "craft") {
      const rec = table[args.item];
      const ops = r.evidence && typeof r.evidence.operations === "number" ? r.evidence.operations : (args.count || 1);
      if (!rec) { reliable = false; notes.push("craft step " + i + ": no parsed recipe for " + args.item); }
      else {
        for (let k = 0; k < ops; k++) {
          for (const ing of rec.ings) {
            const ok = ing.group ? subGroup(ing.group, ing.n) : subOne(ing.name, ing.n);
            if (!ok) { reliable = false; notes.push("craft step " + i + ": sim lacks " + ing.name); }
          }
          add(rec.outItem, rec.out, i);
        }
      }
    } else if (a.action === "place") {
      subOne(args.item, 1);
    } else if (a.action === "store") {
      if (!subOne(args.item, args.count || 1)) notes.push("store step " + i + ": sim short on " + args.item);
    }
    // every other action: no inventory effect the sim tracks
  }
  return { expected: inv, reliable, producer, notes };
}

// Where the base plan's executed prefix should have left him — or null
// when the prefix ends in free movement (collect/descend/flee), where no
// honest expectation exists and the drift check must not fire.
function expectedPosition(base, ctx) {
  let exp = null;
  let free = false;
  const steps = (base.plan && base.plan.actions) || [];
  const n = Math.min(base.executedPrefix || 0, steps.length);
  for (let i = 0; i < n; i++) {
    const a = steps[i];
    const args = a.args || {};
    if (a.action === "goto") {
      if (typeof args.x === "number" && typeof args.z === "number") { exp = { x: args.x, z: args.z }; free = false; }
      else if (args.place === "anchor" && ctx.anchor) { exp = { x: ctx.anchor.x, z: ctx.anchor.z }; free = false; }
      else free = true;
    } else if (["collect", "descend", "flee", "shelter-enter", "shelter-exit"].includes(a.action)) {
      free = true;
    }
  }
  if (free) return null;
  if (exp) return exp;
  const bp = base.baseState && base.baseState.position;
  return bp ? { x: bp.x, z: bp.z } : null;
}

// Surprise invalidation: returns {reason, step} or null. Any hit discards
// the base plan — a citizen may ride a continued plan through routine,
// never through a surprise (DESIGN section 3.2).
function invalidationCheck(base, ctx, cfg) {
  const s = ctx.state || {};
  const b = base.baseState || {};
  if ((s.deaths || 0) > (b.deaths || 0)) {
    return { reason: "death since the base plan was committed (" + (b.deaths || 0) + " -> " + (s.deaths || 0) + "): inventory and position assumptions void", step: 0 };
  }
  const sim = simPrefix(b.inventory || {}, base.plan, base.stepResults || []);
  if (sim.reliable) {
    const actual = s.inventory || {};
    for (const [item, exp] of Object.entries(sim.expected)) {
      if (FOOD_ITEMS.has(item)) continue; // the survival substrate may eat between ticks
      const act = actual[item] || 0;
      if (act < exp) {
        const step = sim.producer[item] != null ? sim.producer[item] : 0;
        return { reason: "inventory contradiction: " + item + " should be >= " + exp + " from the base plan's verified steps, live inventory has " + act + " (producer step " + step + ")", step };
      }
    }
  }
  const expPos = expectedPosition(base, ctx);
  if (expPos && s.position) {
    const d = Math.hypot(s.position.x - expPos.x, s.position.z - expPos.z);
    if (d > cfg.positionDriftBlocks) {
      return { reason: "position drift: " + d.toFixed(1) + " blocks from where the base plan's verified steps left him (" + expPos.x + "," + expPos.z + ")", step: base.executedPrefix || 0 };
    }
  }
  return null;
}

// The mode decision for one derivation. Also owns tick detection (the
// state snapshot is fixed within a tick, so its fingerprint changes
// exactly when a new tick begins) and arm rotation by tick block.
function rollingDecide(ctx) {
  try {
    const cfg = rollingCfg();
    const st = rollingState() || freshRollingState();
    const stageId = ctx.stage && ctx.stage.id;
    const s = ctx.state || {};
    const fp = JSON.stringify({ st: stageId, p: s.position || null, i: s.inventory || null, d: s.deaths || 0, t: s.timeOfDay != null ? s.timeOfDay : null });
    if (fp !== st.rotation.lastFingerprint) {
      st.rotation.lastFingerprint = fp;
      if (!st.rotation.blockStartedAt) st.rotation.blockStartedAt = new Date().toISOString();
      st.rotation.ticksInBlock++;
      if (cfg.arm === "auto" && st.rotation.ticksInBlock > cfg.blockTicks) {
        st.rotation.arm = st.rotation.arm === "B" ? "A" : "B";
        st.rotation.blockIndex++;
        st.rotation.ticksInBlock = 1;
        st.rotation.blockStartedAt = new Date().toISOString();
        rollingLog({ stage: stageId, event: "arm-block", arm: st.rotation.arm, blockIndex: st.rotation.blockIndex });
      }
    }
    const arm = cfg.arm === "auto" ? st.rotation.arm : cfg.arm;
    const dec = { mode: "full", reason: "default", arm, blockIndex: st.rotation.blockIndex, depth: 0, prefixLen: 0, firstInvalidated: null, cfg, st };
    st.counters.derivations++;
    const finish = () => { saveRollingState(st); return dec; };
    if (!cfg.enabled) { dec.reason = "rolling disabled in rolling.json"; st.counters.fulls++; return finish(); }
    if (arm !== "B") { dec.reason = "arm A (full-only control)"; st.counters.fulls++; return finish(); }
    const base = st.base;
    if (!base) { dec.reason = "no committed base plan"; st.counters.fulls++; return finish(); }
    if (base.stageId !== stageId) { dec.reason = "stage boundary (base plan was for " + base.stageId + ")"; st.counters.fulls++; return finish(); }
    const inv = invalidationCheck(base, ctx, cfg);
    if (inv) {
      dec.mode = "invalidated";
      dec.reason = inv.reason;
      dec.firstInvalidated = inv.step;
      st.counters.invalidations++;
      st.base = null; // the base is discarded, not patched
      rollingLog({ stage: stageId, event: "plan-invalidated", reason: inv.reason, step: inv.step });
      return finish();
    }
    if (base.depth >= cfg.maxContinuationDepth) { dec.reason = "continuation depth cap (" + cfg.maxContinuationDepth + ") reached: periodic full re-derivation"; st.counters.fulls++; return finish(); }
    if (st.contFailStrikes >= 2) { dec.reason = "lock-in guard: the same step failed the same way out of two consecutive continuation commits"; st.counters.fulls++; return finish(); }
    const prefix = base.executedPrefix || 0;
    if (prefix < 1) { dec.reason = "no verified prefix (the base plan's first step did not verify)"; st.counters.fulls++; return finish(); }
    dec.mode = "continuation";
    dec.depth = base.depth + 1;
    dec.prefixLen = prefix;
    dec.firstInvalidated = base.firstOpenStep != null ? base.firstOpenStep : prefix;
    dec.reason = base.failedStep != null
      ? "suffix after the first invalidated step (" + base.failedStep + ")"
      : "extension: the base plan verified in full and the stage is still open";
    st.counters.continuations++;
    return finish();
  } catch (e) {
    rollingLog({ event: "plan-mode-error", error: String((e && e.message) || e) });
    return null; // fail-soft: today's behaviour
  }
}

function rollingPending(rdec, plan) {
  try {
    if (!rdec) return;
    const st = rollingState() || freshRollingState();
    st.pending = {
      plan, mode: rdec.mode, depth: rdec.depth || 0, derivedAt: new Date().toISOString(),
      prefixLen: rdec.prefixLen || 0,
      firstInvalidated: rdec.firstInvalidated != null ? rdec.firstInvalidated : null,
      baseCommittedAt: rdec.st && rdec.st.base ? rdec.st.base.committedAt : null,
    };
    saveRollingState(st);
  } catch {}
}

// Called from reflect(): the executed plan becomes the new base, with its
// per-step verification state. Returns the provenance line reflection
// records at the head of the memory entry, or null.
function rollingCommit(ctx) {
  try {
    const st = rollingState();
    if (!st || !st.pending) return null;
    const p = st.pending;
    const planActions = (ctx.plan && ctx.plan.actions) || [];
    const results = (ctx.results || []).map((r) => ({ action: r.action, ok: !!r.ok, error: r.error || null, evidence: r.evidence || null }));
    let prefix = 0;
    while (prefix < results.length && results[prefix].ok) prefix++;
    const failedStep = results[prefix] && !results[prefix].ok ? prefix : null;
    const failSig = failedStep != null ? failedStep + ":" + results[failedStep].action + ":" + String(results[failedStep].error || "").slice(0, 60) : null;
    if (p.mode === "continuation" && failSig) {
      if (st.prevContFailSig === failSig) st.contFailStrikes = (st.contFailStrikes || 0) + 1;
      else { st.prevContFailSig = failSig; st.contFailStrikes = 1; }
    } else {
      st.prevContFailSig = null;
      st.contFailStrikes = 0;
    }
    st.base = {
      stageId: ctx.stage && ctx.stage.id,
      plan: ctx.plan,
      mode: p.mode,
      depth: p.depth || 0,
      committedAt: new Date().toISOString(),
      baseState: {
        inventory: (ctx.stateBefore && ctx.stateBefore.inventory) || {},
        position: (ctx.stateBefore && ctx.stateBefore.position) || null,
        deaths: (ctx.stateBefore && ctx.stateBefore.deaths) || 0,
      },
      stepResults: results,
      executedPrefix: prefix,
      failedStep,
      firstOpenStep: failedStep != null ? failedStep : results.length,
      verdictOk: !!(ctx.verdict && ctx.verdict.ok),
      planLength: planActions.length,
    };
    st.pending = null;
    saveRollingState(st);
    if (p.mode === "continuation") {
      return "[plan provenance — harness record, not Geist's words: CONTINUATION-drafted under rolling plans, depth " + (p.depth || 0) +
        ": a verified prefix of " + (p.prefixLen || 0) + " step(s) of the plan committed at " + (p.baseCommittedAt || "?") +
        " was carried, and only the suffix from step " + (p.firstInvalidated != null ? p.firstInvalidated : "?") + " was re-proposed.]";
    }
    if (p.mode === "invalidated") {
      return "[plan provenance — harness record, not Geist's words: the previous base plan was INVALIDATED by world evidence; this plan was derived in full.]";
    }
    return "[plan provenance — harness record, not Geist's words: derived in full (rolling plans, full mode).]";
  } catch { return null; }
}

// The continuation brief: the previous plan, step-annotated from its
// execution evidence, plus the state delta. The planner is asked for the
// suffix only.
function continuationBlock(dec, ctx) {
  const base = dec.st.base;
  const L = [];
  L.push("== ROLLING CONTINUATION — plan-delta drafting (harness instruction; it changes how you compose this reply) ==");
  L.push("Your previous plan for this stage, committed at " + base.committedAt + ", was executed. Every step is annotated with its VERIFIED status from execution evidence. Steps marked DONE are complete — their effects are already in your current inventory and position (see BOT STATE and the delta below). Do NOT re-propose a DONE step unless the delta shows its effect is gone.");
  base.plan.actions.forEach((a, i) => {
    const r = (base.stepResults || [])[i];
    let tag;
    if (i < (base.executedPrefix || 0)) tag = "DONE (verified)";
    else if (base.failedStep === i) tag = "FAILED" + (r && r.error ? ": " + r.error : "");
    else tag = "NOT REACHED";
    L.push("  step " + i + " [" + tag + "] " + a.action + " " + JSON.stringify(a.args || {}));
  });
  L.push("The first step that did not verify is step " + dec.firstInvalidated + ". Reply with a plan JSON whose actions are ONLY the suffix: the steps from step " + dec.firstInvalidated + " onward — a repair of that step and everything after it. You may reuse, reorder, drop, or replace the old tail steps shown above; they are reference, not obligation. Never repeat a DONE step. Keep the suffix as short as the goal honestly allows.");
  const b = base.baseState || {};
  const s = ctx.state || {};
  const dl = [];
  const items = new Set([...Object.keys(b.inventory || {}), ...Object.keys(s.inventory || {})]);
  const diffs = [];
  for (const it of items) {
    const f = (b.inventory || {})[it] || 0;
    const t = (s.inventory || {})[it] || 0;
    if (f !== t) diffs.push(it + " " + f + " -> " + t);
  }
  dl.push("inventory: " + (diffs.length ? diffs.join(", ") : "unchanged"));
  if (b.position && s.position) dl.push("position: (" + b.position.x + ", " + b.position.y + ", " + b.position.z + ") -> (" + s.position.x + ", " + s.position.y + ", " + s.position.z + ")");
  dl.push("deaths: " + (b.deaths || 0) + " -> " + (s.deaths || 0));
  L.push("== STATE DELTA SINCE THE PREVIOUS PLAN ==\n" + dl.join("\n"));
  return L.join("\n");
}

// ---------------- PLANNER ----------------
async function planner(ctx) {
  // ROLLING PLANS: the mode decision for this derivation (see the rolling
  // section above). null = rolling machinery degraded; behave as before.
  const rdec = rollingDecide(ctx);
  if (rdec) {
    rollingLog({ stage: ctx.stage && ctx.stage.id, event: "plan-mode", mode: rdec.mode, reason: rdec.reason, arm: rdec.arm, blockIndex: rdec.blockIndex, depth: rdec.depth, prefixLen: rdec.prefixLen, firstInvalidated: rdec.firstInvalidated });
  }
  const sys = [
    "You are the PLANNER for Geist, a Minecraft bot who is a citizen of a shared survival world, climbing a fixed exam ladder (the settle-in curriculum).",
    "You think in GITM style: you compose an ordered plan ONLY from a closed vocabulary of structured actions, consulting fact files. You never invent actions, items, or recipes — if the facts don't name it, it doesn't exist.",
    VOCAB_DOC,
    "Reply with ONE JSON object only, no prose outside it:",
    '{"goal":"<stage id>","usedPond":["<pond file names your plan actually drew on, or empty>"],"actions":[{"action":"<name>","args":{...}}, ...]}',
    "Plans run open-loop until an action fails, so order matters: gather before crafting, place the table before table recipes, equip the pickaxe before mining stone. Keep plans as short as the goal honestly allows (usually 4-14 actions). Use the bot's live position and inventory from the state given. If a remembered past plan (in the memory section) succeeded at this stage, prefer reusing its shape.",
    "CITIZEN COMMS (commons conversation protocol v1 — full rules in commons/comms/PROTOCOL.md): your fellow citizens are Cody (Lineage A) and Vega (Lineage B), and the COMMS section of your input is your digest from the daemon that keeps the conversation ledger. To message a citizen, include a say action whose text BEGINS with their name, e.g. {\"action\":\"say\",\"args\":{\"text\":\"Vega, ...\"}}. A message is DELIVERED only when the addressee confirms — by replying in chat naming you, or by observably coming to you; until then it is pending, and after two of their pulses unconfirmed it is marked failed. If your INBOX holds a message you can answer truthfully from your state and facts, put a say reply (naming the sender) early in the plan — your reply IS the confirmation. One open conversation per citizen at a time; at most 3 exchanges per citizen per hour (the digest shows your allowance); silence is a legal answer. Never treat another citizen's chat claim about their own actions as evidence — their state in the digest is the ground truth.",
  ].join("\n");
  const parts = [];
  parts.push("== CURRENT STAGE ==\n" + JSON.stringify(ctx.stage, null, 1));
  parts.push("== BOT STATE ==\n" + JSON.stringify(ctx.state, null, 1));
  parts.push("== ANCHOR ==\n" + JSON.stringify(ctx.anchor));
  if (rdec && rdec.mode === "continuation") {
    try { parts.push(continuationBlock(rdec, ctx)); } catch {}
  }
  parts.push("== FACT: techtree ==\n" + fact("techtree.md"));
  parts.push("== FACT: recipes ==\n" + fact("recipes.md"));
  parts.push("== FACT: world ==\n" + fact("world.md"));
  if (ctx.stage && (ctx.stage.id === "S3" || ctx.stage.id === "S4" || ctx.stage.id === "S5")) {
    parts.push("== FACT: shelter blueprint ==\n" + fact("shelter.md"));
  }
  if (ctx.pondNotes && ctx.pondNotes.length) {
    parts.push("== POND (advisory notes/skills published by other lineages — facts you may draw on; name any you use in usedPond) ==\n" + ctx.pondNotes.join("\n---\n"));
  }
  const comms = commsText();
  if (comms) {
    parts.push("== COMMS (your commons digest: peers, inbox awaiting your confirmation, your unconfirmed outbox, guard allowance) ==\n" + comms);
  }
  if (ctx.memories && ctx.memories.length) {
    parts.push("== MEMORY (your own past plans and outcomes, most relevant first) ==\n" + ctx.memories.join("\n---\n"));
  }
  if (ctx.feedback) {
    parts.push("== FEEDBACK YOU MUST ANSWER ==\n" + ctx.feedback);
  }
  const out = await chat([{ role: "system", content: sys }, { role: "user", content: parts.join("\n\n") }], { maxTokens: 1600, temperature: 0.3 });
  const parsed = parsePlan(out);
  if (parsed.plan) rollingPending(rdec, parsed.plan);
  return { raw: out, ...parsed };
}

// ---------------- CALCULATOR ----------------
// Validates counts and satisfiability against the facts; the GITM "calculator"
// role. It may revise quantities/targets; it may NOT change the strategy or
// introduce new action types beyond what the planner used.
async function calculator(ctx) {
  const sys = [
    "You are the CALCULATOR for Geist, a Minecraft bot. A planner has proposed a plan composed of a closed action vocabulary. Your job is arithmetic and satisfiability, not strategy:",
    "- Using the recipe facts, check every craft action: will the inventory PLUS the plan's own earlier collect/craft steps provide the ingredients, in the right counts?",
    "- Check collect counts are enough for the plan's later steps (e.g. planks needed = 4 per log; a wooden pickaxe needs 3 planks + 2 sticks; sticks need 2 planks per 4 sticks).",
    "- Check place/store targets exist in the plan's world (a chest can't be stored into before it is placed, etc.).",
    "Reply with ONE JSON object only:",
    '{"ok":true,"revised":null} if the plan is satisfiable as written, or',
    '{"ok":true,"revised":{...the full corrected plan object...}} if only counts/targets needed fixing, or',
    '{"ok":false,"reason":"<one precise sentence: what is unsatisfiable and what the planner must change>"}',
    VOCAB_DOC,
  ].join("\n");
  const user = JSON.stringify({
    stage: ctx.stage, inventory: ctx.state && ctx.state.inventory, position: ctx.state && ctx.state.position,
    plan: ctx.plan,
  }, null, 1) + "\n\n== FACT: recipes ==\n" + fact("recipes.md") + "\n\n== FACT: techtree ==\n" + fact("techtree.md");
  const out = await chat([{ role: "system", content: sys }, { role: "user", content: user }], { maxTokens: 1400, temperature: 0.2 });
  const m = out.match(/\{[\s\S]*\}/);
  if (!m) return { ok: false, reason: "calculator returned no JSON", raw: out };
  let obj;
  try { obj = JSON.parse(m[0]); } catch (e) { return { ok: false, reason: "calculator JSON malformed: " + e.message, raw: out }; }
  if (obj.ok && obj.revised) {
    const v = validatePlan(obj.revised);
    if (!v.plan) return { ok: false, reason: "calculator's revised plan failed validation: " + v.errors.join("; "), raw: out };
    return { ok: true, revised: v.plan, raw: out };
  }
  return { ok: !!obj.ok, reason: obj.reason || null, revised: null, raw: out };
}

// ---------------- REFLECTION ----------------
// One memory entry per executed plan: (situation, plan, outcome) as prose —
// GITM's text memory, JARVIS's triple in narrative form.
async function reflect(ctx) {
  const sys = [
    "You are Geist's memory. After each plan you write ONE short memory entry (3-5 sentences, plain prose) recording: the situation (stage, place, what he had), the plan he ran (compressed to its shape, not every step), and the outcome (what the world evidence showed, including the exact failure if there was one).",
    "Write it so a future planner can reuse it: name concrete numbers (how many logs, where the trees were, what ran out). No JSON, no markdown headers — just the paragraph. The harness adds the header.",
    "COMMS HONESTY (protocol v1): if the input's commsOutboxUnconfirmed is non-empty, those are messages Geist sent that their addressees have NOT confirmed. The entry must record them as unconfirmed — an unconfirmed message is not a delivery; never write as if the other citizen heard, agreed, or will act.",
  ].join("\n");
  const digest = commsDigest();
  const user = JSON.stringify({
    stage: ctx.stage && ctx.stage.id, stateBefore: ctx.stateBefore, plan: ctx.plan,
    results: ctx.results, stageVerdict: ctx.verdict || null,
    commsOutboxUnconfirmed: digest && digest.outbox ? digest.outbox.map((m) => ({ to: m.to, text: m.text, sentAt: m.ts })) : [],
    commsInboxPending: digest && digest.inbox ? digest.inbox.map((m) => ({ from: m.from, text: m.text })) : [],
  }, null, 1);
  const out = await chat([{ role: "system", content: sys }, { role: "user", content: user }], { maxTokens: 350, temperature: 0.4 });
  // ROLLING PLANS: committing the executed plan as the next base happens
  // here, at reflection time (the only point that knows the final,
  // post-calculator plan and its step results). The provenance line is
  // recorded at the head of the memory entry; the entry itself is
  // otherwise exactly Geist's own reflection.
  const provenance = rollingCommit(ctx);
  return (provenance ? provenance + "\n" : "") + out.trim();
}

function appendMemory(header, body) {
  fs.mkdirSync(path.dirname(MEMORY_FILE), { recursive: true });
  fs.appendFileSync(MEMORY_FILE, `\n## ${header}\n${body}\n`);
}

// Retrieval: keyword overlap over the entry headers+bodies (recency as tiebreak).
function retrieveMemories(situationText, k = 3) {
  let raw;
  try { raw = fs.readFileSync(MEMORY_FILE, "utf8"); } catch { return []; }
  const entries = raw.split(/\n## /).slice(1).map((e) => "## " + e.trim());
  if (!entries.length) return [];
  const words = new Set(String(situationText).toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2));
  const scored = entries.map((e, i) => {
    const ew = new Set(e.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2));
    let score = 0;
    for (const w of words) if (ew.has(w)) score++;
    return { e, score: score + i * 0.01 };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, k).map((s) => s.e);
}

module.exports = { planner, calculator, reflect, appendMemory, retrieveMemories, parsePlan, validatePlan, fact, _rolling: { recipeTable, simPrefix, invalidationCheck, rollingCfg } };
