/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';

function pageVariant(params) {
  try {
    const p = new URL(params && params.originalURL).pathname.replace(/\.html?$/i, '').replace(/\/+$/, '').toLowerCase();
    return catalogVariant(p, 'cards-highlights');
  } catch (e) { return null; }
}

/**
 * cards-highlights parser.
 * Source: div.icon-strip-wrap > div.mr20 ( .img-wrap-icon img + p > span.p16 label )
 * Block contract (blocks/cards-highlights/cards-highlights.js):
 *   optional heading row, then one row per highlight: [icon] [label text]
 */
export default function parse(element, { document, params }) {
  const textOf = (n) => (n.textContent || '').replace(/\s+/g, ' ').trim();
  const cells = [];

  const heading = [...element.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .find((h) => !h.closest('.mr20') && textOf(h));
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = textOf(heading);
    cells.push([h, '']);
  }

  let items = [...element.querySelectorAll(':scope > .mr20, .mr20')]
    .filter((n, i, all) => all.indexOf(n) === i && !n.parentElement.closest('.mr20'));
  if (!items.length) items = [...element.children].filter((c) => textOf(c) || c.querySelector('img'));

  items.forEach((item) => {
    const img = item.querySelector('img');
    let icon = '';
    if (img && (img.getAttribute('src') || img.getAttribute('data-src'))) {
      icon = document.createElement('img');
      icon.src = img.getAttribute('src') || img.getAttribute('data-src');
      if (img.getAttribute('alt')) icon.alt = img.getAttribute('alt');
    }
    const label = textOf(item);
    let text = '';
    if (label) {
      text = document.createElement('p');
      text.textContent = label;
    }
    if (!icon && !text) return;
    cells.push([icon, text]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: pageVariant(params) ? `cards-highlights (${pageVariant(params)})` : 'cards-highlights', cells });
  element.replaceWith(block);
}
