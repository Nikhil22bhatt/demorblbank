import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * RBL Bank header — template-slotted chrome (replica canon: shared/header.html + chrome.js).
 * The authored /nav document carries six default-content sections, in order:
 *   1 utility strip list · 2 logo · 3 mega menus (nested lists) · 4 Products promo cards
 *   5 tools (search, WhatsApp, alerts, Login list) · 6 mobile products drawer (h5 + nested list)
 * Authored nodes are MOVED into the canon's empty slots, never rebuilt from text.
 * @ew-exempt chrome glue text (a11y launcher, hamburger and breadcrumb labels) is
 * presentational: it names controls the /nav document does not author.
 */

const DESKTOP = window.matchMedia('(width >= 768px)');
const ICON_ALT = { property: 'Property Logo' };

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function hidden(label) {
  const span = el('span', 'visually-hidden');
  span.textContent = label;
  return span;
}

function iconImg(name, alt = '') {
  const img = el('img', '', { src: `${window.hlx.codeBasePath}/icons/${name}.svg`, alt });
  return img;
}

/* the delivered shape wraps a list item's lead link in <p> (#98) — unwrap it */
function unwrapP(li) {
  li.querySelectorAll(':scope > p').forEach((p) => p.replaceWith(...p.childNodes));
}

/* the lead of a list item: its own link, or its own text wrapped in a span */
function itemHead(li, className) {
  unwrapP(li);
  const a = li.querySelector(':scope > a');
  if (a) {
    a.className = className;
    return a;
  }
  const span = el('span', className);
  const nodes = [...li.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  if (!nodes.length) return null;
  nodes[0].before(span);
  nodes.forEach((n) => span.append(n));
  return span;
}

/* icons arrive as span.icon > img (decorateIcons); give the img its control name */
function nameIcons(root) {
  root.querySelectorAll('span.icon').forEach((span) => {
    const img = span.querySelector('img');
    if (!img) return;
    const name = [...span.classList].find((c) => c.startsWith('icon-')).slice(5);
    img.alt = img.alt || ICON_ALT[name] || name;
    img.removeAttribute('width');
    img.removeAttribute('height');
    img.loading = 'eager';
    span.replaceWith(img);
  });
}

function sectionOf(fragment, index) {
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('img'));
  return sections[index]?.querySelector('.default-content-wrapper') || sections[index];
}

/* ---- promo card: li of <p>title</p><p><a>cta</a></p><p><picture></p> ---- */
function buildCard(li, light) {
  const card = el('div', `mega-card mega-card-${light ? 'light' : 'dark'}`);
  const text = el('div', 'mega-card-text');
  const media = el('div', 'mega-card-img');
  const pic = li.querySelector('picture, img');
  const ps = [...li.querySelectorAll(':scope > p')];
  const ctaP = ps.find((p) => p.querySelector('a'));
  const titleP = ps.find((p) => p !== ctaP && !p.querySelector('picture, img'));
  if (titleP) {
    titleP.className = 'mega-card-title';
    text.append(titleP);
  }
  if (ctaP) {
    ctaP.querySelector('a').className = 'mega-card-btn';
    text.append(ctaP);
  }
  if (pic) media.append(pic);
  card.append(text, media);
  return card;
}

/* ---- desktop mega menu lists (tb-megamenu levels) ---- */
function decorateMegaList(ul, level) {
  ul.className = `mega-list mega-list-l${level}`;
  [...ul.children].forEach((li) => {
    li.className = 'mega-item';
    const head = itemHead(li, 'mega-link');
    const badge = li.querySelector(':scope > .icon-new-badge');
    if (badge) {
      badge.remove();
      if (head) head.classList.add('mega-link-new');
    }
    const sub = li.querySelector(':scope > ul');
    if (sub) {
      li.classList.add('mega-item-parent');
      decorateMegaList(sub, level + 1);
    }
  });
}

