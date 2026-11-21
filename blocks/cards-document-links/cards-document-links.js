import { createOptimizedPicture } from '../../scripts/aem.js';

const B = 'cards-document-links';

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function isImageOnly(cell) {
  return cell.querySelector('picture, img') && !cell.textContent.trim();
}

/**
 * Splits a single mixed cell (icon + text in one cell) into image and body parts.
 */
function splitMixedCell(cell) {
  const pic = cell.querySelector('picture') || cell.querySelector('img');
  if (!pic || isImageOnly(cell)) return null;
  const holder = pic.closest('p') && !pic.closest('p').textContent.trim() ? pic.closest('p') : pic;
  const image = document.createElement('div');
  image.append(holder);
  return image;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = `${B}-card`;
    let image = null;
    let body = null;

    cells.forEach((cell) => {
      if (isImageOnly(cell) && !image) {
        image = cell;
      } else if (!body) {
        body = cell;
      } else {
        body.append(...cell.childNodes);
      }
    });
    if (!image && body) image = splitMixedCell(body);

    if (image) {
      image.className = `${B}-card-image`;
      li.append(image);
    }
    if (body) {
      body.className = `${B}-card-body`;
      li.append(body);
    }

    // a card with one destination becomes fully clickable: the link wraps the card content
    const links = [...li.querySelectorAll('a[href]')];
    const hrefs = new Set(links.map((a) => a.href));
    if (hrefs.size === 1) {
      li.classList.add(`${B}-linked`);
      const link = links[0];
      link.classList.add(`${B}-link`);
      if (/\.pdf($|\?)/i.test(link.href)) {
        link.target = '_blank';
        link.rel = 'noopener';
      }
      // unwrap every link (keep its text), then let the one link hold the whole card
      links.forEach((a) => {
        const span = document.createElement('span');
        span.append(...a.childNodes);
        a.replaceWith(span);
      });
      // drop EDS button decoration around the former link
      li.querySelectorAll('.button-container').forEach((p) => p.classList.remove('button-container'));
      link.className = `${B}-link`;
      link.replaceChildren(...li.childNodes);
      li.append(link);
    }

    ul.append(li);
  });
  optimizePictures(ul);
  block.replaceChildren(ul);
}
