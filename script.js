/* ═══════════════════════════════════════════════════════════════
   THE GRAND PORTFOLIO — JAVASCRIPT ENGINE
   Vibhav Maurya · Immersive 3D Experience
   ═══════════════════════════════════════════════════════════════ */

// ── Wait for DOM ──
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initNavigation();
    initDustMotes();
    initScrollReveal();
    initCounterAnimation();
    init3DCardTilt();
    initFloatingObjects();
    initVideoPlayer();

    // Init Three.js scenes after a small delay
    setTimeout(() => {
        initBackgroundScene();
        initVideoScene();
    }, 100);
});

/* ═══════════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════════ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 2800);
    });

    // Fallback: hide after 5s no matter what
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 5000);
}

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════════ */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor || window.innerWidth <= 768) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const interactives = document.querySelectorAll('a, button, .card-3d, .thumb-card');
    const ring = cursor.querySelector('.cursor-ring');

    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width = '60px';
            ring.style.height = '60px';
            ring.style.top = '-30px';
            ring.style.left = '-30px';
            ring.style.borderColor = '#c4384e';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width = '40px';
            ring.style.height = '40px';
            ring.style.top = '-20px';
            ring.style.left = '-20px';
            ring.style.borderColor = '#d4a853';
        });
    });
}

/* ═══════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════ */
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-menu-toggle');
    const overlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    // Scroll behavior
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile toggle
    if (toggle) {
        toggle.addEventListener('click', () => {
            overlay.classList.toggle('active');
            document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile nav on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active nav link highlight on scroll
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = { threshold: 0.3 };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${id}` ? '#d4a853' : '';
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
}

/* ═══════════════════════════════════════════
   DUST MOTES (Floating gold particles)
   ═══════════════════════════════════════════ */
function initDustMotes() {
    const container = document.getElementById('dust-motes');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
        const mote = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 15 + 10;

        mote.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(212, 168, 83, 0.8), rgba(212, 168, 83, 0));
            border-radius: 50%;
            left: ${x}%;
            top: ${Math.random() * 100}%;
            animation: dustFloat ${duration}s ease-in-out ${delay}s infinite;
            pointer-events: none;
            opacity: ${Math.random() * 0.5 + 0.1};
        `;
        container.appendChild(mote);
    }

    // Add keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dustFloat {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.4; }
            50% { transform: translateY(-200px) translateX(${Math.random() > 0.5 ? '' : '-'}40px); opacity: 0.6; }
            90% { opacity: 0.2; }
            100% { transform: translateY(-400px) translateX(${Math.random() > 0.5 ? '' : '-'}80px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════ */
function initScrollReveal() {
    // Mark elements for reveal
    const revealSelectors = [
        '.archive-card',
        '.work-card',
        '.timeline-entry',
        '.achievement-card',
        '.stat-item',
        '.video-player-container',
        '.preview-thumbnails',
        '.section-header',
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal-element');
            el.style.transitionDelay = `${i * 0.1}s`;

            // Add directional reveal
            if (el.classList.contains('right')) {
                el.classList.add('reveal-right');
            } else if (selector === '.timeline-entry' && !el.classList.contains('right')) {
                el.classList.add('reveal-left');
            }
        });
    });

    // Intersection Observer for reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Don't unobserve to allow re-trigger if needed
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-element').forEach(el => {
        revealObserver.observe(el);
    });
}

/* ═══════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);

    function update() {
        current += step;
        if (current >= target) {
            el.textContent = target;
            // Add + or % suffix
            if (el.closest('#stat-4')) el.textContent = target + '%';
            return;
        }
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
    }
    update();
}

/* ═══════════════════════════════════════════
   3D CARD TILT EFFECT
   ═══════════════════════════════════════════ */
function init3DCardTilt() {
    const cards = document.querySelectorAll('.card-3d');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

/* ═══════════════════════════════════════════
   FLOATING 3D OBJECTS
   ═══════════════════════════════════════════ */
function initFloatingObjects() {
    const objects = document.querySelectorAll('.floating-3d-object');

    // Make visible after preloader
    setTimeout(() => {
        objects.forEach((obj, i) => {
            setTimeout(() => obj.classList.add('visible'), i * 300);
        });
    }, 3500);

    // Parallax on mouse move
    document.addEventListener('mousemove', (e) => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;

        objects.forEach((obj, i) => {
            const speed = (i + 1) * 8;
            const x = mx * speed;
            const y = my * speed;
            obj.style.translate = `${x}px ${y}px`;
        });
    });
}

