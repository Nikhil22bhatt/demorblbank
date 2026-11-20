/**
 * rates — the homepage "Attractive Rates" band (replica canon index.css .rates).
 * Authored rows, classified by content:
 *   heading — a cell holding only a heading (the section title)
 *   rate    — [label paragraph] [value heading] [optional "View Rates" paragraph]
 *             cells by order inside the row; a value without a heading (a paragraph with
 *             the download icon link) is the Forex column
 * @ew-exempt icon image alt (derived from the authored link title)
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

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const container = el('div', 'container');
  const head = el('div', 'rates-head');
  const list = el('div', 'rates-row');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      cells.forEach((c) => items(c).forEach((n) => head.append(n)));
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
  container.append(head, list);
  block.replaceChildren(container);
}
