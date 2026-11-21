/* eslint-disable */
/* global WebImporter */

/**
 * table-data parser.
 * Source: div.table-responsive.i-rate-outer-card-top-table, div.price-tbl-wrap.table-responsive,
 *         div.responsive-table — a single HTML <table> (thead optional).
 * Block contract (blocks/table-data/table-data.js):
 *   one block row per table row, one cell per column; first row = column headers;
 *   short rows have their last cell span the remaining columns.
 * Modal "attention" links carry the real target in a `link` attribute; it becomes the href.
 */
export default function parse(element, { document }) {
  const textOf = (n) => (n.textContent || '').replace(/\s+/g, ' ').trim();
  const table = element.matches('table') ? element : element.querySelector('table');
  const cells = [];

  if (table) {
    const rows = [...table.querySelectorAll('tr')].filter((tr) => tr.closest('table') === table);
    rows.forEach((tr) => {
      const row = [];
      [...tr.children].filter((c) => /^T[DH]$/.test(c.tagName)).forEach((cellEl) => {
        const content = [];
        // links: prefer the real destination over the modal trigger
        cellEl.querySelectorAll('a').forEach((a) => {
          const real = a.getAttribute('link');
          if (real && (!a.getAttribute('href') || a.getAttribute('href').startsWith('#'))) a.setAttribute('href', real);
          ['data-bs-toggle', 'aria-label', 'link'].forEach((attr) => a.removeAttribute(attr));
        });
        const blockLevel = cellEl.querySelector('p, ul, ol, div, h1, h2, h3, h4, h5, h6');
        if (blockLevel) {
          [...cellEl.childNodes].forEach((n) => {
            if (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())) content.push(n);
          });
        } else if (textOf(cellEl) || cellEl.querySelector('img')) {
          const span = document.createElement('p');
          span.innerHTML = cellEl.innerHTML.replace(/&nbsp;/g, ' ').trim();
          content.push(span);
        }
        row.push(content.length ? content : '');
      });
      if (row.some((c) => c !== '')) cells.push(row);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-data', cells });
  element.replaceWith(block);
}