/* ═══════════════════════════════════════════
   VIDEO PLAYER (Simulated)
   ═══════════════════════════════════════════ */
function initVideoPlayer() {
    const playBtn = document.getElementById('vc-play-btn');
    let isPlaying = true;

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playBtn.innerHTML = isPlaying
                ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'
                : '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        });
    }

    // Simulate time progression
    const timeDisplay = document.getElementById('vc-time');
    let seconds = 0;
    setInterval(() => {
        if (!isPlaying) return;
        seconds++;
        if (seconds >= 222) seconds = 0; // 3:42
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        if (timeDisplay) timeDisplay.textContent = `${min}:${sec} / 03:42`;
    }, 1000);
}

/* ═══════════════════════════════════════════
   THREE.JS — BACKGROUND 3D SCENE
   ═══════════════════════════════════════════ */
function initBackgroundScene() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.z = 30;

    // ── Floating 3D Objects ──

    // Gold wireframe Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(3, 0);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0xd4a853, wireframe: true, transparent: true, opacity: 0.15 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-12, 5, -10);
    scene.add(ico);

    // Dodecahedron
    const dodGeo = new THREE.DodecahedronGeometry(2.5, 0);
    const dodMat = new THREE.MeshBasicMaterial({ color: 0xc4384e, wireframe: true, transparent: true, opacity: 0.1 });
    const dod = new THREE.Mesh(dodGeo, dodMat);
    dod.position.set(14, -6, -8);
    scene.add(dod);

    // Torus Knot
    const tkGeo = new THREE.TorusKnotGeometry(2, 0.5, 80, 12);
    const tkMat = new THREE.MeshBasicMaterial({ color: 0xd4a853, wireframe: true, transparent: true, opacity: 0.08 });
    const tk = new THREE.Mesh(tkGeo, tkMat);
    tk.position.set(10, 8, -15);
    scene.add(tk);

    // Octahedron
    const octGeo = new THREE.OctahedronGeometry(2, 0);
    const octMat = new THREE.MeshBasicMaterial({ color: 0xf0d78c, wireframe: true, transparent: true, opacity: 0.12 });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(-8, -8, -12);
    scene.add(oct);

    // Small Torus
    const torGeo = new THREE.TorusGeometry(1.5, 0.4, 12, 40);
    const torMat = new THREE.MeshBasicMaterial({ color: 0xb8860b, wireframe: true, transparent: true, opacity: 0.1 });
    const tor = new THREE.Mesh(torGeo, torMat);
    tor.position.set(0, -12, -10);
    scene.add(tor);

    // ── Particle System ──
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 80;
        positions[i + 1] = (Math.random() - 0.5) * 80;
        positions[i + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xd4a853,
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Additional Floating Geometry Lines ──
    const linesMaterial = new THREE.LineBasicMaterial({ color: 0xd4a853, transparent: true, opacity: 0.05 });
    for (let i = 0; i < 8; i++) {
        const points = [];
        const startX = (Math.random() - 0.5) * 60;
        const startY = (Math.random() - 0.5) * 60;
        const startZ = (Math.random() - 0.5) * 30 - 10;
        for (let j = 0; j < 5; j++) {
            points.push(new THREE.Vector3(
                startX + (Math.random() - 0.5) * 10,
                startY + (Math.random() - 0.5) * 10,
                startZ + (Math.random() - 0.5) * 10
            ));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, linesMaterial);
        scene.add(line);
    }

    // ── Mouse Parallax ──
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── Scroll Parallax ──
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });

    // ── Animation Loop ──
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Rotate objects
        ico.rotation.x += 0.003;
        ico.rotation.y += 0.005;
        ico.position.y = 5 + Math.sin(time * 0.5) * 2;

        dod.rotation.x -= 0.004;
        dod.rotation.z += 0.003;
        dod.position.y = -6 + Math.cos(time * 0.3) * 3;

        tk.rotation.x += 0.002;
        tk.rotation.y -= 0.003;
        tk.position.y = 8 + Math.sin(time * 0.4) * 2;

        oct.rotation.y += 0.004;
        oct.rotation.z -= 0.002;
        oct.position.y = -8 + Math.sin(time * 0.6) * 2;

        tor.rotation.x += 0.005;
        tor.rotation.y += 0.002;
        tor.position.y = -12 + Math.cos(time * 0.5) * 1.5;

        // Particle gentle drift
        const posArray = particles.geometry.attributes.position.array;
        for (let i = 1; i < posArray.length; i += 3) {
            posArray[i] += Math.sin(time + i) * 0.003;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Camera parallax
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 3 - camera.position.y) * 0.02;
        camera.position.z = 30 - scrollY * 0.005;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ═══════════════════════════════════════════
   THREE.JS — VIDEO 3D SCENE
   (Gothic Hall with Levitating Objects)
   ═══════════════════════════════════════════ */
