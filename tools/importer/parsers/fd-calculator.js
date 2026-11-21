/* eslint-disable */
/* global WebImporter */

/**
 * fd-calculator parser.
 * Source (#data-section4): one calculator split over sibling parts of the same column:
 *   1. div.row > h2 "Fixed Deposit Calculator"
 *   2. #myTabContent  — deposit type radios (#save-tab) + interest payout rate/select
 *      (#borrow-tab is an inactive, unreachable tab; its tab buttons are commented out)
 *   3. div.row.newMobile — reset link, customer type radios, amount / tenure sliders,
 *      results table (labels, open-account line, two CTAs)
 *   4. div.row > p — terms line with an inline link
 * Both template instances (#myTabContent, .newMobile) are parts of that one calculator, so
 * the first part reached builds the whole fixed composition and the other parts (heading,
 * second instance, terms) are consumed; a later call on an already-consumed part is a no-op.
 * Block contract (blocks/fd-calculator/fd-calculator.js + content/index.plain.html):
 *   heading | deposit [opt][opt] | payout [label][ul][rate][suffix] | reset [link] |
 *   customer [opt][opt][opt] | amount [label][min][max] | tenure [label] |
 *   years / months / days [label][min][max] | outputs [4 labels] | open [line] |
 *   CTAs [strong link][strong link] | terms [p with link]
 * Name: plain 'fd-calculator' — the 'alt' option renders only the options row, which is
 * only right when the calculator parts are authored as separate blocks.
 */

function textOf(node) {
  return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
}

function p(document, text) {
  const el = document.createElement('p');
  el.textContent = text;
  return el;
}

/** <p><strong>Label </strong>tail</p> from a label holding a <strong> and trailing text */
function strongLabel(document, container) {
  const out = document.createElement('p');
  if (!container) return out;
  const strong = container.querySelector('strong');
  if (strong) {
    const s = document.createElement('strong');
    s.textContent = `${textOf(strong)} `;
    out.append(s);
    const tail = textOf(container).replace(textOf(strong), '').trim();
    if (tail) out.append(tail);
  } else {
    out.textContent = textOf(container);
  }
  return out;
}

function radioLabels(scope) {
  if (!scope) return [];
  return [...scope.querySelectorAll('.form-group-radio')].map((g) => g.querySelector('label') || g);
}

function linkPara(document, a, strong) {
  const para = document.createElement('p');
  const link = document.createElement('a');
  link.href = a.getAttribute('href');
  link.textContent = textOf(a);
  if (strong) {
    const s = document.createElement('strong');
    s.append(link);
    para.append(s);
  } else {
    para.append(link);
  }
  return para;
}

