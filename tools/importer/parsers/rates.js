/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * rates parser.
 * Sources:
 *   - div.feature-card2-upd: "Earn up to" rate cards (.earn-up-card: h5 value, p label,
 *     View Rates link) + T&C note + illustration
 *   - #data-section-whyChoose: image + heading/text panel with brand logos (blue)
 * Block contract (blocks/rates/rates.js):
 *   single-cell rows = heading/intro content; rate rows = [label] [value heading] [link]
 */

const VARIANTS = {
  '/personal-banking/cards/credit-cards/nova-credit-card': 'blue',
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
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'rates'));
  return v ? `${base} (${v})` : base;
}

const RICH = 'h1, h2, h3, h4, h5, h6, p, table, img, picture, ul, ol, a, blockquote';

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

function makeImg(document, img) {
  const src = img.getAttribute('src') || img.getAttribute('data-src');
  if (!src) return null;
  const out = document.createElement('img');
  out.src = src;
  if (img.getAttribute('alt')) out.alt = img.getAttribute('alt');
  return out;
}

/** "6.00<small><span class=per-star>*</span> <span class=per>%</span> p.a.</small>" -> 6.00<sup>*</sup>% p.a. */
function valueHeading(document, h) {
  const out = document.createElement(/^H[1-6]$/.test(h.tagName) ? h.tagName.toLowerCase() : 'h3');
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        if (n.textContent.trim()) out.append(document.createTextNode(n.textContent.replace(/\s+/g, ' ')));
      } else if (n.nodeType === 1) {
        if (n.matches('.per-star, sup')) {
          const sup = document.createElement('sup');
          sup.textContent = textOf(n);
          out.append(sup);
        } else if (n.tagName === 'SUB') {
          const sub = document.createElement('sub');
          sub.textContent = textOf(n);
          out.append(sub);
        } else {
          walk(n);
        }
      }
    });
  };
  walk(h);
  return out;
}

function flatten(document, node, out) {
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
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'BUTTON'].includes(tag)) return;
    if (/^H[1-6]$/.test(tag)) {
      if (!textOf(child)) return;
      const h = document.createElement(tag.toLowerCase());
      h.textContent = textOf(child);
      out.push(h);
      return;
    }
    if (['P', 'UL', 'OL', 'TABLE', 'BLOCKQUOTE'].includes(tag)) {
      if (textOf(child) || child.querySelector('img')) out.push(child);
      return;
    }
    if (tag === 'IMG') {
      const img = makeImg(document, child);
      if (!img) return;
      const p = document.createElement('p');
      p.append(img);
      out.push(p);
      return;
    }
    if (tag === 'A') {
      if (!textOf(child)) return;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = child.getAttribute('href') || '';
      a.textContent = textOf(child);
      p.append(a);
      out.push(p);
      return;
    }
    if (!child.querySelector(RICH)) {
      if (!textOf(child)) return;
      const p = document.createElement('p');
      p.textContent = textOf(child);
      out.push(p);
      return;
    }
    flatten(document, child, out);
  });
}

export default function parse(element, { document, params }) {
  const cells = [];
  const rateCards = [...element.querySelectorAll('.earn-up-card')];

  if (rateCards.length) {
    // intro ("Earn up to") before the cards
    const wrap = element.querySelector('.earn-up-wrap') || element;
    const intro = [...wrap.querySelectorAll(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4')]
      .filter((n) => textOf(n));
    if (intro.length) {
      cells.push([intro.map((n) => {
        const c = document.createElement(n.tagName.toLowerCase());
        c.textContent = textOf(n);
        return c;
      })]);
    }

    let width = 2;
    const rateRows = rateCards.map((card) => {
      const valueEl = card.querySelector('h1, h2, h3, h4, h5, h6, .earn-per');
      const labelEl = [...card.querySelectorAll('p')].find((p) => textOf(p) && !p.querySelector('a'));
      const link = card.querySelector('a[href]');
      const label = document.createElement('p');
      label.textContent = labelEl ? textOf(labelEl) : '';
      const row = [label, valueEl ? valueHeading(document, valueEl) : ''];
      if (link && textOf(link)) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = textOf(link);
        p.append(a);
        row.push(p);
      }
      width = Math.max(width, row.length);
      return row;
    });
    rateRows.forEach((row) => {
      while (row.length < width) row.push('');
      cells.push(row);
    });

    // notes and illustration outside the rate cards
    const notes = [...element.querySelectorAll('.term-text-lg, .term-text')].filter((n) => textOf(n));
    notes.forEach((n) => {
      const p = document.createElement('p');
      p.textContent = textOf(n);
      cells.push([p]);
    });
    [...element.querySelectorAll('img')]
      .filter((img) => !img.closest('.earn-up-card') && !img.closest('a'))
      .forEach((img) => {
        const pic = makeImg(document, img);
        if (pic) cells.push([pic]);
      });
  } else {
    // image + text panel: image row, then the text content
    const imgCol = [...element.querySelectorAll('img')].find((img) => !img.closest('ul, ol, li'));
    const textCol = element.querySelector('.right-wrap, .nova-right-para');
    if (imgCol && (!textCol || !textCol.contains(imgCol))) {
      const pic = makeImg(document, imgCol);
      if (pic) cells.push([pic]);
    }
    const content = [];
    if (textCol) {
      flatten(document, textCol, content);
    } else {
      const clone = element.cloneNode(true);
      if (imgCol) {
        const twin = [...clone.querySelectorAll('img')].find((i) => i.getAttribute('src') === imgCol.getAttribute('src'));
        if (twin) twin.remove();
      }
      flatten(document, clone, content);
    }
    if (content.length) cells.push([content]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('rates', document, params),
    cells,
  });
  element.replaceWith(block);
}
