/*
 * Footer block.
 * Content comes from the footer fragment (content/footer.plain.html locally,
 * /footer.plain.html on DA/EDS). The fragment carries five flat sections, in order:
 *   1 link columns (heading + list, repeated)   2 secondary links (heading + lists)
 *   3 legal lines + social heading + social list  4 leaving-site notice (heading, text, link)
 *   5 back-to-top label (icon + text)
 * This file only reads that content and builds the interactive chrome around it.
 * The mobile bottom tab bar belongs to the header block; the footer never draws one.
 */

const DESKTOP = window.matchMedia('(width >= 900px)');

/* presentational glyphs for social links that carry no image (Font Awesome 4.7) */
const SOCIAL_GLYPHS = [
  ['facebook.', 'facebook'],
  ['linkedin.', 'linkedin'],
  ['instagram.', 'instagram'],
  ['youtube.', 'youtube'],
  ['twitter.', 'x'],
  ['x.com', 'x'],
];

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/* metadata-independent dual fetch: /content first (localhost), then root (DA/EDS prod) */
async function fetchFooter() {
  let url = '/content/footer.plain.html';
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    url = '/footer.plain.html';
    resp = await fetch('/footer.plain.html');
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  // relative media paths are relative to the fragment, not the page
  const base = new URL(url, window.location.href);
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), base).href;
  });
  doc.querySelectorAll('source[srcset]').forEach((source) => {
    source.srcset = new URL(source.getAttribute('srcset'), base).href;
  });
  return doc.body;
}

function hostOf(a) {
  try {
    return new URL(a.href, window.location.href).hostname;
  } catch {
    return '';
  }
}

/* same site, or another host of the same bank (documents, service portals) */
function isOwnHost(host, ownDomain) {
  return host === window.location.hostname || host === ownDomain || host.endsWith(`.${ownDomain}`);
}

/* registrable domain of the source site, read from the fragment's own subdomain links */
function ownDomainOf(fragment) {
  const hosts = [...fragment.querySelectorAll('a[href^="http"]')].map(hostOf);
  const counts = {};
  hosts.forEach((h) => {
    const d = h.split('.').slice(-3).join('.');
    counts[d] = (counts[d] || 0) + 1;
  });
  return Object.entries(counts).sort((x, y) => y[1] - x[1])[0]?.[0] || window.location.hostname;
}

/* a heading that toggles the next list on small screens */
function accordionHeading(h, panel) {
  const id = `footer-panel-${Math.random().toString(36).slice(2, 8)}`;
  panel.id = id;
  const btn = el('button', 'footer-heading-toggle', { type: 'button', 'aria-expanded': 'false', 'aria-controls': id });
  btn.append(...h.childNodes);
  h.className = 'footer-heading';
  h.append(btn);
  btn.addEventListener('click', () => {
    if (DESKTOP.matches) return;
    btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  });
  return h;
}

function buildColumns(section) {
  const cols = el('div', 'footer-columns');
  [...section.querySelectorAll(':scope > h2, :scope > h3, :scope > p')].forEach((h) => {
    const list = h.nextElementSibling;
    if (!list || list.tagName !== 'UL') return;
    const col = el('nav', 'footer-column', { 'aria-label': h.textContent.trim() });
    list.className = 'footer-links';
    col.append(accordionHeading(h, list), list);
    cols.append(col);
  });
  return cols;
}

function buildOthers(section) {
  const row = el('div', 'footer-others');
  const head = section.querySelector(':scope > h2, :scope > h3, :scope > p');
  const lists = [...section.querySelectorAll(':scope > ul')];
  const body = el('div', 'footer-others-body');
  lists.forEach((ul, i) => {
    ul.className = i ? 'footer-others-list footer-others-more' : 'footer-others-list';
    ul.querySelectorAll('img').forEach((img) => {
      const sup = el('sup', 'footer-badge');
      img.replaceWith(sup);
      sup.append(img);
    });
    body.append(ul);
  });
  /* desktop-only collapse control for the trailing list(s) */
  if (lists.length > 1) {
    const toggle = el('a', 'footer-others-toggle', {
      href: '#', role: 'button', 'aria-expanded': 'true',
    });
    if (head) toggle.setAttribute('aria-label', head.textContent.trim());
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      body.querySelectorAll('.footer-others-more').forEach((ul) => { ul.hidden = !open; });
    });
    body.prepend(toggle);
  }
  if (head) row.append(accordionHeading(head, body));
  row.append(body);
  return row;
}