export default function parse(element, { document }) {
  if (!element.parentElement) return; // already consumed with the first part

  const col = element.parentElement;
  const tabs = col.querySelector(':scope > #myTabContent') || (element.id === 'myTabContent' ? element : null);
  const form = col.querySelector(':scope > .newMobile') || (element.matches('.newMobile') ? element : null);
  const headRow = [...col.children].find((c) => c !== tabs && c !== form && c.querySelector('h1, h2, h3, h4, h5, h6'));
  const termsRow = [...col.children].find((c) => c !== tabs && c !== form && c !== headRow
    && c.querySelector('p a[href]'));

  const cells = [];

  // heading
  const h = headRow && headRow.querySelector('h1, h2, h3, h4, h5, h6');
  if (h) {
    const h2 = document.createElement('h2');
    h2.textContent = textOf(h);
    cells.push([h2]);
  }

  // deposit types + payout (active tab only)
  const save = tabs && (tabs.querySelector('#save-tab, .tab-pane.active') || tabs);
  if (save) {
    const deposit = radioLabels(save).map((l) => p(document, textOf(l))).filter((x) => x.textContent);
    if (deposit.length) cells.push(deposit.map((x) => [x]));
    const payout = save.querySelector('.int_payout');
    const select = save.querySelector('select');
    if (payout || select) {
      const label = p(document, textOf(payout && payout.querySelector('.int_payout_left, label')));
      const ul = document.createElement('ul');
      if (select) {
        [...select.querySelectorAll('option')].forEach((o) => {
          const li = document.createElement('li');
          li.textContent = textOf(o);
          if (li.textContent) ul.append(li);
        });
      }
      const spans = payout ? [...payout.querySelectorAll('.int_payout_right span')] : [];
      const rate = p(document, textOf(spans[0]));
      const suffix = p(document, textOf(spans[1]));
      cells.push([[label], [ul], [rate], [suffix]]);
    }
  }

  if (form) {
    // reset
    const reset = form.querySelector('.reset-btn-calc, #reset-btn');
    if (reset) cells.push([[linkPara(document, reset, false)]]);

    // customer types (two-line labels keep one <p> per line span)
    const customer = radioLabels(form.querySelector('.calc-form-wrap > .row') || form).map((l) => {
      const lines = [...l.querySelectorAll('span')].map(textOf).filter(Boolean);
      return lines.length ? lines.map((t) => p(document, t)) : [p(document, textOf(l))];
    });
    if (customer.length) cells.push(customer);

    // amount
    const amount = form.querySelector('.amoutDiv') || form.querySelector('.range-wrap-outer');
    if (amount) {
      const label = strongLabel(document, amount.querySelector('.range-wrap-1 .range-wrap-left p, .range-wrap-1 .range-wrap-left'));
      const scale = [...amount.querySelectorAll('.range-wrap-3 p')].map((x) => p(document, textOf(x)));
      cells.push([[label], ...scale.map((x) => [x])]);
    }

    // tenure label
    const tenure = form.querySelector('.tenure-val');
    if (tenure) cells.push([[strongLabel(document, tenure)]]);

    // years / months / days
    form.querySelectorAll('.range-wrap-outer.tenurediv').forEach((r) => {
      const lbl = r.querySelector('.range-wrap-1 .range-wrap-left');
      const label = document.createElement('p');
      const s = document.createElement('strong');
      s.textContent = textOf(lbl);
      label.append(s);
      const scale = [...r.querySelectorAll('.range-wrap-3 p')].map((x) => p(document, textOf(x)));
      cells.push([[label], ...scale.map((x) => [x])]);
    });

    // results table
    const table = form.querySelector('table');
    if (table) {
      const labels = [...table.querySelectorAll('tbody td p.p14')].map((x) => p(document, textOf(x)));
      if (labels.length) {
        while (labels.length < 4) labels.push('');
        cells.push(labels.slice(0, 4).map((x) => [x]));
      }
      const open = table.querySelector('.fdtext1');
      if (open && textOf(open)) cells.push([[p(document, textOf(open))]]);
      const ctas = [...table.querySelectorAll('a[href]')];
      if (ctas.length) cells.push(ctas.map((a) => [linkPara(document, a, true)]));
    }
  }

  // terms
  if (termsRow) {
    const src = termsRow.querySelector('p a[href]').closest('p');
    const para = document.createElement('p');
    src.childNodes.forEach((n) => {
      if (n.nodeType === 3) para.append(n.textContent);
      else if (n.nodeType === 1 && n.tagName === 'A') {
        const a = document.createElement('a');
        a.href = n.getAttribute('href');
        const hidden = n.querySelector('.visually-hidden');
        const visible = textOf(n).replace(textOf(hidden), '').trim();
        a.textContent = visible;
        a.title = [visible, textOf(hidden)].filter(Boolean).join(' ');
        para.append(a);
      } else if (n.nodeType === 1) para.append(textOf(n));
    });
    cells.push([[para]]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'fd-calculator', cells });
  // consume the other parts; the block takes the first part's place
  [headRow, termsRow, tabs, form].forEach((part) => {
    if (part && part !== element && part.parentElement) part.remove();
  });
  element.replaceWith(block);
}
