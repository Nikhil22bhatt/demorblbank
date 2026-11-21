/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * about-banner parser.
 * Source: section.common-section.banner-section (RBL inner-page / offer banners).
 * Block contract (blocks/about-banner/about-banner.js):
 *   row 1: picture cells — desktop image, optional mobile image
 *   row 2: text cell — heading + paragraphs + CTA links
 * Inner blocks (callout, offer-code, cards-highlights, video-inline) are parsed before
 * this one; their block tables are hoisted out and placed right after the banner so
 * they stay in the same section instead of being nested inside this block.
 */

// Option class per page, from the site catalog (pages not listed use the plain block).
const VARIANTS = {
  '/about-us/board-of-directors': 'alt',
  '/personal-banking/loans': 'alt',
  '/personal-banking/term-deposits/digital-fixed-deposit': 'alt',
  '/personal-banking/wealth-management/3-in-1-account': 'alt',
  '/personal-banking/wealth-management/e-asba': 'alt',
  '/personal-banking/wealth-management/invest-first': 'alt',
  '/personal-banking/wealth-management/mutual-fund': 'alt',
  '/personal-banking/wealth-management/national-pension-system': 'alt',
  '/personal-banking/wealth-management/sovereign-gold-bonds': 'alt',
  '/personal-banking/wealth-management/systematic-investment-plan': 'alt',
  '/offers-and-promotions/add-on-card': 'split-background-2',
  '/offers-and-promotions/bills2pay': 'split-background-2',
  '/offers-and-promotions/akbar-travels': 'split-background',
  '/offers-and-promotions/apply-spend-to-earn-amazon-vouchers-on-your-enterprise-debit-card': 'split-background',
  '/offers-and-promotions/attractive-offers-with-rbl-bank-credit-cards': 'split-background',
  '/offers-and-promotions/bosch': 'split-background',
  '/offers-and-promotions/caratlane': 'split-background',
  '/offers-and-promotions/croma': 'split-background',
  '/offers-and-promotions/dial-for-cash': 'split-background',
  '/offers-and-promotions/district': 'split-background',
  '/offers-and-promotions/eazydiner': 'split-background',
  '/offers-and-promotions/exclusive-festive-offer-existing-visa-enterprise-debit-cardholders-amazon-shopping-vouchers': 'split-background',
  '/offers-and-promotions/godrej-interio': 'split-background',
  '/offers-and-promotions/haier': 'split-background',
  '/offers-and-promotions/hp': 'split-background',
  '/offers-and-promotions/ifb': 'split-background',
  '/offers-and-promotions/lenovo': 'split-background',
  '/offers-and-promotions/lg': 'split-background',
  '/offers-and-promotions/merchant-emi-options-at-our-participating-merchant-outlets': 'split-background',
  '/offers-and-promotions/ospree': 'split-background',
  '/offers-and-promotions/pepperfry': 'split-background',
  '/offers-and-promotions/samsung': 'split-background',
  '/offers-and-promotions/split-n-pay': 'split-background',
  '/offers-and-promotions/split-n-pay-plus': 'split-background',
  '/offers-and-promotions/stay-healthy-stay-protected': 'split-background',
  '/offers-and-promotions/vijay-sales': 'split-background',
  '/offers-and-promotions/wakefit': 'split-background',
  '/offers-and-promotions/whirlpool': 'split-background',
  '/offers-and-promotions/xpress-cash': 'split-background',
  '/personal-banking/cards/credit-cards/lumiere-credit-card': 'full-bleed',
  '/personal-banking/term-deposits': 'alt',
  '/personal-banking/wealth-management/alternate-investment-products': 'light-3',
  '/preferred-banking/insignia-banking/business': 'dark',
  '/preferred-banking/insignia-banking/nri-banking/nri-money-transfer': 'dark',
  '/preferred-banking/insignia/individual/investment-services_old': 'dark',
};

function pagePath(document, params) {
  const candidates = [params && params.originalURL];
  try { candidates.push(document.location && document.location.href); } catch (e) { /* ignore */ }
  for (const c of candidates) {
    if (c && typeof c === 'string' && !/^about:/i.test(c)) {
      try {
        return new URL(c).pathname.replace(/\.html?$/i, '').replace(/\/+$/, '').toLowerCase();
      } catch (e) { /* ignore */ }
    }
  }
  return '';
}

function blockName(base, document, params) {
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'about-banner'));
  return v ? `${base} (${v})` : base;
}

const RICH = 'h1, h2, h3, h4, h5, h6, p, table, img, picture, ul, ol, a, video, iframe, blockquote';

