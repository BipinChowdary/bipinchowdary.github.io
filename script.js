$(document).ready(function() {
    // Scroll event handling
    function handleScroll() {
        if (window.scrollY > 20) {
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        }

        if (window.scrollY > 500) {
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }
    }

    function applyBlurEffect() {
        const dropdown = document.querySelector('.theme-dropdown');
        if (dropdown) {
            dropdown.style.backdropFilter = 'blur(10px)';
            dropdown.style.webkitBackdropFilter = 'blur(10px)';
        }
    }

    // Apply blur effect on mouseover, scroll, and load
    $('.theme-selector').on('mouseover click', applyBlurEffect);
    $(window).on('scroll load', applyBlurEffect);

    // Soft-bounce scrolling for internal section links.
    // Fixes the first-click offset by measuring after the navbar is in its sticky state,
    // then makes one tiny correction at the end so you do not have to click twice.
    function clampScrollY(value) {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        return Math.max(0, Math.min(value, maxScroll));
    }

    function easeOutBackSmall(t) {
        const c1 = 0.72;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function forceInstantScrollMode() {
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        $('html, body').css('scrollBehavior', 'auto');
    }

    function getNavbarHeightForTarget(hash) {
        const navbar = document.querySelector('.navbar');
        if (!navbar || hash === '#home') return 0;

        const alreadySticky = navbar.classList.contains('sticky');
        if (!alreadySticky) navbar.classList.add('sticky');
        const height = navbar.offsetHeight || 0;
        return height;
    }

    function getSectionTargetY(hash) {
        if (hash === '#home') return 0;

        const target = document.querySelector(hash);
        if (!target) return null;

        const navHeight = getNavbarHeightForTarget(hash);
        const sectionBreathingRoom = {
    '#about': 30,
    '#skills': 30
};

const breathingRoom = sectionBreathingRoom[hash] ?? (window.innerWidth <= 947 ? 8 : 6);
        const targetY = target.getBoundingClientRect().top + window.pageYOffset - navHeight - breathingRoom;
        return clampScrollY(targetY);
    }

    function animateScrollTo(destination, duration = 620, done) {
        const start = window.pageYOffset || document.documentElement.scrollTop || 0;
        const distance = destination - start;

        if (Math.abs(distance) < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.scrollTo(0, destination);
            if (typeof done === 'function') done();
            return;
        }

        const startTime = performance.now();

        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = easeOutBackSmall(progress);
            window.scrollTo(0, clampScrollY(start + distance * eased));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                window.scrollTo(0, clampScrollY(destination));
                if (typeof done === 'function') done();
            }
        }

        requestAnimationFrame(step);
    }

    function smoothSectionScroll(hash) {
        forceInstantScrollMode();

        // Wait two frames so sticky navbar/layout dimensions are final before measuring.
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                const targetY = getSectionTargetY(hash);
                if (targetY === null) return;

                const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
                const duration = Math.min(780, Math.max(500, Math.abs(targetY - currentY) * 0.2));

                animateScrollTo(targetY, duration, function() {
                    // Automatic final correction replaces the old "second click" behavior.
                    setTimeout(function() {
                        const correctedY = getSectionTargetY(hash);
                        if (correctedY === null) return;

                        const diff = correctedY - (window.pageYOffset || document.documentElement.scrollTop || 0);
                        if (Math.abs(diff) > 2) {
                            animateScrollTo(correctedY, 180);
                        }
                    }, 80);
                });
            });
        });
    }

    // Slide-up script for scroll-up button
    $('.scroll-up-btn').click(function() {
        smoothSectionScroll('#home');
    });

    // Store the actual navbar height in CSS so scroll targets do not use brittle fixed offsets.
    function updateNavHeightVariable() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            document.documentElement.style.setProperty('--site-nav-height', `${navbar.offsetHeight}px`);
        }
    }

    updateNavHeightVariable();
    $(window).on('resize load scroll', updateNavHeightVariable);

    // Internal section links: navbar, home CTAs, About buttons, and any future section button.
    $(document).on('click', 'a[href^="#"]', function(event) {
        const href = $(this).attr('href');
        if (!href || href === '#' || !document.querySelector(href)) return;

        event.preventDefault();
        smoothSectionScroll(href);

        $('.navbar .menu').removeClass('active');
        $('.nav-toggle').attr('aria-expanded', 'false');
        $('.nav-toggle i').addClass('fa-bars').removeClass('fa-xmark');
    });

    // Mobile menu toggle. Desktop nav links stay normal clickable anchors.
    $('.nav-toggle').click(function(event) {
        event.stopPropagation();
        const isOpen = $('.navbar .menu').toggleClass("active").hasClass("active");
        $(this).attr('aria-expanded', isOpen ? 'true' : 'false');
        $(this).find('i').toggleClass('fa-bars', !isOpen).toggleClass('fa-xmark', isOpen);
    });

    // Typing text animation
    var typed = new Typed(".typing", {
        strings: ["AI Developer", "Robotics Engineer", "Game Modder", "Creative Designer"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    var typed2 = new Typed(".typing-2", {
        strings: ["Research & Development", "Robotics + AI", "Intelligent Systems", "Creative Engineering"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    // Owl carousel setup
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 2,
                nav: false
            },
            1000: {
                items: 3,
                nav: false
            }
        }
    });

    // Hidden icon functionality
    $('#hidden-icon').click(function() {
        var password = prompt('Enter the password:');
        if (password === '8055') {
            window.open('https://hackmd.io/@UsqfrpfnRwuTsLQGJGrx7w/Zeus', '_blank');
        } else {
            alert('Incorrect password. Try again.');
        }
    });

    // Set height of the images container dynamically
    function setImagesContainerHeight() {
        const windowHeight = $(window).height();
        $('.images').height(windowHeight);
    }

    setImagesContainerHeight();
    $(window).resize(setImagesContainerHeight);

    // Theme switching functionality
    function setTheme(theme) {
        document.documentElement.className = `theme-${theme}`;
        localStorage.setItem('selectedTheme', theme);
        if (typeof render === 'function') {
            render(); // Update particle colors dynamically
        }
    }

    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(savedTheme);
        $(`.theme-option[data-theme=${savedTheme}]`).addClass('selected');
    }

    $('.theme-toggle-btn').click(function() {
        $('.theme-dropdown').toggle();
        applyBlurEffect();
    });

    $('.theme-option').click(function(event) {
        event.stopPropagation();
        const selectedTheme = $(this).attr('data-theme');
        setTheme(selectedTheme);
        $('.theme-dropdown').hide();
        $('.theme-option').removeClass('selected');
        $(this).addClass('selected');
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.theme-selector').length) {
            $('.theme-dropdown').hide();
        }
        if (!$(event.target).closest('.navbar .menu, .nav-toggle').length) {
            $('.navbar .menu').removeClass("active");
            $('.nav-toggle').attr('aria-expanded', 'false');
            $('.nav-toggle i').addClass('fa-bars').removeClass('fa-xmark');
        }
    });

    // Apply blur effect initially
    applyBlurEffect();

    // Handle scroll events
    $(window).on('scroll', handleScroll);
    handleScroll(); // Call once to initialize

    // Intersection Observer setup for scroll-snap functionality
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('scroll-snap-section')) {
                    $('.navbar').addClass("sticky");
                } else {
                    $('.navbar').removeClass("sticky");
                }

                if (entry.target.id === 'scroll-up-section') {
                    $('.scroll-up-btn').addClass("show");
                } else {
                    $('.scroll-up-btn').removeClass("show");
                }
            }
        });
    }, options);

    // Observe each scroll-snap section
    document.querySelectorAll('.scroll-snap-section').forEach(section => {
        observer.observe(section);
    });
});

