/**
 * VivaDF Landing Page - JavaScript
 * Funcionalidades: WhatsApp links dinâmicos, Menu mobile, Acordeão FAQ, Header scroll
 */

// ===== CONFIGURAÇÃO DO WHATSAPP =====
// Use apenas dígitos (DDI + DDD + número). Ex: 5511911195108
const WHATSAPP_NUMBER = '5511952136954';

// Mensagem padrão (usada quando o link não tem data-wa-text e não tem text=)
const WHATSAPP_DEFAULT_TEXT = 'Oi VivaDF, quero tirar dúvidas sobre Doença Falciforme';

// (Opcional) permite override sem editar o arquivo, se você setar isso antes do script carregar:
// <script>window.VIVADF_WHATSAPP_NUMBER = "5511...";</script>
const FINAL_WA_NUMBER = (window.VIVADF_WHATSAPP_NUMBER || WHATSAPP_NUMBER).replace(/\D/g, '');
const WA_BASE = `https://wa.me/${FINAL_WA_NUMBER}?text=`;

// Extrai o parâmetro text= do href (já vem URL-encoded)
function getEncodedTextFromHref(href) {
  if (!href) return null;
  const match = href.match(/[?&]text=([^&]+)/);
  return match ? match[1] : null;
}

// Monta o link final
function buildWaLink(encodedText) {
  const safeText =
    encodedText && encodedText.length
      ? encodedText
      : encodeURIComponent(WHATSAPP_DEFAULT_TEXT);

  return WA_BASE + safeText;
}

// Atualiza todos os links de WhatsApp (preservando text= quando existir)
function updateWhatsAppLinks() {
  // 1) Links com data-wa-text (texto NÃO codificado)
  document.querySelectorAll('a[data-wa-text]').forEach((link) => {
    const rawText = link.getAttribute('data-wa-text') || WHATSAPP_DEFAULT_TEXT;
    const encodedText = encodeURIComponent(rawText);
    link.setAttribute('href', buildWaLink(encodedText));
  });

  // 2) Links que já apontam pra wa.me (com número real, placeholder ou "0")
  document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Se já foi tratado por data-wa-text, não sobrescreve
    if (link.hasAttribute('data-wa-text')) return;

    const encodedText = getEncodedTextFromHref(href);
    link.setAttribute('href', buildWaLink(encodedText));
  });

  // 3) (Opcional) caso existam links antigos api.whatsapp.com/send
  document.querySelectorAll('a[href*="api.whatsapp.com/send"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const encodedText = getEncodedTextFromHref(href);
    link.setAttribute('href', buildWaLink(encodedText));
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // ===== Atualizar todos os links do WhatsApp =====
  updateWhatsAppLinks();

  // ===== Menu Mobile Toggle =====
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-list a');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');

      // Previne scroll quando menu está aberto
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Fecha menu ao clicar em um link
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Fecha menu ao clicar no botão do WhatsApp no header
    const headerBtn = document.querySelector('.btn-header');
    if (headerBtn) {
      headerBtn.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }
  }

  // ===== Header Scroll Effect =====
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener(
      'scroll',
      function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      },
      { passive: true }
    );
  }

  // ===== Accordion FAQ =====
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(function (accHeader) {
    accHeader.addEventListener('click', function () {
      const accordionItem = this.parentElement;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros itens
      accordionHeaders.forEach(function (otherHeader) {
        if (otherHeader !== accHeader) {
          otherHeader.setAttribute('aria-expanded', 'false');
          otherHeader.parentElement.classList.remove('active');
        }
      });

      // Toggle do item clicado
      this.setAttribute('aria-expanded', String(!isExpanded));
      accordionItem.classList.toggle('active');
    });

    // Suporte a teclado
    accHeader.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // ===== Smooth Scroll para links âncora =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const headerEl = document.querySelector('.header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  // ===== Intersection Observer para animações de entrada =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa cards e seções para animação
  document.querySelectorAll('.card, .accordion-item, .testimonial-card').forEach(function (el) {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // ===== Previne zoom duplo em touch para botões =====
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('touchend', function () {
      // intencionalmente vazio (mantém comportamento padrão)
    });
  });

  // ===== Carregar Logos de Parceiros Dinamicamente =====
  const parceirosContainer = document.getElementById('parceiros-logos');

  if (parceirosContainer) {
    const parceirosLogos = [
      // 'parceiro1.svg',
      // 'parceiro2.svg',
    ];

    if (parceirosLogos.length === 0) {
      parceirosContainer.innerHTML = '<p class="parceiros-empty">Em breve, nossos parceiros estarão aqui.</p>';
    } else {
      parceirosLogos.forEach(function (logo) {
        const img = document.createElement('img');
        img.src = 'src/parceiros/' + logo;
        img.alt = 'Logo de parceiro';
        img.className = 'parceiro-logo';
        img.loading = 'lazy';
        parceirosContainer.appendChild(img);
      });
    }
  }
});

// ===== CSS para animações de entrada (injetado via JS) =====
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
