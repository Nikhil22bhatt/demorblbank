/**
 * rates — the homepage "Attractive Rates" band (replica canon index.css .rates).
 * Authored rows, classified by content:
 *   heading — a cell holding only a heading (the section title)
 *   rate    — [label paragraph] [value heading] [optional "View Rates" paragraph]
 *             cells by order inside the row; a value without a heading (a paragraph with
 *             the download icon link) is the Forex column
 * @ew-exempt icon image alt (derived from the authored link title)
 *   note    — a one-cell text row after the rates ("*T&C Apply")
 *   media   — a one-cell picture row: the block becomes a feature tile (.rates-feature)
 * blue: [picture row] [copy row] — rows kept, classed .rates-media / .rates-copy.
 * Decode tier: reconstructive (repeat group). Authored nodes are MOVED (EW1); the value
 * keeps its authored <sup>/<sub> marks (% and "* p.a.").
 */
function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
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

/* a cell holding nothing but picture(s) */
function isPictureOnly(cell) {
  return !!cell.querySelector('picture') && !cell.textContent.trim();
}

/* "6.00<sup>*</sup>% p.a." — the trailing unit text after the marker joins it in a <small>
   (the live rate tile's star / % / p.a. stack); "%" gets its own span */
function stackUnit(heading) {
  const sup = heading.querySelector(':scope > sup');
  const tail = sup?.nextSibling;
  if (!tail || tail.nodeType !== 3 || tail.nextSibling) return;
  const m = tail.textContent.match(/^\s*(%)\s*(.*)$/);
  if (!m) return;
  const small = document.createElement('small');
  const [, unit, rest] = m;
  const per = el('span', 'rates-per');
  per.textContent = unit;
  sup.after(small);
  small.append(sup, ' ', per, ` ${rest.trim()}`);
  tail.remove();
}

/* blue: [picture row] [copy row] — a full-bleed photo beside the copy on the navy panel */
function decoratePanel(block) {
  const panel = el('div', 'rates-panel');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    row.className = cells.length && cells.every(isPictureOnly) ? 'rates-media' : 'rates-copy';
    panel.append(row);
  });
  block.replaceChildren(panel);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container, :scope > .rates-panel')) return;
  if (block.classList.contains('blue')) {
    decoratePanel(block);
    return;
  }
  const container = el('div', 'container');
  const head = el('div', 'rates-head');
  const list = el('div', 'rates-row');
  const note = el('div', 'rates-note');
  const media = el('div', 'rates-media');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      let target = list.children.length ? note : head;
      if (cells.length && cells.every(isPictureOnly)) target = media;
      cells.forEach((c) => items(c).forEach((n) => target.append(n)));
      return;
    }
    const [labelCell, valueCell, ...moreCells] = cells;
    const col = el('div', 'rates-col');
    if (!valueCell.querySelector('h1, h2, h3, h4, h5, h6')) col.classList.add('rates-col-forex');
    const item = el('div', 'rates-item');
    const label = el('div', 'rates-label');
    items(labelCell).forEach((n) => label.append(n));
    const val = el('div', 'rates-value');
    items(valueCell).forEach((n) => val.append(n));
    item.append(label, val);
    const rest = moreCells.flatMap((c) => items(c));
    if (rest.length) {
      const more = el('div', 'rates-more');
      rest.forEach((n) => more.append(n));
      item.append(more);
    }
    col.append(item);
    list.append(col);
  });
  // icon links (Forex download): the icon image takes its name from the authored link title
  list.querySelectorAll('a[title] .icon img').forEach((img) => {
    if (!img.alt) img.alt = img.closest('a').title.replace(/^View /, '');
  });
  list.querySelectorAll('.rates-value :is(h1, h2, h3, h4, h5, h6)').forEach(stackUnit);
  if (media.children.length) {
    // feature tile: copy (lead-in, rates, note) beside a picture
    block.classList.add('rates-feature');
    // the live tile's "View Rates" links end in a decorative arrow image
    list.querySelectorAll('.rates-more a').forEach((a) => {
      const arrow = el('img', 'rates-arrow');
      arrow.src = new URL('./right-icon-blue.svg', import.meta.url).href;
      arrow.alt = '';
      arrow.width = 20;
      arrow.height = 15;
      a.append(arrow);
    });
    const main = el('div', 'rates-main');
    main.append(head, list);
    if (note.children.length) main.append(note);
    container.append(main, media);
  } else {
    container.append(head, list);
    if (note.children.length) container.append(note);
  }
  block.replaceChildren(container);
}
