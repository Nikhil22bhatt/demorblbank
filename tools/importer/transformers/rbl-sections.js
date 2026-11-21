/* eslint-disable */
/* global WebImporter */

/**
 * RBL Bank sections transformer.
 *
 * Driven entirely by payload.template.sections ({ id, name, selector[], style }).
 * beforeTransform: walks sections in reverse and inserts an <hr> before every
 *   non-first section (while parser targets still exist). Styled sections get a
 *   temporary data-excat-section-id marker on their <hr>; a styled first
 *   section gets a temporary marked <hr> too.
 * afterTransform: walks sections in reverse and inserts a Section Metadata
 *   block for styled sections after the marker (or the surviving section
 *   element), then removes markers and the first section's temporary <hr>.
 *
 * With a single unstyled section (offer-detail) this is a no-op by design.
 */

const MARKER = 'data-excat-section-id';

function findSectionElement(root, section) {
  const selectors = Array.isArray(section.selector)
    ? section.selector
    : [section.selector].filter(Boolean);
  for (const sel of selectors) {
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector, try the next one
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const document = (payload && payload.document) || element.ownerDocument || element;
  const template = (payload && payload.template) || {};
  const sections = Array.isArray(template.sections) ? template.sections : [];
  if (!sections.length) return;
  const root = element || document.body;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSectionElement(root, section);
      if (!el || !el.parentNode) continue;
      const isFirst = i === 0;
      if (isFirst && !section.style) continue;
      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(MARKER, section.id || String(i));
      if (isFirst) hr.setAttribute('data-excat-first-section', 'true');
      el.parentNode.insertBefore(hr, el);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const id = section.id || String(i);
      const marker = root.querySelector(`hr[${MARKER}="${id}"]`);
      const metadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (marker) {
        // Section Metadata goes at the end of the section: before the next
        // section break, or at the end of the container.
        let cursor = marker.nextElementSibling;
        while (cursor && cursor.tagName !== 'HR') cursor = cursor.nextElementSibling;
        if (cursor) cursor.parentNode.insertBefore(metadata, cursor);
        else marker.parentNode.appendChild(metadata);
      } else {
        const el = findSectionElement(root, section);
        if (el && el.parentNode) el.after(metadata);
      }
    }

    root.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => {
      if (hr.hasAttribute('data-excat-first-section')) hr.remove();
      else hr.removeAttribute(MARKER);
    });
    root.querySelectorAll('hr[data-excat-first-section]').forEach((hr) => hr.remove());
  }
}
