/* eslint-disable */
/* global WebImporter */
// app-band: two rows per the authoring contract
//   media row — band media (source /rbl-my*bank-demo pages carry a YouTube video, not
//               a band picture, so the video is authored as a link)
//   copy row  — heading, store badges (linked images), QR code with caption
export default function parse(element, { document }) {
  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();

  // Standard app band (section.rbl-myapp-section > .rbl-myapp-card): full-bleed band picture +
  // mobile phone picture, then heading, tagline and linked store badges.
  const card = element.querySelector('.rbl-myapp-card');
  if (card) {
    const media = [];
    const desk = element.querySelector(':scope > img.banner-img-desktop, img.banner-img-desktop');
    const mob = card.querySelector('img.banner-img-mobile');
    if (desk) media.push([desk]);
    if (mob) media.push([mob]);
    const copy = [];
    const h = card.querySelector('h1, h2, h3');
    if (h && clean(h.textContent)) {
      const h2 = document.createElement('h2');
      h2.textContent = clean(h.textContent);
      copy.push(h2);
    }
    const tagline = card.querySelector('.banner-para p, .banner-para');
    if (tagline && clean(tagline.textContent)) {
      const p = document.createElement('p');
      p.textContent = clean(tagline.textContent);
      copy.push(p);
    }
    const badges = [...card.querySelectorAll('.apps-download a[href], a[href*="play.google"], a[href*="apps.apple"]')]
      .filter((a, i, all) => a.querySelector('img') && all.indexOf(a) === i);
    if (badges.length) {
      const p = document.createElement('p');
      badges.forEach((a, i) => {
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.append(a.querySelector('img'));
        if (i) p.append(' ');
        p.append(link);
      });
      copy.push(p);
    }
    const rows = [];
    if (media.length) rows.push(media.map((m) => m));
    rows.push([copy]);
    element.replaceWith(WebImporter.Blocks.createBlock(document, { name: 'app-band', cells: rows }));
    return;
  }

  const mediaCol = element.querySelector(':scope > .col-md-8') || element;
  const copyCol = element.querySelector(':scope > .col-md-4') || element;

  // media row
  const mediaCell = [];
  mediaCol.querySelectorAll('picture, img').forEach((img) => {
    if (copyCol !== element && copyCol.contains(img)) return;
    mediaCell.push(img);
  });
  mediaCol.querySelectorAll('iframe[src]').forEach((frame) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    // drop player runtime params (enablejsapi/origin) added by the live page
    const src = frame.getAttribute('src').replace(/[&?](enablejsapi|origin)=[^&]*/g, '');
    a.href = src;
    a.textContent = clean(frame.getAttribute('title')) || src;
    p.append(a);
    mediaCell.push(p);
  });

  // copy row
  const copyCell = [];
  const title = copyCol.querySelector(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4');
  if (title && clean(title.textContent)) {
    const h = document.createElement('h2');
    h.textContent = clean(title.textContent);
    copyCell.push(h);
  }

  const badgeLinks = [...copyCol.querySelectorAll('.flex-app-wrap a[href]')].filter((a) => a.querySelector('img'));
  if (badgeLinks.length) {
    const p = document.createElement('p');
    badgeLinks.forEach((a, i) => {
      const href = a.getAttribute('href');
      const src = a.querySelector('img');
      const link = document.createElement('a');
      link.href = href;
      const img = document.createElement('img');
      img.src = src.getAttribute('src') || src.getAttribute('ng-src');
      let alt = src.getAttribute('alt') || '';
      if (!alt) {
        if (/play\.google/i.test(href)) alt = 'Get it on Google Play';
        else if (/apple\.com/i.test(href)) alt = 'Download on the App Store';
      }
      img.alt = alt;
      link.append(img);
      if (i) p.append(document.createTextNode(' '));
      p.append(link);
    });
    copyCell.push(p);
  }

  copyCol.querySelectorAll('.qr-code-block').forEach((qr) => {
    const p = document.createElement('p');
    const src = qr.querySelector('img');
    const caption = clean(qr.querySelector('p')?.textContent || '');
    if (src) {
      const img = document.createElement('img');
      img.src = src.getAttribute('src') || src.getAttribute('ng-src');
      img.alt = src.getAttribute('alt') || caption || 'QR code';
      p.append(img);
    }
    if (caption) {
      if (p.childNodes.length) p.append(document.createElement('br'));
      p.append(document.createTextNode(caption));
    }
    if (p.childNodes.length) copyCell.push(p);
  });

  const cells = [];
  if (mediaCell.length) cells.push([mediaCell]);
  cells.push([copyCell]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'app-band', cells });
  element.replaceWith(block);
}
