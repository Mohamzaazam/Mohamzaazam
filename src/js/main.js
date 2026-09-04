/**
 * Hamza Azam · Main Application Coordinator
 * State management, animation loop, telemetry binding, and presentation modal controls.
 * Zhejiang University · Ningbo Global Innovation Center
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('simCanvas');
  const renderer = new window.CadRenderer(canvas);

  // Application State
  const state = {
    isPlaying: true,
    phase: 0.0,
    speedMultiplier: 1.0,
    viewMode: 'both',
    maxTorqueGain: 45,
    walkSpeed: 1.25,
    lastTimestamp: performance.now()
  };

  // DOM Elements
  const slider = document.getElementById('gait-slider');
  const phaseLabel = document.getElementById('gait-phase-label');
  const eventLabel = document.getElementById('gait-event-label');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const btnReset = document.getElementById('btn-reset');

  const telBioForce = document.getElementById('tel-bio-force');
  const telExoTorque = document.getElementById('tel-exo-torque');
  const telMetaRate = document.getElementById('tel-meta-rate');
  const barBio = document.getElementById('bar-bio');
  const barExo = document.getElementById('bar-exo');
  const barMeta = document.getElementById('bar-meta');

  const hudBioVal = document.getElementById('hud-bio-val');
  const hudExoVal = document.getElementById('hud-exo-val');
  const hudMetaVal = document.getElementById('hud-meta-val');

  // Handle Canvas Resize for High DPI displays
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Animation Loop
  function tick(now) {
    const delta = (now - state.lastTimestamp) / 1000;
    state.lastTimestamp = now;

    if (state.isPlaying) {
      const gaitDuration = 2.4 / (state.walkSpeed / 1.25);
      state.phase = (state.phase + (delta * state.speedMultiplier) / gaitDuration) % 1.0;
      slider.value = (state.phase * 100).toFixed(1);
      syncUI();
    }

    renderer.render(state);
    requestAnimationFrame(tick);
  }

  // Telemetry and UI synchronization
  function syncUI() {
    const pct = Math.round(state.phase * 100);
    phaseLabel.textContent = `GAIT: ${pct}%`;

    const data = window.KinematicsEngine.computeTelemetry(state.phase, state.maxTorqueGain, state.walkSpeed);
    eventLabel.textContent = data.eventName;

    telBioForce.textContent = `${data.netMoment} N·m`;
    telExoTorque.textContent = `${data.exoTorque} N·m`;
    telMetaRate.textContent = '+48% Endurance';

    barBio.style.width = `${Math.min(100, (data.netMoment / 85) * 100)}%`;
    barExo.style.width = `${Math.min(100, (data.exoTorque / 60) * 100)}%`;
    barMeta.style.width = '82%';

    hudBioVal.textContent = `τ_hip: +${data.netMoment} N·m [θ_L, θ_R only]`;
    hudExoVal.textContent = `τ_assist: +${data.exoTorque} N·m`;
    hudMetaVal.textContent = `${data.mobilityMatch}% [PI² Policy]`;
  }

  // Scrubber control
  slider.addEventListener('input', (e) => {
    state.phase = parseFloat(e.target.value) / 100;
    syncUI();
    renderer.render(state);
  });

  // Play / Pause
  btnPlayPause.addEventListener('click', () => {
    state.isPlaying = !state.isPlaying;
    btnPlayPause.textContent = state.isPlaying ? '⏸ Pause' : '▶ Play';
  });

  // Reset
  btnReset.addEventListener('click', () => {
    state.phase = 0;
    slider.value = 0;
    syncUI();
    renderer.render(state);
  });

  // Cadence Speed multipliers
  const spdButtons = [
    { id: 'spd-025', val: 0.25 },
    { id: 'spd-05', val: 0.5 },
    { id: 'spd-1', val: 1.0 },
    { id: 'spd-2', val: 2.0 }
  ];
  spdButtons.forEach(b => {
    const el = document.getElementById(b.id);
    if (!el) return;
    el.addEventListener('click', () => {
      spdButtons.forEach(btn => document.getElementById(btn.id)?.classList.remove('active'));
      el.classList.add('active');
      state.speedMultiplier = b.val;
    });
  });

  // View Mode selector
  const modeBoth = document.getElementById('mode-both');
  const modeBio = document.getElementById('mode-bio');
  const modeExo = document.getElementById('mode-exo');

  function setMode(mode, activeBtn) {
    state.viewMode = mode;
    [modeBoth, modeBio, modeExo].forEach(b => b?.classList.remove('active'));
    activeBtn.classList.add('active');
    renderer.render(state);
  }

  if (modeBoth) modeBoth.addEventListener('click', () => setMode('both', modeBoth));
  if (modeBio) modeBio.addEventListener('click', () => setMode('bio', modeBio));
  if (modeExo) modeExo.addEventListener('click', () => setMode('exo', modeExo));

  // Parameter Tuning: Torque Gain
  const inputTorqueGain = document.getElementById('input-torque-gain');
  const valTorqueGain = document.getElementById('val-torque-gain');
  if (inputTorqueGain) {
    inputTorqueGain.addEventListener('input', (e) => {
      state.maxTorqueGain = parseFloat(e.target.value);
      if (valTorqueGain) valTorqueGain.textContent = `${state.maxTorqueGain} N·m`;
      syncUI();
    });
  }

  // Parameter Tuning: Walk Speed
  const inputWalkSpeed = document.getElementById('input-walk-speed');
  const valWalkSpeed = document.getElementById('val-walk-speed');
  if (inputWalkSpeed) {
    inputWalkSpeed.addEventListener('input', (e) => {
      state.walkSpeed = parseFloat(e.target.value);
      if (valWalkSpeed) valWalkSpeed.textContent = `${state.walkSpeed.toFixed(2)} m/s`;
      syncUI();
    });
  }

  // ================= 6-Chapter Presentation Slide Deck =================
  const slides = [
    {
      title: "Chapter 01 · Identity & Philosophy",
      sub: "Zhejiang University · Ningbo Global Innovation Center",
      points: [
        "Doctorate at Zhejiang University sitting at the nexus of musculoskeletal modeling and machine learning.",
        "Prior background as an algorithm engineer converting research-grade models into industrial edge deployment.",
        "Master's degree characterizing steel microstructure via magnetic Barkhausen noise.",
        "Core through-line: Inferring internal, unobservable biomechanical states from the few signals you can measure outside the lab."
      ]
    },
    {
      title: "Chapter 02 · The Core Question",
      sub: "What the Body is Doing, and What You Can Measure",
      points: [
        "Walking looks simple and is not. Movement is governed by joint moments — net turning effort at hip, knee, and ankle.",
        "Joint moments dictate joint loading, injury compensation, and optimal exoskeleton assistance.",
        "Laboratory limitation: Moments traditionally require optical motion capture and force plates — unfeasible for real-world devices.",
        "The transitional gap: Real walking consists of starts, stops, turns, and speed shifts — precisely where assistance is most crucial."
      ]
    },
    {
      title: "Chapter 03 · The Method (ESWA 2026)",
      sub: "Hip Moments from Bilateral Hip Angles Alone",
      points: [
        "Wearable encoders on an exoskeleton already measure bilateral joint angles directly.",
        "Breakthrough: Subject-independent hip moment estimation across transitional and steady-state gait.",
        "Generalizes seamlessly to unseen individuals without requiring per-subject calibration.",
        "Published in Expert Systems with Applications (2026, doi: 10.1016/j.eswa.2026.132047)."
      ]
    },
    {
      title: "Chapter 04 · Exoskeleton Gait Adaptation (IROS 2025)",
      sub: "Hm-DMP & PI² Optimization Framework",
      points: [
        "Novel framework coupling Harmonic Dynamic Movement Primitives (Hm-DMP) with Path Integral policy optimization.",
        "Dynamic patient mobility matching ensuring compliant, synchronous assistance.",
        "Mitigates human-robot fighting and delivers assistive torque precisely during push-off.",
        "Published in IEEE/RSJ IROS 2025 (doi: 10.1109/IROS60139.2025.11247606)."
      ]
    },
    {
      title: "Chapter 05 · Time Series & Fatigue (MST 2026)",
      sub: "MetaTran: Multivariate Hybrid Transformers",
      points: [
        "High-capacity hybrid transformer architectures for complex biomechanical and material time-series.",
        "Predictive fatigue dynamics forecasting structural and physiological limits.",
        "Published in Measurement Science and Technology (2026, doi: 10.1088/1361-6501/ae540b).",
        "Translating deep learning into robust, low-latency embedded inference."
      ]
    },
    {
      title: "Chapter 06 · Beyond the Lab & Invitation",
      sub: "Collaborations, Postdoctoral Inquiries & Translation",
      points: [
        "Industrial experience: Jiangsu Dongyuan Xinsheng Technology (data acquisition to on-device edge deployment).",
        "Editorial leadership: Khair Publications (Deputy Director, Content & Research).",
        "Actively seeking research collaborations in musculoskeletal modeling and exoskeleton control.",
        "Explore full publications and academic portfolio: mohamzaazam.github.io · ORCID: 0000-0002-3508-7332"
      ]
    }
  ];

  let currentSlide = 0;
  const slideModal = document.getElementById('slide-modal');
  const slideNumber = document.getElementById('slide-number');
  const slideBody = document.getElementById('slide-body');
  const btnSlideDeck = document.getElementById('btn-slide-deck');
  const btnCloseSlide = document.getElementById('btn-close-slide');
  const btnPrevSlide = document.getElementById('btn-prev-slide');
  const btnNextSlide = document.getElementById('btn-next-slide');

  function showSlide(idx) {
    currentSlide = Math.max(0, Math.min(slides.length - 1, idx));
    const s = slides[currentSlide];
    if (slideNumber) slideNumber.textContent = `CHAPTER 0${currentSlide + 1} / 0${slides.length}`;
    if (slideBody) {
      slideBody.innerHTML = `
        <h2>${s.title}</h2>
        <h3>${s.sub}</h3>
        <ul>
          ${s.points.map(p => `<li>${p}</li>`).join('')}
        </ul>
      `;
    }
  }

  if (btnSlideDeck) {
    btnSlideDeck.addEventListener('click', () => {
      showSlide(0);
      slideModal?.classList.add('active');
    });
  }
  if (btnCloseSlide) {
    btnCloseSlide.addEventListener('click', () => {
      slideModal?.classList.remove('active');
    });
  }
  if (btnPrevSlide) {
    btnPrevSlide.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });
  }
  if (btnNextSlide) {
    btnNextSlide.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      state.isPlaying = !state.isPlaying;
      btnPlayPause.textContent = state.isPlaying ? '⏸ Pause' : '▶ Play';
    } else if (e.key === 'p' || e.key === 'P') {
      if (slideModal) {
        slideModal.classList.toggle('active');
        if (slideModal.classList.contains('active')) showSlide(0);
      }
    } else if (slideModal && slideModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
      if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
      if (e.key === 'Escape') slideModal.classList.remove('active');
    }
  });

  // Start animation loop
  syncUI();
  requestAnimationFrame(tick);
});
