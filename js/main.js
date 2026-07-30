// ============================================
// CONSTELLATION CANVAS
// ============================================
(function () {
  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    // Cover entire scrollable document height
    h = canvas.height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      window.innerHeight * 3
    );
  }

  function initParticles() {
    const count = Math.min(120, Math.floor((w * h) / 20000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.5 + 0.5
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const scrollY = window.scrollY;
    const viewTop = scrollY - 200;
    const viewBottom = scrollY + window.innerHeight + 200;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      if (p.y < viewTop || p.y > viewBottom) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(184,168,255,0.5)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        if (q.y < viewTop || q.y > viewBottom) continue;
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 125) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(123,95,255,${0.15 * (1 - dist / 125)})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  function setup() {
    resize();
    initParticles();
  }

  window.addEventListener('resize', setup);
  window.addEventListener('load', () => setTimeout(setup, 150));

  // Re-measure when body grows (new sections rendered)
  if (window.ResizeObserver) {
    new ResizeObserver(() => {
      const newH = Math.max(document.body.scrollHeight, window.innerHeight * 3);
      if (Math.abs(newH - h) > 100) { resize(); initParticles(); }
    }).observe(document.body);
  }

  setup();
  draw();
})();

// ============================================
// CURSOR GLOW
// ============================================
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  if (window.matchMedia('(pointer: fine)').matches) {
    let rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      rx = e.clientX; ry = e.clientY;
      glow.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    });
  } else {
    glow.style.display = 'none';
  }
})();

// ============================================
// SCROLL PROGRESS BAR
// ============================================
(function () {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }, { passive: true });
})();

// ============================================
// NAVBAR — SCROLL STATE + MOBILE TOGGLE
// ============================================
(function () {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// ============================================
// TYPING EFFECT — HERO
// ============================================
(function () {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Full-Stack Developer with an AI Edge',
    '3x Hackathon Winner',
    'AI / ML Engineer',
    'Problem Solver & Builder',
    'Team InnoQueens'
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0]; return;
  }

  function tick() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1900); return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 32 : 62);
  }
  tick();
})();

// ============================================
// SCROLL REVEAL
// ============================================
(function () {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), (i % 5) * 65);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });
  items.forEach(item => observer.observe(item));
})();

// ============================================
// ANIMATED COUNTERS — HERO STATS
// ============================================
(function () {
  const stats = document.querySelectorAll('.hero-stat-num');
  if (!stats.length) return;
  let done = false;

  function animateCount(el) {
    const target   = parseFloat(el.dataset.count);
    const decimal  = el.dataset.decimal === 'true';
    const suffix   = el.dataset.suffix || '';
    const duration = 1500;
    const t0       = performance.now();

    function frame(now) {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = target * e;
      el.textContent = (decimal ? v.toFixed(2) : Math.round(v)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const watcher = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !done) {
        done = true;
        stats.forEach(animateCount);
        watcher.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsRow = stats[0].closest('.hero-stats');
  if (statsRow) watcher.observe(statsRow);
})();

// ============================================
// SMOOTH ANCHOR SCROLL (offset for fixed nav)
// ============================================
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
