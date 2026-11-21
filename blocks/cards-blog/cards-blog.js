import { createOptimizedPicture } from '../../scripts/aem.js';

const DATE_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23707070' stroke-width='1.3'%3E%3Crect x='2' y='3.5' width='16' height='14' rx='2.5'/%3E%3Cpath d='M2 8h16M6 1.5v4M14 1.5v4'/%3E%3C/svg%3E";
const DATE_RE = /^\s*(\d{1,2}[\s/.-]+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(,?\s*\d{4})?\s*$|^\s*\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}\s*$/i;

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function isImageOnly(cell) {
  return cell.querySelector('picture, img') && !cell.textContent.trim();
}

function decorateBody(body) {
  const blocks = [...body.children];
  const headingIndex = blocks.findIndex((el) => el.matches('h1, h2, h3, h4, h5, h6'));
  blocks.forEach((el, i) => {
    const text = el.textContent.trim();
    const links = el.querySelectorAll('a');
    if (el.matches('h1, h2, h3, h4, h5, h6')) {
      el.classList.add('cards-blog-title');
    } else if (links.length && [...links].map((a) => a.textContent).join('').trim() === text
      && i > headingIndex && i === blocks.length - 1) {
      el.classList.add('cards-blog-cta');
    } else if (DATE_RE.test(text)) {
      el.classList.add('cards-blog-date');
      const icon = document.createElement('img');
      icon.className = 'cards-blog-date-icon';
      icon.src = DATE_ICON;
      icon.alt = '';
      icon.width = 20;
      icon.height = 20;
      el.prepend(icon);
    } else if (i < headingIndex) {
      el.classList.add('cards-blog-tag');
    } else if (text) {
      el.classList.add('cards-blog-text');
    }
  });
}

const EAGER_IMAGES = 3;

/* only the first visible slides load eagerly; the rest of the rail (up to ~240 cards) is lazy */
function lazyImages(root) {
  root.querySelectorAll('.cards-blog-card-image img').forEach((img, i) => {
    img.loading = i < EAGER_IMAGES ? 'eager' : 'lazy';
    img.decoding = 'async';
  });
}

function navButton(dir, label) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `cards-blog-btn cards-blog-btn-${dir}`;
  btn.setAttribute('aria-label', label);
  const icon = document.createElement('i');
  icon.className = `fa fa-angle-${dir === 'prev' ? 'left' : 'right'}`;
  icon.setAttribute('aria-hidden', 'true');
  btn.append(icon);
  return btn;
}

/* horizontal rail: native scroll-snap track + prev/next buttons that step one slide */
function slider(block, ul) {
  ul.classList.add('cards-blog-track');
  ul.setAttribute('aria-label', 'Related posts');
  ul.tabIndex = 0;
  block.setAttribute('aria-roledescription', 'carousel');
  const nav = document.createElement('div');
  nav.className = 'cards-blog-nav';
  const prev = navButton('prev', 'Previous');
  const next = navButton('next', 'Next');
  nav.append(prev, next);
  block.append(nav);

  const update = () => {
    const max = ul.scrollWidth - ul.clientWidth;
    prev.disabled = ul.scrollLeft <= 1;
    next.disabled = ul.scrollLeft >= max - 1;
    nav.hidden = max <= 1;
  };
  const step = (dir) => {
    const slide = ul.firstElementChild;
    if (!slide) return;
    ul.scrollBy({ left: dir * slide.getBoundingClientRect().width, behavior: 'smooth' });
  };
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) step(btn === prev ? -1 : 1);
  });
  ul.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(ul);
  update();
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-blog-card';
    let body = null;
    cells.forEach((cell) => {
      if (isImageOnly(cell)) {
        cell.className = 'cards-blog-card-image';
        li.append(cell);
      } else if (!body) {
        body = cell;
        body.className = 'cards-blog-card-body';
        li.append(body);
      } else {
        body.append(...cell.childNodes);
      }
    });
    if (body) {
      // a bare text cell (no paragraphs) gets wrapped for consistent styling
      if (!body.children.length) {
        const p = document.createElement('p');
        p.append(...body.childNodes);
        body.append(p);
      }
      decorateBody(body);
    }
    ul.append(li);
  });
  optimizePictures(ul);
  lazyImages(ul);
  block.replaceChildren(ul);
  if (!block.classList.contains('alt')) slider(block, ul);
}
