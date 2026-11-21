/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * callout parser.
 * Source: p.offer-tag (offer category tag), a banner tagline (div.banner-para), or a
 * terms & conditions text box (div.general-text).
 * Block contract (blocks/callout/callout.js): free-form single cell — optional pictures,
 * then heading / text / links in authored order. The tagline option splits "A | B | C".
 */

const VARIANTS = {
  '/personal-banking/loans': 'tagline',
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
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'callout'));
  return v ? `${base} (${v})` : base;
}

const RICH = 'h1, h2, h3, h4, h5, h6, p, table, img, picture, ul, ol, a, blockquote';

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
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
    if (['P', 'UL', 'OL', 'TABLE', 'BLOCKQUOTE'].includes(tag) || /^H[1-6]$/.test(tag)) {
      if (!textOf(child) && !child.querySelector('img')) return;
      if (tag === 'P') {
        const p = document.createElement('p');
        // a "Safe | Simple | Fast" tagline keeps its separators as plain text
        p.innerHTML = child.innerHTML.trim();
        out.push(p);
      } else {
        out.push(child);
      }
      return;
    }
    if (['A', 'IMG', 'PICTURE', 'STRONG', 'B', 'EM', 'I', 'SPAN'].includes(tag)) {
      if (!textOf(child) && !child.querySelector('img') && tag !== 'IMG') return;
      const p = document.createElement('p');
      p.append(child);
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

export default function parse(element, { document, params }) {
  const content = [];
  if (element.tagName === 'P' || !element.querySelector(RICH)) {
    // a single tag / tagline element (inline markup such as the "|" separators is kept)
    const t = textOf(element);
    if (t) {
      const p = document.createElement('p');
      p.innerHTML = element.innerHTML.trim();
      content.push(p);
    }
  } else {
    flatten(document, element, content);
  }

  const cells = [[content.length ? content : '']];
  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('callout', document, params),
    cells,
  });
  element.replaceWith(block);
}
