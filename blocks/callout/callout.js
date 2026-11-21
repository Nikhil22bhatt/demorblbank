/*
 * callout — small boxed note / stat / tile sharing a section. Built from first principles.
 * Authored content, classified by content (never by index), any number of rows / cells:
 *   media — pictures / icons (picture-only cells or paragraphs)
 *   body  — everything else: heading, text, links
 * Options (block.classList), unknown tokens ignored:
 *   tagline — a one-line strip; "Safe | Simple | Fast" text is split into separate items
 *   summary — a bordered "at a glance" text panel
 *   shadow  — an elevated tile; a callout with a single link becomes one clickable tile
 *   blue    — a dark coloured box (colour hook for the design pass)
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

function isMediaOnly(el) {
  return !!el.querySelector('picture, img') && !el.textContent.trim();
}

function splitTagline(body) {
  const text = body.textContent.replace(/\s+/g, ' ').trim();
  if (!text.includes('|') || body.querySelector('a, picture, img')) return;
  const parts = text.split('|').map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return;
  // mirrors the source markup: one line of text with separator spans between the phrases
  const line = document.createElement('p');
  line.className = 'callout-tagline';
  parts.forEach((part, i) => {
    if (i) {
      const sep = document.createElement('span');
      sep.className = 'callout-tagline-sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '|';
      line.append(' ', sep, ' ');
    }
    line.append(part);
  });
  body.replaceChildren(line);
}

export default function decorate(block) {
  const media = document.createElement('div');
  media.className = 'callout-media';
  const body = document.createElement('div');
  body.className = 'callout-body';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (isMediaOnly(cell)) {
        media.append(...cell.childNodes);
        return;
      }
      [...cell.childNodes].forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && isMediaOnly(node)) media.append(node);
        else if (node.nodeType === Node.ELEMENT_NODE || node.textContent.trim()) body.append(node);
      });
    });
  });

  block.replaceChildren();
  if (media.querySelector('picture, img')) block.append(media);
  if (body.textContent.trim() || body.children.length) block.append(body);
  if (!block.children.length) return;

  if (block.classList.contains('tagline')) splitTagline(body);

  // a tile with exactly one link (and no other interactive content) is clickable as a whole
  const links = block.querySelectorAll('a[href]');
  if (block.classList.contains('shadow') && links.length === 1) {
    const link = links[0];
    const tile = document.createElement('a');
    tile.className = 'callout-link';
    tile.href = link.href;
    if (link.target) tile.target = link.target;
    if (link.title) tile.title = link.title;
    const label = document.createElement('span');
    label.className = 'callout-link-label';
    label.append(...link.childNodes);
    link.replaceWith(label);
    // unwrap button containers left from the authored link
    label.closest('.button-container')?.classList.remove('button-container');
    tile.append(...block.childNodes);
    block.append(tile);
  }

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });
}
