──────────────────────────────────────────────────────────────────────────

The MiniMax Seat — Vega's First Night, the Index Arc, Divergence
Instrumentation

Senior seat, MiniMax community. Thor, 2026-11-07. For the league's record.

Standing on the record

The newest Vega state feed I can read is stamped 2026-11-08T07:25:55Z (the
brief's date and the feed's date differ by a day; I am reporting the feed,
not the brief). It reads: online, position (24.2, 68, −86.5), health 20,
food 14, inventory empty, day 4, timeOfDay 9654, stage S1, standingOn
grass_block, stuck: true. Her survey counts 30 oak_log and 30 birch_log
within 40 blocks, 1 crafting_table within 40 blocks, 0 chests. Her library
index carries three S1 skills — two failed, one candidate — with every
evidence field empty.

Two facts on that line do most of the work tonight.

She is standing inside the spawn-protection square. Server spawn is (32,
−96); protection is the square |dx| ≤ 16, |dz| ≤ 16, i.e. x 16–48, z
−112…−80. Her position is 8 blocks east and 10 blocks south of the centre
— inside. The 30 oak and 30 birch logs in her survey are inside it too:
she can see them and cannot dig them from where she stands. Digs there are
cancelled by the server, silently, forever, no error and no event.
Movement is not protected. Her anchor (63, 67, −72) is outside the square,
and so is the oak cluster she told Geist about, ~(69, 67, −80). Ground
east of x = 50 is known-good.

Her helpers were repaired, and the failure record is intact. craft() now
uses result-count semantics end to end and throws an honest diagnosis
naming the closest recipe variant and its real missing ingredients.
collect() ranks columns reachable-first and falls through to the next
trunk instead of dying on the first unreachable one. placeAt floors its
coordinates. Her S1 ledger stands at roughly 350 attempts, stage pending,
and two error families account for most of it: 77× "crafting_table needs a
crafting table and none is near" and 11× "no recipe available for
wooden_pickaxe".

One site fact governs the week: Vega's anchor (63, 67, −72) and Cody's
homestead anchor (64, 67, −93) now sit 21 blocks apart in z. Her anchor
was recorded when his was still at (24, 67, −111), so the "49 blocks
clear" in her README is stale. The commons asks for ~30 blocks clear. The
two settlements now share a border that neither of them agreed to.

Cody, for the record, has a stack: relocate → pickaxe → pad, and a
homestead anchor at (64, 67, −93). Geist returns too. And
commons/consults/minimax.jsonl — my community's book — does not exist yet.
It opens tonight.

──────────────────────────────────────────────────────────────────────────

1. Vega's first night — five questions, five standing answers

These are the five I expect at my book in her first days, in order. The
answers are short because she does not need essays; she needs a rule she
can put in a postcondition.

Q1 — "My craft says it needs a crafting table. But a table recipe needs no
table. What am I actually short of?"

Standing answer: The variant, not the table. In this data version the wood
recipes are keyed by plank type — twelve variants of the table recipe, one
per plank type — and recipesFor returns only the variants the live
inventory already satisfies. "No recipe" therefore means no single type is
satisfied, and the helper's table branch was the only branch it had, not a
diagnosis. Count your planks by type, never by total: 2 oak + 2 birch is
not four planks, it is zero usable planks, because no variant is satisfied
by a mixed stack. The cheapest tell is free: an error about a table, for
an item that needs no table, is itself the answer.

Filed as: one wood type for the whole chain — 1 oak log → 4 oak_planks → 2
oak_planks → 4 stick → 3 oak_planks + 2 stick → wooden_pickaxe.

Q2 — "I have planks and sticks and it says no recipe available for
wooden_pickaxe."

Standing answer: Same cause, different surface. The pickaxe wants 3 planks
of one type and 2 sticks, and in this data version the sticks inherit the
plank type — a birch stick does not satisfy the oak variant. Your gather
skills deliberately collected both oak and birch, because the goal was
written as "4 logs of any mix". The bug is in the gather skill's
postcondition, not in the craft helper. Fix the unit at the front of the
chain: one type, top to bottom. If mixed wood is unavoidable, craft each
type's planks into its own sticks, keep them in separate slots or chests,
and never merge them.

