const WHATSAPP_PHONE = "554388098800";
const WHATSAPP_MESSAGES = {
  infantil: "Olá! Quero um orçamento para recreação em um evento infantil. Data, local e quantidade de crianças: ",
  corporativo: "Olá! Quero um orçamento para um evento corporativo. Data, local e número de participantes: ",
  resort: "Olá! Gostaria de uma proposta para recreação em hotel/resort. Cidade, período e estrutura: "
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function criaLinkWhats(tipo) {
  const mensagem = WHATSAPP_MESSAGES[tipo] || WHATSAPP_MESSAGES.infantil;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensagem)}`;
}

document.querySelectorAll(".wa-link").forEach(link => {
  const tipo = link.dataset.wa || "infantil";
  link.href = criaLinkWhats(tipo);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const topo = document.getElementById("topo");
function atualizaTopo() {
  topo.classList.toggle("scrolled", window.scrollY > 8);
}
atualizaTopo();
window.addEventListener("scroll", atualizaTopo);

const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menuPrincipal");

menuToggle.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuToggle.classList.toggle("ativo", aberto);
  menuToggle.setAttribute("aria-expanded", String(aberto));
});

menu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    menuToggle.classList.remove("ativo");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const itensReveal = document.querySelectorAll(".reveal");
document.querySelectorAll(".section").forEach(secao => {
  secao.querySelectorAll(".reveal").forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 70, 280)}ms`;
  });
});

if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visivel");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  itensReveal.forEach(el => observer.observe(el));
} else {
  itensReveal.forEach(el => el.classList.add("visivel"));
}

const contadores = document.querySelectorAll(".contador");
let contadoresIniciados = false;

function animarContadores() {
  if (contadoresIniciados) return;
  contadoresIniciados = true;

  contadores.forEach(el => {
    const alvo = Number(el.dataset.target || 0);
    if (reducedMotion) {
      el.textContent = alvo.toLocaleString("pt-BR");
      return;
    }

    let atual = 0;
    const duracao = 1200;
    const inicio = performance.now();

    function frame(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      atual = Math.floor(alvo * progresso);
      el.textContent = atual.toLocaleString("pt-BR");
      if (progresso < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

const secaoConfianca = document.getElementById("confianca");
if ("IntersectionObserver" in window) {
  const contadorObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContadores();
        contadorObserver.disconnect();
      }
    });
  }, { threshold: 0.25 });
  contadorObserver.observe(secaoConfianca);
} else {
  animarContadores();
}

const slides = document.querySelectorAll(".depo-card");
const prevBtn = document.getElementById("prevDepoimento");
const nextBtn = document.getElementById("nextDepoimento");
const dots = document.querySelectorAll(".depo-dot");
const depoimentosShell = document.querySelector(".depoimentos-shell");
let slideAtual = 0;
let timer = null;

function mostraSlide(i) {
  slides.forEach((slide, idx) => {
    const ativo = idx === i;
    slide.classList.toggle("ativo", ativo);
    slide.setAttribute("aria-hidden", String(!ativo));
  });
  dots.forEach((dot, idx) => dot.classList.toggle("ativo", idx === i));
  slideAtual = i;
}

function proximoSlide() {
  const i = (slideAtual + 1) % slides.length;
  mostraSlide(i);
}

function slideAnterior() {
  const i = (slideAtual - 1 + slides.length) % slides.length;
  mostraSlide(i);
}

function iniciaAutoSlide() {
  if (reducedMotion) return;
  if (!slides.length) return;
  timer = setInterval(proximoSlide, 5000);
}

function reiniciaAutoSlide() {
  clearInterval(timer);
  iniciaAutoSlide();
}

if (prevBtn && nextBtn && slides.length) {
  prevBtn.addEventListener("click", () => {
    slideAnterior();
    reiniciaAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    proximoSlide();
    reiniciaAutoSlide();
  });
}

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    const i = Number(dot.dataset.slide || 0);
    mostraSlide(i);
    reiniciaAutoSlide();
  });
});

