import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/** True when every bit of text in the cell is inside a link (an actions cell). */
function isLinksOnly(cell) {
  const links = [...cell.querySelectorAll('a')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s+/g, '');
  return linkText === cell.textContent.replace(/\s+/g, '');
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-branch-card';

    cells.forEach((cell, i) => {
      // first cell is the branch name (linked or not) unless it is the only cell
      if (i === 0 && cells.length > 1) {
        cell.className = 'cards-branch-card-title';
      } else if (i > 0 && isLinksOnly(cell)) {
        cell.className = 'cards-branch-card-actions';
      } else {
        cell.className = 'cards-branch-card-body';
      }
      li.append(cell);
    });

    // mark phone and email links so the design pass can add icons
    li.querySelectorAll('a[href^="tel:"]').forEach((a) => a.classList.add('cards-branch-phone'));
    li.querySelectorAll('a[href^="mailto:"]').forEach((a) => a.classList.add('cards-branch-email'));
    ul.append(li);
  });
  optimizePictures(ul);
  block.replaceChildren(ul);
}
