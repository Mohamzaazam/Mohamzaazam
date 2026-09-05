<p align="center">
  <img src="./assets/algorithmic-locomotion.svg" alt="Hamza Azam · Hybrid Biomechatronic Exoskeleton Walker &amp; Doctoral Research Dossier | Zhejiang University" width="100%">
</p>

<h1 align="center">Hamza Azam</h1>

<p align="center">
  <strong>PhD Researcher · Zhejiang University (Ningbo Global Innovation Center)</strong><br>
  <em>Biomechatronics · Musculoskeletal Modeling · Wearable Exoskeleton Control · Embedded Edge AI</em>
</p>

<p align="center">
  <a href="https://mohamzaazam.github.io"><img src="https://img.shields.io/badge/Website-Portfolio-181818?style=flat-square&logo=google-chrome&logoColor=white" alt="Personal Website"></a>
  <a href="https://scholar.google.com/citations?user=laEDQTkAAAAJ&hl=en"><img src="https://img.shields.io/badge/Google_Scholar-Citations-181818?style=flat-square&logo=google-scholar&logoColor=white" alt="Google Scholar"></a>
  <a href="https://orcid.org/0000-0002-3508-7332"><img src="https://img.shields.io/badge/ORCID-0000--0002--3508--7332-181818?style=flat-square&logo=orcid&logoColor=white" alt="ORCID"></a>
  <a href="mailto:hamza.azam@zju.edu.cn"><img src="https://img.shields.io/badge/Email-hamza.azam%40zju.edu.cn-181818?style=flat-square&logo=gmail&logoColor=white" alt="Email Contact"></a>
  <a href="https://www.linkedin.com/in/mohamzaazam/"><img src="https://img.shields.io/badge/LinkedIn-Profile-181818?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
</p>

---

> *"I work at the interface of human locomotion and robotic intelligence — inferring what the body's joints are doing from the sparse data that can be captured outside a laboratory, and using those dynamics to drive wearable exoskeletons that adaptively harmonize with human movement."*

---

## 👨‍🔬 About Me

I am a **Doctoral Researcher at Zhejiang University** (Ningbo Global Innovation Center), specializing in **biomechatronics, lower-limb wearable robotics, and applied deep learning for human movement**.

My work bridges theoretical biomechanics, dynamic robot control, and embedded systems engineering. Unlike conventional gait analysis that depends on room-sized optical motion capture laboratories and ground reaction force plates, my research focuses on **inferring internal, unobservable biomechanical states** (joint moments, limb loading, muscle synergies) directly from **on-body wearable sensors and exoskeleton joint encoders**.

### 💼 Professional Trajectory
- **Doctoral Researcher** · *Zhejiang University* (Ningbo Global Innovation Center)
  - Researching subject-independent inverse dynamics, non-steady-state locomotion modeling, and patient-adaptive exoskeleton control policies.
- **Algorithm Engineer** · *Jiangsu Dongyuan Xinsheng Technology*
  - Led the end-to-end translation of signal processing and machine learning pipelines from research-grade prototypes down to resource-constrained embedded edge hardware.
- **Master's in Engineering** · *Nondestructive Evaluation & Sensor Physics*
  - Characterized steel microstructure, stress concentrations, and material state dynamics using magnetic Barkhausen noise (MBN) and multi-frequency electromagnetic sensing.
- **Editorial & Research Leadership** · *Khair Publications*
  - Deputy Director (Content & Research), directing technical peer review and scholarly publications.

---

## 🛠️ Services Offered

I provide end-to-end **Research & Development (R&D)** consultation and **Technical & Software Development** services across biomechanics, robotics, edge intelligence, and scientific computing:

### 🔬 1. Research & Development (R&D) Services
- **Biomechatronics & Gait Biomechanics R&D**:
  - Musculoskeletal kinematic and inverse dynamic modeling (Newton-Euler formulations, OpenSim simulation pipelines).
  - Continuous joint moment estimation from minimal sensor suites (wearable rotary encoders, IMU arrays).
  - Transitional gait analysis (speed transitions, starting, stopping, terrain variations).
