// Assemble stardust/prototypes/business-banking-proposed.html (listing template) from the shared chrome
// partials, the page's main fragment (business-banking.main.html) and its authored rows (business-banking.data.json).
// Usage: node assemble-business-banking.mjs <project-root>
// The card grid / rails take any number of rows: a 10-card sibling (personal-banking) is data only.
import fs from 'fs';
const root = process.argv[2];
if (!root || root === '--help' || root === '-h') { console.log('Usage: node assemble-business-banking.mjs <project-root>\nWrites: stardust/prototypes/business-banking-proposed.html'); process.exit(0); }
const P = `${root}/stardust/prototypes`;
const L = `${root}/stardust/replica/lift`;
const d = JSON.parse(fs.readFileSync(`${L}/business-banking.data.json`, 'utf8'));
const A = 'assets/business-banking';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const products = d.products.map((c) => `        <li class="product-grid__item">
          <article class="product-card">
            <img class="product-card__img" src="${A}/${c.img}" alt="${esc(c.alt)}" loading="lazy">
            <div class="product-card__body">
              <div class="product-card__top">
                <h3 class="product-card__title">${esc(c.title)}</h3>
                <div class="product-card__copy"><p>${esc(c.copy)}</p></div>
              </div>
              <div class="product-card__actions"><a class="product-card__cta" href="${c.href}" aria-label="Know More for ${esc(c.title)}">Know More</a></div>
            </div>
          </article>
        </li>`).join('\n');
const blog = d.blog.map((c) => `            <li class="rail__slide">
              <article class="story-card">
                <div class="story-card__bg" role="img" aria-label="${esc(c.imgLabel)}" style="background-image: url('${A}/${c.img}')"></div>
                <div class="story-card__inner">
                  <p class="story-card__date">${c.date}</p>
                  <h3 class="story-card__title"><a href="${c.href}" aria-label="${esc(c.aria)}">${esc(c.title)}</a></h3>
                </div>
              </article>
            </li>`).join('\n');
const videos = d.videos.map((c) => `            <li class="rail__slide">
              <div class="video-card">
                <button class="video-card__play" type="button" data-video="${esc(c.video)}"><img class="video-card__thumb" src="${A}/${c.img}" alt="${esc(c.alt)}" loading="lazy"></button>
              </div>
            </li>`).join('\n');
const main = fs.readFileSync(`${L}/business-banking.main.html`, 'utf8')
  .replace('PRODUCT_CARDS', products).replace('BLOG_CARDS', blog).replace('VIDEO_CARDS', videos);
const crumb = '<div class="breadcrumb-bar"><nav aria-label="Breadcrumbs"><ol class="breadcrumb"><li><a href="/">Home</a></li><li aria-current="page">Business Banking</li></ol></nav></div>\n';
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.title)}</title>
<meta name="description" content="${esc(d.description)}">
<link rel="icon" href="shared/images/favicon.ico">
<link rel="preload" href="shared/fonts/roboto-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="shared/canon.css">
<link rel="stylesheet" href="business-banking.css">
<script src="shared/chrome.js" defer></script>
<script src="business-banking.js" defer></script>
</head>
<body class="page-business-banking page-listing">
${fs.readFileSync(`${P}/shared/header.html`, 'utf8')}${crumb}${main}${fs.readFileSync(`${P}/shared/footer.html`, 'utf8')}</body>
</html>
`;
fs.writeFileSync(`${P}/business-banking-proposed.html`, html);
console.log('wrote business-banking-proposed.html', html.length);