if (depoimentosShell && !reducedMotion) {
  depoimentosShell.addEventListener("mouseenter", () => clearInterval(timer));
  depoimentosShell.addEventListener("mouseleave", iniciaAutoSlide);
}

mostraSlide(0);
iniciaAutoSlide();

document.querySelectorAll(".faq-pergunta").forEach(botao => {
  botao.addEventListener("click", () => {
    const item = botao.closest(".faq-item");
    const aberto = item.classList.contains("ativo");
    document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("ativo"));
    if (!aberto) item.classList.add("ativo");
  });
});

const preAtendimentoBtn = document.getElementById("preAtendimentoBtn");
const campoNome = document.getElementById("nome");
const campoTipo = document.getElementById("tipo");
const campoMensagem = document.getElementById("mensagem");

if (preAtendimentoBtn && campoNome && campoTipo && campoMensagem) {
  preAtendimentoBtn.addEventListener("click", () => {
    const nome = campoNome.value.trim() || "Não informado";
    const tipoSelecionado = campoTipo.value.trim();
    const resumo = campoMensagem.value.trim() || "Não informado";

    let tipoKey = "infantil";
    if (tipoSelecionado === "Corporativo") tipoKey = "corporativo";
    if (tipoSelecionado === "Hotel/Resort") tipoKey = "resort";

    const texto = [
      `Nome: ${nome}`,
      `Tipo de evento: ${tipoSelecionado || "Não informado"}`,
      `Resumo: ${resumo}`
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

const elementosParallax = [
  { el: document.querySelector(".hero"), speed: 0.11 },
  { el: document.querySelector(".selo"), speed: 0.17 }
].filter(item => item.el);

function aplicaParallax() {
  if (reducedMotion || !elementosParallax.length) return;
  const y = window.scrollY;
  elementosParallax.forEach(({ el, speed }) => {
    const deslocamento = Math.max(Math.min(y * speed, 36), -36);
    el.style.transform = `translateY(${deslocamento}px)`;
  });
}

let parallaxTicking = false;
window.addEventListener("scroll", () => {
  if (parallaxTicking) return;
  parallaxTicking = true;
  requestAnimationFrame(() => {
    aplicaParallax();
    parallaxTicking = false;
  });
});
aplicaParallax();

const secoes = Array.from(document.querySelectorAll("main section[id]"));
const linksMenu = Array.from(document.querySelectorAll(".menu a[href^='#']"));

function atualizarSecaoAtiva() {
  if (!secoes.length || !linksMenu.length) return;
  const marcador = window.scrollY + 120;
  let secaoAtual = secoes[0].id;

  secoes.forEach(secao => {
    if (marcador >= secao.offsetTop) secaoAtual = secao.id;
  });

  linksMenu.forEach(link => {
    const ativo = link.getAttribute("href") === `#${secaoAtual}`;
    link.classList.toggle("ativo", ativo);
  });
}

atualizarSecaoAtiva();
window.addEventListener("scroll", atualizarSecaoAtiva);
window.addEventListener("resize", atualizarSecaoAtiva);

const elementosGlow = document.querySelectorAll(".card, .passo, .faq-item, .galeria-item");
elementosGlow.forEach(el => {
  el.addEventListener("pointermove", ev => {
    if (reducedMotion) return;
    const rect = el.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 100;
    const y = ((ev.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x.toFixed(2)}%`);
    el.style.setProperty("--my", `${y.toFixed(2)}%`);
    el.classList.add("com-glow");
  });

  el.addEventListener("pointerleave", () => {
    el.classList.remove("com-glow");
  });
});

if (!reducedMotion && "IntersectionObserver" in window) {
  const observerProfundo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      observerProfundo.unobserve(entry.target);
    });
  }, { threshold: 0.22 });

  document.querySelectorAll(".card, .passo, .galeria-item, .faq-item, .contato-card, .form")
    .forEach(el => observerProfundo.observe(el));
}

