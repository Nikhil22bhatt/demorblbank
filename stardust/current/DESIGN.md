---
name: RBL Bank (current state)
colors:
  primary: "#304087"
  primary-hover: "#1a307c"
  accent-yellow: "#fed525"
  accent-red: "#ed3338"
  secondary-green: "#00a972"
  text: "#303030"
  text-strong: "#212121"
  text-muted: "#606060"
  border: "#dbdcde"
  surface: "#ffffff"
  surface-tint: "#f3f4f6"
  footer: "#303030"
typography:
  heading: { fontFamily: "Roboto", fontWeight: 700 }
  body: { fontFamily: "Roboto", fontSize: "16px", fontWeight: 400, lineHeight: 1.5 }
  h1: { fontSize: "48px", fontWeight: 400 }
  h2: { fontSize: "40px", fontWeight: 700 }
  section-title: { fontSize: "36px", fontWeight: 700 }
rounded:
  sm: "4px"
  lg: "10px"
  pill: "50px"
spacing:
  unit: "4px"
components:
  button-primary: { background: "#304087", color: "#ffffff", radius: "4px" }
  button-login: { background: "#fed525", color: "#303030", radius: "4px" }
---
<!-- stardust:provenance writtenBy=stardust:extract mode=descriptive evidence=stardust/current/_computed-styles.json -->

# RBL Bank — current design system (descriptive)

## Overview
A Bootstrap-based corporate bank site set entirely in **Roboto** (Google Fonts, 300–900). Navy `#304087` is the brand action colour (buttons, links, headings accents); a mauve-to-indigo gradient header bar carries white navigation and a yellow `#fed525` LOGIN button. Pages alternate white and pale tinted bands (`#f3f4f6`, lavender/peach gradients) with white cards on soft shadows.

## Colors
- Navy `#304087` — primary buttons, active tabs, carousel arrows (hover `#1a307c`).
- Yellow `#fed525` — the LOGIN button.
- Red `#ed3338` — rate highlights and badges.
- Charcoal `#303030` — body text and the footer background.
- Tints `#f3f4f6`, `#e4e9ff` — section bands and card fills.

## Typography
Roboto everywhere; ad-hoc scale 48/40/36/34/28/24/22/20/18/16/15/14/13 px. Section titles 36 px bold, body 16–18 px regular, buttons 16 px bold.

## Elevation
Card shadows `rgba(0,0,0,.15) 0 2px 4px`; radius mode 4 px for controls, 10 px for cards, 50 % for icon buttons.

## Components
Header (utility strip + gradient nav), breadcrumb, image hero banners, product card grid with "Know More" buttons, MyBank App band, blog and video carousels, dark five-column footer, fixed "RBL Cares" chat launcher.
