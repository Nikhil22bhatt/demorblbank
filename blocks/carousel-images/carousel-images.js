import { createOptimizedPicture } from '../../scripts/aem.js';

let carouselId = 0;

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
  });
}

function updateActiveSlide(block, slideIndex) {
  block.dataset.activeSlide = slideIndex;
  block.querySelectorAll('.carousel-images-slide').forEach((slide, idx) => {
    slide.setAttribute('aria-hidden', idx !== slideIndex);
    slide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });
  block.querySelectorAll('.carousel-images-slide-indicator button').forEach((button, idx) => {
    if (idx === slideIndex) {
      button.setAttribute('disabled', '');
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('disabled');
      button.removeAttribute('aria-current');
    }
  });
}

function showSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.carousel-images-slide');
  if (!slides.length) return;
  let index = slideIndex;
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  block.querySelector('.carousel-images-slides').scrollTo({
    top: 0,
    left: slides[index].offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  block.querySelectorAll('.carousel-images-slide-indicator button').forEach((button) => {
    button.addEventListener('click', () => {
      showSlide(block, parseInt(button.parentElement.dataset.targetSlide, 10));
    });
  });
  block.querySelector('.slide-prev')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) - 1);
  });
  block.querySelector('.slide-next')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) + 1);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveSlide(block, parseInt(entry.target.dataset.slideIndex, 10));
      }
    });
  }, { root: block.querySelector('.carousel-images-slides'), threshold: 0.5 });
  block.querySelectorAll('.carousel-images-slide').forEach((slide) => observer.observe(slide));
}

/**
 * Image carousel: each row is one slide.
 * Cell 1: picture (required). Cell 2 (optional): caption text.
 * Pictures found anywhere in a row are used, so authors may put the image in any cell.
 * @param {Element} block
 */
export default function decorate(block) {
  carouselId += 1;
  const id = `carousel-images-${carouselId}`;
  block.id = id;
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.querySelectorAll(':scope > div')]
    .filter((row) => row.textContent.trim() || row.querySelector('picture, img'));

  const container = document.createElement('div');
  container.className = 'carousel-images-slides-container';
  const slidesWrapper = document.createElement('ul');
  slidesWrapper.className = 'carousel-images-slides';

  rows.forEach((row, idx) => {
    const slide = document.createElement('li');
    slide.className = 'carousel-images-slide';
    slide.dataset.slideIndex = idx;
    slide.id = `${id}-slide-${idx}`;

    const cells = [...row.querySelectorAll(':scope > div')];
    const imageCell = cells.find((cell) => cell.querySelector('picture, img'));
    if (imageCell) {
      imageCell.classList.add('carousel-images-slide-image');
      slide.append(imageCell);
    }
    cells.filter((cell) => cell !== imageCell && cell.textContent.trim()).forEach((cell) => {
      cell.classList.add('carousel-images-slide-content');
      slide.append(cell);
    });
    slidesWrapper.append(slide);
  });

  block.textContent = '';
  container.append(slidesWrapper);
  block.append(container);

  if (rows.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'carousel-images-navigation-buttons';
    nav.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;
    container.append(nav);

    const indicatorsNav = document.createElement('nav');
    indicatorsNav.setAttribute('aria-label', 'Carousel Slide Controls');
    const indicators = document.createElement('ol');
    indicators.className = 'carousel-images-slide-indicators';
    rows.forEach((_, idx) => {
      const li = document.createElement('li');
      li.className = 'carousel-images-slide-indicator';
      li.dataset.targetSlide = idx;
      li.innerHTML = `<button type="button" aria-label="Slide ${idx + 1}"></button>`;
      indicators.append(li);
    });
    indicatorsNav.append(indicators);
    block.append(indicatorsNav);
  }

  optimizeImages(block);
  if (rows.length) updateActiveSlide(block, 0);
  if (rows.length > 1) bindEvents(block);
}
