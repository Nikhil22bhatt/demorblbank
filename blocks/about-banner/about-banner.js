/*
 * about-banner — the about-us page banner (replica canon: about-us.css .au-banner).
 * Authored rows, classified by content (never by index):
 *   media — a row of picture cells: first = desktop image, second = mobile image (optional)
 *   text  — a cell holding the heading and the paragraphs
 * Decode tier: template-slotted — authored nodes are MOVED into the canon's empty slots (EW1).
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function media(node) {
  if (!node) return null;
  return node.matches('picture, img') ? node : node.querySelector('picture, img');
}

/* a cell's authored elements; a picture folded into a <p> is lifted out
   (a picture inside a link stays in its link) */
function items(cell) {
  return [...cell.children].map((child) => {
    if (child.tagName === 'P' && child.children.length === 1
      && child.firstElementChild.matches('picture, img')
      && !child.textContent.trim()) return child.firstElementChild;
    return child;
  });
}

/* a paragraph that is just one text link (bare or strong/em-wrapped): a call to action */
function isCta(node) {
  if (node.tagName !== 'P' || node.children.length !== 1) return false;
  const link = node.querySelector('a');
  const text = link?.textContent.trim();
  return Boolean(text) && !media(link) && node.textContent.trim() === text;
}

export default function decorate(block) {
  const mediaBox = el('div', 'banner-media');
  const container = el('div', 'container');
  const card = el('div', 'banner-card');
  const inner = el('div', 'banner-inner');
  const pics = [];

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const isPic = media(cell) && !cell.textContent.trim();
      if (isPic) pics.push(media(cell));
      else items(cell).forEach((node) => inner.append(node));
    });
  });

  pics.forEach((pic, i) => {
    const slot = el('div', `banner-img ${i === 0 ? 'banner-img-desktop' : 'banner-img-mobile'}`);
    slot.append(pic);
    mediaBox.append(slot);
  });
  if (pics.length === 1) mediaBox.firstElementChild.classList.add('banner-img-mobile');

  [...inner.children].filter(isCta).forEach((p) => p.classList.add('banner-cta'));

  /* a closing footnote paragraph ("*T&C Apply") sits in the card's corner */
  const last = inner.lastElementChild;
  if (last?.tagName === 'P' && last.textContent.trim().startsWith('*')) last.classList.add('banner-terms');

  card.append(inner);
  container.append(card);
  /* full-bleed reads text first, then the product image */
  if (block.classList.contains('full-bleed')) block.replaceChildren(container, mediaBox);
  else block.replaceChildren(mediaBox, container);
}
