const WHATSAPP_PHONE = "554388098800";
const WHATSAPP_MESSAGES = {
  infantil: "OlÃƒÂ¡! Quero um orÃƒÂ§amento para recreaÃƒÂ§ÃƒÂ£o em um evento infantil. Data, local e quantidade de crianÃƒÂ§as: ",
  corporativo: "OlÃƒÂ¡! Quero um orÃƒÂ§amento para um evento corporativo. Data, local e nÃƒÂºmero de participantes: ",
  resort: "OlÃƒÂ¡! Gostaria de uma proposta para recreaÃƒÂ§ÃƒÂ£o em hotel/resort. Cidade, perÃƒÂ­odo e estrutura: "
};

const WHATSAPP_MESSAGE_OVERRIDES = {
  infantil: "Ol\u00e1! Quero um or\u00e7amento para recrea\u00e7\u00e3o infantil. Data, local e quantidade de crian\u00e7as: ",
  brincadeiras: "Ol\u00e1! Quero levar esse clima de brincadeiras para a minha festa. Data, local, idade da turma e quantidade de crian\u00e7as: ",
  oficinas: "Ol\u00e1! Quero um or\u00e7amento para as oficinas criativas da festa. Data, local, quantidade de crian\u00e7as e oficinas de interesse: ",
  personalizada: "Ol\u00e1! Quero montar uma recrea\u00e7\u00e3o personalizada para a minha festa. Data, local, idade da turma e o que voc\u00ea sugere para esse momento: ",
  corporativo: "Ol\u00e1! Quero um or\u00e7amento para um evento corporativo. Data, local e n\u00famero de participantes: ",
  resort: "Ol\u00e1! Gostaria de uma proposta para recrea\u00e7\u00e3o em hotel ou resort. Cidade, per\u00edodo e estrutura dispon\u00edvel: "
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function criaLinkWhats(tipo) {
  const mensagem =
    WHATSAPP_MESSAGE_OVERRIDES[tipo] ||
    WHATSAPP_MESSAGES[tipo] ||
    WHATSAPP_MESSAGE_OVERRIDES.infantil;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensagem)}`;
}

function resolveWhatsTipo(link) {
  const texto = (link.textContent || "").toLowerCase();
  const tipo = link.dataset.wa || "infantil";
  const tituloCard =
    link.closest(".card")?.querySelector("h3")?.textContent?.toLowerCase() || "";

  if (tituloCard.includes("brincadeiras")) return "brincadeiras";
  if (tituloCard.includes("oficinas")) return "oficinas";
  if (tituloCard.includes("momentos")) return "personalizada";
  if (texto.includes("clima na festa")) return "brincadeiras";
  if (texto.includes("oficinas")) return "oficinas";
  if (texto.includes("montar minha recrea")) return "personalizada";

  return tipo;
}

document.querySelectorAll(".wa-link").forEach(link => {
  const tipo = resolveWhatsTipo(link);
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
const campoIdade = document.getElementById("idade");
const campoMensagem = document.getElementById("mensagem");

if (preAtendimentoBtn && campoNome && campoIdade && campoMensagem) {
  preAtendimentoBtn.addEventListener("click", () => {
    const nome = campoNome.value.trim() || "N\u00e3o informado";
    const idade = campoIdade.value.trim() || "N\u00e3o informado";
    const resumo = campoMensagem.value.trim() || "N\u00e3o informado";

    const texto = [
      "Ol\u00e1! Quero um or\u00e7amento para recrea\u00e7\u00e3o infantil.",
      `Nome: ${nome}`,
      `Idade das crian\u00e7as: ${idade}`,
      `Detalhes da festa: ${resumo}`
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

const heroMoldura = document.querySelector(".hero-moldura");

function aplicaParallax() {
  if (reducedMotion || !heroMoldura) return;
  const y = Math.min(window.scrollY, 220);
  const deslocamentoImagem = Math.min(y * 0.12, 18);

  heroMoldura.style.transform = `translateY(${deslocamentoImagem.toFixed(2)}px)`;
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

  // Evita animar duas vezes elementos que ja usam `.reveal`.
  document.querySelectorAll(".card:not(.reveal), .passo:not(.reveal), .galeria-item:not(.reveal), .faq-item:not(.reveal), .contato-card:not(.reveal), .form:not(.reveal)")
    .forEach(el => observerProfundo.observe(el));
}




