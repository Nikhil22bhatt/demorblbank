/*
 * awards — the about-us "Awards & Recognition" view (replica canon: about-us.css .au-awards).
 * Authored rows, classified by content (never by index):
 *   tabs  — a cell holding a <ul> of links (one per pane, in pane order)
 *   years — a cell holding a <ul> without links: the year filter strip; opens a new pane.
 *           The checked year is the <strong> one; a non-year item ("- Any -") stays hidden.
 *   award — [picture] [title paragraph + description paragraph]
 *   empty — a single text cell without a picture (the pane's "no record" note)
 * A pane without awards hides its tab (live: the Advertisements view is empty and hidden).
 * Decode tiers: template-slotted (tabs, year strip, card body by order), reconstructive (awards).
 * The awards list is the view's settled default state (dynamic-features row 5); the year strip
 * arrows behave as live slick (1 per click, prev disabled at the start, 10 / 3 visible).
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function media(node) {
  if (!node) return null;
  return node.matches('picture, img') ? node : node.querySelector('picture, img');
}

function classify(row) {
  const cells = [...row.children];
  const pic = cells.find((c) => media(c) && !c.textContent.trim());
  if (pic) return { type: 'award', cells, pic };
  if (cells.length === 1 && cells[0].querySelector('ul a')) return { type: 'tabs', cells };
  if (cells.length === 1 && cells[0].querySelector('ul')) return { type: 'years', cells };
  return { type: 'empty', cells };
}

function arrow(dir) {
  const btn = el('button', `years-btn years-btn-${dir}`, {
    type: 'button',
    'aria-label': dir === 'prev' ? 'Previous' : 'Next',
  });
  btn.append(el('i', `fa fa-angle-${dir === 'prev' ? 'left' : 'right'}`, { 'aria-hidden': 'true' }));
  return btn;
}

function buildYears(cell, name) {
  const form = el('form', 'years');
  const viewport = el('div', 'years-viewport');
  const list = cell.querySelector('ul');
  list.querySelectorAll(':scope > li').forEach((li) => {
    const checked = !!li.querySelector('strong');
    const label = el('label');
    const input = el('input', '', { type: 'radio', name, value: li.textContent.trim() });
    input.checked = checked;
    const span = el('span');
    span.append(...li.childNodes);
    label.append(input, span);
    li.append(label);
    li.classList.add('years-item');
    if (!/^\d{4}$/.test(li.textContent.trim())) li.classList.add('is-any');
    if (checked) li.classList.add('is-active');
  });
  viewport.append(list);
  form.append(arrow('prev'), viewport, arrow('next'));
  form.addEventListener('submit', (e) => e.preventDefault());
  return form;
}

function bindYears(form) {
  const track = form.querySelector('.years-viewport ul');
  const prev = form.querySelector('.years-btn-prev');
  const next = form.querySelector('.years-btn-next');
  const yearItems = [...track.querySelectorAll('.years-item:not(.is-any)')];
  let index = 0;
  const visible = () => (window.matchMedia('(width < 768px)').matches ? 3 : 10);
  const render = () => {
    const max = Math.max(0, yearItems.length - visible());
    index = Math.min(Math.max(index, 0), max);
    const step = yearItems[0] ? yearItems[0].getBoundingClientRect().width : 0;
    track.style.transform = `translateX(${5 - index * step}px)`;
    prev.disabled = index === 0;
    next.disabled = index === max;
  };
  prev.addEventListener('click', () => {
    index -= 1;
    render();
  });
  next.addEventListener('click', () => {
    index += 1;
    render();
  });
  window.addEventListener('resize', render);
  render();
}

function buildAward({ cells, pic }) {
  const col = el('div', 'col-sm-6 col-lg-4 col-xl-3 award');
  const card = el('div', 'award-card');
  const body = el('div', 'award-body');
  const title = el('div', 'award-title');
  const desc = el('div', 'award-desc');
  card.append(media(pic));
  cells.filter((c) => c !== pic).forEach((c) => {
    [...c.children].forEach((node) => {
      if (!title.children.length) title.append(node);
      else desc.append(node);
    });
  });
  body.append(title, desc);
  card.append(body);
  col.append(card);
  return col;
}

export default function decorate(block) {
  const container = el('div', 'container');
  const wrap = el('div', 'tabs-wrap');
  const nav = el('nav', 'page-tabs', { 'aria-label': 'Awards navigation' });
  const panes = [];
  let pane = null;

  const openPane = () => {
    pane = { node: el('div', 'awards-pane'), grid: el('div', 'row awards-grid'), count: 0 };
    panes.push(pane);
    return pane;
  };

  [...block.children].map(classify).forEach((r) => {
    if (r.type === 'tabs') {
      [...r.cells[0].children].forEach((node) => nav.append(node));
      return;
    }
    if (r.type === 'years') {
      const p = openPane();
      p.form = buildYears(r.cells[0], `award-year-${panes.length}`);
      p.node.append(p.form);
      return;
    }
    const p = pane || openPane();
    if (r.type === 'award') {
      p.grid.append(buildAward(r));
      p.count += 1;
    } else {
      const empty = el('div', 'awards-empty');
      r.cells.forEach((c) => empty.append(...c.children));
      p.empty = empty;
    }
  });

  const tabs = [...nav.querySelectorAll('li')];
  wrap.append(nav);
  panes.forEach((p, i) => {
    if (p.count) p.node.append(p.grid);
    if (p.empty) p.node.append(p.empty);
    const link = tabs[i] && tabs[i].querySelector('a');
    const id = link && (link.getAttribute('href') || '').startsWith('#')
      ? link.getAttribute('href').slice(1) : `awards-pane-${i + 1}`;
    p.node.id = id;
    if (i > 0) p.node.hidden = true;
    if (tabs[i]) {
      if (i === 0) {
        tabs[i].classList.add('is-active');
        link.setAttribute('aria-current', 'true');
      }
      if (!p.count) tabs[i].hidden = true;
    }
    wrap.append(p.node);
  });

  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    const i = tabs.findIndex((li) => li.contains(a));
    if (i < 0 || !panes[i]) return;
    e.preventDefault();
    panes.forEach((p, j) => {
      p.node.hidden = j !== i;
      tabs[j]?.classList.toggle('is-active', j === i);
    });
  });

  container.append(wrap);
  block.replaceChildren(container);
  panes.filter((p) => p.form).forEach((p) => bindYears(p.form));
}
