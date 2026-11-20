# migrate plan (replica flow, 2026-11-19)

In scope: 5 pages (stardust/.labs/site-plan.json)
  Path A  (approved)          4 pages: index (landing), about-us (static), business-banking (listing), contact-us (form)
  Path A' (template-applied)  1 page:  personal-banking (listing → archetype business-banking), rendered after the
                              listing archetype unit is live and gated on the published origin
  Path B  (unique)            0 pages
Skipped: 0 stale, 0 unscoped. Gated-archetype precondition: progress.json types.{form,listing,static,landing}
pass at 1440 and 360 (index/about-us by accept-residual with causes).
Units: plan → render `archetypes` (Path A, 4 pages) → render `listing` (personal-banking, inside C-deliver) → assets → report.
Output: stardust/migrated/ + _meta.json sidecars; idempotent skip on.
