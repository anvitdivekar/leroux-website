/* ============================================================
   Leroux Lab — shared JS
   - Page fade-in (via CSS animation on body)
   - Scroll-driven background hue shift (#F7F1E3 → #F3DFC8)
   - Nav scroll-shrink (adds .scrolled at 40px)
   - Scroll fade-up via IntersectionObserver (.fade-up elements)
   - Divider draw-in (.divider elements)
   - Footer reveal (.site-footer)
   - Staggered list reveals (news entries, publication entries)
   - Mobile nav toggle (hamburger + backdrop overlay)
   - Page cross-fade transitions
   - Team card expand/collapse
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll-driven background hue shift ── */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--bg', '#F5E6D3');
  } else {
    var bgStart = [247, 241, 227];
    var bgEnd   = [243, 223, 200];
    var rafPending = false;

    function applyBgShift() {
      var scrolled = window.scrollY;
      var total    = document.documentElement.scrollHeight - window.innerHeight;
      var progress = total > 0 ? Math.min(scrolled / total, 1) : 0;

      var r = Math.round(bgStart[0] + (bgEnd[0] - bgStart[0]) * progress);
      var g = Math.round(bgStart[1] + (bgEnd[1] - bgStart[1]) * progress);
      var b = Math.round(bgStart[2] + (bgEnd[2] - bgStart[2]) * progress);

      document.documentElement.style.setProperty('--bg', 'rgb(' + r + ',' + g + ',' + b + ')');
      rafPending = false;
    }

    window.addEventListener('scroll', function () {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(applyBgShift);
      }
    }, { passive: true });

    applyBgShift();
  }

  /* ── Nav scroll-shrink ── */
  var header     = document.querySelector('.site-header');
  var headerInner = document.querySelector('.header-inner');

  if (header && headerInner) {
    window.addEventListener('scroll', function () {
      var isScrolled = window.scrollY > 40;
      header.classList.toggle('scrolled', isScrolled);
      headerInner.classList.toggle('scrolled', isScrolled);
    }, { passive: true });
  }

  /* ── Mobile nav toggle + backdrop ── */
  var toggle   = document.querySelector('.nav-toggle');
  var nav      = document.querySelector('.site-nav');
  var backdrop = document.querySelector('.nav-backdrop');

  function openNav() {
    nav.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.innerHTML = iconClose();
  }

  function closeNav() {
    nav.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = iconMenu();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.contains('open') ? closeNav() : openNav();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeNav);
  }

  function iconMenu() {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  }

  function iconClose() {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  }

  /* ── Page cross-fade transitions ── */
  if (!prefersReducedMotion) {
    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || href.startsWith('//')) return;
      link.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 200ms ease';
        setTimeout(function () { window.location.href = href; }, 210);
      });
    });
  }

  /* ── Team card expand/collapse ── */
  document.querySelectorAll('.team-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var wasExpanded = card.classList.contains('expanded');
      document.querySelectorAll('.team-card').forEach(function (c) {
        c.classList.remove('expanded');
      });
      if (!wasExpanded) card.classList.add('expanded');
    });
  });

  /* ── Staggered list reveals ── */
  document.querySelectorAll('.news-list, .pub-section').forEach(function (group) {
    group.querySelectorAll('.fade-up').forEach(function (el, i) {
      el.style.transitionDelay = (i * 90) + 'ms';
    });
  });

  /* ── Scroll-driven reveals via IntersectionObserver ── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-up').forEach(function (el) { observer.observe(el); });
    document.querySelectorAll('.divider').forEach(function (el) { observer.observe(el); });

    var footer = document.querySelector('.site-footer');
    if (footer) observer.observe(footer);

  } else {
    document.querySelectorAll('.fade-up, .divider').forEach(function (el) {
      el.classList.add('visible');
    });
    var footer = document.querySelector('.site-footer');
    if (footer) footer.classList.add('visible');
  }

  /* ── Set aria-current="page" on active nav link ── */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

})();
