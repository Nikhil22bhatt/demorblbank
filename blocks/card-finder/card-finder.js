import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * card-finder — filterable credit-card catalogue (category tabs, live count, card grid).
 *
 * Authoring (every row optional):
 *   [heading + text]                       intro above the tabs (one cell)
 *   [Filters | (icon) Tab | (icon) Tab …]  category tabs; the "Filters"/"Categories" key cell
 *                                          is optional when the row precedes the first card
 *                                          and has no lists/links. An "All" tab is added
 *                                          unless one is authored.
 *   [Showing {count} Cards]                count template (one cell; a number is replaced)
 *   [image | title, bullet list, links | categories]
 *                                          one card per row; categories comma separated,
 *                                          matched to tab labels (case-insensitive).
 *                                          Cards without categories show under every tab.
 * Pre-select a tab with ?category=<label> or #<label>.
 */

const slug = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

const isPlain = (cell) => cell && cell.textContent.trim()
  && !cell.querySelector('picture, img, ul, ol, a, h1, h2, h3, h4, h5, h6');

function isCardRow(row) {
  return !!(row.querySelector('ul, ol') || (row.querySelector('picture, img') && row.querySelector('a[href], h1, h2, h3, h4, h5, h6, strong')));
}

function optimize(scope) {
  scope.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function buildCard(row) {
  const cells = [...row.children];
  let cats = [];
  if (cells.length > 1 && isPlain(cells[cells.length - 1])) {
    cats = cells.pop().textContent.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
  }
  const li = el('li', 'card-finder-card');
  li.dataset.categories = cats.map(slug).join(' ');
  cells.forEach((cell) => {
    const onlyImage = cell.querySelector('picture, img') && !cell.textContent.trim();
    const part = el('div', onlyImage ? 'card-finder-card-image' : 'card-finder-card-body');
    part.append(...cell.childNodes);
    li.append(part);
  });
  const body = li.querySelector('.card-finder-card-body');
  if (body) {
    const links = [...body.querySelectorAll('a[href]')]
      .filter((a) => a.closest('p, div') && a.closest('p, div').textContent.trim() === a.textContent.trim());
    if (links.length) {
      const ctas = el('div', 'card-finder-card-ctas');
      links.forEach((a) => {
        const holder = a.closest('p');
        a.classList.add('button');
        ctas.append(a);
        if (holder && !holder.textContent.trim()) holder.remove();
      });
      body.append(ctas);
    }
  }
  return li;
}

export default function decorate(block) {
  const intro = el('div', 'card-finder-intro');
  const tabsSrc = [];
  let countTpl = 'Showing {count} Cards';
  const cards = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const text = row.textContent.trim();
    if (!text && !row.querySelector('picture, img')) return;
    const keyed = /^(filters?|categories|category|tabs)$/i.test(cells[0]?.textContent.trim());
    if (keyed) {
      tabsSrc.push(...cells.slice(1));
    } else if (cells.length === 1 && (/\{count\}/.test(text) || /^showing\b/i.test(text))) {
      countTpl = /\{count\}/.test(text) ? text : text.replace(/\d+/, '{count}');
      if (!countTpl.includes('{count}')) countTpl = `${text} {count}`;
    } else if (isCardRow(row) && cells.length > 1) {
      cards.push(buildCard(row));
    } else if (!cards.length && cells.length > 1 && !row.querySelector('ul, ol, a[href], h1, h2, h3, h4, h5, h6')) {
      tabsSrc.push(...cells);
    } else if (cells.length === 1) {
      intro.append(...cells[0].childNodes);
    } else if (isCardRow(row)) {
      cards.push(buildCard(row));
    }
  });

  optimize(intro);
  cards.forEach(optimize);

  // tabs: authored, else derived from card categories in first-seen order
  let tabs = tabsSrc.filter((c) => c.textContent.trim()).map((c) => ({
    label: c.textContent.trim(), icon: c.querySelector('picture, img'), id: slug(c.textContent),
  }));
  if (!tabs.length) {
    const seen = new Map();
    cards.forEach((c) => c.dataset.categories.split(' ').filter(Boolean).forEach((id) => {
      if (!seen.has(id)) seen.set(id, id.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()));
    }));
    tabs = [...seen].map(([id, label]) => ({ label, id, icon: null }));
  }
  if (tabs.length && !tabs.some((t) => /^all\b/i.test(t.label))) {
    tabs.unshift({ label: 'All', id: 'all', icon: null });
  }
  tabs.forEach((t) => { if (/^all\b/i.test(t.label)) t.id = 'all'; });

  const nodes = [];
  if (intro.childNodes.length) nodes.push(intro);
  const uid = Math.random().toString(36).slice(2, 8);
  const tablist = el('div', 'card-finder-tabs', { role: 'tablist', 'aria-label': 'Card categories' });
  const count = el('p', 'card-finder-count', { 'aria-live': 'polite' });
  const grid = el('ul', 'card-finder-grid', { id: `card-finder-grid-${uid}` });
  cards.forEach((c) => grid.append(c));

  const select = (id) => {
    let shown = 0;
    cards.forEach((c) => {
      const cats = c.dataset.categories.split(' ').filter(Boolean);
      const match = id === 'all' || !cats.length || cats.includes(id);
      c.hidden = !match;
      if (match) shown += 1;
    });
    tablist.querySelectorAll('[role="tab"]').forEach((b) => {
      const on = b.dataset.id === id;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
    });
    count.textContent = countTpl.replace('{count}', shown);
  };

  tabs.forEach((t) => {
    const b = el('button', 'card-finder-tab', {
      type: 'button', role: 'tab', 'data-id': t.id, 'aria-controls': grid.id,
    });
    if (t.icon) {
      const icon = el('span', 'card-finder-tab-icon');
      icon.append(t.icon.closest('picture') || t.icon);
      b.append(icon);
    }
    const label = el('span', 'card-finder-tab-label');
    label.textContent = t.label;
    b.append(label);
    b.addEventListener('click', () => select(t.id));
    tablist.append(b);
  });
  tablist.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const btns = [...tablist.querySelectorAll('[role="tab"]')];
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    const next = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
    next.focus();
    next.click();
  });

  if (tabs.length) nodes.push(tablist);
  nodes.push(count, grid);
  block.replaceChildren(...nodes);

  const params = new URLSearchParams(window.location.search);
  const wanted = slug(params.get('category') || window.location.hash.slice(1));
  const start = tabs.find((t) => t.id === wanted) ? wanted : 'all';
  select(start);
}
