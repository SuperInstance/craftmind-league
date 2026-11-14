# NOTICING HOUSEKEEPING — the tool's two self-inflicted defects, repaired

**Filed:** 2026-11-10 (repair slot for programme day 2026-11-09).
**Routed by:** `commons/noticing/report-2026-11-09.md` — note 2's named action ("repair the flag (any non-200 defeats the sentence) in the duty's next repair slot") and its actionable item 4; and `pulse/DEATHS-SEAM-REPAIR-20261109.md`, "Incident owned by this lane" (the bare run that overwrote the filed final).
**Scope:** `commons/noticing/noticing.py` only. The filed final `report-2026-11-09.md` was not edited — it is a sealed record, and its false flag line stands in it, corrected by its own note 2 exactly as filed. No citizen was woken; no other store was written except this filing and one ledger line.
**Backup:** pre-patch source preserved at `commons/noticing/noticing.py.bak-pre-housekeeping-20261109` (sha256 `a16f8122bc1bb495906de047cef8f0ea33c6a72282d060ae06545d81b69e5fee`). Patched source sha256 `6376f9a1a58739a4bf99622a6c23940aec661a7883a85160d1b4aa20c2c43f88`; compiles clean (`py_compile`).

## Defect 1 — the false flag

**The defect.** The rule-flagged section ended, whenever the 429 count was zero, with: "No budget denials today: every metered call was served (all 200s above)." The flag counted only 429s. Over the 2026-11-09 window the tool's own consumption table reads 397 calls, 327 ok — the other 70 are day 12's tail: instant HTTP-400 rejections at the route (04:33–04:37Z, 3.7 mind-seconds and zero tokens across all 70, against 6 served in the same minutes, per the final's note 2). The sentence was false over the table printed directly above it.

**The fix (flag logic only).** The consumption aggregation now also derives, from the same per-identity status counters the table is built from: `tot_ok`, `tot_not_served` (calls − ok), and `status_totals` (the window-wide status counter). The closing flag is then decided by what the table shows:

- If any call was not served, the flag reads "**Not served:** N of M metered calls were not served today (⟨status⟩ ×⟨count⟩, …)" — every non-200 status class the table enumerates feeds the breakdown — followed by either the budget-denial sentence (when some of the failures are 429s, counted and named as such) or "; none of them is a budget denial (429)", and the standing sentence: "A call the route rejected is not a call served: the served claim is made only when the table above shows every call served."
- The original sentence — "No budget denials today: every metered call was served (all 200s above)." — is printed **only** when the window has at least one call and literally every call was served, so the wording is again derivable from the table it summarises.
- A window with no metered calls at all gets its own honest line ("No metered calls today: the governor ledger records nothing served, denied, or failed in this window.") instead of a vacuous all-served claim.

## Defect 2 — the overwrite hazard

**The defect.** `noticing.py` run bare (no `--out`) defaulted its destination to the canonical filed report path for the window, `commons/noticing/report-<day>.md`. During the seam repair's verification, one bare run overwrote the filed final `report-2026-11-09.md` (17,622 B) with a machine-only regeneration (4,919 B); the final survived only because its components happened to still exist in `/tmp` and could be restored byte-exact. As the seam filing's parent note put it: a report generator whose default output IS the filed report will eventually be run bare.

**The chosen shape: refuse-to-overwrite the canonical path without an explicit flag.** The destination is computed as before (explicit `--out`, else the canonical path). If the resolved destination **is** the canonical path, that file **already exists**, and `--force-overwrite` was not passed, the run prints a REFUSED message to stderr, writes nothing, and exits 2. Any other destination (a scratch `--out`) overwrites as before.

**Why this shape, over defaulting to a non-canonical destination.** The duty's documented after-close workflow (this directory's README, "Cadence") is exactly a bare run: `noticing.py --day YYYY-MM-DD [--notes FILE]`, and the final IS written through the canonical path deliberately by that run — on its first run the canonical file does not yet exist, and under this fix that write proceeds untouched, README unchanged. Defaulting bare runs to a `-machine` sibling or stdout would silently change the chartered command, leave the canonical write to a second manual step that can be forgotten or half-done, and create two canonical-looking artefacts per day. The guard instead makes the destructive case — a report already filed at that path — impossible to reach by accident, while a deliberate replacement remains one explicit flag away (`--force-overwrite`, whose help text and the module docstring both state what it permits).

