'use strict';
/**
 * tastes.js — CODY'S TASTES, the reader (Voice+Tastes layer,
 * 2026-11-08; claim: pulse/ledger.jsonl cody-voice-tastes-claim-20261108).
 *
 * Loads pulse/cody-tastes.json (mtime-cached) and exposes the small
 * decision hooks the character loop and the actor consult:
 *   - woodRank / rankLogNames: tree-species ranking for forage and
 *     canopy choice (oak first — evidenced, see the JSON).
 *   - placeNameFor(pos): named-place resolution, so the loop and the
 *     actor can say "the dip" instead of coordinates when the
 *     position class matches.
 *   - preferredPlank(inv, minCount): the build-material choice —
 *     taste-preferred plank species when he holds enough of it.
 *   - promptSummary(): the taste block for the actor's prompt.
 *
 * DEFAULT-OFF-SAFE: a missing/unreadable/corrupt tastes file (or
 * CODY_TASTES=0) makes every hook return the neutral value, which is
 * exactly the pre-layer behaviour. Hooks never throw.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'cody-tastes.json');
let cache = null;
let cacheMtime = -1;

function load() {
  if (process.env.CODY_TASTES === '0') return null;
  try {
    const st = fs.statSync(FILE);
    if (!cache || st.mtimeMs !== cacheMtime) {
      cache = JSON.parse(fs.readFileSync(FILE, 'utf8'));
      cacheMtime = st.mtimeMs;
    }
    return cache;
  } catch { return null; }
}

function speciesOf(name) {
  const m = /^(dark_oak|oak|birch|spruce|jungle|acacia|mangrove|cherry|pale_oak)_/.exec(String(name || ''));
  return m ? m[1] : null;
}

function woodRank(species) {
  const t = load();
  if (!t || !t.wood || !Array.isArray(t.wood.preference)) return 99;
  const i = t.wood.preference.indexOf(species);
  return i < 0 ? 50 : i;
}

// Stable-sort block/item names so taste-preferred wood comes first;
// names with no wood species keep their relative order at the end.
function rankLogNames(names) {
  return (names || []).map((n, i) => ({ n, i, r: woodRank(speciesOf(n)) }))
    .sort((a, b) => (a.r - b.r) || (a.i - b.i)).map((o) => o.n);
}

function placeNameFor(pos) {
  const t = load();
  if (!t || !pos || !Array.isArray(t.places)) return null;
  for (const p of t.places) {
    const b = p.box || {};
    if (pos.x >= b.x0 && pos.x <= b.x1 && pos.z >= b.z0 && pos.z <= b.z1 &&
        (b.yMax == null || pos.y <= b.yMax)) {
      return { name: p.name, phrase: p.phrase || p.name };
    }
  }
  return null;
}

function preferredPlank(inv, minCount) {
  const t = load();
  if (!t || !t.buildMaterial || !Array.isArray(t.buildMaterial.plankPreference)) return null;
  for (const pn of t.buildMaterial.plankPreference) {
    if (((inv || {})[pn] || 0) >= (minCount || 1)) return pn;
  }
  return null;
}

function promptSummary() {
  const t = load();
  return t && t.promptSummary ? t.promptSummary : '';
}

module.exports = { load, speciesOf, woodRank, rankLogNames, placeNameFor, preferredPlank, promptSummary };