class Carousel {
    constructor(container, dotsContainer) {
        this.container = container;
        this.dotsContainer = dotsContainer;
        this.cards = Array.from(container.querySelectorAll('.card'));
        this.totalCards = this.cards.length;
        this.currentIndex = 2;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.autoRotateInterval = null;
        this.autoRotateDelay = 3000;
        this.isPaused = false;

        this.init();
    }

    init() {
        this.setupDots();
        this.setupEventListeners();
        this.preloadImages();
        this.startAutoRotate();
        requestAnimationFrame(() => this.updateCards());
    }

    startAutoRotate() {
        this.autoRotateInterval = setInterval(() => {
            if (!this.isPaused) {
                this.goToCard((this.currentIndex + 1) % this.totalCards);
            }
        }, this.autoRotateDelay);
    }

    stopAutoRotate() {
        clearInterval(this.autoRotateInterval);
    }

    preloadImages() {
        this.cards.forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                const index = parseInt(card.dataset.index);
                if (Math.abs(index - this.currentIndex) <= 1) {
                    img.loading = 'eager';
                }
            }
        });
    }

    calculatePositions(index) {
        const position = ((index - this.currentIndex + this.totalCards) % this.totalCards + this.totalCards) % this.totalCards;
        const isMobile = window.matchMedia('(max-width: 947px)').matches;
        let transform = '';
        let opacity = 1;
        let zIndex = 1;

        if (isMobile) {
            if (position === 0) {
                transform = 'translateX(0) scale(1)';
                opacity = 1;
                zIndex = 4;
            } else if (position === 1) {
                transform = 'translateX(112%) scale(0.88)';
                opacity = 0;
                zIndex = 2;
            } else if (position === this.totalCards - 1) {
                transform = 'translateX(-112%) scale(0.88)';
                opacity = 0;
                zIndex = 2;
            } else {
                const direction = position <= this.totalCards / 2 ? 1 : -1;
                transform = `translateX(${direction * 140}%) scale(0.82)`;
                opacity = 0;
                zIndex = 1;
            }

            return { transform, opacity, zIndex };
        }

        if (position === 0) {
            transform = 'translateX(0) scale(1)';
            zIndex = 3;
        } else if (position === 1) {
            transform = 'translateX(160%) scale(0.7)';
            opacity = 0.6;
            zIndex = 2;
        } else if (position === this.totalCards - 1) {
            transform = 'translateX(-160%) scale(0.7)';
            opacity = 0.6;
            zIndex = 2;
        } else {
            const direction = position <= this.totalCards / 2 ? 1 : -1;
            transform = `translateX(${direction * 250}%) scale(0.6)`;
            opacity = 0.6;
            zIndex = 1;
        }

        return { transform, opacity, zIndex };
    }

    setupDots() {
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalCards; i++) {
            const dot = document.createElement('div');
            dot.className = `dot${i === this.currentIndex ? ' active' : ''}`;
            dot.addEventListener('click', () => !this.isAnimating && this.goToCard(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    setupEventListeners() {
        this.cards.forEach((card, index) => {
            const exploreBtn = card.querySelector('.explore-btn');
            
            card.addEventListener('click', (e) => {
                if (e.target.closest('.explore-btn')) {
                    e.stopPropagation();
                    console.log('Explore clicked for project:', index + 1);
                    return;
                }
                
                if (!this.isAnimating && index !== this.currentIndex) {
                    this.goToCard(index);
                }
            });

            card.addEventListener('mouseenter', () => {
                this.isPaused = true;
            });

            card.addEventListener('mouseleave', () => {
                this.isPaused = false;
            });
        });

        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.isPaused = true;
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            if (this.isAnimating) return;
            this.touchEndX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
            const swipeDistance = this.touchEndX - this.touchStartX;
            if (Math.abs(swipeDistance) > 50) {
                const direction = swipeDistance > 0 ? -1 : 1;
                this.goToCard((this.currentIndex + direction + this.totalCards) % this.totalCards);
            }
            setTimeout(() => {
                this.isPaused = false;
            }, 1000);
        });

        const handleTransitionEnd = (e) => {
            if (e.target.classList.contains('card')) {
                this.isAnimating = false;
                this.preloadImages();
            }
        };

        this.cards.forEach(card => {
            card.addEventListener('transitionend', handleTransitionEnd);
        });
    }

    updateCards() {
        this.cards.forEach((card, index) => {
            const { transform, opacity, zIndex } = this.calculatePositions(index);
            
            requestAnimationFrame(() => {
                card.style.transform = transform;
                card.style.opacity = opacity;
                card.style.zIndex = zIndex;
                
                card.classList.toggle('main-card', index === this.currentIndex);
                card.classList.toggle('side-card', index !== this.currentIndex);
                card.classList.toggle('active', index === this.currentIndex);
            });
        });

        this.dotsContainer.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToCard(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        const direction = index > this.currentIndex ? 1 : -1;
        const distance = Math.abs(index - this.currentIndex);
        const shortestPath = Math.min(distance, this.totalCards - distance);
        const finalDirection = distance === shortestPath ? direction : -direction;
        
        this.currentIndex = ((this.currentIndex + shortestPath * finalDirection) % this.totalCards + this.totalCards) % this.totalCards;
        requestAnimationFrame(() => this.updateCards());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.querySelector('.projects');
    const navigationDots = document.querySelector('.navigation-dots');

    if (projectsContainer && navigationDots) {
        const projectCarousel = new Carousel(projectsContainer, navigationDots);
        window.addEventListener('resize', () => {
            requestAnimationFrame(() => projectCarousel.updateCards());
        });
    }

    const navLinks = Array.from(document.querySelectorAll('.navbar .menu li a'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const setActiveLink = () => {
        let currentId = sections[0]?.id || 'home';
        const offset = window.innerHeight * 0.35;

        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= offset) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
        });
    };

    window.addEventListener('scroll', setActiveLink, { passive: true });
    window.addEventListener('resize', setActiveLink);
    setActiveLink();
});

