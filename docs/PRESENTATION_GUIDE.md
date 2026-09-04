# 🎯 Presentation Strategy & Academic Showcase Guide
**High-Impact Communication for Neuromusculoskeletal Modeling & Wearable Exoskeletons**  
*Tailored specifically for Hamza Azam · Zhejiang University & mohamzaazam.github.io*

---

## 1. Executive Summary

Your doctorate at **Zhejiang University (Ningbo Global Innovation Center)** addresses a fundamental bottleneck in biomechanics and wearable robotics:
- **The Core Challenge**: Human locomotion is driven by internal joint moments ($\tau_{\text{hip}}, \tau_{\text{knee}}, \tau_{\text{ankle}}$), which are physically unobservable outside expensive motion capture laboratories equipped with force plates. Moreover, conventional models fail during non-steady-state transitional gait (starting, stopping, turning, speed changes).
- **The Solution Portfolio**:
  1. Estimating continuous hip moments from wearable sensors already available on an exoskeleton (**bilateral hip angles alone**, *Expert Systems with Applications*, 2026).
  2. Coupling this with **Harmonic Dynamic Movement Primitives (Hm-DMP)** and **Path Integral ($\text{PI}^2$) reinforcement learning** (*IEEE/RSJ IROS 2025*) for compliant, patient-adaptive mobility matching.
  3. Deploying **MetaTran hybrid transformers** (*Measurement Science and Technology*, 2026) for multi-scale fatigue dynamics and embedded edge inference.

This guide provides presentation frameworks for **conferences (IROS, ICRA, EMBC)**, your **doctoral defense/viva**, and your **online presence ([mohamzaazam.github.io](https://mohamzaazam.github.io))**.

---

## 2. Repository Structure & Artifacts

```
mohamzaazam/
├── README.md                      # GitHub Profile README (renders on github.com/mohamzaazam)
├── index.html                     # Standalone Interactive Codex Presentation Dashboard
├── assets/
│   └── algorithmic-locomotion.svg # Renaissance Codex vector plate with Vitruvian biomechanics & automaton
├── src/
│   ├── css/
│   │   └── kinematic-art.css      # Renaissance parchment & copperplate stylesheet
│   └── js/
│       ├── kinematics.js          # Continuous biomechanical kinematics solver (zero-slip stance)
│       ├── state-space.js         # Renaissance horological astrolabe phase portrait generator
│       ├── renderer.js            # Vitruvian anatomical study & clockwork automaton canvas renderer
│       └── main.js                # UI controls, scrubber & presentation modal
├── embed/
│   └── snippet.html               # Responsive embed widget for mohamzaazam.github.io
├── docs/
│   ├── PRESENTATION_GUIDE.md      # This academic showcase guide
│   └── RESEARCH_NOTES.md          # Complete mathematical derivations & D-H parameters
├── pyproject.toml                 # Tooling configuration
└── .gitignore
```

---

## 3. Integrating into `mohamzaazam.github.io`

### 3.1 Dropping in the Algorithmic CAD Widget
Use [`embed/snippet.html`](../embed/snippet.html), a responsive, self-contained component:
- **Placement Options**:
  - **Hero Section**: Place directly beneath your doctoral introductory statement.
  - **Research Chapters (Chapter 02/03)**: To contrast the unobservable biological joint moments with the encoder-driven exoskeleton controller.
- **How to Embed**:
  Copy the contents of `embed/snippet.html` and paste directly into your site template (HTML, Markdown, Jekyll, Astro, or Hugo).

### 3.2 Running the Interactive CAD Dashboard (`index.html`)
- Open `index.html` in any modern web browser or serve it via GitHub Pages.
- **Key Features**:
  - Continuous scrubbing across $0\% - 100\%$ gait cycle.
  - Live **$(\theta, \dot{\theta})$ State-Space Phase Orbit** tracing limit-cycle stability.
  - Real-time parameter tuning for assistive torque gain ($0-65\text{ N}\cdot\text{m}$) and transitional walking speed ($0.8-1.8\text{ m/s}$).
  - Fullscreen 6-Chapter Presentation Slide Deck (trigger anytime with the `[P]` key).

---

## 4. Conference & Defense Slide Strategy

### 4.1 Paper 1: Hip Moments from Bilateral Angles Alone (ESWA 2026)
- **Slide Hook**: Show a photograph of a 12-camera optical mocap lab with Bertec force plates. Cross it out and replace it with two rotary encoders on an exoskeleton.
- **Key Message**: Eliminating the calibration barrier transforms biomechanical joint moments from an academic curiosity into an actionable real-time control input.
- **Highlight**: Emphasize transitional steps (acceleration, deceleration) where prior literature fails. Point out your leave-one-subject-out validation ($R^2 > 0.92$).

### 4.2 Paper 2: Hm-DMP & $\text{PI}^2$ Exoskeleton Control (IROS 2025)
- **Slide Hook**: Demonstrate the problem of "human-robot fighting" when exoskeletons enforce rigid predefined trajectories.
- **Key Message**: Hm-DMP creates a compliant limit-cycle attractor that synchronizes with the user's natural cadence, while $\text{PI}^2$ policy optimization continuously minimizes metabolic cost and interaction torque.
- **Phase Space**: Display the $(\theta, \dot{\theta})$ phase portrait to visually explain phase-locking and terminal push-off assistance ($45-55\%$ gait cycle).

### 4.3 Paper 3: MetaTran Hybrid Transformers (MST 2026)
- **Slide Hook**: The mechanical interface between humans and wearable robots undergoes high-frequency transient shocks coupled with long-term fatigue degradation.
- **Key Message**: Combining multi-scale 1D dilated convolutions (transient shock analysis) with temporal self-attention (cyclical degradation) delivers real-time predictive fatigue life forecasting with $<4\text{ ms}$ edge latency.

---

## 5. 6-Chapter Presentation Narrative (Aligned with Website)

| Chapter | Title | Narrative Arc |
| :---: | :--- | :--- |
| **01** | **Identity & Philosophy** | Situate your doctorate at Zhejiang University between musculoskeletal dynamics and machine learning. Through-line: *Inferring unobservable internal biomechanical states from wearable surface sensors.* |
| **02** | **The Question** | Joint moments govern human movement, injury recovery, and optimal assistance, yet cannot be measured outside a lab. Steady-state models fail on transitional steps. |
| **03** | **The Method (ESWA 2026)** | Estimating continuous hip moments from bilateral hip angles alone with subject-independent generalization. |
| **04** | **Adaptive Control (IROS 2025)** | Hm-DMP and $\text{PI}^2$ optimization achieving dynamic patient mobility matching and compliant assistive torque delivery. |
| **05** | **Fatigue Dynamics (MST 2026)** | MetaTran hybrid transformers modeling multi-scale time series for predictive structural and biological fatigue life. |
| **06** | **Beyond the Lab & Invitation** | Industrial engineering experience (Dongyuan Xinsheng), editorial leadership (Khair Publications), and open invitation for collaborative post-doctoral research. |

---

## 6. Academic Profiles & Identifiers

- **Personal Website**: [`mohamzaazam.github.io`](https://mohamzaazam.github.io)
- **ORCID**: [`0000-0002-3508-7332`](https://orcid.org/0000-0002-3508-7332)
- **Google Scholar**: [`Hamza Azam`](https://scholar.google.com/citations?user=laEDQTkAAAAJ&hl=en)