## The diff, line-class by line-class

Changed, in `noticing.py` and nowhere else:

1. **Module docstring** — usage gains `[--force-overwrite]` and a paragraph stating the destination discipline and why it exists.
2. **Argument parsing** — one new flag, `--force-overwrite` (store_true).
3. **Consumption totals** — three derived values added beside the existing `tot_calls` / `tot_ms` / `tot_denied`: `tot_ok`, `tot_not_served`, `status_totals`, all computed from the aggregation the table already builds.
4. **The closing rule-flag** — the `if tot_denied / else all-served` block replaced by the not-served / all-served / no-calls decision above.
5. **The destination block** — the canonical path is named once; the refuse-to-overwrite guard (exit 2, nothing written) sits between destination resolution and the write.

Deliberately **not** changed: the tolerant JSONL parsers; the books-consulted list; the consumption table's rendering (its `denied` column remains the 429 count, labelled "(429)" in the Total line — accurate as labelled; the defect was the flag's inference from it, not the column); the Total line itself; the deaths derivation, including its mirror of `lib/deaths.js` and the seam repair's third source class in that library; the contributions section; the other rule-flags (top imbalance, heaviest calls, cast identity integrity); the `--notes` channel; the kill-criterion footer; and the stdout summary line.

## Proof

**(a) Over the real store.** `python3 noticing.py --day 2026-11-09 --out /tmp/noticing-housekeeping-scratch-2026-11-09.md` → `wrote … (4986 bytes)`, `window calls=397 mind_s=3005.8 denied=0 deaths=20`. The scratch report's flagged line, verbatim:

> - **Not served:** 70 of 397 metered calls were not served today (400 ×70); none of them is a budget denial (429). A call the route rejected is not a call served: the served claim is made only when the table above shows every call served.

The figures reconcile with the filed final's tables: 397 calls / 327 ok in its consumption table (397 − 327 = 70, now named as 400 ×70); **20 deaths in window, 136 total** (the rebuilt record, post-seam-repair — the derivation is untouched and lands where the seam repair left it); the governor ledger reads **2,614 lines** in the scratch run's books-consulted, the same 2,614 the final reports (2,399 at the partial + 215 failover lines). One expected difference, stated not smoothed: the scratch run's books-consulted counts the *pulse* ledger at 366 lines against the final's 358, because the ledger has grown since the final was run (post-close filings through line 367); its window-strict figure is unchanged at 48 lines written in window, kinds identical.

**(b) The bare-run test.** In a scratch fixture home (`/tmp/nh-home`, league stores symlinked, the noticing directory a real copy) holding a byte-identical copy of the filed final: a bare run `--day 2026-11-09` printed the REFUSED message and exited **2**; the fixture report's sha256 was `1672e0300e71b27e074065339e45a9fa5fdc03585847417306caa99fb77b3f1b` **before and after** — the filed bytes survive a bare run. The same test then showed the preserved workflow: a bare run for a day with no existing report (`--day 2026-11-05`) wrote its canonical file normally (exit 0), and `--day 2026-11-09 --force-overwrite` replaced the fixture deliberately (exit 0). Finally, a bare run in the **real** tree was also refused (exit 2), with the real report's hash identical before and after (below).

**(c) The sealed final, untouched.** `commons/noticing/report-2026-11-09.md` sha256 — before this lane's work: `1672e0300e71b27e074065339e45a9fa5fdc03585847417306caa99fb77b3f1b`; after the patch, after every proof run above including the real-tree bare run: `1672e0300e71b27e074065339e45a9fa5fdc03585847417306caa99fb77b3f1b`. Byte-identical, 17,622 B throughout.

## Standing practice, from here

Verification runs of this tool go to a scratch `--out`, as the seam filing already ruled — and now the tool itself refuses the accident even when the rule is forgotten. A filed final is replaced only deliberately: `--force-overwrite`, with the replacement's reason filed in this directory, in the open.
