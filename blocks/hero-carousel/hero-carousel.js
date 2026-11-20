/**
 * hero-carousel — the homepage banner carousel (replica canon index.css .hero, live slick:
 * infinite, speed 1000, autoplay 6000, progress dots).
 * Authored rows = slides, classified by content:
 *   [desktop picture] [mobile picture] [optional copy cell]
 *   copy cell: a lone link paragraph = whole-slide link (text visually hidden, as live);
 *              headings + CTA = the banner card.
 * Decode tier: reconstructive (repeat group); pictures and copy are MOVED (EW1), CTAs move
 * as their <p> (EW3). Options: `start-N` / `start-mobile-N` = initial slide (1-based).
 * Autoplay is restored at delivery (captureState restoreAtDelivery): live slick timing — 6 s
 * from init, not held by hover or focus (as observed on live), paused while the tab is hidden,
 * off under prefers-reduced-motion.
 * @ew-exempt arrow / dot / slide labels (UI glue, aria only)
 */
const DELAY = 6000;
const MOBILE = window.matchMedia('(width >= 768px)');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function startIndex(block, n) {
  const pick = (re) => {
    const m = [...block.classList].map((c) => c.match(re)).find(Boolean);
    return m ? Math.min(Math.max(parseInt(m[1], 10) - 1, 0), n - 1) : null;
  };
  const desk = pick(/^start-(\d+)$/);
  const mob = pick(/^start-mobile-(\d+)$/);
  if (!MOBILE.matches && mob !== null) return mob;
  return desk ?? 0;
}

/* slick-model carousel over the slides already placed in `track` */
function carousel(block, track, slides, label) {
  const n = slides.length;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = startIndex(block, n);
  let timer = null;
  const dots = el('ul', 'carousel-dots slick-dots', { 'aria-label': label }); // live slick convention
  const dotBtns = slides.map((s, k) => {
    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'slide');
    s.setAttribute('aria-label', `${k + 1} of ${n}`);
    const li = el('li');
    const b = el('button', 'carousel-dot', { type: 'button', 'aria-label': `${k + 1} of ${n}` });
    b.textContent = k + 1;
    li.append(b);
    dots.append(li);
    return b;
  });
  // slick-model loop clones (last before, all after): hidden, inert, instrumentation stripped (EW4)
  const clone = (s) => {
    const c = s.cloneNode(true);
    [c, ...c.querySelectorAll('[data-prose-index], [data-image-index], [id]')].forEach((x) => {
      x.removeAttribute('data-prose-index');
      x.removeAttribute('data-image-index');
      x.removeAttribute('id');
    });
    c.classList.add('carousel-slide-clone');
    c.hidden = true;
    c.inert = true;
    c.setAttribute('aria-hidden', 'true');
    return c;
  };
  if (n > 1) {
    track.prepend(clone(slides[n - 1]));
    slides.forEach((s) => track.append(clone(s)));
  }
  const paint = () => {
    track.style.setProperty('--i', i);
    slides.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      if (k === i) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
      s.querySelectorAll('a[href]').forEach((a) => {
        if (k === i) a.removeAttribute('tabindex');
        else a.setAttribute('tabindex', '-1');
      });
    });
    dotBtns.forEach((d, k) => {
      d.classList.toggle('is-active', k === i);
      d.setAttribute('aria-current', String(k === i));
    });
  };
  const stop = () => {
    window.clearTimeout(timer);
    block.classList.remove('is-playing');
  };
  let go;
  const play = () => {
    stop();
    if (reduce || n < 2 || document.hidden) return;
    // restart the dot fill from 0 (live aniWidth 6s)
    block.getBoundingClientRect();
    block.classList.add('is-playing');
    timer = window.setTimeout(() => go(i + 1), DELAY);
  };
  go = (next) => {
    i = (next + n) % n;
    paint();
    play();
  };
  const prev = el('button', 'carousel-arrow carousel-arrow-prev', { type: 'button', 'aria-label': 'Previous slide' });
  prev.append(el('i', 'fa fa-angle-left', { 'aria-hidden': 'true' }));
  const next = el('button', 'carousel-arrow carousel-arrow-next', { type: 'button', 'aria-label': 'Next slide' });
  next.append(el('i', 'fa fa-angle-right', { 'aria-hidden': 'true' }));
  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));
  dotBtns.forEach((d, k) => d.addEventListener('click', () => go(k)));
  document.addEventListener('visibilitychange', play);
  let x0 = null;
  track.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
  }, { passive: true });
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', label);
  paint();
  play();
  return { prev, next, dots };
}

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

function media(cell) {
  return cell && cell.querySelector('picture, img');
}

export default function decorate(block) {
  if (block.querySelector(':scope > .carousel-viewport')) return;
  const viewport = el('div', 'carousel-viewport');
  const track = el('div', 'carousel-track');
  const slides = [...block.children].map((row) => {
    const cells = [...row.children];
    const pics = cells.filter((c) => media(c) && !c.querySelector('h1, h2, h3, a'));
    const copy = cells.find((c) => !pics.includes(c) && c.textContent.trim());
    const slide = el('div', 'carousel-slide hero-slide');
    pics.slice(0, 2).forEach((c, k) => {
      const box = el('div', `hero-img ${k ? 'hero-img-m' : 'hero-img-d'}`);
      const pic = media(c);
      box.append(pic.closest('picture') || pic);
      slide.append(box);
    });
    const container = el('div', 'container');
    if (copy) {
      const nodes = items(copy);
      nodes.forEach(buttonize);
      const card = copy.querySelector('h1, h2, h3, h4, h5, h6');
      const wrap = el('div', card ? 'hero-card' : 'hero-link');
      nodes.forEach((node) => wrap.append(node));
      container.append(wrap);
    }
    slide.append(container);
    track.append(slide);
    return slide;
  });
  viewport.append(track);
  const { prev, next, dots } = carousel(block, track, slides, 'Choose banner');
  block.replaceChildren(viewport, prev, next, dots);
}
