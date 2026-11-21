/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * cards-document-links parser.
 * Sources:
 *   - quick-link sliders: a > .quick-link-card ( .quick-link-img img + .p16 title )
 *   - text + image panels (#data-section-rm-premium-banker): heading/paragraphs + image
 * Block contract (blocks/cards-document-links/cards-document-links.js):
 *   one row per card: [icon/image] [linked title, optional heading + description]
 */

const VARIANTS = {
  '/personal-banking/cards/credit-cards/nova-credit-card': 'light',
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
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'cards-document-links'));
  return v ? `${base} (${v})` : base;
}

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

function makeImg(document, img) {
  const src = img.getAttribute('src') || img.getAttribute('data-src');
  if (!src) return null;
  const out = document.createElement('img');
  out.src = src;
  const alt = img.getAttribute('alt');
  if (alt) out.alt = alt;
  return out;
}

export default function parse(element, { document, params }) {
  const cells = [];

  const cards = [...element.querySelectorAll('.quick-link-card')]
    .filter((card) => !card.closest('.slick-cloned'));

  if (cards.length) {
    cards.forEach((card) => {
      const a = card.closest('a[href]') || card.querySelector('a[href]');
      const img = card.querySelector('img');
      const titleNode = card.querySelector('.p16') || card;
      const title = textOf(titleNode) || (a && (a.getAttribute('aria-label') || '').trim());
      const icon = img ? makeImg(document, img) : null;
      const body = [];
      if (title) {
        const p = document.createElement('p');
        if (a) {
          const link = document.createElement('a');
          link.href = a.getAttribute('href');
          link.textContent = title;
          p.append(link);
        } else {
          p.textContent = title;
        }
        body.push(p);
      }
      if (!icon && !body.length) return;
      cells.push([icon ? [icon] : '', body.length ? body : '']);
    });
  } else {
    // text + image panel(s): one card per panel
    const textCol = element.querySelector('.left-wrap, .nova-right-para') || element;
    const body = [];
    [...textCol.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
      .filter((n) => !n.parentElement.closest('p, ul, ol'))
      .forEach((n) => {
        if (!textOf(n) && !n.querySelector('img')) return;
        if (n.tagName === 'P' && n.querySelector('img') && !textOf(n)) return;
        body.push(n);
      });
    const imgs = [...element.querySelectorAll('img')].filter((img) => !textCol.contains(img) || textCol === element);
    const icon = imgs.length ? makeImg(document, imgs[0]) : null;
    if (icon || body.length) cells.push([icon ? [icon] : '', body.length ? body : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('cards-document-links', document, params),
    cells,
  });
  element.replaceWith(block);
}
