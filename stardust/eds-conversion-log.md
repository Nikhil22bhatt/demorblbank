# EDS conversion log — RBL Bank replica

## Publish decision (2026-11-19)
- Decision made by the run's owner before delivery: **publish**. Every delivered page, the redirects sheet and the
  chrome documents (nav, footer and any locale variants) go live on the aem.live origin
  (`deploy-batch.mjs` without `--no-publish`, or `POST https://admin.hlx.page/live/…`).

## C0 foundation (unit `foundation`, 2026-11-19)
- Runtime probe → `stardust/runtime-contract.json`: vanilla EDS, `.block` + `data-block-name`, buttons
  `a.button.primary|secondary|accent` in `p.button-wrapper`, formatted-only buttonization, empty-section collapse,
  `template` metadata → body class.
- `styles/styles.css`: canon tokens (+ boilerplate aliases), base (canon resets: no list bullets, upright `<em>`,
  headings 500/1.3), Bootstrap-model grid (`.container` 1140, `.row`, `.col-*`), `.btn-blue` = EDS `a.button`,
  EW edit-mode repaint (a)(b), section scaffold (blocks paint their sections; default content capped 1140),
  `main .section:empty` collapse. Kept the structural layer (body gate, header/footer visibility gate).
  Chrome reservation: `header { height: var(--nav-height); padding-top: var(--chrome-top) }` —
  `--chrome-top` 115 / 140 (≥768), `--breadcrumb-h` 1 / 42, `body.listing` 41 (live listing breadcrumb),
  `body.landing` 250→75 (<768, mobile header in flow +80) / 248→144 (≥768) with `notice-hidden|notice-closed`.
- Fonts: `styles/fonts.css` Roboto variable latin (live face) + Font Awesome 4.7 (OFL), self-hosted in `fonts/`;
  boilerplate faces removed; `roboto-fallback` = local Arial / Liberation Sans (metric-compatible; the gate's
  dead-face check failed on Arial-less Linux). Nothing in `head.html`. Favicon: `favicon.ico` = captured source icon.
- Icons (`icons/`, code bus, decorative/UI): property, search, whatsapp, bell, home, login, payments, mobile-more,
  aioa, top-icon, rbl-cares, down-arrow-menu, plus/minus-acco, new-default/new-hover (png, CSS only).
  Editorial chrome media via `da-media-upload --scope chrome`: rbl-logo.svg, 3 menu promo webp, new-trade.png.
- Chrome documents (generated verbatim from `shared/header.html` + `footer.html` by
  `.work/rollout/probes/gen-chrome-docs.mjs`; PUT → preview → LIVE via deploy-batch, `Robots | noindex`):
  `/nav` = 6 sections (utility list · logo · 4 mega menus as nested lists · Products promo cards · tools incl. Login
  list · drawer h5 + nested list); `/footer` = 6 sections (columns with their sr-only h2 · Others lists · legal +
  Follow us + social · leaving-site notice · tab bar · launchers). Dropped: link aria-labels/targets (DA drops them),
  one empty live drawer row (not authorable).
- Header/footer blocks — template-slotted tier: canon DOM rebuilt as empty slots, authored nodes MOVED in (lists,
  links, pictures, icons); BEM classes kebab-cased for stylelint (`mega__list--l1` → `mega-list-l1`). Classes go on
  moved list nodes (chrome documents are edited as their own pages; EW instrumentation never reaches a fragment).
  `@ew-exempt` glue text: a11y launcher, hamburger, breadcrumb (path-derived, `breadcrumb` metadata overrides),
  contrast sr-labels (from authored link titles). Toggles are `role=button` spans (EW7).
- Behaviours (types.form.motion, all fired on live): mega menus hover/click/outside-click/Escape, sub-level hover,
  first branch open by default; Login dropdown on :hover; scroll morph ≥500 (`fixed-tab-body`,
  `body-active-effect`: nav shadow + TOP), barrio `scrolled`/`scrolldown`/`scrollup`; mobile drawer
  (hamburger → `.show` + `body.modal-open`, level labels → `is-open`, overlay/close/Escape); footer accordion
  (<768, `.active-t` + fa-minus); go-top scrolls to top. restoreAtDelivery: blink (property icon), MoveUpDown
  (chat launcher), up_down (TOP) — all running.
