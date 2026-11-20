/*
 * story-rail — "Money, People & Safety" blog story rail
 * (replica canon business-banking.css: .rail-section--blog, .rail, .story-card).
 * Authored rows, classified by content (never by index):
 *   head — a cell holding only a heading (the section title, EW8: moved, not rebuilt)
 *   card — [picture] [date paragraph + linked heading]
 *   cta  — a lone link paragraph (View All)
 * Decode tiers: template-slotted (head, CTA), reconstructive (cards). Authored nodes are MOVED.
 * Behaviour (live slick, infinite:false, speed 1000): prev/next move the track one slide; prev
 * starts disabled, next disables at the end; below 768 the viewport scrolls natively.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
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

const isMedia = (n) => n.matches('picture, img');
const isHeading = (n) => /^H[1-6]$/.test(n.tagName);

function arrow(dir, label) {
  const btn = el('button', `rail-arrow rail-arrow-${dir}`, { type: 'button', 'aria-label': label });
  const span = el('span', 'rail-arrow-btn');
  span.append(el('i', `fa fa-angle-${dir === 'prev' ? 'left' : 'right'}`, { 'aria-hidden': 'true' }));
  btn.append(span);
  return btn;
}

function buildCard(nodes) {
  const li = el('li', 'rail-slide');
  const card = el('article', 'story-card');
  const bg = el('div', 'story-card-bg');
  const inner = el('div', 'story-card-inner');
  const date = el('div', 'story-card-date');
  const title = el('div', 'story-card-title');
  nodes.forEach((n) => {
    if (isMedia(n) && !bg.children.length) bg.append(n);
    else if (isHeading(n)) title.append(n);
    else date.append(n);
  });
  inner.append(date, title);
  card.append(bg, inner);
  li.append(card);
  return li;
}

function bindRail(rail, track, prev, next) {
  let index = 0;
  const per = () => parseFloat(getComputedStyle(rail).getPropertyValue('--per')) || 1;
  const maxIndex = () => Math.max(0, Math.ceil(track.children.length - per()));
  const render = () => {
    const slide = track.children[0];
    const step = slide
      ? slide.getBoundingClientRect().width + parseFloat(getComputedStyle(slide).marginRight)
      : 0;
    if (index > maxIndex()) index = maxIndex();
    track.style.transform = index ? `translate3d(${-index * step}px, 0, 0)` : '';
    prev.disabled = index === 0;
    next.disabled = index >= maxIndex();
    const none = maxIndex() === 0;
    prev.hidden = none;
    next.hidden = none;
  };
  prev.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      render();
    }
  });
  next.addEventListener('click', () => {
    if (index < maxIndex()) {
      index += 1;
      render();
    }
  });
  window.addEventListener('resize', render);
  render();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const container = el('div', 'container');
  const head = el('div', 'rail-head');
  const rail = el('div', 'rail');
  const viewport = el('div', 'rail-viewport');
  const track = el('ul', 'rail-track');
  const cta = el('div', 'rail-cta');
  const prev = arrow('prev', 'Previous');
  const next = arrow('next', 'Next');

  [...block.children].forEach((row) => {
    const nodes = [...row.children].flatMap(items);
    if (nodes.some(isMedia)) track.append(buildCard(nodes));
    else if (nodes.length && nodes.every(isHeading)) nodes.forEach((n) => head.append(n));
    else nodes.forEach((n) => cta.append(n));
  });

  viewport.append(track);
  rail.append(prev, viewport, next);
  container.append(head, rail);
  if (cta.children.length) container.append(cta);
  block.replaceChildren(container);
  bindRail(rail, track, prev, next);
}
