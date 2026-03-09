/* ============================================
   EXPERTFLOW — LANDING PAGE JAVASCRIPT
   Interactions, animations & counters
   ============================================ */

'use strict';

// ─── NAVBAR SCROLL EFFECT ─────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ─── MOBILE HAMBURGER MENU ────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen.toString());

  // Animate hamburger → X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── INTERSECTION OBSERVER — FADE IN ─────────────
const fadeEls = document.querySelectorAll('.feature-card, .step-item, .testimonial-card, .pricing-card, .faq-item, .problem-item, .solution-item, .pipeline-step, .metric-item');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach((el, i) => {
  // Stagger by group
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  fadeObserver.observe(el);
});

// Add initial hidden state for generic fade
document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .faq-item, .problem-item, .solution-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.25s ease, border-color 0.18s ease, background 0.18s ease';
});

const reverseFadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        reverseFadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
);

document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .faq-item, .problem-item, .solution-item').forEach((el) => {
  reverseFadeObserver.observe(el);
});

// ─── ANIMATED COUNTERS ────────────────────────────
const counterEls = document.querySelectorAll('.metric-num');

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const current = Math.round(easedProgress * target);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counterEls.forEach(el => counterObserver.observe(el));

// ─── FAQ ACCORDION ────────────────────────────────
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(f => {
      f.classList.remove('open');
      f.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

// ─── HERO DASHBOARD — AI PROGRESS ANIMATION ──────
(function animateAIProgress() {
  const progressEl = document.querySelector('.ai-progress');
  if (!progressEl) return;

  let value = 73;
  let increasing = true;

  setInterval(() => {
    if (increasing) {
      value = Math.min(value + 1, 100);
      if (value >= 100) {
        setTimeout(() => {
          value = 12;
          progressEl.textContent = value + '%';
        }, 1500);
        increasing = false;
        setTimeout(() => { increasing = true; }, 2500);
      }
    }
    progressEl.textContent = value + '%';
  }, 80);
})();

// ─── DASHBOARD PROCESS ROW — HOVER HIGHLIGHT ─────
document.querySelectorAll('.process-row').forEach(row => {
  row.style.cursor = 'default';
});

// ─── PIPELINE STEPS — SEQUENTIAL HIGHLIGHT ───────
(function pipelineHighlight() {
  const steps = document.querySelectorAll('.pipeline-step');
  if (!steps.length) return;

  let current = 0;

  function highlight() {
    steps.forEach((s, i) => {
      if (i === current) {
        s.style.transform = 'translateY(-8px) scale(1.04)';
        s.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)';
      } else {
        s.style.transform = '';
        s.style.boxShadow = '';
      }
    });

    current = (current + 1) % steps.length;
  }

  // Only run the animation when section is visible
  const pipelineSection = document.querySelector('.pipeline-section');
  if (!pipelineSection) return;

  const pipelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const interval = setInterval(highlight, 1000);
          pipelineObserver.disconnect();
          // Stop after one full cycle
          setTimeout(() => clearInterval(interval), steps.length * 1000 + 500);
        }
      });
    },
    { threshold: 0.5 }
  );

  pipelineObserver.observe(pipelineSection);
})();

// ─── NAV LINK ACTIVE ON SCROLL ────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

// Add active nav style
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-link.active { color: var(--brand-600); background: var(--brand-50); }`;
document.head.appendChild(navStyle);

// ─── HERO CONTENT — ENTRANCE ANIMATION ───────────
(function heroEntrance() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  heroContent.style.opacity = '0';
  heroContent.style.transform = 'translateY(32px)';
  heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.2,0.8,0.3,1)';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    });
  });
})();

console.log('%cExpertFlow Landing Page loaded ⚡', 'color: #f97316; font-weight: bold; font-size: 14px;');
