<p align="center">
  <img src="./assets/algorithmic-locomotion.svg" alt="Codex Locomotionis: Vitruvian Biomechatronics &amp; Exoskeleton Automaton Co-Simulation" width="100%">
</p>

<h1 align="center">Hamza Azam</h1>

<p align="center">
  <strong>PhD Researcher · Zhejiang University (Ningbo Global Innovation Center)</strong><br>
  <em>Musculoskeletal Modeling · Gait Analysis · Lower-Limb Exoskeleton Control · Deep Learning for Locomotion</em>
</p>

<p align="center">
  <a href="https://mohamzaazam.github.io"><img src="https://img.shields.io/badge/Website-mohamzaazam.github.io-b87333?style=flat-square&logo=google-chrome&logoColor=white" alt="Personal Website"></a>
  <a href="https://orcid.org/0000-0002-3508-7332"><img src="https://img.shields.io/badge/ORCID-0000--0002--3508--7332-d4af37?style=flat-square&logo=orcid&logoColor=white" alt="ORCID"></a>
  <a href="https://scholar.google.com/citations?user=laEDQTkAAAAJ&hl=en"><img src="https://img.shields.io/badge/Google_Scholar-Citations-8c5a2b?style=flat-square&logo=google-scholar&logoColor=white" alt="Google Scholar"></a>
</p>

---

> *"I work on the mechanics of human movement — inferring what the body's joints are doing from the little that can be measured outside a laboratory, and using it to drive wearable robotic exoskeletons that assist real people."*

---

## 🔬 Research Focus

My doctoral research at **Zhejiang University** unites **musculoskeletal kinematics**, **machine learning**, and **adaptive exoskeleton control**:

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

### Breakthroughs
1. **Subject-Independent Hip Moment Estimation (*Expert Systems with Applications*, 2026)**: Estimating continuous sagittal hip moments across transitional steps (starting, stopping, turning) and steady walking from bilateral encoder angles alone ($R^2 > 0.92$), without optical motion capture, force plates, or per-subject calibration.
2. **Compliant Exoskeleton Adaptation via Hm-DMP & $\text{PI}^2$ (*IEEE/RSJ IROS 2025*)**: Harmonizing human and robot movement by coupling Harmonic Dynamic Movement Primitives with Path Integral policy optimization to deliver compliant assistance during propulsive push-off ($40\% - 58\%$ gait cycle).
3. **MetaTran Multi-Scale Fatigue Dynamics (*Measurement Science and Technology*, 2026)**: Hybrid 1D-dilated convolution and self-attention transformer for predictive joint and material fatigue life under low edge latency ($<4\text{ ms}$).

---

## 📑 Flagship Publications

1. **Subject-independent hip moment estimation from bilateral hip angles in transitional and steady-state gait**  
   *Hamza Azam, Wenzhu Xu, Luying Feng, Canjun Yang, Mitja Geržević, Wei Yang*  
   **Expert Systems with Applications**, Vol. 318, p. 132047, 2026.  
   DOI: [`10.1016/j.eswa.2026.132047`](https://doi.org/10.1016/j.eswa.2026.132047)

2. **Exoskeleton Gait Adaptation Framework via Hm-DMP and PI² Optimization for Dynamic Patient Mobility Matching**  
   *Qiaohuan Cao, Dewei Liu, Hamza Azam, Haoyu Wang, Wenzhu Xu, Jiongjie Fang, Wei Yang*  
   **IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS 2025)**, pp. 18188–18193.  
   DOI: [`10.1109/IROS60139.2025.11247606`](https://doi.org/10.1109/IROS60139.2025.11247606)

3. **MetaTran: multivariate time series analysis with hybrid transformers for fatigue life prediction**  
   *Hafiz Muhammad Hamza Azam, Xiang Li, Wei Guo, Zhengguo Fu, Yang Zheng, Jinjie Zhou, Sajawal Gul Niazi, Tooba Shafique, Syed Abbas Ali Shah*  
   **Measurement Science and Technology**, Vol. 37, No. 14, p. 146102, 2026.  
   DOI: [`10.1088/1361-6501/ae540b`](https://doi.org/10.1088/1361-6501/ae540b)

---

## 🛠️ Technical Expertise

- **Biomechanics**: Musculoskeletal Modeling, OpenSim, Inverse Dynamics, Sagittal Gait Phase Segmentation.
- **Control & Robotics**: Harmonic DMP (Hm-DMP), $\text{PI}^2$ Reinforcement Learning, Series Elastic Actuators (SEA).
- **Machine Learning**: Hybrid Transformers, Time-Series Forecasting, Wearable IMU/Encoder Signal Processing.
