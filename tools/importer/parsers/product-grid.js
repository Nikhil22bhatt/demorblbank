/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';

/**
 * product-grid parser.
 * Source: div.biz-seg > .seg-cat > .row > div.col-* (one per card)
 *   .offer-card-wrap-bg (background-image photo) + .offer-title a (label) + p (copy)
 *   + p > a.next-arrow-btn (arrow image link).
 * Block contract (blocks/product-grid/product-grid.js):
 *   optional intro row (paragraphs only), card rows [picture] [heading + copy + CTA paragraph].
 *   The image-blue option renders the photo full-card, the heading as a pill and the CTA
 *   as a round arrow button (link text hidden).
 * The intro copy (.stand-alone-section1) sits outside the matched element and stays default
 * content.
 */

function textOf(node) {
  return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
}

function bgUrl(node) {
  if (!node) return '';
  const style = node.getAttribute('style') || '';
  const m = style.match(/background-image\s*:\s*url\((['"]?)(.*?)\1\)/i)
    || style.match(/url\((?:&quot;|['"])?(.*?)(?:&quot;|['"])?\)/i);
  if (!m) return node.getAttribute('data-src') || node.getAttribute('data-bg') || '';
  return (m[2] !== undefined ? m[2] : m[1]).replace(/&quot;/g, '').trim();
}

export default function parse(element, { document, params }) {
  const cells = [];
  let imageBlue = false;

  const cards = [...element.querySelectorAll('.offer-card-wrap')];
  cards.forEach((card) => {
    const col = card.parentElement;
    const titleLink = card.querySelector('.offer-title a[href]');
    const titleText = textOf(card.querySelector('.offer-title'));
    const arrow = col ? col.querySelector(':scope > p a[href], a.next-arrow-btn[href]') : null;
    const href = (titleLink && titleLink.getAttribute('href'))
      || (arrow && arrow.getAttribute('href')) || '';

    // media cell: background photo (or an inline image when the card has one)
    const mediaCell = [];
    const bgNode = card.querySelector('.offer-card-wrap-bg');
    const src = bgUrl(bgNode);
    if (src) {
      imageBlue = true;
      const img = document.createElement('img');
      img.src = src;
      img.alt = titleText;
      mediaCell.push(img);
    } else {
      const img = card.querySelector('img');
      if (img) mediaCell.push(img);
    }

    // body cell: heading + copy + CTA paragraph
    const body = [];
    if (titleText) {
      const h3 = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = titleText;
        h3.append(a);
      } else {
        h3.textContent = titleText;
      }
      body.push(h3);
    }
    card.querySelectorAll('.offer-overlay-left > p, .offer-card-wrap-inner p').forEach((p) => {
      if (body.includes(p) || !textOf(p)) return;
      body.push(p);
    });
    if (href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = titleText || 'Know More';
      p.append(a);
      body.push(p);
    }

    if (mediaCell.length || body.length) cells.push([mediaCell, body]);
  });

  // Bootstrap product cards (CSR "related programmes" slick rails). The repeating unit is the
  // slide (div.item.slick-slide) or, unslicked, the card itself: try each, skip slick clones.
  if (!cards.length) {
    const slides = [...element.querySelectorAll('.slick-track > div.item.slick-slide:not(.slick-cloned)')];
    const productCards = slides.length
      ? slides.map((s) => s.querySelector('.card.product-card, .card')).filter(Boolean)
      : [...element.querySelectorAll('.card.product-card, div.card')]
        .filter((c) => !c.closest('.slick-cloned') && !c.parentElement.closest('.card'));
    productCards.forEach((card) => {
      const mediaCell = [];
      const img = card.querySelector('.scale-img-wrap img, img');
      if (img) mediaCell.push(img);
      const body = [];
      const h = card.querySelector('.card-body h1, .card-body h2, .card-body h3, .card-body h4, .card-body h5, h3, h4');
      if (h && textOf(h)) {
        const h3 = document.createElement('h3');
        const hl = h.querySelector('a[href]');
        if (hl) {
          const a = document.createElement('a');
          a.href = hl.getAttribute('href');
          a.textContent = textOf(h);
          h3.append(a);
        } else {
          h3.textContent = textOf(h);
        }
        body.push(h3);
      }
      card.querySelectorAll('.card-body p, p').forEach((p) => {
        if (!textOf(p) || body.includes(p) || p.closest('h1, h2, h3, h4, h5')) return;
        body.push(p);
      });
      card.querySelectorAll('.card-body .d-flex a[href], a.btn[href]').forEach((l) => {
        if (!textOf(l) || (h && h.contains(l))) return;
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = l.getAttribute('href');
        a.textContent = textOf(l);
        p.append(a);
        body.push(p);
      });
      if (mediaCell.length || body.length) cells.push([mediaCell, body]);
    });
  }

  if (!cells.length) return;
  let variant = imageBlue ? 'image-blue' : null;
  if (!variant) {
    try {
      const path = new URL(params && params.originalURL).pathname.replace(/\.html?$/i, '').replace(/\/+$/, '').toLowerCase();
      variant = catalogVariant(path, 'product-grid');
    } catch (e) { /* no page URL */ }
  }
  const name = variant ? `product-grid (${variant})` : 'product-grid';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
