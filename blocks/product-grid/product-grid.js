/*
 * product-grid — listing template intro + product card grid
 * (replica canon business-banking.css: .listing-products, .product-grid, .product-card).
 * Authored rows, classified by content (never by index):
 *   intro — a cell of paragraphs with no picture and no heading
 *   card  — [picture] [heading + copy paragraphs + CTA paragraph (a lone link)]
 * Decode tiers: template-slotted (intro), reconstructive (cards). Authored nodes are MOVED (EW1).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/* a cell whose lone <p> the pipeline unwrapped (bare text / inline link): the loose nodes are
   MOVED into one <p> (the paragraph the author wrote), never rebuilt from text */
const INLINE = /^(A|STRONG|EM|SPAN|CODE|DEL|U|SUB|SUP|BR)$/;
function blockify(cell) {
  const loose = [...cell.childNodes].some((n) => (n.nodeType === 3 && n.textContent.trim())
    || (n.nodeType === 1 && INLINE.test(n.tagName)));
  if (!loose) return;
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  cell.append(p);
}

function items(cell) {
  blockify(cell);
  const out = [];
  [...cell.children].forEach((child) => {
    if (child.tagName === 'P' && child.querySelector(':scope > picture, :scope > img')
      && !child.textContent.trim()) {
      out.push(...child.children);
    } else out.push(child);
  });
  return out;
}

const isMedia = (n) => n.matches('picture, img');
const isHeading = (n) => /^H[1-6]$/.test(n.tagName);
const isCta = (n) => {
  const a = n.querySelector('a[href]');
  return n.tagName === 'P' && a && !n.querySelector('picture, img')
    && n.textContent.trim() === a.textContent.trim();
};

function buildCard(nodes) {
  const li = el('li', 'product-grid-item');
  const card = el('article', 'product-card');
  const media = el('div', 'product-card-img');
  const body = el('div', 'product-card-body');
  const top = el('div', 'product-card-top');
  const title = el('div', 'product-card-title');
  const copy = el('div', 'product-card-copy');
  const actions = el('div', 'product-card-actions');
  nodes.forEach((n) => {
    if (isMedia(n) && !media.children.length) media.append(n);
    else if (isHeading(n) && !title.children.length) title.append(n);
    else if (isCta(n)) actions.append(n);
    else copy.append(n);
  });
  const name = title.textContent.trim();
  actions.querySelectorAll('a[href]').forEach((a) => {
    if (name) a.setAttribute('aria-label', `${a.textContent.trim()} for ${name}`);
  });
  top.append(title, copy);
  body.append(top, actions);
  if (media.children.length) card.append(media);
  card.append(body);
  li.append(card);
  return li;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const container = el('div', 'container');
  const intro = el('div', 'product-grid-intro');
  const list = el('ul', 'product-grid-list');

  [...block.children].forEach((row) => {
    const nodes = [...row.children].flatMap(items);
    const card = nodes.some(isMedia) || nodes.some(isHeading);
    if (card) list.append(buildCard(nodes));
    else nodes.forEach((n) => intro.append(n));
  });

  if (intro.children.length) container.append(intro);
  container.append(list);
  block.replaceChildren(container);
}
