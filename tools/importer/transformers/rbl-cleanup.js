/* eslint-disable */
/* global WebImporter */

/**
 * RBL Bank cleanup transformer.
 *
 * beforeTransform:
 *   1. Replays payload.template.pageCleanup for the current page (matched by URL
 *      the same way as pageInstances). Each selector is applied in order and
 *      removes its element only when it matches exactly one element.
 *   2. Removes late-loading overlays matching catalog cleanup.rules[] outside
 *      <main>, applying only the rules this page is NOT already listed under in
 *      migration-work/catalog-template.json cleanup.pages.
 *   Site chrome is intentionally left in place here (catalog selectors were
 *   captured with chrome present, and nth-child paths depend on it).
 *
 * afterTransform:
 *   Removes site chrome (header, footer, accessibility top bar, chat widget,
 *   sticky mobile bars, empty highlighted region), non-content elements and
 *   tracking/behaviour attributes. HTML comments are never removed.
 */

const ORIGIN_RE = /^https?:\/\/[^/]+/i;

// migration-work/catalog-template.json cleanup.rules[] (index order matters)
const CATALOG_RULES = [
  'body [class*="modal"]:not(nav *)',
  'body [class*="popup"]:not(nav *)',
  '[class*="chatbot"]',
];

// Rule indexes each catalog page is already listed under (cleanup.pages).
// Pages not in this map but present in the catalog default to [0].
// Pages absent from the catalog entirely are listed under no rule.
const DEFAULT_LISTED = [0];
const LISTED_RULES = {
  '/personal-banking/accounts/savings-accounts/woman-first-savings-account': [0, 1, 2],
  '/personal-banking/cards/credit-cards/lumiere-credit-card': [0],
  '/personal-banking/loans': [0, 1],
  '/personal-banking/term-deposits/digital-fixed-deposit': [0, 1],
  '/personal-banking/wealth-management/3-in-1-account': [0, 1, 2],
  '/personal-banking/wealth-management/alternate-investment-products': [0, 1, 2],
  '/personal-banking/wealth-management/e-asba': [0, 1, 2],
  '/personal-banking/wealth-management/invest-first': [0, 1, 2],
  '/personal-banking/wealth-management/mutual-fund': [0, 1, 2],
  '/personal-banking/wealth-management/national-pension-system': [0, 1],
  '/personal-banking/wealth-management/sovereign-gold-bonds': [0, 1, 2],
  '/personal-banking/wealth-management/systematic-investment-plan': [0, 1, 2],
  '/preferred-banking/insignia-banking/business': [0, 1, 2],
  '/preferred-banking/insignia-banking/nri-banking/nri-accounts': [0, 1, 2],
  '/preferred-banking/insignia-banking/nri-banking/nri-deposits': [0, 1, 2],
  '/preferred-banking/insignia-banking/nri-banking/nri-money-transfer': [0, 1, 2],
  '/preferred-banking/insignia/individual/investment-services_old': [0, 1],
};

function normalizePath(url) {
  if (!url || typeof url !== 'string') return '';
  let p = url.trim().replace(ORIGIN_RE, '');
  p = p.split('#')[0].split('?')[0];
  p = p.replace(/\.html?$/i, '').replace(/\/index$/i, '');
  p = p.replace(/\/+$/, '');
  return (p || '/').toLowerCase();
}

function pageUrl(document, payload) {
  const params = (payload && payload.params) || {};
  const candidates = [
    params.originalURL,
    payload && payload.originalURL,
    payload && payload.url,
  ];
  try { candidates.push(document.location && document.location.href); } catch (e) { /* ignore */ }
  try { candidates.push(document.URL); } catch (e) { /* ignore */ }
  for (const c of candidates) {
    if (c && typeof c === 'string' && !/^about:/i.test(c)) {
      // Local proxy URLs (localhost) still carry the source path.
      return c;
    }
  }
  return '';
}

/** Find the value in a URL-keyed object for the current page. */
function lookupByUrl(map, url) {
  if (!map || typeof map !== 'object') return undefined;
  if (url && map[url]) return map[url];
  const path = normalizePath(url);
  if (!path) return undefined;
  const key = Object.keys(map).find((k) => normalizePath(k) === path);
  return key ? map[key] : undefined;
}

function safeQueryAll(root, selector) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    return [];
  }
}

