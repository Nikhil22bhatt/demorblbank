/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import cardsHighlightsParser from './parsers/cards-highlights.js';
import listingHeroParser from './parsers/listing-hero.js';
import anchorNavParser from './parsers/anchor-nav.js';
import homeBlogParser from './parsers/home-blog.js';
import columnsLocationParser from './parsers/columns-location.js';
import productCardsParser from './parsers/product-cards.js';
import rblCleanupTransformer from './transformers/rbl-cleanup.js';
import rblSectionsTransformer from './transformers/rbl-sections.js';

const PAGE_TEMPLATE = {
  "name": "product-landing",
  "urls": [
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-black-credit-card",
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-gold-credit-card",
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-platinum-credit-card",
    "https://www.rbl.bank.in/rbl-bank-shoppers-stop-credit-cards"
  ],
  "description": "Product page with image hero, anchor nav, highlight cards and blog rail",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "nav#block-rbl-bank-breadcrumbs"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-black-credit-card": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-gold-credit-card": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-platinum-credit-card": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/rbl-bank-shoppers-stop-credit-cards": [
          "#block-rbl-bank-breadcrumbs"
        ]
      }
    },
    {
      "name": "cards-highlights",
      "instances": [
        "div.p20.mb15.icon-strip-wrap"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-black-credit-card": [
          "#data-section1 > div.container > div > div > div > div > div > div > div.p20.mb15.icon-strip-wrap"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-gold-credit-card": [
          "#data-section1 > div.container > div > div > div > div > div > div > div.p20.mb15.icon-strip-wrap"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-platinum-credit-card": [
          "#data-section1 > div.container > div > div > div > div > div > div > div.p20.mb15.icon-strip-wrap"
        ]
      }
    },
    {
      "name": "listing-hero",
      "instances": [
        "div.banner-img.banner-img-wrap"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-black-credit-card": [
          "#data-section1 > div.banner-img.banner-img-wrap.aos-init.aos-animate"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-gold-credit-card": [
          "#data-section1 > div.banner-img.banner-img-wrap.aos-init.aos-animate"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-platinum-credit-card": [
          "#data-section1 > div.banner-img.banner-img-wrap.aos-init.aos-animate"
        ]
      }
    },
    {
      "name": "anchor-nav",
      "instances": [
        "section.common-section.saving-acc-adv-section"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-black-credit-card": [
          "#data-section2"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-gold-credit-card": [
          "#data-section2"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-platinum-credit-card": [
          "#data-section2"
        ]
      }
    },
    {
      "name": "home-blog",
      "instances": [
        "div.related-blog-slick.mb30"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-black-credit-card": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-gold-credit-card": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-platinum-credit-card": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ]
      }
    },
    {
      "name": "columns-location",
      "instances": [
        "#data-related-blog div.related-blog-slick"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-black-credit-card": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-gold-credit-card": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-platinum-credit-card": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ]
      }
    },
    {
      "name": "product-cards",
      "instances": [
        "div.field--name-field-insurance-category.field__items"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/rbl-bank-shoppers-stop-credit-cards": [
          "#block-rbl-bank-content > div > article > section > div > div > div > div > div > div.field.row.field--name-field-insurance-category.field--type-entity-reference-revisions.field--label-hidden.field__items"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "main-content",
      "name": "Main content",
      "selector": [
        "#main-wrapper",
        "#block-rbl-bank-content",
        "main"
      ],
      "style": null,
      "blocks": [
        "breadcrumb",
        "cards-highlights",
        "listing-hero",
        "anchor-nav",
        "home-blog",
        "columns-location",
        "product-cards"
      ],
      "defaultContent": [
        "#data-section1 > div.container > div > div > div > div > div > div > h1",
        "#data-section1 > div.container > div > div > div > div > div > div > div.term-text",
        "#data-related-blog1 > div > div > div > div > h2",
        "#data-related-blog1 > div > div > div > div > div.text-center",
        "#data-related-blog > div > div > div > div > p",
        "#data-related-blog > div > div > div > div > div.text-center.mb30.button",
        "#block-rbl-bank-content > div > article > section > div > div > div > div > div > h1",
        "#apply",
        "#data-section1 > div.container > div > div > div > div > div > div > p"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-black-credit-card": [
      "#video-popup",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-gold-credit-card": [
      "#video-popup",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/rbl-bank-shoppers-stop-platinum-credit-card": [
      "#video-popup",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/rbl-bank-shoppers-stop-credit-cards": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'cards-highlights': cardsHighlightsParser,
  'listing-hero': listingHeroParser,
  'anchor-nav': anchorNavParser,
  'home-blog': homeBlogParser,
  'columns-location': columnsLocationParser,
  'product-cards': productCardsParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [rblSectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
// Page corrections ({sitename}-page-corrections.js, when it exists) run last.
const correctionTransformers = [];
const transformers = [rblCleanupTransformer, ...lateTransformers, ...correctionTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; } catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
