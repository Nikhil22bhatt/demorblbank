/* index.js — homepage behaviour (replica): carousels, card rails, FD calculator (client-only),
   notification close, video popup. No network calls. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- full-width carousels (hero / promo / app): slick fade-less slide, 6 s autoplay, infinite ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (car) {
    var track = car.querySelector('.carousel__track');
    var slides = track.querySelectorAll('.carousel__slide:not(.carousel__slide--clone)');
    var dots = car.querySelectorAll('.dots__dot');
    var n = slides.length;
    var i = parseInt(track.style.getPropertyValue('--i'), 10) || 0;
    // the settled capture shows a different current slide below 768 (app banners: slide 2 vs 3)
    var mob = car.getAttribute('data-start-mobile');
    if (mob !== null && window.matchMedia('(max-width: 767px)').matches) { i = parseInt(mob, 10) || 0; track.style.setProperty('--i', i); }
    var timer = null;
    // replica freeze: autoplay is held at the captured slide (captureState restoreAtDelivery — the
    // delivered block re-enables it from data-autoplay-delivery); data-autoplay opts a carousel back in.
    var delay = parseInt(car.getAttribute('data-autoplay'), 10) || 0;
    function go(next) {
      i = (next + n) % n;
      car.classList.add('is-moving');
      track.style.setProperty('--i', i);
      for (var k = 0; k < n; k++) {
        if (k === i) slides[k].removeAttribute('aria-hidden'); else slides[k].setAttribute('aria-hidden', 'true');
        slides[k].classList.toggle('is-active', k === i);
        if (dots[k]) { dots[k].classList.toggle('is-active', k === i); dots[k].setAttribute('aria-current', String(k === i)); }
      }
      window.setTimeout(function () { car.classList.remove('is-moving'); }, 1020);
      restart();
    }
    function restart() {
      if (!delay || reduce) return;
      window.clearTimeout(timer);
      car.classList.remove('is-playing'); void car.offsetWidth; car.classList.add('is-playing');
      timer = window.setTimeout(function () { go(i + 1); }, delay);
    }
    var prev = car.querySelector('[class*="--prev"]');
    var next = car.querySelector('[class*="--next"]');
    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });
    Array.prototype.forEach.call(dots, function (d, k) { d.addEventListener('click', function () { go(k); }); });
    car.addEventListener('mouseenter', function () { window.clearTimeout(timer); });
    car.addEventListener('mouseleave', restart);
    restart();
  });

  /* ---------- card rails (slick, infinite:false, step 1 card) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-rail]'), function (rail) {
    var track = rail.querySelector('.rail__track');
    var items = rail.querySelectorAll('.rail__item');
    var prev = rail.querySelector('.rail__btn--prev');
    var next = rail.querySelector('.rail__btn--next');
    var pos = 0;
    function visible() {
      var vw = rail.querySelector('.rail__viewport').clientWidth;
      var step = items[0].getBoundingClientRect().width + 27;
      return { step: step, count: Math.max(1, Math.floor((vw + 27) / step)) };
    }
    function update() {
      var v = visible();
      var max = Math.max(0, items.length - v.count);
      pos = Math.min(Math.max(pos, 0), max);
      track.style.transform = 'translate3d(' + (-pos * v.step) + 'px,0,0)';
      if (prev) prev.disabled = pos === 0;
      if (next) next.disabled = pos >= max;
    }
    if (prev) prev.addEventListener('click', function () { pos -= 1; update(); });
    if (next) next.addEventListener('click', function () { pos += 1; update(); });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- notification ticker close ---------- */
  var close = document.querySelector('.notice__close');
  if (close) close.addEventListener('click', function () { document.body.classList.add('notice-closed'); });
  // live (motion-observe 1440): ticker hides once the page is scrolled (between 274 and 394 px), returns at the top
  var onScroll = function () { document.body.classList.toggle('notice-hidden', (window.pageYOffset || 0) >= 300); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Trust & Beyond video popup ---------- */
  var pop = document.getElementById('video-popup');
  if (pop) {
    var frame = pop.querySelector('iframe');
    Array.prototype.forEach.call(document.querySelectorAll('.video-card__btn'), function (b) {
      b.addEventListener('click', function () { frame.src = b.getAttribute('data-video'); pop.hidden = false; });
    });
    var shut = function () { pop.hidden = true; frame.src = ''; };
    pop.querySelector('.video-popup__close').addEventListener('click', shut);
    pop.addEventListener('click', function (e) { if (e.target === pop) shut(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) shut(); });
  }
})();

