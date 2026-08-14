(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  /* ── Palette ── */
  var COLORS = [
    'rgba(232, 98, 61, 0.55)',   /* coral */
    'rgba(232, 98, 61, 0.35)',
    'rgba(46, 63, 101, 0.40)',   /* navy */
    'rgba(46, 63, 101, 0.25)',
    'rgba(245, 212, 181, 0.70)', /* peach */
    'rgba(245, 212, 181, 0.50)',
  ];

  /* ── Particles ── */
  var COUNT = 160;
  var particles = [];

  function rand(min, max) { return min + Math.random() * (max - min); }

  function initParticles() {
    particles = [];
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x:     rand(0, canvas.width),
        y:     rand(0, canvas.height),
        r:     rand(2, 5.5),
        vx:    (Math.random() - 0.5) * 0.55,
        vy:    (Math.random() - 0.5) * 0.55,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  /* ── Resize ── */
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w   = canvas.clientWidth;
    var h   = canvas.clientHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    /* re-scatter so particles fill new size */
    initParticles();
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── Mouse repulsion ── */
  var mouse = { x: -9999, y: -9999 };
  var RADIUS = 90;   /* px — repulsion radius */
  var FORCE  = 1.4;  /* push strength */

  window.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    mouse.x = -9999; mouse.y = -9999;
  });

  /* ── Animation loop ── */
  function tick() {
    requestAnimationFrame(tick);

    var w = canvas.clientWidth;
    var h = canvas.clientHeight;

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p  = particles[i];
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var d  = Math.sqrt(dx * dx + dy * dy);

      if (d < RADIUS && d > 0.5) {
        var push = (RADIUS - d) / RADIUS * FORCE;
        p.vx += (dx / d) * push;
        p.vy += (dy / d) * push;
      }

      /* dampen */
      p.vx *= 0.97;
      p.vy *= 0.97;

      p.x += p.vx;
      p.y += p.vy;

      /* wrap edges */
      if (p.x < -6)     p.x = w + 6;
      if (p.x > w + 6)  p.x = -6;
      if (p.y < -6)     p.y = h + 6;
      if (p.y > h + 6)  p.y = -6;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
  }

  tick();
})();
