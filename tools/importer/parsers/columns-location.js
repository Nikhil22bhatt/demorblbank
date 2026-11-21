/* eslint-disable */
/* global WebImporter */

/**
 * columns-location parser.
 * Sources (catalog detections are broad):
 *   - #data-related-blog div.related-blog-slick: video tiles (.item > img.video-thumb[data-video])
 *   - div.rbl-myapp-right > div.apps-download: app-store badge links
 *   - div.feature-sec3 / div.row of col-* columns: icon/image + text columns
 * Block contract (blocks/columns-location/columns-location.js):
 *   each row = N cells; a picture-only cell is an image column; text cells may lead with an icon.
 */

// Option class per page from the catalog; DOM shape overrides it on pages that carry both.
const VARIANTS = {
  '/personal-banking/accounts/savings-accounts/woman-first-savings-account': 'alt',
  '/personal-banking/loans': 'alt',
  '/personal-banking/term-deposits/digital-fixed-deposit': 'alt',
  '/personal-banking/wealth-management/3-in-1-account': 'alt',
  '/personal-banking/wealth-management/alternate-investment-products': 'alt',
  '/personal-banking/wealth-management/e-asba': 'alt',
  '/personal-banking/wealth-management/invest-first': 'alt',
  '/personal-banking/wealth-management/mutual-fund': 'alt',
  '/personal-banking/wealth-management/national-pension-system': 'alt',
  '/personal-banking/wealth-management/sovereign-gold-bonds': 'alt',
  '/personal-banking/wealth-management/systematic-investment-plan': 'alt',
  '/preferred-banking/insignia-banking/business': 'alt',
  '/preferred-banking/insignia-banking/nri-banking/nri-accounts': 'alt',
  '/preferred-banking/insignia-banking/nri-banking/nri-deposits': 'alt',
  '/preferred-banking/insignia-banking/nri-banking/nri-money-transfer': 'alt',
  '/preferred-banking/insignia/individual/investment-services_old': 'alt',
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

function variantFor(element, document, params) {
  const is = (sel) => element.matches(sel) || !!element.querySelector(sel);
  // shapes the catalog classifies as the alt listing
  if (is('.related-blog-slick, .apps-download')) return 'alt';
  // shapes the catalog classifies as the plain variant
  if (is('.feature-sec3, .yourteamDiv, .card-body .d-flex') || element.matches('.d-flex, .row.text-center.mt30')) return null;
  return VARIANTS[pagePath(document, params)] || null;
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

function videoUrl(raw) {
  try {
    const u = new URL(raw, 'https://www.rbl.bank.in/');
    const m = u.pathname.match(/\/embed\/([^/?#]+)/);
    if (/youtube/i.test(u.hostname) && m) return `https://www.youtube.com/watch?v=${m[1]}`;
    return u.href;
  } catch (e) {
    return raw;
  }
}

/** Flatten a column into paragraphs / headings / lists, keeping images and links. */
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
      const href = child.getAttribute('href');
      const img = child.querySelector('img');
      if (!textOf(child) && !img) return;
      const p = document.createElement('p');
      const a = document.createElement('a');
      if (href) a.href = href;
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

export default function parse(element, { document, params }) {
  const cells = [];

  const tiles = [...element.querySelectorAll('.item, .slick-slide')]
    .filter((n, i, all) => all.indexOf(n) === i && !n.classList.contains('slick-cloned')
      && !n.parentElement.closest('.item, .slick-slide'));
  const badges = element.matches('.apps-download') ? [...element.querySelectorAll('a[href]')] : [];

  if (tiles.length) {
    // video tiles: one column per tile — thumbnail + link to the video
    const row = [];
    tiles.forEach((tile) => {
      const img = tile.querySelector('img');
      const content = [];
      if (img) {
        const pic = makeImg(document, img);
        if (pic) content.push(pic);
        const video = img.getAttribute('data-video') || (tile.querySelector('[data-video]') || {}).getAttribute?.('data-video');
        if (video) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = videoUrl(video);
          a.textContent = (img.getAttribute('alt') || '').trim() || a.href;
          p.append(a);
          content.push(p);
        }
      } else {
        flatten(document, tile, content);
      }
      if (content.length) row.push(content);
    });
    if (row.length) cells.push(row);
  } else if (badges.length) {
    // app-store badges: one image-link per column (rebuilt: the source links hold only an image)
    const row = [];
    badges.forEach((a) => {
      const img = a.querySelector('img');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      if (img) link.append(makeImg(document, img));
      else link.textContent = textOf(a);
      row.push([link]);
    });
    cells.push(row);
  } else {
    // generic column row: the direct columns of the first .row (or the element's children)
    const rowEl = element.matches('.row') ? element : (element.querySelector('.row') || element);
    let cols = [...rowEl.children].filter((c) => textOf(c) || c.querySelector('img'));
    if (cols.length === 1 && cols[0].children.length > 1 && !rowEl.matches('.row')) {
      cols = [...cols[0].children].filter((c) => textOf(c) || c.querySelector('img'));
    }
    const row = [];
    cols.forEach((col) => {
      const content = [];
      flatten(document, col, content);
      if (content.length) row.push(content);
    });
    if (row.length) cells.push(row);
    // anything outside the column row stays in the block as a full-width row
    if (rowEl !== element) {
      const extra = [];
      [...element.children].forEach((c) => {
        if (c === rowEl || c.contains(rowEl)) return;
        flatten(document, c, extra);
      });
      if (extra.length) cells.unshift([extra]);
    }
  }

  const v = variantFor(element, document, params);
  const block = WebImporter.Blocks.createBlock(document, {
    name: v ? `columns-location (${v})` : 'columns-location',
    cells,
  });
  element.replaceWith(block);
}