/* ---------- Fixed Deposit Calculator — client-only computation (dynamic-features row 3).
   Named assumption: the live widget's rate slab arrives from a backend not captured; the
   headline card rate on the page (7.00 % p.a.) is the base rate, +0.50 senior, +0.75 super
   senior. Cumulative = quarterly compounding (simple interest under 6 months); payout
   options = simple interest. Owner to supply the slab table before delivery. ---------- */
(function () {
  'use strict';
  var root = document.querySelector('[data-fd-calculator]');
  if (!root) return;
  var BASE = 7.0, SENIOR = 0.5, SUPER = 0.75;
  var q = function (s) { return root.querySelector(s); };
  var keys = ['amount', 'years', 'months', 'days'];
  var initial = {};
  var ranges = {}, vals = {};
  keys.forEach(function (k) {
    ranges[k] = q('[data-fdc-range="' + k + '"]'); vals[k] = q('[data-fdc-val="' + k + '"]');
    initial[k] = { range: ranges[k].value, val: vals[k].value };
  });
  var fmt = function (n) { return '₹ ' + Math.round(n).toLocaleString('en-IN'); };
  function paint(k) {
    var r = ranges[k];
    r.style.setProperty('--pct', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
  }
  function rate() {
    if (q('#fdc-cit-senior').checked) return BASE + SENIOR;
    if (q('#fdc-cit-super').checked) return BASE + SUPER;
    return BASE;
  }
  function compute() {
    var p = parseFloat(String(vals.amount.value).replace(/[^0-9.]/g, ''));
    var y = +ranges.years.value, m = +ranges.months.value, d = +ranges.days.value;
    var days = y * 365 + m * 30 + d;
    var outI = q('[data-fdc-out="interest"]'), outM = q('[data-fdc-out="maturity"]');
    var outR = q('[data-fdc-out="rate"]'), outD = q('[data-fdc-out="date"]');
    if (!p || p < 5000 || p > 10000000 || days < 7 || days > 3650) {
      outI.textContent = '₹'; outM.textContent = '₹'; outR.textContent = ''; outD.textContent = ''; return;
    }
    var r = rate(), t = days / 365, interest;
    var payout = q('[data-fdc-payout]').value;
    if (payout === 'cumulative' && days >= 180) interest = p * Math.pow(1 + r / 400, 4 * t) - p;
    else interest = p * r / 100 * t;
    var due = new Date(); due.setFullYear(due.getFullYear() + y); due.setMonth(due.getMonth() + m); due.setDate(due.getDate() + d);
    outI.textContent = fmt(interest);
    outM.textContent = fmt(payout === 'cumulative' ? p + interest : p);
    outR.textContent = r.toFixed(2);
    outD.textContent = due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    q('[data-fdc-headline]').textContent = r.toFixed(2) + ' ';
  }
  keys.forEach(function (k) {
    paint(k);
    ranges[k].addEventListener('input', function () {
      vals[k].value = k === 'amount' ? Number(ranges[k].value).toLocaleString('en-IN') : ranges[k].value;
      paint(k); compute();
    });
    vals[k].addEventListener('change', function () {
      var v = parseFloat(String(vals[k].value).replace(/[^0-9.]/g, ''));
      if (!isNaN(v)) { ranges[k].value = Math.min(Math.max(v, +ranges[k].min), +ranges[k].max); paint(k); }
      compute();
    });
  });
  Array.prototype.forEach.call(root.querySelectorAll('input[type="radio"], select'), function (el) {
    el.addEventListener('change', compute);
  });
  q('[data-fdc-reset]').addEventListener('click', function (e) {
    e.preventDefault();
    keys.forEach(function (k) { ranges[k].value = initial[k].range; vals[k].value = initial[k].val; paint(k); });
    q('#fdc-cit-general').checked = true; q('#fdc-type-normal').checked = true;
    q('[data-fdc-payout]').selectedIndex = 0; q('[data-fdc-headline]').textContent = '7.00 ';
    compute();
  });
})();

/* AOS parity (motion-observe 1440): live adds aos-animate once when the anchor section enters the viewport
   (AOS offset 120px); here each <section> holding [data-aos] is the anchor. */
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
