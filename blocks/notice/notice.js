/**
 * notice — the homepage notification ticker (replica canon index.css .notice).
 * One authored row: the message paragraph(s). Fixed under the utility strip; the header
 * block hides it on scroll (body.notice-hidden, >= 300px); the close control keeps it
 * hidden (body.notice-closed).
 * Decode tier: template-slotted (one fixed composition). Authored nodes are MOVED (EW1).
 * @ew-exempt close control label (UI glue, aria-label only)
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .notice-wrap')) return;
  const wrap = document.createElement('div');
  wrap.className = 'notice-wrap';
  const text = document.createElement('div');
  text.className = 'notice-text';
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    const nodes = [...cell.children];
    if (!nodes.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      nodes.push(p);
    }
    nodes.forEach((n) => text.append(n));
  });
  wrap.append(text);
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'notice-close';
  close.setAttribute('aria-label', 'Close notification');
  close.addEventListener('click', () => document.body.classList.add('notice-closed'));
  block.replaceChildren(wrap, close);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Notification');
}