/* live shows the first parent branch open by default, level by level */
function openFirstBranch(ul) {
  const first = ul.children[0];
  if (!first || !first.classList.contains('mega-item-parent')) return;
  first.classList.add('is-active');
  openFirstBranch(first.querySelector(':scope > ul'));
}

function slug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildMenu(menuUl, cardsUl) {
  menuUl.className = 'site-nav-menu';
  const here = window.location.pathname.replace(/\/$/, '') || '/';
  [...menuUl.children].forEach((li, i) => {
    li.className = 'site-nav-item';
    const sub = li.querySelector(':scope > ul');
    const toggle = itemHead(li, 'site-nav-toggle');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.append(' ', el('span', 'caret', { 'aria-hidden': 'true' }));
    const mega = el('div', `mega mega-${slug(toggle.textContent)}`);
    if (i === 0 && cardsUl) {
      const cards = el('div', 'mega-cards');
      [...cardsUl.children].forEach((card, n) => cards.append(buildCard(card, n === 0)));
      mega.append(cards);
    }
    if (sub) {
      decorateMegaList(sub, 1);
      openFirstBranch(sub);
      mega.append(sub);
      const paths = [...sub.querySelectorAll('a[href]')].map((a) => new URL(a.href).pathname);
      if (here !== '/' && paths.includes(here)) toggle.classList.add('site-nav-toggle-active');
    }
    li.append(mega);
  });
  return menuUl;
}

/* ---- tools: search / WhatsApp / alerts circles + the Login dropdown ---- */
function buildTools(toolsUl) {
  const actions = el('div', 'site-nav-actions');
  [...toolsUl.children].forEach((li) => {
    unwrapP(li);
    const sub = li.querySelector(':scope > ul');
    if (sub) {
      const login = el('div', 'login');
      const btn = itemHead(li, 'btn-login');
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      sub.className = 'login-menu';
      [...sub.children].forEach((item) => {
        const group = item.querySelector(':scope > ul');
        if (!group) {
          unwrapP(item);
          return;
        }
        item.className = 'login-group';
        itemHead(item, 'login-label');
      });
      login.append(btn, sub);
      actions.append(login);
      return;
    }
    const a = li.querySelector(':scope > a');
    const circle = a || el('button', '', { type: 'button' });
    circle.classList.add('circle-btn');
    if (!a) circle.append(...li.childNodes);
    if (circle.querySelector('.icon-bell')) circle.prepend(el('span', 'note-badge'));
    actions.append(circle);
  });
  return actions;
}

/* ---- mobile products drawer (#modal-products, acnav levels) ---- */
function decorateAcList(ul, level) {
  ul.className = `acnav-list acnav-list-level${level}`;
  [...ul.children].forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    const isCards = sub && sub.querySelector(':scope > li > p picture, :scope > li > p img');
    if (isCards) {
      li.className = 'acnav-cards';
      itemHead(li, 'acnav-cards-title');
      const row = el('div', 'acnav-cards-row');
      [...sub.children].forEach((card, n) => row.append(buildCard(card, n === 0)));
      sub.replaceWith(row);
      return;
    }
    if (sub) {
      li.className = 'has-children';
      const label = el('div', `acnav-label acnav-label-level${level}`);
      unwrapP(li);
      const lead = [...li.childNodes].filter((n) => n !== sub);
      label.append(...lead);
      li.prepend(label);
      decorateAcList(sub, level + 1);
      return;
    }
    unwrapP(li);
    const a = li.querySelector(':scope > a');
    if (a) a.className = `acnav-link acnav-link-level${level}`;
  });
}

