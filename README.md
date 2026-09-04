<p align="center">
  <img src="./assets/algorithmic-locomotion.svg" alt="Zhejiang University Biomechatronics: Algorithmic Kinematic Wireframe and State-Space Exoskeleton Co-Simulation" width="100%">
</p>

<h1 align="center">Hamza Azam</h1>

<p align="center">
  <strong>PhD Researcher · Zhejiang University (Ningbo Global Innovation Center)</strong><br>
  <em>Musculoskeletal Kinematics · Inverse Dynamics · Lower-Limb Exoskeleton Control · Deep Learning for Human Locomotion</em>
</p>

<p align="center">
  <a href="https://mohamzaazam.github.io"><img src="https://img.shields.io/badge/Website-mohamzaazam.github.io-0284c7?style=flat-square&logo=google-chrome&logoColor=white" alt="Personal Website"></a>
  <a href="https://orcid.org/0000-0002-3508-7332"><img src="https://img.shields.io/badge/ORCID-0000--0002--3508--7332-A6CE39?style=flat-square&logo=orcid&logoColor=white" alt="ORCID"></a>
  <a href="https://scholar.google.com/citations?user=laEDQTkAAAAJ&hl=en"><img src="https://img.shields.io/badge/Google_Scholar-Citations-4285F4?style=flat-square&logo=google-scholar&logoColor=white" alt="Google Scholar"></a>
  <a href="https://github.com/mohamzaazam"><img src="https://img.shields.io/badge/GitHub-mohamzaazam-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="mailto:mohamzaazam@gmail.com"><img src="https://img.shields.io/badge/Email-mohamzaazam@gmail.com-ea4335?style=flat-square&logo=gmail&logoColor=white" alt="Email"></a>
</p>

<p align="center">
  <a href="./index.html"><strong>🎮 Interactive CAD Dashboard</strong></a> •
  <a href="./embed/snippet.html"><strong>🌐 Website Embed Snippet</strong></a> •
  <a href="./docs/PRESENTATION_GUIDE.md"><strong>🎯 Presentation Strategy Guide</strong></a> •
  <a href="./docs/RESEARCH_NOTES.md"><strong>📐 Mathematical Formulations</strong></a> •
  <a href="https://mohamzaazam.github.io"><strong>🌍 Live Website</strong></a>
</p>

---

> *"I work on the mechanics of human movement — estimating what the body's joints are doing from the little that can be measured outside a laboratory, and using it to drive exoskeletons that assist real people."*

---

## 🔬 Doctoral Research Focus

My doctorate at **Zhejiang University** sits at the nexus of **musculoskeletal kinematics**, **machine learning**, and **adaptive robotic control**:

```
        [ BIOLOGICAL DOMAIN ]                             [ ROBOTIC DOMAIN ]
┌───────────────────────────────────┐             ┌───────────────────────────────────┐
│     Human Locomotion Dynamics     │             │ Wearable Lower-Limb Exoskeleton   │
│                 ↓                 │             │                 ↓                 │
│ Bilateral Hip Angles (θ_L, θ_R)   │ ──────────> │ Hm-DMP Dynamic Movement Primitives│
│  [Encoders Only · No Force Plates]│   Encoders  │                 ↓                 │
│                 ↓                 │             │ PI² Reinforcement Learning        │
│ Subject-Independent Moment Model  │ <────────── │                 ↓                 │
│      [ESWA 2026 Breakthrough]     │   Adaptive  │ Assistive Joint Torque (τ_assist) │
└───────────────────────────────────┘    Torque   └───────────────────────────────────┘
                  ▲                                                 │
                  └──────────── Closed-Loop Mobility Matching ──────┘
                                  [IEEE/RSJ IROS 2025]
```

### The Core Problem
Human locomotion is driven by **joint moments** — the continuous net turning torque produced across the hip, knee, and ankle. Moments dictate musculoskeletal tissue loading, pathological gait compensation, and optimal exoskeleton torque delivery. Yet, measuring them traditionally demands optical motion capture cameras and force plates, making continuous estimation inaccessible in daily life.

### Breakthrough 1: Hip Moments from Bilateral Angles Alone (ESWA 2026)
In our work published in ***Expert Systems with Applications*** (2026), we demonstrated that continuous sagittal hip moments can be accurately estimated across **transitional steps** (starting, stopping, turning, cadence shifts) and steady-state gait using **bilateral hip encoder angles alone** — generalizing across unseen subjects without per-subject anthropometric calibration ($R^2 > 0.92$).

### Breakthrough 2: Compliant Exoskeleton Control via Hm-DMP & PI² (IROS 2025)
In our work presented at ***IEEE/RSJ IROS 2025***, we designed an adaptive control framework coupling **Harmonic Dynamic Movement Primitives (Hm-DMP)** with **Path Integral ($\text{PI}^2$) policy optimization**, achieving dynamic patient mobility matching and delivering compliant propulsive assistance during push-off ($45\% - 55\%$ gait cycle) without human-robot conflict.

### Breakthrough 3: MetaTran Multi-Scale Fatigue Dynamics (MST 2026)
In ***Measurement Science and Technology*** (2026), we introduced **MetaTran**, a hybrid transformer coupling 1D dilated convolutions with temporal self-attention for predictive structural and biomechanical fatigue life forecasting under embedded edge latency constraints ($<4\text{ ms}$).

