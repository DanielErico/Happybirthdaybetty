/* ==========================================================================
   Betty's Interactive Birthday Website - Logic Script
   Aesthetic: Luxury Matte Dark & Soft Romantic Pastel
   ========================================================================== */

// Global App State
let currentStage = 1;
let bgMusic = null;
let isAudioPlaying = false;
let canvasParticles = [];

// Memory Gallery Data (Polaroids)
const polaroids = [
  {
    type: 'image',
    src: './IMG-20260614-WA0002.jpg',
    caption: "Look at that beautiful face! My favorite view in the whole world. 😍"
  },
  {
    type: 'image',
    src: './Memories/IMG-20260227-WA0098.jpg',
    caption: "Capturing silly 😂  moments like this make me realize how lucky I am. 💖"
  },
  {
    type: 'video',
    src: './VID-20260420-WA0043.mp4#t=0,20',
    caption: "A little snippet of your amazing energy! (I am finished 😂)"
  },
  {
    type: 'image',
    src: './IMG-20260426-WA0047.jpg',
    caption: "Every moment with you is a moment I cherish. 💖"
  },
  {
    type: 'image',
    src: './IMG-20260426-WA0050.jpg',
    caption: "The calm before the storm (you telling me a 45-minute story about your day). 🎙️"
  },
  {
    type: 'image',
    src: './IMG-20260614-WA0012.jpg',
    caption: "You looking stunning as always. The tough guy stood no chance. 🌹"
  },
  {
    type: 'video',
    src: './Memories/Snapchat-508980559.mp4#t=0,20',
    caption: "Just you being silly with my phone. Your energy is unmatched! 🤪"
  },
  {
    type: 'image',
    src: './Screenshot_20260518_080253_Instagram.jpg',
    caption: "A memory of you being you. I love every single thing about you. 🥰"
  }
];

let activePolaroidIndex = 0;

// Relationship Quiz Data
const quizQuestions = [
  {
    question: "When did we first meet?",
    options: [
      "January 11th, 2026",
      "January 1st, 2026",
      "February 14th, 2026",
      "December 25th, 2025"
    ],
    correctIndex: 0,
    correctMessage: "Ah, you remembered! Or did you just count back from when my bank account started draining? 😂",
    wrongMessage: "Nope! New Year's resolution was to fear women, remember? January 11th was the fated day!"
  },
  {
    question: "What is my special name for you?",
    options: [
      "Beatrice",
      "Mon Coeur",
      "Betty",
      "Witch"
    ],
    correctIndex: 1,
    correctMessage: "Oui! Mon Coeur (My Heart)... and also my therapist. 💕",
    wrongMessage: "Too formal or wrong! It's French, romantic, and literally means 'My Heart'!"
  },
  {
    question: "How long had I been fearing women before I met you?",
    options: [
      "1 year",
      "3 years",
      "5 years",
      "I was never afraid"
    ],
    correctIndex: 1,
    correctMessage: "Yes! 3 whole years of peace, and then you broke my defenses. 😂",
    wrongMessage: "No! I held a strong defense line for 3 years before you came and finished me."
  },
  {
    question: "What is my top transportation plan to see you after school?",
    options: [
      "Airplane",
      "Broom Airways 🧙‍♂️",
      "Walking",
      "Swimming"
    ],
    correctIndex: 1,
    correctMessage: "Exactly! Quick, eco-friendly, and slightly magical. Broom Airways is the way! 🧹",
    wrongMessage: "Airplanes? Too normal. I'm flying over on my broom airways!"
  },
  {
    question: "What is my absolute favorite 'therapy'?",
    options: [
      "Sleeping 12 hours",
      "Going to the gym",
      "Just being around you",
      "Counting money"
    ],
    correctIndex: 2,
    correctMessage: "Correct. You're my peace, Mon Coeur. Everything else just melts away. 💕",
    wrongMessage: "Sleeping or gym? Nice, but they don't cure my worries like you do!"
  }
];

