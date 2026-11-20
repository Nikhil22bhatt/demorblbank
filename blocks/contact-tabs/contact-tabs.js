/*
 * contact-tabs — the contact-us page module (replica canon: contact-us.css + chrome.js).
 * Authored rows, classified by content (never by index):
 *   tabs     — a cell holding a <ul> of links (the page tabs; the current path is active)
 *   card     — [icon picture] [heading + description + CTA] [background picture]
 *   offices  — [icon] [heading + lines] [icon] [heading + lines] [background picture]
 *   faq head — a cell holding only an <h2>
 *   faq item — [question <p>] [answer paragraphs]
 * Decode tiers: template-slotted (tabs, offices card), reconstructive (cards, FAQ).
 * Authored nodes are MOVED into the canon's empty slots (EW1); wrappers carry the classes.
 */

const MOBILE_TAB_TOP = window.matchMedia('(width >= 768px)');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/* a cell's authored elements; a picture-led cell folded into one <p> (#104) is expanded */
function items(cell) {
  const out = [];
  [...cell.children].forEach((child) => {
    if (child.tagName === 'P' && child.querySelector(':scope > picture, :scope > img')
      && child.children.length > 1) {
      out.push(...child.children);
    } else out.push(child);
  });
  return out;
}

function pathOf(a) {
  try {
    return new URL(a.getAttribute('href'), window.location.href).pathname.replace(/\/$/, '');
  } catch {
    return a.getAttribute('href');
  }
}

function media(node) {
  if (!node) return null;
  return node.matches('picture, img') ? node : node.querySelector('picture, img');
}

function classify(row) {
  const cells = [...row.children];
  const pics = cells.filter((c) => media(c) && !c.querySelector('h1, h2, h3, h4, h5, h6, p a'));
  const texts = cells.filter((c) => !pics.includes(c));
  if (cells.length === 1 && cells[0].querySelector('ul a')) return { type: 'tabs', cells };
  if (cells.length === 1 && cells[0].querySelector('h2')) return { type: 'faq-head', cells };
  if (texts.length >= 2 && pics.length >= 3) return { type: 'offices', cells };
  if (pics.length >= 1 && texts.length === 1) return { type: 'card', cells };
  return { type: 'faq', cells };
}

