const $ = (selector) => document.querySelector(selector);

// ====== PERSONALISASI CEPAT ======
const CONFIG = {
  name: 'Sayang', // ganti nama di sini
  letterName: 'Sayang',
};

$('#birthdayName').textContent = `${CONFIG.name}!`;
$('#letterName').textContent = CONFIG.letterName;

const USAGI_IMAGES = Array.from(
  { length: 18 },
  (_, index) => `assets/usagi-${String(index + 1).padStart(2, '0')}.png`,
);

// Muat sprite lebih awal agar ledakannya muncul tanpa jeda saat tombol ditekan.
USAGI_IMAGES.forEach((source) => {
  const image = new Image();
  image.src = source;
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealItems = document.querySelectorAll('.reveal');

if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('show'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

// Music: gunakan assets/birthday-song.mp3 bila tersedia.
// Jika tidak ada, tombol memainkan melodi sintetis singkat yang original.
const musicBtn = $('#musicBtn');
const bgMusic = $('#bgMusic');
bgMusic.loop = true;
let synthInterval = null;
let audioContext = null;
let musicPlaying = false;

function beep(frequency, start, duration, volume = 0.035) {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.001, audioContext.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(audioContext.currentTime + start);
  oscillator.stop(audioContext.currentTime + start + duration + 0.04);
}

function playSynthLoop() {
  const notes = [659, 784, 880, 784, 659, 523, 587, 659, 784, 659, 587, 523];
  notes.forEach((note, index) => beep(note, index * 0.18, 0.15));
}

async function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    clearInterval(synthInterval);
    synthInterval = null;
    musicPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.textContent = '♫';
    musicBtn.setAttribute('aria-label', 'Putar musik');
    musicBtn.setAttribute('aria-pressed', 'false');
    return;
  }

  try {
    await bgMusic.play();
  } catch (error) {
    playSynthLoop();
    synthInterval = setInterval(playSynthLoop, 2600);
  }

  musicPlaying = true;
  musicBtn.classList.add('playing');
  musicBtn.textContent = '❚❚';
  musicBtn.setAttribute('aria-label', 'Jeda musik');
  musicBtn.setAttribute('aria-pressed', 'true');
}

musicBtn.addEventListener('click', toggleMusic);

// ====== LEDAKAN & FISIKA USAGI ======
const usagiLayer = $('#usagiLayer');
const effectStatus = $('#effectStatus');
let activeUsagis = [];
let usagiFrame = 0;
let lastUsagiTime = 0;
let launchId = 0;

function easeOutBack(value) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * ((value - 1) ** 3) + c1 * ((value - 1) ** 2);
}

function clearUsagis() {
  cancelAnimationFrame(usagiFrame);
  activeUsagis = [];
  usagiLayer.replaceChildren();
  usagiLayer.classList.remove('calm');
}

function showCalmUsagis() {
  clearUsagis();
  const currentLaunch = ++launchId;
  usagiLayer.classList.add('calm');

  USAGI_IMAGES.forEach((source, index) => {
    const image = document.createElement('img');
    image.className = 'usagi-sprite';
    image.src = source;
    image.alt = '';
    image.draggable = false;
    image.style.animationDelay = `${index * 22}ms`;
    usagiLayer.append(image);
  });

  window.setTimeout(() => {
    if (launchId === currentLaunch) clearUsagis();
  }, 6500);
}

