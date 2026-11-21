/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * accordion-list parser.
 * Source: div.faq-rbl-inner (Bootstrap FAQ cards: .card > .card-header button + .collapse .card-body).
 * Block contract (blocks/accordion-list/accordion-list.js):
 *   optional heading row: [heading]
 *   item rows: [question] [answer] — answer may hold paragraphs, lists, tables, links
 * Items are keyed on the FAQ card (.card), which is the stable inner unit across the
 * drupal field__item wrapper and the plain CKEditor markup.
 */

const VARIANTS = {
  '/offers-and-promotions/add-on-card': 'light',
  '/personal-banking/wealth-management/mutual-fund': 'light',
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
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'accordion-list'));
  return v ? `${base} (${v})` : base;
}

const RICH = 'h1, h2, h3, h4, h5, h6, p, table, img, picture, ul, ol, a, blockquote';

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

/** Flatten an answer body into paragraphs / lists / tables / headings, keeping inline markup. */
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
      if (textOf(child) || child.querySelector('img')) out.push(child);
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
  const cells = [];

  // optional block title: a heading outside the FAQ cards
  const title = [...element.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .find((h) => !h.closest('.card') && textOf(h));
  if (title) {
    const h = document.createElement(title.tagName.toLowerCase());
    h.textContent = textOf(title);
    cells.push([h]);
  }

  // top-level FAQ cards only (a card nested inside an answer stays in that answer)
  const cards = [...element.querySelectorAll('.card')]
    .filter((card) => !card.parentElement.closest('.card') || !element.contains(card.parentElement.closest('.card')));

  // A faq wrapper that holds plain text (e.g. "Eligibility Criteria" copy and lists) and no
  // FAQ cards is not an accordion: leave it in place as default content so nothing is lost.
  if (!cards.some((card) => card.querySelector('.card-header, button'))) return;

  cards.forEach((card) => {
    const header = card.querySelector('.card-header');
    const qNode = (header && (header.querySelector('button span') || header.querySelector('button') || header))
      || card.querySelector('button');
    const question = qNode ? textOf(qNode) : '';
    if (!question) return;
    const bodyRoot = card.querySelector('.collapse .card-body') || card.querySelector('.card-body')
      || card.querySelector('.collapse');
    const answer = [];
    if (bodyRoot) flatten(document, bodyRoot, answer);
    const q = document.createElement('p');
    q.textContent = question;
    cells.push([[q], answer.length ? answer : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('accordion-list', document, params),
    cells,
  });
  element.replaceWith(block);
}
