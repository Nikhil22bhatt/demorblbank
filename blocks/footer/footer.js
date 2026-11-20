import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * RBL Bank footer — template-slotted chrome (replica canon: shared/footer.html + chrome.js).
 * The authored /footer document carries six default-content sections, in order:
 *   1 link columns (<p> head + <ul>, repeated) · 2 Others (<p> head + lists)
 *   3 legal lines + Follow us + social links · 4 leaving-site notice (h5, text, Proceed link)
 *   5 mobile tab bar list · 6 launchers (chat, back to top)
 * Authored nodes are MOVED into the canon's empty slots, never rebuilt from text.
 * @ew-exempt the accordion toggles and social glyphs are presentational (no authored text).
 */

const MOBILE = window.matchMedia('(width < 768px)');
const SOCIAL = [
  ['facebook.', 'a-fb', 'fa-facebook'],
  ['linkedin.', 'a-linkedin', 'fa-linkedin'],
  ['twitter.', 'a-twitter', ''],
  ['x.com', 'a-twitter', ''],
  ['instagram.', 'a-insta', 'fa-instagram'],
  ['youtube.', 'a-yt', 'fa-youtube-play'],
];
const TAB_ALT = {
  home: 'Mobile Home', login: 'Login', payments: 'Payments', 'mobile-more': 'More',
};
const X_PATH = 'M389 48h71L305 224l182 240H345L233 318 106 464H35l165-189L25 48h146l101 133zm-25 '
  + '374h39L152 88h-42z';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function faIcon(name) {
  const i = el('i', `fa ${name}`, { 'aria-hidden': 'true' });
  i.textContent = '‌';
  return i;
}

function xIcon() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 512 512');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', X_PATH);
  svg.append(path);
  return svg;
}

function sectionOf(fragment, index) {
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('img'));
  return sections[index]?.querySelector('.default-content-wrapper') || sections[index];
}

function unwrapP(li) {
  li.querySelectorAll(':scope > p').forEach((p) => p.replaceWith(...p.childNodes));
}

/* icons arrive as span.icon > img (decorateIcons) — use the img itself */
function flattenIcon(span, alt = '') {
  const img = span.querySelector('img');
  if (!img) return span;
  img.alt = alt;
  img.removeAttribute('width');
  img.removeAttribute('height');
  span.replaceWith(img);
  return img;
}

function head(p, withRule) {
  p.className = 'footer-head h6';
  if (withRule) p.append(' ', el('span', 'underline'), ' ', faIcon('fa-plus footer-head-toggle'));
  else {
    const em = el('em');
    em.append(faIcon('fa-plus footer-head-toggle'));
    p.append(' ', em);
  }
  return p;
}

function buildColumns(wrap) {
  const cols = el('div', 'footer-cols');
  [...wrap.querySelectorAll(':scope > p')].forEach((p) => {
    const list = p.nextElementSibling;
    const label = p.previousElementSibling;
    const col = el('nav', 'footer-col', { 'aria-label': p.textContent.trim() });
    /* the live column's screen-reader heading (authored h2 before the visible head) */
    if (label && /^H[1-6]$/.test(label.tagName)) {
      label.classList.add('visually-hidden');
      col.append(label);
    }
    col.append(head(p, true));
    if (list && list.tagName === 'UL') {
      list.className = 'footer-list';
      list.querySelectorAll(':scope > li').forEach(unwrapP);
      col.append(list);
    }
    cols.append(col);
  });
  return cols;
}

function buildOthers(wrap) {
  const row = el('div', 'others-row');
  const left = el('div', 'col-lg-1');
  const right = el('div', 'col-lg-11 others-wrap');
  const lists = [...wrap.querySelectorAll(':scope > ul')];
  const label = wrap.querySelector(':scope > p');
  if (label) left.append(head(label, false));
  const toggleWrap = el('p', 'others-toggle-wrap');
  const toggle = el('a', 'others-toggle', { href: '#', 'aria-label': 'Collapse section' });
  const em = el('em');
  em.append(faIcon('fa-minus'));
  toggle.append(em);
  toggleWrap.append(toggle);
  right.append(toggleWrap);
  lists.forEach((ul, i) => {
    ul.className = i ? 'others-list others-list-more' : 'others-list';
    ul.querySelectorAll(':scope > li').forEach((li) => {
      unwrapP(li);
      const a = li.querySelector(':scope > a');
      const pic = li.querySelector(':scope > picture, :scope > img');
      if (a && pic) {
        const sup = el('sup');
        sup.append(pic);
        a.append(' ', sup);
      }
      if (a && /(^|\.)rbi\.org\.in$/.test(new URL(a.href).hostname)) a.className = 'others-list-btn';
    });
    right.append(ul);
  });
  row.append(left, right);
  return row;
}

