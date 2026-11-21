/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * home-blog parser.
 * Source: div.related-blog-slick.mb30 — slick rail of .item cards:
 *   .csr-cate-card-wrap-bg (background-image) + .csr-cate-card-wrap-inner (p.date + p.h6 > a)
 * Block contract (blocks/home-blog/home-blog.js):
 *   optional title row (lone heading), card rows [background picture] [date + title link],
 *   optional CTA row (lone formatted link).
 */

const VARIANTS = {
  '/preferred-banking/insignia-banking/business': 'light',
  '/preferred-banking/insignia-banking/nri-banking/nri-accounts': 'light',
  '/preferred-banking/insignia-banking/nri-banking/nri-deposits': 'light',
  '/preferred-banking/insignia-banking/nri-banking/nri-money-transfer': 'light',
  '/preferred-banking/insignia/individual/investment-services_old': 'light',
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
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'home-blog'));
  return v ? `${base} (${v})` : base;
}

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

function bgUrl(node) {
  if (!node) return '';
  const style = node.getAttribute('style') || '';
  const m = style.match(/background-image\s*:\s*url\(\s*(['"]?)(.*?)\1\s*\)/i);
  return m && m[2] ? m[2].replace(/&quot;/g, '').replace(/^["']|["']$/g, '') : '';
}

export default function parse(element, { document, params }) {
  const cells = [];

  const heading = [...element.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .find((h) => !h.closest('.item, .slick-slide') && textOf(h));
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = textOf(heading);
    cells.push([h, '']);
  }

  // one card per slide; nested matches and slick clones are skipped
  let slides = [...element.querySelectorAll('.item, .slick-slide')]
    .filter((n, i, all) => all.indexOf(n) === i && !n.classList.contains('slick-cloned')
      && !n.parentElement.closest('.item, .slick-slide'));
  if (!slides.length) slides = [...element.querySelectorAll('.csr-cate-card-wrap')];

  slides.forEach((slide) => {
    const bgEl = slide.querySelector('.csr-cate-card-wrap-bg, [style*="background-image"]');
    const imgEl = slide.querySelector('img');
    let pic = '';
    const src = bgUrl(bgEl) || (imgEl && (imgEl.getAttribute('src') || imgEl.getAttribute('data-src')));
    if (src) {
      pic = document.createElement('img');
      pic.src = src;
      const alt = (bgEl && bgEl.getAttribute('aria-label')) || (imgEl && imgEl.getAttribute('alt')) || '';
      if (alt) pic.alt = alt.trim();
    }

    const text = [];
    const date = slide.querySelector('.date, .p12');
    if (date && textOf(date)) {
      const p = document.createElement('p');
      p.textContent = textOf(date);
      text.push(p);
    }
    // The title link: inside the heading when there is one (some rails also link the date),
    // else the first link that is not the date.
    const a = slide.querySelector('.h6 a[href], h6 a[href], h5 a[href], h4 a[href], h3 a[href], a.h6[href]')
      || [...slide.querySelectorAll('a[href]')].find((l) => !(date && date.contains(l)));
    if (a && textOf(a)) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = textOf(a);
      p.append(link);
      text.push(p);
    } else {
      const title = slide.querySelector('.h6, h6, h5, h4, h3');
      if (title && textOf(title)) {
        const p = document.createElement('p');
        p.textContent = textOf(title);
        text.push(p);
      }
    }
    if (!pic && !text.length) return;
    cells.push([pic, text.length ? text : '']);
  });

  // a "view all" link outside the slides becomes the CTA row
  const cta = [...element.querySelectorAll('a[href]')]
    .find((a) => !a.closest('.item, .slick-slide, .csr-cate-card-wrap') && textOf(a));
  if (cta) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const link = document.createElement('a');
    link.href = cta.getAttribute('href');
    link.textContent = textOf(cta);
    strong.append(link);
    p.append(strong);
    cells.push([p, '']);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('home-blog', document, params),
    cells,
  });
  element.replaceWith(block);
}