const containerEl = document.querySelector(".container");
const canvasEl = document.querySelector("canvas#neuro");
const devicePixelRatio = Math.min(window.devicePixelRatio, 2);


const pointer = {
    x: 0,
    y: 0,
    tX: 0,
    tY: 0,
};


let uniforms;
const gl = initShader();

setupEvents();

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

render();

function initShader() {
    const vsSource = document.getElementById("vertShader").innerHTML;
    const fsSource = document.getElementById("fragShader").innerHTML;

    const gl = canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

    if (!gl) {
        alert("WebGL is not supported by your browser.");
    }

    function createShader(gl, sourceCode, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

    function createShaderProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
    uniforms = getUniforms(shaderProgram);

    function getUniforms(program) {
        let uniforms = [];
        let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let uniformName = gl.getActiveUniform(program, i).name;
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
    }

    const vertices = new Float32Array([-1., -1., 1., -1., -1., 1., 1., 1.]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(shaderProgram);

    const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    return gl;
}

function render() {
    const currentTime = performance.now();

    pointer.x += (pointer.tX - pointer.x) * .5;
    pointer.y += (pointer.tY - pointer.y) * .5;

    gl.uniform1f(uniforms.u_time, currentTime);
    gl.uniform2f(uniforms.u_pointer_position, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);
    if (uniforms.u_scroll_progress) {
        gl.uniform1f(uniforms.u_scroll_progress, window["pageYOffset"] / (2 * window.innerHeight));
    }

    // Get the colors based on the current theme from CSS variables
    const root = document.documentElement;
    const topColor = getComputedStyle(root).getPropertyValue('--top').trim();
    const middleColor = getComputedStyle(root).getPropertyValue('--middle').trim();
    const bottomColor = getComputedStyle(root).getPropertyValue('--bottom').trim();

    // Pass the colors to the shader
    gl.uniform3fv(uniforms.u_top_color, parseColor(topColor));
    gl.uniform3fv(uniforms.u_middle_color, parseColor(middleColor));
    gl.uniform3fv(uniforms.u_bottom_color, parseColor(bottomColor));

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

function resizeCanvas() {
    canvasEl.width = window.innerWidth * devicePixelRatio;
    canvasEl.height = window.innerHeight * devicePixelRatio;
    gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
    gl.viewport(0, 0, canvasEl.width, canvasEl.height);
}

function setupEvents() {
    window.addEventListener("pointermove", e => {
        updateMousePosition(e.clientX, e.clientY);
    });
    window.addEventListener("touchmove", e => {
        updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    });
    window.addEventListener("click", e => {
        updateMousePosition(e.clientX, e.clientY);
    });

    function updateMousePosition(eX, eY) {
        pointer.tX = eX;
        pointer.tY = eY;
    }
}

function parseColor(color) {
    if (color[0] === '#') {
        const r = parseInt(color.slice(1, 3), 16) / 255;
        const g = parseInt(color.slice(3, 5), 16) / 255;
        const b = parseInt(color.slice(5, 7), 16) / 255;
        return [r, g, b];
    }
    return [1, 1, 1]; // Default white color in case of an error
}
