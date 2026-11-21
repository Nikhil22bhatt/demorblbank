import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/**
 * Wraps "Q:" / "A:" paragraphs (and any paragraphs that follow them until the next
 * marker) into question / answer boxes.
 * @param {Element} cell
 */
function decorateQa(cell) {
  let current = null;
  [...cell.children].forEach((el) => {
    const text = el.textContent.trim();
    const match = /^([QA])\s*[:.\-–]/i.exec(text);
    if (match) {
      current = document.createElement('div');
      current.className = match[1].toUpperCase() === 'Q'
        ? 'columns-interview-question'
        : 'columns-interview-answer';
      el.before(current);
      current.append(el);
    } else if (current && el.tagName === 'P' && !el.querySelector('picture')) {
      current.append(el);
    } else {
      current = null;
    }
  });
}

/**
 * Interview columns: [text cell: intro + Q:/A: paragraphs] [image cell].
 * Any number of rows; cells may be omitted or reordered.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const maxCols = Math.max(1, ...rows.map((row) => row.children.length));
  block.classList.add(`columns-interview-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-interview-row');
    if (row.children.length === 1) row.classList.add('columns-interview-full');
    [...row.children].forEach((cell) => {
      const pics = cell.querySelectorAll('picture');
      const onlyImage = pics.length > 0 && !cell.textContent.trim();
      if (onlyImage) {
        cell.classList.add('columns-interview-img-col');
      } else {
        cell.classList.add('columns-interview-text-col');
        decorateQa(cell);
      }
    });
  });

  optimizeImages(block);
}
