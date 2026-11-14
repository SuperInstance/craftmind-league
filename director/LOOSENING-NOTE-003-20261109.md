# DIRECTOR LOOSENING NOTE #3 — scenario #2, the played day

Filed 2026-11-10 (post-day-11). Note #1 priced scenario #1 (the barn
nobody came to). Note #2 was the no-day note (day 11's Gate B stop;
triple-021 carried forward unscored, premise void). This note prices
scenario #2 as it actually ran: **day 11 PLAYED** (relaunch under the
repaired floor), 31 cycles, 2026-11-10T00:59:36Z → 01:07:04Z, ended
by a floor park (`daylight_unrestorable`, fault_owner: harness — the
landing commands demonstrably landed; the floor's verify window
missed them by a one-byte mirror offset; see the day record §7).
The park cut the day at 8 of 85 chartered minutes; everything below
is read from those 31 cycles and the post-day census, and the short
day is itself part of the evidence — the element's fate was settled
in the first five minutes, long before the park.

Record: `pulse/DIRECT-DRIVE-DAY11-PLAYED-20261109.md`. Score:
**triple-023** (via `commons/triples/`), scoring triple-021 by its
filed rule.

## The score, mechanically

Triple-021 predicted: he leaves the hollow under his own power,
crosses the shoulder band (x=65 while z in −90..−87) on his homeward
leg, and the tread is neither dug nor built on (no dig/place in the
step box; post-day census still reads oak_log) — the element met as
ground.

- (i) Crossing: **PASS.** Trace positions: cycle 12 (67.4, 65,
  −86.7) → cycle 13 (65.1, 67, −89.7). x=65 held with z in −90..−87
  on the homeward leg.
- (ii) No dig/place in the step box: **PASS on the rule's literal
  verbs.** His digs targeted (68,66,−87) [x outside the box],
  (64,66,−92), (64,67,−93), (61..63, 63..66, −92), (60,63,−92) —
  none in the box; zero place commands all day. But the tread was
  removed by **felltree**, a verb the rule does not name. The score
  is kept mechanical; the gap is argued below, where it belongs.
- (iii) Census clause: **FAIL.** Fresh post-day census (region copy
  md5 `20c15e11…`, parsed offline) reads (65,66,−88) as
  `minecraft:air`. At cycle 4, `felltree 65 66 -88` returned ok:true
  — "felled 1 logs and gathered drops."

**SCORE: FAIL.** PASS requires all three; (iii) fails. The element
was met as **material**, not as ground — the opposite of the
prediction.

## What the day actually showed

He never stood on the road the tread was laid in before he took it.
Cycle 1's goto out of the hollow failed at his start position; from
inside the hollow, cycle 2's perception named the tread "a real oak
trunk five blocks west of me" — perceived as a **resource** first,
from a distance, before any tread upon it. He aimed felltree at it
from range (failed), worked north around the hollow rim for ten
cycles, and felled it the moment he was in reach (cycle 4). Then he
crossed the band anyway (cycle 13) — the crossing the prediction
wanted happened, but over ground he had already harvested.

The perception sub-read (unscored, per the rule): the element WAS on
his road and WAS perceived — scenario #1's failure mode (distance;
the element never entered his world) did not repeat. The siting
claim survives. What failed is the claim about the meeting's kind.

## The doctrine update — the second datum

Scenario #1: an element off his road is scenery to nobody — distance
was the whole result. Scenario #2: an element ON his road, made of a
material he actively wants (he was mid-furnace-chain, wood-hungry,
and his day-10 close held 18 oak logs he was still converting), is
not scenery either — **it is an offer, and he takes offers.**

The one-element doctrine therefore meets its refinement: an element
intersects his momentum in the currency of his current plan. A tread
of oak, to a citizen whose plan is wood→tools→stone, reads as wood.
The Director's minimalism (one block, nothing else touched) held —
the world is otherwise exactly as censused, his-ground spot reads
all unchanged, invariant cells as placed (one world note: the cell
beneath the tread, cover-killed to dirt by the placement, regrew to
grass under held daylight — the world's own repair, filed in the
day record §9). What did not hold is the assumption that a placed
element would be met in the role it was placed for.

For scenario #3, the design space this opens, stated plainly so the
next authoring starts from evidence:

1. **An element he cannot harvest** (a material outside his tool
   reach, or not an item at all — a sign, a sound, a lit window)
   tests the ground-meeting cleanly: it can only be crossed, read,
   or ignored.
2. **An element he wants, placed where taking it costs him the
   crossing** prices the offer itself — whether the harvest or the
   road wins when they are the same block.
3. The scoring rule must name **every removal verb the stack
   holds** (dig, felltree, and any future harvest verb), or state
   explicitly that harvesting counts as meeting-as-material and
   scores it so. Triple-021's rule left felltree unnamed; the score
   stood mechanical, but the next rule should not need the argument
   this note is making.

## The ground as it now stands

The tread cell (65,66,−88) is **empty** — a felled stump-hole in the
shoulder: grass top at y65, air above, the +2 face at x64 un-mended
again. Whatever scenario #3 does, it starts from the census, not
from this filing's memory: the shoulder is back to its pre-placement
geometry, except the grass that regrew beneath where the log lay.
Cody sleeps at (63.3, 64, −90.4) in the dip he dug beside his own
pit at home, hp/food 20/20, deaths 123 (delta 0). The hollow, the
pit, the pen and the table stand as they were. The Director placed
one block in this world across two scenarios' preparation; the
world now holds one fewer than it did yesterday, and the citizen is
one log richer. That is the honest arithmetic of the meeting.
