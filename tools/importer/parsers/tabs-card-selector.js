/* eslint-disable */
/* global WebImporter */
/**
 * tabs-card-selector parser.
 * Source: div.pick-offer-outer —
 *   .pick-offer-left > .cc-card-indi (h5 card name + img.cc-card-indi-img)  [tabs]
 *   .pick-offer-right > .cc-card-indi-outer (h4 benefits heading, .second-col links,
 *     video > source[src] .mp4)                                              [panels]
 * Tabs and panels are paired by document order.
 * Block contract (blocks/tabs-card-selector): one row per card,
 *   [tab label: heading + card image] [panel: heading, links, .mp4 link] (authored inline).
 */
export default function parse(element, { document }) {
  const tabs = [...element.querySelectorAll('.pick-offer-left .cc-card-indi')];
  const panels = [...element.querySelectorAll('.pick-offer-right .cc-card-indi-outer')];
  const cells = [];

  tabs.forEach((tab, i) => {
    const name = (tab.querySelector('h1, h2, h3, h4, h5, h6') || tab).textContent.trim();

    const label = [];
    if (name) {
      const h = document.createElement('h3');
      h.textContent = name;
      label.push(h);
    }
    const img = tab.querySelector('img');
    if (img && img.getAttribute('src')) {
      const pic = document.createElement('img');
      pic.src = img.getAttribute('src');
      // source alts are mismatched across cards (e.g. Platinum Maxima Plus img alt="Cookies credit card")
      pic.alt = name || img.getAttribute('alt') || '';
      const p = document.createElement('p');
      p.append(pic);
      label.push(p);
    }

    const content = [];
    const panel = panels[i];
    if (panel) {
      const heading = panel.querySelector('.first-col h1, .first-col h2, .first-col h3, .first-col h4, .first-col h5, .first-col h6')
        || panel.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading && heading.textContent.trim()) {
        const h = document.createElement('h4');
        h.textContent = heading.textContent.trim();
        content.push(h);
      }
      panel.querySelectorAll('.second-col a[href]').forEach((a) => {
        const text = a.textContent.trim();
        if (!text) return;
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = text;
        const p = document.createElement('p');
        if (/common-btn-blue|\bbtn\b/.test(a.className)) {
          const strong = document.createElement('strong');
          strong.append(link);
          p.append(strong);
        } else {
          p.append(link);
        }
        content.push(p);
      });
      const source = panel.querySelector('video source[src], video[src]');
      if (source) {
        const link = document.createElement('a');
        link.href = source.getAttribute('src');
        link.textContent = `${name || 'Card'} animation`;
        const p = document.createElement('p');
        p.append(link);
        content.push(p);
      }
    }

    cells.push([label, content]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-card-selector', cells });
  element.replaceWith(block);
}