---

## 📑 Flagship Publications

### 1. Subject-Independent Hip Moment Estimation
- **Title**: *Subject-independent hip moment estimation from bilateral hip angles in transitional and steady-state gait*
- **Authors**: Hamza Azam, Wenzhu Xu, Luying Feng, Canjun Yang, Mitja Geržević, Wei Yang
- **Journal**: *Expert Systems with Applications*, Vol. 318, p. 132047, 2026.
- **DOI**: [`10.1016/j.eswa.2026.132047`](https://doi.org/10.1016/j.eswa.2026.132047)

### 2. Exoskeleton Gait Adaptation via Hm-DMP & PI² Optimization
- **Title**: *Exoskeleton Gait Adaptation Framework via Hm-DMP and PI² Optimization for Dynamic Patient Mobility Matching*
- **Authors**: Qiaohuan Cao, Dewei Liu, Hamza Azam, Haoyu Wang, Wenzhu Xu, Jiongjie Fang, Wei Yang
- **Conference**: *2025 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)*, pp. 18188–18193.
- **DOI**: [`10.1109/IROS60139.2025.11247606`](https://doi.org/10.1109/IROS60139.2025.11247606)

### 3. MetaTran: Hybrid Transformers for Fatigue Life Prediction
- **Title**: *MetaTran: multivariate time series analysis with hybrid transformers for fatigue life prediction*
- **Authors**: Hafiz Muhammad Hamza Azam, Xiang Li, Wei Guo, Zhengguo Fu, Yang Zheng, Jinjie Zhou, Sajawal Gul Niazi, Tooba Shafique, Syed Abbas Ali Shah
- **Journal**: *Measurement Science and Technology*, Vol. 37, No. 14, p. 146102, 2026.
- **DOI**: [`10.1088/1361-6501/ae540b`](https://doi.org/10.1088/1361-6501/ae540b)

---

## 💼 Experience & Leadership

- **PhD Researcher** · Zhejiang University *(2022 – Present)*
  - Ningbo Global Innovation Center, Ningbo, China.
  - Musculoskeletal modeling, wearable robotics control, biomechanics of transitional gait.
- **Algorithm Engineer** · Jiangsu Dongyuan Xinsheng Technology *(2024 – 2025)*
  - Production machine-learning pipelines, signal processing, and low-latency edge deployment.
- **Editorial Leadership** · Khair Publications
  - Deputy Director, Content & Research. Manuscript evaluation, academic peer review, and scientific quality assurance.
- **Student & Community Leadership**
  - Country Representative for Pakistan at University of Electronic Science and Technology of China (UESTC).
  - Vice President & General Secretary of Blood Donating Society at Bahauddin Zakariya University (BZU).

---

## 🛠️ Technical Stack & Frameworks

- **Biomechanics & Modeling**: `OpenSim`, `MuJoCo`, `Inverse Dynamics`, `Hill-Type MTU`, `Gait Phase Segmentation`
- **Robotics & Control**: `Hm-DMP`, `PI² Optimization`, `Impedance Control`, `Series Elastic Actuators (SEA)`, `ROS 2`
- **Machine Learning & Time Series**: `PyTorch`, `Transformers (MetaTran)`, `Feature Engineering`, `Kalman Filtering`
- **Hardware & Instrumentation**: `Wearable IMU / Encoders`, `Force Plates`, `Motion Capture`, `Embedded C++ / Python`

---

## 📂 Repository Layout

```
mohamzaazam/
├── README.md                      # GitHub Profile README (renders on github.com/mohamzaazam)
├── index.html                     # Standalone Interactive Algorithmic CAD Dashboard
├── assets/
│   └── algorithmic-locomotion.svg # Precision vector CAD graphic with coordinate triads & state-space orbit
├── src/
│   ├── css/
│   │   └── kinematic-art.css      # Dark technical CAD drafting stylesheet
│   └── js/
│       ├── kinematics.js          # Continuous biomechanical kinematics solver
│       ├── state-space.js         # Hm-DMP phase portrait & limit-cycle generator
│       ├── renderer.js            # Algorithmic CAD wireframe canvas renderer
│       └── main.js                # UI controls, scrubber & presentation modal
├── embed/
│   └── snippet.html               # Responsive embed widget for mohamzaazam.github.io
├── docs/
│   ├── PRESENTATION_GUIDE.md      # Academic showcase & conference strategy guide
│   └── RESEARCH_NOTES.md          # Complete mathematical derivations & D-H parameters
├── pyproject.toml                 # Tooling configuration
└── .gitignore
```

---

## 📬 Contact & Collaboration

I am open to research collaborations on **musculoskeletal kinematics, exoskeleton control, and applied time-series analysis** — as well as postdoctoral and industry research opportunities.

- 🌐 **Personal Website**: [mohamzaazam.github.io](https://mohamzaazam.github.io)
- 📧 **Email**: [mohamzaazam@gmail.com](mailto:mohamzaazam@gmail.com)
- 🆔 **ORCID**: [0000-0002-3508-7332](https://orcid.org/0000-0002-3508-7332)
- 📚 **Google Scholar**: [Hamza Azam](https://scholar.google.com/citations?user=laEDQTkAAAAJ&hl=en)
