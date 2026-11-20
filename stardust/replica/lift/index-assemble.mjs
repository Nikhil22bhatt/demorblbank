// index-assemble.mjs — assemble stardust/prototypes/index-proposed.html (replica, homepage archetype)
// from the shared chrome partials (read-only), the verbatim capture extract index-data.json
// (index-extract.mjs) and the page sections below. Usage: node index-assemble.mjs <root>
import fs from 'fs';
import { parity } from './index-parity.mjs';
const root = process.argv[2] || '.';
const P = `${root}/stardust/prototypes`;
const D = JSON.parse(fs.readFileSync(`${root}/stardust/replica/lift/index-data.json`, 'utf8'));
const A = 'assets/index/';
const img = (u) => A + u.split('?')[0].split('/').pop();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const dots = (n, active, label) => `<ul class="dots slick-dots" aria-label="${label}">${Array.from({ length: n }, (_, i) => `<li><button class="dots__dot${i === active ? ' is-active' : ''}" type="button" aria-current="${i === active}" aria-label="Slide ${i + 1}"></button></li>`).join('')}</ul>`;
const arrows = (cls) => `<button class="${cls} ${cls}--prev" type="button" aria-label="Previous slide"><i class="fa fa-angle-left" aria-hidden="true"></i></button><button class="${cls} ${cls}--next" type="button" aria-label="Next slide"><i class="fa fa-angle-right" aria-hidden="true"></i></button>`;
const slideAttrs = (i, n, active) => `role="group" aria-roledescription="slide" aria-label="${i + 1} of ${n}"${active ? '' : ' aria-hidden="true"'}`;

/* ---------- hero banner carousel (5 authored rows, slide 3 current in the capture) ---------- */
// the frozen origin reference resets the hero to slide 1 (stitch-shot's first-dot convention); promo/app keep the captured slide
const heroActive = 0;
const heroInfo = (h) => {
  const link = /<a class="banner-info-inner[^"]*" href="([^"]+)"[^>]*aria-label="([^"]+)"[^>]*><span>([^<]+)<\/span>/.exec(h.info);
  if (link) return `<a class="hero__link" href="${link[1]}" aria-label="${link[2]}"><span>${link[3]}</span></a>`;
  if (/class="tax"/.test(h.info)) {
    const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(h.info)[1];
    const h2 = /<h2[^>]*>([\s\S]*?)<\/h2>/.exec(h.info)[1];
    const a = /<a class="btn[^"]*" href="([^"]+)"[^>]*aria-label="([^"]+)">([^<]+)<\/a>/.exec(h.info);
    return `<div class="hero__card"><h1 class="hero__title">${h1}</h1><h2 class="hero__sub">${h2}</h2><a class="btn-rbl btn-rbl--blue" href="${a[1]}" aria-label="${a[2]}">${a[3]}</a></div>`;
  }
  return '';
};
const hero = `<section class="hero carousel" data-carousel data-autoplay-delivery="6000" aria-roledescription="carousel" aria-label="Featured banners">
  <div class="carousel__viewport"><div class="carousel__track" style="--i:${heroActive}">
${D.hero.map((h, i) => `    <div class="carousel__slide hero__slide${i === heroActive ? ' is-active' : ''}" ${slideAttrs(i, D.hero.length, i === heroActive)}>
      <div class="hero__img hero__img--d" role="img" aria-label="${esc(h.label)}" style="background-image:url('${img(h.desktop)}')"></div>
      <div class="hero__img hero__img--m" role="img" aria-label="${esc(h.label)}" style="background-image:url('${img(h.mobile)}')"></div>
      <div class="container">${heroInfo(h)}</div>
    </div>`).join('\n')}
  </div></div>
  ${arrows('hero__arrow')}
  ${dots(D.hero.length, heroActive, 'Choose banner')}
</section>`;

/* ---------- attractive rates (verbatim) ---------- */
const rate = (label, href, id, val, vid) => `<div class="rates__col"><div class="rates__item">
        <p class="rates__label"><a href="${href}" id="${id}">${label}</a></p>
        <h5 class="rates__value">${val}<small>%</small><sub>* p.a.</sub></h5>
        ${vid ? `<p class="rates__more"><a href="${href}" id="${vid}"><span><u>View Rates</u></span></a></p>` : ''}
      </div></div>`;
