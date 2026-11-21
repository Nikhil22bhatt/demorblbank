/*
 * Header block.
 * Content comes from the nav fragment (content/nav.plain.html locally, /nav.plain.html on
 * DA/EDS). The fragment carries five flat sections, in order:
 *   1 utility strip (list)    2 brand (logo link)    3 menu (nested lists + promo list)
 *   4 tools (search, chat, notifications, login)    5 mobile tab bar (list)
 * This file only reads that content and builds the interactive chrome around it.
 */

const DESKTOP = window.matchMedia('(width >= 900px)');
const SECTION_NAMES = ['utility', 'brand', 'sections', 'tools', 'tabbar'];

const isText = (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim();

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function slug(text) {
  return (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* metadata-independent dual fetch: /content first (localhost), then root (DA/EDS prod) */
async function fetchNav() {
  let url = '/content/nav.plain.html';
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    url = '/nav.plain.html';
    resp = await fetch('/nav.plain.html');
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  // relative media paths are relative to the fragment, not the page
  const base = new URL(url, window.location.href);
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), base).href;
  });
  doc.querySelectorAll('source[srcset]').forEach((source) => {
    source.srcset = new URL(source.getAttribute('srcset'), base).href;
  });
  return doc.body;
}

/* a list item's own label: its direct link, or its own text wrapped in a span */
function itemLabel(li) {
  li.querySelectorAll(':scope > p').forEach((p) => {
    if (!p.querySelector('img') || p.querySelector('a')) p.replaceWith(...p.childNodes);
  });
  const a = li.querySelector(':scope > a');
  if (a) return a;
  const nodes = [...li.childNodes].filter(isText);
  if (!nodes.length) return null;
  const span = el('span');
  nodes[0].before(span);
  nodes.forEach((n) => span.append(n));
  span.textContent = span.textContent.trim();
  return span;
}

/* a "#" link is a label, not a destination */
function toLabel(a, className) {
  if (a.tagName === 'A' && a.getAttribute('href') !== '#') {
    a.classList.add(className);
    return a;
  }
  const span = el('span', `${className} nav-label`, { tabindex: '0', role: 'button' });
  span.append(...a.childNodes);
  a.replaceWith(span);
  return span;
}

function hiddenText(root) {
  root.querySelectorAll('em').forEach((em) => {
    const span = el('span', 'visually-hidden');
    span.append(...em.childNodes);
    em.replaceWith(span);
  });
}

function closeAll(nav, except) {
  nav.querySelectorAll('.nav-open').forEach((item) => {
    if (item === except) return;
    item.classList.remove('nav-open');
    const t = item.querySelector(':scope > [aria-expanded]');
    if (t) t.setAttribute('aria-expanded', 'false');
    const panel = item.querySelector(':scope > .nav-panel');
    if (panel) panel.style.removeProperty('--nav-panel-shift');
  });
}

/* keep a dropdown inside the viewport (source overflows at narrow desktop widths) */
function containPanel(panel) {
  panel.style.removeProperty('--nav-panel-shift');
  const r = panel.getBoundingClientRect();
  const max = document.documentElement.clientWidth - 8;
  let shift = 0;
  if (r.right > max) shift = max - r.right;
  if (r.left + shift < 8) shift = 8 - r.left;
  if (shift) panel.style.setProperty('--nav-panel-shift', `${Math.round(shift)}px`);
}

/* cascading columns: the hovered item reveals its own list, siblings close */
function activate(li) {
  [...li.parentElement.children].forEach((sib) => {
    if (sib !== li) sib.classList.remove('nav-active');
  });
  if (li.classList.contains('nav-has-children')) li.classList.add('nav-active');
}

function resetColumns(panel) {
  panel.querySelectorAll('.nav-active').forEach((li) => li.classList.remove('nav-active'));
  let list = panel.querySelector('.nav-col');
  while (list) {
    const first = list.querySelector(':scope > li');
    if (!first || !first.classList.contains('nav-has-children')) break;
    first.classList.add('nav-active');
    list = first.querySelector(':scope > ul');
  }
}

