/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * video-inline parser.
 * Sources: div.mb-video (one or more columns of heading + YouTube iframe) and banner video
 * wrappers (video > source mp4 + mobile background poster).
 * Block contract (blocks/video-inline/video-inline.js): ONE video per block —
 *   one row: optional title text, optional poster picture, the video link.
 * A container with several videos yields one block per video, in document order.
 */

const VARIANTS = {
  '/rbl-bank-welcomes-grandmaster-d-gukesh': 'dark',
};

function pagePath(document, params) {
  const candidates = [params && params.originalURL];
  try { candidates.push(document.location && document.location.href); } catch (e) { /* ignore */ }
  for (const c of candidates) {
    if (c && typeof c === 'string' && !/^about:/i.test(c)) {
      try {
        return new URL(c).pathname.replace(/\.html?$/i, '').replace(/\/+$/, '').toLowerCase();
      } catch (e) { /* ignore */ }
    }
  }
  return '';
}

function blockName(base, document, params) {
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'video-inline'));
  return v ? `${base} (${v})` : base;
}

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

function bgUrl(node) {
  if (!node) return '';
  const style = node.getAttribute('style') || '';
  const m = style.match(/background-image\s*:\s*url\(\s*(['"]?)(.*?)\1\s*\)/i);
  return m && m[2] ? m[2].replace(/&quot;/g, '').replace(/^["']|["']$/g, '') : '';
}

function cleanVideoUrl(raw) {
  try {
    const u = new URL(raw, 'https://www.rbl.bank.in/');
    if (/youtube(-nocookie)?\.com/i.test(u.hostname)) {
      const m = u.pathname.match(/\/(?:embed|shorts|v)\/([^/?#]+)/);
      const id = m ? m[1] : u.searchParams.get('v');
      if (id) return `https://www.youtube.com/watch?v=${id}`;
    }
    if (/player\.vimeo\.com/i.test(u.hostname)) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return `https://vimeo.com/${id}`;
    }
    return u.href;
  } catch (e) {
    return raw;
  }
}

function videoSrc(media) {
  if (media.tagName === 'IFRAME') return media.getAttribute('src') || media.getAttribute('data-src') || '';
  const source = [...media.querySelectorAll('source')].find((s) => s.getAttribute('src'));
  return media.getAttribute('src') || (source ? source.getAttribute('src') : '');
}

export default function parse(element, { document, params }) {
  const name = blockName('video-inline', document, params);
  const medias = [...element.querySelectorAll('iframe, video')].filter((m) => videoSrc(m));

  const blocks = medias.map((media) => {
    // the column holding this video (stop below the shared container)
    let col = media.parentElement;
    while (col && col !== element && col.parentElement !== element
      && !col.matches('[class*="col-"]') && col.parentElement && !col.parentElement.matches('.row')) {
      col = col.parentElement;
    }
    if (!col || col === element || medias.filter((m) => col.contains(m)).length > 1) col = media.parentElement;
    const scope = col && medias.filter((m) => col.contains(m)).length === 1 ? col : media.parentElement;

    const content = [];
    const heading = scope.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading && textOf(heading)) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.textContent = textOf(heading);
      content.push(h);
    }

    // poster: an image or background image next to the video (banner videos)
    const posterImg = element.querySelector('img');
    const posterBg = bgUrl(element.querySelector('[style*="background-image"]'));
    const posterSrc = (posterImg && posterImg.getAttribute('src')) || posterBg;
    if (posterSrc && media.tagName === 'VIDEO') {
      const img = document.createElement('img');
      img.src = posterSrc;
      if (posterImg && posterImg.getAttribute('alt')) img.alt = posterImg.getAttribute('alt');
      content.push(img);
    }

    const url = cleanVideoUrl(videoSrc(media));
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = url;
    a.textContent = url;
    p.append(a);
    content.push(p);

    return WebImporter.Blocks.createBlock(document, { name, cells: [[content]] });
  });

  if (!blocks.length) {
    // no playable video found: keep the container as default content
    return;
  }
  if (blocks.length === 1) {
    element.replaceWith(blocks[0]);
    return;
  }
  // several videos: one block each, in document order (the wrapper div is transparent)
  const wrapper = document.createElement('div');
  wrapper.append(...blocks);
  element.replaceWith(wrapper);
}
