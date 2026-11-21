/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import columnsMediaParser from './parsers/columns-media.js';
import impactStatsParser from './parsers/impact-stats.js';
import tableDataParser from './parsers/table-data.js';
import carouselImagesParser from './parsers/carousel-images.js';
import productGridParser from './parsers/product-grid.js';
import homeBlogParser from './parsers/home-blog.js';
import columnsLocationParser from './parsers/columns-location.js';
import rblCleanupTransformer from './transformers/rbl-cleanup.js';
import rblSectionsTransformer from './transformers/rbl-sections.js';

const PAGE_TEMPLATE = {
  "name": "program-detail",
  "urls": [
    "https://www.rbl.bank.in/chatbot",
    "https://www.rbl.bank.in/social-responsibility/education/dialysis-technician-training-school",
    "https://www.rbl.bank.in/social-responsibility/education/shiksha",
    "https://www.rbl.bank.in/social-responsibility/education/umeed",
    "https://www.rbl.bank.in/social-responsibility/health/dhanvantari",
    "https://www.rbl.bank.in/social-responsibility/health/khwaish",
    "https://www.rbl.bank.in/social-responsibility/health/sanjeevani",
    "https://www.rbl.bank.in/social-responsibility/health/vaneekaran",
    "https://www.rbl.bank.in/social-responsibility/livelihoods"
  ],
  "description": "Breadcrumb page with story rail, impact stats, product grid and image carousel",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "nav#block-rbl-bank-breadcrumbs"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/chatbot": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/dialysis-technician-training-school": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/shiksha": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/umeed": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/dhanvantari": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/khwaish": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/sanjeevani": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/vaneekaran": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/social-responsibility/livelihoods": [
          "#block-rbl-bank-breadcrumbs"
        ]
      }
    },
    {
      "name": "columns-media",
      "instances": [],
      "pageInstances": {
        "https://www.rbl.bank.in/social-responsibility/health/khwaish": [
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > section"
        ]
      }
    },
    {
      "name": "impact-stats",
      "instances": [
        "section.additional-ck-editor section.counter-section"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/social-responsibility/education/dialysis-technician-training-school": [
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > section"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/shiksha": [
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > section"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/umeed": [
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > section"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/dhanvantari": [
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > section"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/sanjeevani": [
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > section"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/vaneekaran": [
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > section"
        ],
        "https://www.rbl.bank.in/social-responsibility/livelihoods": [
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > section"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "div.price-tbl-wrap.table-responsive"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/social-responsibility/livelihoods": [
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(5)",
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(8)",
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(11)",
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(14)",
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(17)",
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(20)",
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(23)",
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(26)",
          "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(29)"
        ]
      }
    },
    {
      "name": "carousel-images",
      "instances": [],
      "pageInstances": {
        "https://www.rbl.bank.in/social-responsibility/health/dhanvantari": [
          "#carouselExampleIndicators > div.carousel-indicators"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/sanjeevani": [
          "#carouselExampleIndicators > div.carousel-indicators"
        ],
        "https://www.rbl.bank.in/social-responsibility/livelihoods": [
          "#carouselExampleIndicators > div.carousel-indicators"
        ]
      }
    },
    {
      "name": "product-grid",
      "instances": [
        "section.csr-related-section div.col-md-12:has(.our-products-slick)"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/social-responsibility/education/dialysis-technician-training-school": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/shiksha": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/umeed": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/dhanvantari": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/khwaish": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/sanjeevani": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/vaneekaran": [
          "#data-section6 > div > div > div:nth-child(2)"
        ]
      }
    },
    {
      "name": "home-blog",
      "instances": [
        "div.related-blog-slick.mb30"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/social-responsibility/education/dialysis-technician-training-school": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/shiksha": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/umeed": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/dhanvantari": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/khwaish": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/sanjeevani": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/vaneekaran": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/livelihoods": [
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
        "https://www.rbl.bank.in/social-responsibility/education/dialysis-technician-training-school": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/shiksha": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/education/umeed": [
          "#carouselExampleIndicators > div.carousel-inner",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/dhanvantari": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/khwaish": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/sanjeevani": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/health/vaneekaran": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/social-responsibility/livelihoods": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
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
        "columns-media",
        "impact-stats",
        "table-data",
        "carousel-images",
        "product-grid",
        "home-blog",
        "columns-location"
      ],
      "defaultContent": [
        "#block-rbl-bank-content > div > article > div > div > div.show-desktop.hide-mobile",
        "#data-section1",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(2)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(3)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(4)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(5)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(6)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p.csr-bold",
        "#data-section6 > div > div > div.col-md-12.col-9",
        "#data-related-blog1 > div > div > div > div > h2",
        "#data-related-blog1 > div > div > div > div > div.text-center",
        "#data-related-blog > div > div > div > div > p",
        "#data-related-blog > div > div > div > div > div.text-center.mb30.button",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(6)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(7)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > ul",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(9)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(10)",
        "#carouselExampleIndicators > p > button.carousel-control-prev",
        "#carouselExampleIndicators > p > button.carousel-control-next",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div.col-lg-6.md-order-1.lg-pt130.mt30",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div.col-lg-6.md-order-1.csr-padding",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(8)",
        "#carouselExampleIndicators > div.carousel-inner",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div.col-lg-6.md-order-1.lg-pt130",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(10)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(12)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p.mb10",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p.mb30",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > div:nth-child(5)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(2)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(3)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(6)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(9)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(12)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(13)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(15)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(16)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(18)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(19)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(21)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(22)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(24)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(25)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(27)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(28)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(30)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(31)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > h2:nth-child(32)",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor > div > div > p:nth-child(33)"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.rbl.bank.in/chatbot": [
      "div.sf-chatbot",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/social-responsibility/education/dialysis-technician-training-school": [
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
    "https://www.rbl.bank.in/social-responsibility/education/shiksha": [
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
    "https://www.rbl.bank.in/social-responsibility/education/umeed": [
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
    "https://www.rbl.bank.in/social-responsibility/health/dhanvantari": [
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
    "https://www.rbl.bank.in/social-responsibility/health/khwaish": [
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
    "https://www.rbl.bank.in/social-responsibility/health/sanjeevani": [
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
    "https://www.rbl.bank.in/social-responsibility/health/vaneekaran": [
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
    "https://www.rbl.bank.in/social-responsibility/livelihoods": [
      "#video-popup",
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
  'columns-media': columnsMediaParser,
  'impact-stats': impactStatsParser,
  'table-data': tableDataParser,
  'carousel-images': carouselImagesParser,
  'product-grid': productGridParser,
  'home-blog': homeBlogParser,
  'columns-location': columnsLocationParser,
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