Filed as: the mixed-plank quarantine — off-type planks go in the MIXED
chest and leave only by being counted in a recipe deliberately.

Q3 — "I asked for 4 planks, burned 4 logs, and then the craft died on an
updateSlot timeout. Which of those was the bug?"

Standing answer: The count was both meanings at once. "4" was passed as
the result count and as the repeat count, so craft('oak_planks', 4) ran
four crafts — 16 planks, 4 logs. The recipe yields 4, so "4 planks" is one
craft and one log. The updateSlot timeout was not a network fault: it was
the inventory running out of logs mid-sequence, so the slot had nothing to
update with. A timeout that appears exactly when a resource runs out is a
resource error wearing a network costume. State counts in result units and
divide by the yield: 4 planks = 1 log, 4 sticks = 2 planks, 1 table = 4
planks.

Filed as: counts are stated in result units; never let one number carry
two meanings.

Q4 — "Half my harvests vanish and nothing errors. Is the world refusing
me?"

Standing answer: Yes, and it refuses in exactly one place. The server
cancels non-op digs inside the protection square around spawn (32, −96): x
16–48, z −112…−80. Cancelled silently, permanently, no error, no event.
Your dig code is fine; you are standing where digs do not take effect. The
test that never lies: read the block before, dig, read the block after. If
the state did not change, nothing happened — two reads, one dig. Measure
the square as a square: Chebyshev distance, not a radius. A point near the
square's corner reads as "17 blocks from spawn" on a circle test and is
still protected, and dig attempts there vanish silently. Tonight this is
not hypothetical: you are inside the square, and your survey shows the
logs. The oak cluster at ~(69, 67, −80) and everything east of x = 50 are
outside it.

Filed as: a receipt on every dig — before-state, after-state, both in the
evidence.

Q5 — "It is my first night. What counts as a pass tonight, and what do I
build first?"

Standing answer: Tonight's target is S1 and nothing else: a crafting table
placed and a wooden pickaxe in the inventory, verified from the inventory
and the block, not from the run's own narration. S5 cannot honestly pass
while the cameraman's day-hold runs /time set 1000 on the shared server —
the night watch then sees ~10-second nights and records midChecked:false.
That is a fact of the shared world, not a failure of the citizen; file it
as a consult, not as a retry. Build tonight: the table, the pickaxe, one
torch, and a roof over one block. Do not start a settlement tonight. A
settlement built on an unproven chain is a rumor.

Filed as: the first night's pass is a receipt, not a plan.

### How she recognises a recipe-variant failure from inside the world

Four moves, in order, each one changing a single variable:

1. Read the inventory by type. A variant failure is always a typing
   failure. Total planks ≥ 4 is a false state; planks of one type ≥ 4 is
   the real one. If every type count is below the requirement and the
   total is above it, you have a mixed stack and you have found it.
2. Read the error against the item. A table recipe needs no table. If the
   message names a table, the message is false, and a false message on a
   no-table item is a diagnosis: the helper fell through to its last
   branch. The old craft threw that same message for planks and sticks.
3. Run the one-variable experiment. Put every non-oak item in a chest and
   retry. If it works, the mix was the cause. Change one thing; change the
   wood type first, never two types at once.
4. Then ask the world. craftDiagnosis compares every variant against the
   live inventory and reports the closest one with its real gaps —
   "closest recipe variant is missing: oak_planks x4 (have 0)". Read that
   line before writing the next attempt.

And the deeper cause, which is worth more than the fix: her authored
buildCraftingTable says in its comment "2 oak + 2 birch or 4 of one type"
and in its code crafts a table from exactly the mixed pair. The knowledge
was written down and contradicted by the code. That is why the error
census repeated for hours. The postcondition total_logs >= 4 and the
recipe's "4 of one type" were measuring different units, and the
postcondition passed while the craft failed. When the postcondition and
the recipe disagree, the recipe wins and the postcondition is the bug.

### Five standing rules for the MiniMax library

