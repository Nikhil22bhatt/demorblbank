import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]));
  });
}

/**
 * Profile columns: [profile card: portrait + name + role] [heading + subtitle + bio].
 * The cell holding a picture becomes the profile card; others are the bio column.
 * Single-cell rows span the full width.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    row.classList.add('columns-profile-row');
    const cells = [...row.children].filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img'));
    [...row.children].forEach((cell) => {
      if (!cells.includes(cell)) cell.remove();
    });
    if (cells.length === 1) row.classList.add('columns-profile-full');

    const cardCell = cells.find((cell) => cell.querySelector('picture, img'));
    cells.forEach((cell) => {
      if (cell === cardCell && cells.length > 1) {
        cell.classList.add('columns-profile-card');
        const pic = cell.querySelector('picture') || cell.querySelector('img');
        const holder = pic.closest('p') || pic;
        const photo = document.createElement('div');
        photo.className = 'columns-profile-photo';
        cell.prepend(photo);
        photo.append(holder);
      } else {
        cell.classList.add('columns-profile-bio');
      }
    });
  });

  optimizeImages(block);
}
