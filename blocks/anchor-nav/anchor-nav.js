/*
 * anchor-nav — sticky in-page tab bar (Why Us | Features | FAQs | Quick Links) with an
 * optional CTA (Apply Now). Built from first principles (custom base).
 * Authored content, classified by link target and position (never by index):
 *   tab — a link in a list item, or any link to an in-page anchor (#id, or this page + #id)
 *         in-page tabs scroll to their target; page tabs (other pages) navigate and the one
 *         for the current page is active
 *   cta — any other link (shown in the bar once it is stuck under the header)
 * Tabs whose in-page target is missing are flagged .anchor-nav-unresolved (kept visible).
 * The block is moved into its own section (.anchor-nav-section) so it can stick across the page.
 * A bar of page tabs only does not stick (.anchor-nav-static).
 * The in-page tab of the section in view is active.
 * Options (block.classList): shadow, shadow-light, shadow-2, light, light-2, grey, blue-light.
 * They are style hooks only; unknown tokens are ignored.
 */

function slug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function anchorId(a) {
  const href = a.getAttribute('href') || '';
  if (href.startsWith('#')) return decodeURIComponent(href.slice(1));
  try {
    const url = new URL(href, window.location.href);
    if (url.hash && url.origin === window.location.origin
      && url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '')) {
      return decodeURIComponent(url.hash.slice(1));
    }
  } catch { /* not a URL */ }
  return null;
}

function findTarget(id) {
  if (!id) return null;
  const byId = document.getElementById(id);
  if (byId) return byId;
  const wanted = slug(id);
  return [...document.querySelectorAll('main h1, main h2, main h3, main .section[data-id]')]
    .find((el) => el.dataset.id === id || slug(el.textContent) === wanted) || null;
}

function samePage(a) {
  try {
    const url = new URL(a.getAttribute('href') || '', window.location.href);
    const path = url.pathname.replace(/\/$/, '');
    // local previews serve pages under a prefix (/content/...), so match the path's end
    return url.origin === window.location.origin && path !== ''
      && window.location.pathname.replace(/\/$/, '').endsWith(path);
  } catch {
    return false;
  }
}

/* the sticky top is the bottom of the fixed header (--chrome-top), read from the computed style */
function stickTop(holder) {
  return parseFloat(getComputedStyle(holder).top) || 0;
}

function stickyOffset(block) {
  const holder = block.closest('.anchor-nav-section') || block;
  return stickTop(holder) + block.getBoundingClientRect().height;
}

/*
 * position: sticky only works across the parent's height, so the block's wrapper is lifted
 * into a section of its own; content before / after it stays in sections with the same classes.
 */
function isolate(block) {
  const wrapper = block.parentElement;
  const section = block.closest('.section');
  if (!wrapper || !section || wrapper.parentElement !== section) return;
  section.classList.add('anchor-nav-section');
  const siblings = [...section.children].filter((c) => c !== wrapper && !c.matches('.section-metadata'));
  if (!siblings.length) return;
  const index = [...section.children].indexOf(wrapper);
  const after = [...section.children].slice(index + 1);
  const before = [...section.children].slice(0, index);
  const baseClasses = [...section.classList].filter((c) => !c.endsWith('-container') && c !== 'anchor-nav-section');
  const containerClasses = (nodes) => nodes
    .filter((n) => n.className.endsWith('-wrapper'))
    .map((n) => n.className.split(' ').find((c) => c.endsWith('-wrapper')).replace(/-wrapper$/, '-container'));
  const split = (nodes) => {
    const s = document.createElement('div');
    s.classList.add(...baseClasses, ...containerClasses(nodes));
    Object.entries(section.dataset).forEach(([k, v]) => { s.dataset[k] = v; });
    s.append(...nodes);
    return s;
  };
  if (before.length) section.before(split(before));
  if (after.length) section.after(split(after));
  [...section.classList].filter((c) => c.endsWith('-container') && c !== 'anchor-nav-container')
    .forEach((c) => section.classList.remove(c));
}

export default function decorate(block) {
  const links = [...block.querySelectorAll('a[href]')];
  const nav = document.createElement('nav');
  nav.className = 'anchor-nav-tabs';
  nav.setAttribute('aria-label', 'On this page');
  const list = document.createElement('ul');
  const ctas = document.createElement('div');
  ctas.className = 'anchor-nav-cta';

  const tabs = [];
  links.forEach((a) => {
    const text = a.textContent.trim();
    if (!text) return;
    const id = anchorId(a);
    if (id !== null || a.closest('li')) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = id !== null ? `#${id}` : a.getAttribute('href');
      link.textContent = text;
      link.className = 'anchor-nav-link';
      li.append(link);
      list.append(li);
      if (id !== null) {
        tabs.push({ li, link, id });
      } else if (samePage(a)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    } else {
      a.classList.add('button');
      ctas.append(a);
    }
  });

  nav.append(list);
  const inner = document.createElement('div');
  inner.className = 'anchor-nav-inner';
  inner.append(nav);
  if (ctas.children.length) inner.append(ctas);
  block.replaceChildren(inner);
  if (!list.children.length && !ctas.children.length) {
    block.closest('.section')?.classList.add('anchor-nav-empty');
    return;
  }

  isolate(block);
  if (!tabs.length) {
    // page tabs only: a static bar, nothing to track
    block.classList.add('anchor-nav-static');
    block.closest('.anchor-nav-section')?.classList.add('anchor-nav-static');
    return;
  }

  // resolve targets once the page sections are decorated
  const resolve = () => {
    tabs.forEach((tab) => {
      tab.target = findTarget(tab.id);
      if (tab.target && !tab.target.id) tab.target.id = tab.id;
      tab.li.classList.toggle('anchor-nav-unresolved', !tab.target);
    });
  };

  const setActive = (active) => {
    tabs.forEach((tab) => {
      const on = tab === active;
      tab.link.classList.toggle('active', on);
      if (on) tab.link.setAttribute('aria-current', 'true');
      else tab.link.removeAttribute('aria-current');
    });
  };

  const update = () => {
    const line = stickyOffset(block) + 8;
    let current = null;
    tabs.forEach((tab) => {
      if (tab.target && tab.target.getBoundingClientRect().top <= line) current = tab;
    });
    setActive(current || tabs.find((t) => t.target) || null);
    const holder = block.closest('.anchor-nav-section') || block;
    // stuck once the bar reaches the header and content has scrolled under it
    block.classList.toggle('anchor-nav-stuck', window.scrollY > 0
      && holder.getBoundingClientRect().top <= stickTop(holder) + 1);
  };

  tabs.forEach((tab) => {
    tab.link.addEventListener('click', (e) => {
      if (!tab.target) resolve();
      if (!tab.target) return;
      e.preventDefault();
      const top = tab.target.getBoundingClientRect().top + window.scrollY - stickyOffset(block);
      window.scrollTo({ top, behavior: 'smooth' });
      window.history.replaceState(null, '', `#${tab.id}`);
      setActive(tab);
      // keep the active tab visible in a horizontally scrolling bar
      tab.link.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  const start = () => {
    resolve();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
  // sections load lazily; resolve again shortly after decoration
  setTimeout(() => { resolve(); update(); }, 1500);
}
