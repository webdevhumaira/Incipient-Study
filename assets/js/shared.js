/**
 * shared.js — Incipient Study
 * Common JS for all pages: theme, scroll progress, scroll-to-top,
 * custom cursor, AOS init, VanillaTilt, particle canvas (index only),
 * smooth scroll, whatsapp float, newsletter form, counter animation.
 */

(function () {
    'use strict';

    /* ── THEME ─────────────────────────────────────────────────────── */
    function applyTheme(t) {
        document.body.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
        // Update icons — both dropdown style (index) and toggle button style (other pages)
        const iconEl = document.getElementById('themeIcon');
        const dropdownItems = document.querySelectorAll('.dropdown-item[data-theme]');
        if (iconEl) {
            if (t === 'dark') {
                iconEl.className = 'bi bi-sun-fill';
            } else {
                iconEl.className = 'bi bi-moon-stars-fill';
            }
        }
        // For pages using the toggle button
        const themeToggleBtn = document.getElementById('themeToggle');
        if (themeToggleBtn && iconEl) {
            // already handled above
        }
    }

    function applyAutoTheme() {
        const hours = new Date().getHours();
        applyTheme(hours >= 5 && hours < 17 ? 'light' : 'dark');
    }

    // Init theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'auto') { applyAutoTheme(); } else { applyTheme(savedTheme); }

    // Index-style dropdown theme
    document.addEventListener('click', function (e) {
        const item = e.target.closest('.dropdown-item[data-theme]');
        if (item) {
            e.preventDefault();
            const t = item.getAttribute('data-theme');
            if (t === 'auto') { localStorage.setItem('theme', 'auto'); applyAutoTheme(); }
            else { applyTheme(t); }
        }
        // Toggle button style (other pages)
        if (e.target.closest('#themeToggle')) {
            const cur = document.body.getAttribute('data-theme');
            applyTheme(cur === 'dark' ? 'light' : 'dark');
        }
    });

    // Auto-theme interval
    setInterval(function () {
        if (localStorage.getItem('theme') === 'auto') applyAutoTheme();
    }, 60000);

    /* ── SCROLL PROGRESS ────────────────────────────────────────────── */
    function updateScrollProgress() {
        const el = document.getElementById('scroll-progress') || document.getElementById('sp');
        if (!el) return;
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        el.style.width = Math.min(scrolled, 100) + '%';
    }

    /* ── SCROLL TO TOP ──────────────────────────────────────────────── */
    function updateScrollTop() {
        const btn = document.getElementById('scrollTopBtn') || document.getElementById('sctb');
        if (!btn) return;
        if (window.scrollY > 300) { btn.classList.add('show'); } else { btn.classList.remove('show'); }
    }

    window.addEventListener('scroll', function () {
        updateScrollProgress();
        updateScrollTop();
        updateStickyHeader();
    }, { passive: true });

    // Scroll to top click
    document.addEventListener('click', function (e) {
        if (e.target.closest('#scrollTopBtn') || e.target.closest('#sctb')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    /* ── STICKY HEADER ──────────────────────────────────────────────── */
    function updateStickyHeader() {
        const header = document.querySelector('.main-header') || document.querySelector('.mh');
        if (!header) return;
        if (window.scrollY > 100) { header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
    }

    /* ── CUSTOM CURSOR (index.html only) ────────────────────────────── */
    const ring = document.getElementById('cursor-ring');
    const dot = document.getElementById('cursor-dot');
    if (ring && dot) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let ringX = mouseX, ringY = mouseY;
        function lerp(a, b, t) { return a + (b - a) * t; }
        document.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; });
        document.addEventListener('mouseleave', function () { ring.style.opacity = '0'; dot.style.opacity = '0'; });
        document.addEventListener('mouseenter', function () { ring.style.opacity = '1'; dot.style.opacity = '1'; });
        const hoverTargets = 'a, button, .course-card, .category-card, .feature-card, .blog-card, .instructor-card, .batch-card';
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest(hoverTargets)) { ring.classList.add('hovered'); dot.classList.add('hovered'); }
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest(hoverTargets)) { ring.classList.remove('hovered'); dot.classList.remove('hovered'); }
        });
        (function animateCursor() {
            dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
            ringX = lerp(ringX, mouseX, 0.12); ringY = lerp(ringY, mouseY, 0.12);
            ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
            requestAnimationFrame(animateCursor);
        })();
    }

    /* ── PARTICLE CANVAS (index.html only) ─────────────────────────── */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const COLORS = ['rgba(79,172,254,0.5)', 'rgba(245,87,108,0.4)', 'rgba(118,75,162,0.4)', 'rgba(255,255,255,0.3)'];
        const PARTICLE_COUNT = 60;
        let particles = [];
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 3 + 1;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
        }
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
        (function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) { p.update(); p.draw(); }
            requestAnimationFrame(animateParticles);
        })();
    }

    /* ── SMOOTH SCROLL (anchor links) ──────────────────────────────── */
    document.addEventListener('click', function (e) {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const header = document.querySelector('.main-header') || document.querySelector('.mh');
            const offset = header ? header.offsetHeight : 0;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
        // Close mobile navbar after click
        const collapse = document.querySelector('.navbar-collapse.show');
        if (collapse) {
            const toggler = document.querySelector('.navbar-toggler');
            if (toggler) toggler.click();
        }
    });

    /* ── MOBILE NAVBAR: close on nav-link click ─────────────────────── */
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.navbar-nav .nav-link')) return;
        const collapse = document.querySelector('.navbar-collapse.show');
        if (collapse) {
            const toggler = document.querySelector('.navbar-toggler');
            if (toggler) toggler.click();
        }
    });

    /* ── ANIMATED COUNTERS ──────────────────────────────────────────── */
    let countersStarted = false;
    function tryStartCounters() {
        if (countersStarted) return;
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;
        const statsSection = document.querySelector('.stats-section-modern');
        if (!statsSection) return;
        const sectionTop = statsSection.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY + window.innerHeight * 0.7 > sectionTop) {
            countersStarted = true;
            counters.forEach(function (el) {
                const target = parseInt(el.getAttribute('data-target'));
                let current = 0;
                const step = target / 60;
                const timer = setInterval(function () {
                    current += step;
                    if (current >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
                    else { el.textContent = Math.floor(current).toLocaleString(); }
                }, 30);
            });
        }
    }
    window.addEventListener('scroll', tryStartCounters, { passive: true });
    tryStartCounters();

    /* ── NEWSLETTER FORM ────────────────────────────────────────────── */
    document.addEventListener('submit', function (e) {
        const form = e.target.closest('.newsletter-form');
        if (!form) return;
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
            alert('Thank you for subscribing! We will send updates to: ' + emailInput.value);
            form.reset();
        }
    });

    /* ── CONTACT FORM ───────────────────────────────────────────────── */
    document.addEventListener('submit', function (e) {
        const form = e.target.closest('.contact-form, #contactForm');
        if (!form) return;
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        if (btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Message Sent!';
            btn.disabled = true;
            btn.style.background = 'linear-gradient(135deg, #11998e, #38ef7d)';
            setTimeout(function () { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; form.reset(); }, 3000);
        }
    });

    /* ── VANILLA TILT ───────────────────────────────────────────────── */
    function initTilt() {
        if (typeof VanillaTilt === 'undefined') return;
        VanillaTilt.init(document.querySelectorAll('.tilt-card'), { max: 8, speed: 400, glare: true, 'max-glare': 0.3, reverse: true });
    }

    /* ── AOS + VANILLA TILT INIT (after DOM ready) ──────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            if (typeof AOS !== 'undefined') AOS.init({ duration: 650, once: true, offset: 50 });
            initTilt();
        });
    } else {
        if (typeof AOS !== 'undefined') AOS.init({ duration: 650, once: true, offset: 50 });
        initTilt();
    }

    // Also try after window load (for late-loaded scripts)
    window.addEventListener('load', function () {
        if (typeof AOS !== 'undefined') AOS.refresh();
        initTilt();
    });

})();