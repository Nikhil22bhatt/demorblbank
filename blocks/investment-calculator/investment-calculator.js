/**
 * investment-calculator — one-time (lump-sum) investment calculator, client-side only.
 *
 * Authoring (one row per item, any order, every row optional):
 *   [heading]                                  optional heading above the form
 *   [Field label | min | max | default | step] slider field, identified by label keywords
 *                                              (amount/investment, keep/tenure/month/year,
 *                                              grow/return/rate), otherwise by order.
 *                                              The tenure field is in months and shows
 *                                              Year + Months inputs. Numbers accept "10 Cr",
 *                                              "5 L", "10K", "₹ 5,000", "12%".
 *   [Result label]        one cell: "value"/"maturity" → maturity value,
 *                         "principal" → principal, "interest"/"earn"/"gain" → interest earned
 *   [link]                CTA under the results (e.g. "Start Investing")
 * Maturity = P × (1 + r/100)^(months/12), compounded annually.
 */

const FIELDS = [
  {
    key: 'amount', test: /amount|invest(ment)? amount|one-time|lump/i, label: 'One-time Investment Amount', min: 5000, max: 100000000, value: 5000, step: 1000, unit: '₹',
  },
  {
    key: 'tenure', test: /keep|tenure|period|duration|month|year/i, label: 'I will keep the money invested for', min: 12, max: 300, value: 12, step: 1, unit: 'Months',
  },
  {
    key: 'rate', test: /grow|return|rate|interest|annual/i, label: 'I expect my investments to grow annually by', min: 1, max: 50, value: 1, step: 0.5, unit: '%',
  },
];

const OUTPUTS = [
  { key: 'maturity', test: /value|maturity/i, label: 'Value of amount invested (at maturity)' },
  { key: 'principal', test: /principal/i, label: 'Principal amount invested' },
  { key: 'interest', test: /interest|earn|gain/i, label: 'Interest earned' },
];

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function parseAmount(text) {
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

const fmtINR = (n) => `₹ ${Math.round(n).toLocaleString('en-IN')}`;

function scaleText(n, unit) {
  if (unit === '₹') return `₹ ${n.toLocaleString('en-IN')}`;
  if (unit === '%') return `${n}%`;
  return `${n} ${unit}`;
}

function classify(block) {
  const out = {
    fields: {}, labels: {}, ctas: [], heading: null,
  };
  const unassigned = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const text = row.textContent.trim();
    if (!text) return;
    const nums = cells.slice(1).map((c) => parseAmount(c.textContent));
    if (cells.length === 1 && row.querySelector('h1, h2, h3, h4, h5, h6')) {
      out.heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    } else if (cells.length > 1 && nums.some((n) => !Number.isNaN(n))) {
      const label = cells[0].textContent.trim();
      const def = FIELDS.find((f) => !out.fields[f.key] && f.test.test(label));
      if (def) out.fields[def.key] = { label, nums };
      else unassigned.push({ label, nums });
    } else if (row.querySelector('a[href]')) {
      out.ctas.push(...row.querySelectorAll('a[href]'));
    } else {
      const def = OUTPUTS.find((o) => !out.labels[o.key] && o.test.test(text));
      if (def) out.labels[def.key] = text;
    }
  });
  FIELDS.forEach((f) => {
    if (!out.fields[f.key] && unassigned.length) out.fields[f.key] = unassigned.shift();
  });
  return out;
}

function config(def, authored) {
  const pick = (n, d) => (n === undefined || Number.isNaN(n) ? d : n);
  const [min, max, value, step] = authored ? authored.nums : [];
  const cfg = {
    ...def,
    label: authored?.label || def.label,
    min: pick(min, def.min),
    max: pick(max, def.max),
    step: pick(step, def.step),
  };
  if (cfg.max <= cfg.min) cfg.max = cfg.min + 1;
  cfg.value = Math.min(Math.max(pick(value, def.value), cfg.min), cfg.max);
  return cfg;
}

function numberInput(id, key, ariaLabel) {
  return el('input', '', {
    type: 'text', inputmode: 'decimal', id, 'data-key': key, 'aria-label': ariaLabel,
  });
}

