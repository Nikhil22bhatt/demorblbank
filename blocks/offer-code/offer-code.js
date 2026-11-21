/**
 * offer-code — promo-code strip: a coupon code in a dashed box next to a CTA.
 *
 * Authoring: one row per item.
 *   default:      [CODE | link]      plain text becomes the coupon code box, the link
 *                                    a CTA button ("Know More"). Either cell may be missing.
 *   grey-shadow:  [(icon) | link]    shadowed link tiles (icon + label, whole tile clickable).
 * Options (block classes): grey-shadow. Unknown classes are ignored.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function codeBox(code) {
  const wrap = el('div', 'offer-code-code');
  const value = el('div', 'offer-code-value');
  value.textContent = code;
  wrap.append(value);
  return wrap;
}

function buildTile(cells) {
  const icon = cells.map((c) => c.querySelector('picture, img')).find(Boolean);
  const link = cells.map((c) => c.querySelector('a[href]')).find(Boolean);
  const labelText = link?.textContent.trim()
    || cells.map((c) => c.textContent.trim()).find(Boolean) || '';
  const tile = el(link ? 'a' : 'div', 'offer-code-tile', link ? { href: link.href } : {});
  if (link?.title) tile.title = link.title;
  if (link?.target) tile.target = link.target;
  if (icon) {
    const box = el('span', 'offer-code-icon');
    box.append(icon.closest('picture') || icon);
    tile.append(box);
  }
  const label = el('span', 'offer-code-label');
  label.textContent = labelText;
  tile.append(label);
  return tile;
}

export default function decorate(block) {
  const tiles = block.classList.contains('grey-shadow');
  const items = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!row.textContent.trim() && !row.querySelector('picture, img')) return;
    const item = el('div', 'offer-code-item');
    if (tiles) {
      item.append(buildTile(cells));
    } else {
      cells.forEach((cell) => {
        const links = [...cell.querySelectorAll('a[href]')];
        if (links.length) {
          const cta = el('div', 'offer-code-cta');
          links.forEach((a) => {
            a.classList.add('button');
            if (/\.pdf($|\?)/i.test(a.href) && !a.target) {
              a.target = '_blank';
              a.rel = 'noopener';
            }
            cta.append(a);
          });
          item.append(cta);
        } else if (cell.textContent.trim()) {
          item.append(codeBox(cell.textContent.trim()));
        }
      });
    }
    items.push(item);
  });
  block.replaceChildren(...items);
}
