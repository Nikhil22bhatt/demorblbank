/*
 * app-band — RBL MyBank app band (replica canon business-banking.css: .app-band).
 * Authored rows, classified by content (never by index):
 *   media — pictures only: the first is the full-bleed band image (>= 768), the second the
 *           phone image shown below 768
 *   copy  — heading, tagline paragraph, a paragraph of linked store badges
 * Decode tier: template-slotted. Authored nodes are MOVED (EW1).
 * Behaviour: live AOS fade-up on the card (0.3s ease) once it scrolls in.
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
      && !child.textContent.trim() && !child.querySelector('a')) {
      out.push(...child.children);
    } else out.push(child);
  });
  return out;
}

function reveal(card) {
  if (!('IntersectionObserver' in window)) {
    card.classList.add('is-revealed');
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-revealed');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -120px 0px' });
  io.observe(card);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const bg = el('div', 'app-band-bg');
  const container = el('div', 'container');
  const card = el('div', 'app-band-card');
  const media = el('div', 'app-band-media');
  const copy = el('div', 'app-band-copy');
  const head = el('div', 'app-band-title');
  const tagline = el('div', 'app-band-tagline');
  const stores = el('div', 'app-band-stores');
  const pictures = [];

  [...block.children].forEach((row) => {
    [...row.children].flatMap(items).forEach((n) => {
      if (n.matches('picture, img')) pictures.push(n);
      else if (/^H[1-6]$/.test(n.tagName)) head.append(n);
      else if (n.querySelector('a picture, a img')) stores.append(n);
      else tagline.append(n);
    });
  });

  if (pictures[0]) bg.append(pictures[0]);
  pictures.slice(1).forEach((p) => media.append(p));
  copy.append(head);
  if (tagline.children.length) copy.append(tagline);
  if (stores.children.length) copy.append(stores);
  card.append(media, copy);
  container.append(card);
  block.replaceChildren(bg, container);
  reveal(card);
}
