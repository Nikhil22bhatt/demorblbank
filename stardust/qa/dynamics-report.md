# Dynamics parity check — https://main--1aa640c2--aemcoder.aem.live — 2026-11-19T12:03:55.668Z

Replayed 27 checks over 19 features · pass 27 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header mega menus + mobile drawer | M | done | dom-count | PASS | 4 × header .site-nav .site-nav-item .site-nav-toggle[aria-expanded] (min 4) |  |
| header mega menus + mobile drawer | M | done | dom-count | PASS | 171 × header .site-nav .mega-list .mega-item (min 10) |  |
| header mega menus + mobile drawer | M | done | dom-count | PASS | 32 × header #modal-products[role=dialog] .acnav-list (min 1) |  |
| Fixed Deposit Calculator (home) | F | done | dom-count | PASS | 13 × .fd-calculator input (min 3) |  |
| Fixed Deposit Calculator (home) | F | done | dom-count | PASS | 1 × .fd-calculator .fdc-result (min 1) |  |
| carousels: hero, Our Products, Offers and Deals, app banners (autoplay 6 s) | L | done | dom-count | PASS | 11 × .hero-carousel.is-playing .carousel-slide (min 2) |  |
| carousels: hero, Our Products, Offers and Deals, app banners (autoplay 6 s) | L | done | dom-count | PASS | 9 × .promo-carousel.is-playing .carousel-slide (min 2) |  |
| carousels: hero, Our Products, Offers and Deals, app banners (autoplay 6 s) | L | done | dom-count | PASS | 11 × .app-banner.is-playing .carousel-slide (min 2) |  |
| carousels: hero, Our Products, Offers and Deals, app banners (autoplay 6 s) | L | done | dom-count | PASS | 5 × .hero-carousel .carousel-dot (min 2) |  |
| Trust & Beyond video popups (YouTube embeds) | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 20 (ok) | www.youtube.com:200×13 fonts.gstatic.com:200×4 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 googleads.g.doubleclick.net:200×1 www.google.com:200×1 rr3---sn-o097znsz.googlevideo.com:200×1 rr4---sn-a5msenle.googlevideo.com:200×3 yt3.ggpht.com:200×2 www.gstatic.com:200×1 i.ytimg.com:200×3 www.youtube.com:204×7 |
| Trust & Beyond video popups (YouTube embeds) | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 20 (ok) | www.youtube.com:200×14 fonts.gstatic.com:200×2 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 www.google.com:200×1 googleads.g.doubleclick.net:200×1 i.ytimg.com:200×3 yt3.ggpht.com:200×2 www.youtube.com:204×6 jnn-pa.googleapis.com:200×1 rr4---sn-n4v7snlr.googlevideo.com:200×1 rr4---sn-a5msenle.googlevideo.com:200×2 |
| Trust & Beyond video popups (YouTube embeds) | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 20 (ok) | www.youtube.com:200×14 fonts.gstatic.com:200×2 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 www.google.com:200×1 googleads.g.doubleclick.net:200×1 rr4---sn-n4v7snlr.googlevideo.com:200×1 i.ytimg.com:200×3 yt3.ggpht.com:200×2 www.youtube.com:204×6 jnn-pa.googleapis.com:200×1 rr3---sn-a5meknzl.googlevideo.com:200×2 |
| About us awards timeline + year filter | CR | done | dom-count | PASS | 10 × .awards .award-card (min 4) |  |
| About us awards timeline + year filter | CR | done | dom-count | PASS | 27 × .awards .years-item (min 2) |  |
| Contact us FAQ accordion | M | done | dom-count | PASS | 9 × .contact-tabs .faq-card .faq-card-toggle[aria-expanded] (min 3) |  |
| About us tabs | M | done | dom-count | PASS | 5 × .page-tabs a (min 3) |  |
| utility strip contrast toggles + a11y launcher | M | done | dom-count | PASS | 2 × header .topbar-contrast (min 2) |  |
| utility strip contrast toggles + a11y launcher | M | done | dom-count | PASS | 1 × header .a11y-launcher (min 1) |  |
| Skynet All in One Accessibility widget | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| RBL Cares chat launcher | T | interim | dom-count | PASS | 1 × .chat-launcher (min 1) |  |
| RBL Cares chat launcher | T | interim | consent-gate | PASS | no request to 1 gated host pattern(s) before consent |  |
| Google Tag Manager GTM-WHQPXDKW | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 5 gated host pattern(s) before consent |  |
| runtime-injected tag-manager iframes | V | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| reCAPTCHA on source forms | F | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| drupalSettings / dataLayer objects | A | done | no-page-errors | PASS | none on 5 page(s) |  |
| LOGIN menu + account-opening links | X | done | dom-count | PASS | 8 × header a[href*='rbl.bank.in']:is([href*='online.'], [href*='digital.']) (min 1) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (1 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- header search -> /search-rbl-data (S) — interim · owner: search scope: migrated-pages index (interim) vs the source search service
- About us advertisements view (hidden tab) (CR) — interim · owner: revisit: whether the advertisements tab is shown
- first-party POST /ir_admin/user + bot-defense POST (A) — interim · owner: confirm no migrated surface needs /ir_admin/user · environment limit: host-bound to the source origin; not reachable from the new host by design
