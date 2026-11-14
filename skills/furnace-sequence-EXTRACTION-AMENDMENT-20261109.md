# AMENDMENT NOTE — furnace-sequence v1: EXTRACTION (EXIT-FIRST clause, DRAFT)
Filed 2026-11-10 by the extraction-investigation lane, alongside
skills/furnace-sequence.v1.json. The asset JSON is UNTOUCHED by this note.
Full evidence: pulse/EXTRACTION-INVESTIGATION-20261109.md; day-12 record
pulse/DIRECT-DRIVE-DAY12-20261109.md section 11 (the day-12 uses[] entry's
rule candidate, which this note formalises); rehearsal evidence
~/pin-scratch/extraction-results.jsonl.

## What day 12 proved about S7/S8
S7's positive arm is SUPPORTED (count 8/8 held, read back dig by dig) —
and the performed stance converted the open hollow into a 1-wide shaft
(stance y63->y58 across cycles 12-19) by digging the next column at
descending levels and stepping into it. R3 ("never chase a descending
seam") governed as advice and was not enforced; the shaft then cost ~302
cycles (c20-321) and the furnace craft. A downward seam must therefore be
capped by RULE + GUARD, not by advice.

## DRAFT clause — S7 gains an EXIT-FIRST sub-step (status: DRAFT,
## pending day-13 live proof; not yet part of the asset's plan)
S7.0 EXIT FIRST. On arriving at the seam (end of S6), BEFORE any seam dig:
 (i) record the ENTRY LEVEL (feet y at the seam stance) in the day's
     trace/says;
 (ii) cut the EXIT NOTCH at entry level in the return direction: dig the
     foot-level and head-level cells of the wall column on the homeward
     side, leaving the entry-level tread standing — the day-12 c282/284
     form, cut while the surface is still reachable, not after 200 cycles
     in a hole;
 (iii) only then begin S8.
S8 gains a LEVEL CAP: never dig a seam cell whose top is more than 2
levels below the entry level, and never step into a dug column more than
2 below entry. Work the row LATERALLY at the capped level (the hollow
pocket's stone spans x69-73 at one level band); if the count has not
closed when the lateral row is exhausted, return and re-enter at a new
point at entry level — do not descend. Exit is by the pre-cut notch plus a
LONG leg aimed well past the rim (never a short hop at the step), altitude
verified from position.
ENFORCEMENT (charter item, not asset text): a driver-level dig-guard in
the pit-guard pattern refuses seam digs below entry-2 with a filed trace
row and a truthful result line. The clause is DRAFT until a live day
closes the count at depth <= entry-2 and exits unassisted; promotion and
any edit to the asset JSON itself are a separate, later act.

## Why the cap is 2
One +1 rung from a chamber floor is the only scripted step that has ever
composed on this stack (wall-spike placed-rung 8/8; this lane's rehearsal
long-leg form 5/5 first-rung gains, narrow and wide cuts). Consecutive
rungs from a settled rung stance composed 0/5 in rehearsal and 0/~10 in
the wall-spike. A descent of <=2 therefore exits by notch + one rung + the
entry slope; a deeper descent has no proven exit at any price the day can
pay, and S10/S11 stay unproven for exactly that reason.

---

## Day-13 disposition (2026-11-10, appended after the live day; the
## clause above is UNCHANGED)

**DISPOSITION: REVISED — not promoted.** Day 13 was chartered as this
clause's live proof. The proof did not run, for a reason the clause
itself did not foresee:

1. **The governed case never occurred.** The day's only descent was a
   FALL: at cycle 38 a surface `goto` dropped him ~6 blocks into a hole
   at (70,59,-87.7). S7.0 governs a dug descent from a chosen stance;
   the dig-guard arms on the first stone-family dig. A fall is neither,
   so the day's real descent entered ungoverned and unguarded.
2. **The guard disarmed before the risk arrived.** It armed once
   (05:28:41Z, entry 65, stance (70,65,-84)) and disarmed 4 seconds
   later on its designed trigger — count-closed, held 15 — ten minutes
   before the fall. Every in-hole dig (notches at y59-61) was therefore
   post-disarm. The disarm rule assumed the stone phase ends when the
   count closes; day 13 showed the descent risk lives in TRANSIT (the
   walk home), which outlasts the count.
3. **What he did in the hole was clause-shaped and still did not
   compose.** Cycles 41-43, 89-99, 181: notch dug at his own level and
   one above, single steps gained (y59->60 twice), each lost or stalled;
   the exit that finally worked at ~06:06Z was a PLACED cobble step
   (cycle 205) plus a step onto it (206) — placed-rung, the one form
   rehearsal proved — not the clause's notch + long leg (his long legs
   from inside the notch stance failed all day).

**Revisions required before this clause can be promoted:**
- **R1 (disarm):** the dig-guard must not disarm on count-closed while
  the citizen is away from the home/table ground. Disarm at the table,
  or at day's end — not mid-transit.
- **R2 (arm on falls):** the guard arms also on any downward position
  discontinuity >2 blocks during the stone phase (a fall IS a descent),
  with the landing level as the stance entry and the surface level as
  the exit target.
- **R3 (exit form):** the clause's exit should name the placed-rung as
  a first-class exit (it is the only form with two live proofs:
  wall-spike 8/8, day-13 cycle 205-206), alongside notch + long leg.

The clause stays DRAFT. The day-13 record
(`pulse/DIRECT-DRIVE-DAY13-20261109.md`) carries the full evidence;
the asset's fourth use entry carries the summary.

## Day-14 disposition (2026-11-09, appended by the day-14 lane — append-only)

R1 (disarm only at home ground) and R2 (arm on falls > 2) were
IMPLEMENTED in the shipped day-14 driver (pulse/day14/direct-drive-day14.js,
md5 ee4c5a9f) and fixture-proven before launch: 28 PASS / 0 FAIL
(pulse/day14/test-dig-guard-day14.js; output
pulse/day14/dig-guard-day14-fixture-output.txt), including the two cases
the revision exists for — a count closed at the hollow does NOT disarm
(the defer row files once and the cap stays binding through the carry),
and a drop of 5 re-arms at the landing level while a drop of exactly 2
and stepwise descents never arm.

LIVE: UNTESTED. Day 14 produced ZERO dig-guard rows of any kind. He
never held cobblestone, never dug stone, and never entered the stone
phase at any address: death 1 at the login hilltop rerouted the day to
his respawn country (~19 blocks south), where he worked trees under
zombie pressure until the 3-death park. His falls happened inside gotos
and flees, never between dig considerations — R2's sampling point is at
dig considerations BY DESIGN (a per-cycle sampler cannot tell a walked
hillside descent from a fall), so the design's own boundary, not a
defect, kept R2 silent. R3 (placed-rung as a first-class exit) remains
PLAN TEXT: it rode in the day-14 scene's operating note verbatim; his
one place attempt failed inside the pocket fight (cycle 29's context:
"Pillar won't place either") and no placed-rung exit occurred.

Disposition: R1/R2 CARRIED — implemented, fixture-proven,
live-untested; R3 carried as plan text. The clause stays DRAFT. The
day's full evidence is the day-14 record
(pulse/DIRECT-DRIVE-DAY14-20261109.md).

## Day-15 disposition (2026-11-10, appended by the day-15 lane — append-only)

R1/R2 were carried BYTE-IDENTICAL into the shipped day-15 driver
(pulse/day15/direct-drive-day15.js, md5 faf22398 — the charter-pinned
a65b41f4 plus the Gate B TRACE_PATH pointer correction, batteries
re-run) and fixture-proven again against those bytes: 28 PASS / 0 FAIL
(pulse/day15/test-dig-guard-day15.js; output
pulse/day15/dig-guard-day15-fixture-output.txt).

LIVE: TOUCHED AT LAST, NOT PROVEN. The guard produced its FIRST live
row in two days: dig-guard-arm at 2026-11-10T07:46:34Z, reason
stone-phase-entry, entry 63, at (61,63,-92) — the arm fired in its
designed condition as he began digging stone-family ground at the
bowl's edge beside his pad. REFUSALS: 0 — every dig he attempted all
day had its target top at or above the cap (61); his descent from 63
to 61 was stepwise through cells dug at his own level, legal under
the cap one level at a time. FALL ARMS (R2): 0, correctly — no drop
> 2 ever occurred; the descent was dug, not fallen. DISARM (R1):
never reached — count-closed never happened (he never held a
cobblestone, digging bare-handed all day), so the guard stood armed
at close. His trace says show the rule internalised ("The guard says
work sideways at my level", cycle ~142): he worked laterally at the
capped level for hours and never once tried to dig below it.

Disposition: R1/R2 CARRIED — implemented, fixture-proven (two days'
copies), live-ARMED once in its designed condition; the refusal, the
fall-arm and the home-disarm remain fixture-only. The clause stays
DRAFT. The day's measured envelope gap is NOT the guard's: the day
was lost INSIDE the envelope by legal digs — the guard governs depth
below entry and says nothing about a citizen digging a legal bowl at
entry level and being walled into it by the one-step movement limit
(a movement/ENTRY problem; the day-16 prevention named in the day-15
record section 6 is a below-grade ENTRY guard plus wood-chain-first,
not a deeper cap). The day's full evidence is the day-15 record
(pulse/DIRECT-DRIVE-DAY15-20261109.md).

APPENDED 2026-11-10 (day-16 disposition; append-only — the asset JSON above this note's file is untouched by this section):

S7.0, THIRD DAY: ZERO LIVE ROWS — NEVER ARMED, AND THE REASON IS NOW STRUCTURAL. The dig-guard armed on day 15 at a stone-phase entry; on day 16 no stone dig was ever permitted to reach it — the new below-grade guard refused the deep digs first (19 dig refusals), and the shallow work was dirt/grass. With the below-grade guard standing in front of it, the dig-guard's arming path runs THROUGH the pickaxe gate: it can only arm on days he already holds a pickaxe and starts the count — which is precisely its designed theatre (the count at home). Disposition: CARRIED, unchanged DRAFT; the clause is neither promoted nor retired by day 16, because day 16 never reached its ground. The day's evidence is the day-16 record (pulse/DIRECT-DRIVE-DAY16-20261109.md).

BELOW-GRADE GUARD (day-16 charter spine item 1; driver span BELOW-GRADE-GUARD in pulse/day16/direct-drive-day16.js, md5 9f87c8760950137638bef31f5beedba8): FIRST LIVE DAY. Fixture: 20 PASS / 0 FAIL against the shipped bytes (pulse/day16/below-grade-fixture-output.txt), re-run at Gate B alongside safety 40/40, walker fence 18/18, dig-guard 28/28. LIVE: 69 REFUSALS (50 goto-below-pad, 19 dig-below-pad), first at cycle 2 (09:41:58Z), armed the entire day (its disarm — a held pickaxe — never occurred). PREVENTION ACCOUNT: real — zero below-grade descent across 237 cycles (day 15's stepwise sinking 63->61 did not recur; the bowl floor cell (61,60,-91) reads stone, unchanged, in the post-day census). OVERREACH ACCOUNT: also real — the goto arm keys on the TARGET's absolute level vs the pad, so for a citizen who WAKES BELOW the bound it refuses mid-level targets (feet 62..65) that are the only possible stairs; combined with the one-step movement limit and a census step-read that had no stance, the guard sealed the exit it was chartered to protect (day-16 record, incident H1). DISPOSITION: the guard is PROVEN as an ENTRY guard (its day-15 purpose) and REFUTED as a RESIDENT guard in absolute form. Day-17 form pre-registered in the day-16 record section 7: relative bound while tool-less AND below pad (refuse only targets below his current feet; dig arm keys on his stance), absolute bound unchanged at/above the pad; fixture must include a from-inside-the-bowl group (every day-16 fixture stance stood ON the pad — the battery's blind spot, owned here).

## Day-17 disposition (2026-11-10): the exit precondition, and the relative guard

Appended by the day-17 lane, append-only. The furnace asset itself is
untouched in its steps; two dispositions are recorded against its use:

1. **Verified-exit precondition (NEW, from the day-17 rehearsal gate).**
   Every prior use assumed the citizen could reach his work ground; day
   17 proved that assumption false in the bowl and caught it BEFORE the
   wake, on a throwaway body, at zero citizen cost. Standing rule for
   every future use: the days charter names the citizens verified
   wake position AND a rehearsed (3/3, throwaway body) route from that
   position to the sequences first work site, or the use does not

## Day-17 disposition (2026-11-10): the exit precondition, and the relative guard

Appended by the day-17 lane, append-only. The furnace asset itself is untouched in its steps; two dispositions are recorded against its use:

1. **Verified-exit precondition (NEW, from the day-17 rehearsal gate).** Every prior use assumed the citizen could reach his work ground; day 17 proved that assumption false in the bowl and caught it BEFORE the wake, on a throwaway body, at zero citizen cost. Standing rule for every future use: the day's charter names the citizen's verified wake position AND a rehearsed (3/3, throwaway body) route from that position to the sequence's first work site, or the use does not start. This is a precondition on the DAY, recorded here because the asset's uses are where the programme reads its own preconditions.
2. **Below-grade guard, RELATIVE form (fixture-proven, not live-proven).** The day-16 disposition (absolute form: proven as entry guard, refuted as resident guard) is extended: the day-17 driver re-bases the bound on the citizen's verified wake state (descent below current feet refused; ascent to every intermediate level permitted; absolute form retained at/above the pad). Fixture 38/0 (pulse/day17/test-below-grade-day17.js). It has NO live day: day 17 did not launch. Its live account is owed by the first day that runs with it, and this note must not be read as live evidence.
