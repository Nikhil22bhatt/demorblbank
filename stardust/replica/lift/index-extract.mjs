// index-extract.mjs — verbatim homepage data from the settled capture (stardust/current/pages/index.html)
// into stardust/replica/lift/index-data.json (slides, cards, full hrefs, image URLs). Usage: node index-extract.mjs <root>
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/app/node_modules/');
const cheerio = require('cheerio');
const root = process.argv[2] || '.';
const $ = cheerio.load(fs.readFileSync(`${root}/stardust/current/pages/index.html`, 'utf8'));
const bg = (el) => { const m = /url\(['"]?([^'")]+)/.exec($(el).attr('style') || ''); return m ? m[1] : ''; };
const notCloned = (i, el) => !$(el).hasClass('slick-cloned');
const out = {};
out.notification = $('.notification_wrapping p').first().text().trim();
// hero: outer slider → inner track slides
out.hero = $('.home-page-banner.slick-slide').filter(notCloned).map((i, s) => ({
  active: $(s).hasClass('slick-current'),
  label: ($(s).find('.banner-img-desktop').attr('aria-label') || ''),
  desktop: bg($(s).find('.banner-img-desktop')), mobile: bg($(s).find('.banner-img-mobile')),
  info: ($(s).find('.banner-info').html() || '').trim(),
})).get();
out.promo = $('#block-homebenefitsection .item.slick-slide').filter(notCloned).map((i, s) => ({
  active: $(s).hasClass('slick-current'), cls: ($(s).attr('class') || '').split(' ')[1],
  desktop: bg($(s).find('.banner-img-desktop')), mobile: bg($(s).find('.banner-img-mobile')),
  sectionStyle: $(s).find('section').attr('style') || '',
  offer: ($(s).find('.amazing-offer').html() || '').trim(),
})).get();
out.app = $('#block-homerblmobankapp .item.slick-slide').filter(notCloned).map((i, s) => ({
  active: $(s).hasClass('slick-current'), style: $(s).find('section').attr('style'),
  href: $(s).find('a').first().attr('href'), id: $(s).find('a').first().attr('id'),
  alt: $(s).find('img').first().attr('alt'),
  desktop: $(s).find('img.banner-img-desktop').attr('data-src') || $(s).find('img.banner-img-desktop').attr('src'),
  mobile: $(s).find('img.banner-img-mobile').attr('data-src') || $(s).find('img.banner-img-mobile').attr('src'),
})).get();
out.products = $('.our-products-slick .item').filter(notCloned).map((i, s) => ({
  img: $(s).find('img').attr('src') || $(s).find('img').attr('data-src'), alt: $(s).find('img').attr('alt'),
  title: $(s).find('h3').text().trim(),
  links: $(s).find('.d-flex a').map((j, a) => ({ href: $(a).attr('href'), id: $(a).attr('id'), cls: $(a).attr('class'), text: $(a).text().trim() })).get(),
})).get();
out.offers = $('.offers-deals-slick .item').filter(notCloned).map((i, s) => ({
  bg: bg($(s).find('.offer-card-wrap-bg')), tag: $(s).find('.offer-title').text().trim(),
  title: $(s).find('.p24').text().trim(), text: $(s).find('.p14').text().trim(),
  href: $(s).find('.next-arrow-btn').attr('href'), id: $(s).find('.next-arrow-btn img').attr('id'),
})).get();
out.blog = $('#data-related-blog1 .item').filter(notCloned).map((i, s) => ({
  bg: bg($(s).find('.csr-cate-card-wrap-bg')), date: $(s).find('.date').text().trim(),
  title: $(s).find('.h6 a').text().trim(), href: $(s).find('.h6 a').attr('href'), id: $(s).find('.h6 a').attr('id'),
})).get();
out.videos = $('#data-related-blog .item').filter(notCloned).map((i, s) => {
  const img = $(s).find('img.video-thumb'); const a = $(s).find('a').first();
  return { img: img.attr('src'), alt: img.attr('alt'), id: img.attr('id'), attrs: Object.assign({}, (s.attribs || {})), inner: ($(s).find('.csr-cate-card-wrap').html() || '').replace(/\s+/g, ' ').slice(0, 600) };
}).get();
out.calcButtons = $('.calc-form-table a').map((i, a) => ({ href: $(a).attr('href'), id: $(a).attr('id'), text: $(a).text().trim() })).get();
fs.writeFileSync(`${root}/stardust/replica/lift/index-data.json`, JSON.stringify(out, null, 1));
console.log(Object.entries(out).map(([k, v]) => `${k}:${Array.isArray(v) ? v.length : typeof v}`).join(' '));
