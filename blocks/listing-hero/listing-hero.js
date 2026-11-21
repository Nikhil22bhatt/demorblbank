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

  /* card hero (theme .banner-para-right-section): an h1 with no lede, whose highlights strip,
     CTA and terms note were authored after the block in the same section. They are MOVED into
     the panel (the live .banner-info holds them), and the panel sits right of the image.
     Only the run right after the hero is taken: a cards-highlights strip, then the leading
     paragraphs of the next default content; any heading or other block ends the hero. */
  const wrapper = block.parentElement;
  const trailing = [];
  if (!text.querySelector('p') && wrapper?.parentElement?.classList.contains('section')) {
    let next = wrapper.nextElementSibling;
    if (next?.classList.contains('cards-highlights-wrapper')) {
      trailing.push(next);
      next = next.nextElementSibling;
    }
    if (next?.classList.contains('default-content-wrapper')) {
      const lead = [];
      for (let node = next.firstElementChild; node?.tagName === 'P'; node = node.nextElementSibling) {
        lead.push(node);
      }
      trailing.push(...lead);
    }
  }
  if (trailing.some((node) => node.classList.contains('cards-highlights-wrapper'))) {
    block.classList.add('card-hero');
    const emptied = trailing.find((node) => node.tagName === 'P')?.parentElement;
    text.append(...trailing);
    if (emptied && !emptied.children.length) emptied.remove();
    let cta = null;
    [...text.children].forEach((node) => {
      if (node.tagName !== 'P') return;
      const links = node.querySelectorAll('a');
      if (!cta && links.length === 1 && node.textContent.trim() === links[0].textContent.trim()) {
        cta = node;
        node.classList.add('listing-hero-cta');
      } else if (cta && !links.length) node.classList.add('listing-hero-terms');
    });
  }

  panel.append(text);
  container.append(panel);
  block.replaceChildren(media, container);
}
