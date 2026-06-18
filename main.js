/* ============================================================
   Leroux Lab — shared JS
   - Page fade-in (via CSS animation on body)
   - Scroll-driven background hue shift (#F7F1E3 → #F3DFC8)
   - Scroll fade-up via IntersectionObserver (.fade-up elements)
   - Divider draw-in (.divider elements)
   - Footer reveal (.site-footer)
   - Staggered list reveals (news entries, publication entries)
   - Mobile nav toggle (hamburger)
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll-driven background hue shift ──
     Interpolates --bg from cream #F7F1E3 to warm peach #F3DFC8
     as the user scrolls from top to bottom of the page.
     Runs on every scroll tick via requestAnimationFrame for smoothness.
     If prefers-reduced-motion is set, applies the visual midpoint
     (#F5E6D3) as a static value and skips the scroll listener.
  */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--bg', '#F5E6D3');
  } else {
    var bgStart = [247, 241, 227]; /* #F7F1E3 */
    var bgEnd   = [243, 223, 200]; /* #F3DFC8 */
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

    applyBgShift(); /* set correct color on initial paint */
  }

  /* ── Mobile nav toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.innerHTML = open ? iconClose() : iconMenu();
    });

    /* Close nav when a link is tapped on mobile */
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = iconMenu();
      });
    });
  }

  function iconMenu() {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  }

  function iconClose() {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  }

  /* ── Staggered list reveals ──
     For .news-list and .pub-section containers, assign an increasing
     transition-delay to each .fade-up child so they cascade in at
     90ms intervals rather than all appearing simultaneously.
  */
  document.querySelectorAll('.news-list, .pub-section').forEach(function (group) {
    group.querySelectorAll('.fade-up').forEach(function (el, i) {
      el.style.transitionDelay = (i * 90) + 'ms';
    });
  });

  /* ── Scroll-driven reveals via IntersectionObserver ──
     Handles three element types:
       .fade-up   — opacity + translateY (existing)
       .divider   — width draw-in (new)
       .site-footer — opacity + translateY (new)
     CSS overrides all transitions when prefers-reduced-motion is set,
     so we run the observer unconditionally and let CSS decide the result.
  */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
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

    /* Fade-up elements (cards, entries, join sections…) */
    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });

    /* Divider draw-ins — one per section */
    document.querySelectorAll('.divider').forEach(function (el) {
      observer.observe(el);
    });

    /* Footer reveal */
    var footer = document.querySelector('.site-footer');
    if (footer) { observer.observe(footer); }

  } else {
    /* Fallback: no IntersectionObserver — show everything immediately */
    document.querySelectorAll('.fade-up, .divider').forEach(function (el) {
      el.classList.add('visible');
    });
    var footer = document.querySelector('.site-footer');
    if (footer) { footer.classList.add('visible'); }
  }

  /* ── Set aria-current="page" on active nav link ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

})();
