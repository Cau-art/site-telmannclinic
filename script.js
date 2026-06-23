/* =============================================
   SCRIPT.JS — Telmann Clinic
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

// Armazena as respostas selecionadas
const respostas = {
  pergunta1: '',
  pergunta2: '',
  pergunta3: ''
};

function showStep(id) {
  steps.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

// Opções avançam para o próximo passo e salvam a resposta
document.querySelectorAll('.quiz__option').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('data-next');

    // Salva a resposta de acordo com o step atual
    const stepAtual = btn.closest('.quiz__step').id;
    const textoResposta = btn.childNodes[0].textContent.trim();

    if (stepAtual === 'step1') respostas.pergunta1 = textoResposta;
    if (stepAtual === 'step2') respostas.pergunta2 = textoResposta;
    if (stepAtual === 'step3') respostas.pergunta3 = textoResposta;

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

/* ---- Rodízio entre os dois números de WhatsApp ---- */
const whatsappNumeros = [
  '5511910003333',
  '5511916755840'
];

function getProximoNumero() {
  const indiceAtual = parseInt(localStorage.getItem('whatsappIndice') || '0');
  const numero = whatsappNumeros[indiceAtual];
  const proximoIndice = (indiceAtual + 1) % whatsappNumeros.length;
  localStorage.setItem('whatsappIndice', proximoIndice);
  return numero;
}

/* ---- Envio para WhatsApp com dados + respostas ---- */
document.getElementById('btnEnviar').addEventListener('click', () => {
  const nome     = document.getElementById('nomeInput').value.trim();
  const email    = document.getElementById('emailInput').value.trim();
  const telefone = document.getElementById('telefoneInput').value.trim();

  if (!nome || !email || !telefone) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const numero = getProximoNumero();

  const mensagem =
    `Olá! Fiz a triagem online e gostaria de agendar uma pré-análise.%0A%0A` +
    `👤 *Nome:* ${encodeURIComponent(nome)}%0A` +
    `📧 *E-mail:* ${encodeURIComponent(email)}%0A` +
    `📱 *Telefone:* ${encodeURIComponent(telefone)}%0A%0A` +
    `📋 *Respostas da triagem:*%0A` +
    `1️⃣ Tempo de queda: ${encodeURIComponent(respostas.pergunta1)}%0A` +
    `2️⃣ Região afetada: ${encodeURIComponent(respostas.pergunta2)}%0A` +
    `3️⃣ Objetivo: ${encodeURIComponent(respostas.pergunta3)}`;

  window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
  showStep('result');
});

/* ---- Reiniciar Quiz ---- */
function reiniciarQuiz() {
  document.getElementById('nomeInput').value = '';
  document.getElementById('emailInput').value = '';
  document.getElementById('telefoneInput').value = '';
  respostas.pergunta1 = '';
  respostas.pergunta2 = '';
  respostas.pergunta3 = '';
  showStep('step1');
}

/* ---- Smooth scroll para âncoras internas ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
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

document.querySelectorAll(
  '.hero__content, .triage__inner, .results .container, .patients__grid, .doctor__inner, .footer__inner'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});