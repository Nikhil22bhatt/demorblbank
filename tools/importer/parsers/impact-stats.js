/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * impact-stats parser.
 * Sources (catalog detections):
 *   - div.block-content-basic[id^="block-importantlinks"]: "Important Links" list
 *   - #data-section-whyChoose / .careerLP: image + heading + text panel
 *   - .fd-comm-containers: text cards with heading, steps, CTA and feature list (light)
 * Block contract (blocks/impact-stats/impact-stats.js):
 *   stat rows [icon picture] [figure heading + label]; a text-only row is a note, or (light)
 *   a text card when it holds a heading or link.
 */

const VARIANTS = {
  '/personal-banking/cards/credit-cards/lumiere-credit-card': 'dark',
  '/personal-banking/term-deposits/digital-fixed-deposit': 'light',
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
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'impact-stats'));
  return v ? `${base} (${v})` : base;
}

const RICH = 'h1, h2, h3, h4, h5, h6, p, table, img, picture, ul, ol, a, blockquote';

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

/** Flatten into text nodes; images are skipped (collected separately as the stat icon). */
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
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'BUTTON', 'IMG', 'PICTURE'].includes(tag)) return;
    if (/^H[1-6]$/.test(tag) || ['P', 'UL', 'OL', 'TABLE', 'BLOCKQUOTE'].includes(tag)) {
      if (textOf(child)) out.push(child);
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
      p.innerHTML = child.innerHTML.trim();
      out.push(p);
      return;
    }
    flatten(document, child, out);
  });
}

function makeImg(document, img) {
  const src = img.getAttribute('src') || img.getAttribute('data-src');
  if (!src) return null;
  const out = document.createElement('img');
  out.src = src;
  if (img.getAttribute('alt')) out.alt = img.getAttribute('alt');
  return out;
}

export default function parse(element, { document, params }) {
  const cells = [];

  const cards = [...element.querySelectorAll('.fd-comm')]
    .filter((c) => !c.parentElement.closest('.fd-comm'));

  if (cards.length) {
    // text cards: one row per card
    cards.forEach((card) => {
      const img = card.querySelector('img');
      const text = [];
      flatten(document, card, text);
      if (!text.length && !img) return;
      if (img) cells.push([[makeImg(document, img)], text]);
      else cells.push([text]);
    });
  } else {
    // a single stat / note: optional picture + text content
    const img = element.querySelector('img');
    const text = [];
    flatten(document, element, text);
    const pic = img ? makeImg(document, img) : null;
    if (pic && text.length) cells.push([[pic], text]);
    else if (pic) cells.push([[pic]]);
    else if (text.length) cells.push([text]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('impact-stats', document, params),
    cells,
  });
  element.replaceWith(block);
}
