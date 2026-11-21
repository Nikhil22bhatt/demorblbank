/* eslint-disable */
/* global WebImporter */
/**
 * carousel-images parser.
 * Matched element is the Bootstrap `.carousel-indicators` strip; slides live in the
 * sibling `.carousel-inner` under the same `.carousel` parent. Slide count varies per
 * page (3-6), so rows are built from `.carousel-item`s, never from indicator buttons.
 * Block contract: one row per slide -> [picture] [optional caption text].
 */
export default function parse(element, { document }) {
  const carousel = element.closest('.carousel') || element.parentElement;
  const inner = carousel && carousel.querySelector('.carousel-inner');
  if (!inner) return;

  const items = [...inner.querySelectorAll(':scope > .carousel-item')];
  const cells = [];

  items.forEach((item) => {
    const media = [...item.querySelectorAll('picture, img')]
      .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')));
    if (!media.length) return;
    media.forEach((el) => {
      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (img && (!img.alt || img.alt.trim() === '...')) img.alt = '';
    });

    // caption: everything in the slide that is not the media itself
    const caption = [];
    const captionWrap = item.querySelector('.carousel-caption');
    if (captionWrap) {
      caption.push(...captionWrap.childNodes);
    } else {
      [...item.childNodes].forEach((node) => {
        if (media.includes(node)) return;
        if (node.nodeType === 1 && node.querySelector('picture, img')) {
          const text = node.textContent.trim();
          if (text) {
            const p = document.createElement('p');
            p.textContent = text;
            caption.push(p);
          }
          return;
        }
        if (node.textContent && node.textContent.trim()) caption.push(node);
      });
    }

    cells.push([media, caption.length ? caption : '']);
  });

  if (!cells.length) return;

  // remove slides and prev/next controls so they don't import as default content
  inner.remove();
  carousel.querySelectorAll('.carousel-control-prev, .carousel-control-next').forEach((ctrl) => {
    const wrap = ctrl.parentElement;
    ctrl.remove();
    if (wrap && wrap !== carousel && wrap.tagName === 'P' && !wrap.textContent.trim() && !wrap.children.length) {
      wrap.remove();
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-images', cells });
  element.replaceWith(block);
}
