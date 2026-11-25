/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import tabsCardSelectorParser from './parsers/tabs-card-selector.js';
import cardsDocumentLinksParser from './parsers/cards-document-links.js';
import homeBlogParser from './parsers/home-blog.js';
import homeVideosParser from './parsers/home-videos.js';
import appBandParser from './parsers/app-band.js';
import columnsLocationParser from './parsers/columns-location.js';
import aboutBannerParser from './parsers/about-banner.js';
import rblCleanupTransformer from './transformers/rbl-cleanup.js';
import rblSectionsTransformer from './transformers/rbl-sections.js';

const PAGE_TEMPLATE = {
  "name": "credit-cards-listing",
  "urls": [
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards"
  ],
  "representativeUrl": "https://www.rbl.bank.in/personal-banking/cards/credit-cards",
  "description": "Credit cards listing: banner, card selector tabs, promo tiles, quick links, blog and video rails, app band, IVR/payments",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "nav#block-rbl-bank-breadcrumbs"
      ]
    },
    {
      "name": "tabs-card-selector",
      "instances": [
        "#data-section2 div.pick-offer-outer"
      ]
    },
    {
      "name": "cards-document-links",
      "instances": [
        "#data-quick-link div.quick-link-bottom"
      ]
    },
    {
      "name": "home-blog",
      "instances": [
        "#data-related-blog1 div.related-blog-slick.mb30"
      ]
    },
    {
      "name": "home-videos",
      "instances": [
        "#data-related-blog"
      ]
    },
    {
      "name": "app-band",
      "instances": [
        "section.rbl-myapp-section"
      ]
    },
    {
      "name": "columns-location",
      "instances": [
        "#data-section6 div.field__item > div.row",
        "#data-ivr-transaction div.ivr-media.media",
        "#data-ivr-transaction div.payment-card-para > div.row"
      ]
    },
    {
      "name": "about-banner",
      "instances": [
        "section.common-section.banner-section"
      ]
    }
  ],
  "urlPattern": "/personal-banking/cards/*",
  "sections": [
    {
      "id": "breadcrumb",
      "name": "breadcrumb",
      "selector": [
        "nav#block-rbl-bank-breadcrumbs"
      ],
      "style": null,
      "blocks": [
        "breadcrumb"
      ],
      "defaultContent": []
    },
    {
      "id": "hero-banner",
      "name": "hero-banner",
      "selector": [
        "#data-section1",
        "section.banner-section"
      ],
      "style": null,
      "blocks": [
        "about-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "pick-the-best",
      "name": "pick-the-best",
      "selector": [
        "#data-section2"
      ],
      "style": null,
      "blocks": [
        "tabs-card-selector"
      ],
      "defaultContent": [
        "#data-section2 h2.common-section-heading",
        "#data-section2 > div > div > div > div > a.btn"
      ]
    },
    {
      "id": "promo-tiles",
      "name": "promo-tiles",
      "selector": [
        "#data-section6"
      ],
      "style": null,
      "blocks": [
        "columns-location"
      ],
      "defaultContent": [
        "#data-section6 a[href*=\"demo-videos\"]",
        "#data-section6 p.p18"
      ]
    },
    {
      "id": "quick-links",
      "name": "quick-links",
      "selector": [
        "#data-quick-link",
        "section.quick-link-rbl-section"
      ],
      "style": "lavender",
      "blocks": [
        "cards-document-links"
      ],
      "defaultContent": [
        "#data-quick-link h2.common-section-heading"
      ]
    },
    {
      "id": "related-blog",
      "name": "related-blog",
      "selector": [
        "#data-related-blog1"
      ],
      "style": "lavender",
      "blocks": [
        "home-blog"
      ],
      "defaultContent": [
        "#data-related-blog1 h2.common-section-heading"
      ]
    },
    {
      "id": "trust-and-beyond",
      "name": "trust-and-beyond",
      "selector": [
        "#data-related-blog"
      ],
      "style": null,
      "blocks": [
        "home-videos"
      ],
      "defaultContent": []
    },
    {
      "id": "mybank-app",
      "name": "mybank-app",
      "selector": [
        "#data-mobank-app",
        "section.rbl-myapp-section"
      ],
      "style": null,
      "blocks": [
        "app-band"
      ],
      "defaultContent": []
    },
    {
      "id": "ivr-payments",
      "name": "ivr-payments",
      "selector": [
        "#data-ivr-transaction",
        "section.rbl-ivr-section"
      ],
      "style": "light-blue",
      "blocks": [
        "columns-location"
      ],
      "defaultContent": [
        "#data-ivr-transaction p > strong",
        "#data-ivr-transaction em"
      ]
    }
  ]
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'tabs-card-selector': tabsCardSelectorParser,
  'cards-document-links': cardsDocumentLinksParser,
  'home-blog': homeBlogParser,
  'home-videos': homeVideosParser,
  'app-band': appBandParser,
  'columns-location': columnsLocationParser,
  'about-banner': aboutBannerParser,
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
