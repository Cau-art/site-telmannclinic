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

/* --- Step 1 e Step 3: opções de texto normais --- */
document.querySelectorAll('.quiz__option').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('data-next');
    const stepAtual = btn.closest('.quiz__step').id;
    const textoResposta = btn.childNodes[0].textContent.trim();
    if (stepAtual === 'step1') respostas.pergunta1 = textoResposta;
    if (stepAtual === 'step3') respostas.pergunta3 = textoResposta;
    if (next) showStep(next);
  });
});

/* --- Step 2: cards visuais de grau de calvície --- */
document.querySelectorAll('.quiz__calvicie-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.quiz__calvicie-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    respostas.pergunta2 = card.getAttribute('data-label');
    setTimeout(() => {
      const next = card.getAttribute('data-next');
      if (next) showStep(next);
    }, 300);
  });
});

/* --- Botões de voltar --- */
document.querySelectorAll('.quiz__back').forEach(btn => {
  btn.addEventListener('click', () => {
    const back = btn.getAttribute('data-back');
    if (back) showStep(back);
  });
});

/* =============================================
   WHATSAPP — ENVIO
   ============================================= */
const whatsappNumeros = [
  '5511910003333',
  '5511916755840'
];

function getProximoNumero() {
  const idx = parseInt(localStorage.getItem('whatsappIndice') || '0', 10);
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
    `2️⃣ Grau de calvície: ${encodeURIComponent(respostas.pergunta2)}%0A` +
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
  document.querySelectorAll('.quiz__calvicie-card').forEach(c => c.classList.remove('selected'));
  showStep('step1');
}

/* =============================================
   CARROSSEL DE RESULTADOS
   ============================================= */
const pessoas = [
  { nome: 'Mc Livinho' },
  { nome: 'Dudu Camargo' },
  { nome: 'Paciente' }
];

let pessoaAtual = 0;
let slideAtual  = 0;
let slideGlobal = 0;
let animando    = false; // impede cliques duplos durante animação

const carouselName = document.getElementById('carouselName');
const personDots   = document.querySelectorAll('.carousel__dot');
const todasPessoas = [0, 1, 2];

function getPessoa(idx) {
  return document.querySelector(`.carousel__person[data-index="${idx}"]`);
}
function getSlides(pessoaIdx) {
  return document.querySelectorAll(`#slides${pessoaIdx} .carousel__slide`);
}
function getSlideDots(pessoaIdx) {
  return getPessoa(pessoaIdx).querySelectorAll('.carousel__slide-dot');
}
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
    if (globalIdx < count + t) return { pessoa: p, local: globalIdx - count };
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

function atualizarNome() {
  carouselName.style.opacity = '0';
  setTimeout(() => {
    carouselName.textContent = pessoas[pessoaAtual].nome;
    carouselName.style.opacity = '1';
  }, 200);
}

/* ---- Animação de slide ---- */
function mudarSlide(direcao) {
  if (animando) return;
  animando = true;

  const total = totalSlidesGlobal();
  const proximoGlobal = (globalParaAtual() + direcao + total) % total;
  const { pessoa: proximaPessoa, local: proximoLocal } = slideParaPessoaELocal(proximoGlobal);

  const slideAtivo = getSlides(pessoaAtual)[slideAtual];

  // Animação de saída
  slideAtivo.classList.add(direcao > 0 ? 'slide-out-left' : 'slide-out-right');

  setTimeout(() => {
    // Remove estado atual
    slideAtivo.classList.remove('active', 'slide-out-left', 'slide-out-right');
    getSlideDots(pessoaAtual)[slideAtual].classList.remove('active');
    getPessoa(pessoaAtual).classList.remove('active');
    personDots[pessoaAtual]?.classList.remove('active');

    // Atualiza índices
    pessoaAtual = proximaPessoa;
    slideAtual  = proximoLocal;
    slideGlobal = proximoGlobal;

    // Prepara entrada do novo slide
    const novoSlide = getSlides(pessoaAtual)[slideAtual];
    novoSlide.classList.add(direcao > 0 ? 'slide-in-right' : 'slide-in-left');
    getPessoa(pessoaAtual).classList.add('active');
    novoSlide.classList.add('active');
    getSlideDots(pessoaAtual)[slideAtual].classList.add('active');
    personDots[pessoaAtual]?.classList.add('active');

    // Força reflow para ativar a transição CSS
    novoSlide.getBoundingClientRect();

    // Remove classe de entrada (dispara animação)
    novoSlide.classList.remove('slide-in-right', 'slide-in-left');

    // Atualiza nome
    atualizarNome();

    // Libera animação
    setTimeout(() => { animando = false; }, 450);
  }, 300);
}

/* ---- Botões prev/next ---- */
document.getElementById('prevBtn').addEventListener('click', () => mudarSlide(-1));
document.getElementById('nextBtn').addEventListener('click', () => mudarSlide(1));

/* ---- Dots de pessoa ---- */
personDots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    if (animando || idx === pessoaAtual) return;
    const direcao = idx > pessoaAtual ? 1 : -1;

    // Avança slide a slide até chegar na pessoa certa
    const proximoGlobal = todasPessoas.slice(0, idx).reduce((acc, p) => acc + totalSlides(p), 0);
    const diferencaGlobal = proximoGlobal - globalParaAtual();
    mudarSlide(diferencaGlobal >= 0 ? 1 : -1);
  });
});

/* ---- Dots de slide ---- */
document.querySelectorAll('.carousel__person').forEach((pessoa, pessoaIdx) => {
  pessoa.querySelectorAll('.carousel__slide-dot').forEach((dot, slideIdx) => {
    dot.addEventListener('click', () => {
      if (animando || slideIdx === slideAtual) return;
      const direcao = slideIdx > slideAtual ? 1 : -1;
      mudarSlide(direcao);
    });
  });
});

/* ---- Swipe touch (mobile) ---- */
let touchStartX = 0;
document.querySelector('.carousel__track').addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
document.querySelector('.carousel__track').addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) mudarSlide(diff > 0 ? 1 : -1);
});

/* =============================================
   SMOOTH SCROLL
   ============================================= */
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

/* =============================================
   FADE-IN AO SCROLL
   ============================================= */
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