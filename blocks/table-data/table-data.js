/**
 * Table Data block: renders authored rows as an accessible data table.
 * First row is the header row. Rows with fewer cells are padded so
 * columns stay aligned. Option: `dark`.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.children.length);
  if (!rows.length) return;

  const columnCount = Math.max(...rows.map((row) => row.children.length));
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  rows.forEach((row, i) => {
    const isHeader = i === 0 && rows.length > 1;
    const tr = document.createElement('tr');
    const cells = [...row.children];
    cells.forEach((cell, ci) => {
      const td = document.createElement(isHeader ? 'th' : 'td');
      if (isHeader) td.setAttribute('scope', 'col');
      // last authored cell spans any missing columns
      if (ci === cells.length - 1 && cells.length < columnCount) {
        td.colSpan = columnCount - cells.length + 1;
      }
      // EDS wraps text-only cells in a <p>; unwrap a lone paragraph so the cell holds the content
      const only = cell.children.length === 1 && cell.firstElementChild;
      const lone = only && only.tagName === 'P' && cell.textContent.trim() === only.textContent.trim();
      td.innerHTML = lone ? only.innerHTML : cell.innerHTML;
      tr.append(td);
    });
    if (isHeader) thead.append(tr);
    else tbody.append(tr);
  });

  if (thead.children.length) table.append(thead);
  table.append(tbody);

  const scroller = document.createElement('div');
  scroller.className = 'table-data-scroll';
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  const label = thead.textContent.trim();
  scroller.setAttribute('aria-label', label ? `Table: ${label.slice(0, 80)}` : 'Data table');
  scroller.append(table);
  block.replaceChildren(scroller);
}