function buildTabs(cell) {
  const outer = el('div', 'tab-wrap-outer');
  const wrap = el('div', 'tab-wrap');
  const container = el('div', 'container');
  const nav = el('nav', 'page-tabs', { 'aria-label': 'Contact navigation' });
  const here = window.location.pathname.replace(/\/$/, '');
  items(cell).forEach((node) => nav.append(node));
  nav.querySelectorAll('li').forEach((li) => {
    const a = li.querySelector('a');
    if (a && pathOf(a) === here) {
      li.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });
  container.append(nav);
  wrap.append(container);
  outer.append(wrap);
  return outer;
}

function titleBox(iconCell, textItems) {
  const title = el('div', 'title-cont');
  const icon = media(iconCell);
  if (icon) title.append(icon);
  const heading = textItems.find((n) => /^H[1-6]$/.test(n.tagName)) || textItems[0];
  if (heading) {
    const box = el('div', 'card-title');
    box.append(heading);
    title.append(box);
  }
  return title;
}

function buildCard(cells) {
  const [iconCell, textCell, bgCell] = cells;
  const col = el('div', 'col-md-4');
  const card = el('div', 'card-cont');
  const textItems = items(textCell);
  card.append(titleBox(iconCell, textItems));
  const desc = el('div', 'desc-cont');
  textItems.filter((n) => n.closest('.title-cont') === null)
    .forEach((n) => desc.append(n));
  card.append(desc);
  const bg = media(bgCell);
  if (bg) card.append(bg);
  col.append(card);
  return col;
}

/* offices: live wraps the first address and the phone lines in a padded <span> */
function buildOffices(cells) {
  const col12 = el('div', 'col-md-12');
  const card = el('div', 'card-cont card-cont-offices');
  const row = el('div', 'row');
  const bg = media(cells[cells.length - 1]);
  for (let i = 0; i + 1 < cells.length - 1; i += 2) {
    const col = el('div', 'col-md-6');
    const textItems = items(cells[i + 1]);
    col.append(titleBox(cells[i], textItems));
    const desc = el('div', 'desc-cont');
    textItems.filter((n) => n.closest('.title-cont') === null).forEach((n, k) => {
      const line = el('div', 'office-line');
      if (n.querySelector('a[href^="tel:"]') || (i === 0 && k === 0)) line.classList.add('is-boxed');
      line.append(n);
      desc.append(line);
    });
    col.append(desc);
    row.append(col);
  }
  card.append(row);
  if (bg) card.append(bg);
  col12.append(card);
  return col12;
}

/* FAQ accordion (live: Bootstrap collapse, one open at a time, height 0.35s ease).
   EW7: the question stays a <p> in a div; the whole header row takes the click. */
function setPanel(card, expand) {
  const header = card.querySelector('.faq-card-header');
  const toggle = card.querySelector('.faq-card-toggle');
  const panel = card.querySelector('.faq-card-body');
  if (!panel) return;
  toggle.setAttribute('aria-expanded', expand ? 'true' : 'false');
  header.classList.toggle('collapsed', !expand);
  panel.classList.remove('collapse', 'show');
  if (expand) {
    panel.hidden = false;
    const h = panel.scrollHeight;
    panel.style.height = '0px';
    panel.classList.add('collapsing');
    panel.getBoundingClientRect();
    panel.style.height = `${h}px`;
  } else {
    if (panel.hidden) return;
    panel.style.height = `${panel.scrollHeight}px`;
    panel.classList.add('collapsing');
    panel.getBoundingClientRect();
    panel.style.height = '0px';
  }
  panel.addEventListener('transitionend', function done() {
    panel.removeEventListener('transitionend', done);
    panel.classList.remove('collapsing');
    panel.classList.add('collapse');
    panel.style.height = '';
    if (toggle.getAttribute('aria-expanded') === 'true') panel.classList.add('show');
    else panel.hidden = true;
  });
}

function buildFaqCard(cells, n, list) {
  const [qCell, aCell] = cells;
  const id = `faq-${n + 1}`;
  const card = el('div', 'faq-card');
  const header = el('div', 'faq-card-header collapsed', { id: `heading-${id}` });
  const toggle = el('div', 'faq-card-toggle', {
    role: 'button', tabindex: '0', 'aria-expanded': 'false', 'aria-controls': `collapse-${id}`,
  });
  items(qCell).forEach((node) => toggle.append(node));
  header.append(toggle);
  const body = el('div', 'faq-card-body collapse', {
    id: `collapse-${id}`, role: 'region', 'aria-labelledby': `heading-${id}`,
  });
  body.hidden = true;
  if (aCell) items(aCell).forEach((node) => body.append(node));
  card.append(header, body);
  const flip = (e) => {
    if (e.target.closest('a')) return;
    const expand = toggle.getAttribute('aria-expanded') !== 'true';
    list.querySelectorAll('.faq-card').forEach((other) => {
      if (other === card) return;
      if (other.querySelector('.faq-card-toggle').getAttribute('aria-expanded') === 'true') {
        setPanel(other, false);
      }
    });
    setPanel(card, expand);
  };
  header.addEventListener('click', flip);
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flip(e);
    }
  });
  return card;
}

/* live scroll-init.js: at scrollTop >= 500 the tab strip turns fixed (.fixed-tab) */
function bindStickyTabs(block) {
  const wrap = block.querySelector('.tab-wrap');
  if (!wrap) return;
  const onScroll = () => wrap.classList.toggle('fixed-tab', window.scrollY >= 500);
  window.addEventListener('scroll', onScroll, { passive: true });
  MOBILE_TAB_TOP.addEventListener('change', onScroll);
  onScroll();
}

export default function decorate(block) {
  const rows = [...block.children].map(classify);
  const section = el('div', 'contact-section');
  const container = el('div', 'container');
  const deck = el('div', 'card-deck-tab');
  const outerRow = el('div', 'row');
  const field = el('div', 'row contact-field');
  const contus = el('div', 'contus');
  const cardRow = el('div', 'row');
  const officeRow = el('div', 'row mt40');
  const faqContainer = el('div', 'container faq-container');
  const faqRow = el('div', 'row');
  const faqCol = el('div', 'col-12');
  const faqList = el('div', 'faq-list');
  let faqHead = null;
  let tabs = null;
  let faqCount = 0;

  rows.forEach(({ type, cells }) => {
    if (type === 'tabs') tabs = buildTabs(cells[0]);
    else if (type === 'card') cardRow.append(buildCard(cells));
    else if (type === 'offices') officeRow.append(buildOffices(cells));
    else if (type === 'faq-head') {
      faqHead = el('div', 'right-border-h2');
      items(cells[0]).forEach((node) => faqHead.append(node));
    } else {
      faqList.append(buildFaqCard(cells, faqCount, faqList));
      faqCount += 1;
    }
  });

  contus.append(cardRow);
  if (officeRow.children.length) contus.append(officeRow);
  field.append(contus);
  if (faqHead) field.append(faqHead);
  if (faqCount) {
    faqCol.append(faqList);
    faqRow.append(faqCol);
    faqContainer.append(faqRow);
    field.append(faqContainer);
  }
  outerRow.append(field);
  deck.append(outerRow);
  container.append(deck);
  if (tabs) section.append(tabs);
  section.append(container);
  block.replaceChildren(section);
  bindStickyTabs(block);
}