function decorateColumn(ul, depth) {
  ul.classList.add('nav-col', `nav-col-${depth}`);
  [...ul.children].forEach((li) => {
    const label = itemLabel(li);
    if (label) toLabel(label, 'nav-link');
    const sub = li.querySelector(':scope > ul');
    if (sub) {
      li.classList.add('nav-has-children');
      decorateColumn(sub, depth + 1);
    }
    li.addEventListener('mouseenter', () => activate(li));
    li.addEventListener('focusin', () => activate(li));
  });
}

function buildPromos(ul) {
  const wrap = el('div', 'nav-promos');
  [...ul.children].forEach((li) => {
    const card = el('div', 'nav-promo');
    const img = li.querySelector('img');
    const pic = img && (img.closest('picture') || img);
    if (pic) card.append(pic);
    const body = el('div', 'nav-promo-body');
    li.querySelectorAll('p').forEach((p) => {
      if (p.querySelector('a')) {
        p.querySelector('a').classList.add('nav-promo-cta');
        body.append(p);
      } else if (p.textContent.trim()) {
        p.classList.add('nav-promo-title');
        body.append(p);
      }
    });
    card.append(body);
    wrap.append(card);
  });
  return wrap;
}

function buildMenu(section, nav) {
  const ul = section.querySelector('ul');
  if (!ul) return null;
  ul.classList.add('nav-menu');
  [...ul.children].forEach((li) => {
    li.classList.add('nav-item');
    const label = itemLabel(li);
    const lists = [...li.querySelectorAll(':scope > ul')];
    if (!lists.length) {
      if (label) toLabel(label, 'nav-link');
      return;
    }
    const trigger = el('button', 'nav-trigger', { type: 'button', 'aria-expanded': 'false' });
    if (label) {
      trigger.append(...label.childNodes);
      label.replaceWith(trigger);
    } else li.prepend(trigger);
    trigger.id = `nav-trigger-${slug(trigger.textContent)}`;
    li.dataset.navId = slug(trigger.textContent);

    const panel = el('div', 'nav-panel', { role: 'region', 'aria-labelledby': trigger.id });
    const inner = el('div', 'nav-panel-inner');
    lists.forEach((list) => {
      if (list.querySelector(':scope > li img') && !list.querySelector(':scope > li > ul')) {
        panel.classList.add('nav-panel-mega');
        inner.append(buildPromos(list));
        list.remove();
      } else {
        decorateColumn(list, 1);
        inner.prepend(list);
      }
    });
    if (inner.querySelector('.nav-col-3')) panel.classList.add('nav-panel-mega');
    panel.append(inner);
    li.append(panel);

    const open = () => {
      if (!DESKTOP.matches) return;
      closeAll(nav, li);
      if (!li.classList.contains('nav-open')) resetColumns(panel);
      li.classList.add('nav-open');
      trigger.setAttribute('aria-expanded', 'true');
      containPanel(panel);
    };
    const close = () => {
      li.classList.remove('nav-open');
      trigger.setAttribute('aria-expanded', 'false');
    };
    li.addEventListener('mouseenter', open);
    li.addEventListener('mouseleave', close);
    // hover drives the panel; a click (or Enter) opens it and never closes a hovered panel
    trigger.addEventListener('click', () => {
      if (!li.classList.contains('nav-open')) open();
    });
  });
  return ul;
}

function buildAccordionList(ul, depth = 1) {
  const list = ul.cloneNode(true);
  list.removeAttribute('class');
  list.querySelectorAll('[class]').forEach((n) => n.removeAttribute('class'));
  list.classList.add('nav-acc', `nav-acc-${depth}`);
  [...list.children].forEach((li) => {
    li.classList.add('nav-acc-item');
    const lists = [...li.querySelectorAll(':scope > ul')];
    let label = itemLabel(li);
    const children = lists.filter((l) => !(l.querySelector(':scope > li img') && !l.querySelector(':scope > li > ul')));
    const promos = lists.filter((l) => !children.includes(l));
    if (label && children.length) {
      const btn = el('button', 'nav-acc-toggle', { type: 'button', 'aria-expanded': 'false' });
      btn.append(...label.childNodes);
      label.replaceWith(btn);
      label = btn;
      const body = el('div', 'nav-acc-body');
      promos.forEach((p) => {
        body.append(buildPromos(p));
        p.remove();
      });
      children.forEach((c) => {
        body.append(buildAccordionList(c, depth + 1));
        c.remove();
      });
      li.append(body);
      // multi-expand, like the source accordion
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    } else if (label) {
      toLabel(label, 'nav-acc-link');
    }
  });
  return list;
}

