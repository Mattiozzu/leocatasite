import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// DOM Content Loaded wrapper removed because type="module" is deferred automatically
// --- EXISTING LOGIC ---

// Loading Screen Logic
const loader = document.getElementById('loader');
const canvasContainer = document.getElementById('canvas-container');

// Simulate a minimum time or wait for load
// We modify this to also trigger the 3D element appearance
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loader) {
            loader.classList.add('loader-hidden');
        }
        if (canvasContainer) {
            canvasContainer.classList.add('canvas-visible');
        }
    }, 1500); // 1.5s delay
});

const gridContainer = document.getElementById('grid-container');
const cellSize = 74;

function createGrid() {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    const width = window.innerWidth;
    const height = window.innerHeight;

    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    gridContainer.style.setProperty('--cols', cols);
    gridContainer.style.setProperty('--rows', rows);

    // Grid storage
    const gridMap = [];

    for (let r = 0; r < rows; r++) {
        const rowArr = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.innerHTML = `
                    <svg width="74" height="74" viewBox="0 0 74 74" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="0,0 74,0 37,37" class="triangle" data-type="0" data-r="${r}" data-c="${c}"></polygon>
                        <polygon points="74,0 74,74 37,37" class="triangle" data-type="1" data-r="${r}" data-c="${c}"></polygon>
                        <polygon points="74,74 0,74 37,37" class="triangle" data-type="2" data-r="${r}" data-c="${c}"></polygon>
                        <polygon points="0,74 0,0 37,37" class="triangle" data-type="3" data-r="${r}" data-c="${c}"></polygon>
                    </svg>
                `;
            gridContainer.appendChild(cell);

            const polys = cell.querySelectorAll('.triangle');
            rowArr.push([polys[0], polys[1], polys[2], polys[3]]);
        }
        gridMap.push(rowArr);
    }

    gridContainer.querySelectorAll('.triangle').forEach(poly => {
        poly.addEventListener('mouseenter', (e) => {
            const target = e.target;
            const r = parseInt(target.getAttribute('data-r'));
            const c = parseInt(target.getAttribute('data-c'));
            const t = parseInt(target.getAttribute('data-type'));
            highlight(r, c, t);
        });
    });

    function highlight(r, c, t) {
        const activate = (elem, className) => {
            if (!elem) return;
            elem.classList.remove('glow-weak');
            elem.classList.add(className);
            setTimeout(() => {
                elem.classList.remove(className);
            }, 50);
        };

        function getPoly(r, c, t) {
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                return gridMap[r][c][t];
            }
            return null;
        }

        const neighbors = [];
        // Internal
        if (t === 0) neighbors.push(getPoly(r, c, 3), getPoly(r, c, 1));
        if (t === 1) neighbors.push(getPoly(r, c, 0), getPoly(r, c, 2));
        if (t === 2) neighbors.push(getPoly(r, c, 1), getPoly(r, c, 3));
        if (t === 3) neighbors.push(getPoly(r, c, 2), getPoly(r, c, 0));
        // External
        if (t === 0) neighbors.push(getPoly(r - 1, c, 2));
        if (t === 1) neighbors.push(getPoly(r, c + 1, 3));
        if (t === 2) neighbors.push(getPoly(r + 1, c, 0));
        if (t === 3) neighbors.push(getPoly(r, c - 1, 1));

        neighbors.forEach(n => activate(n, 'glow-weak'));
    }
}

createGrid();

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        createGrid();
        onWindowResize(); // Three.js resize
    }, 200);
});

// Scroll Interaction Logic
const aboutSection = document.getElementById('about');
const heroSection = document.getElementById('hero');
// canvasContainer is already defined at the top of DOMContentLoaded

let isScrolled = false;

// Scroll Listener for Navbar Transition
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    if (scrolled !== isScrolled) {
        isScrolled = scrolled;
        updateModelTargets(); // Function defined below in Three.js section
        updateColorOnScroll(); // Change color/material
    }
});

const observerOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Logic for About Section Animation
        if (entry.target.id === 'about') {
            if (entry.isIntersecting) {
                aboutSection.classList.add('about-visible');
            } else {
                if (entry.boundingClientRect.y > 0) {
                    aboutSection.classList.remove('about-visible');
                }
            }
        }
        // Hero Logic: Ensure model is visible if we are near top, but we don't hide it anymore
        else if (entry.target.id === 'hero') {
            if (entry.isIntersecting && canvasContainer && document.getElementById('loader').classList.contains('loader-hidden')) {
                canvasContainer.classList.add('canvas-visible');
            }
        }
    });
}, observerOptions);

if (aboutSection) {
    observer.observe(aboutSection);
}
if (heroSection) {
    observer.observe(heroSection);
}

// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = themeToggleBtn.querySelector('.sun-icon');
const moonIcon = themeToggleBtn.querySelector('.moon-icon');

// Hamburger Menu Logic
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');

        // Hamburger Animation (CSS Class)
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            // Reset hamburger animation
            hamburger.classList.remove('active');
        });
    });
}
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    htmlElement.setAttribute('data-theme', 'light');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
}

themeToggleBtn.addEventListener('click', () => {
    if (htmlElement.getAttribute('data-theme') === 'light') {
        htmlElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        updateLights('dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        updateLights('light');
    }
});


// --- THREE.JS LOGIC ---
let scene, camera, renderer, model;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const clock = new THREE.Clock();

// Target States for Animation
let targetPos = new THREE.Vector3(0, 0.6, 0);
let targetScale = new THREE.Vector3(0.65, 0.65, 0.65);

function updateModelTargets() {
    if (!camera) return;
    const isMobile = window.innerWidth < 768;

    // Base Scale
    // Hero Scale: Requested to be "Giant" like the previous text (24vw).
    // A scale of ~2.2 should cover a good chunk of the screen.
    const heroScaleVal = isMobile ? 0.9 : 2.2;
    const navScaleVal = isMobile ? 0.14 : 0.25; // Small for navbar

    if (!isScrolled) {
        // Hero Mode
        targetPos.set(0, isMobile ? 0.0 : 0.0, 0); // Center
        targetScale.set(heroScaleVal, heroScaleVal, heroScaleVal);
    } else {
        // Nav Mode (Top Left)
        // Calculate screen top-left (-x, +y) in world space at z=0
        const zDist = Math.abs(camera.position.z);
        const vFOV = camera.fov * Math.PI / 180;
        const visibleHeight = 2 * Math.tan(vFOV / 2) * zDist;
        const visibleWidth = visibleHeight * camera.aspect;

        // Margins (adjust to align with CSS padding)
        // CSS Pad is 3rem (approx 48px). 
        // We need to experiment, but let's try 0.9 width ratio offset
        const xOffset = (visibleWidth / 2) - (isMobile ? 0.5 : 1.2);
        // Push higher: Reduce the offset from the top edge
        const yOffset = (visibleHeight / 2) - (isMobile ? 0.35 : 0.5);

        targetPos.set(-xOffset, yOffset, 0);
        targetScale.set(navScaleVal, navScaleVal, navScaleVal);
    }
}

function updateColorOnScroll() {
    if (!model) return;
    const isMobile = window.innerWidth < 768;
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const modelColor = currentTheme === 'light' ? 0x00F2FF : 0xa6ff00;

    // If Scrolled -> Force White Simple Material
    // If Not Scrolled -> Use Hero Material (Iridescent on desktop)
    const useWhileMaterial = isScrolled;

    model.traverse((node) => {
        if (node.isMesh) {
            const oldMat = node.material;
            if (useWhileMaterial) {
                // Navbar Mode: Plain White ( Matte / Slightly Glossy )
                node.material = new THREE.MeshStandardMaterial({
                    color: modelColor,
                    metalness: 1,
                    roughness: 0.0,
                    side: THREE.DoubleSide
                });
            } else {
                // Hero Mode
                if (!isMobile) {
                    // Desktop: Iridescent Mirror
                    node.material = new THREE.MeshPhysicalMaterial({
                        color: modelColor,
                        metalness: 1.0,
                        roughness: 0.0,
                        iridescence: 1.0,
                        iridescenceIOR: 2.2,
                        iridescenceThicknessRange: [100, 800],
                        clearcoat: 1.0,
                        side: THREE.DoubleSide
                    });
                } else {
                    // Mobile: Standard Simple
                    node.material = new THREE.MeshStandardMaterial({
                        color: modelColor,
                        roughness: 0,
                        metalness: 1,
                        emissive: 0x111111,
                        side: THREE.DoubleSide
                    });
                }
            }
            if (oldMat) oldMat.dispose();
        }
    });

    // If not white mode, we might need to update lights for the theme.
    // If white mode, lights should be sufficient.
    updateLights(currentTheme);
}

function updateModelMaterial(targetModel, isMobileMode) {
    if (!targetModel) return;
    targetModel.userData.isMobile = isMobileMode;
    // Delegate to the main update function which checks scroll state too
    updateColorOnScroll();
}

function init3D() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Limit pixel ratio to max 1.5 for performance on high-DPI mobile screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better colors for PBR
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // Environment for PBR (Critical for Iridescence/Glass)
    // Must be done AFTER renderer is created
    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(2, 0, 5);
    scene.add(dirLight);

    // Store lights
    scene.userData.ambient = ambientLight;
    scene.userData.directional = dirLight;

    // Load Model
    const loader = new GLTFLoader();
    loader.load(
        'leocatas.glb',
        (gltf) => {
            const object = gltf.scene;

            // 1. Center Object Geometry inside a Wrapper
            // This ensures rotation/position happens around the visual center
            // Calculate bounding box of the raw object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());

            // Move object so its center aligns with (0,0,0)
            object.position.x = -center.x;
            object.position.y = -center.y;
            object.position.z = -center.z;

            // Create wrapper
            const wrapper = new THREE.Group();
            wrapper.add(object);

            // Update global model reference to point to the wrapper
            model = wrapper;

            // Scale/Position: Initialize from targets
            updateModelTargets();
            model.scale.copy(targetScale);
            model.position.copy(targetPos);

            const isMobile = window.innerWidth < 768;
            // Apply Initial Material
            updateModelMaterial(model, isMobile);

            scene.add(model);
        },
        undefined,
        (error) => {
            console.error('An error occurred loading the model:', error);
        }
    );

    document.addEventListener('mousemove', onDocumentMouseMove);

    let currentTheme = localStorage.getItem('theme') || 'dark';
    updateLights(currentTheme);

    animate();
}

