// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    // Toggle navigation
    if (burger && nav) {
        burger.addEventListener('click', function() {
            nav.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }

    // Close navigation when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            burger.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to header
    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe animated elements (añadimos tab-panel y botones del componente)
    const animatedElements = document.querySelectorAll('.concept-card, .poc-step, .variation-card, .protection-card, .biblio-list li, .author-card, #proteccion .tab-panel, #proteccion .tab-button');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.style.color = '#fff';
                });
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.style.color = '#e94560';
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    /* ---------------------------
       Comportamiento del componente de pestañas
       --------------------------- */
    (function(){
        const tabButtons = document.querySelectorAll('#proteccion .tab-button');
        const tabPanels = document.querySelectorAll('#proteccion .tab-panel');

        if (!tabButtons.length || !tabPanels.length) return;

        function activateTab(button) {
            // marcar botones
            tabButtons.forEach(btn => {
                const selected = btn === button;
                btn.setAttribute('aria-selected', selected ? 'true' : 'false');
            });

            // mostrar panel correspondiente
            const targetId = button.getAttribute('data-target');
            tabPanels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.classList.add('active');
                    // aseguramos que el panel sea visible para la animación
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateY(0)';
                } else {
                    panel.classList.remove('active');
                }
            });
        }

        // eventos click y soporte de teclado para accesibilidad
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => activateTab(btn));
            btn.addEventListener('keydown', (e) => {
                const enabled = Array.from(tabButtons);
                let idx = enabled.indexOf(e.currentTarget);
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const next = enabled[(idx + 1) % enabled.length];
                    next.focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prev = enabled[(idx - 1 + enabled.length) % enabled.length];
                    prev.focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    enabled[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    enabled[enabled.length - 1].focus();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateTab(e.currentTarget);
                }
            });
        });

        // Inicializar primera pestaña activa (por si acaso)
        const initiallySelected = document.querySelector('#proteccion .tab-button[aria-selected="true"]');
        if (initiallySelected) {
            activateTab(initiallySelected);
        } else if (tabButtons[0]) {
            activateTab(tabButtons[0]);
        }
    })();
});
// --- Modal de vídeo PoC ---
(function () {
    const thumbnail = document.querySelector('.video-thumbnail');
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-modal-iframe');
    const closeElements = modal ? modal.querySelectorAll('[data-video-close]') : [];
	const YT_EMBED_BASE = 'https://www.youtube-nocookie.com/embed/';


    if (!thumbnail || !modal || !iframe) return;

    function buildEmbedUrl(videoId) {
        // Autoplay activado al abrir en modo cine
        return `${YT_EMBED_BASE}${videoId}?autoplay=1&rel=0`;
    }

    function openVideoModal() {
        const videoId = thumbnail.dataset.videoId || 'ApsuDBjhhhE';
        iframe.src = buildEmbedUrl(videoId);
        modal.classList.add('is-open');
        document.body.classList.add('video-modal-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeVideoModal() {
        modal.classList.remove('is-open');
        document.body.classList.remove('video-modal-open');
        modal.setAttribute('aria-hidden', 'true');
        // Vaciar src para detener la reproducción
        iframe.src = '';
        // Devolver foco a la miniatura
        thumbnail.focus();
    }

    thumbnail.addEventListener('click', openVideoModal);

    closeElements.forEach(function (el) {
        el.addEventListener('click', closeVideoModal);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeVideoModal();
        }
    });
})();