function buildSearch(li, link, list, nav) {
  const btn = el('button', 'nav-tool-btn', { type: 'button', 'aria-expanded': 'false', 'aria-haspopup': 'dialog' });
  const img = link.querySelector('img');
  btn.append(img);
  btn.setAttribute('aria-label', img.alt || 'Search');
  const action = link.getAttribute('href');
  link.replaceWith(btn);
  const panel = el('div', 'nav-search', { role: 'dialog', 'aria-modal': 'true', 'aria-label': img.alt || 'Search' });
  const box = el('div', 'nav-search-box');
  const close = el('button', 'nav-search-close', { type: 'button', 'aria-label': 'Close' });
  const form = el('form', 'nav-search-form', { action, method: 'get', role: 'search' });
  const icon = img.cloneNode(true);
  icon.alt = '';
  const input = el('input', 'nav-search-input', {
    type: 'search', name: 'search_api_fulltext', placeholder: 'Find products, services, or support...', 'aria-label': img.alt || 'Search', autocomplete: 'off',
  });
  form.append(icon, input);
  box.append(close, form);
  if (list) {
    list.classList.add('nav-search-tags');
    box.append(list);
  }
  panel.append(box);
  li.append(panel);
  const toggle = (show) => {
    li.classList.toggle('nav-open', show);
    btn.setAttribute('aria-expanded', show ? 'true' : 'false');
    document.body.classList.toggle('nav-search-open', show);
    if (show) {
      closeAll(nav, li);
      input.focus();
    }
  };
  btn.addEventListener('click', () => toggle(!li.classList.contains('nav-open')));
  close.addEventListener('click', () => toggle(false));
  panel.addEventListener('click', (e) => { if (e.target === panel) toggle(false); });
}

function buildDropdown(li, label, list, nav, kind) {
  const btn = el('button', kind === 'icon' ? 'nav-tool-btn' : 'nav-tool-cta', { type: 'button', 'aria-expanded': 'false', 'aria-haspopup': 'true' });
  if (label.tagName === 'IMG' || label.querySelector?.('img')) {
    const img = label.tagName === 'IMG' ? label : label.querySelector('img');
    btn.setAttribute('aria-label', img.alt);
    btn.append(img.closest('picture') || img);
    if (label.parentElement && label !== img && label.tagName !== 'IMG') label.remove();
  } else {
    btn.append(...label.childNodes);
    label.remove();
  }
  li.prepend(btn);
  const panel = el('div', 'nav-tool-panel');
  if (kind === 'icon') {
    list.classList.add('nav-notes');
    [...list.children].forEach((note) => {
      note.classList.add('nav-note');
      const icon = note.querySelector(':scope > img, :scope > picture');
      const body = el('div', 'nav-note-body');
      [...note.childNodes].forEach((n) => { if (n !== icon) body.append(n); });
      note.append(body);
      const title = body.querySelector('strong');
      if (title) title.closest('p').classList.add('nav-note-title');
      body.querySelectorAll('a').forEach((a) => a.closest('p').classList.add('nav-note-link'));
    });
    panel.append(list);
  } else {
    panel.append(buildAccordionList(list));
    list.remove();
  }
  li.append(panel);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const show = !li.classList.contains('nav-open');
    closeAll(nav, li);
    li.classList.toggle('nav-open', show);
    btn.setAttribute('aria-expanded', show ? 'true' : 'false');
  });
}

function buildTools(section, nav) {
  const ul = section.querySelector('ul');
  if (!ul) return;
  ul.classList.add('nav-tools-list');
  [...ul.children].forEach((li) => {
    li.classList.add('nav-tool');
    const list = li.querySelector(':scope > ul');
    const label = itemLabel(li);
    if (label && label.tagName === 'A' && /search/i.test(label.getAttribute('href'))) {
      li.classList.add('nav-tool-search');
      buildSearch(li, label, list, nav);
    } else if (label && label.tagName === 'A') {
      li.classList.add('nav-tool-link');
      label.classList.add('nav-tool-btn');
      const img = label.querySelector('img');
      if (img) label.setAttribute('aria-label', img.alt);
    } else if (list) {
      const img = li.querySelector(':scope > img, :scope > picture, :scope > p > img');
      if (img) {
        li.classList.add('nav-tool-notes');
        buildDropdown(li, img.closest('picture') || img, list, nav, 'icon');
      } else if (label) {
        li.classList.add('nav-tool-login');
        li.dataset.navId = slug(label.textContent);
        buildDropdown(li, label, list, nav, 'cta');
      }
    }
  });
}

