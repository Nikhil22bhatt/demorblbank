# Learnings

- 2026-11-19 · rollout verify/optimize/assemble derive a page's served URL from the migrated tree shape (`<slug>/index.html` → `/<slug>/`), while deploy delivered leaf docs (`/<slug>`, the source URL): 3 pages read 404 and the assembled sitemap carried trailing slashes. Run them from a scratch coverage copy with the delivered paths, or align migrate's output shape with the delivery path.
- 2026-11-19 · gate-all units check takes the largest declared `n` on a page across groups, so a 5-column footer group made a 4-card rail check its off-viewport 5th card; scope unit groups per template.
- 2026-11-19 · carousels restored to autoplay at delivery make the frozen origin mid-rotation: mask the slide areas as self-varying and waive only the named rotating-slide headings.
