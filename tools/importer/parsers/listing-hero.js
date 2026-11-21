/* eslint-disable */
/* global WebImporter */

/**
 * listing-hero parser.
 * Source: section#data-section1 >
 *   div.banner-img.banner-img-wrap ( .banner-img-desktop / .banner-img-mobile lazy-background )
 *   div.container .banner-info .banner-info-inner ( h1, cards-highlights strip, CTA, T&C )
 * Block contract (blocks/listing-hero/listing-hero.js, README.md):
 *   row 1: media cell holding only a picture
 *   row 2: text cell with h1 + lede paragraphs
 * The h1 lives in the sibling .container, not in the matched element. Everything else in
 * the banner (cards-highlights, already a block table, CTA, T&C) stays where it is, so it
 * follows the hero as default content.
 */
export default function parse(element, { document }) {
  const textOf = (n) => (n.textContent || '').replace(/\s+/g, ' ').trim();

  const bgUrl = (node) => {
    if (!node) return '';
    const img = node.querySelector('img');
    if (img && (img.getAttribute('src') || img.getAttribute('data-src'))) {
      return img.getAttribute('src') || img.getAttribute('data-src');
    }
    const attr = node.getAttribute('data-bg') || node.getAttribute('data-src') || '';
    if (attr) return attr;
    const style = node.getAttribute('style') || '';
    const m = style.match(/url\(\s*(?:&quot;|["'])?([^"')&]+(?:&(?!quot;)[^"')&]*)*)(?:&quot;|["'])?\s*\)/i);
    return m ? m[1].trim() : '';
  };

  // Media: desktop image preferred (mobile is the same art, re-cropped).
  const desktop = element.querySelector('.banner-img-desktop');
  const mobile = element.querySelector('.banner-img-mobile');
  const src = bgUrl(desktop) || bgUrl(mobile) || bgUrl(element);

  const scope = element.closest('section') || element.parentElement || document.body;
  const sourceH1 = [...scope.querySelectorAll('h1')]
    .find((h) => !element.contains(h) && !h.closest('table') && textOf(h));

  const heading = document.createElement('h1');
  if (sourceH1) heading.textContent = textOf(sourceH1);

  const mediaCell = [];
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = heading.textContent || '';
    mediaCell.push(img);
  }

  const textCell = [];
  if (sourceH1) {
    textCell.push(heading);
    sourceH1.remove();
  }

  const cells = [];
  if (mediaCell.length) cells.push([mediaCell]);
  if (textCell.length) cells.push([textCell]);
  if (!cells.length) cells.push(['']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'listing-hero', cells });
  element.replaceWith(block);
}
