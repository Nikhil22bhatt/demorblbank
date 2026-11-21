/* eslint-disable */
/* global WebImporter */
// cards-blog: one row per related article — [image] [category tag, title link, excerpt,
// date, Read More link]. Slick clones and carousel controls are skipped.
export default function parse(element, { document }) {
  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();
  const cells = [];

  let cards = [...element.querySelectorAll('.blog_card')];
  cards = cards.filter((c) => !c.closest('.slick-cloned'));

  cards.forEach((card) => {
    // image
    const imageCell = [];
    const srcImg = card.querySelector('.scale-img-wrap img');
    if (srcImg) {
      const img = document.createElement('img');
      img.src = srcImg.getAttribute('src') || srcImg.getAttribute('data-src');
      img.alt = srcImg.getAttribute('alt') || '';
      imageCell.push(img);
    }

    const body = [];
    const cardBody = card.querySelector('.card-body') || card;

    // category tag (direct link before the title block)
    const tag = cardBody.querySelector(':scope > a.btn-light, :scope > a.btn');
    if (tag && clean(tag.textContent)) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = tag.getAttribute('href');
      a.textContent = clean(tag.textContent);
      p.append(a);
      body.push(p);
    }

    // title (linked)
    const titleEl = cardBody.querySelector('h1, h2, h3, h4, h5, h6');
    if (titleEl && clean(titleEl.textContent)) {
      const h = document.createElement('h3');
      const link = titleEl.closest('a[href]') || titleEl.querySelector('a[href]');
      if (link) {
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = clean(titleEl.textContent);
        h.append(a);
      } else {
        h.textContent = clean(titleEl.textContent);
      }
      body.push(h);
    }

    // excerpt
    const excerpt = cardBody.querySelector('.field--name-field-category-description');
    if (excerpt) {
      const paras = [...excerpt.querySelectorAll('p')].filter((p) => clean(p.textContent));
      if (paras.length) paras.forEach((p) => body.push(p));
      else if (clean(excerpt.textContent)) {
        const p = document.createElement('p');
        p.textContent = clean(excerpt.textContent);
        body.push(p);
      }
    }

    // date (source wraps it in an <a href="#">)
    const dateEl = cardBody.querySelector('a.card-link');
    if (dateEl && clean(dateEl.textContent)) {
      const p = document.createElement('p');
      p.textContent = clean(dateEl.textContent);
      body.push(p);
    }

    // Read More
    const more = cardBody.querySelector('.blog-read-more a[href]');
    if (more && clean(more.textContent)) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = more.getAttribute('href');
      a.textContent = clean(more.textContent);
      p.append(a);
      body.push(p);
    }

    if (imageCell.length || body.length) cells.push([imageCell, body]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-blog', cells });
  element.replaceWith(block);
}
