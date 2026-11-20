# Dynamic features — www.rbl.bank.in

<!-- stardust provenance: skill=stardust:dynamics (via replica Phase 2) · curated from stardust/dynamics/dynamic-features.generated-plan.md (41 rows) · 2026-11-19 · hands-off -->

## Listings contract
none — the carousels on the five pages (Our Products, Offers and Deals, Money, People & Safety, Trust & Beyond, product card grids) are editorially curated rows authored in each document; no query-index-driven listing.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | m-chrome-menus | header mega menus (Products / Payments / Offers / Customer Services) + mobile drawer | M | 5/5 | rebuild-native | runtime | self | planned | chrome-interaction | none (header contract is the spec) | aria-haspopup ×10 |
| 2 | s-site-search | header search → /search-rbl-data | S | 5/5 | index-backed | widget | self | planned | search-index-backed | interim: query-index over the migrated pages; corpus smaller than source = parity note | search_api_fulltext |
| 3 | c-fd-calculator | Fixed Deposit Calculator (home) | F→client-only | 1/5 | client-only | widget | self | planned | client-compute | none | form-group-radio typeOfCustomer ×5, 3 inputs |
| 4 | l-carousels | slick carousels: hero banners, Our Products, Offers and Deals, Money People & Safety, Trust & Beyond | L | 4/5 | rebuild-native | block | self | planned | carousel | editorially curated rows (named assumption) | slick-track 5 / 11 cards |
| 5 | cr-awards-filter | About us awards timeline + year filter (Drupal view) | CR + F | 1/5 | static-snapshot | content | self | planned | settled-dom-snapshot | undecided — revisit at rollout; the settled "All" state ships as content | view-awards, views-exposed-form-awards-block-1 |
| 6 | cr-advertisements | About us advertisements view (hidden tab) | CR + F | 1/5 | static-snapshot | content | self | planned | settled-dom-snapshot | undecided — revisit at rollout | view-advertisements |
| 7 | m-faq-accordion | Contact us FAQ accordion | M | 1/5 | rebuild-native | block | self | planned | accordion | none | card-header button.faq-rbl-link-faq |
| 8 | m-about-tabs | About us tabs (About Us / Board of Directors / Leadership Team) | M | 1/5 | rebuild-native | block | self | planned | tabs | none; non-current tabs link to their source pages | tab links |
| 9 | m-accessibility-contrast | utility strip: Low / High Contrast View toggles + accessibility widget reset | M | 5/5 | rebuild-native | runtime | self | planned | modal-loader | contrast toggles rebuilt as page-class switches | accessibility-modal-reset-button |
| 10 | t-accessibility-widget | Skynet "All in One Accessibility" widget (www/freeada.skynettechnologies.com) | T | 5/5 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | embed-passthrough | owner: licence for the new host | skynettechnologies hosts |
| 11 | t-chatbot | RBL Cares chat launcher (sdk.rsut.io / cloudfront) | T | 5/5 | embed-passthrough | embed | needs-credential | interim | embed-passthrough | owner: chatbot SDK key for the new host; interim = static launcher image | data-nosnippet mount, sdk.rsut.io |
| 12 | t-gtm | Google Tag Manager GTM-WHQPXDKW (GA4, Google Ads, DoubleClick, LinkedIn, Facebook, Twitter, Hotjar, Trackier) | T | 5/5 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | owner enables the route in stardust/martech-contract.json | googletagmanager.com + 12 pixel hosts |
| 13 | v-runtime-iframes | runtime-injected 0×0 iframes (tag-manager) | V | 2/5 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | embed-passthrough | rides GTM row 12 | iframe without src |
| 14 | f-captcha | reCAPTCHA (www.google.com / gstatic) on source forms | F | 2/5 | embed-passthrough | embed | needs-backend | scaffolded-awaiting-owner | forms | no form on the five pages submits on-site (query/complaint flows link out) | www.google.com recaptcha |
| 15 | a-first-party-api | first-party POST /ir_admin/user and an obfuscated bot-defense POST | A | 5/5 | data-fed | — | needs-business-decision | interim | off-origin-data | host-bound on target; no consumer on the migrated pages (no visible content depends on it) | 403/200, 201 |
| 16 | a-settings | drupalSettings / dataLayer objects | A | 5/5 | static-snapshot | content | self | planned | read-settings | dataLayer is recreated by GTM when the owner enables it | settings keys |
| 17 | x-sign-in | LOGIN menu + account-opening links (online.rbl.bank.in, digital.rbl.bank.in) | X | 5/5 | static-snapshot | content | self | planned | link | links migrate as links to the source apps | hrefs |

Dropped as noise: `i18n-locale-variants-*` (3 rows) — the "fd"/"in" tokens are URL path segments of digital.rbl.bank.in/fd and the App Store link, not locale trees.

## Decision batch
One message to the owner (hands-off: each is a named assumption, the interim ships):
- **Tags (rows 12, 13):** which GTM tags run on the new host — the contract carries GTM-WHQPXDKW disabled; enable it in `stardust/martech-contract.json` (see `stardust/martech-handoff.md`). No CMP was found on the source.
- **Accessibility widget (row 10):** the Skynet widget licence/domain for the new host.
- **Chatbot (row 11):** SDK key for the RBL Cares chatbot on the new host.
- **Search (row 2):** whether the new site's search should cover only migrated pages (interim) or keep the source's search service.
- **First-party APIs (row 15):** confirm no migrated surface needs /ir_admin/user.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none decided out (hands-off assumptions never decide out) | — |
