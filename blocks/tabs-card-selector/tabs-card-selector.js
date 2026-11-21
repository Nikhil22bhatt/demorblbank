import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let blockCount = 0;

/** A panel authored as a single same-origin link (e.g. /fragments/x) is a fragment. */
function getFragmentPath(panel) {
  const links = panel.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  if (panel.textContent.trim() !== links[0].textContent.trim()) return null;
  if (panel.querySelector('picture, img')) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (/\.(mp4|webm|pdf|png|jpe?g|gif|svg)$/i.test(url.pathname)) return null;
  return url.pathname;
}

/** Converts links to .mp4/.webm into lazy (src-less) video elements. */
function decorateVideos(panel) {
  panel.querySelectorAll('a[href]').forEach((a) => {
    const url = new URL(a.href, window.location.href);
    if (!/\.(mp4|webm)$/i.test(url.pathname)) return;
    const video = document.createElement('video');
    video.className = 'tabs-card-selector-video';
    video.dataset.src = url.href;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-label', a.textContent.trim() || 'Video');
    if (prefersReducedMotion.matches) video.controls = true;
    const parent = a.closest('p') || a;
    parent.replaceWith(video);
  });
}

/** Loads and plays videos only for the visible panel when it is in viewport. */
function activateVideos(panel, active) {
  panel.querySelectorAll('video.tabs-card-selector-video').forEach((video) => {
    if (!active) {
      video.pause();
      return;
    }
    if (video.dataset.src && !video.src) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        video.src = video.dataset.src;
        if (!prefersReducedMotion.matches && video.closest('[role=tabpanel]').getAttribute('aria-hidden') === 'false') {
          video.play().catch(() => {});
        }
      });
      observer.observe(video);
    } else if (!prefersReducedMotion.matches) {
      video.play().catch(() => {});
    }
  });
}

/**
 * Tabs Card Selector: vertical tab list of cards (label + card image),
 * each showing a panel of benefits. A panel may be inline content or a
 * single link to a fragment (loaded when first opened).
 * Row: [tab label cell] [panel cell(s)].
 * @param {Element} block
 */
export default async function decorate(block) {
  blockCount += 1;
  const prefix = `tcs${blockCount}`;
  const rows = [...block.children].filter((row) => row.children.length
    && (row.textContent.trim() || row.querySelector('picture')));
  if (!rows.length) return;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-card-selector-list';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-orientation', 'vertical');

  const panels = document.createElement('div');
  panels.className = 'tabs-card-selector-panels';

  const tabs = [];
  rows.forEach((row, i) => {
    const [labelCell, ...panelCells] = [...row.children];
    const heading = labelCell.querySelector('h1, h2, h3, h4, h5, h6');
    const labelText = (heading || labelCell).textContent.trim() || `Tab ${i + 1}`;
    const id = `${prefix}-${toClassName(labelText) || i}-${i}`;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-card-selector-tab';
    tab.id = `tab-${id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `tabpanel-${id}`);
    tab.setAttribute('aria-selected', i === 0);
    tab.tabIndex = i === 0 ? 0 : -1;
    // keep the card image and label; strip block-level headings inside a button
    [...labelCell.childNodes].forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && /^H[1-6]$/.test(node.tagName)) {
        const span = document.createElement('span');
        span.className = 'tabs-card-selector-tab-label';
        span.textContent = node.textContent.trim();
        tab.append(span);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
        const span = document.createElement('span');
        span.className = node.querySelector('picture') ? 'tabs-card-selector-tab-image' : 'tabs-card-selector-tab-label';
        span.append(...node.childNodes);
        tab.append(span);
      } else {
        tab.append(node);
      }
    });
    // links inside a button are invalid; flatten them to text
    tab.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));

    const panel = document.createElement('div');
    panel.className = 'tabs-card-selector-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.setAttribute('aria-hidden', i !== 0);
    panel.tabIndex = 0;
    panelCells.forEach((cell) => {
      const wrap = document.createElement('div');
      wrap.className = 'tabs-card-selector-panel-content';
      wrap.append(...cell.childNodes);
      panel.append(wrap);
    });

    const fragmentPath = getFragmentPath(panel);
    if (fragmentPath) panel.dataset.fragment = fragmentPath;
    else decorateVideos(panel);

    tablist.append(tab);
    panels.append(panel);
    tabs.push({ tab, panel });
  });

  async function ensureLoaded(panel) {
    const path = panel.dataset.fragment;
    if (!path) return;
    delete panel.dataset.fragment;
    const fragment = await loadFragment(path);
    if (fragment) {
      const content = document.createElement('div');
      content.className = 'tabs-card-selector-panel-content';
      content.append(...fragment.childNodes);
      panel.replaceChildren(content);
      decorateVideos(panel);
    }
  }

  async function select(index, focus = false) {
    tabs.forEach(({ tab, panel }, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', active);
      tab.tabIndex = active ? 0 : -1;
      panel.setAttribute('aria-hidden', !active);
      if (!active) activateVideos(panel, false);
    });
    const { tab, panel } = tabs[index];
    if (focus) tab.focus();
    await ensureLoaded(panel);
    if (panel.getAttribute('aria-hidden') === 'false') activateVideos(panel, true);
  }

  tabs.forEach(({ tab }, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    });
  });

  block.replaceChildren(tablist, panels);
  await select(0);
}
