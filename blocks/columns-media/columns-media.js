import { createOptimizedPicture } from '../../scripts/aem.js';

const BG_OPTIONS = ['background-image', 'background-image-2'];

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function isPictureOnly(el) {
  return !!el.querySelector('picture, img') && !el.textContent.trim();
}

/**
 * Turns a cell whose only content is a video link (YouTube, Vimeo or .mp4) into an embed.
 * A picture in the same cell becomes the poster for .mp4 videos.
 * @param {Element} cell
 */
function decorateVideo(cell) {
  const links = [...cell.querySelectorAll('a[href]')];
  if (links.length !== 1) return;
  const link = links[0];
  const rest = cell.textContent.replace(link.textContent, '').trim();
  if (rest) return;
  let url;
  try {
    url = new URL(link.href, window.location.href);
  } catch (e) {
    return;
  }

  let embed;
  const yt = /(?:youtube\.com|youtu\.be)/.test(url.hostname);
  const vimeo = /vimeo\.com/.test(url.hostname);
  if (yt || vimeo) {
    let src;
    if (yt) {
      const vid = url.hostname.includes('youtu.be')
        ? url.pathname.slice(1)
        : url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
      src = `https://www.youtube.com/embed/${vid}`;
    } else {
      src = `https://player.vimeo.com/video/${url.pathname.split('/').filter(Boolean).pop()}`;
    }
    embed = document.createElement('iframe');
    embed.src = src;
    embed.loading = 'lazy';
    embed.title = link.title || link.textContent.trim() || 'Video';
    embed.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    embed.setAttribute('allowfullscreen', '');
  } else if (/\.mp4$/i.test(url.pathname)) {
    embed = document.createElement('video');
    embed.controls = true;
    embed.preload = 'none';
    embed.playsInline = true;
    const poster = cell.querySelector('img');
    if (poster) embed.poster = poster.src;
    const source = document.createElement('source');
    source.src = url.href;
    source.type = 'video/mp4';
    embed.append(source);
  } else {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'columns-media-video';
  wrapper.append(embed);
  cell.textContent = '';
  cell.append(wrapper);
  cell.classList.add('columns-media-video-col');
}

/**
 * image-slider: a cell holding several pictures becomes a swipeable slider with indicators.
 * @param {Element} cell
 */
function decorateSlider(cell) {
  const pics = [...cell.querySelectorAll('picture')];
  if (pics.length < 2) return;
  const track = document.createElement('ul');
  track.className = 'columns-media-slides';
  pics.forEach((pic) => {
    const li = document.createElement('li');
    li.className = 'columns-media-slide';
    const parent = pic.parentElement;
    li.append(pic);
    if (parent !== cell && !parent.textContent.trim() && !parent.children.length) parent.remove();
    track.append(li);
  });

  const dots = document.createElement('div');
  dots.className = 'columns-media-slide-indicators';
  const buttons = pics.map((_, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Show image ${idx + 1} of ${pics.length}`);
    btn.addEventListener('click', () => {
      track.scrollTo({ left: track.children[idx].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dots.append(btn);
    return btn;
  });

  const setActive = (idx) => buttons.forEach((b, i) => {
    if (i === idx) b.setAttribute('aria-current', 'true');
    else b.removeAttribute('aria-current');
  });
  setActive(0);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive([...track.children].indexOf(entry.target));
    });
  }, { root: track, threshold: 0.6 });
  [...track.children].forEach((li) => observer.observe(li));

  const slider = document.createElement('div');
  slider.className = 'columns-media-slider';
  slider.append(track, dots);
  cell.prepend(slider);
  cell.classList.add('columns-media-slider-col');
}

/**
 * Media columns: each row holds text and media cells (picture, video link, or several
 * pictures for a slider). Single-cell rows span the full width (section headings).
 * Options: boxed, boxed-2, boxed-blue, boxed-dark, grey, grey-2,
 * background-image, background-image-2, image-slider.
 * With a background-image option, the first single-cell row holding only a picture
 * becomes the block background.
 * @param {Element} block
 */
export default function decorate(block) {
  const { classList } = block;
  const rows = [...block.querySelectorAll(':scope > div')];

  if (BG_OPTIONS.some((opt) => classList.contains(opt))) {
    const bgRow = rows.find((row) => row.children.length === 1 && isPictureOnly(row));
    if (bgRow) {
      bgRow.className = 'columns-media-bg';
      rows.splice(rows.indexOf(bgRow), 1);
      block.prepend(bgRow);
    }
  }

  const maxCols = Math.max(1, ...rows.map((row) => row.children.length));
  classList.add(`columns-media-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-media-row');
    const cells = [...row.children];
    if (cells.length === 1) row.classList.add('columns-media-full');
    cells.forEach((cell) => {
      if (classList.contains('image-slider')) decorateSlider(cell);
      decorateVideo(cell);
      if (cell.classList.contains('columns-media-video-col')
        || cell.classList.contains('columns-media-slider-col')) return;
      if (isPictureOnly(cell)) {
        cell.classList.add('columns-media-img-col');
      } else {
        cell.classList.add('columns-media-text-col');
      }
    });
  });

  optimizeImages(block);
}