function buildDrawer(drawerWrap) {
  const drawer = el('div', 'drawer', {
    id: 'modal-products', role: 'dialog', 'aria-modal': 'true', 'aria-hidden': 'true',
  });
  const dialog = el('div', 'drawer-dialog');
  const head = el('div', 'drawer-header');
  const title = drawerWrap.querySelector('h1, h2, h3, h4, h5, h6');
  if (title) {
    title.classList.add('drawer-title');
    drawer.setAttribute('aria-labelledby', title.id || 'drawer-title');
    if (!title.id) title.id = 'drawer-title';
    head.append(title);
  }
  head.append(el('button', 'drawer-close', { type: 'button', 'aria-label': 'Close' }));
  const body = el('div', 'drawer-body');
  const acnav = el('nav', 'acnav');
  const list = drawerWrap.querySelector(':scope > ul');
  if (list) {
    decorateAcList(list, 1);
    acnav.append(list);
  }
  body.append(acnav);
  dialog.append(head, body);
  drawer.append(el('span', 'drawer-overlay'), dialog);
  return drawer;
}

function buildBreadcrumb() {
  const bar = el('div', 'breadcrumb-bar');
  const nav = el('nav', '', { 'aria-label': 'Breadcrumbs' });
  const ol = el('ol', 'breadcrumb');
  const home = el('li');
  const a = el('a', '', { href: '/' });
  a.textContent = 'Home';
  home.append(a);
  const segs = window.location.pathname.split('/').filter(Boolean);
  const current = el('li', '', { 'aria-current': 'page' });
  const last = segs.length ? segs[segs.length - 1] : '';
  current.textContent = getMetadata('breadcrumb')
    || last.replace(/-/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
  ol.append(home, current);
  nav.append(ol);
  bar.append(nav);
  return bar;
}

/* ---- behaviours that fire on live (progress.json types.form.motion) ---- */
function bindMenus(nav) {
  const items = [...nav.querySelectorAll('.site-nav-item')];
  const closeAll = (except) => items.forEach((item) => {
    if (item === except) return;
    item.classList.remove('open');
    item.querySelector('.site-nav-toggle').setAttribute('aria-expanded', 'false');
  });
  const open = (item) => {
    closeAll(item);
    item.classList.add('open');
    item.querySelector('.site-nav-toggle').setAttribute('aria-expanded', 'true');
  };
  items.forEach((item) => {
    const toggle = item.querySelector('.site-nav-toggle');
    item.addEventListener('mouseenter', () => open(item));
    item.addEventListener('mouseleave', () => closeAll());
    toggle.addEventListener('click', () => open(item));
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (item.classList.contains('open')) closeAll();
        else open(item);
      }
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-nav-item')) closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  /* sub-levels: hovering an item shows only its own children */
  nav.querySelectorAll('.mega-item').forEach((li) => {
    const head = li.querySelector(':scope > .mega-link');
    const parent = li.classList.contains('mega-item-parent');
    if (parent && head) head.setAttribute('aria-expanded', li.classList.contains('is-active'));
    li.addEventListener('mouseenter', () => {
      [...li.parentNode.children].forEach((sib) => {
        if (sib === li) return;
        sib.classList.remove('is-active');
        sib.querySelectorAll('.is-active').forEach((o) => o.classList.remove('is-active'));
        const h = sib.querySelector(':scope > .mega-link');
        if (h && h.hasAttribute('aria-expanded')) h.setAttribute('aria-expanded', 'false');
      });
      if (parent) {
        li.classList.add('is-active');
        if (head) head.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function bindDrawer(block) {
  const drawer = block.querySelector('.drawer');
  const set = (on) => {
    drawer.classList.toggle('show', on);
    drawer.setAttribute('aria-hidden', on ? 'false' : 'true');
    document.body.classList.toggle('modal-open', on);
  };
  block.querySelector('.mobile-nav-hamb').addEventListener('click', () => set(true));
  drawer.querySelector('.drawer-close').addEventListener('click', () => set(false));
  drawer.querySelector('.drawer-overlay').addEventListener('click', () => set(false));
  drawer.querySelectorAll('.has-children > .acnav-label').forEach((label) => {
    label.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      label.parentNode.classList.toggle('is-open');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('show')) set(false);
  });
}

/* scroll morph (live scroll-init.js 500px; barrio.js 50px + direction; homepage ticker 300px) */
function bindScroll() {
  const { body } = document;
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    body.classList.toggle('fixed-tab-body', y >= 500);
    body.classList.toggle('body-active-effect', y >= 500);
    body.classList.toggle('scrolled', y > 50);
    body.classList.toggle('scrolldown', y > lastY);
    body.classList.toggle('scrollup', y <= lastY);
    if (body.classList.contains('landing')) body.classList.toggle('notice-hidden', y >= 300);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  const [util, brand, menu, cards, tools, drawerWrap] = [0, 1, 2, 3, 4, 5]
    .map((i) => sectionOf(fragment, i));
  block.textContent = '';

  /* utility strip */
  const topbar = el('div', 'topbar');
  const strip = el('div', 'container');
  const utilUl = util.querySelector('ul');
  utilUl.className = 'topbar-list';
  const contrast = ['topbar-contrast-light', 'topbar-contrast-dark'];
  [...utilUl.children].forEach((li) => {
    unwrapP(li);
    if (li.querySelector('.icon')) li.className = 'topbar-property topbar-property-desktop';
    const a = li.querySelector('a');
    if (a && li.querySelector('.icon')) a.prepend(li.querySelector('.icon'));
    if (a && a.textContent.trim().length === 1) {
      a.className = `topbar-contrast ${contrast.shift()}`;
      if (a.title) a.append(hidden(a.title)); // @ew-exempt derived from the authored link title
    }
  });
  const mobileUl = el('ul', 'topbar-list topbar-list-mobile');
  const prop = utilUl.querySelector('.topbar-property');
  if (prop) {
    const clone = prop.cloneNode(true);
    clone.className = 'topbar-property';
    mobileUl.append(clone);
  }
  strip.append(utilUl, mobileUl);
  topbar.append(strip);

  const a11y = el('button', 'a11y-launcher', { type: 'button' });
  a11y.append(iconImg('aioa'), hidden('Accessibility'));

  /* desktop nav */
  const siteNav = el('nav', 'site-nav', { 'aria-label': 'Main navigation' });
  const inner = el('div', 'container site-nav-inner');
  const brandBox = el('div', 'site-nav-brand');
  const homeLink = el('a', '', { href: '/' });
  const logo = brand.querySelector('picture, img');
  homeLink.append(logo);
  logo.querySelector('img')?.classList.add('site-nav-logo');
  if (logo.tagName === 'IMG') logo.classList.add('site-nav-logo');
  brandBox.append(homeLink);
  const actions = buildTools(tools.querySelector('ul'));
  inner.append(brandBox, buildMenu(menu.querySelector('ul'), cards.querySelector('ul')), actions);
  siteNav.append(inner);

  /* mobile header (< 768): presentational clones of the brand and the three circles */
  const mobileNav = el('nav', 'mobile-nav', { 'aria-label': 'Mobile navigation' });
  const row = el('div', 'mobile-nav-row');
  const mBrand = el('div', 'mobile-nav-brand');
  const hamb = el('button', 'mobile-nav-hamb', { type: 'button' });
  hamb.append(iconImg('mobile-more'), hidden('More about banking products'));
  const mHome = homeLink.cloneNode(true);
  mHome.querySelector('img').className = 'mobile-nav-logo';
  mBrand.append(hamb, mHome);
  const mActions = el('div', 'mobile-nav-actions');
  actions.querySelectorAll(':scope > .circle-btn').forEach((c) => mActions.append(c.cloneNode(true)));
  row.append(mBrand, mActions);
  mobileNav.append(row);

  block.append(topbar, a11y, siteNav, mobileNav, buildDrawer(drawerWrap));
  if (!document.body.classList.contains('landing')) block.append(buildBreadcrumb());
  nameIcons(block);

  bindMenus(siteNav);
  bindDrawer(block);
  bindScroll();
  DESKTOP.addEventListener('change', () => document.body.classList.remove('modal-open'));
}
