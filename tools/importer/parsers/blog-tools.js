/* eslint-disable */
/* global WebImporter */
// blog-tools: newsletter signup + archive filter. Form controls are not authored; the
// block rebuilds them. Rows (README contract):
//   newsletter — heading, description, consent paragraph, link (text = button label)
//   archives   — heading, link to the archive listing (text = button label), year/month
//                lists of links | earliest 4-digit year (own cell, read by the block)
// Works on the element wherever it sits (incl. a detached fragment holder): every
// lookup is scoped to `element`; `document` is only used to create nodes.
const BLOG_URL = 'https://www.rbl.bank.in/blog';

export default function parse(element, { document }) {
  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();
  const p = (text) => {
    const node = document.createElement('p');
    node.textContent = text;
    return node;
  };
  const linkP = (text, href) => {
    const node = document.createElement('p');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    node.append(a);
    return node;
  };
  const buttonLabel = (scope, fallback) => {
    const btn = scope.querySelector('button, input[type="submit"]');
    return clean(btn?.textContent) || clean(btn?.getAttribute('value')) || fallback;
  };

  const cells = [];

  // newsletter
  const news = element.querySelector('.custom-newsletter-form, #custom-newsletter-form');
  if (news) {
    const cell = [];
    const heading = news.querySelector('h1, h2, h3, h4, .emailsummary');
    if (heading && clean(heading.textContent)) {
      const h = document.createElement('h2');
      h.textContent = clean(heading.textContent);
      cell.push(h);
    }
    const desc = news.querySelector('.emailtext');
    if (desc && clean(desc.textContent)) cell.push(p(clean(desc.textContent)));
    news.querySelectorAll('.js-form-type-checkbox label, label.form-check-label').forEach((label) => {
      const text = clean(label.textContent);
      if (text && !cell.some((n) => n.textContent === text)) cell.push(p(text));
    });
    // no public signup endpoint exists on the source (Drupal posts back to the page);
    // a stable, page-independent link keeps the shared fragment deterministic.
    cell.push(linkP(buttonLabel(news, 'Subscribe'), BLOG_URL));
    cells.push([cell, '']);
  }

  // archives
  const archive = element.querySelector('.archive-filters-form, #archive-filters-form');
  if (archive) {
    const cell = [];
    const heading = archive.querySelector('h1, h2, h3, h4');
    const h = document.createElement('h2');
    h.textContent = clean(heading?.textContent) || 'Archives';
    cell.push(h);
    cell.push(linkP(buttonLabel(archive, 'Submit'), BLOG_URL));

    let earliest = '';
    archive.querySelectorAll('select').forEach((select) => {
      const name = (select.getAttribute('name') || select.id || '').toLowerCase();
      const param = /month/.test(name) ? 'month' : 'year';
      const labelEl = select.id ? archive.querySelector(`label[for="${select.id}"]`) : null;
      const label = clean(labelEl?.textContent) || (param === 'month' ? 'Month' : 'Year');
      const options = [...select.querySelectorAll('option')]
        .map((o) => clean(o.textContent)).filter(Boolean);
      if (!options.length) return;
      cell.push(p(label));
      const ul = document.createElement('ul');
      options.forEach((text, i) => {
        const value = param === 'month' ? String(i + 1).padStart(2, '0') : text;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `${BLOG_URL}?${param}=${encodeURIComponent(value)}`;
        a.textContent = text;
        li.append(a);
        ul.append(li);
      });
      cell.push(ul);
      if (param === 'year') {
        const years = options.filter((t) => /^\d{4}$/.test(t)).map(Number);
        if (years.length) earliest = String(Math.min(...years));
      }
    });
    cells.push([cell, earliest ? [p(earliest)] : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'blog-tools', cells });
  element.replaceWith(block);
}
