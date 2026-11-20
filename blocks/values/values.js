/*
 * values — the about-us Vision / Mission / CSR + Careers module (replica canon: about-us.css
 * .au-values). Authored rows, classified by content (never by index):
 *   heading — a single cell holding only an <h2>; it opens a group (Our Vision, Our Mission)
 *   vision  — a text cell with an <h3> and no picture
 *   mission — [<h3> + paragraph] [background picture]
 *   split   — [picture] [<h4> + text + CTA], or text first = reversed
 * Decode tier: reconstructive (cards, split rows), every authored node MOVED (EW1);
 * CTAs move as their <p> (EW3).
 * Behaviour: live AOS fade-up on the three rows (anchor = the block, offset 120 px,
 * delays 600 / 900 / 1500).
 */

const GROUP_DELAYS = [600, 900];
const SPLIT_DELAY = 1500;

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

function classify(row) {
  const cells = [...row.children];
  const pic = cells.find((c) => media(c) && !c.textContent.trim());
  const texts = cells.filter((c) => c !== pic);
  const has = (sel) => texts.some((c) => c.querySelector(sel));
  if (has('h4')) {
    return {
      type: 'split', cells, pic, texts,
    };
  }
  if (has('h3')) {
    return {
      type: pic ? 'mission' : 'vision', cells, pic, texts,
    };
  }
  if (has('h2')) return { type: 'heading', cells, texts };
  return {
    type: 'vision', cells, pic, texts,
  };
}

function moveAll(cells, target) {
  cells.forEach((c) => target.append(...c.children));
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

function buildSplit({ pic, texts }, reversed) {
  const split = el('div', reversed ? 'split split-reverse' : 'split');
  const row = el('div', 'row');
  const imgCol = el('div', 'col-lg-6 split-col split-col-img');
  const imgBox = el('div', reversed ? 'split-img split-img-right' : 'split-img');
  const textCol = el('div', 'col-lg-6 split-col split-col-text');
  const text = el('div', 'split-text');
  if (pic) imgBox.append(media(pic));
  imgCol.append(imgBox);
  moveAll(texts, text);
  textCol.append(text);
  if (reversed) row.append(textCol, imgCol);
  else row.append(imgCol, textCol);
  split.append(row);
  return split;
}

export default function decorate(block) {
  const container = el('div', 'container');
  const groups = [];
  let group = null;
  let splitCol = null;

  const openGroup = () => {
    const delay = GROUP_DELAYS[Math.min(groups.length, GROUP_DELAYS.length - 1)];
    group = {
      row: el('div', 'row', { 'data-aos': 'fade-up', 'data-aos-delay': String(delay) }),
      vision: null,
      mission: null,
      count: 0,
    };
    groups.push(group);
    container.append(group.row);
    return group;
  };

  [...block.children].map(classify).forEach((r) => {
    if (r.type === 'heading') {
      const g = openGroup();
      const col = el('div', 'col-12');
      moveAll(r.texts, col);
      g.row.append(col);
      return;
    }
    if (r.type === 'split') {
      if (!splitCol) {
        /* one column holds every split row: their vertical margins collapse as on live */
        const splitRow = el('div', 'row', {
          'data-aos': 'fade-up',
          'data-aos-delay': String(SPLIT_DELAY),
        });
        splitCol = el('div', 'col-12');
        splitRow.append(splitCol);
        container.append(splitRow);
      }
      splitCol.append(buildSplit(r, r.cells.indexOf(r.pic) > 0 || !r.pic));
      return;
    }
    const g = group || openGroup();
    g.count += 1;
    if (r.type === 'vision') {
      if (!g.vision) {
        const wrap = el('div', 'col-12 vision');
        g.vision = el('div', 'row');
        wrap.append(g.vision);
        g.row.append(wrap);
      }
      const col = el('div', 'col-md-4');
      const tone = g.vision.children.length % 2 ? 'even' : 'odd';
      const card = el('div', `vision-card vision-card-${tone}`);
      moveAll(r.texts, card);
      col.append(card);
      g.vision.append(col);
    } else {
      if (!g.mission) {
        g.mission = el('div', 'row mission');
        g.row.append(g.mission);
      }
      const col = el('div', `col-md-6 mission-item-${(g.mission.children.length % 4) + 1}`);
      const card = el('div', 'mission-card');
      moveAll(r.texts, card);
      const bg = el('div', 'mission-bg');
      bg.append(media(r.pic));
      card.append(bg);
      col.append(card);
      g.mission.append(col);
    }
  });

  block.replaceChildren(container);
  revealOnScroll(block);
}
