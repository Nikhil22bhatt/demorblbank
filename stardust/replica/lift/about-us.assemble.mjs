// Assemble stardust/prototypes/about-us-proposed.html from the shared chrome partials (unchanged),
// the page's breadcrumb + main fragment and the awards snapshot (settled default state, year 2026
// checked — dynamic-features row 5: static snapshot of the Drupal view).
// Usage: node about-us.assemble.mjs <projectRoot>
import fs from 'fs';
const root = process.argv[2] || process.cwd();
const L = `${root}/stardust/replica/lift`;
const P = `${root}/stardust/prototypes`;
const data = JSON.parse(fs.readFileSync(`${L}/about-us-awards.json`, 'utf8'));
const yearItems = (list, name, active) => [`                <li class="au-years__item au-years__item--any"><label><input type="radio" name="${name}" value="All"${active ? '' : ' checked'}><span>- Any -</span></label></li>`].concat(list.map(y => `                <li class="au-years__item${y === active ? ' is-active' : ''}"><label><input type="radio" name="${name}" value="${y}"${y === active ? ' checked' : ''}><span>${y}</span></label></li>`)).join('\n');
const years = yearItems(data.years, 'award-year', data.active);
const advYears = yearItems(data.advYears, 'adv-year', null);
const awards = data.awards.map(a => `            <div class="col-sm-6 col-lg-4 col-xl-3 au-award">
              <div class="au-award__card">
                <img src="assets/about-us/${a.img}" width="520" height="275" alt="avatar" loading="lazy">
                <div class="au-award__body"><p class="au-award__title">${a.t}</p><p class="au-award__desc">${a.d}</p></div>
              </div>
            </div>`).join('\n');
const main = fs.readFileSync(`${L}/about-us.main.html`, 'utf8').replace('ADV_YEAR_ITEMS', advYears).replace('YEAR_ITEMS', years).replace('AWARD_ITEMS', awards);
const part = f => fs.readFileSync(f, 'utf8');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>About Us | RBL Bank</title>
<meta name="description" content="RBL Bank is one of India’s fastest growing private sector banks with an expanding presence across the country through a growing network of branches and ATMs.">
<link rel="icon" href="shared/images/favicon.ico">
<link rel="preload" href="shared/fonts/roboto-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="shared/canon.css">
<link rel="stylesheet" href="about-us.css">
<script src="shared/chrome.js" defer></script>
<script src="about-us.js" defer></script>
</head>
<body class="page-about-us">
${part(`${P}/shared/header.html`)}${part(`${L}/about-us.breadcrumb.html`)}${main}${part(`${P}/shared/footer.html`)}</body>
</html>
`;
fs.writeFileSync(`${P}/about-us-proposed.html`, html);
console.log('wrote about-us-proposed.html', html.length);
