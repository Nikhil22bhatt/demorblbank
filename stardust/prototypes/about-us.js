/* about-us: year-strip arrows (live slick: slidesToScroll 1, prev disabled at the start, 10 / 3 visible).
   The awards list itself is a static snapshot of the view's settled state (dynamic-features row 5).
   AOS parity (motion-observe 1440): live adds aos-animate once when the data-aos-anchor section enters the viewport
   (AOS offset 120px); here each <section> holding [data-aos] is the anchor. */
(function () {
  document.querySelectorAll('.au-years').forEach(function (strip) {
    var track = strip.querySelector('.au-years__track');
    var prev = strip.querySelector('.au-years__btn--prev');
    var next = strip.querySelector('.au-years__btn--next');
    if (!track || !prev || !next) return;
    var items = track.querySelectorAll('.au-years__item:not(.au-years__item--any)');
    var index = 0;
    function visible() { return window.matchMedia('(max-width: 767px)').matches ? 3 : 10; }
    function render() {
      var max = Math.max(0, items.length - visible());
      index = Math.min(Math.max(index, 0), max);
      var step = items[0] ? items[0].getBoundingClientRect().width : 0;
      track.style.transform = 'translateX(' + (5 - index * step) + 'px)';
      prev.disabled = index === 0;
      next.disabled = index === max;
    }
    prev.addEventListener('click', function () { index -= 1; render(); });
    next.addEventListener('click', function () { index += 1; render(); });
    window.addEventListener('resize', render);
  });
})();

(function () {
  var targets = document.querySelectorAll('[data-aos]');
  if (!targets.length) return;
  function reveal(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('[data-aos]'), function (el) { el.classList.add('aos-animate'); });
  }
  if (!('IntersectionObserver' in window)) { reveal(document); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -120px 0px' });
  var anchors = [];
  Array.prototype.forEach.call(targets, function (el) {
    var a = el.closest('section') || el;
    if (anchors.indexOf(a) < 0) { anchors.push(a); io.observe(a); }
  });
})();
