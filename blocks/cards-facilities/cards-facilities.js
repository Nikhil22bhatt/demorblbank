import { createOptimizedPicture } from '../../scripts/aem.js';

const B = 'cards-facilities';

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/** Builds one facility item from icon/label nodes. */
function buildItem(nodes) {
  const li = document.createElement('li');
  li.className = `${B}-item`;
  const icon = document.createElement('div');
  icon.className = `${B}-item-icon`;
  const label = document.createElement('div');
  label.className = `${B}-item-label`;
  nodes.forEach((node) => {
    const isEl = node.nodeType === Node.ELEMENT_NODE;
    const pic = isEl && (node.matches('picture, img') ? node : node.querySelector('picture, img'));
    if (pic && !node.textContent.trim()) icon.append(node);
    else if (pic) {
      icon.append(pic.closest('picture') || pic);
      label.append(node);
    } else if (node.textContent.trim()) label.append(node);
  });
  if (icon.children.length) li.append(icon);
  if (label.childNodes.length) li.append(label);
  return li.children.length ? li : null;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    // authored as a bulleted list in one cell: one item per list entry
    const list = cells.length === 1 && cells[0].querySelector('ul, ol');
    if (list) {
      [...list.children].forEach((entry) => {
        const item = buildItem([...entry.childNodes]);
        if (item) ul.append(item);
      });
      return;
    }
    const nodes = cells.flatMap((cell) => [...cell.childNodes]);
    const item = buildItem(nodes);
    if (item) ul.append(item);
  });
  optimizePictures(ul);
  block.replaceChildren(ul);
}
