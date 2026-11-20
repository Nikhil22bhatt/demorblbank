/**
 * fd-calculator — the homepage Fixed Deposit Calculator (replica canon index.css .fdc;
 * dynamic-features row 3: client-only computation, no network).
 * One fixed composition, rows by order (template-slotted), the typed rows found by content:
 *   heading  — a lone heading               payout — [label] [option list] [rate] [suffix]
 *   outputs  — four result labels           CTAs   — one link per cell, two cells
 *   reset    — a lone link in one cell      terms  — the paragraph with an inline link
 *   the rest, in order: deposit types [option]…, customer types [option]…,
 *   amount [label] [min] [max], tenure label, years / months / days [label] [min] [max],
 *   open-account line.
 * Authored nodes are MOVED into the canon's empty slots (EW1); CTAs move as their <p> (EW3).
 * Named assumption (prototype): the base rate is the authored headline rate, +0.50 senior,
 * +0.75 super senior; cumulative = quarterly compounding (simple interest under 6 months).
 * @ew-exempt payout <select> options (derived from the authored list: a native select cannot
 *   host authored nodes), computed outputs, rupee unit glyph, slider labels (UI glue), the
 *   terms link's screen-reader tail (derived from its authored title)
 */
const RANGES = {
  amount: [5000, 10000000, 5000, ''],
  years: [0, 10, 0, '0'],
  months: [0, 12, 0, '0'],
  days: [0, 31, 7, '7'],
};
const SENIOR = 0.5;
const SUPER = 0.75;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
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

const cellsOf = (row) => [...row.children].map((c) => items(c));
const put = (box, nodes) => {
  nodes.forEach((n) => box.append(n));
  return box;
};

function radio(name, id, nodes, checked) {
  const wrap = el('div', 'fdc-radio');
  const input = el('input', '', { type: 'radio', name, id });
  input.checked = checked;
  const label = el('label', '', { for: id });
  label.append(put(el('div', 'fdc-radio-text'), nodes));
  wrap.append(input, label);
  return wrap;
}

function range(key, labelNodes, scaleNodes, extra) {
  const [min, max, start, shown] = RANGES[key];
  const box = el('div', `fdc-range ${extra}`);
  const head = el('div', 'fdc-range-head');
  const label = put(el('label', 'fdc-range-label', { for: `fdc-${key}-val` }), labelNodes);
  const inputBox = el('div', `fdc-range-input${key === 'amount' ? ' fdc-range-input-amount' : ''}`);
  if (key === 'amount') {
    const unit = el('span', 'fdc-range-unit');
    unit.textContent = '₹ ';
    inputBox.append(unit);
  }
  const val = el('input', '', {
    type: 'text', inputmode: 'numeric', id: `fdc-${key}-val`, 'data-fdc-val': key,
  });
  val.value = shown;
  inputBox.append(val);
  head.append(label, inputBox);
  const slider = el('input', 'fdc-slider', {
    type: 'range', min, max, step: 1, 'data-fdc-range': key, 'aria-label': `Choose ${key}`,
  });
  slider.value = start;
  const scale = put(el('div', 'fdc-range-scale'), scaleNodes);
  box.append(head, slider, scale);
  return box;
}

function classify(rows) {
  const typed = {};
  const rest = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && row.querySelector('h1, h2, h3, h4, h5, h6')) typed.heading = row;
    else if (row.querySelector('ul, ol')) typed.payout = row;
    else if (row.querySelector('a[href]')) {
      const links = [...row.querySelectorAll('a[href]')];
      const linkText = links.map((a) => a.textContent.trim()).join('');
      if (row.textContent.replace(/\s+/g, '') !== linkText.replace(/\s+/g, '')) typed.terms = row;
      else if (cells.length > 1) typed.ctas = row;
      else typed.reset = row;
    } else if (cells.length === 4) typed.outputs = row;
    else rest.push(row);
  });
  const [deposit, customer, amount, tenure, years, months, days, open] = rest;
  return {
    ...typed, deposit, customer, amount, tenure, years, months, days, open,
  };
}