- Homepage switch (`template: landing` → `body.landing`): no breadcrumb, ticker spacing via `--chrome-top`, nav top
  147→43 on `notice-hidden` (header JS toggles it at ≥300 px scroll; the index unit authors the `.notice` ticker and
  its close → `notice-closed`), mobile header in flow, strip padding 8px 5px, 30px launcher without ring, footer
  extra band (13/15 px, `--rbl-footer`), full-white mobile copyright. Quick-links strip stays page content (index).
- Back-ports done: listing breadcrumb 41 px (`body.listing .breadcrumb` pb 6 px); listing footer +1.37 px
  (`body.listing .footer-bottom` pt 23.37 px); RBI .btn links 2 px lower (live parity, all templates).
- Lint: `npm run lint` clean (eslint, stylelint, `lint:breakpoints` added to `package.json` — 25 switches, all
  mobile-first). `.hlxignore` gains `content/`.

## C0 archetype-form — contact-us (template `form`, foundation-first gate, 2026-11-19)
- Block `contact-tabs` (plan.json: the whole `.contact-section`), section-schema → `stardust/eds-schema/contact-us.json`
  (47 items, repeats: 3 cards, 9 FAQ). Content `content/contact-us.html` generated verbatim from the prototype
  (`.work/rollout/probes/gen-contact-us.mjs`), metadata Title / Description / `template: form`.
  Rows (classified by content, never index): tabs `<ul>` · card ×3 [icon][h1|p title link + desc + **CTA**][bg] ·
  offices [icon][title + lines][icon][title + lines][bg] · FAQ `<h2>` · FAQ ×9 [question `<p>`][answer].
- Decode tiers: template-slotted — tabs, offices card (role by order inside a column: first address + tel lines take
  the live padded-span box); reconstructive — contact cards, FAQ rows. EW7: question stays a `<p>` in a
  `role=button` div, the whole header row takes the click. One `<h1>` (first card title, as live).
- Behaviours: tab strip `.fixed-tab` at scroll ≥ 500 (live scroll-init.js), FAQ Bootstrap-collapse (one open,
  height 0.35 s ease). Tabs scroll-x with hidden scrollbar (live `overflow-x: auto`).
- Media: 9 SVGs `da-media-upload --scope contact-us` (pure vector); delivered `.plain.html` 200, 1 `<h1>`,
  9 `<img>`, 0 about:error, 0 `/img/`.
- Chain: block-roundtrip `--ew` closed (36/36 editable, 0 dead/dup; `--map contact-tabs=.contact-section`),
  localize-links `--check` PASS, delivery-lint 0/0/0, media-reconcile 9 hosted, davids-model-lint PASS (🟡 D10/D3:
  one block with 1/3/5/2-cell rows — one block per plan), sanitise; deploy-batch PUT → preview → LIVE.
- Gate (published preview origin, frozen reference): 1440 r1 FAIL (dead `roboto-fallback` face on Linux; units
  selector) → r2 PASS 0.22 % aligned (0.40 % unaligned), Δh 1, clip 0, content 0/0, units ok;
  360 r1 FAIL (third tab HIDDEN behind overflow clip; units) → r2 PASS 0.24 %, Δh 0, clip 0, content 0/0.
  `stardust/replica/units.json` contact-cards build selector widened to `:is(.cardCont, .card-cont)` (kebab-case).
- Chrome bands (crop-compare vs frozen reference): header 1.13 % / footer 0.88 % (1440), 1.41 % / 0.84 % (360).
  chrome-parity: footer down to RBI .btn Δy (fixed after) + DA media filename signature; header/footer REGION and
  EXTRA rows are structural (EDS header/footer hosts carry nav, launchers, tab bar the live `<header>/<footer>` don't).
- Header contract (chrome-explore build 1440/360 vs the replica live contract, `--profile replica`):
  1440 17 errors = the gated prototype's own residuals (16 open-state panel crops 2–17 %, Preferred Banking 41 %;
  Search modal not built, dynamics row 2); 360: search control missing (row 2) + 4 scroll-state rows against the
  live record's 8 px root. Behaviour parity: hover/click open, outside/Escape close, sub-levels, drawer.
