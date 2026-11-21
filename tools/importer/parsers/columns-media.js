/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * columns-media parser.
 * Source: div.mybank > div.row and catalog variants (yourteamDiv text + yourteamDivimg carousel,
 * twocolumn_new image + description, tab panels holding several text/media rows).
 * Block contract (blocks/columns-media/columns-media.js):
 *   each row = [text cell] [media cell] in source column order; single-cell rows span full width.
 * Every bootstrap .row with two or more columns becomes one block row; content between such
 * rows (e.g. a section heading) becomes a full-width row in document order.
 */

const VARIANTS = {
  '/personal-banking/cards/credit-cards/lumiere-credit-card': 'boxed-2',
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
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'columns-media'));
  return v ? `${base} (${v})` : base;
}

const RICH = 'h1, h2, h3, h4, h5, h6, p, table, img, picture, ul, ol, a, blockquote, iframe, video';
// decorative artwork (corner arcs / stars) shown only on desktop
const DECORATIVE = '.forthsection_star, .star-image, [class*="star-image"]';

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
    if (child.matches(DECORATIVE)) return;
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
    if (tag === 'IFRAME' || tag === 'VIDEO') {
      const src = child.getAttribute('src') || (child.querySelector('source') || { getAttribute: () => '' }).getAttribute('src');
      if (!src) return;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = src;
      a.textContent = src;
      p.append(a);
      out.push(p);
      return;
    }
    if (tag === 'A') {
      const img = child.querySelector('img');
      if (!textOf(child) && !img) return;
      const p = document.createElement('p');
      const a = document.createElement('a');
      if (child.getAttribute('href')) a.href = child.getAttribute('href');
      if (textOf(child)) a.textContent = textOf(child);
      else a.append(makeImg(document, img));
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

function isColumn(n) {
  return /(^|\s)col(-[a-z]+)?(-\d+)?(\s|$)/.test(n.className || '') || n.matches('.yourteamDiv, .yourteamDivimg');
}

function hasContent(n) {
  return !!(textOf(n) || n.querySelector('img, iframe, video'));
}

/** a row container: two or more direct column children with content */
function isRow(n) {
  const cols = [...n.children].filter((c) => isColumn(c) && hasContent(c) && !c.matches(DECORATIVE));
  return cols.length >= 2;
}

export default function parse(element, { document, params }) {
  const cells = [];
  let pending = [];
  let maxCols = 1;

  const flush = () => {
    if (pending.length) cells.push([pending]);
    pending = [];
  };

  const pushRow = (rowEl) => {
    flush();
    const row = [];
    [...rowEl.children].forEach((col) => {
      if (col.matches(DECORATIVE) || !hasContent(col)) return;
      const content = [];
      flatten(document, col, content);
      if (content.length) row.push(content);
    });
    if (row.length) {
      maxCols = Math.max(maxCols, row.length);
      cells.push(row);
    }
  };

  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(DECORATIVE)) return;
      if (isRow(child)) {
        pushRow(child);
      } else if ([...child.querySelectorAll('*')].some((d) => isRow(d))) {
        walk(child);
      } else {
        flatten(document, child, pending);
      }
    });
  };

  if (isRow(element)) pushRow(element);
  else walk(element);
  flush();

  // pad short rows so the table stays rectangular (single-cell rows stay full width)
  cells.forEach((row) => {
    if (row.length > 1) while (row.length < maxCols) row.push('');
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('columns-media', document, params),
    cells,
  });
  element.replaceWith(block);
}
