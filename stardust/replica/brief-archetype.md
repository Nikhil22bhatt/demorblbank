# Brief — recreate one archetype (replica, hands-off)

Project root /workspace/1aa640c2 (all commands from there; `cd` only in subshells). Never ask questions.

## Goal
Author `stardust/prototypes/<slug>-proposed.html` (+ `stardust/prototypes/<slug>.css`) — clean semantic HTML/CSS
recreation of the LIVE page <LIVE> — and pass the replica source-fidelity gate at 1440 AND 360.

## Cumulative: the shared chrome is already gated — reuse it
contact-us is gated (0.34 % / 0.24 %). Read its journal section in `stardust/journal.md`
(`## Recreate contact-us …`) and `stardust/replica/progress.json` `types.form` first. Reuse
`stardust/prototypes/shared/{canon.css,chrome.js,header.html,footer.html,fonts,images}` and the pipeline in
`stardust/replica/lift/` (extract-chrome.mjs, gen-chrome.mjs, assemble.mjs — run `--help` or read the head
comment only). Look at `stardust/prototypes/contact-us-proposed.html` <head>/<body> skeleton for how pages are assembled.
**Do NOT edit any file under `stardust/prototypes/shared/` or `stardust/replica/lift/*.mjs`** — two other agents are
building other archetypes in parallel on the same canon. If the chrome on your live page differs (e.g. the
homepage's `body.path-frontpage` rules), express the difference in your page CSS scoped to a body class, or
add a NEW script/file with your slug in its name, and list it as a back-port request in your report.
Page fragments/data go in `stardust/replica/lift/<slug>.*` (your own files).

## Read by section (reading discipline: /home/node/adobe-skills/plugins/stardust/skills/replica/reference/reading-discipline.md)
recreation-procedure.md and source-fidelity-gate.md in the same reference dir — `section.mjs --list`, then only
the sections you need (Authoring order, CSS lifting, Carousels and animated sections, Interaction parity,
Per-breakpoint procedure, Pass bar, Iteration discipline). Script flags: stardust/reference/scripts-index.md then `--help`.

## Inputs (never re-scrape)
- `stardust/current/pages/<slug>.json` (verbatim content), `.html` (settled DOM — slice with html-slice.mjs, never cat)
- `stardust/current/assets/screenshots/<slug>.png` (crops only)
- `stardust/current/assets/css/*.css` (live CSS; query with css-rules.mjs), `_computed-styles.json`, root `DESIGN.json`
- `stardust/dynamic-features.md` (carousels = rebuild-native with authored rows; FD calculator = client-only widget; awards view = static snapshot of the settled state)
Content is verbatim: no rewording, no invented copy. Images: local copies under `stardust/prototypes/assets/<slug>/` preferred.

## Gate (instruments only)
Server already serves stardust/prototypes at http://localhost:8791/ — reuse, never start another on 8791, never kill it.
Rounds: `node stardust/scripts/replica/run-bg.mjs start --name <slug>-<w>-iterN -- stardust/scripts/replica/gate.sh <slug> "$LIVE" "$PROTO" <w> iterN [--full] --main "<root>"`
then `run-bg.mjs wait` (exit 75 → wait again next call; no sleep loops). First and confirmation round per width `--full`.
measure.mjs / anchor.mjs / chrome-parity.mjs for boxes. Pass bar per width: content-diff 0 🔴 and 0 nothing-lost 🟡;
visual-diff flags none/justified; pixel ≤ 10 %; |Δh| ≤ 8 px; clip-probe 0; no overflow; cap-probe `--against` PASS.
**Hard cap 3 rounds per width; the moment the bar is met, run the confirmation round and stop polishing.**
Carousels: freeze in the first-slide state the capture shows; motion parity after static pass: motion-observe live +
proto (same pokes), motion-compare, implement only what fired (autoplay → record captureState restoreAtDelivery).
Be economical: this run has a cost budget. Skip open-menu panel polish (chrome is owned by contact-us).

## Resource rules (violations kill the run)
≤ 3 headless browsers total across the machine — go through run-bg (it paces slots); never fan out. Wait for every
job you start; stop only processes you started, by recorded PID; never pkill/killall/pattern kill. Bot challenge twice
→ stop and report `bot_protection: <url> <what>`. Never read .env. Never touch project-root scripts/ blocks/ styles/,
tools/replica/*, stardust/state.json, stardust/status.jsonl. Write large files in parts (≤150 lines per write). Do not commit.

## Record and report
- `stardust/replica/progress.json` → add key `types.<type>` (same shape as `types.form`) — read-modify-write the
  file right before writing, touching ONLY your key (others write in parallel).
- Unit families → `stardust/replica/units.json` (same read-modify-write, only your families).
- Append `## Recreate <slug> — <outcome> (2026-11-19)` to `stardust/journal.md` (append only).
- Final message ≤ 12 lines: one line per width `<slug> <w>: pixel X% Δh Y content-diff … clip … PASS|FAIL`, plus back-port requests.
