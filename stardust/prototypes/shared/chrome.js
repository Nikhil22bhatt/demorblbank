/* RBL Bank replica chrome behaviour — only behaviours observed firing on the live
   site (stardust/replica/motion/*.json, stardust/replica/chrome/*.json):
   1. scroll morph (live scroll-init.js): scrollTop >= 500 → .tab-wrap.fixed-tab,
      body.fixed-tab-body, body.body-active-effect (nav shadow + TOP button)
   2. desktop mega menus: open on hover and on click, close on outside click / mouse-leave;
      sub-levels switch on hover (tb-megamenu "open" class)
   3. FAQ accordion (Bootstrap collapse, data-bs-parent): one open at a time, height 0.35s ease
   4. mobile footer accordion: head click → .footer-head.active-t + fa-minus icon (as live)
   5. mobile products drawer: hamburger → .show + body.modal-open (as live); level labels → li.is-open */
(function () {
  var body = document.body;

  /* 1. scroll morph */
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var on = y >= 500;
    var tabs = document.querySelectorAll('.tab-wrap');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('fixed-tab', on);
    body.classList.toggle('fixed-tab-body', on);
    body.classList.toggle('body-active-effect', on);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  /* barrio.js: body.scrolled past 50px, scrolldown / scrollup by direction (no visual on this page) */
  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    body.classList.toggle('scrolled', y > 50);
    body.classList.toggle('scrolldown', y > lastY);
    body.classList.toggle('scrollup', y <= lastY);
    lastY = y;
  }, { passive: true });

  /* 2. mega menus */
  var items = document.querySelectorAll('.site-nav__item');
  function closeAll(except) {
    for (var i = 0; i < items.length; i++) {
      if (items[i] !== except) {
        items[i].classList.remove('open');
        items[i].querySelector('.site-nav__toggle').setAttribute('aria-expanded', 'false');
      }
    }
  }
  function open(item) {
    closeAll(item);
    item.classList.add('open');
    item.querySelector('.site-nav__toggle').setAttribute('aria-expanded', 'true');
  }
  Array.prototype.forEach.call(items, function (item) {
    item.addEventListener('mouseenter', function () { open(item); });
    item.addEventListener('mouseleave', function () { closeAll(); });
    item.querySelector('.site-nav__toggle').addEventListener('click', function () { open(item); });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-nav__item')) closeAll();
  });
  /* sub-levels: hovering an item shows only its own children (deeper levels start closed,
     as on live); the hovered trigger carries aria-expanded */
  Array.prototype.forEach.call(document.querySelectorAll('.mega__item'), function (li) {
    var head = li.querySelector(':scope > .mega__link');
    if (li.classList.contains('mega__item--parent') && head) head.setAttribute('aria-expanded', li.classList.contains('is-active') ? 'true' : 'false');
    li.addEventListener('mouseenter', function () {
      var sibs = li.parentNode.children;
      for (var i = 0; i < sibs.length; i++) {
        if (sibs[i] === li) continue;
        var open = sibs[i].querySelectorAll('.is-active');
        sibs[i].classList.remove('is-active');
        for (var j = 0; j < open.length; j++) open[j].classList.remove('is-active');
        var h = sibs[i].querySelector(':scope > .mega__link');
        if (h && h.hasAttribute('aria-expanded')) h.setAttribute('aria-expanded', 'false');
      }
      if (li.classList.contains('mega__item--parent')) {
        li.classList.add('is-active');
        if (head) head.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* 3. FAQ accordion */
  var toggles = document.querySelectorAll('.faq-card__toggle');
  function setPanel(btn, expand) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.setAttribute('aria-expanded', expand ? 'true' : 'false');
    btn.classList.toggle('collapsed', !expand);
    panel.classList.remove('collapse', 'show');
    if (expand) {
      panel.hidden = false;
      var h = panel.scrollHeight;
      panel.style.height = '0px';
      panel.classList.add('collapsing');
      panel.offsetHeight; // reflow
      panel.style.height = h + 'px';
    } else {
      if (panel.hidden) return;
      panel.style.height = panel.scrollHeight + 'px';
      panel.classList.add('collapsing');
      panel.offsetHeight;
      panel.style.height = '0px';
    }
    panel.addEventListener('transitionend', function done() {
      panel.removeEventListener('transitionend', done);
      panel.classList.remove('collapsing');
      panel.classList.add('collapse');
      panel.style.height = '';
      if (btn.getAttribute('aria-expanded') === 'true') panel.classList.add('show');
      else panel.hidden = true;
    });
  }
  Array.prototype.forEach.call(toggles, function (btn) {
    btn.addEventListener('click', function () {
      var expand = btn.getAttribute('aria-expanded') !== 'true';
      Array.prototype.forEach.call(toggles, function (other) {
        if (other === btn) return;
        if (other.getAttribute('aria-expanded') === 'true') setPanel(other, false);
        else other.classList.add('collapsed');
      });
      setPanel(btn, expand);
    });
  });

  /* 4. mobile footer accordion */
  var mq = window.matchMedia('(max-width: 767px)');
  Array.prototype.forEach.call(document.querySelectorAll('.footer-col .footer-head, .others-row .footer-head'), function (head) {
    head.addEventListener('click', function () {
      if (!mq.matches) return;
      var on = head.classList.toggle('active-t');
      var icon = head.querySelector('.footer-head__toggle');
      if (icon) { icon.classList.toggle('fa-minus', on); icon.classList.toggle('fa-plus', !on); }
    });
  });

  /* 5. mobile products drawer */
  var drawer = document.getElementById('modal-products');
  function setDrawer(on) {
    if (!drawer) return;
    drawer.classList.toggle('show', on);
    drawer.setAttribute('aria-hidden', on ? 'false' : 'true');
    body.classList.toggle('modal-open', on);
  }
  var hamb = document.querySelector('.mobile-nav__hamb');
  if (hamb) hamb.addEventListener('click', function () { setDrawer(true); });
  if (drawer) {
    drawer.querySelector('.drawer__close').addEventListener('click', function () { setDrawer(false); });
    drawer.querySelector('.drawer__overlay').addEventListener('click', function () { setDrawer(false); });
    Array.prototype.forEach.call(drawer.querySelectorAll('.has-children > .acnav__label'), function (label) {
      label.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        label.parentNode.classList.toggle('is-open');
      });
    });
  }
})();