function compute(root, base) {
  const q = (s) => root.querySelector(s);
  const vals = {};
  Object.keys(RANGES).forEach((k) => { vals[k] = q(`[data-fdc-range="${k}"]`); });
  const p = parseFloat(String(q('[data-fdc-val="amount"]').value).replace(/[^0-9.]/g, ''));
  const y = +vals.years.value;
  const m = +vals.months.value;
  const d = +vals.days.value;
  const days = y * 365 + m * 30 + d;
  const out = (k) => q(`[data-fdc-out="${k}"]`);
  let r = base;
  if (q('#fdc-cit-2')?.checked) r = base + SENIOR;
  if (q('#fdc-cit-3')?.checked) r = base + SUPER;
  if (!p || p < 5000 || p > 10000000 || days < 7 || days > 3650) {
    out('interest').textContent = '₹';
    out('maturity').textContent = '₹';
    out('rate').textContent = '';
    out('date').textContent = '';
    return;
  }
  const payout = q('[data-fdc-payout]').selectedIndex;
  const t = days / 365;
  const interest = payout === 0 && days >= 180
    ? p * (1 + r / 400) ** (4 * t) - p
    : (p * r * t) / 100;
  const due = new Date();
  due.setFullYear(due.getFullYear() + y);
  due.setMonth(due.getMonth() + m);
  due.setDate(due.getDate() + d);
  const fmt = (n) => `₹ ${Math.round(n).toLocaleString('en-IN')}`;
  out('interest').textContent = fmt(interest);
  out('maturity').textContent = fmt(payout === 0 ? p + interest : p);
  out('rate').textContent = r.toFixed(2);
  out('date').textContent = due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const headline = q('.fdc-payout-rate p');
  if (headline) headline.textContent = r.toFixed(2);
}

