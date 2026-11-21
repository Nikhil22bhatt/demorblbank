/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import impactStatsParser from './parsers/impact-stats.js';
import columnsMediaParser from './parsers/columns-media.js';
import productGridParser from './parsers/product-grid.js';
import homeBlogParser from './parsers/home-blog.js';
import offerCardsParser from './parsers/offer-cards.js';
import productCardsParser from './parsers/product-cards.js';
import fdCalculatorParser from './parsers/fd-calculator.js';
import promoCarouselParser from './parsers/promo-carousel.js';
import columnsLocationParser from './parsers/columns-location.js';
import heroCarouselParser from './parsers/hero-carousel.js';
import rblCleanupTransformer from './transformers/rbl-cleanup.js';
import rblSectionsTransformer from './transformers/rbl-sections.js';

const PAGE_TEMPLATE = {
  "name": "homepage",
  "urls": [
    "https://www.rbl.bank.in/",
    "https://www.rbl.bank.in/homepage",
    "https://www.rbl.bank.in/preferred-banking/insignia-banking",
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/individual"
  ],
  "description": "Landing page with hero carousel, rate band, promo carousels, calculator and product card rails",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "nav#block-rbl-bank-breadcrumbs"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/preferred-banking/insignia-banking": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/individual": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height",
          "#nav-privileges > div > div > div > div.row.ing_content_top_nth"
        ]
      }
    },
    {
      "name": "impact-stats",
      "instances": [],
      "pageInstances": {
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/individual": [
          "#nav-privileges > div > div > div > div.aos-init.aos-animate.ing_content_second_nth",
          "#nav-privileges > div > div > div > div:nth-child(6)",
          "#nav-privileges > div > div > div > div:nth-child(8)"
        ]
      }
    },
    {
      "name": "columns-media",
      "instances": [
        "div.ing_content_last_nth",
        "div.ing_content_last_nth_secondlast"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/preferred-banking/insignia-banking": [
          "#block-rbl-bank-content > div > article > section:nth-child(4)"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/individual": [
          "#nav-privileges > div > div > div > div.ing_content_last_nth",
          "#nav-privileges > div > div > div > div.ing_content_last_nth_secondlast"
        ]
      }
    },
    {
      "name": "product-grid",
      "instances": [
        "section.stand-alone-section1 div.biz-seg"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/preferred-banking/insignia-banking": [
          "#block-rbl-bank-content > div > article > section.common-section.stand-alone-section1 > div > div > div > div > div > div > div.biz-seg"
        ]
      }
    },
    {
      "name": "home-blog",
      "instances": [
        "div.related-blog-slick.mb30"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/homepage": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/individual": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ]
      }
    },
    {
      "name": "offer-cards",
      "instances": [
        "div.offers-deals-slick"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/": [
          "#data-section7 > div > div > div > div > div.offers-deals-slick.mb30.slick-initialized.slick-slider.aos-init.aos-animate"
        ],
        "https://www.rbl.bank.in/homepage": [
          "#data-section7 > div > div > div > div > div.offers-deals-slick.mb30.slick-initialized.slick-slider.aos-init.aos-animate"
        ]
      }
    },
    {
      "name": "product-cards",
      "instances": [
        "#data-section6 > div > div > div > div > div"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/": [
          "#data-section6 > div > div > div > div > div"
        ],
        "https://www.rbl.bank.in/homepage": [
          "#data-section6 > div > div > div > div > div"
        ]
      }
    },
    {
      "name": "fd-calculator",
      "instances": [
        "#data-section4 #myTabContent",
        "#data-section4 div.row.newMobile"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/": [
          "#myTabContent",
          "#data-section4 > div > div > div > div > div.row.newMobile"
        ],
        "https://www.rbl.bank.in/homepage": [
          "#myTabContent",
          "#data-section4 > div > div > div > div > div.row.newMobile"
        ]
      }
    },
    {
      "name": "promo-carousel",
      "instances": [
        "#block-homebenefitsection",
        "#block-homerblmobankapp"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/": [
          "#block-homebenefitsection",
          "#block-homerblmobankapp"
        ],
        "https://www.rbl.bank.in/homepage": [
          "#block-homebenefitsection",
          "#block-homerblmobankapp"
        ]
      }
    },
    {
      "name": "columns-location",
      "instances": [
        "div.field--name-field-attractive-rates",
        "div.related-blog-slick:not(.mb30)"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/": [
          "#data-section2 > div > div > div > div > div.clearfix.text-formatted.field.field--name-field-attractive-rates.field--type-text-long.field--label-hidden.field__item.a3",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/homepage": [
          "#data-section2 > div > div > div > div > div.clearfix.text-formatted.field.field--name-field-attractive-rates.field--type-text-long.field--label-hidden.field__item.a3",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking": [
          "#data-section2"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/individual": [
          "#nav-privileges > div > div > div > div.ing_content_middle_nth > div:nth-child(1)",
          "#nav-privileges > div > div > div > div.ing_content_middle_nth > div:nth-child(2)",
          "#nav-privileges > div > div > div > div:nth-child(4) > div:nth-child(1)",
          "#nav-privileges > div > div > div > div:nth-child(4) > div:nth-child(2)",
          "#block-rbl-bank-content > div > article > div:nth-of-type(2) > div > section"
        ]
      }
    },
    {
      "name": "hero-carousel",
      "instances": [
        "div.home-banner-wrapper",
        "#block-rbl-bank-insigniahomepagebanner",
        "#block-rbl-bank-insignianthlevelpagebanner"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/": [
          "#content > section > div.home-banner-wrapper.slick-initialized.slick-slider.slick-dotted"
        ],
        "https://www.rbl.bank.in/homepage": [
          "#content > section > div.home-banner-wrapper.slick-initialized.slick-slider.slick-dotted"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking": [
          "#block-rbl-bank-insigniahomepagebanner"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/individual": [
          "#block-rbl-bank-insignianthlevelpagebanner"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "main-content",
      "name": "main-content",
      "selector": [
        "#main-wrapper",
        "#block-rbl-bank-content",
        "main"
      ],
      "style": null,
      "blocks": [
        "breadcrumb",
        "impact-stats",
        "columns-media",
        "product-grid",
        "home-blog",
        "offer-cards",
        "product-cards",
        "fd-calculator",
        "promo-carousel",
        "columns-location",
        "hero-carousel"
      ],
      "defaultContent": [
        "#data-section2 > div > div > div > div > div.row",
        "#data-section4 > div > div > div > div > div:nth-child(1)",
        "#data-section4 > div > div > div > div > div:nth-child(4)",
        "#data-section6 > div > div > div > div > h2",
        "#data-section7 > div > div > div > div > h2",
        "#data-section7 > div > div > div > div > div.text-center.aos-init.aos-animate",
        "#data-related-blog1 > div > div > div > div > h2",
        "#data-related-blog1 > div > div > div > div > div.text-center",
        "#data-related-blog > div > div > div > div > p",
        "#data-related-blog > div > div > div > div > div.text-center.mb30.button",
        "#block-rbl-bank-content > div > article > section.common-section.stand-alone-section1 > div > div > div > div > div > div > div.stand-alone-section1.mb30",
        "#block-rbl-bank-content > div > article > div.views-element-container > div > div.view-header",
        "#block-rbl-bank-content > div > article > div.views-element-container > div > div.view-footer",
        "#data-related-blog > div > div > div > div > h2",
        "#data-related-blog > div > div > div > div > div.text-center",
        "#nav-privileges > div > div > div > div:nth-child(4) > div:nth-child(3)"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.rbl.bank.in/": [
      "#video-popup",
      "#mobile-noti-modal",
      "#netBanking",
      "#billdesk-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal"
    ],
    "https://www.rbl.bank.in/homepage": [
      "#video-popup",
      "#mobile-noti-modal",
      "#netBanking",
      "#billdesk-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/preferred-banking/insignia-banking": [
      "#mobile-noti-modal",
      "#eventModal78851",
      "#eventModal78735",
      "#eventModal78726",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/individual": [
      "#insignia-individual-popup-modal-3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#mobile-noti-modal",
      "#insignia-individual-popup-modal-1",
      "#insignia-individual-popup-modal-2",
      "#insignia-individual-popup-modal-3",
      "#insignia-individual-popup-modal-4",
      "#eventModal78851",
      "#eventModal78735",
      "#eventModal78726",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'impact-stats': impactStatsParser,
  'columns-media': columnsMediaParser,
  'product-grid': productGridParser,
  'home-blog': homeBlogParser,
  'offer-cards': offerCardsParser,
  'product-cards': productCardsParser,
  'fd-calculator': fdCalculatorParser,
  'promo-carousel': promoCarouselParser,
  'columns-location': columnsLocationParser,
  'hero-carousel': heroCarouselParser,
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
