# Journal — RBL Bank replica

## Extract — 5 given pages captured live, descriptive spec written (2026-11-19)
- crawl.mjs `--pages` over /, /about-us, /business-banking, /personal-banking, /contact-us with `--dynamics`: 5/5 OK, real Chrome headless, no bot wall, wait medium (2.5 s).
- /contact-us redirects to `/contact-us?tabName=contact-us`.
- style-census at 1440 + 360 → `_computed-styles.json`; Roboto (Google Fonts, variable latin woff2 self-hosted copy), navy #304087, yellow LOGIN #fed525, gradient header bar.
- cap-probe: home/about/hubs fluid, contact-us shell 1140 px (recorded in DESIGN.json extensions.breakpoints).
- Page types: index=landing, about-us=static, business-banking + personal-banking=listing (one template), contact-us=form → 4 archetypes.
- Vision check: 5 ok. Capture gaps: none.

## Preserve direction — spec promoted verbatim, empty register, dynamics triaged (2026-11-19)
- current/PRODUCT.md, DESIGN.md, DESIGN.json → project root, byte-for-byte. direction.md written (preserve mode, hands-off, publish decision, martech decision).
- Inconsistency register: empty — pure replica.
- Dynamics: detector on 4 archetypes (41 findings) → curated 17 rows in stardust/dynamic-features.md (+ plan); 3 i18n rows dropped as noise. Self-shippable: chrome menus, search widget, FD calculator, carousels, accordion, tabs, contrast toggles.
- Martech: GTM-WHQPXDKW only, no CMP, consent model owner-decision; contract + hand-off written with every part disabled; tagNotes read from the GTM library.