let currentQuestionIndex = 0;
let quizScore = 0;

// Digital Coupons
const coupons = [
  {
    title: "Any Gift you want 🎁",
    desc: "Don't worry about cost, you know my card has no limit lol 😂"
  },
  {
    title: "Date Night Choice 🕯️",
    desc: "You choose the Location, the food, the movie, and I will be on my best behavior. I pay, you enjoy!"
  },
  {
    title: "Online Shopping Spree Day 🛍️",
    desc: "A full day of online shopping where I don't check the bank account. (Pls be gentle 😂)"
  }
];

let openedBoxes = [false, false, false];

/* ==========================================================================
   Initialization
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Setup Particles Canvas
  initParticles();

  // Build Polaroid Gallery
  buildGallery();

  // Setup Audio Controls
  document.getElementById('audio-toggle').addEventListener('click', toggleAudio);

  // Set stage 1 entry animations
  gsap.from("#stage-landing .glass-card", {
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: "power3.out"
  });

  // Attempt autoplay immediately when site is opened
  tryAutoplay();
});


/* ==========================================================================
   Background Heart Particles Canvas
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 8 + 5;
      this.speedY = Math.random() * 0.8 + 0.4;
      this.speedX = Math.sin(Math.random() * 2) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseDir = 1;
      // 80% hearts, 20% sparkles
      this.isHeart = Math.random() < 0.8;
      // random pastel color (pink, red-pink, lavender)
      const colors = ['rgba(255, 163, 177, ', 'rgba(240, 123, 144, ', 'rgba(214, 189, 242, '];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      // pulse opacity slightly
      this.opacity += this.pulseSpeed * this.pulseDir;
      if (this.opacity > 0.6 || this.opacity < 0.1) {
        this.pulseDir *= -1;
      }

      // boundary check
      if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.colorBase + '1)';

      if (this.isHeart) {
        // Draw heart shape
        ctx.beginPath();
        const d = this.size;
        const x = this.x;
        const y = this.y;

        ctx.moveTo(x, y + d / 4);
        ctx.quadraticCurveTo(x, y, x + d / 2, y);
        ctx.quadraticCurveTo(x + d, y, x + d, y + d / 3);
        ctx.quadraticCurveTo(x + d, y + (d * 2) / 3, x + d / 2, y + d);
        ctx.quadraticCurveTo(x, y + (d * 2) / 3, x, y + d / 3);
        ctx.quadraticCurveTo(x, y, x, y + d / 4);
        ctx.closePath();
        ctx.fill();
      } else {
        // Draw star/sparkle
        ctx.beginPath();
        const r = this.size / 2;
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffa3b1';
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Create particle array
  const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
  for (let i = 0; i < particleCount; i++) {
    canvasParticles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of canvasParticles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   Background Music Controller (HTML5 Audio)
   Plays the customized romantic track 'Moavii - We Are.mp3'
   ========================================================================== */
