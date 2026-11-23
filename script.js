/* =========================================
   PORTFOLIO JAVASCRIPT
   Ankit Kumar Pal — Cybersecurity Portfolio
   ========================================= */

// ---- PARTICLE SYSTEM ----
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(rand = false) {
      this.x = Math.random() * W;
      this.y = rand ? Math.random() * H : H + 10;
      this.size  = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color  = Math.random() > 0.5 ? '0,255,136' : '0,212,255';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `rgba(${this.color},1)`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${this.color},0.8)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


// ---- NAVBAR SCROLL EFFECT ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});


// ---- MOBILE HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function setActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });


// ---- SCROLL REVEAL + SKILL BARS ----
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .section-header, .about-grid, .skills-categories, .projects-grid, .timeline-item, .edu-card, .blog-card, .contact-grid, .testimonials-container');
const skillFills = document.querySelectorAll('.skill-fill');

let skillsStarted   = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    // Reveal animation
    if (el.classList.contains('reveal') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right')) {
      el.classList.add('visible');
    }

    // Skill bars
    if (!skillsStarted && el.closest('#skills')) {
      skillsStarted = true;
      skillFills.forEach((fill, i) => {
        setTimeout(() => fill.classList.add('animated'), i * 80);
      });
    }

    observer.unobserve(el);
  });
}, { threshold: 0.15 });

// Add reveal class to key elements and observe
function setupReveal() {
  document.querySelectorAll('.section-header').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = '0s';
    observer.observe(el);
  });
  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.classList.add('reveal-left');
    el.style.transitionDelay = `${i * 0.12}s`;
    observer.observe(el);
  });
  document.querySelectorAll('.edu-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });
  document.querySelectorAll('.blog-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });
  document.querySelectorAll('.skill-category').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.12}s`;
    observer.observe(el);
  });
  document.querySelectorAll('.tech-tag').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.03}s`;
    observer.observe(el);
  });
  document.querySelectorAll('.badge').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });
  document.querySelector('.about-content')?.classList.add('reveal-right');
  observer.observe(document.querySelector('.about-content'));
  document.querySelector('.about-image-wrapper')?.classList.add('reveal-left');
  observer.observe(document.querySelector('.about-image-wrapper'));
  document.querySelector('.testimonials-container')?.classList.add('reveal');
  observer.observe(document.querySelector('.testimonials-container'));
  document.querySelector('.contact-info')?.classList.add('reveal-left');
  observer.observe(document.querySelector('.contact-info'));
  // Skills section observer
  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);
}
setupReveal();

// ---- TESTIMONIAL SLIDER ----
const track  = document.getElementById('testimonial-track');
const dots   = document.querySelectorAll('.t-dot-item');
const prevBtn = document.getElementById('t-prev');
const nextBtn = document.getElementById('t-next');
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.testimonial-card').length;
let autoSlide;

function goToSlide(n) {
  currentSlide = (n + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAuto(); });
nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAuto(); });
dots.forEach(d => d.addEventListener('click', () => { goToSlide(+d.dataset.idx); resetAuto(); }));

function resetAuto() { clearInterval(autoSlide); autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000); }
autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);

// Touch swipe
let touchStartX = 0;
track.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { goToSlide(currentSlide + (diff > 0 ? 1 : -1)); resetAuto(); }
}, { passive: true });


// ---- CONTACT FORM ----
const form = document.getElementById('contact-form');
const messageInput = document.getElementById('message');
const messageCount = document.getElementById('message-count');

messageInput.addEventListener('input', () => {
  messageCount.textContent = `${messageInput.value.length} / 5000`;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('contact-submit');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('⚠️ Please fill required fields.', '#ff6b6b');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ Invalid email address.', '#ff6b6b');
    return;
  }

  btn.querySelector('span').textContent = 'Sending...';
  btn.disabled = true;

  const endpoint = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '5000'))
    ? 'http://127.0.0.1:5000/api/contact'
    : '/api/contact';

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, subject, message })
  })
    .then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to send your message.');
      showToast('✅ Request sent! I\'ll get back to you soon.', '#00ff88');
      form.reset();
      messageCount.textContent = '0 / 5000';
    })
    .catch(error => {
      showToast(`⚠️ ${error.message || 'Unable to send your request. Please try again.'}`, '#ff6b6b');
    })
    .finally(() => {
      btn.querySelector('span').textContent = 'Send Request';
      btn.disabled = false;
    });
});


// ---- TOAST NOTIFICATION ----
let toastEl = document.createElement('div');
toastEl.id = 'toast';
document.body.appendChild(toastEl);
let toastTimer;

function showToast(msg, color = '#00ff88') {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.style.color = color;
  toastEl.style.borderColor = color;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
}


// ---- TYPING EFFECT in TERMINAL ----
(function typingEffect() {
  const typingEl = document.querySelector('.typing-output');
  if (!typingEl) return;
  const originalText = typingEl.innerHTML;
  const text = 'System Secured. ';
  typingEl.innerHTML = '<span class="cursor-blink">█</span>';
  let i = 0;
  function type() {
    if (i < text.length) {
      typingEl.innerHTML = text.slice(0, ++i) + '<span class="cursor-blink">█</span>';
      setTimeout(type, 60 + Math.random() * 60);
    }
  }
  setTimeout(type, 1000);
})();


// ---- CUSTOM CURSOR GLOW (desktop only) ----
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: rgba(0,255,136,0.15);
    border: 1px solid rgba(0,255,136,0.5);
    transform: translate(-50%,-50%);
    transition: width 0.2s, height 0.2s, opacity 0.2s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(cursor);

  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  document.querySelectorAll('a, button, .tech-tag, .project-card, .blog-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '36px';
      cursor.style.height = '36px';
      cursor.style.background = 'rgba(0,255,136,0.25)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.background = 'rgba(0,255,136,0.15)';
    });
  });

  function moveCursor() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    cursor.style.left = `${cx}px`;
    cursor.style.top  = `${cy}px`;
    requestAnimationFrame(moveCursor);
  }
  moveCursor();
}


// ---- MATRIX RAIN (subtle, background canvas overlay) ----
(function matrixRain() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; inset: 0; z-index: 0;
    pointer-events: none; opacity: 0.025;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 20);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|<>?/\\;:,.~`';
  function draw() {
    ctx.fillStyle = 'rgba(5,10,15,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = '14px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 20, y * 20);
      if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(draw, 80);
})();


// ---- GLITCH EFFECT on NAME ----
(function glitchName() {
  const name = document.querySelector('.hero-name');
  if (!name) return;
  setInterval(() => {
    name.style.textShadow = `${(Math.random()-0.5)*6}px 0 #00ff88, ${(Math.random()-0.5)*6}px 0 #00d4ff`;
    setTimeout(() => { name.style.textShadow = ''; }, 80);
  }, 4000);
})();


// ---- SMOOTH SCROLL for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ---- KEYBOARD SHORTCUT: press '/' to focus nav ----
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  }
});


// ---- CONSOLE EASTER EGG ----
console.log(
  '%c\n' +
  '  ___   _  _____ \n' +
  ' / _ \\ | |/ / __|\n' +
  '| (_) || \' <| _| \n' +
  ' \\__\\_\\|_|\\_\\___|  Security Portfolio\n\n' +
  '  Ankit Kumar Pal — Cybersecurity Specialist\n' +
  '  "The best defense is a good offense."\n',
  'color: #00ff88; font-family: monospace; font-size: 12px;'
);
