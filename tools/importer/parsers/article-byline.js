/* eslint-disable */
/* global WebImporter */
// article-byline: one row — author photo | author name | publish date (+ any extra
// byline text such as reading time). Share buttons are UI (the block regenerates
// share intents for the current page), so they are not authored.
export default function parse(element, { document }) {
  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();

  // author photo
  const photoCell = [];
  const img = element.querySelector('.auth-img img');
  if (img) {
    const src = img.getAttribute('src') || img.getAttribute('data-src');
    if (src) {
      const pic = document.createElement('img');
      pic.src = src;
      const nameForAlt = clean(element.querySelector('.auth-name .name')?.textContent);
      pic.alt = img.getAttribute('alt') || nameForAlt || '';
      photoCell.push(pic);
    }
  }

  // author name (keep a profile link if the source has one)
  const nameCell = [];
  const nameEl = element.querySelector('.auth-name .name');
  if (nameEl) {
    const text = clean(nameEl.textContent);
    if (text) {
      const p = document.createElement('p');
      const link = nameEl.querySelector('a[href]') || nameEl.closest('a[href]');
      if (link && !/^javascript:/i.test(link.getAttribute('href'))) {
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = text;
        p.append(a);
      } else {
        p.textContent = text;
      }
      nameCell.push(p);
    }
  }

  // publish date + any other byline text (reading time, etc.) in .auth-name
  const dateCell = [];
  const dateEl = element.querySelector('.auth-name .blog-date');
  if (dateEl && clean(dateEl.textContent)) {
    const p = document.createElement('p');
    p.textContent = clean(dateEl.textContent);
    dateCell.push(p);
  }
  const authName = element.querySelector('.auth-name');
  if (authName) {
    [...authName.children]
      .filter((c) => c !== nameEl && c !== dateEl && clean(c.textContent))
      .forEach((c) => {
        const p = document.createElement('p');
        p.textContent = clean(c.textContent);
        dateCell.push(p);
      });
  }

  // share networks: source hrefs are javascript: handlers bound to the old URL, so
  // author plain network links; the block turns them into share intents for the page.
  const NETWORK_URLS = {
    facebook: 'https://www.facebook.com/',
    twitter: 'https://twitter.com/',
    linkedin: 'https://www.linkedin.com/',
    whatsapp: 'https://www.whatsapp.com/',
  };
  const shareCell = [];
  element.querySelectorAll('.social-share a[class*="social-link-"]').forEach((a) => {
    const key = Object.keys(NETWORK_URLS).find((k) => a.classList.contains(`social-link-${k}`));
    if (!key) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = NETWORK_URLS[key];
    link.textContent = clean(a.textContent) || a.getAttribute('title') || key;
    p.append(link);
    shareCell.push(p);
  });

  const row = [photoCell, nameCell, dateCell];
  if (shareCell.length) row.push(shareCell);
  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'article-byline', cells });
  element.replaceWith(block);
}