- Invariants (preview, 1440 + 360): blocks loaded (header, contact-tabs, footer), rows/tabs/footer compute flex,
  `a.button.primary` rgb(48,64,135), 1 h1, 0 zero-width images, 0 pageerror, Roboto + FontAwesome loaded,
  `/favicon.ico` = captured source icon; ai-readability strict 100 / code 100.
- Coverage: contact-us `verified` (gate rows 1440 + 360 recorded), block contact-tabs `verified`.

## C archetype-listing — business-banking (template `listing`, 2026-11-19)
- Blocks (plan.json): `listing-hero`, `product-grid`, `app-band`, `story-rail`, `video-rail`; section-schema →
  `stardust/eds-schema/business-banking.json`. Content `content/business-banking.html` generated verbatim from the
  prototype (`.work/rollout/probes/gen-business-banking.mjs`), metadata Title / Description / `template: listing`
  (body.listing → 41px breadcrumb from the foundation; breadcrumb label from the path).
  Rows (classified by content, never index): hero [picture] · [h1 + 2 ledes] — product-grid [intro] · card ×4
  [picture][h3 + copy + CTA link] — app-band [band picture][phone picture] · [h2 + tagline + linked store badges] —
  story-rail [h2] · card ×5 [picture][date + linked h3] · [CTA] — video-rail: section DEFAULT CONTENT (h2 + 4 thumbnail
  pictures linked to the YouTube embed URLs; davids-model D1 🔴 for embed URLs in block rows) + block row [CTA];
  the block reabsorbs its section's default content (EW8) and unwraps the thumb anchors into play buttons (EW6).
- Decode tiers: template-slotted — hero, app band, rail heads/CTAs, product intro; reconstructive — product cards,
  story cards, video cards. Cells whose lone `<p>` the pipeline unwraps are re-wrapped by MOVING the loose nodes.
  Tagline "Safe | Simple | Fast" authored as one paragraph; live's 10px span margins around "|" = `word-spacing: 10px`.
  Hero / story images are `<img>` with object-fit/object-position matching the live background-size/position; the
  story image layer keeps a placeholder paint (units matcher needs the live `-bg` box). Alt `aaatest` kept verbatim.
- Behaviours: story rail prev/next (slick infinite:false, 1s ease track, disabled states; native scroll-snap < 768),
  video modal (YouTube embed, × / overlay / Esc), app-band AOS fade-up 0.3s (IntersectionObserver; reduced-motion off),
  outline CTA hover 0.2s. Verified on preview: next → translate3d(-279px), modal opens/closes, card revealed.
- Media: 18 images `da-media-upload --scope business-banking`; delivered `.plain.html` 200, 1 `<h1>`, 18 `<img>`,
  0 about:error, 0 `/img/`; linked store badges and thumbs survive as `<a><picture>`.
- Chain: block-roundtrip `--ew` closed whole page (32/32 editable, 0 dead/dup; 🟡 IMG COUNT hero/story = CSS
  backgrounds in the prototype, 🟡 tagline spans), localize-links `--check` PASS, delivery-lint clean, media-reconcile
  18 hosted, davids-model-lint PASS (🟡 D1 hero/video-rail single-row, D3 ragged rows — bespoke components, one block
  per plan), deploy-batch PUT → preview → LIVE; lint (eslint/stylelint/breakpoints) clean on the five blocks.
- Gate (published preview origin, frozen reference): r1 pixel PASS both widths, FAIL units (build selectors);
  `stardust/replica/units.json` listing-story/video-cards build widened to `:is(.rail-section--blog, .story-rail)` /
  `:is(.rail-section--video, .video-rail)`; r2 units missing 4/2 (story `-bg` box) → r3 PASS:
  1440 0.13 % (text 1.26 %), Δh 0, clip 0, content 0/0, units ok; 360 0.28 % aligned (0.28 % unaligned), Δh 0,
  clip 0, content 0/0, units ok.
