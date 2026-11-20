/*
 * about-intro — the about-us tab strip + "About RBL Bank" pane
 * (replica canon: about-us.css .au-about).
 * Authored rows, classified by content (never by index):
 *   tabs — a cell holding a <ul> of links (the page tabs; the link to the current path is active)
 *   pane — [heading + paragraphs] [figure picture]
 * Decode tier: template-slotted — authored nodes are MOVED into the canon's empty slots (EW1).
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

function pathOf(a) {
  try {
    return new URL(a.getAttribute('href'), window.location.href).pathname.replace(/\/$/, '');
  } catch {
    return a.getAttribute('href');
  }
}

function buildTabs(cell) {
  const wrap = el('div', 'tabs-wrap');
  const nav = el('nav', 'page-tabs', { 'aria-label': 'About us navigation' });
  const here = window.location.pathname.replace(/\/$/, '');
  [...cell.children].forEach((node) => nav.append(node));
  nav.querySelectorAll('li').forEach((li) => {
    const a = li.querySelector('a');
    if (a && pathOf(a) === here) {
      li.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });
  wrap.append(nav);
  return wrap;
}

export default function decorate(block) {
  const container = el('div', 'container');
  const pane = el('div', 'intro-pane');
  const row = el('div', 'row');
  const textCol = el('div', 'col-lg-6');
  const text = el('div', 'intro-text');
  const figCol = el('div', 'col-lg-6');
  const figure = el('div', 'intro-figure');
  let tabs = null;

  [...block.children].forEach((r) => {
    const cells = [...r.children];
    if (cells.length === 1 && cells[0].querySelector('ul a')) {
      tabs = buildTabs(cells[0]);
      return;
    }
    cells.forEach((cell) => {
      if (media(cell) && !cell.textContent.trim()) figure.append(media(cell));
      else [...cell.children].forEach((node) => text.append(node));
    });
  });

  textCol.append(text);
  row.append(textCol);
  if (figure.children.length) {
    figCol.append(figure);
    row.append(figCol);
  }
  pane.append(row);
  if (tabs) {
    tabs.append(pane);
    container.append(tabs);
  } else container.append(pane);
  block.replaceChildren(container);
}
