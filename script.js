/* ═══════════════════════════════════════════
   SIGNAL — Interactive Portfolio Engine
   ═══════════════════════════════════════════ */

document.fonts.ready.then(() => {
  initParticles();
  initCursor();
  initScrollProgress();
  initScrollReveal();
  initNavigation();
  initCounters();
  initPalette();
});

/* ── Particle Text System ── */
const PARTICLE_COLORS = ['#d4ff00', '#c8ee00', '#e0ff33', '#badd00', '#d4ff00'];

class Particle {
  constructor(x, y) {
    this.baseX = x;
    this.baseY = y;
    this.x = x + (Math.random() - 0.5) * 600;
    this.y = y + (Math.random() - 0.5) * 600;
    this.size = Math.random() * 1.8 + 0.6;
    this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    this.density = (Math.random() * 25) + 5;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.92;
    this.springFactor = 0.015 + Math.random() * 0.02;
    this.wobbleX = Math.random() * Math.PI * 2;
    this.wobbleY = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.005 + Math.random() * 0.01;
    this.wobbleRadius = 0.3 + Math.random() * 0.7;
    this.arrived = false;
  }

  update(mouse) {
    this.wobbleX += this.wobbleSpeed;
    this.wobbleY += this.wobbleSpeed * 1.3;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 120;

    if (dist < maxDist && mouse.active) {
      const force = (maxDist - dist) / maxDist;
      const forceX = (dx / dist) * force * this.density * -1;
      const forceY = (dy / dist) * force * this.density * -1;
      this.vx += forceX;
      this.vy += forceY;
    }

    const toBaseX = this.baseX - this.x;
    const toBaseY = this.baseY - this.y;
    this.vx += toBaseX * this.springFactor;
    this.vy += toBaseY * this.springFactor;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx + Math.sin(this.wobbleX) * this.wobbleRadius;
    this.y += this.vy + Math.cos(this.wobbleY) * this.wobbleRadius;

    if (Math.abs(toBaseX) < 2 && Math.abs(toBaseY) < 2) {
      this.arrived = true;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  const mouse = { x: -9999, y: -9999, active: false };

  const isMobile = window.innerWidth < 768;
  const gap = isMobile ? 5 : 3;
  const text = 'RIDZEAL';

  function resize() {
    const hero = document.getElementById('hero');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    resize();

    const fontSize = Math.min(canvas.width / (text.length * 0.58), canvas.height * 0.18, 180);
    ctx.font = `800 ${fontSize}px "Bricolage Grotesque"`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textX = canvas.width / 2;
    const textY = isMobile ? canvas.height * 0.15 : canvas.height * 0.38;
    ctx.fillText(text, textX, textY);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {
        const index = (y * canvas.width + x) * 4;
        if (imageData.data[index + 3] > 128) {
          particles.push(new Particle(x, y));
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.update(mouse);
      p.draw(ctx);
    }

    animFrame = requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animFrame);
      createParticles();
      animate();
    }, 250);
  });

  createParticles();
  animate();
}

/* ── Custom Cursor ── */
function initCursor() {
  if (window.innerWidth < 768) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let cx = 0, cy = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });

  function moveFollower() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(moveFollower);
  }
  moveFollower();

  const hoverables = 'a, button, .tech-tag, .project-card, .nav-cmd';
  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}

/* ── Scroll Progress ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ── Navigation ── */
function initNavigation() {
  const nav = document.getElementById('nav');
  const sideDots = document.querySelectorAll('.side-nav-dot');
  const sections = document.querySelectorAll('.section');

  // Nav background on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Active section tracking
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          sideDots.forEach((dot) => {
            dot.classList.toggle('active', dot.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));
}

/* ── Counter Animation ── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ── Command Palette ── */
function initPalette() {
  const palette = document.getElementById('palette');
  const overlay = document.getElementById('palette-overlay');
  const input = document.getElementById('palette-input');
  const list = document.getElementById('palette-list');
  const cmdBtn = document.getElementById('nav-cmd');
  if (!palette || !overlay) return;

  const items = list.querySelectorAll('.palette-item');
  let activeIndex = -1;

  function open() {
    palette.classList.add('open');
    overlay.classList.add('open');
    input.value = '';
    input.focus();
    activeIndex = -1;
    filterItems('');
  }

  function close() {
    palette.classList.remove('open');
    overlay.classList.remove('open');
    input.blur();
    activeIndex = -1;
    clearActive();
  }

  function clearActive() {
    items.forEach((i) => i.classList.remove('active'));
  }

  function setActive(index) {
    clearActive();
    activeIndex = index;
    if (index >= 0 && index < items.length) {
      items[index].classList.add('active');
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }

  function filterItems(query) {
    const q = query.toLowerCase();
    let visibleCount = 0;
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const keywords = (item.dataset.keywords || '').toLowerCase();
      const match = !q || text.includes(q) || keywords.includes(q);
      item.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });
    return visibleCount;
  }

  // Open triggers
  cmdBtn.addEventListener('click', open);
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    // "/" to open
    if (e.key === '/' && !palette.classList.contains('open')) {
      e.preventDefault();
      open();
      return;
    }
    // Escape to close
    if (e.key === 'Escape' && palette.classList.contains('open')) {
      e.preventDefault();
      close();
      return;
    }

    if (!palette.classList.contains('open')) return;

    // Arrow navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const visible = [...items].filter((i) => i.style.display !== 'none');
      const nextIdx = Math.min(activeIndex + 1, visible.length - 1);
      setActive(nextIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = Math.max(activeIndex - 1, 0);
      setActive(prevIdx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const visible = [...items].filter((i) => i.style.display !== 'none');
      if (activeIndex >= 0 && activeIndex < visible.length) {
        visible[activeIndex].click();
      } else if (visible.length === 1) {
        visible[0].click();
      }
    }
  });

  input.addEventListener('input', () => {
    filterItems(input.value);
    activeIndex = -1;
    clearActive();
  });

  items.forEach((item) => {
    item.addEventListener('click', () => {
      close();
    });
  });

  // Number keys (1-4) as shortcuts
  items.forEach((item, idx) => {
    const kbd = item.querySelector('kbd');
    if (kbd) {
      kbd.textContent = idx + 1;
    }
  });
}
