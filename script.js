/* =============================================
   SCRIPT.JS — Telmann Clinic
   ============================================= */

/* ---- Header scroll shadow ---- */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- Mobile burger menu ---- */
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* =============================================
   QUIZ / TRIAGEM
   ============================================= */
const steps = document.querySelectorAll('.quiz__step');
const respostas = { pergunta1: '', pergunta2: '', pergunta3: '' };

function showStep(id) {
  steps.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

document.querySelectorAll('.quiz__option').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('data-next');
    const stepAtual = btn.closest('.quiz__step').id;
    const textoResposta = btn.childNodes[0].textContent.trim();
    if (stepAtual === 'step1') respostas.pergunta1 = textoResposta;
    if (stepAtual === 'step2') respostas.pergunta2 = textoResposta;
    if (stepAtual === 'step3') respostas.pergunta3 = textoResposta;
    if (next) showStep(next);
  });
});

document.querySelectorAll('.quiz__back').forEach(btn => {
  btn.addEventListener('click', () => {
    const back = btn.getAttribute('data-back');
    if (back) showStep(back);
  });
});

/* ---- Rodízio WhatsApp ---- */
const whatsappNumeros = ['5511910003333', '5511916755840'];
function getProximoNumero() {
  const idx = parseInt(localStorage.getItem('whatsappIndice') || '0');
  const numero = whatsappNumeros[idx];
  localStorage.setItem('whatsappIndice', (idx + 1) % whatsappNumeros.length);
  return numero;
}

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

function reiniciarQuiz() {
  document.getElementById('nomeInput').value = '';
  document.getElementById('emailInput').value = '';
  document.getElementById('telefoneInput').value = '';
  respostas.pergunta1 = '';
  respostas.pergunta2 = '';
  respostas.pergunta3 = '';
  showStep('step1');
}

/* =============================================
   CARROSSEL DE RESULTADOS
   ============================================= */
const pessoas = [
  { nome: 'Mc Livinho' },
  { nome: 'Dudu Camargo' },
  { nome: 'Paciente' }    // Atualize com o nome real
];

let pessoaAtual = 0;
let slideAtual = 0;

const carouselName = document.getElementById('carouselName');
const personDots   = document.querySelectorAll('.carousel__dot');

function getPessoa(idx) {
  return document.querySelector(`.carousel__person[data-index="${idx}"]`);
}

function getSlides(pessoaIdx) {
  return document.querySelectorAll(`#slides${pessoaIdx} .carousel__slide`);
}

function getSlideDots(pessoaIdx) {
  return getPessoa(pessoaIdx).querySelectorAll('.carousel__slide-dot');
}

function mudarPessoa(idx) {
  // Esconde pessoa atual
  getPessoa(pessoaAtual).classList.remove('active');
  personDots[pessoaAtual].classList.remove('active');

  pessoaAtual = idx;
  slideAtual = 0;

  // Mostra nova pessoa
  getPessoa(pessoaAtual).classList.add('active');
  personDots[pessoaAtual].classList.add('active');

  // Reseta slides
  getSlides(pessoaAtual).forEach((s, i) => s.classList.toggle('active', i === 0));
  getSlideDots(pessoaAtual).forEach((d, i) => d.classList.toggle('active', i === 0));

  // Atualiza nome com animação
  carouselName.style.opacity = '0';
  setTimeout(() => {
    carouselName.textContent = pessoas[pessoaAtual].nome;
    carouselName.style.opacity = '1';
  }, 200);
}

// Lista flat de todos os slides em ordem
const todasPessoas = [0, 1, 2];
let slideGlobal = 0;

// Total de slides por pessoa
function totalSlides(pessoaIdx) {
  return getSlides(pessoaIdx).length;
}

function totalSlidesGlobal() {
  return todasPessoas.reduce((acc, p) => acc + totalSlides(p), 0);
}

function slideParaPessoaELocal(globalIdx) {
  let count = 0;
  for (let p of todasPessoas) {
    const t = totalSlides(p);
    if (globalIdx < count + t) {
      return { pessoa: p, local: globalIdx - count };
    }
    count += t;
  }
  return { pessoa: 0, local: 0 };
}

function globalParaAtual() {
  let count = 0;
  for (let p of todasPessoas) {
    if (p === pessoaAtual) return count + slideAtual;
    count += totalSlides(p);
  }
  return 0;
}

function mudarSlide(direcao) {
  const total = totalSlidesGlobal();
  slideGlobal = (globalParaAtual() + direcao + total) % total;

  const { pessoa, local } = slideParaPessoaELocal(slideGlobal);

  // Esconde pessoa atual
  getSlides(pessoaAtual)[slideAtual].classList.remove('active');
  getSlideDots(pessoaAtual)[slideAtual].classList.remove('active');
  getPessoa(pessoaAtual).classList.remove('active');
  personDots[pessoaAtual]?.classList.remove('active');

  // Atualiza
  pessoaAtual = pessoa;
  slideAtual = local;

  // Mostra nova
  getPessoa(pessoaAtual).classList.add('active');
  getSlides(pessoaAtual)[slideAtual].classList.add('active');
  getSlideDots(pessoaAtual)[slideAtual].classList.add('active');

  // Atualiza nome
  carouselName.style.opacity = '0';
  setTimeout(() => {
    carouselName.textContent = pessoas[pessoaAtual].nome;
    carouselName.style.opacity = '1';
  }, 200);
}
// Botões prev/next
document.getElementById('prevBtn').addEventListener('click', () => mudarSlide(-1));
document.getElementById('nextBtn').addEventListener('click', () => mudarSlide(1));

// Dots de pessoa
personDots.forEach((dot, idx) => {
  dot.addEventListener('click', () => mudarPessoa(idx));
});

// Dots de slide
document.querySelectorAll('.carousel__person').forEach((pessoa, pessoaIdx) => {
  pessoa.querySelectorAll('.carousel__slide-dot').forEach((dot, slideIdx) => {
    dot.addEventListener('click', () => {
      const slides = getSlides(pessoaIdx);
      const dots   = getSlideDots(pessoaIdx);
      slides[slideAtual].classList.remove('active');
      dots[slideAtual].classList.remove('active');
      slideAtual = slideIdx;
      slides[slideAtual].classList.add('active');
      dots[slideAtual].classList.add('active');
    });
  });
});

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Fade-in ao scroll ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.hero__content, .triage__inner, .results .container, .patients__grid, .doctor__inner, .footer__inner'
).forEach(el => { el.classList.add('fade-in'); observer.observe(el); });