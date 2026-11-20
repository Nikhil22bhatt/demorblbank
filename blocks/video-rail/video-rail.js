/*
 * video-rail — "Trust & Beyond" video thumbnail rail
 * (replica canon business-banking.css: .rail-section--video, .video-card, #video-popup).
 * Authoring (D1: embed URLs are never block rows): the section's DEFAULT CONTENT holds the
 * heading and one paragraph per video — a thumbnail picture linked to its YouTube embed URL;
 * the block's row holds the CTA (Watch All). decorate() reabsorbs the section's default
 * content (EW8: the wrapper's children are MOVED), classified by content (never by index):
 *   head  — a heading (the section title)
 *   video — a paragraph whose link wraps a picture (EW6: the href is read into the play
 *           button, the anchor unwrapped)
 *   cta   — any other paragraph (the lone CTA link)
 * Decode tiers: template-slotted (head, CTA), reconstructive (video cards).
 * Behaviour (live #video-popup): a thumb opens the embed in a modal; x / overlay / Esc close it.
 * @ew-exempt dialog chrome (the "Video" label and the close glyph) is presentational, not authored.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);

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

function buildPopup() {
  const popup = el('div', 'video-popup');
  popup.hidden = true;
  const dialog = el('div', 'video-popup-dialog', {
    role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Video',
  });
  const close = el('button', 'video-popup-close', { type: 'button', 'aria-label': 'Close' });
  close.textContent = '×';
  const frame = el('iframe', 'video-popup-frame', {
    title: 'Video', src: 'about:blank', allow: 'autoplay; encrypted-media', allowfullscreen: '',
  });
  dialog.append(close, frame);
  popup.append(dialog);
  const hide = () => {
    popup.hidden = true;
    frame.src = 'about:blank';
    document.body.style.overflow = '';
  };
  popup.addEventListener('click', (e) => {
    if (e.target === popup || e.target.closest('.video-popup-close')) hide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popup.hidden) hide();
  });
  const open = (src) => {
    frame.src = src;
    popup.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  return { popup, open };
}

function buildVideo(row, open) {
  const link = row.querySelector('a[href]');
  const pic = row.querySelector('picture') || row.querySelector('img');
  const li = el('li', 'rail-slide');
  const card = el('div', 'video-card');
  const play = el('button', 'video-card-play', { type: 'button' });
  if (link) play.dataset.video = link.href;
  if (pic) play.append(pic);
  play.addEventListener('click', () => {
    if (play.dataset.video) open(play.dataset.video);
  });
  card.append(play);
  li.append(card);
  return li;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const container = el('div', 'container');
  const head = el('div', 'rail-head');
  const rail = el('div', 'rail');
  const viewport = el('div', 'rail-viewport');
  const track = el('ul', 'rail-track');
  const cta = el('div', 'rail-cta');
  const { popup, open } = buildPopup();

  const section = block.closest('.section');
  const absorbed = section
    ? [...section.querySelectorAll(':scope > .default-content-wrapper')]
      .flatMap((w) => [...w.children])
    : [];
  const rows = [...block.children].flatMap((row) => [...row.children])
    .flatMap((cell) => {
      blockify(cell);
      return [...cell.children];
    });
  [...absorbed, ...rows].forEach((n) => {
    if (n.querySelector('a[href] picture, a[href] img')) track.append(buildVideo(n, open));
    else if (isHeading(n)) head.append(n);
    else cta.append(n);
  });

  viewport.append(track);
  rail.append(viewport);
  container.append(head, rail);
  if (cta.children.length) container.append(cta);
  block.replaceChildren(container, popup);
}