function initAudio() {
  bgMusic = new Audio('Moavii - We Are.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.35; // Soft background volume
}

function toggleAudio() {
  if (!bgMusic) {
    initAudio();
  }

  const toggleBtn = document.getElementById('audio-toggle');
  const iconPlaying = toggleBtn.querySelector('.icon-playing');
  const iconMuted = toggleBtn.querySelector('.icon-muted');
  const text = toggleBtn.querySelector('.audio-text');

  if (isAudioPlaying) {
    // Mute
    isAudioPlaying = false;
    bgMusic.pause();
    iconPlaying.classList.add('hidden');
    iconMuted.classList.remove('hidden');
    text.textContent = 'Muted';
  } else {
    // Play
    isAudioPlaying = true;
    iconPlaying.classList.remove('hidden');
    iconMuted.classList.add('hidden');
    text.textContent = 'Playing ♫';
    bgMusic.play().catch(error => {
      console.log('Audio autoplay blocked by browser:', error);
      // Revert states so the button is playable again
      isAudioPlaying = false;
      iconPlaying.classList.add('hidden');
      iconMuted.classList.remove('hidden');
      text.textContent = 'Play Music ♫';
    });
  }
}

function tryAutoplay() {
  if (isAudioPlaying) {
    removeAutoplayListeners();
    return;
  }

  if (!bgMusic) {
    initAudio();
  }

  bgMusic.play()
    .then(() => {
      isAudioPlaying = true;
      const toggleBtn = document.getElementById('audio-toggle');
      if (toggleBtn) {
        const iconPlaying = toggleBtn.querySelector('.icon-playing');
        const iconMuted = toggleBtn.querySelector('.icon-muted');
        const text = toggleBtn.querySelector('.audio-text');
        if (iconPlaying) iconPlaying.classList.remove('hidden');
        if (iconMuted) iconMuted.classList.add('hidden');
        if (text) text.textContent = 'Playing ♫';
      }
      removeAutoplayListeners();
    })
    .catch(error => {
      console.log('Autoplay blocked initially, waiting for user interaction:', error);
      addAutoplayListeners();
    });
}

function playOnInteraction(e) {
  if (e && e.target && e.target.closest('#audio-toggle')) {
    removeAutoplayListeners();
    return;
  }
  tryAutoplay();
}

function addAutoplayListeners() {
  document.addEventListener('click', playOnInteraction, { once: true });
  document.addEventListener('touchstart', playOnInteraction, { once: true });
  document.addEventListener('keydown', playOnInteraction, { once: true });
  document.addEventListener('mousedown', playOnInteraction, { once: true });
}

function removeAutoplayListeners() {
  document.removeEventListener('click', playOnInteraction);
  document.removeEventListener('touchstart', playOnInteraction);
  document.removeEventListener('keydown', playOnInteraction);
  document.removeEventListener('mousedown', playOnInteraction);
}

/* ==========================================================================
   State / Stage Management & Section Transitions
   ========================================================================== */
function nextStage(targetStage) {
  const currentStageEl = document.querySelector(`.stage.active`);
  const targetStageEl = document.getElementById(`stage-${getStageId(targetStage)}`);

  if (!targetStageEl) return;

  // Pause any playing videos before leaving stage 3
  if (currentStage === 3) {
    pauseAllVideos();
  }

  // Audio auto-trigger logic
  if (targetStage === 2 && !bgMusic && !isAudioPlaying) {
    // Automatically trigger audio on first user progress click (if they haven't explicitly enabled/muted yet)
    toggleAudio();
  }

  // GSAP Transition Timeline
  const tl = gsap.timeline({
    onComplete: () => {
      currentStageEl.classList.remove('active');
      targetStageEl.classList.add('active');
      currentStage = targetStage;

      // Post-transition triggers
      onStageEnter(targetStage);
    }
  });

  tl.to(currentStageEl, {
    opacity: 0,
    y: -20,
    duration: 0.5,
    ease: "power2.in"
  });

  tl.fromTo(targetStageEl,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
  );
}

function getStageId(stageNum) {
  const stages = {
    1: 'landing',
    2: 'intro',
    3: 'gallery',
    4: 'quiz',
    5: 'surprise',
    6: 'letter'
  };
  return stages[stageNum];
}

function onStageEnter(stageNum) {
  if (stageNum === 2) {
    // Start Intro Typewriter text
    startIntroTypewriter();
  } else if (stageNum === 3) {
    // Reset polaroids placement
    renderPolaroidDeck();
  } else if (stageNum === 4) {
    // Start Quiz
    resetQuiz();
  } else if (stageNum === 6) {
    // Final letter page: Trigger initial confetti burst!
    triggerCelebrationConfetti();
  }
}

/* ==========================================================================
   Stage 2: Typewriter Animation
   ========================================================================== */
function startIntroTypewriter() {
  const message = "Mon Coeur,\n\nThank you for coming into my life. Ever since January 11th, 2026, my life has been completely different. The last 3 months have been a beautiful blur of memories, laughter, and me being completely, utterly finished. 😂\n\nI made this tiny interactive space for you so we can go through our memories and test if you actually remember our moments.\n\nLet's begin...";
  const textEl = document.getElementById('intro-typewriter-text');
  textEl.textContent = '';

  // Hide the continue button initially
  const continueBtn = document.getElementById('intro-continue-btn');
  gsap.set(continueBtn, { opacity: 0, y: 10, pointerEvents: 'none' });

  let i = 0;
  function type() {
    if (i < message.length) {
      textEl.textContent += message.charAt(i);
      i++;
      // Speed up typing for punctuation/spaces
      const delay = (message.charAt(i - 1) === '\n' || message.charAt(i - 1) === '.') ? 350 : 35;
      setTimeout(type, delay);
    } else {
      // Reveal the continue button when typing is fully complete
      gsap.to(continueBtn, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          continueBtn.style.pointerEvents = 'auto';
        }
      });
    }
  }

  type();
}

