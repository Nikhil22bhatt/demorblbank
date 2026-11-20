/**
 * home-videos — the homepage "Trust & Beyond" video rail (replica canon index.css .videos,
 * live slick: infinite false, no arrows; thumbnails open the video in a popup).
 * Authored rows, classified by content:
 *   title — a lone heading or paragraph row (first); CTA — a lone formatted-link row
 *   card  — [thumbnail picture] [title paragraph + video link paragraph (YouTube embed URL)]
 *   the card is the popup trigger: the link's href is read, the inner anchor unwrapped; the
 *   title and link paragraphs are kept as its accessible name (visually hidden, as live —
 *   EW6-style; no <button> hosts authored text).
 * Decode tier: reconstructive (repeat group). Authored nodes are MOVED (EW1).
 * @ew-exempt popup close label (UI glue, aria only)
 */
const GAP = 27;

/* a cell's authored elements; bare inline content (a lone <p> the pipeline unwrapped) is
   gathered into one <p> — the nodes are moved, never rebuilt */
function items(cell) {
  const out = [];
  let p = null;
  [...cell.childNodes].forEach((n) => {
    const isBlock = n.nodeType === 1
      && /^(P|H[1-6]|UL|OL|DIV|PICTURE|PRE|BLOCKQUOTE|TABLE)$/.test(n.tagName);
    if (isBlock) {
      p = null;
      out.push(n);
      return;
    }
    if (n.nodeType !== 1 && n.nodeType !== 3) return;
    if (n.nodeType === 3 && !n.textContent.trim() && !p) return;
    if (!p) {
      p = document.createElement('p');
      out.push(p);
    }
    p.append(n);
  });
  return out;
}

/* the runtime's formatted-link buttons (strong = primary, em = secondary) for a CTA <p>
   whose wrapper paragraph the pipeline unwrapped (decorateButtons only sees `p a`) */
function buttonize(p) {
  const a = p.querySelector('a[href]');
  if (!a || a.classList.contains('button') || p.textContent.trim() !== a.textContent.trim()) return;
  const mark = a.closest('strong, em');
  if (!mark || !p.contains(mark)) return;
  const kind = mark.tagName === 'STRONG' ? 'primary' : 'secondary';
  p.className = 'button-wrapper';
  a.className = `button ${kind}`;
  const outer = p.querySelector(':scope > strong, :scope > em') || mark;
  outer.replaceWith(a);
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/* rows: a lone heading (or lone paragraph) first = section title; a lone CTA = section CTA */
function split(block) {
  const rows = [...block.children];
  const isCta = (r) => r.children.length === 1 && r.querySelector('strong a, em a, a.button')
    && !r.querySelector('picture, img, h1, h2, h3, h4, h5, h6');
  const head = rows[0] && rows[0].children.length === 1 && !rows[0].querySelector('picture, img')
    && !isCta(rows[0]) ? rows[0] : null;
  const cta = rows.filter((r) => r !== head && isCta(r));
  const cards = rows.filter((r) => r !== head && !cta.includes(r));
  return { head, cards, cta };
}

/* slick-model card rail: infinite false, one card per step, prev/next with disabled states */
function rail(block, cardEls, { label, nav }) {
  const wrap = el('div', 'rail', { 'aria-roledescription': 'carousel', 'aria-label': label });
  const viewport = el('div', 'rail-viewport');
  const track = el('ul', 'rail-track');
  cardEls.forEach((card) => {
    const li = el('li', 'rail-item');
    li.append(card);
    track.append(li);
  });
  viewport.append(track);
  let prev;
  let next;
  if (nav) {
    const bar = el('div', 'rail-nav');
    prev = el('button', 'rail-btn rail-btn-prev', { type: 'button', 'aria-label': 'Previous' });
    prev.append(el('i', 'fa fa-angle-left', { 'aria-hidden': 'true' }));
    next = el('button', 'rail-btn rail-btn-next', { type: 'button', 'aria-label': 'Next' });
    next.append(el('i', 'fa fa-angle-right', { 'aria-hidden': 'true' }));
    bar.append(prev, next);
    wrap.append(bar);
  }
  wrap.append(viewport);
  let pos = 0;
  const update = () => {
    const first = track.firstElementChild;
    if (!first) return;
    const step = first.getBoundingClientRect().width + GAP;
    const count = Math.max(1, Math.floor((viewport.clientWidth + GAP) / step));
    const max = Math.max(0, cardEls.length - count);
    pos = Math.min(Math.max(pos, 0), max);
    track.style.transform = `translate3d(${-pos * step}px, 0, 0)`;
    if (prev) prev.disabled = pos === 0;
    if (next) next.disabled = pos >= max;
  };
  const move = (d) => {
    pos += d;
    update();
  };
  if (prev) prev.addEventListener('click', () => move(-1));
  if (next) next.addEventListener('click', () => move(1));
  let x0 = null;
  viewport.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
  }, { passive: true });
  window.addEventListener('resize', update);
  new ResizeObserver(update).observe(viewport);
  return wrap;
}

function frame(block, head, railEl, cta) {
  const container = el('div', 'container');
  if (head) {
    const h = el('div', 'rail-head');
    [...head.children].forEach((cell) => items(cell).forEach((n) => h.append(n)));
    container.append(h);
  }
  container.append(railEl);
  let ctaBox = null;
  if (cta.length) {
    ctaBox = el('div', 'rail-cta');
    cta.forEach((r) => [...r.children].forEach((cell) => items(cell).forEach((n) => {
      buttonize(n);
      ctaBox.append(n);
    })));
    container.append(ctaBox);
  }
  block.replaceChildren(container);
  return { container, ctaBox };
}

function popup() {
  let pop = document.querySelector('.home-videos-popup');
  if (pop) return pop;
  pop = el('div', 'home-videos-popup', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Video' });
  pop.hidden = true;
  const box = el('div', 'home-videos-popup-box');
  const close = el('button', 'home-videos-popup-close', { type: 'button', 'aria-label': 'Close video' });
  close.textContent = '×';
  const frameEl = el('iframe', '', {
    title: 'Trust & Beyond video', allow: 'autoplay; encrypted-media', allowfullscreen: '',
  });
  box.append(close, frameEl);
  pop.append(box);
  const shut = () => {
    pop.hidden = true;
    frameEl.removeAttribute('src');
  };
  close.addEventListener('click', shut);
  pop.addEventListener('click', (e) => {
    if (e.target === pop) shut();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !pop.hidden) shut();
  });
  document.body.append(pop);
  return pop;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const { head, cards, cta } = split(block);
  const built = cards.map((row) => {
    const card = el('div', 'video-card');
    const trigger = el('div', 'video-card-btn', { role: 'button', tabindex: '0' });
    const label = el('span', 'visually-hidden');
    let src = '';
    [...row.children].forEach((cell) => items(cell).forEach((n) => {
      const a = n.querySelector('a[href]');
      if (a) {
        src = a.getAttribute('href');
        a.replaceWith(...a.childNodes);
        label.append(n);
      } else if (n.matches('picture') || n.querySelector('picture, img')) trigger.append(n);
      else label.append(n);
    }));
    trigger.append(label);
    const open = () => {
      if (!src) return;
      const pop = popup();
      pop.querySelector('iframe').src = src;
      pop.hidden = false;
    };
    trigger.addEventListener('click', open);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    card.append(trigger);
    return card;
  });
  const railEl = rail(block, built, { label: 'Trust & Beyond', nav: false });
  frame(block, head, railEl, cta);
}
