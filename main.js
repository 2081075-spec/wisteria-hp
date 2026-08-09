(function () {
  document.documentElement.classList.remove('no-js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- mobile drawer ----
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('gnav');
  function setMenu(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', String(open));
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!drawer.classList.contains('open')); });
  document.querySelectorAll('.drawer .close, .drawer a').forEach(function (el) {
    el.addEventListener('click', function () { setMenu(false); });
  });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 768) setMenu(false); });

  // ---- header color inversion over dark sections ----
  var header = document.querySelector('.hd');
  var sections = Array.prototype.slice.call(document.querySelectorAll('section'));
  var mode = null;
  function invert() {
    if (!header) return;
    var m = 'light';
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= 38 && r.bottom > 38) m = sections[i].classList.contains('dark') ? 'dark' : 'light';
    }
    if (m === mode) return;
    mode = m;
    header.classList.toggle('on-dark', m === 'dark');
  }

  // ---- scroll reveal / image mask / count-up ----
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-rv]'));
  var figs = Array.prototype.slice.call(document.querySelectorAll('[data-img]'));
  var counts = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var fmt = function (n) { return n.toLocaleString('ja-JP'); };

  if (reduced) {
    reveals.concat(figs).forEach(function (el) { el.classList.add('shown'); });
    counts.forEach(function (el) { el.textContent = fmt(Number(el.dataset.count)); });
    reveals = []; figs = []; counts = [];
  } else {
    counts.forEach(function (el) { el.textContent = '0'; });
  }

  function sweep() {
    var h = window.innerHeight;
    reveals = reveals.filter(function (el) {
      if (el.getBoundingClientRect().top > h * 0.94) return true;
      el.classList.add('shown');
      return false;
    });
    figs = figs.filter(function (el) {
      if (el.getBoundingClientRect().top > h * 0.9) return true;
      el.classList.add('shown');
      return false;
    });
    counts = counts.filter(function (el) {
      if (el.getBoundingClientRect().top > h * 0.85) return true;
      var to = Number(el.dataset.count), t0 = performance.now();
      (function tick(t) {
        var p = Math.min(((t || performance.now()) - t0) / 1200, 1);
        el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      return false;
    });
    return reveals.length + figs.length + counts.length;
  }

  var looping = false;
  function loop() { if (sweep() > 0) requestAnimationFrame(loop); else looping = false; }
  function kick() { if (looping) return; looping = true; requestAnimationFrame(loop); }

  window.addEventListener('scroll', function () { invert(); kick(); }, { passive: true });
  window.addEventListener('resize', kick);
  window.addEventListener('load', kick);
  invert();
  kick();

  // ---- hero intro (first visit per session) ----
  var arc = document.querySelector('.hero svg circle');
  var heroBody = document.querySelector('.hero .wrap');
  if (arc && heroBody && !reduced && sessionStorage.getItem('wis-intro') !== '1') {
    sessionStorage.setItem('wis-intro', '1');
    var len = 2 * Math.PI * 330;
    arc.style.strokeDasharray = len;
    arc.style.strokeDashoffset = len;
    arc.style.transform = 'rotate(-90deg)';
    arc.style.transformOrigin = '350px 350px';
    arc.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
      { duration: 1000, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
    Array.prototype.slice.call(heroBody.children).forEach(function (k, i) {
      k.style.opacity = '0';
      k.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: 700, delay: 900 + i * 140, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
    });
  }

  // ---- contact form (front-end validation only; wire up a real endpoint on the server) ----
  var form = document.querySelector('form.contact');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (n) { return form.elements[n] && form.elements[n].value ? form.elements[n].value.trim() : ''; };
      var errors = {};
      if (!val('name')) errors.name = 'お名前を入力してください。';
      var email = val('email');
      if (!email) errors.email = 'メールアドレスを入力してください。';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'メールアドレスの形式をご確認ください。例：info@example.com';
      if (!val('body')) errors.body = 'ご相談の内容を入力してください。どの事業について、何をお知りになりたいかをお書きください。';

      ['name', 'email', 'body'].forEach(function (k) {
        var p = document.getElementById(k + '-error');
        if (p) { p.textContent = errors[k] || ''; p.style.display = errors[k] ? 'block' : 'none'; }
      });
      var alert = form.querySelector('.alert');
      if (alert) alert.style.display = Object.keys(errors).length ? 'block' : 'none';

      if (Object.keys(errors).length) {
        var first = document.getElementById(Object.keys(errors)[0]);
        if (first) first.focus();
        return;
      }
      form.style.display = 'none';
      var done = document.querySelector('.done');
      if (done) done.style.display = 'block';
    });
  }
  var again = document.querySelector('.done .again');
  if (again) again.addEventListener('click', function () {
    document.querySelector('.done').style.display = 'none';
    form.reset();
    form.style.display = 'flex';
  });
})();