const rates = `<section class="rates" id="data-section2">
  <div class="container">
    <h2 class="section-heading section-heading--center">Attractive Rates</h2>
    <div class="rates__row">
      ${rate('Fixed Deposits', '/interest-rates?tab=fixed-deposit', 'hp-rates-fd', '7.00', 'hp-rates-fd-view-rates')}
      ${rate('Savings Account', '/interest-rates?tab=saving-account', 'hp-rates-savings', '6.00', 'hp-rates-savings-view-rates')}
      ${rate('Education Loan', '/personal-banking/loans/education-loan', 'hp-rates-edu-loan', '10.00')}
      ${rate('Housing Loan', '/personal-banking/loans/housing-loan', 'hp-rates-home-loan', '9.00')}
      <div class="rates__col rates__col--forex"><div class="rates__item">
        <p class="rates__label">Forex Rates</p>
        <h5 class="rates__value"><span>$¥€ </span><a href="https://www.rbl.bank.in/nrfxrates"><img src="${A}download-icon.svg" alt="download pdf" width="29" height="30"></a></h5>
      </div></div>
    </div>
  </div>
</section>`;

/* ---------- promo card banners (4 authored rows, slide 3 current) ---------- */
const promoActive = D.promo.findIndex((p) => p.active);
const promoOffer = (o) => o
  .replace(/ class="common-section-heading"/g, ' class="promo__title"')
  .replace(/ style="color:(?:white|#fff);"/g, '')
  .replace(/class="banner-para p20[^"]*"/g, 'class="promo__para"')
  .replace(/<span class="mr10 ml10">/g, '<span class="promo__sep">')
  .replace(/class="btn common-btn-blue[^"]*"/g, 'class="btn-rbl btn-rbl--blue"')
  .replace(/ tabindex="-1"/g, '').replace(/ target="_blank"/g, '');
const promo = `<section class="promo carousel" data-carousel data-autoplay-delivery="6000" aria-roledescription="carousel" aria-label="Credit card offers">
  <div class="carousel__viewport"><div class="carousel__track" style="--i:${promoActive}">
${D.promo.map((p, i) => `    <div class="carousel__slide promo__slide promo__slide--${p.cls === 'slick-slide' ? 'img' : p.cls}${p.active ? ' is-active' : ''}" ${slideAttrs(i, D.promo.length, p.active)}>
      <div class="promo__img promo__img--d" style="background-image:url('${img(p.desktop)}')"></div>
      <div class="promo__img promo__img--m" style="background-image:url('${img(p.mobile)}')"></div>
      <div class="container promo__container">${p.offer ? `<div class="promo__offer${/color:(white|#fff)/.test(p.offer) ? ' promo__offer--light' : ''}">${promoOffer(p.offer)}</div>` : ''}</div>
    </div>`).join('\n')}
  </div></div>
  ${arrows('hero__arrow')}
  ${dots(D.promo.length, promoActive, 'Choose card offer')}
</section>`;

/* ---------- Fixed Deposit Calculator (client-only widget; settled capture state as initial state) ---------- */
const radio = (name, id, label, checked, extra = '') => `<div class="fdc-radio${extra}"><input type="radio" name="${name}" id="${id}"${checked ? ' checked' : ''}><label for="${id}">${label}</label></div>`;
const range = (key, label, min, max, minLbl, maxLbl, val, inputVal, extraCls, rs = '') => `<div class="fdc-range ${extraCls}">
            <div class="fdc-range__head"><p class="fdc-range__label"><label for="fdc-${key}-val"><strong>${label}</strong></label>${rs}</p>
              <div class="fdc-range__input${key === 'amount' ? ' fdc-range__input--amount' : ''}">${key === 'amount' ? '<span class="fdc-range__unit">₹ </span>' : ''}<input type="text" inputmode="numeric" id="fdc-${key}-val" value="${inputVal}" data-fdc-val="${key}"></div></div>
            <input class="fdc-slider" type="range" min="${min}" max="${max}" step="1" value="${val}" data-fdc-range="${key}" aria-label="${label}">
            <div class="fdc-range__scale"><span>${minLbl}</span><span>${maxLbl}</span></div>
          </div>`;
