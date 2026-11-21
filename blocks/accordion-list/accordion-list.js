/*
 * accordion-list — expandable FAQ / disclosure rows (base: accordion).
 * Authored rows, classified by content (never by index):
 *   heading row — one cell holding only a heading (block title, e.g. "Product Features")
 *   media row   — one cell holding only a picture (used by the image-beside option)
 *   item row    — [question] [answer]; a one-cell row with text becomes a question with no body
 * An answer cell holding only a link to a /fragments/ path is replaced by that fragment.
 * Options (block.classList): boxed, image-beside, light. Unknown tokens are ignored.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const HEADINGS = 'h1, h2, h3, h4, h5, h6';

function onlyChild(cell, selector) {
  const kids = [...cell.children];
  if (kids.length !== 1 || cell.textContent.trim() !== kids[0].textContent.trim()) return null;
  const kid = kids[0];
  if (kid.matches(selector)) return kid;
  const inner = kid.querySelector(selector);
  return inner && kid.textContent.trim() === inner.textContent.trim() ? kid : null;
}

function isMediaCell(cell) {
  return cell.querySelector('picture, img') && !cell.textContent.trim();
}

function fragmentPath(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return null;
  try {
    const url = new URL(links[0].getAttribute('href'), window.location.href);
    if (url.origin === window.location.origin && url.pathname.includes('/fragments/')) {
      return url.pathname;
    }
  } catch { /* not a URL */ }
  return null;
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

let uid = 0;

/** Moves a label cell's content into `target`, unwrapping a lone paragraph or heading. */
function labelContent(labelCell) {
  const kids = labelCell.children;
  if (kids.length === 1 && labelCell.textContent.trim() === kids[0].textContent.trim()
    && kids[0].matches(`p, ${HEADINGS}`)) {
    return { nodes: [...kids[0].childNodes], heading: kids[0].matches(HEADINGS) ? kids[0] : null };
  }
  return { nodes: [...labelCell.childNodes], heading: null };
}

function buildItem(labelCell, bodyCell) {
  uid += 1;
  const item = document.createElement('div');
  item.className = 'accordion-list-item';

  const { nodes, heading } = labelContent(labelCell);
  const title = document.createElement('span');
  title.className = 'accordion-list-item-title';
  title.append(...nodes);
  if (!title.textContent.trim()) return null;

  const body = document.createElement('div');
  body.className = 'accordion-list-item-body';
  body.id = `accordion-list-panel-${uid}`;
  if (bodyCell) {
    const path = fragmentPath(bodyCell);
    if (path) {
      loadFragment(path).then((fragment) => {
        if (fragment) body.replaceChildren(...fragment.childNodes);
      });
    }
    body.append(...bodyCell.childNodes);
  }
  const hasBody = !!(body.textContent.trim() || body.querySelector('picture, img, table'));

  const header = document.createElement('div');
  header.className = 'accordion-list-item-header';
  let label;
  if (hasBody) {
    label = document.createElement('button');
    label.type = 'button';
    label.id = `accordion-list-label-${uid}`;
    label.setAttribute('aria-expanded', 'false');
    label.setAttribute('aria-controls', body.id);
    const icon = document.createElement('span');
    icon.className = 'accordion-list-item-icon';
    icon.setAttribute('aria-hidden', 'true');
    label.append(title, icon);
  } else {
    label = document.createElement('div');
    label.append(title);
    item.classList.add('accordion-list-item-empty');
  }
  label.classList.add('accordion-list-item-label');

  // a heading label stays a heading around the button
  if (heading) {
    const h = document.createElement(heading.tagName);
    h.className = 'accordion-list-item-heading';
    h.append(label);
    header.append(h);
  } else {
    header.append(label);
  }
  item.append(header);

  if (hasBody) {
    body.setAttribute('role', 'region');
    body.setAttribute('aria-labelledby', label.id);
    body.hidden = true;
    item.append(body);
  }
  return item;
}

function setOpen(item, open) {
  const label = item.querySelector(':scope > .accordion-list-item-header button');
  const body = item.querySelector(':scope > .accordion-list-item-body');
  if (!label || !body) return;
  item.classList.toggle('is-open', open);
  label.setAttribute('aria-expanded', String(open));
  body.hidden = !open;
}

export default function decorate(block) {
  const header = document.createElement('div');
  header.className = 'accordion-list-header';
  const media = document.createElement('div');
  media.className = 'accordion-list-media';
  const list = document.createElement('div');
  list.className = 'accordion-list-items';

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img, table'));
    if (!cells.length) return;

    // picture-only cells feed the media column, wherever they sit
    const mediaCells = cells.filter(isMediaCell);
    const textCells = cells.filter((c) => !mediaCells.includes(c));
    mediaCells.forEach((c) => media.append(...c.childNodes));
    if (!textCells.length) return;

    if (textCells.length === 1 && onlyChild(textCells[0], HEADINGS)) {
      header.append(...textCells[0].childNodes);
      return;
    }

    const [labelCell, ...rest] = textCells;
    let bodyCell = rest[0] || null;
    // extra cells (author added a column) are folded into the body
    if (rest.length > 1) rest.slice(1).forEach((c) => bodyCell.append(...c.childNodes));
    // a heading + following content in one cell: the heading is the label
    if (!bodyCell && labelCell.children.length > 1) {
      const first = labelCell.firstElementChild;
      if (first.matches(`${HEADINGS}, p`)) {
        bodyCell = document.createElement('div');
        [...labelCell.children].slice(1).forEach((c) => bodyCell.append(c));
      }
    }
    const item = buildItem(labelCell, bodyCell);
    if (item) list.append(item);
  });

  const hasMedia = !!media.querySelector('picture, img');
  block.replaceChildren();
  if (header.childNodes.length) block.append(header);

  if (block.classList.contains('image-beside') && hasMedia) {
    const content = document.createElement('div');
    content.className = 'accordion-list-content';
    content.append(...block.childNodes, list);
    block.append(media, content);
    block.classList.add('accordion-list-has-media');
  } else {
    if (hasMedia) list.prepend(media);
    block.append(list);
  }

  // image-beside and light read with their first item open
  if (block.classList.contains('image-beside') || block.classList.contains('light')) {
    const first = list.querySelector('.accordion-list-item:not(.accordion-list-item-empty)');
    if (first) setOpen(first, true);
  }

  // one item open at a time
  list.addEventListener('click', (e) => {
    const label = e.target.closest('button.accordion-list-item-label');
    if (!label || !list.contains(label)) return;
    const item = label.closest('.accordion-list-item');
    const open = label.getAttribute('aria-expanded') !== 'true';
    if (open) list.querySelectorAll('.accordion-list-item.is-open').forEach((i) => setOpen(i, false));
    setOpen(item, open);
  });

  optimizeImages(block);
}