function buildLegal(section) {
  const legal = el('div', 'footer-legal');
  const text = el('div', 'footer-legal-text');
  const social = el('div', 'footer-social');
  const list = section.querySelector(':scope > ul');
  const label = list?.previousElementSibling;
  [...section.querySelectorAll(':scope > p')].filter((p) => p !== label).forEach((p, i) => {
    p.className = i ? 'footer-legal-line' : 'footer-legal-line footer-copyright';
    text.append(p);
  });
  if (list) {
    if (label && label.tagName !== 'UL') {
      label.className = 'footer-social-label';
      social.append(label);
    }
    list.className = 'footer-social-list';
    list.querySelectorAll('a').forEach((a) => {
      const host = hostOf(a);
      const glyph = SOCIAL_GLYPHS.find(([h]) => host.includes(h))?.[1] || 'link';
      a.classList.add('footer-social-link', `footer-social-${glyph}`);
      const name = a.textContent.trim() || a.querySelector('img')?.alt || glyph;
      const img = a.querySelector('img');
      const sr = el('span', 'footer-sr-only');
      sr.textContent = name;
      a.textContent = '';
      if (img) {
        img.alt = '';
        img.className = 'footer-social-img';
        a.append(img);
      } else a.append(el('span', 'footer-social-glyph', { 'aria-hidden': 'true' }));
      a.append(sr);
    });
    social.append(list);
  }
  legal.append(text, social);
  return legal;
}

function buildNotice(section) {
  const dialog = el('dialog', 'footer-attention');
  const title = section.querySelector('h1, h2, h3, h4, h5, h6');
  const header = el('div', 'footer-attention-header');
  const body = el('div', 'footer-attention-body');
  const actions = el('div', 'footer-attention-actions');
  if (title) {
    title.className = 'footer-attention-title';
    title.id = 'footer-attention-title';
    dialog.setAttribute('aria-labelledby', title.id);
    header.append(title);
  }
  const close = el('button', 'footer-attention-close', { type: 'button', 'aria-label': 'Close' });
  close.addEventListener('click', () => dialog.close());
  header.append(close);
  let proceed = null;
  [...section.querySelectorAll(':scope > p')].forEach((p) => {
    const a = p.querySelector('a');
    if (a && p.textContent.trim() === a.textContent.trim()) {
      proceed = a;
      a.className = 'footer-attention-proceed';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.addEventListener('click', () => dialog.close());
      actions.append(a);
    } else body.append(p);
  });
  dialog.append(header, body, actions);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  return { dialog, proceed };
}

function buildBackToTop(section) {
  const p = section.querySelector('p');
  const btn = el('button', 'footer-top', { type: 'button' });
  if (p) {
    const img = p.querySelector('img');
    const label = el('span', 'footer-top-label');
    label.textContent = p.textContent.trim();
    btn.setAttribute('aria-label', label.textContent);
    if (img) {
      img.className = 'footer-top-icon';
      img.alt = '';
      btn.append(img);
    }
    btn.append(label);
  }
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 200);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return btn;
}

/* external links: own-bank hosts open in a new tab, third-party hosts go through the notice */
function wireLinks(main, ownDomain, notice) {
  main.querySelectorAll('a[href]').forEach((a) => {
    if (a.getAttribute('href') === '#' || a === notice?.proceed) return;
    const host = hostOf(a);
    if (host === window.location.hostname) return;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (isOwnHost(host, ownDomain) || !notice?.proceed) return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      notice.proceed.href = a.href;
      notice.dialog.showModal();
    });
  });
}

/* headings act as accordion triggers only below the desktop breakpoint */
function syncViewport(block) {
  block.querySelectorAll('.footer-heading-toggle').forEach((btn) => {
    if (DESKTOP.matches) btn.setAttribute('tabindex', '-1');
    else btn.removeAttribute('tabindex');
  });
}

export default async function decorate(block) {
  const fragment = await fetchFooter();
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > div')];
  const [cols, others, legal, notice, top] = sections;
  const ownDomain = ownDomainOf(fragment);
  block.textContent = '';

  const main = el('div', 'footer-main');
  const inner = el('div', 'footer-inner');
  if (cols) inner.append(buildColumns(cols));
  const bottom = el('div', 'footer-bottom');
  if (others) bottom.append(buildOthers(others));
  if (legal) bottom.append(buildLegal(legal));
  inner.append(bottom);
  main.append(inner);
  const built = notice ? buildNotice(notice) : null;
  if (built) main.append(built.dialog);
  wireLinks(main, ownDomain, built);
  block.append(main);
  if (top) block.append(buildBackToTop(top));

  syncViewport(block);
  DESKTOP.addEventListener('change', () => syncViewport(block));
}
