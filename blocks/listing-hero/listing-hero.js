/*
 * listing-hero — listing template image hero (replica canon business-banking.css: .listing-hero).
 * Authored rows, classified by content (never by index):
 *   media — a cell holding only a picture (the hero image, right half >= 992, top band below)
 *   text  — the h1 and its lede paragraphs (the lavender panel)
 * Decode tier: template-slotted. Authored nodes are MOVED into empty slots (EW1).
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

/* a cell's authored elements; a picture folded into a <p> is expanded (#104) */
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

export default function decorate(block) {
  if (block.querySelector(':scope > .listing-hero-media')) return;
  const media = el('div', 'listing-hero-media');
  media.setAttribute('aria-hidden', 'true');
  const container = el('div', 'container');
  const panel = el('div', 'listing-hero-panel');
  const text = el('div', 'listing-hero-text');

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      items(cell).forEach((node) => {
        const pic = node.matches('picture, img') ? node : null;
        if (pic && !media.children.length) media.append(pic);
        else text.append(node);
      });
    });
  });

  panel.append(text);
  container.append(panel);
  block.replaceChildren(media, container);
}
