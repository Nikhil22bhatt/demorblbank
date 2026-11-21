/**
 * apr-calculator — loan APR / EMI calculator (client-side only, no network).
 *
 * Authoring (one row per item, any order, every row optional):
 *   [heading]                                  optional heading above the form
 *   [Field label | min | max | default | step] slider field; the field is identified by
 *                                              keywords in its label (amount/loan, rate/interest,
 *                                              tenure/month, fee/processing, other/charge),
 *                                              otherwise by order. Numbers accept "15 Cr",
 *                                              "5 L", "10K", "₹ 1,000", "6%".
 *   [APR label]          one cell, text containing "APR"
 *   [EMI label]          one cell, text containing "EMI"
 *   [Reset]              one cell, text "Reset" (link or plain text)
 *   [link]               any other link row: CTA under the results
 * Missing fields fall back to the defaults below.
 */

const FIELDS = [
  {
    key: 'amount', test: /amount|loan|principal/i, label: 'Loan Amount (₹)', min: 1000, max: 150000000, value: 1000, step: 1000, unit: '₹', prefix: true,
  },
  {
    key: 'rate', test: /rate|interest/i, label: 'Interest Rate (Annual %)', min: 6, max: 28, value: 6, step: 0.1, unit: '%',
  },
  {
    key: 'tenure', test: /tenure|month|period/i, label: 'Tenure (Months)', min: 1, max: 360, value: 1, step: 1, unit: 'M',
  },
  {
    key: 'fees', test: /fee|processing|documentation/i, label: 'Processing/Documentation Fees', min: 0, max: 50000000, value: 0, step: 100, unit: '₹', prefix: true,
  },
  {
    key: 'charges', test: /other|charge/i, label: 'Other Charges', min: 0, max: 50000000, value: 0, step: 100, unit: '₹', prefix: true,
  },
];

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** parse "₹ 15 Cr", "5L", "10K", "1,000", "6%" into a number (NaN when empty) */
export function parseAmount(text) {
  const t = String(text || '').replace(/,/g, '').trim();
  const m = t.match(/-?\d+(\.\d+)?/);
  if (!m) return NaN;
  let n = parseFloat(m[0]);
  const rest = t.slice(m.index + m[0].length).trim().toLowerCase();
  if (/^(cr|crore)/.test(rest)) n *= 10000000;
  else if (/^(l|lac|lakh)/.test(rest)) n *= 100000;
  else if (/^k/.test(rest)) n *= 1000;
  return n;
}

const fmtINR = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

function fmtScale(n, unit) {
  let v = n.toLocaleString('en-IN');
  if (n >= 10000000) v = `${+(n / 10000000).toFixed(2)} Cr`;
  else if (n >= 100000) v = `${+(n / 100000).toFixed(2)} L`;
  if (unit === '₹') return `₹ ${v}`;
  return `${v}${unit}`;
}

function classify(block) {
  const out = {
    fields: {}, labels: {}, ctas: [], heading: null, reset: null,
  };
  const unassigned = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const text = row.textContent.trim();
    if (!text && !row.querySelector('picture')) return;
    const nums = cells.slice(1).map((c) => parseAmount(c.textContent));
    const isField = cells.length > 1 && nums.some((n) => !Number.isNaN(n));
    if (cells.length === 1 && row.querySelector('h1, h2, h3, h4, h5, h6')) {
      out.heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    } else if (isField) {
      const label = cells[0].textContent.trim();
      const def = FIELDS.find((f) => !out.fields[f.key] && f.test.test(label));
      const entry = { label, nums };
      if (def) out.fields[def.key] = entry;
      else unassigned.push(entry);
    } else if (/^reset$/i.test(text)) {
      out.reset = text;
    } else if (cells.length === 1 && /\bapr\b/i.test(text) && !row.querySelector('a')) {
      out.labels.apr = text;
    } else if (cells.length === 1 && /\bemi\b/i.test(text) && !row.querySelector('a')) {
      out.labels.emi = text;
    } else if (row.querySelector('a[href]')) {
      out.ctas.push(...row.querySelectorAll('a[href]'));
    }
  });
  // unlabelled-by-keyword fields fill the remaining slots in order
  FIELDS.forEach((f) => {
    if (!out.fields[f.key] && unassigned.length) out.fields[f.key] = unassigned.shift();
  });
  return out;
}

