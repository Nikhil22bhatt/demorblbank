/**
 * quick-links — the homepage mobile quick-links strip (replica canon index.css .quicklinks,
 * live .credit-carousel; shown below 768px only).
 * Authored rows, classified by content: [icon picture] [link paragraph].
 * Decode tier: reconstructive (repeat group). Each item is a card-as-link (EW6): the
 * wrapper anchor takes the authored href, the inner anchor is unwrapped, the picture
 * and the paragraph are MOVED in (EW1).
 */
export default function decorate(block) {
  if (block.querySelector(':scope > ul')) return;
  const list = document.createElement('ul');
  list.className = 'quick-links-list';
  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture, img');
    const link = row.querySelector('a[href]');
    if (!link) return;
    const li = document.createElement('li');
    li.className = 'quick-links-item';
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    const label = link.closest('p') || link;
    link.replaceWith(...link.childNodes);
    const icon = document.createElement('span');
    icon.className = 'quick-links-icon';
    if (pic) icon.append(pic.closest('picture') || pic);
    const text = document.createElement('span');
    text.className = 'quick-links-label';
    text.append(label);
    a.append(icon, text);
    li.append(a);
    list.append(li);
  });
  block.replaceChildren(list);
  block.setAttribute('role', 'navigation');
  block.setAttribute('aria-label', 'Quick links');
}
