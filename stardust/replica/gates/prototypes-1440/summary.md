# Prototype gate — every crafted prototype, 1440px

2026-11-19T09:48:22.343Z · **4 PASS / 0 FAIL / 0 error of 4**

Verdict: pixel criterion (aligned % ≤ 10 AND total offset ≤ the bound; alignment not used: unaligned % ≤ 10) AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **4 PASS**; full verdict (1–4): **4 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 0; content n/a (origin not probed) 0; pixel criterion met only thanks to alignment (unaligned % over the threshold): 0.
| page | template | tier | origin | browser | pixel % aligned (unaligned) [text] | offsets | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/business-banking-proposed.html` | - | - | stitch-live | chrome | 0.24 (0.32) | 2 step(s), 2px (bound 8) | 2 | 0 | n/a | off 0 hidden 0 missing 0 | PASS (masked 232 rows: self-varying rows of the frozen reference (noise floor 0.08%)) | - |
| `/about-us-proposed.html` | - | - | stitch-live | chrome | 0.31 (0.34) | 2 step(s), 2px (bound 8) | 2 | 0 | n/a | - | PASS (masked 72 rows: self-varying rows of the frozen reference (noise floor 0.01%)) | - |
| `/index-proposed.html` | - | - | stitch-live | chrome | 0.4 (0.43) | 2 step(s), 2px (bound 8) | 0 | 0 | n/a | - | PASS (masked 1024 rows: self-varying rows of the frozen reference (noise floor 7.31%)) | - |
| `/contact-us-proposed.html` | - | - | stitch-live | chrome | 0.34 (1.45) | 2 step(s), 2px (bound 8) | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS (masked 212 rows: self-varying rows of the frozen reference (noise floor 0.13%)) | - |
