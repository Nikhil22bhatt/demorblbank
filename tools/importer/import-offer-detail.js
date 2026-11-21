/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import offerCodeParser from './parsers/offer-code.js';
import calloutParser from './parsers/callout.js';
import cardsHighlightsParser from './parsers/cards-highlights.js';
import videoInlineParser from './parsers/video-inline.js';
import aboutBannerParser from './parsers/about-banner.js';
import anchorNavParser from './parsers/anchor-nav.js';
import accordionListParser from './parsers/accordion-list.js';
import columnsMediaParser from './parsers/columns-media.js';
import tableDataParser from './parsers/table-data.js';
import productCardsParser from './parsers/product-cards.js';
import homeBlogParser from './parsers/home-blog.js';
import columnsLocationParser from './parsers/columns-location.js';
import impactStatsParser from './parsers/impact-stats.js';
import cardsDocumentLinksParser from './parsers/cards-document-links.js';
import ratesParser from './parsers/rates.js';
import rblCleanupTransformer from './transformers/rbl-cleanup.js';
import rblSectionsTransformer from './transformers/rbl-sections.js';

const PAGE_TEMPLATE = {
  "name": "offer-detail",
  "urls": [
    "https://www.rbl.bank.in/about-us/board-of-directors",
    "https://www.rbl.bank.in/offers-and-promotions/abhibus",
    "https://www.rbl.bank.in/offers-and-promotions/add-on-card",
    "https://www.rbl.bank.in/offers-and-promotions/akbar-travels",
    "https://www.rbl.bank.in/offers-and-promotions/apply-spend-to-earn-amazon-vouchers-on-your-enterprise-debit-card",
    "https://www.rbl.bank.in/offers-and-promotions/attractive-offers-with-rbl-bank-credit-cards",
    "https://www.rbl.bank.in/offers-and-promotions/bills2pay",
    "https://www.rbl.bank.in/offers-and-promotions/blinkit",
    "https://www.rbl.bank.in/offers-and-promotions/blinkit-100",
    "https://www.rbl.bank.in/offers-and-promotions/blinkit-750",
    "https://www.rbl.bank.in/offers-and-promotions/bosch",
    "https://www.rbl.bank.in/offers-and-promotions/caratlane",
    "https://www.rbl.bank.in/offers-and-promotions/croma",
    "https://www.rbl.bank.in/offers-and-promotions/dial-for-cash",
    "https://www.rbl.bank.in/offers-and-promotions/district",
    "https://www.rbl.bank.in/offers-and-promotions/easemytrip",
    "https://www.rbl.bank.in/offers-and-promotions/eazydiner",
    "https://www.rbl.bank.in/offers-and-promotions/exclusive-festive-offer-existing-visa-enterprise-debit-cardholders-amazon-shopping-vouchers",
    "https://www.rbl.bank.in/offers-and-promotions/godrej-interio",
    "https://www.rbl.bank.in/offers-and-promotions/haier",
    "https://www.rbl.bank.in/offers-and-promotions/hp",
    "https://www.rbl.bank.in/offers-and-promotions/ifb",
    "https://www.rbl.bank.in/offers-and-promotions/ixigo-domestic-flights-hotels-emi",
    "https://www.rbl.bank.in/offers-and-promotions/ixigo-international-flights-hotels-emi",
    "https://www.rbl.bank.in/offers-and-promotions/lenovo",
    "https://www.rbl.bank.in/offers-and-promotions/lg",
    "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblemi",
    "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblintemi15",
    "https://www.rbl.bank.in/offers-and-promotions/merchant-emi-options-at-our-participating-merchant-outlets",
    "https://www.rbl.bank.in/offers-and-promotions/netmeds-visa",
    "https://www.rbl.bank.in/offers-and-promotions/ospree",
    "https://www.rbl.bank.in/offers-and-promotions/paytm-domestic-flights",
    "https://www.rbl.bank.in/offers-and-promotions/paytm-int-flights",
    "https://www.rbl.bank.in/offers-and-promotions/pepperfry",
    "https://www.rbl.bank.in/offers-and-promotions/redbus",
    "https://www.rbl.bank.in/offers-and-promotions/samsung",
    "https://www.rbl.bank.in/offers-and-promotions/split-n-pay",
    "https://www.rbl.bank.in/offers-and-promotions/split-n-pay-plus",
    "https://www.rbl.bank.in/offers-and-promotions/stay-healthy-stay-protected",
    "https://www.rbl.bank.in/offers-and-promotions/vijay-sales",
    "https://www.rbl.bank.in/offers-and-promotions/wakefit",
    "https://www.rbl.bank.in/offers-and-promotions/whirlpool",
    "https://www.rbl.bank.in/offers-and-promotions/xpress-cash",
    "https://www.rbl.bank.in/offers-and-promotions/yatra-fullswipe",
    "https://www.rbl.bank.in/offers-and-promotions/zepto",
    "https://www.rbl.bank.in/offers-and-promotions/zepto-hs",
    "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account",
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/lumiere-credit-card",
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/nova-credit-card",
    "https://www.rbl.bank.in/personal-banking/loans",
    "https://www.rbl.bank.in/personal-banking/term-deposits",
    "https://www.rbl.bank.in/personal-banking/term-deposits/digital-fixed-deposit",
    "https://www.rbl.bank.in/personal-banking/wealth-management/3-in-1-account",
    "https://www.rbl.bank.in/personal-banking/wealth-management/alternate-investment-products",
    "https://www.rbl.bank.in/personal-banking/wealth-management/e-asba",
    "https://www.rbl.bank.in/personal-banking/wealth-management/invest-first",
    "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund",
    "https://www.rbl.bank.in/personal-banking/wealth-management/national-pension-system",
    "https://www.rbl.bank.in/personal-banking/wealth-management/sovereign-gold-bonds",
    "https://www.rbl.bank.in/personal-banking/wealth-management/systematic-investment-plan",
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/business",
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-accounts",
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-deposits",
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-money-transfer",
    "https://www.rbl.bank.in/preferred-banking/insignia/individual/investment-services_old",
    "https://www.rbl.bank.in/rbl-bank-welcomes-grandmaster-d-gukesh"
  ],
  "description": "Breadcrumb page with split-background hero banner, callouts and offer code box",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "nav#block-rbl-bank-breadcrumbs"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/about-us/board-of-directors": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/abhibus": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/add-on-card": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/akbar-travels": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/apply-spend-to-earn-amazon-vouchers-on-your-enterprise-debit-card": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/attractive-offers-with-rbl-bank-credit-cards": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/bills2pay": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/blinkit": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/blinkit-100": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/blinkit-750": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/bosch": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/caratlane": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/croma": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/dial-for-cash": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/district": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/easemytrip": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/eazydiner": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/exclusive-festive-offer-existing-visa-enterprise-debit-cardholders-amazon-shopping-vouchers": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/godrej-interio": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/haier": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/hp": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ifb": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ixigo-domestic-flights-hotels-emi": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ixigo-international-flights-hotels-emi": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/lenovo": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/lg": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblemi": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblintemi15": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/merchant-emi-options-at-our-participating-merchant-outlets": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/netmeds-visa": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ospree": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/paytm-domestic-flights": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/paytm-int-flights": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/pepperfry": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/redbus": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/samsung": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/split-n-pay": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/split-n-pay-plus": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/stay-healthy-stay-protected": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/vijay-sales": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/wakefit": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/whirlpool": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/xpress-cash": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/yatra-fullswipe": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/zepto": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/zepto-hs": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/personal-banking/loans": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits/digital-fixed-deposit": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/3-in-1-account": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/alternate-investment-products": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/e-asba": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/invest-first": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/national-pension-system": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/sovereign-gold-bonds": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/systematic-investment-plan": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/business": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-accounts": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-deposits": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-money-transfer": [
          "#block-rbl-bank-breadcrumbs"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia/individual/investment-services_old": [
          "#block-rbl-bank-breadcrumbs",
          "#data-section2 > div.tab-wrap-outer-height"
        ],
        "https://www.rbl.bank.in/rbl-bank-welcomes-grandmaster-d-gukesh": [
          "#block-rbl-bank-breadcrumbs"
        ]
      }
    },
    {
      "name": "offer-code",
      "instances": [
        "div.offer-banner-info > div.coupon-code-flex"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/offers-and-promotions/abhibus": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/blinkit": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/blinkit-100": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/blinkit-750": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/easemytrip": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ixigo-domestic-flights-hotels-emi": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ixigo-international-flights-hotels-emi": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblemi": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblintemi15": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/netmeds-visa": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/paytm-domestic-flights": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/paytm-int-flights": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/redbus": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/yatra-fullswipe": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/zepto": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/zepto-hs": [
          "#data-section1 > div.container > div > div > div > div > div.coupon-code-flex"
        ]
      }
    },
    {
      "name": "callout",
      "instances": [
        "div.offer-banner-info > p.offer-tag"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/offers-and-promotions/abhibus": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/add-on-card": [
          "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div.general-text.terms-conditions"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/blinkit": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/blinkit-100": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/blinkit-750": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/easemytrip": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ixigo-domestic-flights-hotels-emi": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ixigo-international-flights-hotels-emi": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblemi": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblintemi15": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/netmeds-visa": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/paytm-domestic-flights": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/paytm-int-flights": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/redbus": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/yatra-fullswipe": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/zepto": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/zepto-hs": [
          "#data-section1 > div.container > div > div > div > div > p"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/lumiere-credit-card": [
          "#block-rbl-bank-content > div > article > section:nth-of-type(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/nova-credit-card": [
          "#data-section2"
        ],
        "https://www.rbl.bank.in/personal-banking/loans": [
          "#data-mobank-app > div > div > div > div > div.clearfix.text-formatted.field.field--name-field-rbl-mobank-app.field--type-text-long.field--label-hidden.field__item.a3 > div > div.banner-para.p20"
        ]
      }
    },
    {
      "name": "cards-highlights",
      "instances": [
        "div.p20.mb15.icon-strip-wrap"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account": [
          "#data-section1 > div.container > div > div > div > div > div > div.p20.mb15.icon-strip-wrap"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-accounts": [
          "#data-section1 > div.container > div > div > div > div > div > div.p20.mb15.icon-strip-wrap"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-deposits": [
          "#data-section1 > div.container > div > div > div > div > div > div.p20.mb15.icon-strip-wrap"
        ]
      }
    },
    {
      "name": "video-inline",
      "instances": [
        "div.mb-video"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account": [
          "#data-section1 > div.banner-img.banner-img-wrap.aos-init.aos-animate"
        ],
        "https://www.rbl.bank.in/rbl-bank-welcomes-grandmaster-d-gukesh": [
          "#block-rbl-bank-content > div > article > section > div > div > div > div > div > div.mb-video"
        ]
      }
    },
    {
      "name": "about-banner",
      "instances": [
        "section.common-section.banner-section"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/about-us/board-of-directors": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/add-on-card": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/akbar-travels": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/apply-spend-to-earn-amazon-vouchers-on-your-enterprise-debit-card": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/attractive-offers-with-rbl-bank-credit-cards": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/bills2pay": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/bosch": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/caratlane": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/croma": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/dial-for-cash": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/district": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/eazydiner": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/exclusive-festive-offer-existing-visa-enterprise-debit-cardholders-amazon-shopping-vouchers": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/godrej-interio": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/haier": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/hp": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ifb": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/lenovo": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/lg": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/merchant-emi-options-at-our-participating-merchant-outlets": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/ospree": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/pepperfry": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/samsung": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/split-n-pay": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/split-n-pay-plus": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/stay-healthy-stay-protected": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/vijay-sales": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/wakefit": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/whirlpool": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/offers-and-promotions/xpress-cash": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/lumiere-credit-card": [
          "#block-rbl-bank-content > div > article > section:nth-of-type(1)"
        ],
        "https://www.rbl.bank.in/personal-banking/loans": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits/digital-fixed-deposit": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/3-in-1-account": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/alternate-investment-products": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/e-asba": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/invest-first": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/national-pension-system": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/sovereign-gold-bonds": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/systematic-investment-plan": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/business": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-money-transfer": [
          "#data-section1"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia/individual/investment-services_old": [
          "#data-section1"
        ]
      }
    },
    {
      "name": "anchor-nav",
      "instances": [
        "section.common-section.tab-section"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/about-us/board-of-directors": [
          "#block-rbl-bank-content > div > article > section:nth-of-type(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account": [
          "#data-section2"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits/digital-fixed-deposit": [
          "#data-section2"
        ]
      }
    },
    {
      "name": "accordion-list",
      "instances": [
        "div.faq-rbl-inner"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/offers-and-promotions/add-on-card": [
          "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(4) > div > div > div > div > div > div > div:nth-of-type(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits": [
          "#main > section > div > div > div > div > div"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
          "#content > section.additional-ck-editor > div > div > div.faq-rbl-inner.mf-accordian"
        ]
      }
    },
    {
      "name": "columns-media",
      "instances": [
        "div.mybank > div.row"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/offers-and-promotions/attractive-offers-with-rbl-bank-credit-cards": [
          "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > div"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/lumiere-credit-card": [
          "#block-rbl-bank-content > div > article > section:nth-of-type(3)",
          "#data-section3"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/3-in-1-account": [
          "#data-section2 > div.container"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/alternate-investment-products": [
          "#nav-structured-products > div > div > div > div:nth-child(1)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/e-asba": [
          "#data-section2 > div.container"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/invest-first": [
          "#nav-features-and-benefits > div > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
          "#nav-lets-define-mutual-funds > div > div > div > div:nth-child(1)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/national-pension-system": [
          "#nav-national-pension-system > div > div > div > div"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/sovereign-gold-bonds": [
          "#nav-key-benefits > div > div > div > div"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/systematic-investment-plan": [
          "#data-section2 > div.container"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/business": [
          "#nav-privileges > div > div > div > div:nth-child(3)",
          "#nav-privileges > div > div > div > div:nth-child(6)",
          "#nav-privileges > div > div > div > div:nth-child(7)"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "div.table-responsive.i-rate-outer-card-top-table",
        "div.price-tbl-wrap.table-responsive"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/offers-and-promotions/exclusive-festive-offer-existing-visa-enterprise-debit-cardholders-amazon-shopping-vouchers": [
          "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > div"
        ],
        "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account": [
          "#extra-info-section > div > div > div > div > div.table-responsive.i-rate-outer-card-top-table"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
          "#content > section:nth-of-type(2) > div > div > div:nth-of-type(1) > div"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-accounts": [
          "#extra-info-section > div > div > div > div > div.table-responsive.i-rate-outer-card-top-table"
        ]
      }
    },
    {
      "name": "product-cards",
      "instances": [
        "section.related-blog-section div.row > div.col-md-12:not(.col-9)"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account": [
          "#data-section6 > div > div > div.col-md-12.aos-init.aos-animate"
        ],
        "https://www.rbl.bank.in/personal-banking/loans": [
          "#data-section2"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits": [
          "#data-section2"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits/digital-fixed-deposit": [
          "#data-section6 > div > div > div.col-md-12.aos-init.aos-animate"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/alternate-investment-products": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/e-asba": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/invest-first": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/national-pension-system": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/sovereign-gold-bonds": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/systematic-investment-plan": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-accounts": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-deposits": [
          "#data-section6 > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-money-transfer": [
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
        "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/loans": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits/digital-fixed-deposit": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/3-in-1-account": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/alternate-investment-products": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/e-asba": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/invest-first": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/national-pension-system": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/sovereign-gold-bonds": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/systematic-investment-plan": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/business": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-accounts": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-deposits": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-money-transfer": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia/individual/investment-services_old": [
          "#data-related-blog1 > div > div > div > div > div.related-blog-slick.mb30.slick-initialized.slick-slider"
        ]
      }
    },
    {
      "name": "columns-location",
      "instances": [
        "#data-related-blog div.related-blog-slick",
        "div.rbl-myapp-right > div.apps-download",
        "div.feature-sec3"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/loans": [
          "#data-mobank-app > div > div > div > div > div.clearfix.text-formatted.field.field--name-field-rbl-mobank-app.field--type-text-long.field--label-hidden.field__item.a3 > div > div.apps-download",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits/digital-fixed-deposit": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/3-in-1-account": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/alternate-investment-products": [
          "#nav-structured-products > div > div > div > div:nth-child(2)",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/e-asba": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/invest-first": [
          "#nav-features-and-benefits > div > div > div > div.row.text-center.mt30",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
          "#nav-lets-define-mutual-funds > div > div > div > div:nth-child(3)",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/national-pension-system": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/sovereign-gold-bonds": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/systematic-investment-plan": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/business": [
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-accounts": [
          "#nav-why-us > div > div > div > div.feature-sec3.aos-init.aos-animate",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-deposits": [
          "#nav-why-us > div > div > div > div.feature-sec3.aos-init.aos-animate",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-money-transfer": [
          "#nav-why-us > div > div > div > div.feature-sec3.aos-init.aos-animate",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia/individual/investment-services_old": [
          "#nav-our-investment-philosophy > div > div > div > div:nth-child(14)",
          "#data-section2 > div > div > div > div > div.card-body > div > div.d-flex",
          "#data-related-blog > div > div > div > div > div.related-blog-slick.slick-initialized.slick-slider"
        ]
      }
    },
    {
      "name": "impact-stats",
      "instances": [
        "div.block-content-basic[id^=\"block-importantlinks\"]"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/lumiere-credit-card": [
          "#block-importantlinkslumere"
        ],
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/nova-credit-card": [
          "#block-rbl-bank-content > div > div.careerLP > div.careerLP > div.careerLP > div.careerLP",
          "#block-importantlinksnova"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits/digital-fixed-deposit": [
          "#block-rbl-bank-content > div > article > section:nth-of-type(3)"
        ]
      }
    },
    {
      "name": "cards-document-links",
      "instances": [
        "#data-section-rm-premium-banker"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/nova-credit-card": [
          "#block-rbl-bank-content > div > div:nth-of-type(1)",
          "#block-rbl-bank-content > div > div:nth-of-type(2) > div:nth-of-type(2)",
          "#block-rbl-bank-content > div > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2)",
          "#block-rbl-bank-content > div > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/loans": [
          "#data-quick-link > div > div > div > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/term-deposits": [
          "#content > section:nth-of-type(3) > div > div > div > div > div > div:nth-of-type(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/3-in-1-account": [
          "#data-quick-link > div > div > div > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/alternate-investment-products": [
          "#data-quick-link > div > div > div > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/e-asba": [
          "#data-quick-link > div > div > div > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/invest-first": [
          "#data-quick-link > div > div > div > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
          "#data-quick-link > div > div > div > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/national-pension-system": [
          "#data-quick-link > div > div > div > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/sovereign-gold-bonds": [
          "#data-quick-link > div > div > div > div > div > div:nth-child(2)"
        ],
        "https://www.rbl.bank.in/personal-banking/wealth-management/systematic-investment-plan": [
          "#data-quick-link > div > div > div > div > div > div:nth-child(2)"
        ]
      }
    },
    {
      "name": "rates",
      "instances": [
        "#data-section-whyChoose",
        "div.feature-card2-upd"
      ],
      "pageInstances": {
        "https://www.rbl.bank.in/personal-banking/cards/credit-cards/nova-credit-card": [
          "#block-rbl-bank-content > div > div:nth-of-type(2) > div:nth-of-type(1)",
          "#block-rbl-bank-content > div > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1)",
          "#block-rbl-bank-content > div > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(1)"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-accounts": [
          "#nav-why-us > div > div > div > div.feature-card2-upd"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-deposits": [
          "#nav-why-us > div > div > div > div.feature-card2-upd"
        ],
        "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-money-transfer": [
          "#nav-why-us > div > div > div > div.feature-card2-upd"
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
        "offer-code",
        "callout",
        "cards-highlights",
        "video-inline",
        "about-banner",
        "anchor-nav",
        "accordion-list",
        "columns-media",
        "table-data",
        "product-cards",
        "home-blog",
        "columns-location",
        "impact-stats",
        "cards-document-links",
        "rates"
      ],
      "defaultContent": [
        "#data-section1 > div.banner-img.banner-img-wrap",
        "#data-section1 > div.container > div > div > div > div > h1",
        "#data-section1 > div.container > div > div > div > div > div.sub-title",
        "#data-section1 > div.container > div > div > div > div > div.offer-date",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(1) > div > div > div > div > div > div > div:nth-of-type(1)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(1) > div > div > div > div > div > div > div:nth-of-type(2)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div > div > div > div:nth-of-type(1)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div > div > div > div:nth-of-type(2) > div",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div > div > div > div:nth-of-type(2) > p:nth-of-type(2)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(3) > div > div > div > div > div > div > div:nth-of-type(1)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div:nth-child(2)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div:nth-child(4)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(4) > div > div > div > div > div > div > div:nth-of-type(1)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > p.p18.mb15",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > p.p18.mb10",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > p",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div > div > div > div:nth-of-type(2)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(3) > div > div > div > div > div > div > div:nth-of-type(2)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(4) > div > div > div > div > div > div > div:nth-of-type(2)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(5) > div > div > div > div > div > div > div:nth-of-type(1)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(5) > div > div > div > div > div > div > div:nth-of-type(2)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(6) > div > div > div > div > div > div > div:nth-of-type(1)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(6) > div > div > div > div > div > div > div:nth-of-type(2)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(7) > div > div > div > div > div > div > div:nth-of-type(1)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(7) > div > div > div > div > div > div > div:nth-of-type(2)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(8) > div > div > div > div > div > div > div:nth-of-type(1)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(8) > div > div > div > div > div > div > div:nth-of-type(2) > div > ul",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > p:nth-child(3)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > p:nth-child(4)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > p:nth-child(5)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > p:nth-child(1)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div > div > div > div:nth-of-type(2) > div > p:nth-of-type(2)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > p.p18.mt20.mb20",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(4) > div > div > div > div > div > div > div:nth-of-type(2) > div:nth-of-type(1)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div.general-text.terms-conditions.mt20",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(3) > div > div > div > div > div > div > div:nth-of-type(2) > div > ul",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(4) > div > div > div > div > div > div > div:nth-of-type(2) > div > h1",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(4) > div > div > div > div > div > div > div:nth-of-type(2) > div > h5:nth-of-type(1)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(4) > div > div > div > div > div > div > div:nth-of-type(2) > div > ul:nth-of-type(1)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > h5:nth-child(5)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > ul:nth-child(6)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > p:nth-child(8)",
        "#nav-tabContent > div > div > div > div.clearfix.text-formatted.field.field--name-field-body.field--type-text-long.field--label-hidden.field__item.a3 > div > ul:nth-child(12)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div:nth-of-type(7) > div > div > div > div > div > div > div:nth-of-type(2) > div > ul",
        "#data-section1 > div.container > div > div > div > div > div > h1",
        "#data-section1 > div.container > div > div > div > div > div > div.term-text",
        "#extra-info-section > div > div > div > div > h2",
        "#extra-info-section > div > div > div > div > div.mt30 > p:nth-child(1)",
        "#extra-info-section > div > div > div > div > div.mt30 > p:nth-child(3)",
        "#extra-info-section > div > div > div > div > div.mt30 > ul",
        "#extra-info-section > div > div > div > div > div.mt30 > p.p14.text-level1.mt20.mb20",
        "#data-section6 > div > div > div.col-md-12.col-9",
        "#data-related-blog1 > div > div > div > div > h2",
        "#data-related-blog1 > div > div > div > div > div.text-center",
        "#data-related-blog > div > div > div > div > p",
        "#data-related-blog > div > div > div > div > div.text-center.mb30.button",
        "#block-rbl-bank-content > div > article > section:nth-of-type(4)",
        "#block-rbl-bank-content > div > article > div.views-element-container > div > div",
        "#data-section6",
        "#data-quick-link > div > div > div > div > div > div:nth-child(1)",
        "#data-mobank-app > img",
        "#data-mobank-app > div > div > div > div > div.clearfix.text-formatted.field.field--name-field-rbl-mobank-app.field--type-text-long.field--label-hidden.field__item.a3 > div > h2",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div > div > div:nth-of-type(1)",
        "#block-rbl-bank-content > div > article > section:nth-of-type(2) > div > div > div > div > div > div:nth-of-type(2)",
        "#content > section:nth-of-type(2) > div > div > div > div > h2",
        "#content > section:nth-of-type(2) > div > div > div > div > div",
        "#content > section:nth-of-type(3) > div > div > div > div > div > div:nth-of-type(1)",
        "#main > section > div > div > div > div > h2",
        "#content > section.additional-ck-editor",
        "#nav-structured-products > div > div > div > p",
        "#content > div.block-content-basic.block.block-block-content.block-block-content49b3d116-3724-4fbd-b6bc-9aa73730be6d",
        "#nav-features-and-benefits > div > div > div > h2",
        "#nav-lets-define-mutual-funds > div > div > div > h2",
        "#content > section.additional-ck-editor > div > div > div.mb20 > p:nth-child(1)",
        "#content > section.additional-ck-editor > div > div > div.mb20 > p:nth-child(2)",
        "#content > section.additional-ck-editor > div > div > div.mb20 > p:nth-child(3)",
        "#content > section.additional-ck-editor > div > div > div.mb20 > p.p18.text-level2.mb10",
        "#content > section.additional-ck-editor > div > div > div.mb20 > p.p18.text-level2.mt10.mb20",
        "#nav-national-pension-system > div > div > div > h2",
        "#nav-national-pension-system > div > div > div > p",
        "#nav-key-benefits > div > div > div > p",
        "#nav-privileges > div > div > div > h2.mb20",
        "#nav-privileges > div > div > div > h2.common-section-heading.right-border-h2.mt40",
        "#nav-privileges > div > div > div > p.p18.text-level2",
        "#nav-privileges > div > div > div > p:nth-child(8)",
        "#nav-privileges > div > div > div > p:nth-child(9)",
        "#data-section1 > div.banner-img.banner-img-wrap.aos-init.aos-animate",
        "#data-section1 > div.container > div > div > div > div > div > div:nth-child(2)",
        "#data-section2 > div.tab-wrap-outer-height",
        "#nav-why-us > div > div > div > h2",
        "#nav-why-us > div > div > div > p.p18.text-level2.mb20",
        "#nav-why-us > div > div > div > p.p15.text-level2.mt20.mb20",
        "#nav-why-us > div > div > div > p:nth-child(5)",
        "#nav-why-us > div > div > div > p:nth-child(6)",
        "#nav-our-investment-philosophy > div > div > div > h2",
        "#nav-our-investment-philosophy > div > div > div > p:nth-child(2)",
        "#nav-our-investment-philosophy > div > div > div > div:nth-child(3)",
        "#nav-our-investment-philosophy > div > div > div > p:nth-child(4)",
        "#nav-our-investment-philosophy > div > div > div > p:nth-child(5)",
        "#nav-our-investment-philosophy > div > div > div > p:nth-child(6)",
        "#nav-our-investment-philosophy > div > div > div > p:nth-child(7)",
        "#nav-our-investment-philosophy > div > div > div > div:nth-child(8)",
        "#nav-our-investment-philosophy > div > div > div > h3",
        "#nav-our-investment-philosophy > div > div > div > p:nth-child(12)",
        "#nav-our-investment-philosophy > div > div > div > p:nth-child(13)",
        "#nav-our-investment-philosophy > div > div > div > p.text-align-center.p18.text-level2.mt20.mb20",
        "#block-rbl-bank-content > div > article > section.additional-ck-editor",
        "#data-section2 > div > div > div > div > div.scale-img-wrap",
        "#data-section2 > div > div > div > div > div.card-body > div > div.card-flex-wrap-col-top",
        "#block-rbl-bank-content > div > article > section > div > div > div > div > div > img.desk",
        "#block-rbl-bank-content > div > article > section > div > div > div > div > div > div.content",
        "#block-rbl-bank-content > div > article > section.common-section.offer-details-main-section",
        "#data-section1 > div.container > div > div > div > div > div > p",
        "#extra-info-section > div > div > div > div > div.mt30 > div",
        "#data-section1",
        "#nav-privileges > div > div > div > div:nth-child(2)",
        "#nav-our-investment-philosophy > div > div > div > div:nth-child(16)"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.rbl.bank.in/about-us/board-of-directors": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/abhibus": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/add-on-card": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/akbar-travels": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/apply-spend-to-earn-amazon-vouchers-on-your-enterprise-debit-card": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/attractive-offers-with-rbl-bank-credit-cards": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/bills2pay": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/blinkit": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/blinkit-100": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/blinkit-750": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/bosch": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/caratlane": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/croma": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/dial-for-cash": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/district": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/easemytrip": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/eazydiner": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/exclusive-festive-offer-existing-visa-enterprise-debit-cardholders-amazon-shopping-vouchers": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/godrej-interio": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/haier": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/hp": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/ifb": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/ixigo-domestic-flights-hotels-emi": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/ixigo-international-flights-hotels-emi": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/lenovo": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/lg": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblemi": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/makemytrip-mmtrblintemi15": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/merchant-emi-options-at-our-participating-merchant-outlets": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/netmeds-visa": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/ospree": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/paytm-domestic-flights": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/paytm-int-flights": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/pepperfry": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/redbus": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/samsung": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/split-n-pay": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/split-n-pay-plus": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/stay-healthy-stay-protected": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/vijay-sales": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/wakefit": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/whirlpool": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/xpress-cash": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/yatra-fullswipe": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/zepto": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/offers-and-promotions/zepto-hs": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/personal-banking/accounts/savings-accounts/woman-first-savings-account": [
      "#video-popup",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "#product_selector_options",
      "#compare_modal",
      "#compare_modal_mobile",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/lumiere-credit-card": [
      "section.header.header-shadow",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/personal-banking/cards/credit-cards/nova-credit-card": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/personal-banking/loans": [
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
    "https://www.rbl.bank.in/personal-banking/term-deposits": [
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#modal-products",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/personal-banking/term-deposits/digital-fixed-deposit": [
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
    "https://www.rbl.bank.in/personal-banking/wealth-management/3-in-1-account": [
      "#video-popup",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "div.col-md-2.popupblock",
      "div.col-md-5.popupblock",
      "#axis > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-birla > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-bnp > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-dhfl > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-dsp > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-franklin > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-hdfc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-icici > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-idfc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-iifl > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-indiabulls > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-kotak > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-lic > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-lnt > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-mirae > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-rel > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-sbi > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-sundaram > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-tata > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "h5.modal-title.investment-popup-title",
      "#mobile-noti-modal",
      "#investment-popup-modal",
      "#axis",
      "#investment-popup-modal-attention-birla",
      "#investment-popup-modal-attention-bnp",
      "#investment-popup-modal-attention-dhfl",
      "#investment-popup-modal-attention-dsp",
      "#investment-popup-modal-attention-franklin",
      "#investment-popup-modal-attention-hdfc",
      "#investment-popup-modal-attention-icici",
      "#investment-popup-modal-attention-idfc",
      "#investment-popup-modal-attention-iifl",
      "#investment-popup-modal-attention-indiabulls",
      "#investment-popup-modal-attention-kotak",
      "#investment-popup-modal-attention-lic",
      "#investment-popup-modal-attention-lnt",
      "#investment-popup-modal-attention-mirae",
      "#investment-popup-modal-attention-rel",
      "#investment-popup-modal-attention-sbi",
      "#investment-popup-modal-attention-sundaram",
      "#investment-popup-modal-attention-tata",
      "#investment-popup-modal-attention_uti",
      "#attention-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/personal-banking/wealth-management/alternate-investment-products": [
      "#product-menu-side-banner-desktop-12",
      "#product-menu-side-banner-desktop-13",
      "#product-menu-side-banner-desktop-14",
      "#product-menu-side-banner-desktop-15",
      "#video-popup",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "div.col-md-2.popupblock",
      "div.col-md-5.popupblock",
      "#mobile-noti-modal",
      "#investment-popup-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/personal-banking/wealth-management/e-asba": [
      "#product-menu-side-banner-desktop-12",
      "#product-menu-side-banner-desktop-13",
      "#product-menu-side-banner-desktop-14",
      "#product-menu-side-banner-desktop-15",
      "#video-popup",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "div.col-md-2.popupblock",
      "div.col-md-5.popupblock",
      "#axis > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-birla > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-bnp > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-dhfl > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-dsp > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-franklin > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-hdfc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-icici > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-idfc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-iifl > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-indiabulls > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-kotak > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-lic > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-lnt > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-mirae > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-rel > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-sbi > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-sundaram > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-tata > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "h5.modal-title.investment-popup-title",
      "#mobile-noti-modal",
      "#investment-popup-modal",
      "#axis",
      "#investment-popup-modal-attention-birla",
      "#investment-popup-modal-attention-bnp",
      "#investment-popup-modal-attention-dhfl",
      "#investment-popup-modal-attention-dsp",
      "#investment-popup-modal-attention-franklin",
      "#investment-popup-modal-attention-hdfc",
      "#investment-popup-modal-attention-icici",
      "#investment-popup-modal-attention-idfc",
      "#investment-popup-modal-attention-iifl",
      "#investment-popup-modal-attention-indiabulls",
      "#investment-popup-modal-attention-kotak",
      "#investment-popup-modal-attention-lic",
      "#investment-popup-modal-attention-lnt",
      "#investment-popup-modal-attention-mirae",
      "#investment-popup-modal-attention-rel",
      "#investment-popup-modal-attention-sbi",
      "#investment-popup-modal-attention-sundaram",
      "#investment-popup-modal-attention-tata",
      "#investment-popup-modal-attention_uti",
      "#attention-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/personal-banking/wealth-management/invest-first": [
      "#product-menu-side-banner-desktop-8",
      "#product-menu-side-banner-desktop-13",
      "#product-menu-side-banner-desktop-14",
      "#product-menu-side-banner-desktop-15",
      "#video-popup",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "div.col-md-2.popupblock",
      "div.col-md-5.popupblock",
      "#mobile-noti-modal",
      "#investment-popup-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/personal-banking/wealth-management/mutual-fund": [
      "#product-menu-side-banner-desktop-8",
      "#product-menu-side-banner-desktop-13",
      "#product-menu-side-banner-desktop-14",
      "#product-menu-side-banner-desktop-15",
      "#video-popup",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "div.col-md-2.popupblock",
      "div.col-md-5.popupblock",
      "#axis > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-birla > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-bnp > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-dhfl > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-dsp > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-franklin > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-hdfc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-icici > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-idfc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-iifl > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-indiabulls > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-kotak > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-lic > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-lnt > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-mirae > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-rel > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-sbi > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-sundaram > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "#investment-popup-modal-attention-tata > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h5:nth-child(1)",
      "h5.modal-title.investment-popup-title",
      "#mobile-noti-modal",
      "#investment-popup-modal",
      "#axis",
      "#investment-popup-modal-attention-birla",
      "#investment-popup-modal-attention-bnp",
      "#investment-popup-modal-attention-dhfl",
      "#investment-popup-modal-attention-dsp",
      "#investment-popup-modal-attention-franklin",
      "#investment-popup-modal-attention-hdfc",
      "#investment-popup-modal-attention-icici",
      "#investment-popup-modal-attention-idfc",
      "#investment-popup-modal-attention-iifl",
      "#investment-popup-modal-attention-indiabulls",
      "#investment-popup-modal-attention-kotak",
      "#investment-popup-modal-attention-lic",
      "#investment-popup-modal-attention-lnt",
      "#investment-popup-modal-attention-mirae",
      "#investment-popup-modal-attention-rel",
      "#investment-popup-modal-attention-sbi",
      "#investment-popup-modal-attention-sundaram",
      "#investment-popup-modal-attention-tata",
      "#investment-popup-modal-attention_uti",
      "#attention-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/personal-banking/wealth-management/national-pension-system": [
      "#product-menu-side-banner-desktop-8",
      "#product-menu-side-banner-desktop-16",
      "#product-menu-side-banner-desktop-17",
      "#product-menu-side-banner-desktop-18",
      "#video-popup",
      "#investment-popup-modal-nps > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal-nps > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal-nps > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal-nps > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "div.col-md-3.popupblock",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "div.col-md-2.popupblock",
      "div.col-md-5.popupblock",
      "#mobile-noti-modal",
      "#investment-popup-modal-nps",
      "#investment-popup-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice"
    ],
    "https://www.rbl.bank.in/personal-banking/wealth-management/sovereign-gold-bonds": [
      "#product-menu-side-banner-desktop-11",
      "#product-menu-side-banner-desktop-12",
      "#product-menu-side-banner-desktop-13",
      "#product-menu-side-banner-desktop-14",
      "#video-popup",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/personal-banking/wealth-management/systematic-investment-plan": [
      "#product-menu-side-banner-desktop-8",
      "#sip1-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#sip2-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#sip3-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#sip4-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#sip5-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#product-menu-side-banner-desktop-14",
      "#product-menu-side-banner-desktop-15",
      "#product-menu-side-banner-desktop-16",
      "#video-popup",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "#investment-popup-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)",
      "div.col-md-2.popupblock",
      "div.col-md-5.popupblock",
      "#mobile-noti-modal",
      "#sip1-popup-modal",
      "#sip2-popup-modal",
      "#sip3-popup-modal",
      "#sip4-popup-modal",
      "#sip5-popup-modal",
      "#investment-popup-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/business": [
      "#video-popup",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-accounts": [
      "#video-popup",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-deposits": [
      "#video-popup",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/preferred-banking/insignia-banking/nri-banking/nri-money-transfer": [
      "#video-popup",
      "#mobile-noti-modal",
      "#attention-modal-rbi",
      "#modal-login",
      "#modal-makepayment",
      "#attention-link-modal",
      "#g-search-modal",
      "#cookieNotice",
      "div.chat-wrap2.chatbot-above-sticky"
    ],
    "https://www.rbl.bank.in/preferred-banking/insignia/individual/investment-services_old": [
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
    "https://www.rbl.bank.in/rbl-bank-welcomes-grandmaster-d-gukesh": [
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
  'offer-code': offerCodeParser,
  'callout': calloutParser,
  'cards-highlights': cardsHighlightsParser,
  'video-inline': videoInlineParser,
  'about-banner': aboutBannerParser,
  'anchor-nav': anchorNavParser,
  'accordion-list': accordionListParser,
  'columns-media': columnsMediaParser,
  'table-data': tableDataParser,
  'product-cards': productCardsParser,
  'home-blog': homeBlogParser,
  'columns-location': columnsLocationParser,
  'impact-stats': impactStatsParser,
  'cards-document-links': cardsDocumentLinksParser,
  'rates': ratesParser,
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
