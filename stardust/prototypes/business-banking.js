/* Listing template behaviour (business-banking / personal-banking):
   1. rails — slick replacement: prev/next arrows move the track one slide (prev starts disabled,
      next disables at the end, as live slick infinite:false); below 768 the viewport scrolls natively.
   2. Trust & Beyond video thumbs open the YouTube embed in a modal (live #video-popup), close on × / overlay / Esc.
   3. app band card fades up on scroll-in (live AOS fade-up 0.3s ease). */
(function () {
  var rails = document.querySelectorAll('[data-rail]');
  Array.prototype.forEach.call(rails, function (rail) {
    var track = rail.querySelector('.rail__track');
    var prev = rail.querySelector('.rail__arrow--prev');
    var next = rail.querySelector('.rail__arrow--next');
    var index = 0;
    function per() { return parseFloat(getComputedStyle(rail).getPropertyValue('--per')) || 1; }
    function maxIndex() { return Math.max(0, Math.ceil(track.children.length - per())); }
    function render() {
      var slide = track.children[0];
      var step = slide ? slide.getBoundingClientRect().width + parseFloat(getComputedStyle(slide).marginRight) : 0;
      if (index > maxIndex()) index = maxIndex();
      track.style.transform = index ? 'translate3d(' + (-index * step) + 'px,0,0)' : '';
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= maxIndex();
      if (prev && next) { var none = maxIndex() === 0; prev.hidden = none; next.hidden = none; }
    }
    if (prev) prev.addEventListener('click', function () { if (index > 0) { index -= 1; render(); } });
    if (next) next.addEventListener('click', function () { if (index < maxIndex()) { index += 1; render(); } });
    window.addEventListener('resize', render);
    render();
  });

  /* 3. AOS fade-up parity (live: .rbl-myapp-card, 0.3s ease) — reveal once on scroll-in */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-revealed'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -120px 0px' });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-revealed'); });
  }

  var popup = document.getElementById('video-popup');
  if (!popup) return;
  var frame = popup.querySelector('iframe');
  function close() { popup.hidden = true; frame.src = 'about:blank'; document.body.style.overflow = ''; }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.video-card__play');
    if (btn) {
      frame.src = btn.getAttribute('data-video');
      popup.hidden = false;
      document.body.style.overflow = 'hidden';
      return;
    }
    if (e.target === popup || (e.target.closest && e.target.closest('.video-popup__close'))) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !popup.hidden) close(); });
}());
