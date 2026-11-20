import { chromium } from 'playwright';
import fs from 'fs';
const [src, out] = process.argv.slice(2);
const html = fs.readFileSync(src, 'utf8');
const b = await chromium.launch();
const ctx = await b.newContext({ javaScriptEnabled: false });
const p = await ctx.newPage();
await p.route('**/*', r => r.abort());
await p.setContent(html, { waitUntil: 'domcontentloaded' });
const data = await p.evaluate(() => {
  const t = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const own = el => { let s=''; el.childNodes.forEach(n=>{ if(n.nodeType===3) s+=n.textContent; }); return s.replace(/\s+/g,' ').trim(); };
  const A = a => ({ text: t(a), href: a.getAttribute('href'), id: a.id || undefined, aria: a.getAttribute('aria-label') || undefined, title: a.getAttribute('title') || undefined, target: a.getAttribute('target') || undefined });
  const nav = document.querySelector('.rbl-nav-header-bg');
  function item(li) {
    const head = li.querySelector(':scope > a, :scope > span');
    const o = { label: head ? own(head) || t(head) : '', href: head && head.tagName==='A' ? head.getAttribute('href') : null, cls: li.className, linkCls: head ? head.className : '' };
    const sub = li.querySelector(':scope > .tb-megamenu-submenu');
    if (sub) o.showDefault = sub.classList.contains('show-by-default');
    if (sub) {
      const cards = [...sub.querySelectorAll(':scope > .mega-dropdown-inner > .tb-megamenu-row .top-pro-card')].map(c => ({
        cls: c.className,
        paras: [...c.querySelectorAll('.top-pro-left p')].map(pp => ({ cls: pp.className, text: t(pp), links: [...pp.querySelectorAll('a')].map(A) })),
        img: (() => { const i = c.querySelector('.top-pro-right img'); return i ? { src: i.getAttribute('src'), alt: i.getAttribute('alt') } : null; })()
      }));
      const ul = sub.querySelector('ul.tb-megamenu-subnav');
      // other blocks (non-card, non-ul) text
      o.cards = cards;
      o.children = ul ? [...ul.querySelectorAll(':scope > li')].map(item) : [];
      if (!ul && !cards.length) o.raw = sub.innerHTML.length;
      o.blocks = [...sub.querySelectorAll('.tb-megamenu-block')].filter(bk => !bk.querySelector('.top-pro-card')).map(bk => ({ text: t(bk).slice(0, 400), links: [...bk.querySelectorAll('a')].map(A), imgs: [...bk.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt') })) }));
    }
    return o;
  }
  const menu = [...nav.querySelectorAll('ul.tb-megamenu-nav.level-0 > li')].map(item);
  const login = [...nav.querySelectorAll('#pareAccordion-1 > li')].map(li => ({ cls: li.className, link: A(li.querySelector('a')), children: [...li.querySelectorAll('li a')].map(A) }));
  const top = [...document.querySelectorAll('header.accessibility-top-bar a')].map(a => ({ ...A(a), cls: a.className, img: a.querySelector('img')?.getAttribute('src') }));
  const icons = [...nav.querySelectorAll('.rbl-nav-header > *:not(#block-mainnavigation) img, .noti-but img, .noti-but a')].map(e => ({ tag: e.tagName, src: e.getAttribute('src'), alt: e.getAttribute('alt'), href: e.getAttribute('href'), cls: e.className }));
  const foot = document.querySelector('footer.site-footer');
  const cols = [...foot.querySelectorAll('.site-footer__top nav')].map(n => ({ h2: t(n.querySelector('h2')), head: t(n.querySelector('.footer-head')), links: [...n.querySelectorAll('ul a')].map(A) }));
  const others = [...foot.querySelectorAll('.other-list-wrap ul')].map(ul => ({ cls: ul.className, links: [...ul.querySelectorAll('a')].map(a => ({ ...A(a), cls: a.className, sup: a.querySelector('img')?.getAttribute('src') })) }));
  const row3 = [...foot.querySelectorAll('.row3 p')].map(pp => ({ cls: pp.className, text: t(pp) }));
  const social = [...foot.querySelectorAll('.follow-us-ul a')].map(a => ({ ...A(a), cls: a.className }));
  const tabbar = [...document.querySelectorAll('.footer-sticky .tab-bar-icon')].map(d => ({ cls: d.className, a: A(d.querySelector('a')), img: d.querySelector('img')?.getAttribute('src'), alt: d.querySelector('img')?.getAttribute('alt'), label: d.querySelector('.txtfnt')?.innerHTML.trim() }));
  const mob = document.querySelector('.mobile-menu-header-adj');
  const mobImgs = mob ? [...mob.querySelectorAll('img')].slice(0, 12).map(i => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt'), cls: i.className })) : [];
  const crumbs = [...document.querySelectorAll('.breadcrumb li')].map(li => ({ text: t(li), href: li.querySelector('a')?.getAttribute('href') }));
  const chat = [...document.querySelectorAll('.chat-wrap img, .chat-wrap2 a, .chat-wrap2 img')].map(e => ({ tag: e.tagName, src: e.getAttribute('src'), alt: e.getAttribute('alt'), href: e.getAttribute('href'), aria: e.getAttribute('aria-label'), cls: e.className }));
  const modal = (() => { const m = document.querySelector('#attention-modal-rbi'); if (!m) return null; return { title: t(m.querySelector('.modal-title')), body: m.querySelector('.modal-body').innerHTML.replace(/\s+/g,' ').trim(), close: m.querySelector('.btn-close')?.getAttribute('aria-label'), proceed: A(m.querySelector('.modal-footer a')) }; })();
  const footAria = foot.getAttribute('aria-label');
  function acItem(li) {
    const lab = li.querySelector(':scope > .acnav__label');
    const a = lab ? lab.querySelector('a') : li.querySelector(':scope > a');
    const o = { label: lab ? t(lab) : (a ? t(a) : ''), link: a ? A(a) : null };
    const ul = li.querySelector(':scope > ul');
    if (ul) o.children = [...ul.querySelectorAll(':scope > li')].map(acItem);
    const cards = li.querySelectorAll(':scope > .menu-pro-card-flex .top-pro-card');
    if (cards.length) { o.title = t(li.querySelector(':scope > .menu-pro-title-xs')); o.cards = [...cards].map(c => ({ cls: c.className, paras: [...c.querySelectorAll('.top-pro-left p')].map(pp => ({ cls: pp.className, text: t(pp), links: [...pp.querySelectorAll('a')].map(A) })), img: (() => { const i = c.querySelector('.top-pro-right img'); return i ? { src: i.getAttribute('src'), alt: i.getAttribute('alt') } : null; })() })); }
    return o;
  }
  const drawerEl = document.querySelector('#modal-products');
  const drawer = drawerEl ? { title: t(drawerEl.querySelector('.modal-title')), close: drawerEl.querySelector('.btn-close')?.getAttribute('aria-label'), navs: [...drawerEl.querySelectorAll('nav.acnav')].map(n => ({ cls: n.className, items: [...n.querySelectorAll(':scope > ul > li')].map(acItem) })) } : null;
  return { drawer, modal, footAria, top, menu, login, icons, cols, others, row3, social, tabbar, mobImgs, crumbs, chat };
});
fs.writeFileSync(out, JSON.stringify(data, null, 1));
await b.close();
console.log('ok', Object.entries(data).map(([k, v]) => `${k}:${v.length}`).join(' '));
