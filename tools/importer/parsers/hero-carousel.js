/* eslint-disable */
/* global WebImporter */

/**
 * hero-carousel parser.
 * Source: div.home-banner-wrapper (homepage, nested slick) or the insignia banner blocks
 *   (#block-rbl-bank-insigniahomepagebanner / #block-rbl-bank-insignianthlevelpagebanner).
 *   Slides: section.home-page-banner.slick-slide:not(.slick-cloned)
 *     .banner-img-desktop / .banner-img-mobile — background images (alt = aria-label)
 *     .banner-info: either a lone overlay link (a.banner-info-inner > span text) or a banner
 *     card (h1/h2/h4 headings + a.btn CTA).
 * Block contract (blocks/hero-carousel/hero-carousel.js + content/index.plain.html):
 *   one row per slide: [desktop picture] [mobile picture] [optional copy cell]
 *   copy cell = a lone link paragraph (whole-slide link) or headings + CTA (strong link).
 * Guards: the template selector div.home-banner-wrapper also matches the nested inner slick
 *   wrapper and the promo-carousel rails (which reuse the class); those calls are no-ops.
 */

function textOf(node) {
  return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
}

function bgUrl(node) {
  if (!node) return '';
  const style = node.getAttribute('style') || '';
  const m = style.match(/url\(\s*(?:&quot;|['"])?(.*?)(?:&quot;|['"])?\s*\)/i);
  if (m) return m[1].trim();
  return node.getAttribute('data-src') || node.getAttribute('data-bg') || '';
}

function imgFrom(document, node) {
  if (!node) return null;
  const src = node.tagName === 'IMG' ? (node.getAttribute('src') || node.getAttribute('data-src')) : bgUrl(node);
  if (!src) return null;
  const img = document.createElement('img');
  img.src = src;
  img.alt = node.getAttribute('aria-label') || node.getAttribute('alt') || '';
  return img;
}

/** copy of a heading: text, <br> and <strong> kept */
function heading(document, h) {
  const out = document.createElement(h.tagName.toLowerCase());
  h.childNodes.forEach((n) => {
    if (n.nodeType === 3) out.append(n.textContent);
    else if (n.tagName === 'BR') out.append(document.createElement('br'));
    else if (n.tagName === 'STRONG' || n.tagName === 'B') {
      const s = document.createElement('strong');
      s.textContent = textOf(n);
      out.append(s);
    } else out.append(textOf(n));
  });
  return out;
}

function linkPara(document, link, strong) {
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = link.getAttribute('href');
  a.textContent = textOf(link);
  if (strong) {
    const s = document.createElement('strong');
    s.append(a);
    p.append(s);
  } else p.append(a);
  return p;
}

export default function parse(element, { document }) {
  if (!element.parentElement) return; // already consumed with its outer wrapper
  // not a hero rail (promo-carousel rails reuse .home-banner-wrapper)
  if (!element.querySelector('section.home-page-banner')) return;
  // the inner slick wrapper of an outer hero wrapper: the outer call handles it
  const outer = element.parentElement.closest('.home-banner-wrapper');
  if (outer && outer.querySelector('section.home-page-banner')) return;

  let slides = [...element.querySelectorAll('section.home-page-banner')]
    .filter((s) => !s.classList.contains('slick-cloned') && !s.closest('.slick-cloned'));
  if (!slides.length) slides = [...element.querySelectorAll('section.home-page-banner')];

  const cells = [];
  slides.forEach((slide) => {
    const row = [];
    const desktop = imgFrom(document, slide.querySelector('.banner-img-desktop'));
    const mobile = imgFrom(document, slide.querySelector('.banner-img-mobile'));
    if (desktop) row.push([desktop]);
    if (mobile) row.push([mobile]);

    const info = slide.querySelector('.banner-info') || slide.querySelector('.container');
    const copy = [];
    if (info) {
      const hs = [...info.querySelectorAll('h1, h2, h3, h4, h5, h6')];
      if (hs.length) {
        hs.forEach((h) => { if (textOf(h)) copy.push(heading(document, h)); });
        info.querySelectorAll('a[href]').forEach((a) => {
          if (textOf(a)) copy.push(linkPara(document, a, true));
        });
      } else {
        const link = info.querySelector('a[href]');
        if (link && textOf(link)) copy.push(linkPara(document, link, false));
        else if (textOf(info)) {
          const p = document.createElement('p');
          p.textContent = textOf(info);
          copy.push(p);
        }
      }
    }
    if (copy.length) row.push(copy);
    if (row.length) cells.push(row);
  });

  if (!cells.length) return;
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-carousel', cells });
  element.replaceWith(block);
}