function bind(root, base) {
  const paint = (s) => s.style.setProperty('--pct', `${((s.value - s.min) / (s.max - s.min)) * 100}%`);
  const run = () => compute(root, base);
  Object.keys(RANGES).forEach((k) => {
    const s = root.querySelector(`[data-fdc-range="${k}"]`);
    const v = root.querySelector(`[data-fdc-val="${k}"]`);
    paint(s);
    s.addEventListener('input', () => {
      v.value = k === 'amount' ? Number(s.value).toLocaleString('en-IN') : s.value;
      paint(s);
      run();
    });
    v.addEventListener('change', () => {
      const n = parseFloat(String(v.value).replace(/[^0-9.]/g, ''));
      if (!Number.isNaN(n)) {
        s.value = Math.min(Math.max(n, +s.min), +s.max);
        paint(s);
      }
      run();
    });
  });
  root.querySelectorAll('input[type="radio"], select').forEach((c) => c.addEventListener('change', run));
  const reset = root.querySelector('.fdc-reset a');
  reset?.addEventListener('click', (e) => {
    e.preventDefault();
    Object.entries(RANGES).forEach(([k, [, , start, shown]]) => {
      const s = root.querySelector(`[data-fdc-range="${k}"]`);
      s.value = start;
      root.querySelector(`[data-fdc-val="${k}"]`).value = shown;
      paint(s);
    });
    root.querySelectorAll('input[type="radio"]').forEach((r) => {
      r.checked = /-1$/.test(r.id);
    });
    root.querySelector('[data-fdc-payout]').selectedIndex = 0;
    run();
    const headline = root.querySelector('.fdc-payout-rate p');
    if (headline) headline.textContent = base.toFixed(2);
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const r = classify([...block.children]);
  const container = el('div', 'container');
  const cells = (row) => (row ? cellsOf(row) : []);
  if (r.heading) {
    const nodes = cells(r.heading).flat();
    // live markup: <h2><span>…</span></h2> — the authored text nodes move into the span
    nodes.filter((n) => /^H[1-6]$/.test(n.tagName)).forEach((h) => {
      const span = el('span');
      span.append(...h.childNodes);
      h.append(span);
    });
    container.append(put(el('div', 'fdc-head'), nodes));
  }

  /* deposit type + interest payout */
  const top = el('div', 'fdc-top');
  const type = el('div', 'fdc-type');
  cells(r.deposit).forEach((nodes, k) => {
    type.append(radio('fdc-type', `fdc-type-${k + 1}`, nodes, k === 0));
  });
  const payout = el('div', 'fdc-payout');
  const [payLabel = [], payList = [], payRate = [], paySuffix = []] = cells(r.payout);
  const payHead = el('div', 'fdc-payout-head');
  payHead.append(
    put(el('label', 'fdc-payout-label', { for: 'fdc-payout' }), payLabel),
    put(el('span', 'fdc-payout-rate'), [...payRate, ...paySuffix]),
  );
  const select = el('select', '', { id: 'fdc-payout', 'data-fdc-payout': '', 'aria-label': 'Deposit Type' });
  payList.forEach((list) => {
    list.querySelectorAll('li').forEach((li) => {
      const o = el('option');
      o.textContent = li.textContent.trim();
      select.append(o);
    });
  });
  payout.append(payHead, put(el('div', 'fdc-select'), [select]));
  top.append(type, payout);
  container.append(top);
  const base = parseFloat(payRate.map((n) => n.textContent).join('')) || 7;

  /* form: reset, customer type, amount, tenure */
  const grid = el('div', 'fdc-grid');
  const form = el('div', 'fdc-form');
  form.append(put(el('div', 'fdc-reset'), cells(r.reset).flat()));
  const citizen = el('div', 'fdc-citizen');
  cells(r.customer).forEach((nodes, k) => {
    const col = el('div', `fdc-citizen-col fdc-citizen-col-${k + 1}`);
    col.append(radio('fdc-citizen', `fdc-cit-${k + 1}`, nodes, k === 0));
    citizen.append(col);
  });
  form.append(citizen);
  const [amtLabel = [], ...amtScale] = cells(r.amount);
  form.append(range('amount', amtLabel, amtScale.flat(), 'fdc-range-amount'));
  form.append(put(el('div', 'fdc-tenure-label'), cells(r.tenure).flat()));
  const tenure = el('div', 'fdc-tenure');
  ['years', 'months', 'days'].forEach((key) => {
    const [label = [], ...scale] = cells(r[key]);
    tenure.append(range(key, label, scale.flat(), `fdc-range-col${key === 'days' ? '' : ' fdc-range-rule'}`));
  });
  form.append(tenure);

  /* results table */
  const result = el('div', 'fdc-result');
  const table = el('table', 'fdc-table');
  const body = el('tbody');
  const outs = cells(r.outputs);
  const keys = ['interest', 'rate', 'maturity', 'date'];
  [[0, 1], [2, 3]].forEach((pair) => {
    const tr = el('tr');
    pair.forEach((k) => {
      const td = el('td');
      const v = el('div', 'fdc-v', { 'data-fdc-out-box': keys[k] });
      const outEl = el('span', '', { 'data-fdc-out': keys[k] });
      if (keys[k] === 'interest' || keys[k] === 'maturity') outEl.textContent = '₹';
      v.append(outEl);
      if (keys[k] === 'rate') {
        v.classList.add('fdc-v-rate');
        v.append('%* p.a.');
      }
      td.append(put(el('div', 'fdc-k'), outs[k] || []), v);
      tr.append(td);
    });
    body.append(tr);
  });
  const openTr = el('tr', 'fdc-open');
  const openTd = el('td', '', { colspan: '2' });
  openTr.append(put(openTd, cells(r.open).flat()));
  const btnTr = el('tr', 'fdc-btns');
  cells(r.ctas).forEach((nodes) => {
    nodes.forEach(buttonize);
    btnTr.append(put(el('td'), nodes));
  });
  body.append(openTr, btnTr);
  table.append(body);
  result.append(table);
  grid.append(form, result);
  container.append(grid);
  if (r.terms) {
    const nodes = cells(r.terms).flat();
    nodes.forEach((n) => n.querySelectorAll('a[title]').forEach((a) => {
      const tail = a.title.slice(a.textContent.length).trim();
      if (!a.title.startsWith(a.textContent) || !tail || a.querySelector('.visually-hidden')) return;
      const sr = el('span', 'visually-hidden');
      sr.textContent = tail;
      a.append(sr);
    }));
    container.append(put(el('div', 'fdc-terms'), nodes));
  }
  block.replaceChildren(container);
  bind(container, base);

  /* live AOS fade-up on the calculator container (once, offset 120) */
  container.setAttribute('data-aos', 'fade-up');
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      container.classList.add('aos-animate');
      io.disconnect();
    }
  }, { rootMargin: '0px 0px -120px 0px' });
  io.observe(block);
}
