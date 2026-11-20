# Prototype gate — every crafted prototype, 360px

2026-11-19T09:48:29.969Z · **4 PASS / 0 FAIL / 0 error of 4**

Verdict: pixel criterion (aligned % ≤ 10 AND total offset ≤ the bound; alignment not used: unaligned % ≤ 10) AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **4 PASS**; full verdict (1–4): **4 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 0; content n/a (origin not probed) 0; pixel criterion met only thanks to alignment (unaligned % over the threshold): 0.
| page | template | tier | origin | browser | pixel % aligned (unaligned) [text] | offsets | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/about-us-proposed.html` | - | - | stitch-live | chrome | 0.12 (0.12) | 4 step(s), 4px (bound 8) | 0 | 0 | n/a | - | PASS (masked 260 rows: self-varying rows of the frozen reference (noise floor 0.07%)) | - |
| `/business-banking-proposed.html` | - | - | stitch-live | chrome | 0.19 (0.2) | 4 step(s), 4px (bound 8) | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS (masked 228 rows: self-varying rows of the frozen reference (noise floor 0.19%)) | - |
| `/contact-us-proposed.html` | - | - | stitch-live | chrome | 0.24 (0.26) | 4 step(s), 4px (bound 8) | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS (masked 228 rows: self-varying rows of the frozen reference (noise floor 0.18%)) | - |
| `/index-proposed.html` | - | - | stitch-live | chrome | 2.52 (2.54) | 1 step(s), 1px (bound 8) | 1 | 0 | n/a | - | PASS (masked 588 rows: self-varying rows of the frozen reference (noise floor 3.68%)) | - |