const calc = `<section class="fdc" id="data-section4" data-fd-calculator>
  <div class="container">
    <h2 class="section-heading"><span>Fixed Deposit Calculator</span></h2>
    <div class="fdc__top">
      <div class="fdc__type">${radio('fdc-type', 'fdc-type-normal', 'Normal', true, ' fdc-radio--top')}${radio('fdc-type', 'fdc-type-tax', 'Tax saver *', false, ' fdc-radio--top')}</div>
      <div class="fdc__payout">
        <div class="fdc__payout-head"><label for="fdc-payout">Interest Payout *</label><span class="fdc__payout-rate"><span data-fdc-headline>7.00 </span><span>%* p.a.</span></span></div>
        <div class="fdc__select"><select id="fdc-payout" data-fdc-payout><option value="cumulative">Cumulative</option><option value="quarterly">Quarterly</option><option value="monthly">Monthly</option></select></div>
      </div>
    </div>
    <div class="fdc__grid">
      <div class="fdc__form">
        <p class="fdc__reset"><a href="#" data-fdc-reset><span>Reset</span></a></p>
        <div class="fdc__citizen">
          <div class="fdc__citizen-col fdc__citizen-col--1">${radio('fdc-citizen', 'fdc-cit-general', 'General', true)}</div>
          <div class="fdc__citizen-col fdc__citizen-col--2">${radio('fdc-citizen', 'fdc-cit-senior', '<span>Are you a senior citizen?</span><span>(Age 60+)</span>', false)}</div>
          <div class="fdc__citizen-col fdc__citizen-col--3">${radio('fdc-citizen', 'fdc-cit-super', '<span>Are you a super senior</span><span>citizen? (Age 80+)</span>', false)}</div>
        </div>
        ${range('amount', 'Amount ', 5000, 10000000, '<small>₹ </small>5K', '<small>₹ </small>1 Cr', 5000, '', 'fdc-range--amount', '(Rs.)')}
        <div class="fdc__tenure-label"><strong>Tenure </strong>(7 Days to 120 months)</div>
        <div class="fdc__tenure">
          ${range('years', 'Years', 0, 10, '0', '10', 0, '0', 'fdc-range--col fdc-range--rule')}
          ${range('months', 'Months', 0, 12, '0', '12', 0, '0', 'fdc-range--col fdc-range--rule')}
          ${range('days', 'Days', 0, 31, '0', '31', 7, '7', 'fdc-range--col')}
        </div>
      </div>
      <div class="fdc__result">
        <table class="fdc__table">
          <thead class="visually-hidden"><tr><th>Label</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><p class="fdc__k">Interest Amount*</p><p class="fdc__v" data-fdc-out="interest">₹</p></td><td><p class="fdc__k">Interest Rate*</p><p class="fdc__v fdc__v--rate"><span data-fdc-out="rate"></span>%* p.a.</p></td></tr>
            <tr><td><p class="fdc__k">Maturity Amount*</p><p class="fdc__v" data-fdc-out="maturity">₹</p></td><td><p class="fdc__k">Maturity Date</p><p class="fdc__v" data-fdc-out="date"></p></td></tr>
            <tr class="fdc__open"><td colspan="2"><span>To open a Fixed Deposits, click below:</span></td></tr>
            <tr class="fdc__btns">${D.calcButtons.map((b) => `<td><a class="btn-rbl btn-rbl--blue btn-rbl--sm" href="${esc(b.href)}" id="${b.id}">${b.text}</a></td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
    </div>
    <p class="fdc__terms">*Terms and conditions apply. | For detailed information, <a href="/interest-rates?tab=fixed-deposit">click here<span class="visually-hidden">for interest rates</span></a></p>
  </div>
</section>`;

/* ---------- app / service banners (5 authored rows, slide 3 current) ---------- */
const appActive = D.app.findIndex((a) => a.active);
const app = `<section class="appban carousel" data-carousel data-start-mobile="1" data-autoplay-delivery="6000" aria-roledescription="carousel" aria-label="Digital banking services">
  <div class="carousel__viewport"><div class="carousel__track" style="--i:${appActive}">
