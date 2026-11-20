// Generates the shared chrome partials (header + footer + fixed launchers) from the
// verbatim capture extract stardust/replica/lift/chrome-data.json.
import fs from 'fs';
const [dataFile, outDir] = process.argv.slice(2);
const d = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const I = 'shared/images/';
const attrs = l => `${l.title ? ` title="${esc(l.title)}"` : ''}${l.target ? ` target="${esc(l.target)}" rel="noopener noreferrer"` : ''}${l.aria ? ` aria-label="${esc(l.aria)}"` : ''}`;
const link = (l, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${esc(l.href)}"${attrs(l)}>${esc(l.text)}</a>`;

function navList(items, level, onPath = true) {
  if (!items || !items.length) return '';
  const firstParent = items.findIndex(it => it.children && it.children.length && it.showDefault);
  return `<ul class="mega__list mega__list--l${level}">` + items.map((it, i) => {
    const newCls = /menu-item-quick-services/.test(it.linkCls || '') ? ' mega__link--new' : '';
    const head = it.href ? `<a class="mega__link${newCls}" href="${esc(it.href)}">${esc(it.label)}</a>` : `<span class="mega__link">${esc(it.label)}</span>`;
    const parent = it.children && it.children.length;
    const act = onPath && i === firstParent;
    return `<li class="mega__item${parent ? ' mega__item--parent' : ''}${act ? ' is-active' : ''}">${head}${navList(it.children, level + 1, act)}</li>`;
  }).join('') + '</ul>';
}
function cards(cs) {
  if (!cs || !cs.length) return '';
  return '<div class="mega__cards">' + cs.map((c, i) => {
    const [title, cta] = c.paras;
    const img = c.img ? `<img src="${I}menu/${c.img.src.split('/').pop()}" alt="${esc(c.img.alt)}" loading="lazy">` : '';
    return `<div class="mega__card mega__card--${i === 0 ? 'light' : 'dark'}"><div class="mega__card-text"><p class="mega__card-title">${esc(title.text)}</p><p>${cta.links.map(l => link(l, 'mega__card-btn')).join('')}</p></div><div class="mega__card-img">${img}</div></div>`;
  }).join('') + '</div>';
}
const menu = d.menu.map((m, i) => {
  const active = /active-trail/.test(m.cls) || m.label === 'Customer Services';
  return `<li class="site-nav__item"><button class="site-nav__toggle${active ? ' site-nav__toggle--active' : ''}" type="button" aria-expanded="false">${esc(m.label)} <span class="caret" aria-hidden="true"></span></button>
        <div class="mega mega--${esc(m.label.toLowerCase().replace(/\s+/g, '-'))}">${cards(m.cards)}${navList(m.children, 1)}</div></li>`;
}).join('\n      ');

const loginItems = d.login.map(li => {
  const sub = li.children.filter(c => c.href !== li.link.href || c.text !== li.link.text);
  return sub.length
    ? `<li class="login__group"><span class="login__label">${esc(li.link.text)}</span><ul>${sub.map(s => `<li>${link(s)}</li>`).join('')}</ul></li>`
    : `<li>${link(li.link)}</li>`;
}).join('');

const prop = d.top[0];
const wa = d.icons.find(x => x.tag === 'A' && /whatsapp/.test(x.href || ''));
const header = `<header class="topbar">
  <div class="container">
    <ul class="topbar__list">
      <li class="topbar__property topbar__property--desktop"><a href="${esc(prop.href)}"${attrs(prop)}><img src="${I}Vector.svg" alt="Property Logo" width="25" height="24">${esc(prop.text)}</a></li>
      <li><a href="#content"${attrs(d.top[1])}>Skip to Main Content</a></li>
      <li><a class="topbar__contrast topbar__contrast--light" href="#"${attrs(d.top[2])}>A<span class="visually-hidden">Low Contrast View </span></a></li>
      <li><a class="topbar__contrast topbar__contrast--dark" href="#"${attrs(d.top[3])}>A<span class="visually-hidden">High Contrast View </span></a></li>
    </ul>
    <ul class="topbar__list topbar__list--mobile">
      <li class="topbar__property"><a href="${esc(prop.href)}"${attrs(prop)}><img src="${I}Vector.svg" alt="Property Logo" width="25" height="24">${esc(prop.text)}</a></li>
    </ul>
  </div>
</header>
<button class="a11y-launcher" type="button"><img src="${I}aioa-icon-type-1.svg" alt="" width="26" height="26"><span class="visually-hidden">Accessibility</span></button>
<nav class="site-nav" aria-label="Main navigation">
  <div class="container site-nav__inner">
    <div class="site-nav__brand"><a href="/"><img class="site-nav__logo" src="${I}rbl-logo.svg" alt="Logo" width="142" height="73"></a></div>
    <ul class="site-nav__menu">
      ${menu}
    </ul>
    <div class="site-nav__actions">
      <button class="circle-btn" type="button"><img src="${I}search.svg" alt="search"></button>
      <a class="circle-btn" href="${esc(wa.href)}"><img src="${I}whatsapp.svg" alt="whatsapp"></a>
      <button class="circle-btn" type="button"><span class="note-badge"></span><img src="${I}bell.svg" alt="bell"></button>
      <div class="login"><button class="btn-login" type="button" aria-expanded="false">Login</button><ul class="login__menu">${loginItems}</ul></div>
    </div>
  </div>
</nav>
<nav class="mobile-nav" aria-label="Mobile navigation">
  <div class="mobile-nav__row">
    <div class="mobile-nav__brand">
      <button class="mobile-nav__hamb" type="button"><img src="${I}mobile-more.svg" alt=""><span class="visually-hidden">More about banking products</span></button>
      <a href="/"><img class="mobile-nav__logo" src="${I}rbl-logo.svg" alt="RBL Bank" width="116" height="60"></a>
    </div>
    <div class="mobile-nav__actions">
      <button class="circle-btn" type="button"><img src="${I}search.svg" alt="search"></button>
      <a class="circle-btn" href="${esc(wa.href)}"><img src="${I}whatsapp.svg" alt="whatsapp"></a>
      <button class="circle-btn" type="button"><img src="${I}bell.svg" alt="bell"><span class="note-badge"></span></button>
    </div>
  </div>
</nav>`;

const breadcrumb = (crumbs) => `<div class="breadcrumb-bar"><nav aria-label="Breadcrumbs"><ol class="breadcrumb">${crumbs.map((c, i) => c.href ? `<li><a href="${esc(c.href)}">${esc(c.text)}</a></li>` : `<li aria-current="page">${esc(c.text)}</li>`).join('')}</ol></nav></div>`;

const icons = {
  'a-fb': '<svg viewBox="0 0 320 512" aria-hidden="true"><path d="M279 288l14-93h-89v-60c0-25 12-50 52-50h40V6S260 0 225 0c-73 0-121 44-121 125v70H23v93h81v224h100V288z"/></svg>',
  'a-linkedin': '<svg viewBox="0 0 448 512" aria-hidden="true"><path d="M100 448H7V149h93zM54 108C24 108 0 83 0 53a54 54 0 01108 0c0 30-24 55-54 55zm394 340h-93V302c0-35-1-79-48-79-49 0-56 37-56 77v148h-93V149h89v41h1c13-24 43-48 88-48 94 0 112 62 112 142v164z"/></svg>',
  'a-twitter': '<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M389 48h71L305 224l182 240H345L233 318 106 464H35l165-189L25 48h146l101 133zm-25 374h39L152 88h-42z"/></svg>',
  'a-insta': '<svg viewBox="0 0 448 512" aria-hidden="true"><path d="M224 141a115 115 0 100 230 115 115 0 000-230zm0 190a75 75 0 110-150 75 75 0 010 150zm146-194a27 27 0 11-54 0 27 27 0 0154 0zm76 27c-2-36-10-68-36-94s-58-34-94-36c-37-2-148-2-185 0-36 2-68 10-94 36S3 128 1 164c-2 37-2 148 0 185 2 36 10 68 36 94s58 34 94 36c37 2 148 2 185 0 36-2 68-10 94-36s34-58 36-94c2-37 2-148 0-185zm-48 225a76 76 0 01-43 43c-29 12-99 9-132 9s-103 3-132-9a76 76 0 01-43-43c-12-29-9-99-9-132s-3-103 9-132a76 76 0 0143-43c29-12 99-9 132-9s103-3 132 9a76 76 0 0143 43c12 29 9 99 9 132s3 103-9 132z"/></svg>',
  'a-yt': '<svg viewBox="0 0 576 512" aria-hidden="true"><path d="M550 124c-6-24-25-42-49-49C458 64 288 64 288 64S118 64 75 75c-24 7-43 25-49 49C14 167 14 256 14 256s0 89 12 132c6 24 25 41 49 48 43 12 213 12 213 12s170 0 213-12c24-7 43-24 49-48 12-43 12-132 12-132s0-89-12-132zM232 338V174l142 82z"/></svg>'
};
const cols = d.cols.map(c => `<nav class="footer-col" aria-labelledby="fh-${esc(c.head.replace(/\W+/g, '-').toLowerCase())}">
          <h2 class="visually-hidden">${esc(c.h2)}</h2>
          <p class="footer-head h6" id="fh-${esc(c.head.replace(/\W+/g, '-').toLowerCase())}">${esc(c.head.replace(/\u200c/g, '').trim())} <span class="underline"></span> <i class="fa fa-plus footer-head__toggle" aria-hidden="true">\u200c</i></p>
          <ul class="footer-list">${c.links.map(l => `<li>${link(l)}</li>`).join('')}</ul>
        </nav>`).join('\n        ');
const others = d.others.map((ul, i) => `<ul class="others-list${i ? ' others-list--more' : ''}">${ul.links.map(l => `<li><a${/common-btn-blue/.test(l.cls) ? ' class="others-list__btn"' : ''} href="${esc(l.href)}"${attrs(l)}>${esc(l.text)}${l.sup ? ` <sup><img src="${I}new-trade.png" alt="${esc(l.text)}"></sup>` : ''}</a></li>`).join('')}</ul>`).join('');
const [copy, best] = d.row3.filter(p => /pbottom/.test(p.cls));
const m = d.modal;
const dw = d.drawer;
function acItems(items, level) {
  return items.map(it => {
    if (it.cards) return `<li class="acnav__cards"><div class="acnav__cards-title">${esc(it.title)}</div><div class="acnav__cards-row">${it.cards.map((c, i) => `<div class="mega__card mega__card--${i === 0 ? 'light' : 'dark'}"><div class="mega__card-text"><p class="mega__card-title">${esc(c.paras[0].text)}</p><p>${c.paras[1].links.map(l => link(l, 'mega__card-btn')).join('')}</p></div><div class="mega__card-img"><img src="${I}menu/${c.img.src.split('/').pop()}" alt="${esc(c.img.alt)}" loading="lazy"></div></div>`).join('')}</div></li>`;
    if (it.children && it.children.length) {
      const lab = it.link ? `<a href="${esc(it.link.href)}"${attrs(it.link)}>${esc(it.label)}</a>` : esc(it.label);
      return `<li class="has-children"><div class="acnav__label acnav__label--level${level}">${lab}</div><ul class="acnav__list acnav__list--level${level + 1}">${acItems(it.children, level + 1)}</ul></li>`;
    }
    return `<li>${it.link ? `<a class="acnav__link acnav__link--level${level}" href="${esc(it.link.href)}"${attrs(it.link)}>${esc(it.label)}</a>` : `<div class="acnav__label acnav__label--level${level}">${esc(it.label)}</div>`}</li>`;
  }).join('');
}
const drawer = `<div class="drawer" id="modal-products" role="dialog" aria-modal="true" aria-labelledby="drawer-title" aria-hidden="true">
  <span class="drawer__overlay"></span>
  <div class="drawer__dialog">
    <div class="drawer__header"><h5 class="drawer__title" id="drawer-title">${esc(dw.title)}</h5><button class="drawer__close" type="button" aria-label="${esc(dw.close || 'Close')}"></button></div>
    <div class="drawer__body">${dw.navs.map(n => `<nav class="acnav"><ul class="acnav__list acnav__list--level1">${acItems(n.items, 1)}</ul></nav>`).join('')}</div>
  </div>
</div>`;
const modal = `<div class="modal" id="attention-modal-rbi" role="dialog" aria-labelledby="attention-modal-rbi-title" hidden><div class="modal__dialog"><div class="modal__header"><h5 class="modal__title" id="attention-modal-rbi-title">${esc(m.title)}</h5><p><button class="modal__close" type="button" aria-label="${esc(m.close)}"></button></p></div><div class="modal__body">${m.body.replace(/ class="[^"]*"/g, '')}</div><div class="modal__footer"><a class="btn-blue" href="${esc(m.proceed.href)}"${attrs(m.proceed)}><span>${esc(m.proceed.text)}</span></a></div></div></div>`;
const footer = `<footer class="site-footer" aria-label="${esc(d.footAria)}">
 <div class="footer-wrap">
 <footer class="footer-main" aria-label="footer navigation block">
  <div class="container">
    <div class="footer-cols">
        ${cols}
    </div>
    <div class="footer-bottom">
      <div class="others-row">
        <div class="col-lg-1"><p class="footer-head h6">Others <em><i class="fa fa-plus footer-head__toggle" aria-hidden="true">\u200c</i></em></p></div>
        <div class="col-lg-11 others-wrap"><p class="others-toggle-wrap"><a class="others-toggle" href="#" aria-label="Collapse section for other footer section"><em><i class="fa fa-minus" aria-hidden="true">\u200c</i></em></a></p>${others}</div>
      </div>
      <div class="footer-legal">
        <div class="col-lg-6"><p class="pbottom">${esc(copy.text)}</p><p class="pbottom">${esc(best.text)}</p></div>
        <div class="col-lg-6">
          <ul class="follow-us">
            <li class="follow-us__item--label"><p class="follow-us__label">Follow us</p></li>
            ${d.social.map(s => { const k = s.cls.split(' ')[0]; const fa = { 'a-fb': 'fa-facebook', 'a-linkedin': 'fa-linkedin', 'a-insta': 'fa-instagram', 'a-yt': 'fa-youtube-play' }[k]; const glyph = fa ? `<em><i class="fa ${fa}" aria-hidden="true">\u200c</i></em>` : icons[k]; return `<li><a class="${k}" href="${esc(s.href)}"${attrs(s)}>${glyph}<span class="visually-hidden">${esc(s.text.replace(/\u200c/g, '').trim())}</span></a></li>`; }).join('\n            ')}
          </ul>
          <p class="copyright-mobile">${esc(copy.text)}</p>
        </div>
      </div>
      ${modal}
    </div>
  </div>
 </footer>
 </div>
</footer>
<div class="tabbar">
  ${d.tabbar.slice(0, 4).map((t, i) => {
    const label = t.label.replace(/<[^>]+>/g, '|').split('|').map(s => s.trim()).filter(Boolean);
    const [txt, sr] = label;
    const cls = i === 0 ? ' tabbar__label--home' : '';
    const inner = i === 0 ? `<a class="tabbar__label${cls}" href="/">${esc(txt)}<span class="visually-hidden">${esc(sr)}</span></a>` : `<button class="tabbar__label" type="button">${esc(txt)}<span class="visually-hidden">${esc(sr)}</span></button>`;
    return `<div class="tabbar__item${i === 3 ? ' tabbar__item--more' : ''}"><a href="${esc(t.a.href)}"><img src="${I}${t.img.split('/').pop()}" alt="${esc(t.alt)}"></a>${inner}</div>`;
  }).join('\n  ')}
</div>
<div class="chat-launcher"><div class="chat-launcher__inner"><img class="chat-launcher__icon" src="${I}rbl-cares.svg" alt="chat"><span class="chat-launcher__label">Chat</span></div></div>
<button class="go-top" type="button"><img src="${I}top-icon.svg" alt=""><span class="go-top__label">TOP</span></button>
${drawer}`;

fs.writeFileSync(`${outDir}/header.html`, header + '\n');
fs.writeFileSync(`${outDir}/breadcrumb-contact-us.html`, breadcrumb(d.crumbs) + '\n');
fs.writeFileSync(`${outDir}/footer.html`, footer + '\n');
console.log('wrote', ['header.html', 'breadcrumb-contact-us.html', 'footer.html'].map(f => `${f}:${fs.statSync(`${outDir}/${f}`).size}`).join(' '));
