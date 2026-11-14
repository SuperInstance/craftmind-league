# Staircase proposal — the dip's permanent exit, built as a project

Status: PROPOSAL ONLY (written 2026-11-08 by the escape-route lane after
its third stop-line; not built). Audience: the hut→town lane / smith.
Companion records: pulse ledger `cody-escape-route-verdict-20261108`,
`pulse/escape-survey.json`, `pulse/dip-detail.json`.

## Why a built staircase, and why not tonight

Three escape attempts (free hops, a committed surveyed chain, tight
single-cell hops) all failed at Cody's stance cells with zero or
oscillating displacement, while the route itself is proven to exist on
survey data and the chain machinery demonstrably commits cells when it
engages (run 1, hops 0–4). The unresolved blocker is locomotion at the
stance cell pair (72–73, −101/−102) — the same world region the S1
traverse crossed successfully at 05:40Z. Until that locomotion question
has its own verdict, the durable fix is to remove the hard cells from
the route entirely by *building* the crossing: a staircase is terrain
the body crosses by walking downhill/uphill on wide, flat treads, and
once built it serves every future trip out of the dip (food, deaths,
respawn returns), not just this forage.

## The line

The dip's west wall, the z=−102 ramp (all tops from escape-survey.json):

| cell | top now | action | top after |
|---|---|---|---|
| (73,−102) | 62 | none (dip floor tread) | 62 |
| (72,−102) | 63 | none (tread) | 63 |
| (71,−102) | 64 | none (tread) | 64 |
| (71,−101) | 65 | none (corner tread) | 65 |
| (70,−101) | 65 | none (tread) | 65 |
| (69,−101) | 66 | none (rim tread) | 66 |
| (69,−102) | 66 | none | 66 |

Every consecutive step on this line is already ≤+1 — the staircase
project is therefore not a cut-and-fill of the whole wall. The
construction is concentrated at the two stance cells where locomotion
fails, widening the crossing so the body never has to commit the exact
pair that oscillates:

1. **Widen the stance**: clear cell (73,−101) (top 62, grass) is
   already flat with (73,−102)/(72,−101)/(73,−100) — the build adds a
   placed tread at (72,−100): one dirt block on top of its y63 grass
   (top 64), giving the corner a 2×2 flat landing at feet 63–64 from
   which (72,−102) t63, (72,−101) t62 and (71,−102) t64 are all
   single steps. Materials: Cody carries dirt ×1 and the dip floor is
   dirt/grass — the project gathers 4–6 dirt from the dip floor cells
   (73,−104)/(74,−104) (tops 65/65, off the route) if more treads are
   wanted.
2. **Mark the treads**: place one torch or a distinctive block (his
   crafting table already travels with him; cobble once the pickaxe
   project resumes) on the corner tread (71,−101) so the route is
   legible in scans and on camera — a named place ("the Dip Stair")
   once it carries traffic, per the naming routine.
3. **Register the route**: once built and walked end-to-end once under
   observation, file the triples PASS entry superseding the escape
   FAIL entry, with the built cells listed as route construction.

## What the smith is asked to decide

- Whether the staircase is a *project in Cody's own list* (he builds
  it himself once locomotion at the stance is understood — the
  character-first answer) or an operator-built substrate fix (faster,
  but the league's rule is that operators furnish facts and repair
  substrate; a staircase is arguably substrate — it changes the world
  he lives in, like the cure did).
- The locomotion investigation itself comes first either way: a
  controlled probe at the stance cells (fresh bot, same cells, raw
  control states, packet-level position readback) to separate
  body-state from helm-state from world-state. If a fresh body walks
  the corner cleanly, the problem is Cody's resident state and the
  staircase may be unnecessary; if it wedges identically, the cell
  pair is a world/physics artefact and the staircase (or a reroute
  around the pair) is the fix.

## Stop conditions inherited from the escape lane

Cody is at hp 1.33 / food 9, stopped at (72.305, 64, −101.271). Nobody
relaunches him into project work without (a) a food plan that starts
from where he stands, and (b) the stance-cell locomotion verdict or
the built staircase. Deaths budget remains zero; his count stands at
114, unchanged through all three escape runs.
