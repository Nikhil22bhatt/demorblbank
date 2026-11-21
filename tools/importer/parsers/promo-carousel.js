/* eslint-disable */
/* global WebImporter */

/**
 * promo-carousel parser.
 * Source: Drupal block (#block-homebenefitsection, #block-homerblmobankapp) holding a nested
 *   slick carousel; real slides are div.item.slick-slide:not(.slick-cloned) (fallback: any
 *   non-cloned section.banner-section / section.rbl-myapp-section).
 *   a. offer slides (section.banner-section): .banner-img-desktop / .banner-img-mobile
 *      background images (alt from aria-label) + .amazing-offer (h2, .banner-para list or
 *      spans, CTA link).
 *   b. app banners (section.rbl-myapp-section): linked desktop / mobile <img> only.
 * Block contract (blocks/promo-carousel/promo-carousel.js + content/index.plain.html):
 *   one row per slide: [desktop picture] [mobile picture] [copy: heading + list|paragraph +
 *   CTA (strong link)] [optional style: light | compact].
 *   Image-only linked banners keep their link as a copy cell holding a text link (the image
 *   alt) since the picture cells must not hold links.
 * Variant: the photo-background option for the offer-slide rail (block-context variants.json);
 *   the app-banner rail has no option.
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

function makeImg(document, src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  return img;
}

function imgFrom(document, node) {
  if (!node) return null;
  if (node.tagName === 'IMG') {
    const src = node.getAttribute('src') || node.getAttribute('data-src');
    return src ? makeImg(document, src, node.getAttribute('alt') || '') : null;
  }
  const src = bgUrl(node);
  return src ? makeImg(document, src, node.getAttribute('aria-label') || '') : null;
}

function isWhite(color) {
  return /^(white|#fff|#ffffff|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))$/i.test((color || '').trim());
}

function copyCell(document, offer) {
  const out = [];
  const h = offer.querySelector('h1, h2, h3, h4');
  if (h) {
    const h2 = document.createElement('h2');
    h.childNodes.forEach((n) => {
      if (n.nodeType === 3) h2.append(n.textContent);
      else if (n.tagName === 'BR') h2.append(document.createElement('br'));
      else if (n.tagName === 'STRONG' || n.tagName === 'B') {
        const s = document.createElement('strong');
        s.textContent = textOf(n);
        h2.append(s);
      } else h2.append(textOf(n));
    });
    out.push(h2);
  }
  offer.querySelectorAll('.banner-para').forEach((para) => {
    const list = para.querySelector('ul, ol');
    if (list) {
      const ul = document.createElement(list.tagName.toLowerCase());
      list.querySelectorAll('li').forEach((li) => {
        const item = document.createElement('li');
        item.textContent = textOf(li);
        if (item.textContent) ul.append(item);
      });
      out.push(ul);
    } else if (textOf(para)) {
      const p = document.createElement('p');
      p.textContent = textOf(para);
      out.push(p);
    }
  });
  offer.querySelectorAll('a[href]').forEach((link) => {
    if (!textOf(link)) return;
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.textContent = textOf(link);
    strong.append(a);
    p.append(strong);
    out.push(p);
  });
  return out;
}

export default function parse(element, { document }) {
  let slides = [...element.querySelectorAll('.item.slick-slide')]
    .filter((s) => !s.classList.contains('slick-cloned'));
  if (!slides.length) {
    slides = [...element.querySelectorAll('section.banner-section, section.rbl-myapp-section')]
      .filter((s) => !s.closest('.slick-cloned'));
  }

  const cells = [];
  let offerRail = false;
  slides.forEach((slide) => {
    const row = [];
    const offer = slide.querySelector('.amazing-offer');
    const bgD = slide.querySelector('.banner-img-desktop:not(img)');
    if (bgD || offer) offerRail = true;

    const desktop = imgFrom(document, slide.querySelector('.banner-img-desktop'));
    const mobile = imgFrom(document, slide.querySelector('.banner-img-mobile'));
    if (desktop) row.push([desktop]);
    if (mobile) row.push([mobile]);

    if (offer) {
      const copy = copyCell(document, offer);
      if (copy.length) row.push(copy);
      const keys = [];
      const h = offer.querySelector('h1, h2, h3, h4');
      const color = h ? ((h.getAttribute('style') || '').match(/(?:^|;)\s*color\s*:\s*([^;]+)/i) || [])[1] : '';
      if (isWhite(color) || offer.querySelector('.banner-para.text-white')) keys.push('light');
      if (slide.classList.contains('iocl')) keys.push('compact');
      if (keys.length && copy.length) {
        const p = document.createElement('p');
        p.textContent = keys.join(', ');
        row.push([p]);
      }
    } else {
      // image-only linked banner: keep the link as a text link in the copy cell
      const link = slide.querySelector('a[href]');
      if (link) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = (desktop && desktop.alt) || (mobile && mobile.alt) || textOf(link) || link.getAttribute('href');
        p.append(a);
        row.push([p]);
      }
    }
    if (row.length) cells.push(row);
  });

  if (!cells.length) return;
  const name = offerRail ? 'promo-carousel (photo-background)' : 'promo-carousel';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