function bgUrl(node) {
  if (!node) return '';
  const style = node.getAttribute('style') || '';
  const m = style.match(/background-image\s*:\s*url\(\s*(['"]?)(.*?)\1\s*\)/i);
  return m && m[2] ? m[2].replace(/&quot;/g, '') : '';
}

function makeImg(document, src, alt) {
  const img = document.createElement('img');
  img.src = src;
  if (alt) img.alt = alt;
  return img;
}

/** desktop/mobile image from an image slot: an <img> inside it, or its inline background-image */
function slotImage(document, slot) {
  if (!slot) return null;
  if (slot.tagName === 'IMG') return slot;
  const img = slot.querySelector('img');
  if (img && (img.getAttribute('src') || img.getAttribute('data-src'))) {
    return makeImg(document, img.getAttribute('src') || img.getAttribute('data-src'), img.getAttribute('alt') || '');
  }
  const bg = bgUrl(slot);
  return bg ? makeImg(document, bg, '') : null;
}

function isBlockTable(node) {
  return node && node.tagName === 'TABLE';
}

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

/**
 * Flatten source markup into authorable nodes (headings, paragraphs, lists, links, images).
 * Already-parsed inner block tables are collected into `hoisted` instead.
 */
function collect(document, node, out, hoisted, seenHrefs) {
  [...node.childNodes].forEach((child) => {
    if (child.nodeType === 3) {
      const t = child.textContent.replace(/\s+/g, ' ').trim();
      if (t) {
        const p = document.createElement('p');
        p.textContent = t;
        out.push(p);
      }
      return;
    }
    if (child.nodeType !== 1) return;
    const tag = child.tagName;
    if (isBlockTable(child)) {
      hoisted.push(child);
      return;
    }
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'VIDEO', 'SOURCE', 'IFRAME', 'BUTTON'].includes(tag)) return;
    if (/^H[1-6]$/.test(tag)) {
      const t = textOf(child);
      if (!t) return;
      const h = document.createElement(tag.toLowerCase());
      h.textContent = t;
      out.push(h);
      return;
    }
    if (tag === 'UL' || tag === 'OL') {
      if (textOf(child)) out.push(child);
      return;
    }
    if (tag === 'IMG') {
      const src = child.getAttribute('src') || child.getAttribute('data-src');
      if (!src) return;
      const p = document.createElement('p');
      p.append(makeImg(document, src, child.getAttribute('alt') || ''));
      out.push(p);
      return;
    }
    if (tag === 'A') {
      const href = child.getAttribute('href');
      if (href && seenHrefs.has(href) && child.matches('.d-md-none, .d-block.d-md-none')) return;
      if (href) seenHrefs.add(href);
      if (!textOf(child) && !child.querySelector('img')) return;
      const p = document.createElement('p');
      p.append(child);
      out.push(p);
      return;
    }
    if (tag === 'P') {
      if (child.querySelector('table')) {
        collect(document, child, out, hoisted, seenHrefs);
        return;
      }
      const links = [...child.querySelectorAll('a[href]')];
      // responsive duplicate (mobile-only copy of a link already taken)
      if (links.length && links.every((a) => seenHrefs.has(a.getAttribute('href')))
        && child.querySelector('.d-md-none')) return;
      links.forEach((a) => seenHrefs.add(a.getAttribute('href')));
      if (textOf(child) || child.querySelector('img')) {
        const p = document.createElement('p');
        p.innerHTML = child.innerHTML;
        out.push(p);
      }
      return;
    }
    // generic container
    if (!child.querySelector(RICH)) {
      const t = textOf(child);
      if (t) {
        const p = document.createElement('p');
        p.textContent = t;
        out.push(p);
      }
      return;
    }
    collect(document, child, out, hoisted, seenHrefs);
  });
}

export default function parse(element, { document, params }) {
  const hoisted = [];

  // ---- media: desktop + mobile banner images (video backgrounds fall back to the poster image)
  const desktopSlot = element.querySelector('.banner-img-desktop');
  const mobileSlot = element.querySelector('.banner-img-mobile');
  const pics = [];
  const desktop = desktopSlot && desktopSlot.tagName !== 'VIDEO' ? slotImage(document, desktopSlot) : null;
  const mobile = slotImage(document, mobileSlot);
  if (desktop) pics.push(desktop);
  if (mobile && (!desktop || desktop.getAttribute('src') !== mobile.getAttribute('src'))) pics.push(mobile);
  if (!pics.length) {
    const any = [...element.querySelectorAll('img')].find((img) => !img.closest('table'));
    if (any) pics.push(makeImg(document, any.getAttribute('src'), any.getAttribute('alt') || ''));
  }

  // ---- text: banner info panel, or (full-bleed layout) everything outside the image slots
  const content = [];
  const seenHrefs = new Set();
  const info = element.querySelector('.banner-info-inner') || element.querySelector('.banner-info');
  if (info) {
    collect(document, info, content, hoisted, seenHrefs);
    // inner blocks sitting outside the info panel (e.g. a video-inline in the media area)
    [...element.querySelectorAll('table')].forEach((t) => {
      if (!info.contains(t) && !hoisted.includes(t) && !t.parentElement.closest('table')) hoisted.push(t);
    });
  } else {
    [desktopSlot, mobileSlot].forEach((slot) => { if (slot) slot.remove(); });
    // the first image used as the banner background must not be duplicated in the text
    collect(document, element, content, hoisted, seenHrefs);
  }

  const cells = [];
  const width = Math.max(1, pics.length);
  if (pics.length) cells.push(pics.map((p) => [p]));
  if (content.length) {
    const row = [content];
    while (row.length < width) row.push('');
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('about-banner', document, params),
    cells,
  });
  if (!hoisted.length) {
    element.replaceWith(block);
    return;
  }
  // inner blocks keep their document order right after the banner, in the same section
  // (the wrapper div is transparent in the converted document)
  const wrapper = document.createElement('div');
  wrapper.append(block, ...hoisted);
  element.replaceWith(wrapper);
}
