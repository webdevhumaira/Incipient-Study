/**
 * animations.js — Incipient Study
 * All advanced animations: scroll-triggered, parallax, typing,
 * particle background, 3D tilt, smooth reveal, floating, glow hover.
 * Place in: assets/js/animations.js
 */
(function () {
    'use strict';

    /* ══════════════════════════════════════════════════════════════════
       1. SMOOTH REVEAL — Intersection Observer slide-up / fade-in
    ══════════════════════════════════════════════════════════════════ */
    var revealCSS = document.createElement('style');
    revealCSS.textContent = `
        .is-reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1),
                        transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .is-reveal.reveal-left  { transform: translateX(-50px); }
        .is-reveal.reveal-right { transform: translateX(50px); }
        .is-reveal.reveal-scale { transform: scale(0.88); }
        .is-reveal.revealed {
            opacity: 1 !important;
            transform: translate(0,0) scale(1) !important;
        }
        .is-reveal.delay-1 { transition-delay: 0.08s; }
        .is-reveal.delay-2 { transition-delay: 0.16s; }
        .is-reveal.delay-3 { transition-delay: 0.24s; }
        .is-reveal.delay-4 { transition-delay: 0.32s; }
        .is-reveal.delay-5 { transition-delay: 0.40s; }

        /* Section headings underline animation */
        .animated-underline {
            display: inline-block;
            position: relative;
        }
        .animated-underline::after {
            content: '';
            position: absolute;
            bottom: -4px; left: 0;
            width: 0; height: 3px;
            background: linear-gradient(90deg, #086A7C, #764ba2, #f5576c);
            border-radius: 2px;
            transition: width 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .animated-underline.revealed::after { width: 100%; }
    `;
    document.head.appendChild(revealCSS);

    function initReveal() {
        // Tag all major content blocks that don't already have AOS
        var targets = document.querySelectorAll(
            '.val-card, .inst-card, .testi-card, .stat-card, .hiw-gcard,' +
            '.course-card, .feat-card, .phil-card, .bc, .info-card,' +
            '.join-card, .lb-block, .story-text, .slbl,' +
            '.footer-column, footer .col-lg-4, footer .col-lg-2,' +
            '.platform-feature, .roadmap-card, .blog-card,' +
            '.cert-badge, .certificate-mockup, .contact-form-card,' +
            '.section-heading, .section-title'
        );

        targets.forEach(function (el, i) {
            // Skip if already has AOS data attribute
            if (el.hasAttribute('data-aos')) return;
            el.classList.add('is-reveal');
            // Stagger siblings
            var siblings = el.parentElement ? el.parentElement.children : [];
            var idx = Array.from(siblings).indexOf(el);
            if (idx > 0 && idx <= 5) el.classList.add('delay-' + idx);
        });

        // Tag section headings
        document.querySelectorAll('h2.section-heading, h2.section-title, h2.stitle').forEach(function (el) {
            el.querySelectorAll('span').forEach(function (s) {
                s.classList.add('animated-underline');
            });
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.is-reveal, .animated-underline').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ══════════════════════════════════════════════════════════════════
       2. TYPING EFFECT — Hero title first-line typewriter
    ══════════════════════════════════════════════════════════════════ */
    function initTyping() {
        // Find hero title — supports .hero-title and .htitle
        var titleEl = document.querySelector(
            '.hero-section .hero-title, .hero-section h1,' +
            '.courses-hero .hero-title, .contact-hero .hero-title,' +
            '.ph .htitle, .ph .hero-title,' +
            '.starter-hero .hero-title'
        );
        if (!titleEl) return;

        // Get just the first text node (before any <br> or <span>)
        var firstText = '';
        var rest = '';
        var html = titleEl.innerHTML;

        // Split on <br> or <span to get typing text and preserved rest
        var brIdx = html.search(/<br|<span/i);
        if (brIdx > -1) {
            firstText = html.slice(0, brIdx).trim();
            rest = html.slice(brIdx);
        } else {
            firstText = html.trim();
            rest = '';
        }

        if (!firstText || firstText.length < 2) return;

        // Decode HTML entities for display
        var tmp = document.createElement('div');
        tmp.innerHTML = firstText;
        var plainText = tmp.textContent || tmp.innerText || firstText;

        // Setup: hide rest initially
        titleEl.innerHTML = '<span class="type-cursor"></span>' + rest;
        titleEl.style.visibility = 'visible';

        var typingCSS = document.createElement('style');
        typingCSS.textContent = `
            .type-cursor::after {
                content: '|';
                animation: blink-cursor 0.7s step-end infinite;
                color: rgba(255,255,255,0.8);
                font-weight: 300;
                margin-left: 2px;
            }
            .type-cursor.done::after { display: none; }
            @keyframes blink-cursor { 0%,100%{opacity:1;} 50%{opacity:0;} }
        `;
        document.head.appendChild(typingCSS);

        var cursorEl = titleEl.querySelector('.type-cursor');
        var i = 0;
        var speed = Math.max(28, Math.min(55, Math.floor(1800 / plainText.length)));

        function type() {
            if (i < plainText.length) {
                cursorEl.textContent = plainText.slice(0, ++i);
                setTimeout(type, speed + (Math.random() * 20 - 10));
            } else {
                cursorEl.classList.add('done');
                // Fade in the rest
                if (rest) {
                    var restSpan = document.createElement('span');
                    restSpan.innerHTML = rest;
                    restSpan.style.cssText = 'opacity:0;transition:opacity 0.6s ease;display:inline;';
                    cursorEl.insertAdjacentElement('afterend', restSpan);
                    setTimeout(function () { restSpan.style.opacity = '1'; }, 100);
                }
            }
        }

        // Start typing after a brief delay
        setTimeout(type, 400);
    }

    /* ══════════════════════════════════════════════════════════════════
       3. PARTICLE BACKGROUND — Canvas particles for all hero sections
    ══════════════════════════════════════════════════════════════════ */
    function initParticles() {
        // Only create particles if no canvas exists yet (index already has one)
        var existingCanvas = document.getElementById('particle-canvas');
        if (existingCanvas) return; // index.html handles its own

        var heroSection = document.querySelector(
            '.courses-hero, .contact-hero, .ph, .starter-hero'
        );
        if (!heroSection) return;

        var canvas = document.createElement('canvas');
        canvas.id = 'anim-particle-canvas';
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
        heroSection.style.position = 'relative';
        heroSection.insertBefore(canvas, heroSection.firstChild);

        var ctx = canvas.getContext('2d');
        var particles = [];
        var COLORS = [
            'rgba(79,172,254,0.45)',
            'rgba(245,87,108,0.35)',
            'rgba(118,75,162,0.35)',
            'rgba(255,255,255,0.25)',
            'rgba(0,210,210,0.3)'
        ];
        var COUNT = window.innerWidth < 768 ? 30 : 55;

        function resize() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function Particle() {
            this.reset();
        }
        Particle.prototype.reset = function () {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.r = Math.random() * 2.8 + 0.8;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.vx = (Math.random() - 0.5) * 0.65;
            this.vy = (Math.random() - 0.5) * 0.65;
            this.life = 0;
            this.maxLife = Math.random() * 200 + 100;
        };
        Particle.prototype.update = function () {
            this.x += this.vx; this.y += this.vy; this.life++;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            if (this.life > this.maxLife) this.reset();
        };
        Particle.prototype.draw = function () {
            var alpha = Math.sin((this.life / this.maxLife) * Math.PI);
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        };

        for (var k = 0; k < COUNT; k++) particles.push(new Particle());

        // Connect nearby particles with lines
        function drawConnections() {
            var maxDist = 100;
            for (var a = 0; a < particles.length; a++) {
                for (var b = a + 1; b < particles.length; b++) {
                    var dx = particles[a].x - particles[b].x;
                    var dy = particles[a].y - particles[b].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        ctx.globalAlpha = (1 - dist / maxDist) * 0.18;
                        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;
            drawConnections();
            particles.forEach(function (p) { p.update(); p.draw(); });
            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ══════════════════════════════════════════════════════════════════
       4. PARALLAX — Hero background + floating elements on scroll
    ══════════════════════════════════════════════════════════════════ */
    function initParallax() {
        var heroSections = document.querySelectorAll(
            '.hero-section, .courses-hero, .contact-hero, .ph, .starter-hero,' +
            '.stats-section-modern, .stats-sec, .cta-sec, .cta-section'
        );
        var floatingEls = document.querySelectorAll('.floating-element');
        var phShapes = document.querySelectorAll('.ph-shapes span');

        var ticking = false;
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var sy = window.scrollY;

                    // Hero section background parallax
                    heroSections.forEach(function (section) {
                        var rect = section.getBoundingClientRect();
                        var offset = rect.top + sy;
                        var rel = sy - offset;
                        if (rect.bottom > 0 && rect.top < window.innerHeight) {
                            section.style.backgroundPositionY = (rel * 0.35) + 'px';
                        }
                    });

                    // Floating elements parallax (different speeds per element)
                    floatingEls.forEach(function (el, i) {
                        var speed = [0.12, -0.08, 0.06][i % 3];
                        el.style.transform = 'translateY(' + (sy * speed) + 'px)';
                    });

                    // Ph-shapes parallax
                    phShapes.forEach(function (el, i) {
                        var speed = [0.18, -0.12, 0.09][i % 3];
                        el.style.transform = 'translate(' + (sy * speed * 0.3) + 'px,' + (sy * speed) + 'px)';
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ══════════════════════════════════════════════════════════════════
       5. ADVANCED 3D TILT — All cards (VanillaTilt-style from scratch)
    ══════════════════════════════════════════════════════════════════ */
    function initTilt3D() {
        // If VanillaTilt already loaded, enhance its targets
        var cardSelectors =
            '.val-card, .inst-card, .testi-card, .course-card, ' +
            '.feat-card, .phil-card, .bc, .info-card, .hiw-gcard, ' +
            '.platform-feature, .blog-card, .stat-card-modern, ' +
            '.roadmap-card, .category-card, .feature-card';

        var cards = document.querySelectorAll(cardSelectors);

        // Use VanillaTilt if available
        if (typeof VanillaTilt !== 'undefined' && cards.length) {
            VanillaTilt.init(cards, {
                max: 10,
                speed: 500,
                glare: true,
                'max-glare': 0.25,
                scale: 1.03,
                perspective: 800
            });
        }

        // Fallback pure-CSS tilt for browsers/pages without VanillaTilt
        var tiltCSS = document.createElement('style');
        tiltCSS.textContent = `
            /* Glow ring on hover for all cards */
            .val-card, .inst-card, .testi-card, .course-card,
            .feat-card, .phil-card, .bc, .info-card, .hiw-gcard,
            .platform-feature, .blog-card, .stat-card-modern {
                transition: transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275),
                            box-shadow 0.4s ease, border-color 0.4s ease !important;
                will-change: transform;
                cursor: default;
            }

            /* Shimmer overlay on hover */
            .val-card::before, .inst-card::before, .course-card::before,
            .feat-card::before, .bc::before, .info-card::before {
                content: '';
                position: absolute;
                top: -100%; left: -100%;
                width: 60%; height: 200%;
                background: linear-gradient(
                    105deg,
                    transparent 40%,
                    rgba(255,255,255,0.08) 50%,
                    transparent 60%
                );
                transform: rotate(15deg);
                transition: left 0.6s ease, top 0.6s ease;
                pointer-events: none;
                z-index: 10;
            }
            .val-card:hover::before, .inst-card:hover::before,
            .course-card:hover::before, .feat-card:hover::before,
            .bc:hover::before, .info-card:hover::before {
                left: 150%; top: -10%;
            }

            /* Glow aura */
            .val-card:hover, .inst-card:hover, .course-card:hover,
            .feat-card:hover, .bc:hover {
                box-shadow:
                    0 20px 60px rgba(8,106,124,0.2),
                    0 0 0 1px rgba(8,106,124,0.12),
                    0 0 80px rgba(8,106,124,0.06),
                    inset 0 1px 0 rgba(255,255,255,0.1) !important;
            }
            .testi-card:hover {
                box-shadow:
                    0 20px 55px rgba(118,75,162,0.18),
                    0 0 60px rgba(118,75,162,0.07) !important;
            }
            .info-card:hover {
                box-shadow:
                    0 24px 60px rgba(8,106,124,0.2),
                    0 0 50px rgba(79,172,254,0.1) !important;
            }
        `;
        document.head.appendChild(tiltCSS);
    }

    /* ══════════════════════════════════════════════════════════════════
       6. FLOATING ANIMATIONS — Enhanced CSS keyframes + JS micro-motion
    ══════════════════════════════════════════════════════════════════ */
    function initFloating() {
        var floatingCSS = document.createElement('style');
        floatingCSS.textContent = `
            /* Enhanced floating orbs */
            .floating-element {
                animation: adv-float 7s ease-in-out infinite !important;
                filter: blur(0.5px);
            }
            .floating-1 { animation-duration: 7s !important; animation-delay: 0s !important; }
            .floating-2 { animation-duration: 9s !important; animation-delay: -3s !important; }
            .floating-3 { animation-duration: 11s !important; animation-delay: -6s !important; }

            @keyframes adv-float {
                0%   { transform: translate(0,0) rotate(0deg) scale(1); }
                20%  { transform: translate(18px,-22px) rotate(72deg) scale(1.06); }
                40%  { transform: translate(-12px,15px) rotate(144deg) scale(0.96); }
                60%  { transform: translate(22px,8px) rotate(216deg) scale(1.04); }
                80%  { transform: translate(-8px,-18px) rotate(288deg) scale(0.98); }
                100% { transform: translate(0,0) rotate(360deg) scale(1); }
            }

            /* Hero image float (index.html) */
            .hero-image img {
                animation: hero-float 6s ease-in-out infinite !important;
            }
            @keyframes hero-float {
                0%,100% { transform: translateY(0) rotate(-1deg); }
                50%      { transform: translateY(-18px) rotate(1deg); }
            }

            /* ph-shapes breathing animation */
            .ph-shapes span {
                animation: shape-breathe 8s ease-in-out infinite !important;
            }
            .ph-shapes span:nth-child(1) { animation-delay: 0s !important; }
            .ph-shapes span:nth-child(2) { animation-delay: -3s !important; }
            .ph-shapes span:nth-child(3) { animation-delay: -6s !important; }

            @keyframes shape-breathe {
                0%,100% { transform: translate(0,0) scale(1); opacity: 0.06; }
                33%      { transform: translate(20px,-25px) scale(1.1); opacity: 0.1; }
                66%      { transform: translate(-15px,12px) scale(0.92); opacity: 0.05; }
            }

            /* Instructor/feature card icon float on hover */
            .inst-card:hover .inst-avatar,
            .inst-card:hover .inst-thumb-icon,
            .feature-card:hover .feature-icon,
            .val-card:hover .val-icon,
            .platform-feature:hover .platform-icon {
                animation: icon-bounce 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
            }
            @keyframes icon-bounce {
                0%   { transform: scale(1) translateY(0); }
                40%  { transform: scale(1.15) translateY(-8px); }
                70%  { transform: scale(0.95) translateY(3px); }
                100% { transform: scale(1) translateY(0); }
            }

            /* Stats number pop on scroll-reveal */
            .stat-card-modern.revealed .stat-icon,
            .stat-card.revealed .stat-icon-wrap {
                animation: stat-pop 0.7s cubic-bezier(0.175,0.885,0.32,1.275) 0.3s both;
            }
            @keyframes stat-pop {
                0%   { transform: scale(0) rotate(-15deg); }
                80%  { transform: scale(1.1) rotate(5deg); }
                100% { transform: scale(1) rotate(0deg); }
            }
        `;
        document.head.appendChild(floatingCSS);
    }

    /* ══════════════════════════════════════════════════════════════════
       7. SCROLL-TRIGGERED COUNTER ANIMATION (all stat sections)
    ══════════════════════════════════════════════════════════════════ */
    function initCounters() {
        var statEls = document.querySelectorAll('.stat-num, .hero-stat-number, .story-stat-val');
        if (!statEls.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var text = el.textContent.trim();
                var match = text.match(/^(\d[\d,]*)([^0-9]*)$/);
                if (!match) return;

                var target = parseInt(match[1].replace(/,/g, ''));
                var suffix = match[2] || '';
                var start = 0;
                var dur = 1800;
                var begin = performance.now();

                function step(now) {
                    var p = Math.min((now - begin) / dur, 1);
                    // Ease out
                    var ease = 1 - Math.pow(1 - p, 3);
                    var val = Math.floor(ease * target);
                    el.textContent = val.toLocaleString() + suffix;
                    if (p < 1) requestAnimationFrame(step);
                    else el.textContent = target.toLocaleString() + suffix;
                }
                requestAnimationFrame(step);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        statEls.forEach(function (el) { observer.observe(el); });
    }

    /* ══════════════════════════════════════════════════════════════════
       8. ADVANCED HOVER GLOW — Magnetic button effect + ripple
    ══════════════════════════════════════════════════════════════════ */
    function initMagneticButtons() {
        var magneticCSS = document.createElement('style');
        magneticCSS.textContent = `
            /* Ripple effect on buttons */
            .btn-hero-primary, .btn-hero-secondary,
            .btn-gradient-primary, .btn-gradient-secondary,
            .btn-cta-white, .btn-cta-outline,
            .course-btn, .bgp, .btn-nav-enroll {
                position: relative;
                overflow: hidden;
            }
            .btn-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.35);
                transform: scale(0);
                animation: ripple-anim 0.6s linear;
                pointer-events: none;
            }
            @keyframes ripple-anim {
                to { transform: scale(4); opacity: 0; }
            }

            /* Magnetic pull glow */
            .btn-hero-primary:hover,
            .btn-gradient-primary:hover,
            .btn-nav-enroll:hover,
            .bgp:hover, .bw:hover, .course-btn:hover {
                box-shadow:
                    0 8px 30px rgba(8,106,124,0.45),
                    0 0 0 3px rgba(8,106,124,0.12),
                    0 0 60px rgba(8,106,124,0.15) !important;
            }

            /* Nav link hover glow */
            .nav-link:hover, .nav-link.active {
                text-shadow: 0 0 20px rgba(8,106,124,0.3);
            }

            /* Social icon spin on hover */
            .footer-social-icons a:hover i,
            .mfso a:hover i,
            .social-icon:hover i {
                animation: social-spin 0.4s ease;
            }
            @keyframes social-spin {
                0%   { transform: rotate(0deg) scale(1); }
                50%  { transform: rotate(15deg) scale(1.2); }
                100% { transform: rotate(0deg) scale(1); }
            }

            /* WhatsApp float enhanced pulse */
            .whatsapp-float, .waf {
                animation: wa-pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite !important;
            }
            @keyframes wa-pulse {
                0%,100% {
                    box-shadow: 0 6px 25px rgba(37,211,102,0.45),
                                0 0 0 0 rgba(37,211,102,0);
                }
                50% {
                    box-shadow: 0 6px 25px rgba(37,211,102,0.7),
                                0 0 0 12px rgba(37,211,102,0.15);
                }
            }

            /* Scroll to top button spin on hover */
            .scroll-top-btn:hover i,
            .sctb:hover i, #scrollTopBtn:hover i {
                animation: arrow-bounce 0.4s ease;
            }
            @keyframes arrow-bounce {
                0%,100% { transform: translateY(0); }
                40%     { transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(magneticCSS);

        // Ripple on click
        document.addEventListener('click', function (e) {
            var btn = e.target.closest(
                '.btn-hero-primary, .btn-hero-secondary, .btn-gradient-primary,' +
                '.btn-gradient-secondary, .btn-cta-white, .course-btn, .bgp, .bw,' +
                '.btn-nav-enroll, .btn-submit'
            );
            if (!btn) return;

            var ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            var rect = btn.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height) * 2;
            ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;' +
                'left:' + (e.clientX - rect.left - size / 2) + 'px;' +
                'top:' + (e.clientY - rect.top - size / 2) + 'px;';
            btn.appendChild(ripple);
            setTimeout(function () { ripple.remove(); }, 600);
        });

        // Magnetic hover (subtle) for hero buttons
        var magnetBtns = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary, .btn-cta-white');
        magnetBtns.forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                var y = (e.clientY - rect.top - rect.height / 2) * 0.15;
                btn.style.transform = 'translate(' + x + 'px,' + (y - 2) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
            });
        });
    }

    /* ══════════════════════════════════════════════════════════════════
       9. PAGE TRANSITION — Smooth fade-in on load
    ══════════════════════════════════════════════════════════════════ */
    function initPageTransition() {
        var transCSS = document.createElement('style');
        transCSS.textContent = `
            body { animation: page-enter 0.5s ease both; }
            @keyframes page-enter {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
            }

            /* Navbar items stagger in */
            .navbar-nav .nav-item {
                animation: nav-slide-in 0.5s ease both;
            }
            .navbar-nav .nav-item:nth-child(1) { animation-delay: 0.05s; }
            .navbar-nav .nav-item:nth-child(2) { animation-delay: 0.10s; }
            .navbar-nav .nav-item:nth-child(3) { animation-delay: 0.15s; }
            .navbar-nav .nav-item:nth-child(4) { animation-delay: 0.20s; }
            .navbar-nav .nav-item:nth-child(5) { animation-delay: 0.25s; }
            .navbar-nav .nav-item:nth-child(6) { animation-delay: 0.30s; }
            .navbar-nav .nav-item:nth-child(7) { animation-delay: 0.35s; }
            .navbar-nav .nav-item:nth-child(8) { animation-delay: 0.40s; }
            @keyframes nav-slide-in {
                from { opacity: 0; transform: translateY(-10px); }
                to   { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(transCSS);
    }

    /* ══════════════════════════════════════════════════════════════════
       10. SECTION ENTRANCE — Staggered children animation on scroll
    ══════════════════════════════════════════════════════════════════ */
    function initSectionEntrance() {
        var entranceCSS = document.createElement('style');
        entranceCSS.textContent = `
            /* Grid children stagger */
            .row.g-4 > [class*="col-"],
            .row.g-3 > [class*="col-"] {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .row.g-4.row-visible > [class*="col-"],
            .row.g-3.row-visible > [class*="col-"] {
                opacity: 1;
                transform: translateY(0);
            }
            /* Override for cols that already have AOS */
            [data-aos][class*="col-"] {
                opacity: unset !important;
                transform: unset !important;
                transition: unset !important;
            }
        `;
        document.head.appendChild(entranceCSS);

        var rows = document.querySelectorAll('.row.g-4, .row.g-3');
        var rowObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var row = entry.target;
                // Skip rows where children have AOS
                var hasAOS = row.querySelector('[data-aos]');
                if (hasAOS) { rowObserver.unobserve(row); return; }

                row.classList.add('row-visible');
                var cols = row.querySelectorAll('[class*="col-"]');
                cols.forEach(function (col, i) {
                    col.style.transitionDelay = (i * 0.08) + 's';
                });
                rowObserver.unobserve(row);
            });
        }, { threshold: 0.1 });

        rows.forEach(function (row) { rowObserver.observe(row); });
    }

    /* ══════════════════════════════════════════════════════════════════
       INIT — Run everything after DOM is ready
    ══════════════════════════════════════════════════════════════════ */
    function init() {
        initPageTransition();
        initFloating();
        initParticles();
        initParallax();
        initReveal();
        initTilt3D();
        initMagneticButtons();
        initCounters();
        initSectionEntrance();

        // Typing starts slightly later for smooth entry
        setTimeout(initTyping, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();