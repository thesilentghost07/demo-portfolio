/* ═══════════════════════════════════════════════════════════
   VBHAV MAURYA — PORTFOLIO MAIN SCRIPT
   Three.js 3D Scene + Interactions + Animations
   ═══════════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ─── Preloader ───
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader')?.classList.add('hidden');
  }, 2200);
});

// ─── Three.js Scene ───
class AntigravityScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.container = canvas.parentElement;
    this.clock = new THREE.Clock();
    this.objects = [];
    this.isPlaying = true;
    this.isWireframe = false;
    this.elapsedSeconds = 0;

    this.init();
    this.createScene();
    this.animate();
    this.handleResize();
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 2, 12);
    this.camera.lookAt(0, 0, 0);

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = false;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 1.8;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xF5F0E8, 0.02);
  }

  createScene() {
    // ─── Lighting ───
    const ambientLight = new THREE.AmbientLight(0xFFF8E7, 0.6);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFF5E0, 1.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 30;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xC5A55A, 0.4);
    fillLight.position.set(-5, 3, -3);
    this.scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xD4AF37, 0.8, 20);
    rimLight.position.set(0, 6, -5);
    this.scene.add(rimLight);

    // ─── Materials ───
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xC5A55A,
      metalness: 0.8,
      roughness: 0.2,
    });

    const marbleMaterial = new THREE.MeshStandardMaterial({
      color: 0xF5F0E8,
      metalness: 0.05,
      roughness: 0.3,
    });

    const parchmentMaterial = new THREE.MeshStandardMaterial({
      color: 0xF1E9D2,
      metalness: 0.0,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });

    const bronzeMaterial = new THREE.MeshStandardMaterial({
      color: 0xCD7F32,
      metalness: 0.7,
      roughness: 0.3,
    });

    const espressoMaterial = new THREE.MeshStandardMaterial({
      color: 0x3C2415,
      metalness: 0.1,
      roughness: 0.6,
    });

    // ─── Floor (subtle) ───
    const floorGeo = new THREE.CircleGeometry(8, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xF0EBE0,
      metalness: 0.0,
      roughness: 0.9,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // ─── Marble Columns ───
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const radius = 4;

      // Column shaft
      const columnGeo = new THREE.CylinderGeometry(0.2, 0.25, 4, 16);
      const column = new THREE.Mesh(columnGeo, marbleMaterial.clone());
      column.position.set(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );
      column.castShadow = true;
      this.scene.add(column);

      // Column capital (top ornament)
      const capitalGeo = new THREE.CylinderGeometry(0.35, 0.2, 0.3, 8);
      const capital = new THREE.Mesh(capitalGeo, goldMaterial.clone());
      capital.position.set(
        Math.cos(angle) * radius,
        2.15,
        Math.sin(angle) * radius
      );
      this.scene.add(capital);

      // Column base
      const baseGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.2, 8);
      const base = new THREE.Mesh(baseGeo, goldMaterial.clone());
      base.position.set(
        Math.cos(angle) * radius,
        -2.1,
        Math.sin(angle) * radius
      );
      this.scene.add(base);
    }

    // ─── Floating Golden Gears ───
    const gearPositions = [
      { x: 2, y: 1.5, z: -1, scale: 0.6 },
      { x: -1.5, y: 2.5, z: 1, scale: 0.4 },
      { x: 0.5, y: -0.5, z: 2, scale: 0.5 },
      { x: -2, y: 0.5, z: -2, scale: 0.35 },
    ];
    gearPositions.forEach((pos, i) => {
      const gearGeo = new THREE.TorusGeometry(pos.scale, pos.scale * 0.15, 8, 24);
      const gear = new THREE.Mesh(gearGeo, goldMaterial.clone());
      gear.position.set(pos.x, pos.y, pos.z);
      gear.castShadow = true;

      // Gear teeth (inner ring)
      const innerGeo = new THREE.TorusGeometry(pos.scale * 0.5, pos.scale * 0.08, 6, 16);
      const inner = new THREE.Mesh(innerGeo, bronzeMaterial.clone());
      inner.position.copy(gear.position);

      this.scene.add(gear);
      this.scene.add(inner);
      this.objects.push({
        mesh: gear,
        inner: inner,
        type: 'gear',
        baseY: pos.y,
        speed: 0.3 + i * 0.15,
        rotSpeed: 0.5 + i * 0.2,
        phase: i * 1.5,
        orbitRadius: 0.8 + i * 0.3,
        orbitAngle: i * (Math.PI / 2),
      });
    });

    // ─── Floating Parchment Sheets ───
    const parchmentPositions = [
      { x: 1, y: 1, z: 1.5 },
      { x: -2.5, y: -0.5, z: 0 },
      { x: 0, y: 2.8, z: -1.5 },
    ];
    parchmentPositions.forEach((pos, i) => {
      const parchGeo = new THREE.PlaneGeometry(1.2, 0.8, 4, 4);
      const parch = new THREE.Mesh(parchGeo, parchmentMaterial.clone());
      parch.position.set(pos.x, pos.y, pos.z);
      parch.rotation.set(
        Math.random() * 0.5,
        Math.random() * Math.PI,
        Math.random() * 0.3
      );
      parch.castShadow = true;
      this.scene.add(parch);
      this.objects.push({
        mesh: parch,
        type: 'parchment',
        baseY: pos.y,
        speed: 0.2 + i * 0.1,
        phase: i * 2,
        rotSpeed: 0.1 + i * 0.05,
      });
    });

    // ─── Structural Beam Elements ───
    const beamPositions = [
      { x: -1, y: 3, z: 0, rx: 0.3, ry: 0.5, rz: 0.2 },
      { x: 2.5, y: -1, z: -1, rx: -0.2, ry: 0.8, rz: -0.1 },
      { x: -3, y: 1.5, z: -2, rx: 0.1, ry: -0.4, rz: 0.6 },
    ];
    beamPositions.forEach((pos, i) => {
      const beamGeo = new THREE.BoxGeometry(2 + i * 0.3, 0.08, 0.15);
      const beam = new THREE.Mesh(beamGeo, espressoMaterial.clone());
      beam.position.set(pos.x, pos.y, pos.z);
      beam.rotation.set(pos.rx, pos.ry, pos.rz);
      beam.castShadow = true;
      this.scene.add(beam);
      this.objects.push({
        mesh: beam,
        type: 'beam',
        baseY: pos.y,
        speed: 0.15 + i * 0.08,
        phase: i * 1.2,
        rotSpeed: 0.05 + i * 0.03,
      });
    });

    // ─── Floating Golden Orbs ───
    const orbPositions = [
      { x: 0, y: 0.5, z: 0, scale: 0.25 },
      { x: 3, y: 2, z: 1, scale: 0.15 },
      { x: -2, y: -1.5, z: 2, scale: 0.2 },
      { x: 1.5, y: 3.5, z: -2, scale: 0.12 },
      { x: -3, y: 0, z: -1, scale: 0.18 },
    ];
    orbPositions.forEach((pos, i) => {
      const orbGeo = new THREE.SphereGeometry(pos.scale, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xC5A55A,
        emissiveIntensity: 0.1,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(pos.x, pos.y, pos.z);
      orb.castShadow = true;
      this.scene.add(orb);
      this.objects.push({
        mesh: orb,
        type: 'orb',
        baseY: pos.y,
        speed: 0.4 + i * 0.12,
        phase: i * 1.1,
        orbitRadius: 0.5 + i * 0.2,
        orbitAngle: i * (Math.PI * 2 / 5),
      });
    });

    // ─── Arched Window Frame (Central) ───
    const archShape = new THREE.Shape();
    archShape.moveTo(-1.2, -1.5);
    archShape.lineTo(-1.2, 0.5);
    archShape.quadraticCurveTo(-1.2, 1.5, 0, 1.5);
    archShape.quadraticCurveTo(1.2, 1.5, 1.2, 0.5);
    archShape.lineTo(1.2, -1.5);
    archShape.lineTo(1.0, -1.5);
    archShape.lineTo(1.0, 0.5);
    archShape.quadraticCurveTo(1.0, 1.3, 0, 1.3);
    archShape.quadraticCurveTo(-1.0, 1.3, -1.0, 0.5);
    archShape.lineTo(-1.0, -1.5);
    archShape.lineTo(-1.2, -1.5);

    const archGeo = new THREE.ExtrudeGeometry(archShape, {
      depth: 0.1,
      bevelEnabled: false,
    });
    const arch = new THREE.Mesh(archGeo, goldMaterial.clone());
    arch.position.set(0, 1, -4.5);
    arch.castShadow = true;
    this.scene.add(arch);
    this.objects.push({
      mesh: arch,
      type: 'arch',
      baseY: 1,
      speed: 0.08,
      phase: 0,
      rotSpeed: 0.02,
    });

    // ─── Light Rays (volumetric feel) ───
    const rayGeo = new THREE.PlaneGeometry(0.3, 6);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xFFF8E7,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    for (let i = 0; i < 3; i++) {
      const ray = new THREE.Mesh(rayGeo, rayMat.clone());
      ray.position.set(-1 + i * 1, 1, -4);
      ray.rotation.z = (i - 1) * 0.1;
      this.scene.add(ray);
    }

    // Store all materials for wireframe toggle
    this.allMaterials = [];
    this.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        this.allMaterials.push(child.material);
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isPlaying) {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();
    this.elapsedSeconds = elapsed;

    // Animate objects
    this.objects.forEach((obj) => {
      const t = elapsed * obj.speed + obj.phase;

      // Floating motion
      obj.mesh.position.y = obj.baseY + Math.sin(t) * 0.4;

      if (obj.type === 'gear') {
        // Gears rotate and orbit
        obj.mesh.rotation.z += delta * obj.rotSpeed;
        obj.mesh.rotation.x += delta * obj.rotSpeed * 0.3;
        if (obj.inner) {
          obj.inner.position.y = obj.mesh.position.y;
          obj.inner.rotation.z -= delta * obj.rotSpeed * 1.5;
          obj.inner.rotation.x -= delta * obj.rotSpeed * 0.5;
        }
        // Subtle orbital drift
        if (obj.orbitRadius) {
          obj.orbitAngle += delta * 0.1;
          obj.mesh.position.x += Math.sin(obj.orbitAngle) * 0.002;
          obj.mesh.position.z += Math.cos(obj.orbitAngle) * 0.002;
          if (obj.inner) {
            obj.inner.position.x = obj.mesh.position.x;
            obj.inner.position.z = obj.mesh.position.z;
          }
        }
      } else if (obj.type === 'parchment') {
        // Parchment gentle rotation
        obj.mesh.rotation.x += delta * obj.rotSpeed * 0.5;
        obj.mesh.rotation.z += delta * obj.rotSpeed * 0.3;
      } else if (obj.type === 'beam') {
        // Beams slow drift
        obj.mesh.rotation.y += delta * obj.rotSpeed;
      } else if (obj.type === 'orb') {
        // Orbs orbit smoothly
        if (obj.orbitRadius) {
          obj.orbitAngle += delta * obj.speed * 0.5;
          obj.mesh.position.x += Math.sin(obj.orbitAngle) * 0.003;
          obj.mesh.position.z += Math.cos(obj.orbitAngle) * 0.003;
        }
      } else if (obj.type === 'arch') {
        // Arch barely sways
        obj.mesh.position.y = obj.baseY + Math.sin(t * 0.5) * 0.15;
      }
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    // Update playhead
    this.updatePlayhead(elapsed);
  }

  updatePlayhead(elapsed) {
    const cycleLength = 30; // 30 second loop
    const progress = (elapsed % cycleLength) / cycleLength;
    const progressEl = document.getElementById('playheadProgress');
    const thumbEl = document.getElementById('playheadThumb');
    const timeEl = document.getElementById('currentTime');

    if (progressEl) progressEl.style.width = `${progress * 100}%`;
    if (thumbEl) thumbEl.style.left = `${progress * 100}%`;
    if (timeEl) {
      const mins = Math.floor(elapsed / 60);
      const secs = Math.floor(elapsed % 60);
      timeEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const playBtn = document.getElementById('playBtn');

    if (this.isPlaying) {
      this.clock.start();
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      playBtn?.querySelector('span')?.replaceWith(
        Object.assign(document.createElement('span'), { textContent: 'PAUSE' })
      );
      playBtn?.classList.add('active');
    } else {
      this.clock.stop();
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      playBtn?.querySelector('span')?.replaceWith(
        Object.assign(document.createElement('span'), { textContent: 'PLAY' })
      );
      playBtn?.classList.remove('active');
    }
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    this.allMaterials.forEach((mat) => {
      mat.wireframe = this.isWireframe;
    });
    const btn = document.getElementById('wireframeBtn');
    btn?.classList.toggle('active', this.isWireframe);
  }

  resetView() {
    this.camera.position.set(0, 2, 12);
    this.camera.lookAt(0, 0, 0);
    this.controls.reset();
  }

  handleResize() {
    const onResize = () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
  }
}

// ─── Initialize Three.js Scene ───
let scene;
const canvas = document.getElementById('three-canvas');
if (canvas) {
  scene = new AntigravityScene(canvas);

  // Button bindings
  document.getElementById('playBtn')?.addEventListener('click', () => {
    scene.togglePlay();
  });
  document.getElementById('wireframeBtn')?.addEventListener('click', () => {
    scene.toggleWireframe();
  });
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    scene.resetView();
  });

  // Start in playing/pause visual state
  scene.togglePlay(); // Start as playing
}

// ─── Scroll Reveal (Intersection Observer) ───
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px',
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach((item) => {
  revealObserver.observe(item);
});

// Observe work cards with staggered delay
document.querySelectorAll('.work-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(40px)';
  card.style.transition = `all 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.15}s`;

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cardObserver.observe(card);
});

// Observe section headers
document.querySelectorAll('.section-header').forEach((header) => {
  header.style.opacity = '0';
  header.style.transform = 'translateY(30px)';
  header.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';

  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });

  headerObserver.observe(header);
});

// ─── 3D Card Tilt Effect ───
document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ─── Smooth Scroll for Navigation ───
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ─── Nav Background on Scroll ───
const nav = document.querySelector('.main-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.style.boxShadow = '0 4px 20px rgba(60, 36, 21, 0.06)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
}

// ─── Contact Icon Glow Animation ───
document.querySelectorAll('.contact-item').forEach((item) => {
  item.addEventListener('mouseenter', () => {
    const icon = item.querySelector('.contact-icon');
    if (icon) {
      icon.style.boxShadow = '0 0 30px rgba(197, 165, 90, 0.5)';
    }
  });
  item.addEventListener('mouseleave', () => {
    const icon = item.querySelector('.contact-icon');
    if (icon) {
      icon.style.boxShadow = 'none';
    }
  });
});

console.log('%c✦ Vbhav Maurya — Portfolio Loaded', 'color: #C5A55A; font-size: 14px; font-weight: bold;');
console.log('%c  Systems initialized. All modules operational.', 'color: #7A5C4F; font-size: 11px;');
