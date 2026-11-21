/* eslint-disable */
/* global WebImporter */

/**
 * offer-code parser.
 * Source: div.offer-banner-info > div.coupon-code-flex ( .coupon-code-text code + a.btn CTA )
 * Block contract (blocks/offer-code/offer-code.js): one row per item [CODE | link];
 * either cell may be missing.
 * An empty coupon strip (offers without a code or CTA) is removed rather than authored as an
 * empty block.
 */
export default function parse(element, { document }) {
  const textOf = (n) => (n.textContent || '').replace(/\s+/g, ' ').trim();

  const codeEl = element.querySelector('.coupon-code-text, [class*="coupon-code"]:not(.coupon-code-flex)');
  const code = codeEl ? textOf(codeEl) : '';
  const links = [...element.querySelectorAll('a[href]')].filter((a) => textOf(a));

  if (!code && !links.length) {
    element.remove();
    return;
  }

  let codeCell = '';
  if (code) {
    codeCell = document.createElement('p');
    codeCell.textContent = code;
  }
  let linkCell = '';
  if (links.length) {
    linkCell = links.map((a) => {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = textOf(a);
      p.append(link);
      return p;
    });
  }

  const cells = [[codeCell, linkCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'offer-code', cells });
  element.replaceWith(block);
}