function updateLights(theme) {
    if (!scene) return;

    const modelColor = theme === 'light' ? 0x00F2FF : 0xa6ff00;

    // Update Model Color (Dark Mode = White, Light Mode = Dark)
    if (typeof model !== 'undefined' && model) {
        model.traverse((node) => {
            if (node.isMesh && node.material) {
                node.material.color.setHex(modelColor);
            }
        });
    }

    const ambient = scene.userData.ambient;
    const directional = scene.userData.directional;

    // Boost lights for chrome material (needs strong light to reflect)
    if (theme === 'light') {
        if (ambient) ambient.intensity = 3.0; // More diffused
        if (directional) directional.intensity = 2.0; // Less harsh direct
    } else {
        if (ambient) ambient.intensity = 2.0; // More diffused
        if (directional) directional.intensity = 1.0; // Less harsh direct
    }
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 200;
    mouseY = (event.clientY - windowHalfY) / 200;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const isMobile = window.innerWidth < 768;
    updateModelTargets(); // Calculate new targets

    if (model) {
        // Update material if device mode changed
        if (model.userData.isMobile !== isMobile) {
            updateModelMaterial(model, isMobile);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getElapsedTime();

    if (model) {
        // Smooth Interpolation
        model.position.lerp(targetPos, 0.05);
        model.scale.lerp(targetScale, 0.05);

        // 1. Floating Effect
        // STOP float when in navbar (0.0). Normal float otherwise (0.02 - Reduced).
        const floatAmp = isScrolled ? 0.0 : 0.02;
        const baseY = model.position.y; // This is the lerped position

        // Only apply sine wave if floating is enabled
        if (floatAmp > 0) {
            model.position.y = baseY + Math.sin(delta * 0.8) * floatAmp;
        }

        // 2. Idle Sway
        const tiltX = Math.sin(delta * 0.3) * 0.03;
        const tiltZ = Math.cos(delta * 0.2) * 0.03;

        // 3. Mouse Interaction
        const interactionStrength = isScrolled ? 0.02 : 0.08;
        const targetRotY = mouseX * interactionStrength;
        const targetRotX = mouseY * interactionStrength + tiltX;

        model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, targetRotY, 0.02);
        model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, targetRotX, 0.02);
        model.rotation.z = THREE.MathUtils.lerp(model.rotation.z, tiltZ, 0.02);
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}


// --- HORIZONTAL SCROLL LOGIC (WORKS & PHASES) ---
const worksSection = document.querySelector('.horizontal-section');
const worksTrack = document.querySelector('.scroll-track');

const phasesSection = document.querySelector('.phases-horizontal-section');
const phasesTrack = document.querySelector('.phases-track');

// Shared configs
const skewStrength = 0.25;
let worksCurrentScroll = 0;
let phasesCurrentScroll = 0;

function animateHorizontalScrolls() {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // --- WORKS SECTION ---
    if (worksSection && worksTrack) {
        const sectTop = worksSection.offsetTop;
        const sectHeight = worksSection.offsetHeight;

        // Scroll Progress
        const rawScroll = window.scrollY - sectTop;
        const maxScroll = sectHeight - windowHeight;
        let progress = Math.max(0, Math.min(rawScroll / maxScroll, 1));

        // Translation
        const trackWidth = worksTrack.scrollWidth;
        const moveAmount = trackWidth - windowWidth + (windowWidth * 0.1);
        const targetTranslate = -progress * moveAmount;

        // Skew
        const velocity = targetTranslate - worksCurrentScroll;
        worksCurrentScroll = targetTranslate; // Simple update for velocity calc

        let skew = Math.max(-10, Math.min(velocity * skewStrength, 10));

        worksTrack.style.transform = `translate3d(${targetTranslate}px, 0, 0) skewX(${skew}deg)`;
    }

    // --- PHASES SECTION ---
    if (phasesSection && phasesTrack) {
        const sectTop = phasesSection.offsetTop;
        const sectHeight = phasesSection.offsetHeight;

        const rawScroll = window.scrollY - sectTop;
        const maxScroll = sectHeight - windowHeight;
        let progress = Math.max(0, Math.min(rawScroll / maxScroll, 1));

        const trackWidth = phasesTrack.scrollWidth;
        const moveAmount = trackWidth - windowWidth + (windowWidth * 0.1);
        const targetTranslate = -progress * moveAmount;

        const velocity = targetTranslate - phasesCurrentScroll;
        phasesCurrentScroll = targetTranslate;
        let skew = Math.max(-10, Math.min(velocity * skewStrength, 10));

        phasesTrack.style.transform = `translate3d(${targetTranslate}px, 0, 0) skewX(${skew}deg)`;
    }

    requestAnimationFrame(animateHorizontalScrolls);
}

animateHorizontalScrolls();

// 3D Model initialization remains
if (typeof init3D === 'function') init3D();

// --- SERVICE INTERACTION ---
function toggleRequestText(textId) {
    const textElement = document.getElementById(textId);
    if (textElement) {
        textElement.style.opacity = (textElement.style.opacity === '1' ? '0' : '1');
    }
}
window.toggleRequestText = toggleRequestText;
