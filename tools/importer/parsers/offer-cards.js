/* eslint-disable */
/* global WebImporter */

/**
 * offer-cards parser.
 * Source: div.offers-deals-slick (slick rail) > .slick-track > div.item (non-cloned)
 *   > .offer-card-wrap: .offer-card-wrap-bg (background-image) + .offer-overlay-left
 *   (.offer-title tag, p.p24 title, p.p14 text) + .offer-overlay-right a.next-arrow-btn.
 *   The rail heading (h2 sibling before) and "Explore More" CTA (div.text-center sibling
 *   after) belong to the block.
 * Block contract (blocks/offer-cards/offer-cards.js):
 *   title row (lone heading), card rows [background picture] [tag p, title p, text p,
 *   arrow link p (source arrow image inside the link)], CTA row (strong link = primary button).
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

function para(document, text) {
  const p = document.createElement('p');
  p.textContent = text;
  return p;
}

export default function parse(element, { document }) {
  const cells = [];

  // title row: the heading immediately before the rail
  let heading = element.previousElementSibling;
  while (heading && !/^H[1-6]$/.test(heading.tagName) && !textOf(heading)) {
    heading = heading.previousElementSibling;
  }
  if (heading && /^H[1-6]$/.test(heading.tagName)) {
    const h2 = document.createElement('h2');
    h2.textContent = textOf(heading);
    cells.push([h2]);
    heading.remove();
  } else {
    heading = null;
  }

  // card rows (skip slick clones)
  let items = [...element.querySelectorAll('.item')].filter((i) => !i.classList.contains('slick-cloned'));
  if (!items.length) items = [...element.querySelectorAll('.offer-card-wrap')];
  items.forEach((item) => {
    const card = item.matches('.offer-card-wrap') ? item : (item.querySelector('.offer-card-wrap') || item);
    const tag = textOf(card.querySelector('.offer-title'));
    const left = card.querySelector('.offer-overlay-left');
    const ps = left ? [...left.querySelectorAll(':scope > p')] : [];
    const title = ps[0] ? textOf(ps[0]) : '';
    const rest = ps.slice(1).map(textOf).filter(Boolean);
    const arrow = card.querySelector('.offer-overlay-right a[href], a.next-arrow-btn[href]')
      || item.querySelector('a[href]');

    const media = [];
    const src = bgUrl(card.querySelector('.offer-card-wrap-bg'));
    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = [title, tag].filter(Boolean).join(' – ');
      media.push(img);
    }

    const body = [];
    if (tag) body.push(para(document, tag));
    if (title) body.push(para(document, title));
    rest.forEach((t) => body.push(para(document, t)));
    if (arrow) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = arrow.getAttribute('href');
      a.title = 'View next-btn';
      // keep the source arrow image as the link content (an image link, no extra text)
      const arrowImg = arrow.querySelector('img');
      if (arrowImg) {
        const img = document.createElement('img');
        img.src = arrowImg.getAttribute('src');
        img.alt = arrowImg.getAttribute('alt') || 'next-btn';
        a.append(img);
      } else {
        a.textContent = textOf(arrow) || 'View offer';
      }
      p.append(a);
      body.push(p);
    }
    if (media.length || body.length) cells.push([media, body]);
  });

  // CTA row: the centered link block right after the rail
  let ctaWrap = element.nextElementSibling;
  if (ctaWrap && !(ctaWrap.matches('.text-center') && ctaWrap.querySelector('a[href]'))) ctaWrap = null;
  if (ctaWrap) {
    ctaWrap.querySelectorAll('a[href]').forEach((link) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = textOf(link);
      strong.append(a);
      p.append(strong);
      cells.push([p]);
    });
    ctaWrap.remove();
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'offer-cards', cells });
  element.replaceWith(block);
}