function remove(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

/** Elements that must survive catalog-rule removal: main and parser targets. */
function protectedRoots(document, template) {
  const roots = [...document.querySelectorAll('main')];
  const blocks = (template && template.blocks) || [];
  blocks.forEach((b) => {
    (b.instances || []).forEach((sel) => {
      safeQueryAll(document, sel).forEach((el) => roots.push(el));
    });
  });
  return roots;
}

function isProtected(el, roots) {
  return roots.some((r) => r === el || r.contains(el) || el.contains(r));
}

function replayPageCleanup(document, template, url) {
  const selectors = lookupByUrl(template && template.pageCleanup, url);
  if (!Array.isArray(selectors)) return;
  selectors.forEach((sel) => {
    const matches = safeQueryAll(document, sel);
    if (matches.length === 1) remove(matches[0]);
  });
}

function applyCatalogRules(document, template, url) {
  const path = normalizePath(url);
  let listed = [];
  if (path && Object.prototype.hasOwnProperty.call(LISTED_RULES, path)) {
    listed = LISTED_RULES[path];
  } else if (path && template && Array.isArray(template.urls)
    && template.urls.some((u) => normalizePath(u) === path)) {
    listed = DEFAULT_LISTED;
  }
  const roots = protectedRoots(document, template);
  CATALOG_RULES.forEach((rule, i) => {
    if (listed.includes(i)) return;
    safeQueryAll(document, rule).forEach((el) => {
      if (!el.isConnected && !document.contains(el)) return;
      if (el === document.body || el === document.documentElement) return;
      if (isProtected(el, roots)) return;
      remove(el);
    });
  });
}

// Site chrome and non-authorable elements, removed after parsing.
const CHROME_SELECTORS = [
  'div.common-header-wrap',
  'header.accessibility-top-bar',
  'body > aside',
  'aside[aria-label="Chat support"]',
  'header#header',
  'div.featured-bottom',
  'footer.site-footer',
  'div.common-footer-wrapper',
  'div.footer-sticky',
  'button.go-to-top-wrap',
  'a.skip-link',
  '#cookieNotice',
  // All-in-One Accessibility widget (skynettechnologies), injected at runtime: skip links,
  // preferences modal and tooltip.
  'div.aioa-widget-wrapper',
  '[id^="aioa_"]',
  '#accessibility_skiplinks',
  '#accessibility_tooltip',
  // Site-wide modals appended to body (notifications, external-link warning, search).
  '#mobile-noti-modal',
  '#attention-link-modal',
  '#g-search-modal',
  'div[data-drupal-messages-fallback]',
  'a#main-content',
  'iframe#_hjSafeContext_45814688',
  'iframe[id^="_hjSafeContext"]',
  'div[id^="batBeacon"]',
  'script',
  'style',
  'noscript',
  'link',
  'meta',
];

const TRACKING_ATTRS = [
  'data-aos',
  'data-aos-anchor',
  'data-aos-delay',
  'data-aos-duration',
  'data-once',
  'data-history-node-id',
  'data-drupal-selector',
  'data-off-canvas-main-canvas',
  'data-slick-index',
  'onclick',
  'onload',
];

function isEmpty(el) {
  return !el.textContent.trim() && !el.querySelector('img, picture, video, iframe, table, hr');
}

export default function transform(hookName, element, payload) {
  const document = (payload && payload.document) || element.ownerDocument || element;
  const template = (payload && payload.template) || {};

  if (hookName === 'beforeTransform') {
    const url = pageUrl(document, payload);
    replayPageCleanup(document, template, url);
    applyCatalogRules(document, template, url);
  }

  if (hookName === 'afterTransform') {
    const root = element || document.body;

    CHROME_SELECTORS.forEach((sel) => {
      safeQueryAll(root, sel).forEach(remove);
    });

    // Empty highlighted region (#page > div.highlighted) and its empty aside.
    safeQueryAll(root, '#page > div.highlighted, div.highlighted').forEach((el) => {
      if (isEmpty(el)) remove(el);
    });
    // Offer banners carry the same image twice (desktop + mobile); keep one.
    safeQueryAll(root, '.banner-img-mobile').forEach((mob) => {
      const src = mob.querySelector('img')?.getAttribute('src');
      const desk = mob.parentElement && mob.parentElement.querySelector('.banner-img-desktop img');
      if (src && desk && desk.getAttribute('src') === src) remove(mob);
    });
    // Empty article header left by Drupal.
    safeQueryAll(root, 'article > header').forEach((el) => {
      if (isEmpty(el)) remove(el);
    });

    TRACKING_ATTRS.forEach((attr) => {
      safeQueryAll(root, `[${attr}]`).forEach((el) => el.removeAttribute(attr));
    });
  }
}