/* ==========================================================================
   Stage 3: Interactive Polaroid Memory Deck
   ========================================================================== */
function buildGallery() {
  // Setup the initial layout
  renderPolaroidDeck();
}

function renderPolaroidDeck() {
  const deck = document.getElementById('polaroid-deck');
  deck.innerHTML = '';

  polaroids.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card';
    card.id = `polaroid-${index}`;

    // Slight random rotation for Polaroid aesthetics
    const rotate = (index === activePolaroidIndex) ? 0 : (index % 2 === 0 ? 5 : -5);
    const scale = (index === activePolaroidIndex) ? 1 : 0.95;
    const zIndex = polaroids.length - Math.abs(index - activePolaroidIndex);
    const opacity = (index === activePolaroidIndex) ? 1 : 0;

    card.style.transform = `rotate(${rotate}deg) scale(${scale})`;
    card.style.zIndex = zIndex;
    card.style.opacity = opacity;

    if (index !== activePolaroidIndex) {
      card.style.pointerEvents = 'none';
    }

    let mediaHTML = '';
    if (item.type === 'image') {
      mediaHTML = `<img src="${item.src}" alt="Memory" class="polaroid-image" loading="lazy">`;
    } else {
      mediaHTML = `
        <video class="polaroid-video" playsinline controls loop muted preload="auto">
          <source src="${item.src}" type="video/mp4">
        </video>
        <div class="video-play-hint"><i data-lucide="play"></i></div>
      `;
    }

    card.innerHTML = `
      <div class="polaroid-image-container">
        ${mediaHTML}
      </div>
      <div class="polaroid-caption">${item.caption}</div>
    `;

    deck.appendChild(card);
  });

  lucide.createIcons();
  updateGalleryControls();

  // Auto-play active card video
  playActiveVideo();
}

function playActiveVideo() {
  const activeCard = document.getElementById(`polaroid-${activePolaroidIndex}`);
  if (!activeCard) return;

  const video = activeCard.querySelector('.polaroid-video');
  const playHint = activeCard.querySelector('.video-play-hint');

  if (video) {
    video.muted = false; // unmute so she can hear it
    video.currentTime = 0;

    // Play with fallback for browser blocking auto-play audio
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (playHint) playHint.classList.add('hidden');
      }).catch(error => {
        // Video blocked, play muted as fallback
        video.muted = true;
        video.play();
      });
    }
  }
}

function pauseAllVideos() {
  const videos = document.querySelectorAll('.polaroid-video');
  videos.forEach(v => {
    v.pause();
    v.currentTime = 0;
  });
}

function nextPolaroid() {
  if (activePolaroidIndex < polaroids.length - 1) {
    pauseAllVideos();
    activePolaroidIndex++;
    animatePolaroidTransition();
  }
}