${D.app.map((a, i) => `    <div class="carousel__slide appban__slide${a.active ? ' is-active' : ''}" ${slideAttrs(i, D.app.length, a.active)} style="${a.style}">
      <a class="appban__link appban__link--d" href="${esc(a.href)}" id="${a.id}"><img src="${img(a.desktop)}" alt="${esc(a.alt)}"></a>
      <a class="appban__link appban__link--m" href="${esc(a.href)}"><img src="${img(a.mobile)}" alt="${esc(a.alt)}"></a>
    </div>`).join('\n')}
  </div></div>
  ${arrows('hero__arrow')}
  ${dots(D.app.length, appActive, 'Choose service banner')}
</section>`;

/* ---------- card rails (Our Products / Offers and Deals / Money, People & Safety / Trust & Beyond) ---------- */
const rail = (cls, label, items, withArrows) => `<div class="rail ${cls}" data-rail aria-roledescription="carousel" aria-label="${label}">
      ${withArrows ? `<div class="rail__nav"><button class="rail__btn rail__btn--prev" type="button" aria-label="Previous" disabled><i class="fa fa-angle-left" aria-hidden="true"></i></button><button class="rail__btn rail__btn--next" type="button" aria-label="Next"><i class="fa fa-angle-right" aria-hidden="true"></i></button></div>` : ''}
      <div class="rail__viewport"><ul class="rail__track">
${items.join('\n')}
      </ul></div>
    </div>`;
const products = `<section class="cards-section products" id="data-section6">
  <div class="container">
    <h2 class="section-heading">Our Products</h2>
    ${rail('rail--products', 'Our Products', D.products.map((p) => `        <li class="rail__item"><article class="product-card">
          <div class="product-card__img"><img src="${img(p.img)}" alt="${esc(p.alt)}" width="345" height="200" loading="lazy"></div>
          <div class="product-card__body"><h3>${p.title}</h3>
            <div class="product-card__ctas">${p.links.map((l, j) => `<a class="btn-rbl ${j ? 'btn-rbl--blue' : 'btn-rbl--gray'}" href="${esc(l.href)}" id="${l.id}">${l.text}</a>`).join(' ')}</div></div>
        </article></li>`), true)}
  </div>
</section>`;
const offers = `<section class="cards-section offers" id="data-section7">
  <div class="container">
    <h2 class="section-heading">Offers and Deals</h2>
    ${rail('rail--offers', 'Offers and Deals', D.offers.map((o) => `        <li class="rail__item"><div class="offer-card">
          <div class="offer-card__bg" style="background-image:url('${img(o.bg)}')"></div>
          <div class="offer-card__inner"><div class="offer-card__left"><div class="offer-card__tag">${o.tag}</div><p class="offer-card__title">${o.title}</p><p class="offer-card__text">${esc(o.text)}</p></div>
            <div class="offer-card__right"><a class="offer-card__arrow" href="${esc(o.href)}"><img src="${A}next-btn.svg" alt="next-btn" id="${o.id}" width="60" height="60"></a></div></div>
        </div></li>`), false)}
    <div class="cards-section__cta"><a class="btn-rbl btn-rbl--outline" href="/offers" id="hp-offers-explore-more">Explore More</a></div>
  </div>
</section>`;
const blog = `<section class="cards-section blog" id="data-related-blog1">
  <div class="container">
    <h2 class="section-heading">Money, People &amp; Safety</h2>
    ${rail('rail--blog', 'Money, People & Safety', D.blog.map((b) => `        <li class="rail__item"><div class="story-card">
          <div class="story-card__bg" style="background-image:url('${img(b.bg)}')"></div>
          <div class="story-card__inner"><p class="story-card__date">${b.date}</p><p class="story-card__title"><a href="${esc(b.href)}" id="${b.id}">${esc(b.title)}</a></p></div>
        </div></li>`), true)}
    <div class="cards-section__cta"><a class="btn-rbl btn-rbl--outline" href="/blog" id="hp-blog-read-more">View All</a></div>
  </div>