function initVideoScene() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('video-3d-canvas');
    if (!canvas) return;

    const container = document.getElementById('video-player-container');
    const rect = container.getBoundingClientRect();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070e24, 0.03);

    const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 2, 12);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070e24);

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(0xd4a853, 0.15);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffeaad, 1.5, 30, Math.PI / 4, 0.5);
    spotLight.position.set(0, 15, 5);
    scene.add(spotLight);

    const pointLight1 = new THREE.PointLight(0xc4384e, 0.8, 15);
    pointLight1.position.set(-5, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x162952, 0.6, 15);
    pointLight2.position.set(5, 3, 3);
    scene.add(pointLight2);

    // ── Gothic Hall Floor ──
    const floorGeo = new THREE.PlaneGeometry(30, 30, 20, 20);
    const floorMat = new THREE.MeshPhongMaterial({
        color: 0x1a0e0a,
        wireframe: false,
        shininess: 30,
        transparent: true,
        opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    scene.add(floor);

    // Floor grid lines
    const gridHelper = new THREE.GridHelper(30, 30, 0x2a1a10, 0x150d08);
    gridHelper.position.y = -1.99;
    scene.add(gridHelper);

    // ── Gothic Pillars ──
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.4, 12, 8);
    const pillarMat = new THREE.MeshPhongMaterial({ color: 0x2a1a10, shininess: 20 });
    const pillarPositions = [[-4, 4, -5], [4, 4, -5], [-4, 4, 0], [4, 4, 0]];
    pillarPositions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(...pos);
        scene.add(pillar);
    });

    // ── Gothic Arches (simplified with torus segments) ──
    const archGeo = new THREE.TorusGeometry(4, 0.15, 8, 16, Math.PI);
    const archMat = new THREE.MeshPhongMaterial({ color: 0x3a2515, shininess: 10 });
    const arch1 = new THREE.Mesh(archGeo, archMat);
    arch1.position.set(0, 8, -5);
    scene.add(arch1);
    const arch2 = new THREE.Mesh(archGeo.clone(), archMat);
    arch2.position.set(0, 8, 0);
    scene.add(arch2);

    // ── Levitating Figure (simplified humanoid) ──
    const figureGroup = new THREE.Group();

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.5, 2, 8);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x1a1a2e, shininess: 50 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    figureGroup.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const headMat = new THREE.MeshPhongMaterial({ color: 0xd4a080, shininess: 30 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.4;
    figureGroup.add(head);

    // Hat (top hat)
    const hatBrimGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 12);
    const hatMat = new THREE.MeshPhongMaterial({ color: 0x0a0a14 });
    const hatBrim = new THREE.Mesh(hatBrimGeo, hatMat);
    hatBrim.position.y = 1.7;
    figureGroup.add(hatBrim);

    const hatTopGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.6, 12);
    const hatTop = new THREE.Mesh(hatTopGeo, hatMat);
    hatTop.position.y = 2.0;
    figureGroup.add(hatTop);

    // Cape (cone shape)
    const capeGeo = new THREE.ConeGeometry(0.8, 2, 8, 1, true);
    const capeMat = new THREE.MeshPhongMaterial({
        color: 0x7a1f2e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
    });
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, 0, -0.2);
    cape.rotation.z = Math.PI;
    figureGroup.add(cape);

    figureGroup.position.set(0, 3, -2);
    scene.add(figureGroup);

    // ── Floating Objects ──
    const floatingObjects = [];

    // Book
    const bookGeo = new THREE.BoxGeometry(0.8, 0.1, 0.6);
    const bookMat = new THREE.MeshPhongMaterial({ color: 0x6b3a1a });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(-2, 4, 1);
    scene.add(book);
    floatingObjects.push({ mesh: book, speed: 0.7, radius: 0.8, phase: 0 });

    // Book 2
    const book2 = new THREE.Mesh(bookGeo.clone(), new THREE.MeshPhongMaterial({ color: 0x2a1a40 }));
    book2.position.set(2.5, 3, -1);
    scene.add(book2);
    floatingObjects.push({ mesh: book2, speed: 0.5, radius: 1, phase: 1 });

    // Gear
    const gearGeo = new THREE.TorusGeometry(0.5, 0.08, 6, 20);
    const gearMat = new THREE.MeshPhongMaterial({ color: 0xd4a853, shininess: 80 });
    const gear = new THREE.Mesh(gearGeo, gearMat);
    gear.position.set(-3, 5, -1);
    scene.add(gear);
    floatingObjects.push({ mesh: gear, speed: 0.9, radius: 0.6, phase: 2 });

    // Gear 2
    const gear2 = new THREE.Mesh(gearGeo.clone(), gearMat.clone());
    gear2.position.set(3, 6, -3);
    gear2.scale.set(0.7, 0.7, 0.7);
    scene.add(gear2);
    floatingObjects.push({ mesh: gear2, speed: 1.2, radius: 0.5, phase: 3 });

    // Furniture piece (table-like)
    const tableGeo = new THREE.BoxGeometry(1.2, 0.08, 0.6);
    const tableMat = new THREE.MeshPhongMaterial({ color: 0x3a2010 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(1.5, 5.5, 1);
    scene.add(table);
    floatingObjects.push({ mesh: table, speed: 0.4, radius: 1.2, phase: 4 });

    // Parchment (thin plane)
    const parchGeo = new THREE.PlaneGeometry(0.8, 1);
    const parchMat = new THREE.MeshPhongMaterial({
        color: 0xf0dcc0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
    });
    const parchment = new THREE.Mesh(parchGeo, parchMat);
    parchment.position.set(-1.5, 6, 0);
    scene.add(parchment);
    floatingObjects.push({ mesh: parchment, speed: 0.6, radius: 0.9, phase: 5 });

    // Small sphere (representing orb/candle light)
    const orbGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xffeaad });
    for (let i = 0; i < 8; i++) {
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(
            (Math.random() - 0.5) * 8,
            Math.random() * 6 + 1,
            (Math.random() - 0.5) * 6
        );
        scene.add(orb);
        floatingObjects.push({ mesh: orb, speed: 0.3 + Math.random() * 0.5, radius: 0.3 + Math.random() * 0.5, phase: Math.random() * 6 });
    }

    // ── Particle Trails ──
    const trailCount = 200;
    const trailPositions = new Float32Array(trailCount * 3);
    for (let i = 0; i < trailCount * 3; i += 3) {
        trailPositions[i] = (Math.random() - 0.5) * 10;
        trailPositions[i + 1] = Math.random() * 10;
        trailPositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
        color: 0xd4a853,
        size: 0.05,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true
    });
    const trails = new THREE.Points(trailGeo, trailMat);
    scene.add(trails);

    // ── Animation ──
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        // Levitate figure
        figureGroup.position.y = 3 + Math.sin(time * 0.8) * 0.5;
        figureGroup.rotation.y = Math.sin(time * 0.3) * 0.2;
        cape.rotation.x = Math.PI + Math.sin(time * 1.5) * 0.1;

        // Float objects
        floatingObjects.forEach(obj => {
            obj.mesh.position.y += Math.sin(time * obj.speed + obj.phase) * 0.005;
            obj.mesh.rotation.x += 0.005 * obj.speed;
            obj.mesh.rotation.y += 0.008 * obj.speed;
            obj.mesh.rotation.z += 0.003 * obj.speed;
        });

        // Trail particles drift upward
        const tArr = trails.geometry.attributes.position.array;
        for (let i = 1; i < tArr.length; i += 3) {
            tArr[i] += 0.005;
            if (tArr[i] > 10) tArr[i] = -1;
        }
        trails.geometry.attributes.position.needsUpdate = true;

        // Subtle camera sway
        camera.position.x = Math.sin(time * 0.2) * 0.3;
        camera.position.y = 2 + Math.sin(time * 0.15) * 0.2;
        camera.lookAt(0, 3, -2);

        // Animate lights
        pointLight1.position.x = -5 + Math.sin(time * 0.5) * 2;
        pointLight2.position.x = 5 + Math.cos(time * 0.5) * 2;

        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        }
    });
    resizeObserver.observe(container);
}
