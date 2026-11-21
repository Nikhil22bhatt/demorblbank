import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/**
 * Dense multi-column rows (rate strips, method lists, ATM/branch location rows).
 * Each row: N cells of text/links/headings; a cell holding only a picture is an image column.
 * Small leading icons (img inside a paragraph with text) are marked so they align inline.
 * Option `alt`: list layout - rows separated by dividers, cells top-aligned (location listings).
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const maxCols = Math.max(1, ...rows.map((row) => row.children.length));
  block.classList.add(`columns-location-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-location-row');
    if (row.children.length === 1) row.classList.add('columns-location-full');
    [...row.children].forEach((cell) => {
      const hasPic = cell.querySelector('picture, img');
      if (hasPic && !cell.textContent.trim()) {
        cell.classList.add('columns-location-img-col');
      } else if (hasPic) {
        cell.classList.add('columns-location-icon-col');
      }
    });
  });

  optimizeImages(block);
}
