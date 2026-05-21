/* ==========================================
   SYSTEMS LOADING & INITIALIZATION SEQUENCE
   ========================================== */
const loaderTerminal = document.getElementById('loader-term');
const loader = document.getElementById('loader');

const bootLogs = [
  "> INITIALIZING COGNITIVE HUD SYSTEMS...",
  "> LOADING PCB SCHEMATIC MATRIX...",
  "> ALIGNING OPTICAL SENSOR PORTALS...",
  "> MOUNTING ESP32 TRANSLATOR KERNEL...",
  "> BOOTING AUTOMATION LOGISTICS PANEL...",
  "> CONNECTING CYBERNETIC CORES...",
  "> [SUCCESS] SYSTEMS ONLINE. WELCOME SUJAY."
];

let logIndex = 0;
const printBootLogs = setInterval(() => {
  if (logIndex < bootLogs.length) {
    loaderTerminal.textContent = bootLogs[logIndex];
    logIndex++;
  } else {
    clearInterval(printBootLogs);
  }
}, 300);

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('loaded');
    // Start typewriter triggers and canvas after boot
    initCanvas();
    initTypewriterObserver();
    initSkillObserver();
  }, 2200);
});

/* ==========================================
   INTERACTIVE CIRCUIT CANVAS (PCB TRANSISTORS)
   ========================================== */
const canvas = document.getElementById('hud-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;

const mouse = {
  x: null,
  y: null,
  radius: 150
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.baseSpeedX = Math.random() * 0.6 - 0.3;
    this.baseSpeedY = Math.random() * 0.6 - 0.3;
    this.speedX = this.baseSpeedX;
    this.speedY = this.baseSpeedY;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off screen limits
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    // Mouse interactive repulsion (subtle HUD ripple)
    if (mouse.x != null && mouse.y != null) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        let force = (mouse.radius - dist) / mouse.radius;
        let directionX = dx / dist;
        let directionY = dy / dist;
        this.x += directionX * force * 2;
        this.y += directionY * force * 2;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#00f0ff';
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  }
}

function initCanvas() {
  resizeCanvas();
  particles = [];
  let numParticles = Math.floor((canvas.width * canvas.height) / 18000);
  numParticles = Math.min(numParticles, 120); // Cap for performance
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
  }
  animateCanvas();
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Connect close PCB nodes
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        let opacity = (100 - dist) / 100 * 0.15;
        ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }

  animationFrameId = requestAnimationFrame(animateCanvas);
}

/* ==========================================
   CURSOR GLOW TRACER (ELASTIC NEON RING)
   ========================================== */
const cursorRing = document.getElementById('cursor-ring');
const cursorDot = document.getElementById('cursor-dot');

let ringX = 0, ringY = 0;
let dotX = 0, dotY = 0;

window.addEventListener('mousemove', (e) => {
  dotX = e.clientX;
  dotY = e.clientY;
  
  cursorDot.style.left = `${dotX}px`;
  cursorDot.style.top = `${dotY}px`;
});

// Elastic delay on the ring tracer
function updateRingCursor() {
  let dx = dotX - ringX;
  let dy = dotY - ringY;
  
  ringX += dx * 0.15;
  ringY += dy * 0.15;
  
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;
  
  requestAnimationFrame(updateRingCursor);
}
updateRingCursor();

// Active hover states
document.querySelectorAll('a, button, .project-card, .award-item, .hex-item, .form-input').forEach(item => {
  item.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  item.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

/* ==========================================
   NAVBAR AUTO-HIDE & INTERSECTION snap tracker
   ========================================== */
let lastScrollY = window.scrollY;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.innerWidth > 1024) {
    if (window.scrollY > lastScrollY) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
  }
  lastScrollY = window.scrollY;
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navLinksContainer = document.querySelector('.nav-links');

mobileToggle.addEventListener('click', () => {
  navLinksContainer.style.display = navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
  if (navLinksContainer.style.display === 'flex') {
    navLinksContainer.style.flexDirection = 'column';
    navLinksContainer.style.position = 'absolute';
    navLinksContainer.style.top = '70px';
    navLinksContainer.style.left = '0';
    navLinksContainer.style.width = '100%';
    navLinksContainer.style.background = 'var(--bg-secondary)';
    navLinksContainer.style.padding = '20px';
    navLinksContainer.style.borderBottom = '1px solid var(--neon-cyan)';
  }
});

/* ==========================================
   TYPEWRITER EFFECT VIA INTERSECTION OBSERVER
   ========================================== */
function initTypewriterObserver() {
  const elements = document.querySelectorAll('.typewriter-effect');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const fullText = el.getAttribute('data-text');
        el.textContent = '';
        el.classList.add('typing');
        
        let index = 0;
        const typeSpeed = 25; // ms per char
        
        function type() {
          if (index < fullText.length) {
            el.textContent += fullText.charAt(index);
            index++;
            setTimeout(type, typeSpeed);
          } else {
            el.classList.remove('typing');
          }
        }
        type();
        observer.unobserve(el); // Type only once
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================
   SKILL PROGRESS PROGRESSION OBSERVER
   ========================================== */
function initSkillObserver() {
  const skills = document.querySelectorAll('.skill-meter');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const meter = entry.target;
        const targetPercent = meter.getAttribute('data-percent');
        meter.style.width = `${targetPercent}%`;
        observer.unobserve(meter);
      }
    });
  }, { threshold: 0.3 });

  skills.forEach(s => observer.observe(s));
}

/* ==========================================
   SCROLL snaps / SECTIONS EXIT SCALE DOWN EFFECT
   ========================================== */
