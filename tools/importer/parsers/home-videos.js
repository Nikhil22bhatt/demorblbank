/* eslint-disable */
/* global WebImporter */
/**
 * home-videos parser.
 * Source: section#data-related-blog —
 *   p.common-section-heading (title), .related-blog-slick .item img.video-thumb
 *   (alt = video title, data-video = YouTube embed URL), a#hp-video-watch-all (CTA).
 * Block contract (blocks/home-videos, see content/index.plain.html):
 *   title row; card rows [thumbnail picture] [title p + YouTube embed link p]; CTA row.
 */

// The rail's YouTube embeds are injected by site JS; some captures drop data-video.
// Fall back to the site-wide video ids (same rail on every page, keyed by img id).
const VIDEO_FALLBACK = {
  'hp-video-1': 'https://www.youtube.com/embed/2XGgxeKXOAU?si=Noh20xgIlRzBihz_&autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1',
  'hp-video-2': 'https://www.youtube.com/embed/HdMYmrBVKBM?si=ZJg6wi1BVGIvUjBO&autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1',
  'hp-video-3': 'https://www.youtube.com/embed/aGpwDa9Z4aY?si=QsAfOcDC0ZrlvvGU&autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1',
  'hp-video-4': 'https://www.youtube.com/embed/tMUvCjXiqCo?si=m1AZ1ddbp1nUPNae&autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1',
};

export default function parse(element, { document }) {
  const cells = [];

  const heading = element.querySelector('.common-section-heading, h1, h2, h3');
  if (heading && heading.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = heading.textContent.trim();
    cells.push([[p]]);
  }

  const items = element.querySelectorAll('.related-blog-slick .item:not(.slick-cloned)');
  items.forEach((item) => {
    const img = item.querySelector('img.video-thumb, img');
    if (!img || !img.getAttribute('src')) return;
    const title = (img.getAttribute('alt') || img.getAttribute('title') || '').trim();

    const thumb = document.createElement('img');
    thumb.src = img.getAttribute('src');
    thumb.alt = title;

    const body = [];
    if (title) {
      const p = document.createElement('p');
      p.textContent = title;
      body.push(p);
    }
    const video = img.getAttribute('data-video') || VIDEO_FALLBACK[img.id];
    if (video) {
      const a = document.createElement('a');
      a.href = video;
      a.textContent = 'Play video';
      const p = document.createElement('p');
      p.append(a);
      body.push(p);
    }
    cells.push([thumb, body]);
  });

  const cta = element.querySelector('#hp-video-watch-all, .button a[href]');
  if (cta && cta.textContent.trim()) {
    const a = document.createElement('a');
    a.href = cta.getAttribute('href');
    a.textContent = cta.textContent.trim();
    const strong = document.createElement('strong');
    strong.append(a);
    const p = document.createElement('p');
    p.append(strong);
    cells.push([[p]]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'home-videos', cells });
  element.replaceWith(block);
}
