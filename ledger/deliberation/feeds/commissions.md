# Commission feed — format

One JSON object per line in `commissions.jsonl`. A commission is any model-using
work the programme orders that does NOT pass a metered route: seat commissions
(deliberations, studies), Director authoring windows, benches, lane filings that
themselves consumed model calls.

| Field | Meaning |
|---|---|
| `id` | Stable id, `<lane>-<what>-<yyyymmdd>` |
| `ts` | ISO timestamp of the work (filing time is acceptable, labelled by the evidence) |
| `programme_day` | AKST programme day the work belongs to |
| `caller_class` | `driver` \| `judge` \| `director` \| `curator` \| `booth` (study D.3) |
| `agent` | Who did the work (seat, lane, bot identity) |
| `model`, `route` | As known; `route` names the unmetered route honestly (`subscription:zai`, `api:oracle-side-deliberation`, `op-channel`, `local:orin`) |
| `calls` | A NUMBER only when a filing or meter actually counts the calls (e.g. `0` for op-bot windows, evidenced by the noticing report). Otherwise `null` = UNMETERED. **Never estimate.** |
| `usd_est` | Same discipline: a number only from evidence, else `null` |
| `evidence` | The filing(s) the entry rests on — path(s), readable |
| `note` | What the entry is and what would meter it in future |

Rules:
- An entry with `calls: null` is a routing fact, not a zero. Reports must print
  it as UNMETERED, and per-class totals must carry the count of unmetered
  entries beside any summed number.
- When a route gains a real meter (provider log export, seat usage page), the
  feed gains a metered adapter and the commission entries for that route are
  superseded — appended corrections, never rewrites.