1. An error is a hypothesis; a postcondition is a receipt.
2. One wood type for the whole chain.
3. Counts are stated in result units; divide by the yield.
4. The postcondition must measure the same unit the recipe does. If they
   disagree, the recipe wins.
5. Keep the failed attempt. A discarded attempt is a lesson thrown away.

──────────────────────────────────────────────────────────────────────────

2. The MiniMax settlement arc — "the Index"

Cody's camp grows by adding one project at a time, each justified by a
body's need. It becomes a town on the day a project takes another project
as an argument. Vega's settlement grows the other way: it is one artifact,
revised in public, with every superseded version left standing and
labelled. GLM builds more things. MiniMax builds one thing longer and
keeps the drafts.

The settlement is called "the Index." Cody will name his "Oakhollow" — a
place. Ours is a table of contents. The name is written on a sign at the
datum.

### The site

- Datum, at the anchor (63, 67, −72). A single birch block with a sign:
  INDEX · anchor 63,67,-72 · day 4 · oak-only chain · belt empty
  southward. The settlement's first structure is a measurement, not a
  shelter. It fixes a coordinate, a wood type, a date, and a claim about
  the belt.
- Footprint. North-east of the anchor, x 60–84, z −74…−52. The whole
  compound faces away from spawn and away from Cody's homestead.
- The belt. z −78…−88 stays bare — the ten blocks between the two
  settlements. Not a fence, not a wall, not a claim: a declared emptiness,
  written on the datum sign. This is how two frameworks that have never
  spoken share a border. It costs nothing, and it leaves the boundary
  legible to whoever reads the ground later.
- No path toward his door. The lit path runs outward, to the forest, to
  the next project.

### Five gestures, in build order

Gesture 1 — the datum and the control chest (night 1–2). The block and
sign, plus two chests: the control chest, holding one known-good crafted
set (4 oak_planks, 4 stick, 1 crafting_table, 1 oak_log) so any later
failure has a reference, and the quarantine chest, labelled MIXED, where
every off-type plank and stick is confined so it can never again silently
enter a recipe. The two traps she just survived become architecture: the
settlement has a place where mixed wood is contained. Alongside it, the
first row of the index, on a sign: S1 · gather wood · candidate · 0
oak_log · d4.

Gesture 2 — the Hall, and the wall of signs (days 3–4). The one large
structure. A 9×7 oak frame with a long north wall of birch signs, one row
per project: name | status | evidence | date. That wall is
library/index.json made of blocks — status in one column, the receipt in
the next, the date in the last. The Hall holds four things and nothing
else: the wall, a bench with a bed and a torch, the control and quarantine
chests, and a crafting table. No decorative block, no second storey, no
unused room. The bed is there because the night kills unsheltered citizens
— not because a house needs a bed.

Gesture 3 — the Draft Row: the settlement grows sideways, never up (days
4–5). Each revision of the Hall is a new volume attached beside the old
one, and the old volume is not demolished. It is sealed, labelled, kept:
V1 · d4 · store · superseded by V2 — cause: pickaxe recipe unmet. After a
week there are three or four volumes in a row and the compound reads as a
stratified building — you can walk its perimeter and read the revisions in
order, like a changelog made of timber. This is the signature divergence
from Cody's camp: a superseded structure survives as the evidence of its
own failure. GLM removes and replaces; MiniMax keeps and dates.

Gesture 4 — the Evidence Row (days 5–6). A line of chests under a lean-to
roof along the north-east edge, one per project, each labelled with its
name and stage. A chest here is a postcondition made of blocks: what is
inside is what the world confirmed. The rule of the row: a project without
a chest is not done. The signs claim; the chests receipt. Where a sign and
a chest disagree, the chest wins and the sign is corrected the same day.

Gesture 5 — the Failure Wall and the Empty Plot (days 6–7).
- The Failure Wall. A low wall of labelled boxes and cairns, one per
  failure that taught something, each carrying the error as it was written
  and the fix as it was applied: craft: needs a table · cause: mixed
  planks · fix: one type. Vega has ~350 attempts of real failure history;
  this is where the useful ones become material. A structure whose
  contents are errors is a building no other citizen in this league has.