- Chrome bands (crop-compare vs frozen reference): header 0.69 % / footer 0.31 % (1440), 1.61 % / 0.66 % (360).
  chrome-parity: only the structural REGION/EXTRA/ICONS rows recorded in C0 (EDS header/footer hosts); RBI .btn
  Δy no longer present. No foundation request.
- Invariants (preview, 1440 + 360): all 7 blocks loaded, grid/tracks compute flex, 1 h1, 0 pageerror, Roboto +
  FontAwesome loaded; ai-readability strict 100 / code 100.
- Coverage: business-banking `verified` (gate rows 1440 + 360 recorded), blocks ×5 `verified`. verify.mjs is not
  usable here: it requests the folder-index form `/business-banking/` (404 on EDS) and flags the out-of-plan internal
  links (`/business-banking/*`, `/blog/*`) — same five-page scope as contact-us.

## C archetype-static — about-us (template `static`, path `/about-us`, 2026-11-19)
- Blocks (plan.json): `about-banner` (.au-banner), `about-intro` (.au-about), `impact-stats` (.au-impact), `awards`
  (.au-awards), `values` (.au-values) — one section each; section-schema → `stardust/eds-schema/about-us.json`.
  Content `content/about-us.html` generated verbatim from the prototype (`.work/rollout/probes/gen-about-us.mjs`),
  metadata Title / Description / `template: static`; breadcrumb "About Us" derives from the path (header).
- Rows (classified by content, never index): banner [desktop pic][mobile pic] · [h1 + 2 p] — intro [tabs `<ul>`] ·
  [h2 + 5 p][figure] — stats [icon][h2 + p] ×4 · [date p] — awards [tabs `<ul>`] · per pane [years `<ul>`, checked year
  `<strong>`] + [pic][title p + desc p] ×10 | [empty p]; a pane without awards hides its tab (Advertisements, as live) —
  values [h2] · vision [h3 + p] ×3 · [h2] · mission [h3 + p][pic] ×4 · split [pic][h4 + p + `<em>` CTA] / reversed when
  the text cell comes first.
- Decode tiers: template-slotted — banner, intro, year strip, award card body (title/desc by order); reconstructive —
  stat cards, award cards, vision/mission cards, split rows. EW: 65/65 editable, 0 dead/dup; the hidden "Apply" submit
  (live js-hide) is not rebuilt (2 🟡 MISSING BODY, intentional).
- Behaviours: AOS fade-up (live class names, offset 120, delays 300/600/900/300 stats, 600/900/1500 values rows, once);
  award img hover scale 1.03 0.2 s linear; year-strip prev/next (slick: 1 per click, 10 / 3 visible, prev disabled at 0);
  awards/advertisements tab switch. Filtering not implemented (dynamic-features row 5: settled snapshot).
- Media: 17 files `da-media-upload --scope about-us` (4 pure-vector SVG icons; `finnoviti.gif` static → PNG first
  frame, `gif2png.mjs`); delivered `.plain.html` 200, 1 `<h1>`, 23 `<img>`, 0 about:error, 0 `/img/`.
- Chain: block-roundtrip `--ew` closed per block + whole page, localize-links `--check` PASS, davids-model-lint PASS
  (🟡 D3 mixed cell counts per block, D4 SVG verify), delivery-lint 0/0/0, media-reconcile 17 hosted, sanitise;
  deploy-batch PUT → preview → LIVE (`stardust/deploy/ledger-archetype-static.json`).
- Gate (preview origin, frozen reference): 1440 r1 PASS 0.64 % Δh −27 → r2 (values split rows each in their own
  flex column stopped margin collapse, +30 px) PASS 0.16 % aligned (2.24 % unaligned), Δh 3, clip 0, content 0/0;
  360 r1 PASS 0.42 % Δh −30 → r2 PASS 0.14 % (0.14 %), Δh 0, clip 0, content 0/0.
- Chrome bands (crop-compare vs frozen reference): header 0.57 % / footer 0.56 % band-aligned (1440), header 2.03 % →
  0.83 % after the a11y-launcher override / footer 0.69 % (360). Foundation request filed: launcher < 768 flat 30 px
  state on the about-us reference; scoped override `body.static header .a11y-launcher` in about-banner.css.
