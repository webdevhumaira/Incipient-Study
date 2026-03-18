/**
 * app.js — Incipient Study
 * Page-specific JavaScript for all pages.
 * Runs after shared.js and animations.js have loaded.
 * Place in: assets/js/app.js
 *
 * Sections:
 *  1. INDEX PAGE     — jQuery-based logic, particles, cursor, counters
 *  2. COURSES PAGE   — Filter tabs + search
 *  3. INSTRUCTORS    — Filter tabs
 *  4. CONTACT PAGE   — Form validation + success state
 */

(function () {
    'use strict';

    /* ════════════════════════════════════════════════════════════════════
       HELPERS
    ════════════════════════════════════════════════════════════════════ */
    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    function onPage(selector) {
        return !!document.querySelector(selector);
    }

    /* ════════════════════════════════════════════════════════════════════
       1. INDEX PAGE
       Handles: jQuery animations, particle canvas, custom cursor,
                counters, active nav on scroll, batch enroll feedback,
                newsletter form, tilt refresh, smooth scroll (jQuery)
    ════════════════════════════════════════════════════════════════════ */
    function initIndexPage() {
        if (!onPage('.hero-section')) return;

        // Wait for jQuery
        if (typeof $ === 'undefined') {
            setTimeout(initIndexPage, 100);
            return;
        }

        $(document).ready(function () {

            /* ── AOS init ── */
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 800, once: false, mirror: true, offset: 100 });
            }

            /* ── VanillaTilt ── */
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
                    max: 8, speed: 400, glare: true, 'max-glare': 0.3, reverse: true
                });
            }

            /* ── Particle Canvas (index hero) ── */
            var canvas = document.getElementById('particle-canvas');
            if (canvas) {
                var ctx = canvas.getContext('2d');
                var pWidth, pHeight;
                var particles = [];
                var PARTICLE_COUNT = 80;

                function resizeCanvas() {
                    pWidth = window.innerWidth;
                    var heroSec = document.querySelector('.hero-section');
                    pHeight = heroSec ? heroSec.offsetHeight : window.innerHeight;
                    canvas.width = pWidth;
                    canvas.height = pHeight;
                }
                window.addEventListener('resize', resizeCanvas);
                resizeCanvas();

                function Particle() {
                    this.x = Math.random() * pWidth;
                    this.y = Math.random() * pHeight;
                    this.vx = (Math.random() - 0.5) * 1.2;
                    this.vy = (Math.random() - 0.5) * 1.2;
                    this.radius = Math.random() * 3 + 1;
                    this.color = 'rgba(255,255,255,' + (Math.random() * 0.4 + 0.2) + ')';
                }
                Particle.prototype.update = function () {
                    this.x += this.vx; this.y += this.vy;
                    if (this.x < 0 || this.x > pWidth) this.vx *= -1;
                    if (this.y < 0 || this.y > pHeight) this.vy *= -1;
                };
                Particle.prototype.draw = function () {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                };

                for (var p = 0; p < PARTICLE_COUNT; p++) particles.push(new Particle());

                (function animateParticles() {
                    ctx.clearRect(0, 0, pWidth, pHeight);
                    particles.forEach(function (pt) { pt.update(); pt.draw(); });
                    requestAnimationFrame(animateParticles);
                })();
            }

            /* ── Custom Cursor ── */
            (function () {
                var ring = document.getElementById('cursor-ring');
                var dot = document.getElementById('cursor-dot');
                if (!ring || !dot) return;

                var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
                var ringX = mouseX, ringY = mouseY;

                document.addEventListener('mousemove', function (e) {
                    mouseX = e.clientX; mouseY = e.clientY;
                });
                document.addEventListener('mouseleave', function () {
                    ring.style.opacity = '0'; dot.style.opacity = '0';
                });
                document.addEventListener('mouseenter', function () {
                    ring.style.opacity = '1'; dot.style.opacity = '1';
                });

                var hoverTargets = 'a, button, .course-card, .category-card, .feature-card, .blog-card, .instructor-card, .batch-card';
                $(document)
                    .on('mouseenter', hoverTargets, function () {
                        ring.classList.add('hovered'); dot.classList.add('hovered');
                    })
                    .on('mouseleave', hoverTargets, function () {
                        ring.classList.remove('hovered'); dot.classList.remove('hovered');
                    });

                function lerp(a, b, t) { return a + (b - a) * t; }
                (function animateCursor() {
                    dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
                    ringX = lerp(ringX, mouseX, 0.12);
                    ringY = lerp(ringY, mouseY, 0.12);
                    ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
                    requestAnimationFrame(animateCursor);
                })();
            })();

            /* ── Sticky Header + Scroll Progress + Scroll-to-Top ── */
            $(window).on('scroll', function () {
                var top = $(this).scrollTop();
                if (top > 100) $('.main-header').addClass('scrolled');
                else $('.main-header').removeClass('scrolled');
                if (top > 300) $('#scrollTopBtn').addClass('show');
                else $('#scrollTopBtn').removeClass('show');
                var h = $(document).height() - $(window).height();
                var scrolled = h > 0 ? (top / h) * 100 : 0;
                $('#scroll-progress').css('width', scrolled + '%');
            });

            $('#scrollTopBtn').on('click', function () {
                $('html, body').animate({ scrollTop: 0 }, 600);
            });

            /* ── Theme Toggle (dropdown) ── */
            function applyAutoTheme() {
                var hours = new Date().getHours();
                $('body').attr('data-theme', (hours >= 5 && hours < 17) ? 'light' : 'dark');
            }
            function setTheme(theme) {
                if (theme === 'auto') {
                    localStorage.setItem('theme', 'auto');
                    applyAutoTheme();
                } else {
                    $('body').attr('data-theme', theme);
                    localStorage.setItem('theme', theme);
                }
            }
            var savedTheme = localStorage.getItem('theme') || 'light';
            if (savedTheme === 'auto') applyAutoTheme();
            else $('body').attr('data-theme', savedTheme);

            $('.dropdown-item[data-theme]').on('click', function (e) {
                e.preventDefault();
                setTheme($(this).data('theme'));
            });
            setInterval(function () {
                if (localStorage.getItem('theme') === 'auto') applyAutoTheme();
            }, 60000);

            /* ── jQuery Smooth Scroll (anchor links) ── */
            $('a[href^="#"]').on('click', function (e) {
                var href = $(this).attr('href');
                if (href === '#') return;
                var target = $(href);
                if (target.length) {
                    e.preventDefault();
                    var offset = $('.main-header').outerHeight() || 0;
                    $('html, body').animate({ scrollTop: target.offset().top - offset }, 600);
                }
            });

            /* ── Navbar collapse on mobile link click ── */
            $('.navbar-nav .nav-link').on('click', function () {
                if ($('.navbar-collapse').hasClass('show')) {
                    $('.navbar-toggler').trigger('click');
                }
            });

            /* ── Active Nav Link on scroll ── */
            $(window).on('scroll', function () {
                var scrollPos = $(this).scrollTop() + 120;
                $('section[id]').each(function () {
                    var sectionTop = $(this).offset().top;
                    var sectionId = $(this).attr('id');
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + $(this).outerHeight()) {
                        $('.nav-link').removeClass('active');
                        $('.nav-link[href="#' + sectionId + '"]').addClass('active');
                    }
                });
            });

            /* ── Animated Counter (index stats section) ── */
            var countersStarted = false;
            function startCounters() {
                if (countersStarted) return;
                var statsSection = $('.stats-section-modern');
                if (!statsSection.length) return;
                var statsTop = statsSection.offset().top;
                var scrollTop = $(window).scrollTop() + $(window).height() * 0.7;
                if (scrollTop > statsTop) {
                    countersStarted = true;
                    $('.counter').each(function () {
                        var $this = $(this);
                        var target = parseInt($this.data('target'));
                        var current = 0;
                        var step = target / 60;
                        var timer = setInterval(function () {
                            current += step;
                            if (current >= target) {
                                $this.text(target.toLocaleString());
                                clearInterval(timer);
                            } else {
                                $this.text(Math.floor(current).toLocaleString());
                            }
                        }, 30);
                    });
                }
            }
            $(window).on('scroll', startCounters);
            startCounters();

            /* ── Newsletter Form ── */
            $('.newsletter-form').on('submit', function (e) {
                e.preventDefault();
                var email = $(this).find('input[type="email"]').val();
                alert('Thank you for subscribing! We will send updates to: ' + email);
                $(this).trigger('reset');
            });

            /* ── Batch Enroll Button Feedback ── */
            $('.btn-batch-enroll, .course-btn').on('click', function () {
                var $btn = $(this);
                var originalText = $btn.text();
                $btn.text('Processing...').prop('disabled', true);
                setTimeout(function () {
                    $btn.text(originalText).prop('disabled', false);
                }, 1500);
            });

            /* ── VanillaTilt Refresh on Resize ── */
            $(window).on('resize', function () {
                if (typeof VanillaTilt !== 'undefined') {
                    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
                        max: 8, speed: 400, glare: true, 'max-glare': 0.3, reverse: true
                    });
                }
            });

        }); // end document.ready
    }

    /* ════════════════════════════════════════════════════════════════════
       2. COURSES PAGE
       Handles: Category filter tabs + keyword search
    ════════════════════════════════════════════════════════════════════ */
    function initCoursesPage() {
        var tabs = document.querySelectorAll('.filter-tab');
        var items = document.querySelectorAll('.course-item');
        var searchInput = document.getElementById('courseSearch');
        var resultCount = document.getElementById('resultCount');
        var noResults = document.getElementById('noResults');

        if (!tabs.length || !items.length) return;

        var activeFilter = 'all';
        var searchQuery = '';

        function filterCourses() {
            var visible = 0;
            items.forEach(function (item) {
                var cat = item.getAttribute('data-category') || '';
                var name = item.getAttribute('data-name') || '';
                var matchFilter = activeFilter === 'all' || cat.includes(activeFilter);
                var matchSearch = !searchQuery || name.includes(searchQuery);
                if (matchFilter && matchSearch) {
                    item.style.display = '';
                    visible++;
                } else {
                    item.style.display = 'none';
                }
            });
            if (resultCount) {
                resultCount.textContent = 'Showing ' + visible + ' course' + (visible !== 1 ? 's' : '');
            }
            if (noResults) {
                noResults.style.display = visible === 0 ? 'block' : 'none';
            }
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                tabs.forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');
                activeFilter = tab.getAttribute('data-filter');
                filterCourses();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = searchInput.value.trim().toLowerCase();
                filterCourses();
            });
        }
    }

    /* ════════════════════════════════════════════════════════════════════
       3. INSTRUCTORS PAGE
       Handles: Category filter tabs (Programming / Language / Skills)
    ════════════════════════════════════════════════════════════════════ */
    function initInstructorsPage() {
        var ftabs = document.querySelectorAll('.ftab');
        var items = document.querySelectorAll('.inst-item');

        if (!ftabs.length || !items.length) return;

        ftabs.forEach(function (btn) {
            btn.addEventListener('click', function () {
                ftabs.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var filter = btn.dataset.filter;
                items.forEach(function (item) {
                    var cat = item.dataset.cat || '';
                    item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
                });
            });
        });
    }

    /* ════════════════════════════════════════════════════════════════════
       4. CONTACT PAGE
       Handles: Form validation + success state animation
    ════════════════════════════════════════════════════════════════════ */
    function initContactPage() {
        var form = document.getElementById('contactForm');
        var successBox = document.getElementById('formSuccess');
        var submitBtn = document.getElementById('submitBtn');

        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate required fields
            var fields = form.querySelectorAll('[required]');
            var valid = true;
            fields.forEach(function (el) {
                if (!el.value.trim()) {
                    el.style.borderColor = '#f5576c';
                    el.style.boxShadow = '0 0 0 3px rgba(245,87,108,0.15)';
                    el.addEventListener('input', function () {
                        el.style.borderColor = '';
                        el.style.boxShadow = '';
                    }, { once: true });
                    valid = false;
                }
            });
            if (!valid) return;

            // Loading state
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
            submitBtn.disabled = true;

            // Show success after delay
            setTimeout(function () {
                form.style.display = 'none';
                successBox.style.display = 'block';
            }, 1400);
        });
    }

    /* ════════════════════════════════════════════════════════════════════
       INIT — Detect current page and run appropriate module
    ════════════════════════════════════════════════════════════════════ */
    ready(function () {
        initIndexPage();
        initCoursesPage();
        initInstructorsPage();
        initContactPage();
    });

})();