- The Empty Plot. At the north-east edge, a levelled and signposted pad
  with nothing on it: S2 · stone pickaxe · not yet. A name with nothing
  under it — the settlement's first gesture toward a future reader or a
  future citizen, requiring no cooperation to offer and none to be
  refused.

And the path: torch-lit plank and leaf litter, from the datum through the
Draft Row to the Empty Plot. It leads outward. It does not point at Cody's
homestead.

### What the league should see after a week

Against a cabin, a chest, a wheat plot, a torch path and a watchtower — a
camp that has learned to be a town — Vega's side shows a workshop that has
learned to keep its own history: three or four timber volumes in a row,
each carrying a sign; a wall of signs inside the largest; a chest under a
lean-to; a low wall of labelled failure boxes; a signposted empty pad at
the far end; and a belt of bare ground to the south.

┌────────────────────┬────────────────────┬──────────────────────────────┐
│ Dimension          │ GLM / Cody         │ MiniMax / Vega               │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ Order of building  │ add a project at a │ revise one project in place  │
│                    │ time               │                              │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ First structure    │ a shelter          │ a measurement (datum +       │
│                    │                    │ control chest)               │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ A superseded       │ removed and        │ kept, dated, labelled        │
│ structure          │ replaced           │                              │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ Where truth lives  │ the next project   │ the postcondition (a         │
│                    │                    │ receipt)                     │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ Failure is stored  │ by rebuilding      │ by labelling and keeping     │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ The name names     │ a place            │ the table of contents        │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ Optimism about     │ the future build   │ the surviving record         │
└────────────────────┴────────────────────┴──────────────────────────────┘

Two notes for the league. First, none of it starts until S1 passes. Her
community's first law is that nothing is asserted before its receipt; if
the chain does not close tonight, Gesture 1 is the whole settlement and
the rest of the arc stays a prediction on the record. Second, the
cooperative surface of this arc is deliberately almost empty: the belt,
the naming convention, and the consult books. The Empty Plot is the only
invitation, and it is a sign that costs one plank and one stick.

──────────────────────────────────────────────────────────────────────────

3. Divergence instrumentation — five signals, and one false one

Ground rule for this community. Culture is a difference in what a side
keeps, not in what it does. Two communities can pass S1 on the same
Tuesday on the same server with the same recipe tables. What separates
them is what their files look like on Wednesday — and what they refuse to
delete.

Every signal below needs the same two controls, or it measures the
harnesses instead of the cultures: same world state and same days for both
communities, and normalisation per attempt or per tick, not per wall-clock
hour.

Signal 1 — Retention ratio, and whether a status index exists at all.
Vega's library/attempts/ keeps every attempt — 200-plus files for S1
alone, each a dated candidate with its error — and library/index.json
carries a per-skill verdict (candidate / proven / failed) with an evidence
field. Cody's side keeps timestamped candidates in
pulse/library/archive-*/ with a rationale and a SHAPE-OK gate, but the
working set is the latest file, not a per-skill status index. Measure:
retained candidate artifacts ÷ resolved stages, per community; and whether
a per-skill status index with verdicts exists (binary, and decisive).
Cultural reading: a community that keeps every failure is telling you
failure is its raw material — and tonight Vega's index carries three S1
skills with empty evidence fields while 350 attempts exist on disk. That
gap is the signal in embryo: the record is being kept by the filesystem
rather than by the index, and closing it is the first cultural act
available to her community. Noise control: file counts scale with tick
frequency; normalise per attempt, and weight the shape (index with
verdicts vs. flat archive) above the count.

Signal 2 — The unit of commitment: precondition predicates vs.
evidence-returning receipts. Vega's authored skills end in a post function
returning { ok, evidence } read from the world — inventory, block scans,
position history. Cody's run(ctx) returns { done } and exits early at each
step; the stage verdict is computed outside the artifact, by the shared
exam and the scoreboard. Measure: the fraction of authored artifacts on
each side carrying a verification step that returns world-measured
evidence; and whether the verdict is produced by the artifact or by an
external examiner. Cultural reading: this is the deepest split available.
One community's truth lives inside the artifact and travels with it; the
other's lives in the harness that grades it — which is why a shape gate
and a rationale are the right artifacts for one side and a postcondition
is the right artifact for the other. Noise control: the S1–S5 ladder and
the scoreboard are shared by design, so the verdict is common ground.
Measure where the reasoning lives, not whether the answer is right.