- chrome-parity: footer Δy −2 rows + Trade & Forex icon Δh −3 (canon footer drift, the prototype's recorded residual);
  header/footer EXTRA (tab bar, TOP) and icon-count rows are structural, as C0.
- Invariants (preview, 1440 + 360): 7 blocks loaded, footer cols flex, CTA `a.button.secondary` outline, 1 h1,
  0 zero-width images, 0 pageerror, Roboto + FontAwesome loaded; ai-readability strict 100 / code 100.
- Coverage: about-us `verified` (gate rows 1440 + 360 recorded), blocks about-banner, about-intro, impact-stats,
  awards, values `verified`.

## C cluster-listing — personal-banking (template `listing`, sibling of business-banking, path `/personal-banking`, 2026-11-19)
- Variance probe (live business-banking vs personal-banking, archetype block selectors, 1440): exit 2 — card count
  4 → 10, first card h 508 → 481 (shorter copy; same bg/radius/font/image box), section height follows; no grid intro
  paragraph on this page. Zero variant classes budgeted; the five archetype blocks are reused unforked
  (`stardust/rollout/units/listing-variance.json`). App band + both rails byte-identical to the archetype on live.
- Render (migrate unit `listing`): A′ sibling `stardust/migrated/personal-banking/` from
  `stardust/prototypes/personal-banking-sibling.html` (archetype main fragment + this page's slots from the hydrated
  capture: hero image/h1/2 ledes, 10 product cards). Content-count 3/3 headings · 20/20 body · 16/16 CTAs · 25/25 images.
- Encoder: the archetype's generator forked as `.work/rollout/probes/gen-personal-banking.mjs` — same rows and decode
  tiers (template-slotted hero/app band/rail heads; reconstructive cards); intro row emitted only when present (the
  product-grid intro row is optional in the block). Shared app-band/rail media keep the `business-banking` scope;
  11 new images `da-media-upload --scope personal-banking`.
- Chain: block-roundtrip `--ew` closed (listing-hero 3/3, product-grid 30/30, app-band 2/2, story-rail 12/12,
  video-rail 2/2 editable; 0 dead/dup), localize-links `--check` PASS, delivery-lint clean, media-reconcile 24 hosted,
  davids-model-lint PASS (same 🟡 D1/D3 as the archetype). deploy-batch → preview → LIVE (`ledger-cluster-listing.json`);
  delivered `.plain.html` 1 `<h1>`, 24 `<img>`, 0 about:error, 0 `/img/`. No code changes.
- Gate (published preview origin, round 1): 1440 0.17 % (text 1.17 %), Δh 0, clip 0, MISSING 0 / HIDDEN 0 PASS;
  360 0.16 % aligned (0.17 % unaligned), Δh 0, clip 0, MISSING 0 / HIDDEN 0 PASS. Chrome bands (crop-compare vs frozen
  reference): header 0.68 % / footer 0.33 % (1440), 1.77 % / 0.81 % (360). chrome-parity: the structural
  REGION/EXTRA/ICONS rows of the EDS header/footer hosts recorded in C0, plus footer "Trade & Forex Services" icon
  Δh −3px (new-trade.png via DA media) — frozen foundation chrome, within the band bar; no foundation request.
- Coverage: personal-banking `verified` (gate rows 1440 + 360 recorded). Sidecar gatesPassed: full acceptance set.

## C archetype-landing — index (template `landing`, home page `/`, 2026-11-19)
- Blocks (plan.json `index.convert` + the two homepage chrome strips the foundation left to this unit):
  `notice` (ticker), `quick-links` (< 768 strip), `hero-carousel`, `rates`, `promo-carousel`, `fd-calculator`,
  `app-banner`, `product-cards`, `offer-cards`, `home-blog`, `home-videos` — one block per section. Content
  `content/index.html` generated verbatim from the prototype (`.work/rollout/probes/gen-index.mjs`, cheerio),
  DA document `index` (deploy-batch web path `/index`, added to the unit's paths file beside `/`), metadata
  Title / Description / `template: landing`. Icons `download-icon`, `next-btn` (UI glyphs, `icons/`, link names from
  the authored link title); `noti.svg` is block CSS. 50 media `da-media-upload --scope index` (6 pure-vector SVGs).
- Decode tiers: template-slotted — notice, fd-calculator (fixed composition: typed rows found by content — heading,
  payout list, outputs, CTAs, reset, terms — the rest by order); reconstructive — carousels (rows = slides:
  [desktop art][mobile art][copy][style]), rates, quick links, the four rails ([title] · cards · [CTA]).
  Config cells (@ew-exempt): promo slide style `light` / `compact`, app slide colour from a closed set
  (`aqua | sky | lavender | green | white`, D15), payout `<select>` options (derived from the authored list).
  Video cards: [thumb][title + "Play video" link] (D1: the embed URL never stands alone in a cell); the card is a
  `role=button` trigger for one shared popup (EW7). Every lone-`<p>` cell the pipeline unwraps is re-gathered by
  the blocks (`items()`), CTAs re-buttonized when decorateButtons could not see them.
- Behaviours: carousels slick model (track translate 1 s, loop clones last-before + all-after, hidden / inert /
  instrumentation stripped — EW4), dots `slick-dots` with the 6 s aniWidth fill; captureState restoreAtDelivery:
  autoplay 6 s from init (live timing: not held by hover/focus — matched the live promo slide in the presence
  probe), paused while the tab is hidden, off under reduced motion; arrows, dots, touch swipe. Rails: one card per
  step, disabled ends, swipe; AOS fade-up (300 ms, once, offset 120) on FDC / products / offers. Notice close →
  `notice-closed` (scroll hide is the header's). FD calculator client-only (dynamic-features row 3).
- Chain: block-roundtrip `--ew` whole page closed (11 blocks, 0 structural 🔴, 0 dead / dup), localize-links
  `--check` 0 (1 kept external: /nrfxrates), davids-model-lint PASS (0 🔴, 10 🟡 D3 span-shaped rows / D1 notice /
  D4 SVG), sanitise, lint clean (eslint, stylelint, breakpoints mobile-first); deploy-batch PUT → preview → LIVE
  (one transient 503 on the verify, re-run OK); `.plain.html` 200, 1 `<h1>`, 50 `<img>`, 0 about:error, 0 `/img/`.
- Foundation request filed: `--nav-height` resolves at `:root`, so `body.landing` header reserved 116 px under a
  250 px padding below 768 (main 80 px high) → scoped override in `blocks/notice/notice.css`.
- Gate (preview origin, frozen reference): 1440 3 rounds — r1 pixel 5.88 % / clip 1 (hero link 5 px past the
  viewport) / content MISSING 8; r2 5.87 % / MISSING 3; r3 8.75 % PASS pixel, Δh 0, clip 0, content MISSING 2 →
  FAIL. 360 2 rounds — 11.06 % (Δh 1, clip 0, MISSING 2) → FAIL, identical on re-capture (deterministic).
  Cause, both widths: the autoplaying carousels. The stitch's freeze clicks the first slick dot (hero → slide 1 on
  both sides), but the reference froze live's promo on slide 3 and app on slide 2 (360, unmasked rows ~1000–2000,
  3000–3500), and the presence probe (~25 s in) sees live's hero on slide 5 vs ours on 4 — the hero h1/h2 live on
  slide 5, so "MISSING HEADING" (content-presence checks headings even inside `--variable` regions;
  `presence.json` index entry added for the three carousels). Non-carousel bands ≤ 3.6 %.
- Chrome bands (crop-compare vs frozen reference): header 0.46 % / footer 0.57 % (1440); header 2.00 % (blink
  phase + AA, same as the prototype residual) / footer 1.24 % (360). chrome-parity 1440: header REGION / EXTRA rows
  structural (as C0), footer 78/79 texts paired.
- Unresolved (owner decision): autoplay restoration vs a frozen-reference gate — either mask the carousel rows at
  360 / waive content for slide-bound headings, or accept-residual; coverage index `failed` (gate rows recorded).
- Owner decision (coordinator, 2026-11-19): keep autoplay (restoreAtDelivery is never re-frozen). Carousel slide
  areas declared self-varying in `gates/all-{1440,360}/masks.json` `index` (1440 248:395, 880:345, 1880:380;
  360 392:456, 1184:570, 3110:540 — "live carousel mid-rotation in the frozen origin; restoreAtDelivery
  autoplay", printed on the verdict); `presence.json` regions cover hero / promo / app-banner; the only content
  findings left are the hero slide-5 h1/h2 (present in the served carousel, another slide at probe time) →
  `overrides.json` `index` `waives: ["content"]` naming exactly those two headings. Also fixed: FD customer
  labels inline below 768 (live parity). Re-run with `--skip-existing` (origin frozen):
  1440 PASS (override) — pixel 0.44 % aligned, Δh 0, clip 0, content MISSING 2 waived;
  360 PASS (override) — pixel 2.27 % aligned, Δh 1, clip 0, content MISSING 2 waived. Coverage gate rows recorded.
- Header crop 360 2.00 % (= the 2 % bar): the prototype's known residual — the Rent-Your-Property icon blink
  (canon animation, foundation-owned) frozen at another phase than the live reference + sub-pixel AA on "Skip to
  Main Content"; no foundation edit. Footer 360 1.24 %, header / footer 1440 0.46 % / 0.57 %.

## C-final — foundation requests applied (2026-11-19)

Freeze lifted for this task only; re-frozen afterwards (`foundation-freeze.mjs freeze`, 15 files).

- archetype-static (a11y launcher < 768) — evidence first: the launcher region (x300-360 y0-45) of every
  page's 360 frozen reference shows the 30px flat rgb(48,64,134/135) state on index (landing) and about-us
  (static) only; business-banking / personal-banking (listing) and contact-us (form) show the ringed 36px
  #17276d + #ffc107 state. Applied in `blocks/header/header.css` by adding `body.static` to the
  existing `body.landing` launcher selectors (< 768 flat, >= 768 ringed, >= 787 right 83); the
  override in `blocks/about-banner/about-banner.css` is removed. Commit c9e3d4b.
- archetype-landing (`--nav-height`) — `styles/styles.css` `header` now derives its height on the element,
  `calc(var(--chrome-top) + var(--breadcrumb-h))`, so body-scoped template overrides reach it; the
  `body.landing header` override in `blocks/notice/notice.css` is removed. Commit c9e3d4b.
- Fix round 1: the per-element derivation woke the never-applied `body.listing { --breadcrumb-h: 41px }`
  (>= 768) and shifted business-banking / personal-banking 1px at 1440 (Δh 0 → 1). The listing pages were
  gated at 42, so the dead rule is dropped (869b5ef); both back to Δh 0 (0.13 % / 0.19 %).
- Re-gate on the preview host, all 5 pages: 1440 — index 0.43 % (override), about-us 0.16 %, contact-us 0.20 %,
  personal-banking 0.19 %, business-banking 0.13 % pixel/height/clip/content PASS but units FAIL (see below);
  360 — index 2.27 % (override), about-us 0.14 %, business-banking 0.28 %, personal-banking 0.16 %,
  contact-us 0.24 %, all delivered.
- Header band crop 360 (eds vs frozen reference): index 0.94 % (330px band), about-us 0.64 % (was 2.03 %),
  business-banking 1.61 %, personal-banking 1.79 %, contact-us 1.79 %; launcher probe on the EDS shots
  matches the references per template.
- Unresolved — business-banking 1440 units: the 5th story-rail card (x 1283-1535, clipped and blank in both
  origin.png and eds.png) reads `hidden 3`. Not caused by this change (pixels identical, Δh 0): since the
  coverage row's template became `business-banking` the `footer-link-columns` family (n 5) applies, and
  gate-all passes the page-wide max n to unit-geometry, so the story family (declared n 4) compares a 5th,
  off-screen unit. Coverage records business-banking `failed` (gate: units hidden 3) truthfully; needs a
  gate-config decision (per-family n or units.json), not a page fix.