function buildField(def, authored) {
  const [min, max, value, step] = authored ? authored.nums : [];
  const cfg = {
    ...def,
    label: authored?.label || def.label,
    min: Number.isNaN(min) || min === undefined ? def.min : min,
    max: Number.isNaN(max) || max === undefined ? def.max : max,
    step: Number.isNaN(step) || step === undefined ? def.step : step,
  };
  if (cfg.max <= cfg.min) cfg.max = cfg.min + 1;
  const v = Number.isNaN(value) || value === undefined ? def.value : value;
  cfg.value = Math.min(Math.max(v, cfg.min), cfg.max);

  const id = `apr-${def.key}-${Math.random().toString(36).slice(2, 8)}`;
  const wrap = el('div', `apr-calculator-field apr-calculator-field-${def.key}`);
  const head = el('div', 'apr-calculator-field-head');
  const label = el('label', 'apr-calculator-label', { for: id });
  label.textContent = cfg.label;
  const box = el('div', 'apr-calculator-input');
  const input = el('input', '', {
    type: 'text', inputmode: 'decimal', id, 'data-key': def.key,
  });
  input.value = cfg.value.toLocaleString('en-IN');
  const unit = el('span', 'apr-calculator-unit');
  unit.textContent = cfg.unit;
  if (cfg.prefix) box.append(unit, input);
  else box.append(input, unit);
  head.append(label, box);
  const slider = el('input', 'apr-calculator-slider', {
    type: 'range', min: cfg.min, max: cfg.max, step: cfg.step, 'aria-label': cfg.label, 'data-key': def.key,
  });
  slider.value = cfg.value;
  const scale = el('div', 'apr-calculator-scale');
  const lo = el('span');
  lo.textContent = fmtScale(cfg.min, cfg.unit);
  const hi = el('span');
  hi.textContent = fmtScale(cfg.max, cfg.unit);
  scale.append(lo, hi);
  wrap.append(head, slider, scale);
  return {
    wrap, input, slider, cfg,
  };
}

/** monthly EMI for principal p, annual rate r (%), n months */
export function emi(p, r, n) {
  if (n <= 0) return 0;
  const i = r / 1200;
  if (i === 0) return p / n;
  const f = (1 + i) ** n;
  return (p * i * f) / (f - 1);
}

/** APR (%): the annual rate at which the EMI repays the net amount (principal − costs) */
export function apr(p, r, n, costs) {
  const payment = emi(p, r, n);
  const net = p - costs;
  if (net <= 0 || payment <= 0) return NaN;
  const pv = (i) => (i === 0 ? payment * n : (payment * (1 - (1 + i) ** -n)) / i);
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 200; k += 1) {
    const mid = (lo + hi) / 2;
    if (pv(mid) > net) lo = mid;
    else hi = mid;
  }
  return ((lo + hi) / 2) * 1200;
}

export default function decorate(block) {
  const r = classify(block);
  const form = el('div', 'apr-calculator-form');
  if (r.heading) form.append(r.heading);
  const resetBtn = el('button', 'apr-calculator-reset', { type: 'button' });
  resetBtn.textContent = r.reset || 'Reset';
  form.append(resetBtn);
  const fields = FIELDS.map((def) => buildField(def, r.fields[def.key]));
  fields.forEach((f) => form.append(f.wrap));

  const result = el('div', 'apr-calculator-result', { 'aria-live': 'polite' });
  const aprBox = el('div', 'apr-calculator-apr');
  const aprLabel = el('span', 'apr-calculator-apr-label');
  aprLabel.textContent = r.labels.apr || 'APR';
  const aprValue = el('span', 'apr-calculator-apr-value');
  const aprUnit = el('span', 'apr-calculator-apr-unit');
  aprUnit.textContent = '%';
  aprBox.append(aprLabel, aprValue, aprUnit);
  const emiBox = el('div', 'apr-calculator-emi');
  const emiLabel = el('p', 'apr-calculator-emi-label');
  emiLabel.textContent = r.labels.emi || 'EMI Amount';
  const emiValue = el('p', 'apr-calculator-emi-value');
  emiBox.append(emiLabel, emiValue);
  result.append(aprBox, emiBox);
  if (r.ctas.length) {
    const ctas = el('div', 'apr-calculator-ctas');
    r.ctas.forEach((a) => {
      a.classList.add('button');
      ctas.append(a);
    });
    result.append(ctas);
  }

  const val = (key) => +fields.find((f) => f.cfg.key === key).slider.value;
  const paint = (s) => s.style.setProperty('--pct', `${((s.value - s.min) / (s.max - s.min)) * 100}%`);
  const compute = () => {
    const p = val('amount');
    const rate = val('rate');
    const n = Math.round(val('tenure'));
    const costs = val('fees') + val('charges');
    const e = emi(p, rate, n);
    const a = apr(p, rate, n, costs);
    aprValue.textContent = Number.isFinite(a) ? a.toFixed(2) : '–';
    emiValue.textContent = Number.isFinite(e) ? fmtINR(e) : '–';
  };

  fields.forEach(({ input, slider, cfg }) => {
    paint(slider);
    slider.addEventListener('input', () => {
      input.value = Number(slider.value).toLocaleString('en-IN');
      paint(slider);
      compute();
    });
    input.addEventListener('change', () => {
      const n = parseAmount(input.value);
      const v = Number.isNaN(n) ? cfg.value : Math.min(Math.max(n, cfg.min), cfg.max);
      slider.value = v;
      input.value = Number(slider.value).toLocaleString('en-IN');
      paint(slider);
      compute();
    });
  });
  resetBtn.addEventListener('click', () => {
    fields.forEach(({ input, slider, cfg }) => {
      slider.value = cfg.value;
      input.value = cfg.value.toLocaleString('en-IN');
      paint(slider);
    });
    compute();
  });

  block.replaceChildren(form, result);
  compute();
}