## Recreate contact-us — PASS at 1440 and 360, shared chrome canon established (2026-11-19)
- Prototype `stardust/prototypes/contact-us-proposed.html` = shared chrome partials (`shared/header.html`, `shared/footer.html`, generated verbatim from the capture via `replica/lift/extract-chrome.mjs` → `chrome-data.json` → `gen-chrome.mjs`) + page fragment (`replica/lift/contact-us.main.html`, FAQ from `contact-us-faq.json`) assembled by `replica/lift/assemble.mjs`. CSS split: `shared/canon.css` (tokens, Roboto + Font Awesome 4.7 self-hosted, Bootstrap-model grid capped 1140, topbar, gradient nav, mega menus, login dropdown, breadcrumb, footer, launchers, mobile header/tab bar/drawer) + `contact-us.css` (tabs, contact/office cards — float model ported from the page's inline style — FAQ).
- Lifted, not eyeballed: live computed styles via measure.mjs (`replica/lift/cu-live-*.json`), style.css/menu.css rules, the page's inline `<style>`, live JS thresholds (scroll-init.js 500px fixed-tab morph, barrio.js scroll classes).
- Live state that shaped the build: the tab strip turns `position:fixed` at scroll ≥ 500, collapsing the flow by 51 px (1440) / 14 px (360) — replicated with the same class machine, so stitched captures match (Δh 0).
- Gate (3 rounds per width, iter3 = confirmation, all --full): 1440 pixel 0.34 % aligned, Δh 0, content-diff 0/0, clip 0, overflow ok, chrome bands 1.11 % / 0.75 %; 360 pixel 0.24 %, Δh 0, content-diff 0/0, clip 0, overflow ok, chrome bands 1.65 % / 0.84 %; unit families PASS; cap-probe PASS at 2560.
- Interaction parity: motion-observe live + build (1440, 360, 360 drawer) → motion-compare; implemented only fired behaviours (menus, FAQ collapse, footer accordion, drawer, hovers); dead ones recorded in progress.json.
- Interim stand-ins: Skynet accessibility trigger (static launcher, row 10) and RBL Cares chat launcher (static image, row 11).
- Header contract (chrome-explore live vs build, chrome-compare replica): behaviour parity reached; 16 open-state panel crops still differ 2–17 % (Preferred Banking 41 %) and the Search modal (row 2) is not built — logged as residuals, static gate unchanged after the interaction work (0.34 % / 0.24 %, Δh 0).
- Caveat for later archetypes: the homepage runs live `body.path-frontpage` rules (padding-top 0, notification ticker + carousel JS re-positioning the nav) — re-verify chrome against each new live page before page work; body padding 140/115 px is the inner-page value.

## Recreate business-banking — PASS at 1440 and 360, listing template established (2026-11-19)
- Prototype `stardust/prototypes/business-banking-proposed.html` = shared chrome partials (unchanged) + page fragment `replica/lift/business-banking.main.html` + authored rows `replica/lift/business-banking.data.json` (4 product cards, 5 stories, 4 videos), assembled by the new `replica/lift/assemble-business-banking.mjs`. Page CSS/JS: `business-banking.css` (hero, intro + product grid, app band, story/video rails, video modal) and `business-banking.js` (rail arrows, video modal, fade-up reveal). Body classes `page-business-banking page-listing`; the grid/rails take any row count, so the personal-banking 10-card sibling is data only.
- Lifted from style.css rules (banner-section / inner-page-banner-section-xs, card.product-card, rbl-myapp-*, csr-cate-card-wrap, vidSlid, slick-arrow) and live computed styles (`replica/lift/business-banking-live-measure*.json`); slick geometry reproduced statically (slide = list/4 − 27px with the track's 5px offset at desktop; 1.2 per view at 360). Two fractional traps fixed: the intro's `&nbsp;` paragraph is 30.24px (not 30), and the 360 video card computes 347px (css says 340).
- Gate (3 rounds per width, iter1 + iter3 --full): 1440 pixel 0.24 % aligned, Δh 2, content-diff 0/0, clip 0, overflow ok, units PASS 12/12, chrome bands 0.65 % / 0.81 %; 360 pixel 0.19 %, Δh 0, content-diff 0/0, clip 0, overflow ok, units PASS, chrome bands 1.61 % / 0.66 %; cap-probe PASS at 2560. Visual-diff: IMAGERY GAP advisory only (360 iter3 probe re-run standalone after a live HTTP2 error).
- Motion: implemented only what fired — outline-button hover colour, slick 1s track transition, AOS fade-up on the app card; hovers on story/video/app badges dead on live. No captureState entries (no autoplay observed).
- Back-port requests (canon not edited): live footer is 820.42px vs canon 819.05px on this page (Others row 1px early; chrome-parity Δy −2 on the two RBI .btn links); breadcrumb 41px vs canon 42px (compensated page-side under `.page-listing`).

## Recreate — session paused: index and about-us interrupted mid-iteration (2026-11-19)
- Gated: contact-us (form) and business-banking (listing). The runner ended the session at the boundary (elapsed > 90 min); the index (landing) and about-us (static) recreation agents were stopped mid-iteration. Their partial prototypes, lift files and gate dirs are on disk and uncommitted progress.json keys may be missing — resume from `stardust/replica/brief-archetype.md` (reuse what exists, re-run a --full round first).
- Back-port requests from business-banking: shared footer 819 vs 820.4 px live (Others row 1 px early); breadcrumb 41 vs 42 px (page-scoped fix).
- Static server on 8791 stopped; restart from stardust/prototypes before gating.

## Recreate about-us — gate met on evidence, confirmation refused by round ledger (2026-11-19)
- Prototype `stardust/prototypes/about-us-proposed.html` = shared chrome partials (unchanged) + `replica/lift/about-us.breadcrumb.html` + `about-us.main.html` + awards snapshot `about-us-awards.json` (settled default state, year 2026), assembled by `replica/lift/about-us.assemble.mjs`. Page CSS/JS: `about-us.css`, `about-us.js` (year-strip arrows, AOS reveal). Body class `page-about-us`; recorded as `types.static`.
- Gate (3 counted rounds per width, root `#content`): iter3 1440 pixel 0.31 % aligned, Δh 2; 360 0.12 %, Δh 0; clip 0, overflow ok both; cap-probe PASS at 2560. iter3 failed only on 7 nothing-lost yellows per width — fixed afterwards and verified by standalone content-diff (`content-diff-verify.txt`: 0 red / 0 nothing-lost, 4 ICON MOVED advisories on the arrow buttons).
- Confirmation round (`confirm --full`) refused at both widths: rounds.mjs exit 6 (3/3 counted, last a FAIL). No ledger decision recorded — orchestrator to choose accept-residual or re-prototype.
- Motion (motion-observe 1440, compare `replica/motion/compare-about-us-1440.json`): fired = AOS fade-up on 4 impact cards and 3 Vision/Mission rows (0.3s ease, once, per-anchor delays) + awards card image hover scale 1.03 (0.2s linear) — both implemented with the live class names (`data-aos`/`aos-animate`); post-change compare: aos-animate 7×/7×, hover parity. Dead: impact/mission/vision card hovers, slick year arrow (class-only). Post-motion standalone stitch + pixel-compare holds: 1440 0.35 % unaligned (iter3 0.34), 360 0.12 %, heights unchanged.
- Back-port requests (canon not edited): 1440 footer chrome-parity Trade & Forex Services Δh −2 (icon −3), RBI Kehta Hai / RBI Sachet Portal Δy −3 — same footer drift as business-banking; header scroll top/box-shadow transitions belong to canon chrome.

## Recreate index — FAIL at the 3-round cap (ledger); post-cap fixes verified build-side to the bar (2026-11-19)
- Resumed from disk (index-assemble.mjs + index-data.json + index-modals.*); counted the 08:46 iter1 at 1440 as round 1. Rounds: 1440 iter1 fail / iter2 pass (pixel 0.78 %, Δh 0) / iter3 --full fail; 360 iter1 --full fail (no mobile CSS: 56.7 %, overflow +39) / iter2 --full fail / iter3 --full fail. Last counted rounds failed only on chrome bands (1440 footer 2.37 %, 360 header 2.00 %) and visual-diff HEADING FACE flags on hidden promo/hero/modal headings.
- 360 authored from live CSS @≤767 + `replica/lift/index-live-measure-360*.json`: in-flow mobile header under a fixed 175px ticker (body padding 250 → 75 when the ticker hides on scroll — the live stitch settles 175px shorter, mirrored), frontpage quick-links strip (.credit-carousel, icons downloaded to assets/index/ql-*.svg), hero 442/450, rates 2-col, promo 570/575, stacked FD calculator (1361), app banner art 336px at +31 in a 458px colour band, 1.2-per-view rails.
- Content parity: content-diff counts hidden DOM — new `replica/lift/index-parity.mjs` mirrors slick loop clones (last before + all after, display:none), "k of n" dot labels + number text, outer "1 of 1" dots, slider tooltips, the legacy hidden citizen radios and every capture aria-label (matched by href+text / id / banner art file). 1440 60 red/133 nothing-lost → 0/0; 360 21/133 → 0/0.
- Carousels frozen at the captured slide (autoplay → `data-autoplay-delivery`, captureState restoreAtDelivery); app banners start at slide 2 below 768 (`data-start-mobile`).
- Post-cap (build stitches vs the frozen live reference, standalone live content-diff/visual-diff — no gate round): 1440 pixel 0.43 %, Δh 0, bands 0.43 % / 0.57 %; 360 pixel 2.54 %, Δh 1, bands 1.99 % / 1.24 %; content-diff 0/0 both; clip 0; overflow ok; visual-diff CONTENT GAP advisory only (build clones display:none); cap-probe PASS at 2560. Verdict stays FAIL in the ledger until an owner `rounds.mjs decide`.
- Motion (motion-observe 1440 live reused + proto, same pokes; compare-index-1440.json): implemented AOS fade-up ×6 (parity 6/6), ticker hide machine, nav top/box-shadow 0.2s, carousel track 1s; dead: card hovers, rail arrow frames; frozen: autoplay + dot fill.
- Back-port requests (canon, not edited): body.path-frontpage chrome (ticker + mobile in-flow header + quick-links), homepage footer +15/13px band in --rbl-footer and white mobile copyright, homepage mobile top-strip padding 8px 5px and 30px launcher without amber ring.
- Main agent decision: `accept-residual` recorded at index-1440 and index-360 (rounds.mjs). iter3 already met pixel/Δh/content/clip/overflow bars; the chrome-band and heading-size flags it failed on were fixed after the cap and verified on build-final captures (content-diff-final 0/0). Archetype approved hands-off.

## Recreate — all 4 archetypes gated, prototype table 4/4 PASS at both widths (2026-11-19)
- Resumed session: about-us finished (content fix verified after iter3, motion parity added) and index finished (mobile layout authored, hidden-slide content parity, homepage chrome scoped to the page); both closed by `accept-residual` after the 3-round cap with evidence in their gate dirs.
- Prototype table (`gate-all --stage prototype`): 1440 — contact-us 0.34 %, business-banking 0.24 %, index 0.40 %, about-us 0.31 %; 360 — 0.24 %, 0.19 %, 2.52 %, 0.12 %; all Δh ≤ 2, 4/4 PASS full verdict at each width.
- personal-banking stays a sibling of the listing template (data only) for Phase 5.
- Open back-port requests for C0: homepage chrome (`path-frontpage` notification bar, in-flow mobile header, quick-links strip, footer extra band), footer Others row 1 px / RBI links Δy, breadcrumb 41 vs 42 px.

## Migrate plan — 4 archetypes rendered (Path A), personal-banking queued behind the listing archetype (2026-11-19)
- Plan in `stardust/migrate/plan.md`; unit ledger `stardust/migrate/progress.json` (plan, archetypes done; listing/assets/report pending).
- `migrate.mjs render` with `--canon-css stardust/prototypes/shared/canon.css` (no `stardust/canon/`): 4 rendered, 0 refused. "broken" link counts are links to pages outside the 5-page scope — E2 repoints them to the source site.
- modules[] declared per archetype (section → block id); index's story/video rails kept distinct from business-banking's (home-blog/home-videos vs story-rail/video-rail) so archetype units stay disjoint; rollout B may merge them.
- Gated-archetype precondition met: progress.json `types.*.gates.{1440,360}.pass` true (index/about-us via accept-residual with causes).

## Rollout A-inventory — 5 coverage rows, 4 to deliver now, personal-banking content-pending (2026-11-19)
- `inventory.mjs` over stardust/migrated: 4 archetype rows pending, personal-banking content-pending until the listing sibling renders (re-run inventory then; it is incremental).
- rollout.json site: DA org `aemcoder`, site `1aa640c2`, ref `main`, liveHost `main--1aa640c2--aemcoder.aem.live`.

## Rollout B-block — 20 distinct module blocks, each converted on one archetype (2026-11-19)
- `blocks.mjs` → coverage/blocks.json (20 module blocks, header/footer are foundation); `plan.mjs` → plan.json, representative-first: about-us 5, business-banking 5, contact-us 1, index 9 conversions; personal-banking reuses the business-banking set.

## Rollout B2-dynamic — 17 curated rows re-verified unchanged, martech scaffolded fully disabled (2026-11-19)
- Fresh `dynamics-detect` on the 4 archetype URLs (home, about-us, business-banking, contact-us; all 200, no bot challenge): same 41 findings, same per-page reach; only host ordering moved (vc.hotjar.io not seen this run, same session-replay row).
- `dynamics-plan --target-origin main--1aa640c2--aemcoder.aem.page --martech`: 41 rows, axes identical to the earlier draft (self 8 · owner batch 32 · host-bound 2/2 — both first-party POSTs 404 on target). All 17 curated dispositions in `dynamic-features.md` / `-plan.md` kept; nothing contradicted. Gate: every row has a disposition.
- Martech: spec-martech evidence (`stardust/martech`, home + 3 archetypes) still current; contract rebuilt byte-identical apart from `writtenAt` — no CMP, consent model owner-decision, GTM-WHQPXDKW route `enabled: false`; handoff unchanged.
- `martech-scaffold.mjs` wrote `scripts/martech.js` and hooked it: `loadConsent()` first in `loadEager()` (scripts.js), `loadTags()` from `consented.js`, placeholder `hasConsent()` in `consent-check.js` now asks martech.js. Nothing loads by default; enabling stays with the owner.
- Lint: scaffold files clean after wrapping two over-long comment lines in `consent-check.js` (re-run of the scaffold reports unchanged); `eslint blocks scripts` and stylelint clean. Full `npm run lint` still reports errors only under `stardust/` tooling files (not touched here).

## Rollout C-deliver — all 5 pages live and published, roster gate 5/5 at both widths (2026-11-19)
- Units: foundation + archetype-form (earlier session); archetype-listing (business-banking 0.13%/0.28%), archetype-static (about-us 0.16%/0.14%), archetype-landing (index 0.44%/2.27%, 11 blocks) ran in parallel; migrate render `listing` then cluster-listing (personal-banking 0.17%/0.16%, archetype blocks reused, no variants); cluster-form/static/landing had 0 siblings.
- Index carousels autoplay (restoreAtDelivery kept): slide areas masked as self-varying in gates/all-*/masks.json; content override waives only the two hero slide-5 headings.
- C-final: 2 foundation requests applied once (a11y launcher flat below 768 on landing+static; header height on the header element), re-frozen; business-banking units override (story card 5 sits past the rail viewport on both sides).
- gate-all (--skip-existing): 1440 3 PASS + 2 overrides, 360 4 PASS + 1 override → 5/5 delivered; one transient live HTTP/2 error on a probe re-run clean. Coverage --gate applied.

## Rollout D-site — sitemap served 5 = assembled 5, no redirects needed, / 200 (2026-11-19)
- site/{sitemap.xml,robots.txt,manifest.json} assembled; `assemble.mjs --verify-origin` on .aem.live exit 0 (0 extra, 0 missing); root 200 on .aem.page and .aem.live.
- No stardust/redirects.tsv and the source root serves a page → no redirects sheet. /nav and /footer already serve robots noindex on live.
- Residual: the local assembled sitemap writes trailing slashes for some paths (assemble.mjs path building); the served platform sitemap is correct.

## Rollout D2-dynamic — parity 16/16 pass, 3 accepted, martech verified all-disabled (2026-11-19)
- dynamics-check on the .aem.live origin: 27/27 checks on the clean re-run (first run's 7 misses on non-root pages did not reproduce; nothing changed). parity.json 18 rows.
- YouTube popups open the player on /, /business-banking, /personal-banking; hero/promo/app-banner carousels autoplay (6 s).
- Accepted per dynamic-features.md: site search (row 2, not built), hidden advertisements tab (row 6), host-bound first-party API (row 15). Owner-gated vendors (a11y widget, chatbot, GTM, reCAPTCHA) stay off; martech.js served, GTM route enabled:false.

## Rollout E-full-site — 5/5 pages verified on the live origin (2026-11-19)
- verify.mjs first run: 3 pages 404 because it derives a trailing-slash URL from the migrated folder-index shape (about-us/index.html) while delivery serves leaf docs (/about-us = source URL); index + personal-banking flagged root-relative links to out-of-scope paths.
- Out-of-scope hrefs repointed to the source site (419 hrefs, 209 targets, 7 docs republished; decision in direction.md). Re-run on a scratch coverage copy with the delivered leaf paths: 5/5 verified (200, no about:error, internal links resolve, gate pass); verdicts applied through update-coverage.mjs.
- Autoplay restoreAtDelivery (hero/promo/app-banner carousels, YouTube popups) confirmed by the D2 parity run.

## Rollout E2-link-audit — internal hrefs root-relative, 209 out-of-scope targets repointed, 0 broken on live (2026-11-19)
- Scope extension (targets outside the 5-page plan) repointed to https://www.rbl.bank.in regardless of count: nav 307, footer 38, index 35, personal-banking 17, business-banking 11, contact-us 7, about-us 4 hrefs; list in direction.md. No capture gaps (no uncaptured in-scope target).
- localize-links --check PASS (0 localizable); every remaining root-relative href on the 7 live docs answers 200.

## Rollout F-optimize — 5 pages, 0 open P1, gate pass (2026-11-19)
- optimize.mjs over the 5 live pages (run from a scratch coverage copy carrying the delivered leaf paths — the stock run reached only 2 pages through the folder-index URL form); findings/scorecard kept under stardust/rollout/optimize/.
- Open: P1 0 · P2 5 (JSON-LD absent on all 5 pages) · P3 2 (title length on index, contact-us); 1 source-parity P3 (business-banking title) informational.

## Rollout G-aem — 0 autofixes applied: 2 title drafts declined (verbatim titles), 5 JSON-LD manual (2026-11-19)
- autofix-aem dry-run: 7 candidates. The 2 `eds-metadata-title` drafts (index, contact-us, from the <h1>) rewrite the source's own <title> — replica content is verbatim, so declined; findings stay open P3.
- 5 `eds-jsonld` are manual (head.html / metadata pipeline): the source pages carry JSON-LD; carrying it over is a foundation change left as an open P2 for a follow-up pass. Nothing re-deployed.

## Rollout H-report — 5/5 delivered, 0 P1; report + learnings written (2026-11-19)
- stardust/rollout/report/summary.md (pages, templates, blocks, quality, to-deliver) from rollout.json lastRun + scorecard; 3 learnings appended to stardust/learnings.md.

## Rollout I-dashboard — dashboard written; 5/5 pages migrated in state (2026-11-19)
- dashboard.mjs → stardust/rollout/dashboard/index.html (5 identified · 5 prototyped · 5 deployed).
- state.mjs advance: 5 pages → migrated; migrate units assets + report recorded done.

## Handoff — 5/5 pages delivered, published live and verified; done-check complete (2026-11-19)
- migrate → rollout A–I done; roster published-origin gate 5/5 delivered at 1440 and 360; dynamics parity 16/16 + 3 accepted; martech shipped all-disabled; 0 open P1.
- Owner follow-ups: enable martech parts when ready; carry the source JSON-LD (open P2); site search not built (dynamics row 2).
