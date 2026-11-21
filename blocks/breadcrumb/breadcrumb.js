/*
 * breadcrumb — "Home > Section > Page" trail. Built from first principles (custom base).
 * Authored content (any of):
 *   - a list (ul/ol) of links, last item may be plain text (current page)
 *   - one or more paragraphs / rows of links, optionally separated by ">" or "/"
 *   - nothing: the trail is derived from the URL path
 * A trailing plain-text item, or the page title when the last link is not this page, is the
 * current page. A picture anywhere in the block becomes a background (image-light option).
 * Options (block.classList): alt, image-light. Unknown tokens are ignored.
 */
import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';

const SEPARATORS = /^\s*(>|›|»|\/|\|)\s*$/;

function titleCase(segment) {
  return decodeURIComponent(segment).replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function samePath(href) {
  try {
    const url = new URL(href, window.location.href);
    return url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
  } catch {
    return false;
  }
}

/* collect { text, href } items in authored order */
function collect(block) {
  const items = [];
  const push = (text, href) => {
    const t = (text || '').replace(/\s+/g, ' ').trim();
    if (!t || SEPARATORS.test(t)) return;
    items.push({ text: t, href });
  };

  const lists = block.querySelectorAll('ul, ol');
  if (lists.length) {
    lists.forEach((list) => {
      [...list.children].forEach((li) => {
        const a = li.querySelector('a[href]');
        push(a ? a.textContent : li.textContent, a ? a.getAttribute('href') : null);
      });
    });
    return items;
  }

  const walker = document.createTreeWalker(block, NodeFilter.SHOW_ALL);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
      push(node.textContent, node.getAttribute('href'));
    } else if (node.nodeType === Node.TEXT_NODE && !node.parentElement.closest('a')) {
      node.textContent.split(/[>›»|]/).forEach((part) => push(part, null));
    }
  }
  return items;
}

function fromPath() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const items = [{ text: 'Home', href: '/' }];
  segments.forEach((seg, i) => {
    items.push({ text: titleCase(seg), href: `/${segments.slice(0, i + 1).join('/')}` });
  });
  return items;
}

export default function decorate(block) {
  const picture = block.querySelector('picture');
  if (picture) picture.remove();

  let items = collect(block);
  if (!items.length) items = fromPath();

  // the current page closes the trail
  const last = items[items.length - 1];
  if (last.href && !samePath(last.href)) {
    const title = getMetadata('og:title') || document.title.split('|')[0].trim();
    if (title && title !== last.text) items.push({ text: title, href: null });
  }

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb-trail';
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  items.forEach((item, i) => {
    const li = document.createElement('li');
    const isLast = i === items.length - 1;
    if (item.href && !isLast) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      li.append(a);
    } else if (isLast) {
      // current page: plain text in the item, as on the source
      li.textContent = item.text;
      li.setAttribute('aria-current', 'page');
    } else {
      const span = document.createElement('span');
      span.textContent = item.text;
      li.append(span);
    }
    ol.append(li);
  });
  nav.append(ol);
  const label = document.createElement('h2');
  label.className = 'breadcrumb-label';
  label.textContent = 'Breadcrumbs';
  block.replaceChildren(label, nav);

  if (picture) {
    const media = document.createElement('div');
    media.className = 'breadcrumb-media';
    const img = picture.querySelector('img');
    const url = img ? new URL(img.src, window.location.href) : null;
    if (url && url.origin === window.location.origin && !/\.svg$/i.test(url.pathname)) {
      media.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '2000' }]));
    } else {
      media.append(picture);
    }
    block.prepend(media);
    block.classList.add('breadcrumb-has-media');
  }
}