function prevPolaroid() {
  if (activePolaroidIndex > 0) {
    pauseAllVideos();
    activePolaroidIndex--;
    animatePolaroidTransition();
  }
}

function animatePolaroidTransition() {
  polaroids.forEach((item, index) => {
    const card = document.getElementById(`polaroid-${index}`);
    if (!card) return;

    const isActive = index === activePolaroidIndex;
    const rotate = isActive ? 0 : (index % 2 === 0 ? 5 : -5);
    const scale = isActive ? 1 : 0.95;
    const zIndex = polaroids.length - Math.abs(index - activePolaroidIndex);
    const opacity = isActive ? 1 : 0;

    gsap.to(card, {
      transform: `rotate(${rotate}deg) scale(${scale})`,
      zIndex: zIndex,
      opacity: opacity,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        card.style.pointerEvents = isActive ? 'auto' : 'none';
        if (isActive) {
          playActiveVideo();
        }
      }
    });
  });

  updateGalleryControls();
}

function updateGalleryControls() {
  document.getElementById('gallery-counter').textContent = `${activePolaroidIndex + 1} / ${polaroids.length}`;

  const prevBtn = document.getElementById('prev-gallery-btn');
  const nextBtn = document.getElementById('next-gallery-btn');

  prevBtn.style.opacity = (activePolaroidIndex === 0) ? '0.3' : '1';
  prevBtn.style.pointerEvents = (activePolaroidIndex === 0) ? 'none' : 'auto';

  nextBtn.style.opacity = (activePolaroidIndex === polaroids.length - 1) ? '0.3' : '1';
  nextBtn.style.pointerEvents = (activePolaroidIndex === polaroids.length - 1) ? 'none' : 'auto';
}

/* ==========================================================================
   Stage 4: Relationship Quiz Game
   ========================================================================== */
function resetQuiz() {
  currentQuestionIndex = 0;
  quizScore = 0;
  displayQuestion();
}

function displayQuestion() {
  const qData = quizQuestions[currentQuestionIndex];

  // Question text
  document.getElementById('question-text').textContent = qData.question;

  // Options
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';

  qData.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => submitAnswer(idx));
    optionsContainer.appendChild(btn);
  });

  // Progress Bar
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  document.getElementById('quiz-progress').style.width = `${progressPercent}%`;

  // Tally display
  document.getElementById('quiz-score-display').textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

  // Hide feedback overlay
  document.getElementById('quiz-feedback').classList.add('hidden');
}

function submitAnswer(selectedIndex) {
  const qData = quizQuestions[currentQuestionIndex];
  const feedbackOverlay = document.getElementById('quiz-feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackMsg = document.getElementById('feedback-message');
  const nextBtnText = feedbackOverlay.querySelector('#feedback-next-btn span');

  const isCorrect = selectedIndex === qData.correctIndex;

  if (isCorrect) {
    quizScore++;
    feedbackIcon.textContent = '🎉';
    feedbackTitle.textContent = 'Correct Answer!';
    feedbackMsg.textContent = qData.correctMessage;
    // trigger some tiny sparkles!
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.75 }
    });
  } else {
    feedbackIcon.textContent = '😜';
    feedbackTitle.textContent = 'Oops! Wrong answer!';
    feedbackMsg.textContent = qData.wrongMessage;
  }

  if (currentQuestionIndex === quizQuestions.length - 1) {
    nextBtnText.textContent = "Finish Quiz 🏁";
  } else {
    nextBtnText.textContent = "Next Question →";
  }

  feedbackOverlay.classList.remove('hidden');
}

function advanceQuiz() {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    // Show special feedback based on the final score before going to box surprise
    nextStage(5);
  }
}

/* ==========================================================================
   Stage 5: Choose a Gift Box Game
   ========================================================================== */
