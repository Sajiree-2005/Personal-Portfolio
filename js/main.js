// ============================================
// CONSTELLATION CANVAS BACKGROUND
// ============================================
(function () {
  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');
  let w, h, particles, mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight * Math.max(2.2, document.body.scrollHeight / window.innerHeight);
  }

  function initParticles() {
    const count = Math.min(110, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const scrollY = window.scrollY;
    const viewTop = scrollY - 200;
    const viewBottom = scrollY + window.innerHeight + 200;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      if (p.y < viewTop || p.y > viewBottom) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(184, 168, 255, 0.55)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        if (q.y < viewTop || q.y > viewBottom) continue;
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(123, 95, 255, ${0.16 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  function handleResize() {
    resize();
    initParticles();
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('load', () => setTimeout(handleResize, 200));

  resize();
  initParticles();
  draw();

  // Mirror real scrollHeight changes
  const ro = new ResizeObserver(() => handleResize());
  ro.observe(document.body);
})();

// ============================================
// CURSOR GLOW
// ============================================
(function () {
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
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
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();

// ============================================
// NAVBAR SCROLL STATE + MOBILE TOGGLE
// ============================================
(function () {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

// ============================================
// TYPING EFFECT — HERO HEADLINE
// ============================================
(function () {
  const el = document.getElementById('typingText');
  const phrases = [
    'Full-Stack Developer with an AI Edge',
    'Creator of OsteoAI',
    '3x Hackathon Winner',
    'AI/ML Engineer & Builder'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
  } else {
    tick();
  }
})();

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
(function () {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i % 4 * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
})();

// ============================================
// ANIMATED COUNTERS — HERO STATS
// ============================================
(function () {
  const stats = document.querySelectorAll('.hero-stat-num');
  let started = false;

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === 'true';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        stats.forEach(animateCount);
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (stats.length) observer.observe(stats[0].closest('.hero-stats'));
})();

// ============================================
// SMOOTH ANCHOR SCROLL OFFSET (account for fixed navbar)
// ============================================
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
