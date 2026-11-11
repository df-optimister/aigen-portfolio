/* Sticky TOC: nav height variable, scroll-spy, reveal-on-scroll. */
(function (root) {
  function initNav() {
    var doc = root.document;
    var nav = doc.querySelector('nav.toc');
    var links = Array.prototype.slice.call(doc.querySelectorAll('a.toc-link'));
    var sections = links
      .map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);

    function setNavHeight() {
      if (nav) doc.documentElement.style.setProperty('--nav-h', nav.getBoundingClientRect().height + 'px');
    }

    function currentId() {
      var navH = nav ? nav.getBoundingClientRect().height : 0;
      var probe = navH + 48;
      var atBottom = root.innerHeight + root.scrollY >= doc.documentElement.scrollHeight - 2;
      if (atBottom && sections.length) return sections[sections.length - 1].id;
      var id = sections.length ? sections[0].id : null;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= probe) id = s.id; });
      return id;
    }

    var ticking = false;
    function spy() {
      ticking = false;
      var id = currentId();
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }
    function onScroll() { if (!ticking) { ticking = true; root.requestAnimationFrame(spy); } }

    setNavHeight();
    spy();
    root.addEventListener('scroll', onScroll, { passive: true });
    root.addEventListener('resize', function () { setNavHeight(); onScroll(); });

    // reveal-on-scroll (CSS keeps everything visible under reduced motion)
    var reveals = doc.querySelectorAll('.reveal');
    var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in root)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new root.IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  if (typeof module === 'object' && module.exports) module.exports = { initNav: initNav };
  else root.initNav = initNav;
})(typeof window !== 'undefined' ? window : this);