function buildField(cfg) {
  const uid = Math.random().toString(36).slice(2, 8);
  const id = `inv-${cfg.key}-${uid}`;
  const wrap = el('div', `investment-calculator-field investment-calculator-field-${cfg.key}`);
  const head = el('div', 'investment-calculator-field-head');
  const label = el('label', 'investment-calculator-label', { for: id });
  label.textContent = cfg.label;
  const inputs = [];
  const box = el('div', 'investment-calculator-inputs');
  if (cfg.key === 'tenure') {
    [['years', 'Year'], ['months', 'Months']].forEach(([part, text], k) => {
      const col = el('div', 'investment-calculator-input');
      const cap = el('span', 'investment-calculator-input-caption');
      cap.textContent = text;
      const input = numberInput(k === 0 ? id : `${id}-m`, part, text);
      col.append(cap, input);
      box.append(col);
      inputs.push(input);
    });
  } else {
    const col = el('div', 'investment-calculator-input');
    const unit = el('span', 'investment-calculator-unit');
    unit.textContent = cfg.unit;
    const input = numberInput(id, cfg.key, cfg.label);
    if (cfg.unit === '₹') col.append(unit, input);
    else col.append(input, unit);
    box.append(col);
    inputs.push(input);
  }
  head.append(label, box);
  const slider = el('input', 'investment-calculator-slider', {
    type: 'range', min: cfg.min, max: cfg.max, step: cfg.step, 'aria-label': cfg.label,
  });
  slider.value = cfg.value;
  const scale = el('div', 'investment-calculator-scale');
  const lo = el('span');
  lo.textContent = scaleText(cfg.min, cfg.unit);
  const hi = el('span');
  hi.textContent = scaleText(cfg.max, cfg.unit);
  scale.append(lo, hi);
  wrap.append(head, slider, scale);
  return {
    wrap, inputs, slider, cfg,
  };
}

function syncInputs(field) {
  const v = +field.slider.value;
  if (field.cfg.key === 'tenure') {
    field.inputs[0].value = Math.floor(v / 12);
    field.inputs[1].value = Math.round(v % 12);
  } else {
    field.inputs[0].value = v.toLocaleString('en-IN');
  }
  field.slider.style.setProperty('--pct', `${((v - field.cfg.min) / (field.cfg.max - field.cfg.min)) * 100}%`);
}

export default function decorate(block) {
  const r = classify(block);
  const form = el('div', 'investment-calculator-form');
  if (r.heading) form.append(r.heading);
  const fields = FIELDS.map((def) => buildField(config(def, r.fields[def.key])));
  fields.forEach((f) => form.append(f.wrap));

  const result = el('div', 'investment-calculator-result', { 'aria-live': 'polite' });
  const outs = {};
  OUTPUTS.forEach((o) => {
    const item = el('div', `investment-calculator-output investment-calculator-output-${o.key}`);
    const k = el('p', 'investment-calculator-output-label');
    k.textContent = r.labels[o.key] || o.label;
    const v = el('p', 'investment-calculator-output-value');
    item.append(k, v);
    result.append(item);
    outs[o.key] = v;
  });
  if (r.ctas.length) {
    const ctas = el('div', 'investment-calculator-ctas');
    r.ctas.forEach((a) => {
      a.classList.add('button');
      ctas.append(a);
    });
    result.append(ctas);
  }

  const get = (key) => +fields.find((f) => f.cfg.key === key).slider.value;
  const compute = () => {
    const p = get('amount');
    const months = get('tenure');
    const rate = get('rate');
    const maturity = p * (1 + rate / 100) ** (months / 12);
    outs.maturity.textContent = fmtINR(maturity);
    outs.principal.textContent = fmtINR(p);
    outs.interest.textContent = fmtINR(maturity - p);
  };

  fields.forEach((field) => {
    const { slider, inputs, cfg } = field;
    syncInputs(field);
    slider.addEventListener('input', () => {
      syncInputs(field);
      compute();
    });
    inputs.forEach((input) => input.addEventListener('change', () => {
      let n;
      if (cfg.key === 'tenure') {
        const y = parseAmount(inputs[0].value) || 0;
        const m = parseAmount(inputs[1].value) || 0;
        n = y * 12 + m;
      } else {
        n = parseAmount(input.value);
      }
      slider.value = Number.isNaN(n) ? cfg.value : Math.min(Math.max(n, cfg.min), cfg.max);
      syncInputs(field);
      compute();
    }));
  });

  block.replaceChildren(form, result);
  compute();
}