</section>`;
const vidSrc = (v) => (/data-video="([^"]+)"/.exec(v.inner) || [])[1] || '';
const videos = `<section class="cards-section videos" id="data-related-blog">
  <div class="container">
    <p class="h2 section-heading">Trust &amp; Beyond</p>
    ${rail('rail--videos', 'Trust & Beyond', D.videos.map((v) => `        <li class="rail__item"><div class="video-card">
          <button class="video-card__btn" type="button" data-video="${vidSrc(v)}"><img class="video-card__thumb" src="${img(v.img)}" alt="${esc(v.alt)}" id="${v.id}" width="383" height="447" loading="lazy"></button>
        </div></li>`), false)}
    <div class="cards-section__cta cards-section__cta--videos"><a class="btn-rbl btn-rbl--outline" href="/trust-and-beyond" id="hp-video-watch-all">Watch All</a></div>
  </div>
  <div class="video-popup" id="video-popup" hidden><div class="video-popup__box"><button class="video-popup__close" type="button" aria-label="Close video">×</button><iframe title="Trust &amp; Beyond video" src="" allow="autoplay; encrypted-media" allowfullscreen></iframe></div></div>
</section>`;

/* ---------- notification ticker (frontpage chrome) ---------- */
const notice = `<div class="notice" role="region" aria-label="Notification"><div class="notice__wrap"><div class="notice__text"><p>${esc(D.notification)}</p></div></div><button class="notice__close" type="button" aria-label="Close notification"></button></div>
`;

/* ---------- mobile quick links (frontpage-only .credit-carousel, shown < 768) ---------- */
const QL = [['/personal-banking/accounts/savings-accounts', 'Savings Account for Savings Accounts', 'ql-Savings_Account.svg', 'Savings Account'],
  ['/personal-banking/term-deposits', 'Term Deposits for personal banking', 'ql-Fixed_deposits.svg', 'Term Deposits'],
  ['/personal-banking/cards/credit-cards', 'Credit Cards for cards', 'ql-Credit_Cards.svg', 'Credit Cards'],
  ['/nri-banking', 'NRI Account for Nri Banking', 'ql-NRI_Account.svg', 'NRI Account'],
  ['/personal-banking/loans', 'Loans for personal banking', 'ql-Loans.svg', 'Loans'],
  ['/preferred-banking', 'Preferred Banking for www.rbl.bank.in', 'ql-preferredBanking.svg', 'Preferred Banking']];
const quick = `<nav class="quicklinks" aria-label="Quick links"><ul class="quicklinks__list">
${QL.map(([h, l, i, t]) => `  <li class="quicklinks__item"><a href="${h}" aria-label="${l}"><img src="${A}${i}" alt="${t}" width="30" height="34"> <span>${t}</span></a></li>`).join('\n')}
</ul></nav>
`;

const main = `<main class="main-content" id="content">
${hero}
${rates}
${promo}
${calc}
${fs.readFileSync(`${root}/stardust/replica/lift/index-modals.html`, 'utf8')}${app}
${products}
${offers}
${blog}
${videos}
</main>
`;
const header = fs.readFileSync(`${P}/shared/header.html`, 'utf8');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Savings &amp; Current Accounts, Loans, Credit Cards, NRI Services, Investments | RBL Bank</title>
<meta name="description" content="${esc(JSON.parse(fs.readFileSync(`${root}/stardust/current/pages/index.json`, 'utf8')).description)}">
<link rel="icon" href="shared/images/favicon.ico">
<link rel="preload" href="shared/fonts/roboto-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="shared/canon.css">
<link rel="stylesheet" href="index.css">
<script src="shared/chrome.js" defer></script>
<script src="index.js" defer></script>
</head>
<body class="page-index path-frontpage">
${header.replace('</header>', '</header>\n' + notice)}${quick}${main}${fs.readFileSync(`${P}/shared/footer.html`, 'utf8')}</body>
</html>
`;
fs.writeFileSync(`${P}/index-proposed.html`, parity(html, root));
console.log('wrote index-proposed.html', html.length);