const sections = document.querySelectorAll('.snap-section, .newspaper-section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const secId = entry.target.id;
    const activeLink = document.querySelector(`.nav-link[data-sec="${secId}"]`);

    if (entry.isIntersecting) {
      // Scale up / remove fade on active section
      entry.target.classList.remove('fade-away');
      
      // Update Navbar link state
      navLinks.forEach(link => link.classList.remove('active'));
      if (activeLink) activeLink.classList.add('active');
    } else {
      // Fade out previous section as it leaves
      if (entry.boundingClientRect.y < 0) { // Scrolling down exit
        entry.target.classList.add('fade-away');
      }
    }
  });
}, { threshold: 0.25 });

sections.forEach(sec => sectionObserver.observe(sec));

// Smooth Navigation Click Routing
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetSecId = link.getAttribute('data-sec');
    const targetSec = document.getElementById(targetSecId);
    
    if (targetSec) {
      targetSec.scrollIntoView({ behavior: 'smooth' });
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

// CTA buttons navigation click
document.getElementById('btn-view-projects').addEventListener('click', () => {
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('btn-engage-uplink').addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

/* ==========================================
   AWARDS INTERACTIVE VIEWPORT CONTROLLER
   ========================================== */
const awardItems = document.querySelectorAll('.award-item');
const awardWrappers = document.querySelectorAll('.awards-image-wrapper');
const awardHudCat = document.getElementById('award-hud-cat');
const awardHudTitle = document.getElementById('award-hud-title');

const awardMetadata = [
  { cat: "State Level Championship", title: "Robofest 5.0 Grand Winner" },
  { cat: "Consecutive State Victory", title: "Robofest 4.0 Winner" },
  { cat: "State Robotics Breakthrough", title: "Robofest 3.0 Champion" },
  { cat: "Combat Robotics Arena", title: "LD College Robo War 2nd Prize" },
  { cat: "Autonomous Rover Pathfinder", title: "Adani Drobotics 1st Prize" }
];

function activateAward(index) {
  awardItems.forEach(item => item.classList.remove('active'));
  awardWrappers.forEach(wrap => wrap.classList.remove('active'));
  
  awardItems[index].classList.add('active');
  const activeWrapper = document.querySelector(`.awards-image-wrapper[data-index="${index}"]`);
  if (activeWrapper) activeWrapper.classList.add('active');
  
  awardHudCat.textContent = awardMetadata[index].cat;
  awardHudTitle.textContent = awardMetadata[index].title;
}

awardItems.forEach(item => {
  item.addEventListener('click', () => {
    const idx = parseInt(item.getAttribute('data-index'));
    activateAward(idx);
    resetAutoCycle();
  });
});

// Automatic looping interval cycle for the snapping portal
let autoCycleInterval = setInterval(cycleAwards, 4500);
let currentAwardIndex = 0;

function cycleAwards() {
  currentAwardIndex = (currentAwardIndex + 1) % awardMetadata.length;
  activateAward(currentAwardIndex);
}

function resetAutoCycle() {
  clearInterval(autoCycleInterval);
  autoCycleInterval = setInterval(cycleAwards, 6000); // Resume slow cycle
}

// Pause cycle on hover
const awardsContainer = document.querySelector('.awards-container');
awardsContainer.addEventListener('mouseenter', () => clearInterval(autoCycleInterval));
awardsContainer.addEventListener('mouseleave', () => autoCycleInterval = setInterval(cycleAwards, 4500));

/* ==========================================
   CUSTOM HUD NATIVE VIDEO PLAYER
   ========================================== */
const video = document.getElementById('hud-video');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const videoContainer = document.getElementById('video-container');

playPauseBtn.addEventListener('click', toggleVideo);
video.addEventListener('click', toggleVideo);

function toggleVideo() {
  if (video.paused) {
    video.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    cursorDot.style.boxShadow = '0 0 12px #05ffc4'; // Green HUD blink when playing
  } else {
    video.pause();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
}

video.addEventListener('timeupdate', () => {
  const percent = (video.currentTime / video.duration) * 100;
  progressFill.style.width = `${percent}%`;
});

// Scrubber seeking click support
progressBar.addEventListener('click', (e) => {
  const scrubTime = (e.offsetX / progressBar.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
});

// IntersectObserver to auto-play/pause local video when visible (performant UX)
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      video.pause();
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  });
}, { threshold: 0.1 });
videoObserver.observe(videoContainer);

/* ==========================================
   CONTACT SECURE TERMINAL FEED LOGGER
   ========================================== */
const contactForm = document.getElementById('uplink-form');
const terminalFeed = document.getElementById('terminal-feed');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('form-name').value;
  const email = document.getElementById('form-email').value;
  
  terminalFeed.innerHTML = "";
  
  const transmissionLogs = [
    `> INITIALIZING SECURE REDIRECT PORTAL...`,
    `> SHIELD HANDSHAKE IN PROGRESS... [SHA-256 ENCRYP]`,
    `> UPLINKING METADATA FROM OPERATOR: ${name.toUpperCase()}`,
    `> ROUTING ENVELOPE TARGET: sujaypatel07@gmail.com`,
    `> INJECTING DATA PAYLOAD PACKETS...`,
    `> [SUCCESS] ROUTED SIGNAL SUCCESSFULLY.`,
    `> [ACK] TRANSLATED UPLINK COMPLETED. SYSTEMS STABLE.`
  ];
  
  let i = 0;
  function printLog() {
    if (i < transmissionLogs.length) {
      terminalFeed.innerHTML += `${transmissionLogs[i]}<br>`;
      terminalFeed.scrollTop = terminalFeed.scrollHeight;
      i++;
      setTimeout(printLog, 400);
    } else {
      // Clear inputs
      document.getElementById('form-name').value = "";
      document.getElementById('form-email').value = "";
      document.getElementById('form-message').value = "";
    }
  }
  
  printLog();
});
