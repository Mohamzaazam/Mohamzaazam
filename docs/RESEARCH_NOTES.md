# 📐 Biomechatronics & Kinematic Control Research Formulations
**Doctoral Research Compendium · Hamza Azam · Zhejiang University**  
*Ningbo Global Innovation Center · Musculoskeletal Modeling & Wearable Robotics*

---

## 1. Subject-Independent Hip Moment Estimation (ESWA 2026)
- **Publication**: *Subject-independent hip moment estimation from bilateral hip angles in transitional and steady-state gait*
- **Journal**: *Expert Systems with Applications*, Vol. 318, p. 132047, 2026.
- **DOI**: [`10.1016/j.eswa.2026.132047`](https://doi.org/10.1016/j.eswa.2026.132047)

### 1.1 The Kinematic Mapping Problem
Traditional inverse dynamics computes joint moments $\boldsymbol{\tau} \in \mathbb{R}^n$ via recursive Newton-Euler equations:
$$\mathbf{M}(\mathbf{q})\ddot{\mathbf{q}} + \mathbf{C}(\mathbf{q}, \dot{\mathbf{q}})\dot{\mathbf{q}} + \mathbf{G}(\mathbf{q}) = \boldsymbol{\tau} + \mathbf{J}_c^T \mathbf{F}_{\text{GRF}}$$
where:
- $\mathbf{q} = [\theta_{\text{hip}}, \theta_{\text{knee}}, \theta_{\text{ankle}}]^T$ denotes generalised joint coordinates,
- $\mathbf{F}_{\text{GRF}}$ is the ground reaction force vector from multi-axis force plates,
- $\mathbf{J}_c$ is the contact Jacobian matrix.

### 1.2 The Breakthrough: Unobservable State Estimation
Outside motion capture laboratories, $\mathbf{F}_{\text{GRF}}$ and full-body marker positions are inaccessible. Wearable exoskeletons natively capture only bilateral encoder angles:
$$\mathbf{x}(t) = \big[\theta_L(t),\, \theta_R(t),\, \dot{\theta}_L(t),\, \dot{\theta}_R(t)\big]^T \in \mathbb{R}^4$$
Our formulation designs a non-linear mapping $\mathcal{F}_\Theta: \mathbb{R}^{4 \times W} \to \mathbb{R}$ over a sliding time-horizon $W$:
$$\hat{\tau}_{\text{hip}}(t) = \mathcal{F}_\Theta\Big(\{\mathbf{x}(t - \tau)\}_{\tau=0}^{W-1}\Big)$$
- **Transitional Invariance**: Validated across acceleration, deceleration, initiation, termination, and turns ($R^2 > 0.92$).
- **Subject Independence**: Evaluated on Leave-One-Subject-Out Cross-Validation (LOSOCV) without requiring subject-specific anthropometric re-calibration.

---

## 2. Exoskeleton Gait Adaptation via Hm-DMP & $\text{PI}^2$ (IROS 2025)
- **Publication**: *Exoskeleton Gait Adaptation Framework via Hm-DMP and PI² Optimization for Dynamic Patient Mobility Matching*
- **Conference**: *2025 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)*, pp. 18188–18193.
- **DOI**: [`10.1109/IROS60139.2025.11247606`](https://doi.org/10.1109/IROS60139.2025.11247606)

### 2.1 Harmonic Dynamic Movement Primitives (Hm-DMP)
To produce stable, rhythmic limit-cycle locomotion that adapts to human cadence perturbations, the joint trajectory is governed by a modified harmonic non-linear dynamical system:
$$\begin{aligned}
\dot{\phi} &= \omega + \mathbf{K}_\phi \cdot \varepsilon_{\text{human}}(t) \\
\tau \ddot{y} &= \alpha_z \big(\beta_z (g - y) - \dot{y}\big) + f(\phi) \\
f(\phi) &= \frac{\sum_{i=1}^N \psi_i(\phi) w_i}{\sum_{i=1}^N \psi_i(\phi)} r
\end{aligned}$$
where:
- $\phi$ is the canonical phase angle ($\phi \in [0, 2\pi)$),
- $\omega$ is the intrinsic stride frequency,
- $\psi_i(\phi) = \exp\big(-h_i (\cos(\phi - c_i) - 1)\big)$ are von Mises periodic radial basis kernels,
- $w_i$ are adjustable shape weights,
- $r$ is the amplitude scaling factor.

### 2.2 Path Integral Policy Optimization ($\text{PI}^2$)
To dynamically match individual patient mobility without manual parameter tuning, the weights $\mathbf{w}$ are updated via continuous reinforcement learning:
$$\delta \mathbf{w}_i = \int P_i(\tau) \mathbf{M}_t d\tau, \quad P_i(\tau) = \frac{\exp\big(-\frac{1}{\lambda} S(\tau_i)\big)}{\sum_k \exp\big(-\frac{1}{\lambda} S(\tau_k)\big)}$$
with the cost functional penalizing human-robot interaction forces and metabolic expenditure:
$$S = \int_{0}^{T} \Big( c_1 \|\tau_{\text{interaction}}(t)\|^2 + c_2 \|\dot{\mathbf{q}}_{\text{error}}(t)\|^2 + c_3 u(t)^T \mathbf{R} u(t) \Big) dt$$
Assistance torque $\tau_{\text{assist}}$ peaks compliantly during terminal stance ($45\% - 55\%$ gait cycle) delivering propulsive push-off without fighting limb deceleration during swing.

---

## 3. MetaTran: Hybrid Transformers for Fatigue Life Prediction (MST 2026)
- **Publication**: *MetaTran: multivariate time series analysis with hybrid transformers for fatigue life prediction*
- **Journal**: *Measurement Science and Technology*, Vol. 37, No. 14, p. 146102, 2026.
- **DOI**: [`10.1088/1361-6501/ae540b`](https://doi.org/10.1088/1361-6501/ae540b)

### 3.1 Dual Attention Architecture
Exoskeleton actuators and human musculoskeletal tissues experience non-linear multi-axial fatigue under cyclical walking impacts. MetaTran integrates:
1. **Multi-Scale 1D Dilated Convolutions**: Capturing transient high-frequency impact peaks (heel strike shock waves, $\Delta t < 20\text{ ms}$).
2. **Multi-Head Self-Attention Blocks**: Modelling long-range temporal dependencies across consecutive stride cycles:
   $$\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\left(\frac{\mathbf{Q}\mathbf{K}^T}{\sqrt{d_k}} + \mathbf{M}_{\text{temporal}}\right)\mathbf{V}$$
3. **Embedded Inference Latency**: Optimized model quantization providing $<4\text{ ms}$ forward-pass execution on wearable edge microprocessors (ARM Cortex-M7 / NVIDIA Jetson Orin).

---

## 4. Denavit-Hartenberg (D-H) Kinematic Parameters

| Joint $i$ | Link Description | Axis $\hat{z}_i$ | Joint Angle $\theta_i$ | Link Offset $d_i$ | Link Length $a_i$ | Twist Angle $\alpha_i$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0 $\to$ 1** | Pelvis to Hip | Sagittal rotation | $\theta_{\text{hip}}(t)$ | $0$ | $L_{\text{thigh}} \approx 0.44\text{ m}$ | $0$ |
| **1 $\to$ 2** | Thigh to Knee | Sagittal rotation | $\theta_{\text{knee}}(t)$ | $0$ | $L_{\text{shank}} \approx 0.43\text{ m}$ | $0$ |
| **2 $\to$ 3** | Shank to Ankle | Sagittal rotation | $\theta_{\text{ankle}}(t)$ | $0$ | $L_{\text{foot}} \approx 0.20\text{ m}$ | $-90^\circ$ |

Homogeneous coordinate transformation between successive frames:
$$\mathbf{T}_i^{i-1} = \begin{bmatrix}
\cos\theta_i & -\sin\theta_i \cos\alpha_i & \sin\theta_i \sin\alpha_i & a_i \cos\theta_i \\
\sin\theta_i & \cos\theta_i \cos\alpha_i & -\cos\theta_i \sin\alpha_i & a_i \sin\theta_i \\
0 & \sin\alpha_i & \cos\alpha_i & d_i \\
0 & 0 & 0 & 1
\end{bmatrix}$$
