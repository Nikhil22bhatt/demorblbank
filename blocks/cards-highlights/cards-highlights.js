import { createOptimizedPicture } from '../../scripts/aem.js';

const B = 'cards-highlights';

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

export default function decorate(block) {
  const ul = document.createElement('ul');
  let title = null;

  [...block.children].forEach((row, rowIndex) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    if (!cells.length) return;

    // optional first row: a single text-only cell holding a heading is the block title
    if (rowIndex === 0 && cells.length === 1 && !cells[0].querySelector('picture, img')
      && cells[0].querySelector('h1, h2, h3, h4, h5, h6')) {
      [title] = cells;
      title.className = `${B}-title`;
      return;
    }

    const li = document.createElement('li');
    li.className = `${B}-item`;
    let icon = null;
    let body = null;
    cells.forEach((cell) => {
      if (!icon && isImageOnly(cell)) {
        icon = cell;
      } else if (!body) {
        body = cell;
      } else {
        body.append(...cell.childNodes);
      }
    });
    // icon authored inline with the text
    if (!icon && body) {
      const pic = body.querySelector('picture') || body.querySelector('img');
      if (pic) {
        icon = document.createElement('div');
        const p = pic.closest('p');
        icon.append(p && !p.textContent.trim() ? p : pic);
      }
    }
    if (icon) {
      icon.className = `${B}-item-icon`;
      li.append(icon);
    }
    if (body) {
      body.className = `${B}-item-text`;
      // bare text label: wrap as p > span like the source icon strip
      if (!body.children.length && body.textContent.trim()) {
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.append(...body.childNodes);
        p.append(span);
        body.append(p);
      } else {
        body.querySelectorAll(':scope > p').forEach((p) => {
          if (p.children.length || !p.textContent.trim()) return;
          const span = document.createElement('span');
          span.append(...p.childNodes);
          p.append(span);
        });
      }
      li.append(body);
    }
    ul.append(li);
  });

  optimizePictures(block);
  block.replaceChildren(...(title ? [title, ul] : [ul]));
}
