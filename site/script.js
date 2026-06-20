/* =============================================
   SCRIPT.JS — Dr. Robert Telman
   ============================================= */

/* ---- Header scroll shadow ---- */
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Adicione no CSS se quiser o efeito:
// .header.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.5); }

/* ---- Mobile burger menu ---- */
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

/* ---- Quiz / Triagem ---- */
const steps = document.querySelectorAll('.quiz__step');

function showStep(id) {
  steps.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

// Opções avançam para o próximo passo
document.querySelectorAll('.quiz__option').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('data-next');
    if (next) showStep(next);
  });
});

// Botões de voltar
document.querySelectorAll('.quiz__back').forEach(btn => {
  btn.addEventListener('click', () => {
    const back = btn.getAttribute('data-back');
    if (back) showStep(back);
  });
});

/* ---- Smooth scroll para âncoras internas ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // altura do header fixo
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Intersection Observer: fade-in ao scroll ---- */
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.12,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Elementos que serão animados
document.querySelectorAll(
  '.hero__content, .triage__inner, .results .container, .patients__grid, .doctor__inner, .footer__inner'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

/* Adicione no CSS para o fade-in funcionar:

.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

*/