function launchUsagis(originElement) {
  if (reduceMotion.matches) {
    showCalmUsagis();
    return;
  }

  clearUsagis();
  launchId += 1;

  const origin = originElement.getBoundingClientRect();
  const startX = origin.left + origin.width / 2;
  const startY = origin.top + origin.height / 2;
  const isSmallScreen = window.innerWidth < 560;

  activeUsagis = USAGI_IMAGES.map((source, index) => {
    const image = document.createElement('img');
    const size = isSmallScreen ? 70 + Math.random() * 34 : 92 + Math.random() * 58;
    const angle = ((Math.PI * 2) / USAGI_IMAGES.length) * index + (Math.random() - 0.5) * 0.38;
    const speed = (isSmallScreen ? 5.8 : 7.4) + Math.random() * 5;

    image.className = 'usagi-sprite';
    image.src = source;
    image.alt = '';
    image.draggable = false;
    image.style.width = `${size}px`;
    image.style.height = `${size}px`;
    image.style.objectFit = 'contain';
    image.style.opacity = '0';
    usagiLayer.append(image);

    return {
      element: image,
      x: startX - size / 2,
      y: startY - size / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5.4 - Math.random() * 2.8,
      rotation: Math.random() * 80 - 40,
      spin: (Math.random() - 0.5) * 9,
      size,
      age: -index * 0.018,
      lifetime: 8.8 + Math.random() * 1.7,
      bounce: 0.64 + Math.random() * 0.15,
    };
  });

  lastUsagiTime = performance.now();
  usagiFrame = requestAnimationFrame(updateUsagis);
}

function updateUsagis(now) {
  const frameScale = Math.min((now - lastUsagiTime) / 16.667, 2.2);
  const seconds = frameScale / 60;
  lastUsagiTime = now;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const edge = 4;

  activeUsagis.forEach((usagi) => {
    usagi.age += seconds;
    if (usagi.age < 0) return;

    usagi.vy += 0.24 * frameScale;
    usagi.x += usagi.vx * frameScale;
    usagi.y += usagi.vy * frameScale;
    usagi.rotation += usagi.spin * frameScale;

    if (usagi.x <= edge) {
      usagi.x = edge;
      usagi.vx = Math.abs(usagi.vx) * 0.86;
      usagi.spin *= -0.82;
    } else if (usagi.x + usagi.size >= width - edge) {
      usagi.x = width - usagi.size - edge;
      usagi.vx = -Math.abs(usagi.vx) * 0.86;
      usagi.spin *= -0.82;
    }

    if (usagi.y <= edge) {
      usagi.y = edge;
      usagi.vy = Math.abs(usagi.vy) * 0.78;
    } else if (usagi.y + usagi.size >= height - edge) {
      usagi.y = height - usagi.size - edge;
      usagi.vy = -Math.max(Math.abs(usagi.vy) * usagi.bounce, 2.8 + Math.random() * 2.8);
      usagi.vx *= 0.985;
      usagi.spin *= 0.96;
    }

    const popProgress = Math.min(usagi.age / 0.32, 1);
    const popScale = easeOutBack(popProgress);
    const fadeStart = usagi.lifetime - 1.4;
    const opacity = usagi.age < fadeStart
      ? 1
      : Math.max(0, 1 - (usagi.age - fadeStart) / 1.4);
    const exitScale = opacity < 1 ? 0.78 + opacity * 0.22 : 1;

    usagi.element.style.opacity = opacity.toFixed(3);
    usagi.element.style.transform = `translate3d(${usagi.x}px, ${usagi.y}px, 0) rotate(${usagi.rotation}deg) scale(${popScale * exitScale})`;
  });

  activeUsagis = activeUsagis.filter((usagi) => {
    if (usagi.age < usagi.lifetime) return true;
    usagi.element.remove();
    return false;
  });

  if (activeUsagis.length) {
    usagiFrame = requestAnimationFrame(updateUsagis);
  }
}

function animateLaunchButton(button) {
  button.classList.remove('is-launching');
  void button.offsetWidth;
  button.classList.add('is-launching');
  window.setTimeout(() => button.classList.remove('is-launching'), 560);
}

function triggerSurprise(button) {
  const rect = button.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  launchUsagis(button);
  if (!reduceMotion.matches) burstConfetti(originX, originY, 170);
  animateLaunchButton(button);
  effectStatus.textContent = 'Kejutan! Delapan belas Usagi sedang memantul di layar.';
}

