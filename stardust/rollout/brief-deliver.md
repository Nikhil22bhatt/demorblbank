# Brief — C-deliver units (replica, hands-off)

Project root /workspace/1aa640c2 (all commands from there; `cd` only in subshells). Never ask questions.
Site: replica (same-design) migration of https://www.rbl.bank.in/ to AEM Edge Delivery, 5 pages only
(stardust/.labs/site-plan.json): index `/`, about-us, business-banking, personal-banking, contact-us.
EDS: GitHub `aemcoder/1aa640c2` branch `main`; DA org `aemcoder`, site `1aa640c2`;
preview `https://main--1aa640c2--aemcoder.aem.page`, live `https://main--1aa640c2--aemcoder.aem.live`.
Publish is decided: every delivered page and the chrome documents go LIVE (deploy-batch without `--no-publish`).

## Read first, by section only (never whole files)
- Contract card: `/home/node/adobe-skills/plugins/stardust/skills/replica/reference/handoff-contract.md`
  — `section.mjs <doc> --list`, then § 2 (Deploy — per page) and the parts of § 3 row C / § 4 you need.
  `node stardust/scripts/replica/section.mjs <doc> '<heading regex>'`.
- Deploy skill `/home/node/adobe-skills/plugins/stardust/skills/deploy/SKILL.md` — its sections point to
  reference files; read only the ones your step needs (Runtime-detection probe, Deploy DA Source API, Steps 2b,
  3, 4, 6, 8, Local QA, Step 10). Scripts: `stardust/scripts/{deploy,rollout,replica}/*.mjs --help`, never the source.
- Reading discipline: `/home/node/adobe-skills/plugins/stardust/skills/replica/reference/reading-discipline.md`.

## Inputs
- Gated prototypes (the spec): `stardust/prototypes/<slug>-proposed.html` + `<slug>.css/.js` + `shared/`
  (canon.css, chrome.js, header.html, footer.html, fonts, images). Served locally at http://localhost:8791/
  (already running — never start/kill a server on 8791).
- Migrated pages + sidecars: `stardust/migrated/`; block ids per page: `stardust/rollout/plan.json`.
- Replica ledger `stardust/replica/progress.json` `types.<type>` (residuals, captureState[].restoreAtDelivery,
  motion.implemented — implement every fired behaviour and every restoreAtDelivery entry).
- Dynamic dispositions: `stardust/dynamic-features.md`.

## Rules
- EW1–EW10 editability (node-slotting, never value-slotting); `block-roundtrip.mjs --ew` exit 0 per block.
- Decode tier: template-slotted for fixed compositions, reconstructive for repeat groups; log tiers in
  `stardust/eds-conversion-log.md` (append only, a section per unit).
- Boilerplate lint (`npm run lint`) clean for files you touch: ESLint airbnb-base, Stylelint standard,
  lines ≤ 100 chars, kebab-case. Targeted edits; never `--fix` a file another agent edits.
- Images: editorial images via `stardust/scripts/deploy/da-media-upload.mjs` (`--scope <slug>`), authored as
  `https://content.da.live/aemcoder/1aa640c2/media/<scope>/<file>`; never anonymous-curl content.da.live.
- Token: `DA_TOKEN="$(cat "$ADOBE_IMS_TOKEN_FILE")"` inline per command; never print, echo, copy or write it
  into any file or brief. Never read .env. Push code: `git push origin main` after committing your files
  (code sync builds it; poll the preview for your block with `curl -sf` ≤ 5 s apart, capped ~3 min).
- Pages go through `deploy-batch.mjs --paths stardust/rollout/units/<unit>.paths --ledger
  stardust/deploy/ledger-<unit>.json --log stardust/.work/rollout/<unit>/deploy.log --concurrency 2`
  via `node stardust/scripts/replica/run-bg.mjs start --name <job> -- <cmd>`, then `run-bg.mjs wait` as your NEXT call.
- Gates on the PUBLISHED/preview origin only (nothing pixel on a local harness):
  `node stardust/scripts/replica/gate-all.mjs --only <slugs> --eds-host main--1aa640c2--aemcoder.aem.page`
  (then `--width 360`) through run-bg. DELIVERED = pixel ≤ 10 %, |Δh| ≤ 5 %, clipped 0, MISSING+HIDDEN 0.
  Header/footer bands ≤ 2 % via `crop-compare.mjs`, chrome parity. Cap 3 fix rounds per width.
- Coverage rows via `stardust/scripts/rollout/update-coverage.mjs` only (lock-safe); never hand-edit coverage/*.json,
  rollout.json or any ledger with `node -e`.
- Foundation freeze (after C0): never edit `styles/`, `fonts/`, `head.html`, `scripts/`, `blocks/header/`,
  `blocks/footer/`. A foundation finding = ONE line appended to `stardust/rollout/foundation-requests.md`
  (`- <unit> | <what> | <evidence> | <templates>`) and a scoped override in your OWN block CSS.
- Resources: ≤ 3 headless browsers machine-wide — long instruments only through run-bg (it paces slots);
  every tool call < 4 min; no `sleep` loops. Stop only processes you started, by PID; never pkill/killall.
  Bot challenge on retry → stop and report `bot_protection: <url> <what>`.
- Never touch tools/replica/*, stardust/state.json, stardust/status.jsonl, stardust/rollout/progress.json,
  stardust/.labs/*. Helpers go in `stardust/.work/rollout/probes/`. Write big files in parts (≤ 150 lines per write).
- Commit only your own files (`git add <paths>`; message `replica phase 5 C-deliver <unit>: …` ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`), then push.

## Report
ONE verdict line: `<unit>: pages n/n live, blocks k, gate 1440 x% / 360 y%, requests r`, plus ≤ 5 lines:
crop bands, chrome parity, files/blocks written, foundation requests filed, anything unresolved.
