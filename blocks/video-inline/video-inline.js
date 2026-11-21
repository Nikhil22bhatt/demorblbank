/*
 * Video Inline block: a single YouTube, Vimeo or file video.
 * Embeds load only on interaction (poster + play button) or when the
 * block enters the viewport. Options: `full-width-banner`, `dark`.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopMQ = window.matchMedia('(width >= 900px)');

function getVideoSource(link) {
  if (/youtube\.com|youtu\.be/i.test(link)) return 'youtube';
  if (/vimeo\.com/i.test(link)) return 'vimeo';
  return 'video';
}

const TYPE_LABELS = { youtube: 'YouTube video', vimeo: 'Vimeo video', video: 'video' };

function getYoutubeId(url) {
  if (url.hostname.includes('youtu.be')) return url.pathname.split('/')[1] || '';
  const v = url.searchParams.get('v');
  if (v) return v;
  const match = url.pathname.match(/\/(?:embed|shorts|live|v)\/([^/?#]+)/);
  return match ? match[1] : '';
}

function buildIframe(src, title) {
  const wrapper = document.createElement('div');
  wrapper.className = 'video-inline-frame';
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope';
  iframe.allowFullscreen = true;
  wrapper.append(iframe);
  return wrapper;
}

function embedYoutube(url, autoplay, background) {
  const vid = encodeURIComponent(getYoutubeId(url));
  const params = new URLSearchParams({ rel: '0' });
  if (autoplay) params.set('autoplay', '1');
  if (background) {
    params.set('mute', '1');
    params.set('controls', '0');
    params.set('loop', '1');
    params.set('playsinline', '1');
    params.set('playlist', vid);
  }
  return buildIframe(`https://www.youtube.com/embed/${vid}?${params}`, 'Content from YouTube');
}

function embedVimeo(url, autoplay, background) {
  const id = url.pathname.split('/').filter(Boolean).pop();
  const params = new URLSearchParams();
  if (autoplay) params.set('autoplay', '1');
  if (background) params.set('background', '1');
  const qs = params.toString();
  return buildIframe(`https://player.vimeo.com/video/${id}${qs ? `?${qs}` : ''}`, 'Content from Vimeo');
}

function buildVideoElement(src, autoplay, background) {
  const video = document.createElement('video');
  video.className = 'video-inline-file';
  video.controls = !background;
  video.preload = 'metadata';
  if (background) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');
  }
  const source = document.createElement('source');
  source.src = src;
  const ext = new URL(src, window.location.href).pathname.split('.').pop().toLowerCase();
  if (['mp4', 'webm', 'ogg'].includes(ext)) source.type = `video/${ext}`;
  video.append(source);
  if (autoplay) {
    video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
  }
  return video;
}

function loadEmbed(stage, block, link, autoplay, background) {
  if (block.dataset.embedLoaded === 'true') return;
  const url = new URL(link, window.location.href);
  const source = getVideoSource(link);
  let el;
  if (source === 'youtube') el = embedYoutube(url, autoplay, background);
  else if (source === 'vimeo') el = embedVimeo(url, autoplay, background);
  else el = buildVideoElement(url.href, autoplay, background);
  if (background) stage.classList.add('video-inline-background');
  stage.append(el);
  block.dataset.embedLoaded = 'true';
}

export default function decorate(block) {
  const anchor = [...block.querySelectorAll('a[href]')]
    .find((a) => /youtube\.com|youtu\.be|vimeo\.com|\.(mp4|webm|ogg|m3u8)(\?|$)/i.test(a.href))
    || block.querySelector('a[href]');
  if (!anchor) return;
  const link = anchor.href;
  const placeholder = block.querySelector('picture');

  // any other authored text (title, caption) is kept as a caption
  const captionNodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    [...cell.children].forEach((child) => {
      if (child.contains(anchor) && child.textContent.trim() === anchor.textContent.trim()) return;
      if (child.querySelector('picture') && !child.textContent.trim()) return;
      if (child.textContent.trim()) captionNodes.push(child);
    });
  });

  const banner = block.classList.contains('full-width-banner');
  const autoplay = block.classList.contains('autoplay') || banner;
  // a video file with a poster is a decorative loop: video on desktop, poster on mobile
  const decorative = !banner && !!placeholder && getVideoSource(link) === 'video';

  const stage = document.createElement('div');
  stage.className = 'video-inline-stage';
  block.dataset.embedLoaded = 'false';

  if (decorative) {
    block.classList.add('decorative');
    const poster = document.createElement('div');
    poster.className = 'video-inline-poster';
    poster.append(placeholder);
    stage.append(poster);
    let visible = false;
    const tryLoad = () => {
      if (!visible || !desktopMQ.matches) return;
      desktopMQ.removeEventListener('change', tryLoad);
      const play = !prefersReducedMotion.matches;
      loadEmbed(stage, block, link, play, play);
    };
    desktopMQ.addEventListener('change', tryLoad);
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      visible = true;
      tryLoad();
    }, { rootMargin: '200px' });
    observer.observe(block);
  } else if (placeholder && !banner) {
    block.classList.add('placeholder');
    const wrapper = document.createElement('div');
    wrapper.className = 'video-inline-placeholder';
    wrapper.append(placeholder);
    const label = `Play ${TYPE_LABELS[getVideoSource(link)]}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'video-inline-play';
    button.title = label;
    button.setAttribute('aria-label', label);
    wrapper.append(button);
    wrapper.addEventListener('click', () => {
      wrapper.remove();
      loadEmbed(stage, block, link, true, false);
    });
    stage.append(wrapper);
  } else {
    if (placeholder && banner) {
      // poster shown until the looping video loads
      const poster = document.createElement('div');
      poster.className = 'video-inline-poster';
      poster.append(placeholder);
      stage.append(poster);
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      const play = autoplay && !prefersReducedMotion.matches;
      // reduced motion: banner becomes a regular, user-started video
      loadEmbed(stage, block, link, play, banner && play);
    }, { rootMargin: '200px' });
    observer.observe(block);
  }

  const children = [stage];
  if (captionNodes.length) {
    const caption = document.createElement('div');
    caption.className = 'video-inline-caption';
    caption.append(...captionNodes);
    children.unshift(caption);
  }
  block.replaceChildren(...children);
}
