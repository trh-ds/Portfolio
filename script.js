// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loader
    initLoader();

    // Initialize Three.js scene
    initThreeJS();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize navigation
    initNavigation();

    initCustomCursor();
});

// Loader functionality
function initLoader() {
    const loader = document.querySelector('.loader');
    const progress = document.querySelector('.loader-progress');

    // Simulate loading progress
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            // Hide loader after a short delay
            setTimeout(() => {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loader.style.display = 'none';
                        // Animate hero section elements
                        animateHero();
                    }
                });
            }, 500);
        } else {
            width += Math.random() * 10;
            if (width > 100) width = 100;
            progress.style.width = width + '%';
        }
    }, 200);
}

// Animate hero section
function animateHero() {
    const timeline = gsap.timeline();

    timeline.from('.hero h1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
        .from('.hero p', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.hero .btn', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5');
}


// Initialize scroll animations with GSAP
function initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    });

    // Animate About section
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-image',
            start: "top 80%",
        },
        opacity: 0,
        x: -100,
        duration: 1
    });

    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-text',
            start: "top 80%",
        },
        opacity: 0,
        x: 100,
        duration: 1
    });

    // Animate skill cards
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.1
        });
    });

    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.2
        });
    });

    // Animate contact form and info
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: "top 80%",
        },
        opacity: 0,
        x: -100,
        duration: 1
    });

    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: "top 80%",
        },
        opacity: 0,
        x: 100,
        duration: 1
    });
}

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('nav');
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Show/hide navigation background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
        });
    });

    // Smooth scroll to sections
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}


function initThreeJS() {
    const container = document.getElementById('canvas-container');

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create geometry
    const torusGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);

    // Create material
    const material = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.7,
        roughness: 0.2,
        wireframe: true
    });

    // Create mesh
    const torus = new THREE.Mesh(torusGeometry, material);
    scene.add(torus);

    // Create lights
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // ✨ Create floating glow particles
    const particleCount = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 10; // Spread around torus
    }

    particleGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth mouse movement
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        torus.rotation.y += 0.005;
        torus.rotation.x += 0.01;

        // Apply mouse movement to torus rotation
        torus.rotation.y += 0.5 * (targetX - torus.rotation.y);
        torus.rotation.x += 0.5 * (targetY - torus.rotation.x);

        // Animate particles slowly
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0005;

        renderer.render(scene, camera);
    }

    animate();
}

// Form submission handling
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Validate form (simple validation)
    if (name && email && message) {
        // In a real scenario, you would send this data to a server
        console.log('Form submitted:', { name, email, message });

        // Reset form
        this.reset();

        // Show success message (you would implement this)
        alert('Message sent successfully!');
    } else {
        alert('Please fill in all fields');
    }
});


// Custom cursor functionality to add to your script.js
function initCustomCursor() {
    // Select existing cursor elements
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');

    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        // Outer cursor follows slowly (trailing effect)
        gsap.to(cursorOuter, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: "power2.out"
        });

        // Inner cursor follows immediately
        gsap.to(cursorInner, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .burger');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOuter.classList.add('cursor-hover');
            cursorInner.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            cursorOuter.classList.remove('cursor-hover');
            cursorInner.classList.remove('cursor-hover');
        });
    });

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Handle cursor leaving/entering window
    document.addEventListener('mouseout', () => {
        cursorOuter.style.opacity = '0';
        cursorInner.style.opacity = '0';
    });

    document.addEventListener('mouseover', () => {
        cursorOuter.style.opacity = '1';
        cursorInner.style.opacity = '1';
    });

    // Click animation
    document.addEventListener('mousedown', () => {
        cursorOuter.classList.add('cursor-click');
        cursorInner.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
        cursorOuter.classList.remove('cursor-click');
        cursorInner.classList.remove('cursor-click');
    });
}

// Make sure to initialize after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initCustomCursor();
});


const scriptURL = "https://script.google.com/macros/s/AKfycbykSO2ajTfOBFxrzYNX2xqLlwHwLKYFWZFvk_7i-defywgfrbjxdyUEpUaIduWbDu_x/exec"; // Replace with your actual script URL

document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch(scriptURL, {
        method: "POST",
        mode: "no-cors", // bypass CORS issue
        body: formData
    })
        .then(() => {
            document.getElementById("response-msg").textContent = "Message sent successfully!";
            form.reset();
        })
        .catch(() => {
            document.getElementById("response-msg").textContent = "Something went wrong. Try again.";
        });
});
