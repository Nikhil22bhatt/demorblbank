/*
 * impact-stats — the about-us impact counters (replica canon: about-us.css .au-impact).
 * Authored rows, classified by content (never by index):
 *   stat — [icon picture] [figure heading + label]
 *   note — a single text cell without a picture (the "as updated on" date)
 * Decode tier: reconstructive (repeat group of stats); every authored node is MOVED (EW1).
 * Behaviour: live AOS fade-up (0.3 s ease, once, offset 120 px, delays 300/600/900/300) —
 * aos-animate is added when the block enters the viewport.
 */

const DELAYS = [300, 600, 900, 300];

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function media(node) {
  if (!node) return null;
  return node.matches('picture, img') ? node : node.querySelector('picture, img');
}

function revealOnScroll(anchor) {
  const reveal = () => anchor.querySelectorAll('[data-aos]')
    .forEach((n) => n.classList.add('aos-animate'));
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        reveal();
        io.disconnect();
      }
    });
  }, { rootMargin: '0px 0px -120px 0px' });
  io.observe(anchor);
}

export default function decorate(block) {
  const container = el('div', 'container');
  const row = el('div', 'row');
  const notes = [];
  let n = 0;

  [...block.children].forEach((r) => {
    const cells = [...r.children];
    const picCell = cells.find((c) => media(c) && !c.textContent.trim());
    const textCells = cells.filter((c) => c !== picCell);
    if (!picCell) {
      textCells.forEach((c) => notes.push(...c.children));
      return;
    }
    const col = el('div', 'col-md-3');
    const card = el('div', 'stat-card', {
      'data-aos': 'fade-up',
      'data-aos-delay': String(DELAYS[n % DELAYS.length]),
    });
    const icon = el('div', 'stat-icon');
    icon.append(media(picCell));
    const body = el('div', 'stat-body');
    textCells.forEach((c) => [...c.children].forEach((node) => body.append(node)));
    card.append(icon, body);
    col.append(card);
    row.append(col);
    n += 1;
  });

  if (notes.length) {
    const note = el('div', 'stat-note');
    notes.forEach((node) => note.append(node));
    row.append(note);
  }
  container.append(row);
  block.replaceChildren(container);
  revealOnScroll(block);
}