function buildDrawer(nav, menuSource, loginSource, tabbar) {
  const drawer = el('div', 'nav-drawer', { id: 'nav-drawer', 'aria-hidden': 'true' });
  const head = el('div', 'nav-drawer-head');
  const title = el('p', 'nav-drawer-title');
  const close = el('button', 'nav-drawer-close', { type: 'button', 'aria-label': 'Close' });
  head.append(title, close);
  const body = el('div', 'nav-drawer-body');
  drawer.append(head, body);

  // which top-level items are claimed by their own tab (e.g. #payments)
  const tabs = tabbar ? [...tabbar.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href').slice(1)) : [];
  const views = {};
  if (menuSource) {
    const menuClone = menuSource.cloneNode(true);
    [...menuClone.children].forEach((li) => {
      const id = slug(li.firstChild && li.firstChild.textContent);
      const own = li.querySelector(':scope > ul');
      if (tabs.includes(id) && own) {
        // a section claimed by its own tab opens straight into its own list
        views[id] = buildAccordionList(own);
        li.remove();
      }
    });
    views.menu = buildAccordionList(menuClone);
  }
  if (loginSource) views[slug(loginSource.dataset.title)] = buildAccordionList(loginSource);

  let lastTrigger = null;
  const setOpen = (view, titleText, trigger) => {
    const show = !!view;
    nav.classList.toggle('nav-drawer-open', show);
    drawer.setAttribute('aria-hidden', show ? 'false' : 'true');
    nav.querySelectorAll('[aria-controls="nav-drawer"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (show) {
      body.replaceChildren(views[view]);
      title.textContent = titleText;
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      lastTrigger = trigger;
    } else if (lastTrigger) {
      lastTrigger = null;
    }
  };
  close.addEventListener('click', () => setOpen(null));
  return { drawer, views, setOpen };
}

function buildTabbar(section) {
  const ul = section.querySelector('ul');
  if (!ul) return null;
  ul.classList.add('nav-tabbar-list');
  [...ul.children].forEach((li) => {
    li.classList.add('nav-tab');
    const a = li.querySelector(':scope > a') || li.querySelector('a');
    const title = li.querySelector(':scope > p');
    if (a) {
      a.classList.add('nav-tab-link');
      const text = [...a.childNodes].filter(isText);
      if (text.length) {
        const span = el('span', 'nav-tab-label');
        text.forEach((n) => span.append(n.textContent.trim()));
        text.forEach((n) => n.remove());
        a.append(span);
      }
      if (title) {
        a.dataset.title = title.textContent.trim();
        title.remove();
      }
    }
  });
  return ul;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const nav = el('nav', '', { id: 'nav', 'aria-label': 'Main navigation' });
  const sections = {};
  [...fragment.children].forEach((section, i) => {
    if (section.tagName !== 'DIV') return;
    const name = SECTION_NAMES[i] || `extra-${i}`;
    section.classList.add(`nav-${name}`);
    sections[name] = section;
  });

  // utility strip
  const { utility } = sections;
  if (utility) {
    hiddenText(utility);
    const ul = utility.querySelector('ul');
    if (ul) {
      ul.classList.add('nav-utility-list');
      [...ul.children].forEach((li, i) => {
        const a = li.querySelector('a');
        if (a && a.querySelector('img')) li.classList.add('nav-utility-property');
        if (a && a.getAttribute('href') === '#') {
          li.classList.add('nav-utility-contrast', `nav-utility-contrast-${i}`);
          a.setAttribute('role', 'button');
          a.setAttribute('aria-pressed', 'false');
          a.addEventListener('click', (e) => {
            e.preventDefault();
            ul.querySelectorAll('.nav-utility-contrast a').forEach((b) => b.setAttribute('aria-pressed', b === a ? 'true' : 'false'));
          });
        }
        if (a && a.getAttribute('href') === '#main') {
          a.addEventListener('click', (e) => {
            const main = document.querySelector('main');
            if (!main) return;
            e.preventDefault();
            main.setAttribute('tabindex', '-1');
            main.focus();
          });
        }
      });
    }
    const inner = el('div', 'nav-utility-inner');
    inner.append(...utility.childNodes);
    utility.append(inner);
  }

  // main bar
  const bar = el('div', 'nav-bar');
  const barInner = el('div', 'nav-bar-inner');
  bar.append(barInner);

  const { brand } = sections;
  if (brand) {
    const link = brand.querySelector('a');
    if (link) link.setAttribute('aria-label', link.querySelector('img')?.alt || 'Home');
    brand.querySelectorAll('p').forEach((p) => p.replaceWith(...p.childNodes));
  }

  const menuSection = sections.sections;
  const menuPristine = menuSection?.querySelector('ul')?.cloneNode(true);
  if (menuSection) buildMenu(menuSection, nav);

  const { tools } = sections;
  let loginPristine = null;
  if (tools) {
    const loginLi = [...tools.querySelectorAll(':scope ul > li')].find((li) => li.querySelector(':scope > ul') && !li.querySelector(':scope > a, :scope > img, :scope > picture, :scope > p'));
    if (loginLi) {
      loginPristine = loginLi.querySelector(':scope > ul').cloneNode(true);
      loginPristine.dataset.title = [...loginLi.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join('').trim();
    }
    buildTools(tools, nav);
  }

  const tabbarSection = sections.tabbar;
  const tabbar = tabbarSection ? buildTabbar(tabbarSection) : null;

  // hamburger (mobile) reuses the menu tab's icon from the fragment
  const hamburger = el('div', 'nav-hamburger');
  const hamButton = el('button', '', {
    type: 'button', 'aria-controls': 'nav-drawer', 'aria-expanded': 'false', 'aria-label': 'Open navigation',
  });
  const menuTab = tabbar?.querySelector('a[href="#menu"]');
  const menuIcon = menuTab?.querySelector('img');
  if (menuIcon) {
    const icon = menuIcon.cloneNode(true);
    icon.alt = '';
    hamButton.append(icon);
  }
  hamburger.append(hamButton);

  barInner.append(hamburger);
  if (brand) barInner.append(brand);
  if (menuSection) barInner.append(menuSection);
  if (tools) barInner.append(tools);

  const { drawer, views, setOpen } = buildDrawer(nav, menuPristine, loginPristine, tabbar);
  const openView = (view, title, trigger) => {
    if (nav.classList.contains('nav-drawer-open') && trigger && trigger.getAttribute('aria-expanded') === 'true') {
      setOpen(null);
      return;
    }
    if (views[view]) setOpen(view, title, trigger);
  };
  hamButton.addEventListener('click', () => openView('menu', menuTab?.dataset.title || menuTab?.textContent.trim() || '', hamButton));
  tabbar?.querySelectorAll('a[href^="#"]').forEach((a) => {
    const view = a.getAttribute('href').slice(1);
    a.setAttribute('role', 'button');
    a.setAttribute('aria-controls', 'nav-drawer');
    a.setAttribute('aria-expanded', 'false');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openView(view, a.dataset.title || a.textContent.trim(), a);
    });
  });

  if (utility) nav.append(utility);
  nav.append(bar, drawer);
  if (tabbarSection) nav.append(tabbarSection);

  // outside click / escape close desktop panels and the drawer
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAll(nav);
    else if (!e.target.closest('.nav-tool, .nav-item')) closeAll(nav);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAll(nav);
    document.body.classList.remove('nav-search-open');
    setOpen(null);
  });

  // viewport change: drop every open state so the other layout starts clean
  DESKTOP.addEventListener('change', () => {
    closeAll(nav);
    document.body.classList.remove('nav-search-open');
    setOpen(null);
    hamButton.setAttribute('aria-expanded', 'false');
  });

  const wrapper = el('div', 'nav-wrapper');
  wrapper.append(nav);
  block.append(wrapper);

  const onScroll = () => wrapper.classList.toggle('nav-scrolled', window.scrollY > 0);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
