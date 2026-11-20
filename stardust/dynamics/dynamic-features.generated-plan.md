<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-19T09:53:06.627Z · input stardust/current/_dynamics.json (4 pages, 41 findings) · target probe https://main--1aa640c2--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-skynettechnologies-com | A | unknown third-party host www.skynettechnologies.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-freeada-skynettechnologies-com | A | unknown third-party host freeada.skynettechnologies.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-sdk-rsut-io | A | unknown third-party host sdk.rsut.io | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-px-ads-linkedin-com | A | unknown third-party host px.ads.linkedin.com | 4/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-first-party-api-post-ps5ycry5pu9z-u3-e-zl2fdc6m-p9umtzvpsc | A | first-party API POST /pS5ycrY5Pu9Z/u3/E_zl2fDc6m/p9umtzVpScpJbJ/SgwXNDU/RC/IbZy0BUl0 | 4/4 | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 6 | a-first-party-api-post-ir-admin-user | A | first-party API POST /ir_admin/user | 4/4 (reach 5/5) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 7 | a-cms-app-settings-object-drupalsettings | A | CMS / app settings object drupalSettings | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 8 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 9 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 2/4 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 10 | cr-client-rendered-slot-view-view-awards-view-id-awards | CR | client-rendered slot view view-awards view-id-awards | 1/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 11 | cr-client-rendered-slot-fieldgroup-form-composite-js-form-it | CR | client-rendered slot fieldgroup form-composite js-form-item | 1/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 12 | cr-client-rendered-slot-view-view-advertisements-view-id-adv | CR | client-rendered slot view view-advertisements view-id-advertisements | 1/4 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 13 | f-form-protection-captcha-antibot | F | form protection: captcha / antibot | 2/4 | rebuild-native | block | needs-backend | pending | forms | production backend (vendor form id + field mapping) |  |
| 14 | f-form-less-control-group-in-div-form-group-radio-5-controls | F | form-less control group in div.form-group-radio (5 controls) | 1/4 | rebuild-native | widget | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 15 | f-form-less-control-group-in-input-form-control-small-white- | F | form-less control group in input.form-control-small-white (3 controls) | 1/4 | rebuild-native | widget | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 16 | f-form-views-exposed-form-awards-block-1-origin-about-us-16- | F | form "views-exposed-form-awards-block-1" → origin /about-us (16 fields) | 1/4 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 17 | f-form-views-exposed-form-advertisements-block-1-origin-abou | F | form "views-exposed-form-advertisements-block-1" → origin /about-us (11 fields) | 1/4 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 18 | i18n-locale-variants-fd-fd-fd-fd-fd | I18N | locale variants fd,fd,fd,fd,fd | 2/4 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 19 | i18n-locale-variants-fd-fd-fd-in-in | I18N | locale variants fd,fd,fd,in,in | 1/4 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 20 | i18n-locale-variants-fd-fd-in-fd-fd | I18N | locale variants fd,fd,in,fd,fd | 1/4 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 21 | l-listing-candidate-slick-track-5-cards | L | listing candidate slick-track (5 cards) | 2/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 22 | l-listing-candidate-slick-track-11-cards | L | listing candidate slick-track (11 cards) | 1/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 23 | m-modal-trigger-accessibility-modal-reset-button-target-outs | M | modal trigger accessibility-modal-reset-button → target outside DOM at capture | 4/4 (reach 5/5) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 24 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 4/4 (reach 10/5) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 25 | s-site-search-form-search-rbl-data | S | site search form → /search-rbl-data | 4/4 (reach 0/5) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 26 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-www-gstatic-com | T | unknown third-party host www.gstatic.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | t-analytics-session-replay | T | analytics: session replay | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 30 | t-unknown-third-party-host-static-cdn-trackier-com | T | unknown third-party host static-cdn.trackier.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 31 | t-unknown-third-party-host-static-ads-twitter-com | T | unknown third-party host static.ads-twitter.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 32 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 33 | t-unknown-third-party-host-www-linkedin-com | T | unknown third-party host www.linkedin.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 34 | t-unknown-third-party-host-t-co | T | unknown third-party host t.co | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 35 | t-unknown-third-party-host-analytics-twitter-com | T | unknown third-party host analytics.twitter.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 36 | t-unknown-third-party-host-px4-ads-linkedin-com | T | unknown third-party host px4.ads.linkedin.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 37 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 38 | t-third-party-mount-div-data-nosnippet-tag-manager-injected- | T | third-party mount <div data-nosnippet> (tag-manager-injected widget) | 4/4 | embed-passthrough | embed | needs-credential | pending | embed-passthrough | vendor account ids stay the owner's |  |
| 39 | t-unknown-third-party-host-d34s92jlbrwuc5-cloudfront-net | T | unknown third-party host d34s92jlbrwuc5.cloudfront.net | 3/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 40 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 2/4 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 41 | x-sign-in-account-links | X | sign-in / account links | 4/4 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 8 row(s) — read-settings, settled-dom-snapshot, modal-loader, chrome-interaction, search-index-backed.
- **One owner decision batch:** 32 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · production backend (vendor form id + field mapping) · production endpoint; interim capture ships now · scope of the locale trees · index-driven or editorially curated?.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 2 of 2 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/1 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 13
- **detect** — 7
- **forms** — 5
- **capture** — 3
- **locale wave** — 3
- **off-origin data** — 2
- **listings** — 2
- **interactive** — 2
- **embeds** — 2
- **search** — 1
- **register** — 1
