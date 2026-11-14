# craftmind-league — publish notes (2026-11-14)

The Craftmind League programme record, published at programme rest by
the publish sweep (Casey, 2026-11-14). Copied read-only from
~/craftmind-league on the Thor; the original is untouched. Commits are
chunked per area so the history reads as the programme's story.

## Excluded from this repo (still on the Thor)
- `bots/craftmind/node_modules/` (537M) and `lineage-b/node_modules/`
  (537M) — dependency trees, reinstallable; the code that uses them is
  here in full.
- `bots/craftmind/.env.example` — EXCLUDED-SECRET: despite the name it
  holds live credential values (an LLM provider API key assignment and
  an RCON password assignment). Values never copied here.
- `__pycache__/` dirs — interpreter caches.

## Notes
- Governor "API_KEY" strings in lineage-b/lineage-c minds.js are the
  local metering proxy's caller-identity labels (agent--<name>), not
  provider credentials; config/governor.json holds only localhost
  upstream URLs and budgets — verified by inspection before publish.
- Citizen body saves (.dat) are included wherever they were filed
  (director windows, floor/run day copies, repair-cody) — small and
  irreplaceable.
- The file literally named `--file` at the root is a JSON verdict
  record saved under a shell-accident name on 2026-11-08; kept as-is.
