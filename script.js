/**
 * VivaDF Landing Page - JavaScript
 * Funcionalidades: Menu mobile, Acordeão FAQ, Header scroll
 */

document.addEventListener('DOMContentLoaded', function () {
    // ===== Menu Mobile Toggle =====
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
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
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ===== Accordion FAQ =====
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            const accordionItem = this.parentElement;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Fecha todos os outros itens
            accordionHeaders.forEach(function (otherHeader) {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.parentElement.classList.remove('active');
                }
            });

            // Toggle do item clicado
            this.setAttribute('aria-expanded', !isExpanded);
            accordionItem.classList.toggle('active');
        });

        // Suporte a teclado
        header.addEventListener('keydown', function (e) {
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

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Intersection Observer para animações de entrada =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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
        btn.addEventListener('touchend', function (e) {
            // Permite o comportamento padrão para links
        });
    });
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
