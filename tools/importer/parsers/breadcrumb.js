/* eslint-disable */
/* global WebImporter */

/**
 * breadcrumb parser.
 * Source: nav#block-rbl-bank-breadcrumbs > ... > ol.breadcrumb > li.breadcrumb-item
 * Block contract (blocks/breadcrumb/breadcrumb.js):
 *   one cell with a list of links; the last item is plain text for the current page.
 * The "Menu" toggle links and the visually-hidden "Breadcrumbs" heading are UI chrome.
 */
export default function parse(element, { document }) {
  const textOf = (n) => (n.textContent || '').replace(/\s+/g, ' ').trim();
  const items = [...element.querySelectorAll('ol.breadcrumb > li, .breadcrumb > li, ol > li.breadcrumb-item')]
    .filter((li, i, all) => all.indexOf(li) === i);

  const ul = document.createElement('ul');
  items.forEach((li) => {
    const text = textOf(li);
    if (!text) return;
    const item = document.createElement('li');
    const a = li.querySelector('a[href]');
    if (a && !li.classList.contains('active')) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = textOf(a);
      item.append(link);
    } else {
      item.textContent = text;
    }
    ul.append(item);
  });

  // A second, empty breadcrumb nav (some pages repeat it inside the banner) is chrome, not a block.
  if (!ul.children.length) {
    element.remove();
    return;
  }
  const cells = [[[ul]]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);
}