function buildLegal(wrap) {
  const legal = el('div', 'footer-legal');
  const left = el('div', 'col-lg-6');
  const right = el('div', 'col-lg-6');
  const ps = [...wrap.querySelectorAll(':scope > p')];
  const social = wrap.querySelector(':scope > ul');
  const follow = social ? social.previousElementSibling : null;
  ps.filter((p) => p !== follow).forEach((p) => {
    p.className = 'pbottom';
    left.append(p);
  });
  if (social) {
    social.className = 'follow-us';
    social.querySelectorAll(':scope > li').forEach((li) => {
      unwrapP(li);
      const a = li.querySelector('a');
      if (!a) return;
      const host = new URL(a.href).hostname;
      const [, cls, fa] = SOCIAL.find(([h]) => host.includes(h)) || [];
      const label = el('span', 'visually-hidden');
      label.append(...a.childNodes);
      const em = el('em');
      if (fa) em.append(faIcon(fa));
      a.append(fa ? em : xIcon(), label);
      if (cls) a.className = cls;
    });
    if (follow && follow.tagName === 'P') {
      const li = el('li', 'follow-us-item-label');
      follow.className = 'follow-us-label';
      li.append(follow);
      social.prepend(li);
    }
    right.append(social);
  }
  const first = left.querySelector('.pbottom');
  if (first) {
    const mobile = first.cloneNode(true);
    mobile.className = 'copyright-mobile';
    right.append(mobile);
  }
  legal.append(left, right);
  return legal;
}

function buildModal(wrap) {
  const modal = el('div', 'modal', {
    id: 'attention-modal-rbi', role: 'dialog', 'aria-labelledby': 'attention-modal-rbi-title',
  });
  modal.hidden = true;
  const dialog = el('div', 'modal-dialog');
  const header = el('div', 'modal-header');
  const body = el('div', 'modal-body');
  const foot = el('div', 'modal-footer');
  const title = wrap.querySelector('h1, h2, h3, h4, h5, h6');
  if (title) {
    title.className = 'modal-title';
    title.id = 'attention-modal-rbi-title';
    header.append(title);
  }
  const close = el('p');
  close.append(el('button', 'modal-close', { type: 'button', 'aria-label': 'Close' }));
  header.append(close);
  [...wrap.querySelectorAll(':scope > p')].forEach((p) => {
    const a = p.querySelector('a');
    if (a && p.textContent.trim() === a.textContent.trim()) {
      a.className = 'btn-blue';
      foot.append(a);
    } else body.append(p);
  });
  dialog.append(header, body, foot);
  modal.append(dialog);
  return modal;
}

function buildTabbar(wrap) {
  const bar = el('div', 'tabbar');
  const ul = wrap.querySelector('ul');
  if (!ul) return bar;
  [...ul.children].forEach((li) => {
    unwrapP(li);
    const item = el('div', 'tabbar-item');
    const iconLink = [...li.querySelectorAll(':scope > a')].find((a) => a.querySelector('.icon'));
    if (iconLink) {
      const span = iconLink.querySelector('.icon');
      const name = [...span.classList].find((c) => c.startsWith('icon-')).slice(5);
      flattenIcon(span, TAB_ALT[name] || name);
      if (name === 'mobile-more') item.classList.add('tabbar-item-more');
      item.append(iconLink);
    }
    const labelLink = li.querySelector(':scope > a');
    let label = labelLink;
    if (labelLink) labelLink.className = 'tabbar-label tabbar-label-home';
    else {
      label = el('span', 'tabbar-label');
      label.append(...li.childNodes);
    }
    item.append(label);
    bar.append(item);
  });
  return bar;
}

function buildLaunchers(wrap) {
  const [chatP, topP] = wrap ? [...wrap.querySelectorAll(':scope > p')] : [];
  const chat = el('div', 'chat-launcher');
  const inner = el('div', 'chat-launcher-inner');
  const top = el('button', 'go-top', { type: 'button' });
  if (chatP) {
    const icon = chatP.querySelector('.icon');
    if (icon) flattenIcon(icon, 'chat').className = 'chat-launcher-icon';
    chatP.className = 'chat-launcher-label';
    const img = chatP.querySelector('img');
    if (img) inner.append(img);
    inner.append(chatP);
  }
  chat.append(inner);
  if (topP) {
    const icon = topP.querySelector('.icon');
    const img = icon ? flattenIcon(icon) : null;
    topP.className = 'go-top-label';
    if (img) top.append(img);
    top.append(topP);
  }
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  return [chat, top];
}

/* mobile footer accordion (live: head click -> .active-t + fa-minus) */
function bindAccordion(block) {
  block.querySelectorAll('.footer-col .footer-head, .others-row .footer-head').forEach((h) => {
    h.addEventListener('click', () => {
      if (!MOBILE.matches) return;
      const on = h.classList.toggle('active-t');
      const icon = h.querySelector('.footer-head-toggle');
      if (icon) {
        icon.classList.toggle('fa-minus', on);
        icon.classList.toggle('fa-plus', !on);
      }
    });
  });
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  const [cols, others, legal, modal, tabs, launch] = [0, 1, 2, 3, 4, 5]
    .map((i) => sectionOf(fragment, i));
  block.textContent = '';

  const site = el('div', 'site-footer');
  const wrap = el('div', 'footer-wrap');
  const main = el('div', 'footer-main');
  const container = el('div', 'container');
  const bottom = el('div', 'footer-bottom');
  if (others) bottom.append(buildOthers(others));
  if (legal) bottom.append(buildLegal(legal));
  if (modal) bottom.append(buildModal(modal));
  if (cols) container.append(buildColumns(cols));
  container.append(bottom);
  main.append(container);
  wrap.append(main);
  site.append(wrap);
  block.append(site);
  if (tabs) block.append(buildTabbar(tabs));
  block.append(...buildLaunchers(launch));
  bindAccordion(block);
}