- **Wearable Robotics & Exoskeleton Control R&D**:
  - Adaptive assistance strategies: Harmonic Dynamic Movement Primitives (Hm-DMP), impedance/admittance controllers, and Path Integral ($\text{PI}^2$) reinforcement learning.
  - Zero-calibration, subject-independent control architectures that generalize across unseen body morphologies.
  - Human-robot interaction optimization: metabolic expenditure minimization and compliant terminal push-off assistance.
- **Applied Deep Learning & Time-Series Modeling R&D**:
  - Custom neural network design for physiological and physical time-series (Transformers, Multi-Head Attention, 1D-Dilated Convolutions, LSTMs, Physics-Informed Neural Networks).
  - Multi-scale structural and biological fatigue life prediction under cyclic mechanical loading.
- **Academic & Scientific Consulting**:
  - Grant proposal formulation, high-impact manuscript preparation (IEEE, Elsevier, IOP), peer review, and mathematical formulation of complex dynamic systems.

### 💻 2. Engineering & Technical Development Services ("Other Development")
- **Embedded Edge AI & Firmware Deployment**:
  - Model quantization, pruning, and low-latency deployment on ARM Cortex-M microcontrollers, DSPs, STM32, and NVIDIA Jetson platforms.
  - Hard real-time inference execution ($<4\text{ ms}$ latency) for $>250\text{ Hz}$ closed-loop robot control loops.
- **Full-Stack Scientific Software & Simulation Engines**:
  - Production-grade scientific software in Python, C/C++, and MATLAB/Simulink.
  - Interactive browser-based telemetry dashboards, WebGL/Canvas CAD simulations, and vector graphics engines.
  - ROS / ROS2 robotics packages for real-time sensor ingestion, state estimation, and actuator dispatch.
- **Sensor Fusion & Hardware-in-the-Loop (HIL) Prototyping**:
  - Multi-sensor integration: optical encoders, 6-DoF/9-DoF IMUs, load cells, strain gauges, and surface electromyography (sEMG).
  - Industrial bus communication: CAN bus (CANopen), EtherCAT, SPI, I2C, and UART serial protocols.
- **Technical Architecture & Systems Engineering**:
  - Translation of whiteboard mathematical formulations into robust, test-driven industrial software architectures.

---

## 📚 Flagship Research & Publications

My doctoral and engineering research has yielded high-impact peer-reviewed publications across leading international journals and robotics conferences:

### 1. Subject-Independent Hip Moment Estimation (ESWA 2026)
- **Title**: *Subject-independent hip moment estimation from bilateral hip angles in transitional and steady-state gait*
- **Journal**: *Expert Systems with Applications* (Elsevier), Vol. 318, p. 132047, 2026.
- **DOI**: [`10.1016/j.eswa.2026.132047`](https://doi.org/10.1016/j.eswa.2026.132047)
- **Key Breakthrough**: Infers continuous sagittal hip moments $\tau_{\text{hip}}(t)$ using **only bilateral hip encoder angles** ($\theta_L, \theta_R$), completely bypassing optical motion capture and force plates. Validated on Leave-One-Subject-Out Cross-Validation (**$R^2 > 0.92$**) across transitional strides (starting, stopping, acceleration) without requiring per-subject anthropometric calibration.

### 2. Dynamic Exoskeleton Gait Adaptation (IEEE/RSJ IROS 2025)
- **Title**: *Exoskeleton Gait Adaptation Framework via Hm-DMP and PI² Optimization for Dynamic Patient Mobility Matching*
- **Conference**: *IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS 2025)*, pp. 18188–18193.
- **DOI**: [`10.1109/IROS60139.2025.11247606`](https://doi.org/10.1109/IROS60139.2025.11247606)
- **Key Breakthrough**: Formulates a Harmonic Dynamic Movement Primitive (Hm-DMP) framework combined with Path Integral ($\text{PI}^2$) policy learning. Establishes a compliant limit-cycle attractor that dynamically synchronizes with human cadence, mitigates "human-robot fighting", and delivers compliant assistive torque precisely during terminal push-off ($45\% - 55\%$ gait phase).

### 3. MetaTran: Hybrid Transformers for Fatigue Life Prediction (MST 2026)
- **Title**: *MetaTran: multivariate time series analysis with hybrid transformers for fatigue life prediction*
- **Journal**: *Measurement Science and Technology* (IOP Science), Vol. 37, No. 14, p. 146102, 2026.
- **DOI**: [`10.1088/1361-6501/ae540b`](https://doi.org/10.1088/1361-6501/ae540b)
- **Key Breakthrough**: Combines multi-scale 1D-dilated convolutions (capturing high-frequency heel-strike impact shocks) with temporal self-attention blocks (modeling long-term cyclic degradation). Features optimized quantization yielding sub-$4\text{ ms}$ inference on wearable edge microprocessors.

---

## 🔬 Core Research Pillars

```
                     ┌─────────────────────────────────────────────────────────┐
                     │          HUMAN LOCOMOTION & WEARABLE ROBOTICS           │
                     └────────────────────────────┬────────────────────────────┘
                                                  │
          ┌───────────────────────────────────────┼───────────────────────────────────────┐
          │                                       │                                       │
          ▼                                       ▼                                       ▼
┌───────────────────┐                   ┌───────────────────┐                   ┌───────────────────┐
│   UNOBSERVABLE    │                   │ ADAPTIVE ROBOTIC  │                   │   EMBEDDED EDGE   │
│  STATE ESTIMATION │                   │    ASSISTANCE     │                   │   INTELLIGENCE    │
│   (ESWA 2026)     │                   │   (IROS 2025)     │                   │    (MST 2026)     │
├───────────────────┤                   ├───────────────────┤                   ├───────────────────┤
│ • Bilateral Encod-│                   │ • Hm-DMP Attractor│                   │ • MetaTran Hybrid │
│   ers (θ_L, θ_R)  │                   │   Dynamics        │                   │   Transformer     │
│ • No Force Plates │                   │ • PI² Optimization│                   │ • Multi-Scale 1D  │
│ • Transitional &  │                   │ • Compliant Push- │                   │   Dilated Convs   │
│   Steady Gait     │                   │   Off Assistance  │                   │ • < 4ms Latency   │
│ • R² > 0.92       │                   │ • Zero "Fighting" │                   │ • Edge MCU Ready  │
└───────────────────┘                   └───────────────────┘                   └───────────────────┘
```

---

## 🧰 Technical Competencies & Toolchain

| Domain | Tools, Frameworks & Languages |
| :--- | :--- |
| **Programming & Computing** | Python, C/C++, MATLAB, Simulink, TypeScript/JavaScript, Bash |
| **Robotics & Simulation** | ROS / ROS2, OpenSim, Gazebo, MuJoCo, Simscape Multibody, URDF |
| **Machine Learning & AI** | PyTorch, TensorFlow, TensorRT, ONNX Runtime, SciPy, Scikit-Learn |
| **Embedded & Hardware** | ARM Cortex-M, NVIDIA Jetson, STM32, CAN bus, EtherCAT, IMU/Encoder Telemetry |
| **Data & Scientific Viz** | NumPy, Pandas, Matplotlib, Plotly, HTML5 Canvas / WebGL, SVG Vector Engines |

---

## 🤝 Connect & Collaborate

I welcome discussions regarding **academic research collaborations, postdoctoral opportunities, industrial R&D projects, and technical consulting**:

- 🌐 **Personal Website**: [mohamzaazam.github.io](https://mohamzaazam.github.io)
- 🎓 **Google Scholar**: [Hamza Azam](https://scholar.google.com/citations?user=laEDQTkAAAAJ&hl=en)
- 🆔 **ORCID**: [0000-0002-3508-7332](https://orcid.org/0000-0002-3508-7332)
- 💼 **LinkedIn**: [linkedin.com/in/mohamzaazam](https://www.linkedin.com/in/mohamzaazam/)
- ✉️ **Email**: [hamza.azam@zju.edu.cn](mailto:hamza.azam@zju.edu.cn)
