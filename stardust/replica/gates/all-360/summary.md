# Published-origin gate — all deployed pages, 360px

2026-11-19T11:52:37.047Z · **4 PASS / 1 FAIL / 0 error of 5** (+1 documented override → 5 delivered)

Verdict: pixel criterion (aligned % ≤ 10 AND total offset ≤ the bound; alignment not used: unaligned % ≤ 10) AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance) AND content MISSING + HIDDEN links/headings = 0

Calibration — pixel-only verdict (criteria 1+2): **5 PASS**; full verdict (1–4): **4 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 1; content n/a (origin not probed) 0; pixel criterion met only thanks to alignment (unaligned % over the threshold): 0.
| page | template | tier | origin | browser | pixel % aligned (unaligned) [text] | offsets | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/about-us` | about-us | - | stitch-live | chrome | 0.14 (0.14) [0.36] | 4 step(s), 4px (bound 106) | 0 | 0 | MISSING 0 / HIDDEN 0 | off 0 hidden 0 missing 0 | PASS (masked 260 rows: self-varying rows of the frozen reference (noise floor 0.07%)) | - |
| `/personal-banking` | listing | - | stitch-live | chrome | 0.16 (0.17) [0.87] | 4 step(s), 4px (bound 78) | 0 | 0 | MISSING 0 / HIDDEN 0 | off 0 hidden 0 missing 0 | PASS (masked 228 rows: self-varying rows of the frozen reference (noise floor 0.09%)) | - |
| `/contact-us` | contact-us | - | stitch-live | chrome | 0.24 (0.26) [0.31] | 4 step(s), 4px (bound 38) | 0 | 0 | MISSING 0 / HIDDEN 0 | off 0 hidden 0 missing 0 | PASS (masked 228 rows: self-varying rows of the frozen reference (noise floor 0.18%)) | - |
| `/business-banking` | business-banking | - | stitch-live | chrome | 0.28 (0.28) [1] | 4 step(s), 4px (bound 50) | 0 | 0 | MISSING 0 / HIDDEN 0 | off 0 hidden 0 missing 0 | PASS (masked 228 rows: self-varying rows of the frozen reference (noise floor 0.19%)) | - |
| `/` | index | - | stitch-live | chrome | 2.27 (2.3) [2.44] | 1 step(s), 1px (bound 63) | 1 | 0 | MISSING 2 / HIDDEN 0 | - | FAIL (elements) (masked 1566 rows: live carousel mid-rotation in the frozen origin (hero / promo / app-banner slide areas); restoreAtDelivery autoplay on the build; self-varying rows of the frozen reference (noise floor 3.68%)) → PASS: content MISSING only for the hero slide-5 headings — h1 "Pay your taxes seamlessly with RBL Bank. Direct tax, GST, Custom duty & more." and h2 "Pay via: Internet Banking | Branch" — present in the served hero-carousel but on a slide not showing at probe time: live and build carousels autoplay (restoreAtDelivery, owner decision 2026-11-19); no other content finding | content MISSING 2 / HIDDEN 0 |
