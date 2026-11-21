/* eslint-disable */
/* global WebImporter */

import { catalogVariant } from './variant-map.js';
/**
 * anchor-nav parser.
 * Source: section.common-section.tab-section / #data-section2 — a Bootstrap tab bar
 * (nav .nav-tabs) plus the tab panels (.tab-content > .tab-pane) and an optional
 * "Apply Now" CTA field.
 * Block contract (blocks/anchor-nav/anchor-nav.js):
 *   one cell with a list of links — in-page anchors (#id) become tabs, any other link a CTA.
 *   Tabs resolve against an element id or a heading whose slug equals the anchor.
 * The catalog instance covers the whole section, so the panels' content is kept as
 * default content right after the block (it is page content, not part of the nav).
 * Each anchor tab links to its panel's first heading; a panel without a heading gets
 * the tab label as an h2 so the tab still has a target.
 */

const VARIANTS = {
  '/personal-banking/accounts/savings-accounts/woman-first-savings-account': 'shadow-light',
  '/personal-banking/term-deposits/digital-fixed-deposit': 'shadow',
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
  const v = (VARIANTS[pagePath(document, params)] || catalogVariant(pagePath(document, params), 'anchor-nav'));
  return v ? `${base} (${v})` : base;
}

// same slug rule as blocks/anchor-nav/anchor-nav.js findTarget()
function slug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function textOf(node) {
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

function findById(root, id) {
  if (!id) return null;
  return [...root.querySelectorAll('[id]')].find((n) => n.id === id) || null;
}

export default function parse(element, { document, params }) {
  const inPanel = (n) => !!n.closest('.tab-content, .tab-pane');

  // the section's own tab bar (a nested tab bar inside a panel stays panel content)
  const nav = [...element.querySelectorAll('nav')].find((n) => !inPanel(n))
    || [...element.querySelectorAll('.nav-tabs')].find((n) => !inPanel(n));
  const ctaFields = [...element.querySelectorAll('.field--name-field-apply-now-links, .tab-applynow-btn')]
    .filter((n) => !inPanel(n));

  const items = [];
  if (nav) {
    [...nav.querySelectorAll('a[href]')].forEach((a) => {
      const label = textOf(a);
      if (!label) return;
      const href = a.getAttribute('href') || '';
      const link = document.createElement('a');
      if (href.startsWith('#') && href.length > 1) {
        const panel = findById(element, decodeURIComponent(href.slice(1)));
        let targetText = label;
        if (panel) {
          const heading = [...panel.querySelectorAll('h1, h2, h3')]
            .find((h) => textOf(h) && !h.closest('table'));
          if (heading) {
            targetText = textOf(heading);
          } else {
            const h2 = document.createElement('h2');
            h2.textContent = label;
            panel.prepend(h2);
          }
        }
        link.href = `#${slug(targetText)}`;
      } else {
        link.href = href;
      }
      link.textContent = label;
      items.push(link);
    });
  }

  const ctas = [];
  const seen = new Set();
  ctaFields.forEach((field) => {
    const anchors = field.tagName === 'A' ? [field] : [...field.querySelectorAll('a[href]')];
    anchors.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || seen.has(href) || !textOf(a)) return;
      seen.add(href);
      const link = document.createElement('a');
      link.href = href;
      link.textContent = textOf(a);
      ctas.push(link);
    });
  });

  const contentCell = [];
  if (items.length) {
    const ul = document.createElement('ul');
    items.forEach((a) => {
      const li = document.createElement('li');
      li.append(a);
      ul.append(li);
    });
    contentCell.push(ul);
  }
  ctas.forEach((a) => {
    const p = document.createElement('p');
    p.append(a);
    contentCell.push(p);
  });

  const cells = [[contentCell.length ? contentCell : '']];
  const block = WebImporter.Blocks.createBlock(document, {
    name: blockName('anchor-nav', document, params),
    cells,
  });

  // drop the extracted nav + CTA, keep every remaining node (the tab panels) as default content
  if (nav) {
    const bar = nav.closest('.tab-wrap-outer-height');
    const removable = bar && element.contains(bar) && !bar.querySelector('.tab-content') ? bar : nav;
    removable.remove();
  }
  ctaFields.forEach((f) => { if (f.isConnected) f.remove(); });
  const rest = [...element.childNodes].filter((n) => n.nodeType === 1 || (n.textContent || '').trim());
  if (!rest.length) {
    element.replaceWith(block);
    return;
  }
  // block + the section's remaining page content, in document order (the wrapper div is
  // transparent in the converted document)
  const wrapper = document.createElement('div');
  wrapper.append(block, ...rest);
  element.replaceWith(wrapper);
}