function openGiftBox(boxIdx, element) {
  if (openedBoxes[boxIdx]) return;
  openedBoxes[boxIdx] = true;

  // Animate box lid flying off
  const lid = element.querySelector('.gift-lid');
  gsap.to(lid, {
    y: -40,
    rotation: 20,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    onComplete: () => {
      // Reveal Coupon Modal
      const modal = document.getElementById('gift-reveal-modal');
      const title = document.getElementById('coupon-title');
      const desc = document.getElementById('coupon-desc');

      const couponData = coupons[boxIdx];
      title.textContent = couponData.title;
      desc.textContent = couponData.desc;

      modal.classList.remove('hidden');

      // Heart explosion confetti
      triggerHeartConfetti();
    }
  });
}

function closeGiftReveal() {
  document.getElementById('gift-reveal-modal').classList.add('hidden');

  // Check if all boxes are open, show CTA
  if (openedBoxes.every(b => b)) {
    const nextBtn = document.getElementById('surprise-next-btn');
    nextBtn.classList.add('btn-primary');
    nextBtn.style.animation = 'heartPulse 1.5s infinite';
  }
}

/* ==========================================================================
   Stage 6: Unfolded Envelope Love Letter
   ========================================================================== */
function openLetterAnimation() {
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const flap = envelopeWrapper.querySelector('.flap');
  const letterPreview = envelopeWrapper.querySelector('.letter-preview');

  // 1. Open Flap
  gsap.to(flap, {
    rotateX: 180,
    zIndex: 2,
    duration: 0.4,
    ease: "power1.inOut",
    onComplete: () => {
      // 2. Slide Letter Up
      gsap.to(letterPreview, {
        y: -120,
        zIndex: 10,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          // 3. Fade Out Envelope Wrapper & Reveal Unfolded Letter
          gsap.to(envelopeWrapper, {
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            onComplete: () => {
              envelopeWrapper.classList.add('hidden');

              const letterContainer = document.getElementById('unfolded-letter-container');
              letterContainer.classList.remove('hidden');

              // Scroll letter to top initially
              const parchment = letterContainer.querySelector('.parchment-letter');
              parchment.scrollTop = 0;

              gsap.fromTo(parchment,
                { scale: 0.8, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.8,
                  ease: "back.out(1.2)",
                  onComplete: () => {
                    // Continuous celebration sparks
                    startLetterCelebrationConfetti();
                  }
                }
              );
            }
          });
        }
      });
    }
  });
}

function restartExperience() {
  // Reset all states
  activePolaroidIndex = 0;
  openedBoxes = [false, false, false];

  // Reset Gift Boxes UI
  const boxes = document.querySelectorAll('.gift-box-item');
  boxes.forEach(box => {
    const lid = box.querySelector('.gift-lid');
    gsap.set(lid, { y: 0, rotation: 0, opacity: 1 });
  });

  document.getElementById('envelope-wrapper').classList.remove('hidden');
  gsap.set(document.getElementById('envelope-wrapper'), { opacity: 1, scale: 1 });
  gsap.set(document.getElementById('envelope-wrapper').querySelector('.flap'), { rotateX: 0, zIndex: 5 });
  gsap.set(document.getElementById('envelope-wrapper').querySelector('.letter-preview'), { y: 0, zIndex: 2 });

  document.getElementById('unfolded-letter-container').classList.add('hidden');

  // Go back to landing
  nextStage(1);
}

/* ==========================================================================
   Confetti Effects (canvas-confetti)
   ========================================================================== */
function triggerCelebrationConfetti() {
  // Simple burst
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
}

function triggerHeartConfetti() {
  const defaults = { spread: 360, ticks: 100, gravity: 0, decay: 0.94, startVelocity: 30, colors: ['#ffa3b1', '#f07b90', '#d6bdf2', '#ffffff'] };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['circle']
    });

    confetti({
      ...defaults,
      particleCount: 20,
      scalar: 0.75,
      shapes: ['circle']
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

function startLetterCelebrationConfetti() {
  // Launch colorful celebration confetti loops from left/right sides
  const duration = 8 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, animate a bit higher than random
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
}
