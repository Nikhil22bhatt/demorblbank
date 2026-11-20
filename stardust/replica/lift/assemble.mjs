// Assemble stardust/prototypes/contact-us-proposed.html from the shared chrome partials,
// the page's main fragment and the FAQ items (verbatim capture extract).
import fs from 'fs';
const root = process.argv[2];
const P = `${root}/stardust/prototypes`;
const faq = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const items = faq.map(f => `                    <div class="faq-card">
                      <div class="faq-card__header" id="heading${f.id}"><button class="faq-card__toggle" type="button" aria-expanded="false" aria-controls="collapse${f.id}"><span>${f.q}</span></button></div>
                      <div class="faq-card__body collapse" id="collapse${f.id}" role="region" aria-labelledby="heading${f.id}" hidden>${f.a}</div>
                    </div>`).join('\n');
const main = fs.readFileSync(`${root}/stardust/replica/lift/contact-us.main.html`, 'utf8').replace('FAQ_ITEMS', items);
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RBL Bank – Banking &amp; Credit Helpline Services | Contact Us | Customer Care</title>
<meta name="description" content="Get in touch with RBL Bank for account support, credit card service, or general banking enquiries. Find phone numbers, branch locator, and customer care options.">
<link rel="icon" href="shared/images/favicon.ico">
<link rel="preload" href="shared/fonts/roboto-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="shared/canon.css">
<link rel="stylesheet" href="contact-us.css">
<script src="shared/chrome.js" defer></script>
</head>
<body class="page-contact-us">
${fs.readFileSync(`${P}/shared/header.html`, 'utf8')}${fs.readFileSync(`${P}/shared/breadcrumb-contact-us.html`, 'utf8')}${main}${fs.readFileSync(`${P}/shared/footer.html`, 'utf8')}</body>
</html>
`;
fs.writeFileSync(`${P}/contact-us-proposed.html`, html);
console.log('wrote contact-us-proposed.html', html.length);
