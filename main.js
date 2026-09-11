(function () {
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'cubic-bezier(.16,1,.3,1)';

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

  // ---- header colour inversion over dark sections ----
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
  window.addEventListener('scroll', invert, { passive: true });
  invert();

  // ---- split headings into characters (Latin runs stay whole words) ----
  function splitNode(node) {
    var text = node.nodeValue;
    if (!text.trim()) return;
    var frag = document.createDocumentFragment();
    var re = /([A-Za-z0-9&.,'’\-]+)|(\s+)|([^A-Za-z0-9\s])/g, m;
    while ((m = re.exec(text))) {
      if (m[2]) { frag.appendChild(document.createTextNode(m[2])); continue; }
      if (m[1]) {
        var w = document.createElement('span'); w.className = 'w';
        for (var i = 0; i < m[1].length; i++) { var c = document.createElement('span'); c.className = 'ch'; c.textContent = m[1][i]; w.appendChild(c); }
        frag.appendChild(w);
      } else {
        var ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = m[3];
        var last = frag.lastChild;
        if (/[、。，．・」』）]/.test(m[3]) && last && last.nodeType === 1) {
          if (last.classList.contains('w')) { last.appendChild(ch); }
          else { var g = document.createElement('span'); g.className = 'w'; frag.replaceChild(g, last); g.appendChild(last); g.appendChild(ch); }
        } else { frag.appendChild(ch); }
      }
    }
    node.parentNode.replaceChild(frag, node);
  }
  document.querySelectorAll('[data-split]').forEach(function (el) {
    if (reduced) return;
    Array.prototype.slice.call(el.childNodes).forEach(function (n) { if (n.nodeType === 3) splitNode(n); });
    var chars = el.querySelectorAll('.ch');
    var step = Math.max(14, Math.min(40, 900 / Math.max(chars.length, 1)));
    chars.forEach(function (c, i) { c.style.transitionDelay = (i * step) + 'ms'; });
    el.classList.add('split');
  });

  // ---- reveal engine (IntersectionObserver, with a scroll fallback) ----
  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-rv],[data-stagger],[data-img],[data-line],.headrow,[data-split],.idx'));
  var counts = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var fmt = function (n) { return n.toLocaleString('ja-JP'); };

  function show(el) {
    if (el.classList.contains('shown')) return;
    el.classList.add('shown');
    if (el.hasAttribute('data-stagger') || el.classList.contains('idx')) {
      Array.prototype.slice.call(el.children).forEach(function (k, i) {
        k.style.transitionDelay = (i * 90) + 'ms';
        k.classList.add('shown');
      });
    }
  }
  function countUp(el) {
    var to = Number(el.dataset.count), t0 = performance.now();
    (function tick(t) {
      var p = Math.min((t - t0) / 1300, 1);
      el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  if (reduced) {
    targets.forEach(function (el) { el.classList.add('shown'); Array.prototype.forEach.call(el.children, function (k) { k.classList.add('shown'); }); });
    counts.forEach(function (el) { el.textContent = fmt(Number(el.dataset.count)); });
  } else {
    counts.forEach(function (el) { el.textContent = '0'; });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          if (en.target.hasAttribute('data-count')) countUp(en.target); else show(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
      targets.concat(counts).forEach(function (el) { io.observe(el); });
    } else {
      targets.forEach(show);
      counts.forEach(function (el) { el.textContent = fmt(Number(el.dataset.count)); });
    }
    // Safety net: nothing may stay hidden for long, whatever the browser does.
    setTimeout(function () {
      targets.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) show(el);
      });
    }, 1800);
  }

  // ---- signature: one vine, many blossoms ----
  function buildVine(root) {
    var svg = root.querySelector('svg.lines');
    var items = Array.prototype.slice.call(root.querySelectorAll('li'));
    if (!svg || !items.length) return;
    var NS = 'http://www.w3.org/2000/svg';
    var paths = [], tips = [];
    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      paths = []; tips = [];
      var rb = root.getBoundingClientRect();
      var origin = root.querySelector('.origin');
      var ob = origin ? origin.getBoundingClientRect() : rb;
      var ox = ob.left + ob.width / 2 - rb.left, oy = ob.top + ob.height / 2 - rb.top;
      svg.setAttribute('viewBox', '0 0 ' + rb.width + ' ' + rb.height);
      items.forEach(function (li, i) {
        var a = li.querySelector('a') || li;
        var b = a.getBoundingClientRect();
        var tx = b.left - rb.left + 4, ty = b.top + b.height / 2 - rb.top;
        var c1x = ox, c1y = oy + (ty - oy) * 0.55;
        var c2x = tx - Math.min(70, Math.max(24, (tx - ox) * 0.6)), c2y = ty;
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', 'M' + ox + ' ' + oy + ' C' + c1x + ' ' + c1y + ',' + c2x + ' ' + c2y + ',' + tx + ' ' + ty);
        svg.appendChild(p);
        var t = document.createElementNS(NS, 'circle');
        t.setAttribute('class', 'tip'); t.setAttribute('cx', tx); t.setAttribute('cy', ty); t.setAttribute('r', 3);
        svg.appendChild(t);
        paths.push(p); tips.push(t);
      });
    }
    function animate() {
      if (reduced) { items.forEach(function (li) { li.classList.add('shown'); }); paths.forEach(function (p, i) { p.classList.add('drawn'); tips[i].classList.add('drawn'); }); return; }
      paths.forEach(function (p, i) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        p.style.transitionDelay = (350 + i * 140) + 'ms';
        tips[i].style.transitionDelay = (1100 + i * 140) + 'ms';
      });
      // two frames so the initial dashoffset is committed before the transition starts
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        paths.forEach(function (p, i) {
          p.classList.add('drawn'); tips[i].classList.add('drawn');
          setTimeout(function () { items[i].classList.add('shown'); }, 950 + i * 140);
        });
      }); });
    }
    items.forEach(function (li, i) {
      li.addEventListener('mouseenter', function () { if (paths[i]) { paths[i].classList.add('hot'); tips[i].classList.add('hot'); } });
      li.addEventListener('mouseleave', function () { if (paths[i]) { paths[i].classList.remove('hot'); tips[i].classList.remove('hot'); } });
    });
    var started = false;
    function start() {
      draw();
      if (!started) { started = true; animate(); }
      else { items.forEach(function (li) { li.classList.add('shown'); }); paths.forEach(function (p, i) { p.style.transitionDelay = '0ms'; p.classList.add('drawn'); tips[i].style.transitionDelay = '0ms'; tips[i].classList.add('drawn'); }); }
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { draw(); items.forEach(function (li) { li.classList.add('shown'); }); paths.forEach(function (p, i) { p.style.transition = 'none'; p.classList.add('drawn'); tips[i].style.transition = 'none'; tips[i].classList.add('drawn'); }); }, 120); });
    if (!reduced && 'IntersectionObserver' in window && !root.closest('.hero')) {
      // vines outside the hero wait until they scroll into view
      started = true;
      var seen = false;
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !seen) { seen = true; vio.disconnect(); draw(); animate(); } });
      }, { threshold: 0.2 });
      vio.observe(root);
    }
  }
  document.querySelectorAll('.vine').forEach(buildVine);

  // ---- hero intro ----
  var hero = document.querySelector('.hero');
  if (hero) {
    var ring = hero.querySelector('.ring circle');
    if (ring && !reduced) {
      var r = Number(ring.getAttribute('r')), len = 2 * Math.PI * r;
      ring.style.strokeDasharray = len; ring.style.strokeDashoffset = len;
      ring.style.transform = 'rotate(-90deg)'; ring.style.transformOrigin = '50% 50%';
      ring.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1600, easing: EASE, fill: 'forwards' });
    }
    var intro = hero.querySelector('.intro');
    if (intro && !reduced) {
      Array.prototype.slice.call(intro.children).forEach(function (k, i) {
        if (k.hasAttribute('data-split')) return;
        k.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 200 + i * 160, easing: EASE, fill: 'backwards' });
      });
    }
  }

  // ---- page transitions ----
  if (!reduced) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (a.target && a.target !== '_self') return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      if (/\.(png|jpg|jpeg|pdf|svg|zip)$/i.test(url.pathname)) return;
      e.preventDefault();
      doc.classList.add('leaving');
      setTimeout(function () { location.href = url.href; }, 300);
    });
    window.addEventListener('pageshow', function () { doc.classList.remove('leaving'); });
  }

  // ---- contact form: sends to info@wisteria.email via FormSubmit (AJAX) ----
  var form = document.querySelector('form.contact');
  var done = document.querySelector('.done');
  if (form) {
    var endpoint = form.getAttribute('data-endpoint');
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
      var alertMsg = alert ? alert.querySelector('p') : null;
      if (Object.keys(errors).length) {
        if (alert) { alert.style.display = 'block'; if (alertMsg) alertMsg.innerHTML = '入力されていない項目があります。下の赤い表示のある欄をご確認ください。'; }
        var first = document.getElementById(Object.keys(errors)[0]);
        if (first) first.focus();
        return;
      }
      if (alert) alert.style.display = 'none';
      if (val('_honey')) return; // bot

      var btn = form.querySelector('button.submit');
      var kindSel = form.elements.kind;
      var kindLabel = kindSel && kindSel.options[kindSel.selectedIndex] ? kindSel.options[kindSel.selectedIndex].text : '';
      var payload = {
        '種別': kindLabel,
        '会社名・団体名': val('company'),
        'お名前': val('name'),
        'メールアドレス': email,
        '電話番号': val('tel'),
        'ご相談の内容': val('body'),
        '_subject': '【Wisteria HP】お問い合わせ：' + kindLabel,
        '_replyto': email,
        '_template': 'table'
      };
      function ok() {
        form.style.display = 'none';
        if (done) { done.style.display = 'block'; done.focus && done.focus(); }
        window.scrollTo({ top: done ? done.getBoundingClientRect().top + window.scrollY - 120 : 0, behavior: 'smooth' });
      }
      function fail() {
        if (btn) { btn.disabled = false; btn.textContent = '相談内容を送る'; }
        var subject = encodeURIComponent(payload._subject);
        var bodyText = encodeURIComponent('会社名・団体名：' + payload['会社名・団体名'] + '\nお名前：' + payload['お名前'] + '\nメール：' + email + '\n電話：' + payload['電話番号'] + '\n\n' + payload['ご相談の内容']);
        if (alert) {
          alert.style.display = 'block';
          if (alertMsg) alertMsg.innerHTML = '送信できませんでした。お手数ですが、<a href="mailto:info@wisteria.email?subject=' + subject + '&body=' + bodyText + '">info@wisteria.email へ直接メールを送る</a>か、しばらく経ってからもう一度お試しください。';
        }
      }
      if (!endpoint || !window.fetch) { fail(); return; }
      if (btn) { btn.disabled = true; btn.textContent = '送信しています…'; }
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, json: j }; }); })
        .then(function (res) { if (res.status >= 200 && res.status < 300 && String(res.json.success) !== 'false') ok(); else fail(); })
        .catch(fail);
    });
  }
  var again = document.querySelector('.done .again');
  if (again && form) again.addEventListener('click', function () {
    done.style.display = 'none';
    form.reset();
    var btn = form.querySelector('button.submit');
    if (btn) { btn.disabled = false; btn.textContent = '相談内容を送る'; }
    form.style.display = 'flex';
  });
})();
