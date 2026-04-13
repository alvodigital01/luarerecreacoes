const WHATSAPP_PHONE = "554388098800";
const WHATSAPP_MESSAGES = {
  infantil: "OlÃƒÂ¡! Quero um orÃƒÂ§amento para recreaÃƒÂ§ÃƒÂ£o em um evento infantil. Data, local e quantidade de crianÃƒÂ§as: ",
  corporativo: "OlÃƒÂ¡! Quero um orÃƒÂ§amento para um evento corporativo. Data, local e nÃƒÂºmero de participantes: ",
  resort: "OlÃƒÂ¡! Gostaria de uma proposta para recreaÃƒÂ§ÃƒÂ£o em hotel/resort. Cidade, perÃƒÂ­odo e estrutura: "
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hoverCapable = window.matchMedia("(hover: hover)").matches;

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
if (secaoConfianca && "IntersectionObserver" in window) {
  const contadorObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContadores();
        contadorObserver.disconnect();
      }
    });
  }, { threshold: 0.25 });
  contadorObserver.observe(secaoConfianca);
} else if (contadores.length) {
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

const secaoOficinas = document.getElementById("oficinas-sucesso");
const introOficinas = secaoOficinas?.querySelector(".oficinas-intro");
const fotoOficinas = secaoOficinas?.querySelector(".oficinas-foto");
const cardsOficinas = secaoOficinas ? Array.from(secaoOficinas.querySelectorAll(".oficina-item")) : [];
const temasOficinas = [
  {
    borda: "#9ad8ff",
    bordaSuave: "#ccecff",
    titulo: "#0f5aa8",
    brilho: "rgba(72, 190, 255, 0.16)",
    cardBg: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    introBg: "linear-gradient(165deg, #ffffff 0%, #eef9ff 100%)",
    iconeBg: "#dff5ff",
    iconeColor: "#0f5aa8"
  },
  {
    borda: "#ffd9a1",
    bordaSuave: "#ffebc8",
    titulo: "#9b5d00",
    brilho: "rgba(255, 184, 71, 0.15)",
    cardBg: "linear-gradient(180deg, #ffffff 0%, #fff6e8 100%)",
    introBg: "linear-gradient(165deg, #ffffff 0%, #fff8ef 100%)",
    iconeBg: "#fff0d7",
    iconeColor: "#9b5d00"
  },
  {
    borda: "#ffc9e2",
    bordaSuave: "#ffe0ee",
    titulo: "#a33a6f",
    brilho: "rgba(255, 126, 181, 0.14)",
    cardBg: "linear-gradient(180deg, #ffffff 0%, #fff1f7 100%)",
    introBg: "linear-gradient(165deg, #ffffff 0%, #fff5f9 100%)",
    iconeBg: "#ffe4ef",
    iconeColor: "#a33a6f"
  },
  {
    borda: "#cfdbff",
    bordaSuave: "#e1e9ff",
    titulo: "#3454b2",
    brilho: "rgba(85, 115, 220, 0.14)",
    cardBg: "linear-gradient(180deg, #ffffff 0%, #f1f5ff 100%)",
    introBg: "linear-gradient(165deg, #ffffff 0%, #f4f7ff 100%)",
    iconeBg: "#e8eeff",
    iconeColor: "#3454b2"
  }
];
let oficinaAtiva = 0;
let oficinasTimer = null;

function aplicaDestaqueOficinas(indice) {
  if (!cardsOficinas.length) return;

  oficinaAtiva = indice;
  const temaAtual = temasOficinas[indice % temasOficinas.length];

  cardsOficinas.forEach((card, idx) => {
    const ativo = idx === indice;
    const tema = temasOficinas[idx % temasOficinas.length];
    const icone = card.querySelector("i");
    const titulo = card.querySelector("strong");

    card.style.transform = ativo ? "translateY(-4px)" : "translateY(0)";
    card.style.borderColor = ativo ? tema.borda : "#dbeaff";
    card.style.background = ativo ? tema.cardBg : "#ffffff";
    card.style.boxShadow = ativo ? `0 14px 26px ${tema.brilho}` : "0 8px 18px rgba(10, 58, 130, 0.06)";

    if (icone) {
      icone.style.background = ativo ? tema.iconeBg : "#eaf4ff";
      icone.style.color = ativo ? tema.iconeColor : "#1460b1";
      icone.style.boxShadow = ativo ? `0 8px 14px ${tema.brilho}` : "none";
    }

    if (titulo) {
      titulo.style.color = ativo ? tema.titulo : "#123f76";
    }
  });

  if (introOficinas) {
    introOficinas.style.borderColor = temaAtual.borda;
    introOficinas.style.background = temaAtual.introBg;
    introOficinas.style.boxShadow = `0 14px 24px ${temaAtual.brilho}`;
  }

  if (fotoOficinas) {
    fotoOficinas.style.borderColor = temaAtual.bordaSuave;
    fotoOficinas.style.boxShadow = `0 12px 22px ${temaAtual.brilho}`;
  }
}

function iniciaAutoOficinas() {
  if (reducedMotion || cardsOficinas.length < 2 || oficinasTimer) return;
  oficinasTimer = setInterval(() => {
    aplicaDestaqueOficinas((oficinaAtiva + 1) % cardsOficinas.length);
  }, 3600);
}

function paraAutoOficinas() {
  clearInterval(oficinasTimer);
  oficinasTimer = null;
}

if (secaoOficinas && cardsOficinas.length) {
  cardsOficinas.forEach(card => {
    card.style.transition = "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 220ms ease";
  });

  if (introOficinas) {
    introOficinas.style.transition = "box-shadow 220ms ease, border-color 220ms ease, background 220ms ease";
  }

  if (fotoOficinas) {
    fotoOficinas.style.transition = "box-shadow 220ms ease, border-color 220ms ease";
  }

  cardsOficinas.forEach((card, idx) => {
    if (hoverCapable) {
      card.addEventListener("mouseenter", () => {
        paraAutoOficinas();
        aplicaDestaqueOficinas(idx);
      });
    }
  });

  aplicaDestaqueOficinas(0);

  if (hoverCapable) {
    secaoOficinas.addEventListener("mouseenter", paraAutoOficinas);
    secaoOficinas.addEventListener("mouseleave", iniciaAutoOficinas);
  }

  if ("IntersectionObserver" in window) {
    const observerOficinas = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          iniciaAutoOficinas();
        } else {
          paraAutoOficinas();
        }
      });
    }, { threshold: 0.35 });

    observerOficinas.observe(secaoOficinas);
  } else {
    iniciaAutoOficinas();
  }
}

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




