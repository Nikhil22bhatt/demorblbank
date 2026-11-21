/* eslint-disable */
/* global WebImporter */

import homeBlogParse from './home-blog.js';
import columnsLocationParse from './columns-location.js';

import { catalogVariant } from './variant-map.js';
/**
 * product-cards parser.
 * Source: product rails / grids of .card.product-card
 *   ( .scale-img-wrap img + .card-body: h3 title, description, .d-flex CTA buttons )
 * Block contract (blocks/product-cards/product-cards.js):
 *   optional title row (lone heading), card rows [picture] [heading + description + CTAs],
 *   CTA links: em = grey "Know More" (outline button), strong = blue (common-btn-blue).
 * The template selector also matches sibling columns of the related section that hold no
 * product cards. Their inner selectors can no longer claim them (this container overlaps
 * them), so:
 *   - a blog rail (dated story cards) is handed to the home-blog parser, whose title and
 *     CTA rows take the rail heading and "View All" link;
 *   - a video rail (img.video-thumb[data-video]) becomes a columns-location block in place,
 *     its heading and "Watch All" link staying around it as default content;
 *   - anything else is left in place as default content.
 */

const VARIANTS = {
  '/personal-banking/wealth-management/alternate-investment-products': 'slider-2',
  '/personal-banking/wealth-management/e-asba': 'slider-2',
  '/personal-banking/wealth-management/invest-first': 'slider-2',
  '/personal-banking/wealth-management/mutual-fund': 'slider-2',
  '/personal-banking/wealth-management/national-pension-system': 'slider-2',
  '/personal-banking/wealth-management/sovereign-gold-bonds': 'slider-2',
  '/personal-banking/wealth-management/systematic-investment-plan': 'slider-2',
  '/preferred-banking/insignia-banking/nri-banking/nri-accounts': 'premium',
  '/preferred-banking/insignia-banking/nri-banking/nri-deposits': 'premium',
  '/preferred-banking/insignia-banking/nri-banking/nri-money-transfer': 'premium',
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
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'product-cards'));
  return v ? `${base} (${v})` : base;
}

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

function ctaParagraph(document, a) {
  const p = document.createElement('p');
  const link = document.createElement('a');
  // some CMS hrefs are double-escaped ("&amp;amp;")
  link.href = (a.getAttribute('href') || '').replace(/&amp;/g, '&');
  link.textContent = textOf(a);
  const primary = /common-btn-blue|btn-primary/.test(a.className || '');
  const wrap = document.createElement(primary ? 'strong' : 'em');
  wrap.append(link);
  p.append(wrap);
  return p;
}

export default function parse(element, { document, params }) {
  const cells = [];

  const cards = [...element.querySelectorAll('.product-card, .card')]
    .filter((c, i, all) => all.indexOf(c) === i
      && !c.parentElement.closest('.product-card, .card')
      && !c.closest('.slick-cloned'));

  if (!cards.length) {
    const videoRail = element.querySelector('[data-video], img.video-thumb');
    if (videoRail) {
      const rail = videoRail.closest('.related-blog-slick, .slick-slider') || videoRail.parentElement;
      columnsLocationParse(rail, { document, params });
    } else if (element.querySelector('.related-blog-slick, .csr-cate-card-wrap')) {
      homeBlogParse(element, { document, params });
    }
    // no product cards: the container stays as default content
    return;
  }

  // optional rail title outside the cards
  const title = [...element.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .find((h) => !cards.some((c) => c.contains(h)) && textOf(h));
  if (title) {
    const h = document.createElement(title.tagName.toLowerCase());
    h.textContent = textOf(title);
    cells.push([h, '']);
  }

  cards.forEach((card) => {
    const img = card.querySelector('img');
    let pic = '';
    if (img && (img.getAttribute('src') || img.getAttribute('data-src'))) {
      pic = document.createElement('img');
      pic.src = img.getAttribute('src') || img.getAttribute('data-src');
      if (img.getAttribute('alt')) pic.alt = img.getAttribute('alt');
    }

    const body = [];
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading && textOf(heading)) {
      const h = document.createElement(heading.tagName.toLowerCase());
      const ha = heading.querySelector('a[href]');
      if (ha) {
        const link = document.createElement('a');
        link.href = ha.getAttribute('href');
        link.textContent = textOf(heading);
        h.append(link);
      } else {
        h.textContent = textOf(heading);
      }
      body.push(h);
    }

    // CTA buttons (bottom bar); other links stay inline in the description
    const buttons = [...card.querySelectorAll('a.btn[href], .d-flex a[href]')]
      .filter((a, i, all) => all.indexOf(a) === i && textOf(a) && !a.closest('.compare-btn-wrap'));

    // description: paragraphs / lists outside the heading and the CTA bar
    const scope = card.querySelector('.card-body') || card;
    [...scope.querySelectorAll('p, ul, ol')]
      .filter((n) => !n.parentElement.closest('p, ul, ol')
        && !(heading && heading.contains(n))
        && !buttons.some((b) => n.contains(b) && textOf(n) === textOf(b)))
      .forEach((n) => {
        if (!textOf(n)) return;
        if (n.tagName === 'P') {
          const p = document.createElement('p');
          p.innerHTML = n.innerHTML.trim();
          body.push(p);
        } else {
          body.push(n);
        }
      });
    // description text held directly in a div (no <p>)
    const descDiv = scope.querySelector('.p18, .card-text');
    if (descDiv && !descDiv.querySelector('p, ul, ol') && textOf(descDiv)) {
      const p = document.createElement('p');
      p.textContent = textOf(descDiv);
      body.push(p);
    }

    buttons.forEach((a) => body.push(ctaParagraph(document, a)));
    if (!pic && !body.length) return;
    cells.push([pic, body.length ? body : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('product-cards', document, params),
    cells,
  });
  element.replaceWith(block);
}