const letterExperience = $('#letterExperience');
const letterPaper = $('#letterPaper');
const letterCard = letterPaper.querySelector('.letter-card');
const openLetterBtn = $('#openLetterBtn');
const repeatSurpriseBtn = $('#repeatSurpriseBtn');
let letterTimers = [];

function clearLetterTimers() {
  letterTimers.forEach((timer) => window.clearTimeout(timer));
  letterTimers = [];
}

function revealLetter() {
  clearLetterTimers();

  if (reduceMotion.matches) {
    letterExperience.classList.add('opened', 'fully-open');
    letterPaper.setAttribute('aria-hidden', 'false');
    openLetterBtn.setAttribute('aria-expanded', 'true');
    triggerSurprise(openLetterBtn);
    return;
  }

  openLetterBtn.disabled = true;
  letterExperience.classList.remove('opening', 'bursting');
  void letterExperience.offsetWidth;
  letterExperience.classList.add('opening');
  effectStatus.textContent = 'Surat kejutan sedang dibuka.';

  letterTimers.push(window.setTimeout(() => {
    letterExperience.classList.add('bursting');
    triggerSurprise(openLetterBtn);
  }, 260));

  letterTimers.push(window.setTimeout(() => {
    letterExperience.classList.add('opened');
    letterExperience.classList.remove('bursting');
    letterPaper.setAttribute('aria-hidden', 'false');
    openLetterBtn.setAttribute('aria-expanded', 'true');
  }, 430));

  letterTimers.push(window.setTimeout(() => {
    letterExperience.classList.remove('opening');
    letterExperience.classList.add('fully-open');
    openLetterBtn.disabled = false;
  }, 1250));
}

function replayLetterSurprise() {
  letterExperience.classList.remove('replaying');
  void letterCard.offsetWidth;
  letterExperience.classList.add('replaying');
  triggerSurprise(repeatSurpriseBtn);
  window.setTimeout(() => letterExperience.classList.remove('replaying'), 740);
}

openLetterBtn.addEventListener('click', revealLetter);
repeatSurpriseBtn.addEventListener('click', replayLetterSurprise);

// ====== CONFETTI ======
const canvas = $('#confetti');
const context = canvas.getContext('2d');
let confettiPieces = [];
let confettiFrame = 0;
let lastConfettiTime = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * ratio);
  canvas.height = Math.round(window.innerHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function burstConfetti(x, y, count = 120) {
  const colors = ['#ffd84d', '#ff91ad', '#ffffff', '#71c9ff', '#8bd17c', '#302a24'];

  for (let index = 0; index < count; index += 1) {
    confettiPieces.push({
      x: x + (Math.random() - 0.5) * 90,
      y: y + (Math.random() - 0.5) * 36,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 11 - 3,
      gravity: 0.17 + Math.random() * 0.1,
      radius: 3 + Math.random() * 5,
      rotation: Math.random() * 6,
      spin: (Math.random() - 0.5) * 0.28,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 130 + Math.random() * 55,
    });
  }

  if (!confettiFrame) {
    lastConfettiTime = performance.now();
    confettiFrame = requestAnimationFrame(updateConfetti);
  }
}

function updateConfetti(now) {
  const frameScale = Math.min((now - lastConfettiTime) / 16.667, 2.2);
  lastConfettiTime = now;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces.forEach((piece) => {
    piece.x += piece.vx * frameScale;
    piece.y += piece.vy * frameScale;
    piece.vy += piece.gravity * frameScale;
    piece.rotation += piece.spin * frameScale;
    piece.life -= frameScale;

    context.save();
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.fillStyle = piece.color;
    context.fillRect(-piece.radius, -piece.radius / 2, piece.radius * 2, piece.radius);
    context.restore();
  });

  confettiPieces = confettiPieces.filter(
    (piece) => piece.life > 0 && piece.y < window.innerHeight + 40,
  );

  if (confettiPieces.length) {
    confettiFrame = requestAnimationFrame(updateConfetti);
  } else {
    confettiFrame = 0;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();