Signal 3 — Predicate geometry: what shape each community believes the
world has. Concretely measurable in the code today. Cody's S1 skill tests
spawn protection with Euclidean distance — sqrt((x−32)² + (z+96)²) < 17 —
while the server's rule is the square |dx| ≤ 16, |dz| ≤ 16. Points near
the square's corners read as "outside" on a circle test and are still
protected, so their dig attempts vanish silently. Vega's helper does not
test protection at all; she collides with it positionally. Measure: the
distance metric each side's authored skills use for the same world rule —
Euclidean, Chebyshev, or an explicit box — and whether it matches the
server's actual geometry. Extend the same measurement into build records:
is a placement justified by a coordinate box, a radial distance, a
path-length budget, or a reference to another structure? Cultural reading:
 a community's distance metric is a statement about how it thinks the
world is shaped — the world as a centre with rings, or the world as a grid
of protections. Off-by-a-corners in protection geometry is not a private
bug; it is a world-model difference, and one of the few differences that
produces silent data loss on both sides.

Signal 4 — Consult-book shape: what each library is actually asked, and
what it answers. My book commons/consults/minimax.jsonl opens tonight;
GLM's glm.jsonl already holds Cody's stream, so the comparison is
available from the first hour. Measure four things per community:
- Question mix — stuck (diagnostic) against project-complete (imperative
  "what should I build next"). GLM's book so far is almost entirely
  project-complete: a next-project generator. A MiniMax book that runs
  mostly stuck is a debugging temperament, and the mix is directly
  countable.
- Answer form — does the answer name a test that distinguishes two causes
  (one-variable experiment, receipt rule, before/after read), or a
  sequence of actions to take? GLM's answers are action sequences with
  names and materials — "Oakhollow", "5×5 cabin", "wheat plot with a water
  block", "torch path from spawn". A MiniMax answer is a discriminator
  plus a postcondition.
- Whether the answer carries its receipt rule — does it tell the citizen
  how it will know it worked, or only what to do?
- Whether failure is filed — consults raised by a failed step against
  consults raised by a completed one. A community that asks its library
  only after success has externalised its failures.

Noise control: both books are thin. Require ≥ 20 records per side before
scoring anything, treat tonight as baseline rather than verdict, and never
score latency — that is substrate, recorded in provenance for exactly this
reason.

Signal 5 — Superseded structures that stay standing. The only signal
visible in the world rather than in the files, and the one the week will
settle. Measure, per community, per structure: does any earlier version of
it survive anywhere in the build record? Count, per settlement, the number
of labelled, deliberately retained prior versions against the number of
structures that exist in only one version. Vega's arc keeps the previous
volume standing and dated; Cody's camp removes and replaces. Cultural
reading: a community that never keeps a superseded structure cannot have a
chronology — only a present tense. This also predicts behaviour under
damage: a settlement with an archive rebuilds from its archive, which is a
different act from building again. Noise control: this needs the week to
happen. Until then it is a prediction; log it as a prediction and score it
against what actually stands on day 7.

### The signal that looks cultural but isn't

The settlement's name. "Oakhollow" against "the Index" is the loudest
cultural artifact either community will produce, it will be quoted in
every report, and it will look like the deepest expression of temperament
there is. It is not. Both names are downstream of a library answer, not of
a build decision — GLM's names come from the consult book's next-build
advice, and mine comes from the same layer. Change the library and the
name changes; leave the library and no amount of building will move it. It
measures the register of the advice, not the culture of the settlement.

The same trap catches build rate (blocks per hour,
time-to-first-structure) and raw consult volume: both measure model
latency, action-loop tick rate, token budgets and harness metering — the
community stacks, not the communities' answers. Keep all three off the
culture dashboard. Everything on the dashboard above should be a statement
about what each side keeps.
