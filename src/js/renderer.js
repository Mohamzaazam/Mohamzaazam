/**
 * Hamza Azam · Algorithmic Kinematic Wireframe & State-Space Geometry Renderer
 * Precision HTML5 Canvas CAD drafting engine for co-simulation locomotion.
 * Zhejiang University · Ningbo Global Innovation Center
 */

class CadRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stateSpace = new (window.StateSpaceVisualizer || require('./state-space').StateSpaceVisualizer)();
  }

  /**
   * Main render method invoked on every animation frame.
   */
  render(state) {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    const groundY = h - 75;

    ctx.clearRect(0, 0, w, h);

    // 1. Technical CAD Millimeter Grid
    this.drawCadGrid(w, h);

    // 2. Precision Ground Datum Line & Millimeter Ticks
    this.drawGroundDatum(w, groundY);

    // 3. Kinematic Solvers
    const k = (window.KinematicsEngine || require('./kinematics')).getKinematics(state.phase, state.walkSpeed);
    const solveChain = (window.KinematicsEngine || require('./kinematics')).solveKinematicChain;

    const bioX = state.viewMode === 'bio' ? w / 2 : (state.viewMode === 'both' ? 240 : -999);
    const exoX = state.viewMode === 'exo' ? w / 2 : (state.viewMode === 'both' ? w - 240 : -999);
    const centerOrbX = w / 2;
    const centerOrbY = groundY - 180;

    // 4. Render Neuromusculoskeletal Model
    if (state.viewMode === 'both' || state.viewMode === 'bio') {
      const bioFront = solveChain(bioX, groundY, k, false);
      const bioBack = solveChain(bioX, groundY, k, true);
      this.drawMusculoskeletalModel(bioX, groundY, k, bioFront, bioBack, state);
    }

    // 5. Render Wearable Powered Exoskeleton
    if (state.viewMode === 'both' || state.viewMode === 'exo') {
      const exoFront = solveChain(exoX, groundY, k, false);
      const exoBack = solveChain(exoX, groundY, k, true);
      this.drawExoskeletonModel(exoX, groundY, k, exoFront, exoBack, state);
    }

    // 6. Render State-Space Phase Portrait (In Center when in Coupled mode)
    if (state.viewMode === 'both') {
      this.stateSpace.render(ctx, centerOrbX, centerOrbY, 190, k);
      this.drawCoSimulationStreams(bioX, exoX, centerOrbX, centerOrbY);
    } else {
      // In single view mode, render state space in corner
      this.stateSpace.render(ctx, w - 120, 115, 170, k);
    }
  }

  /**
   * Draws fine blueprint background grid with millimeter divisions.
   */
  drawCadGrid(w, h) {
    const { ctx } = this;
    ctx.save();

    // Fine grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 0.6;
    const step = 20;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Major grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)';
    ctx.lineWidth = 1.0;
    const majorStep = 100;
    for (let x = 0; x < w; x += majorStep) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += majorStep) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Top Datum Ruler
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, 18); ctx.lineTo(w - 20, 18); ctx.stroke();
    for (let x = 20; x <= w - 20; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x, 22); ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draws ground datum line with millimeter calibration ticks.
   */
  drawGroundDatum(w, groundY) {
    const { ctx } = this;
    ctx.save();

    // Gradient Ground Plane
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'rgba(239, 68, 68, 0.1)');
    grad.addColorStop(0.3, 'rgba(239, 68, 68, 0.8)');
    grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.9)');
    grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.8)');
    grad.addColorStop(1, 'rgba(6, 182, 212, 0.1)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(30, groundY); ctx.lineTo(w - 30, groundY); ctx.stroke();

    // Ground Calibration Ticks
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w - 40; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, groundY); ctx.lineTo(x, groundY + 6); ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Renders the Neuromusculoskeletal Kinematic Wireframe with muscle action cables.
   */
  drawMusculoskeletalModel(cx, groundY, k, front, back, state) {
    const { ctx } = this;
    ctx.save();

    // 1. Back Arm
    this.drawLimb(back.shoulder, back.elbow, back.wrist, '#475569', 3.0, 0.35);

    // 2. Back Leg (Femur & Tibia)
    this.drawLimb(back.hip, back.knee, back.ankle, '#94a3b8', 4.5, 0.35);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(back.heel.x, back.heel.y); ctx.lineTo(back.toe.x, back.toe.y); ctx.stroke();

    // 3. Torso: Spine Column with traveling Action Potential
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(cx, front.pelvisY); ctx.lineTo(cx, front.shoulderY); ctx.stroke();

    // Neural Pulse Traveling
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 12]);
    ctx.lineDashOffset = -(state.phase * 40);
    ctx.beginPath(); ctx.moveTo(cx, front.shoulderY); ctx.lineTo(cx, front.pelvisY); ctx.stroke();
    ctx.setLineDash([]);

    // Pelvis Bone Ring
    ctx.fillStyle = 'rgba(203, 213, 225, 0.25)';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, front.pelvisY, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Skull Outline
    ctx.fillStyle = 'rgba(248, 250, 252, 0.15)';
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(cx, front.shoulderY - 32, 11, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 4. Front Leg: Muscle Lines of Action Force Cables
    const isPushOff = state.phase >= 0.35 && state.phase <= 0.55;
    const isStance = state.phase <= 0.60;

    // Rectus Femoris (Anterior Thigh Cable)
    ctx.strokeStyle = isStance ? '#ef4444' : 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = isStance ? 3.5 : 2.2;
    ctx.beginPath();
    ctx.moveTo(front.hip.x - 6, front.hip.y + 4);
    ctx.quadraticCurveTo(
      front.hip.x - 16 * Math.cos(front.hipAngle),
      (front.hip.y + front.knee.y) / 2,
      front.knee.x - 3,
      front.knee.y - 4
    );
    ctx.stroke();

    // Hamstrings (Posterior Thigh Cable)
    ctx.strokeStyle = isStance ? '#f97316' : 'rgba(249, 115, 22, 0.5)';
    ctx.lineWidth = isStance ? 3.2 : 2.0;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(front.hip.x + 6, front.hip.y + 6);
    ctx.quadraticCurveTo(
      front.hip.x + 14 * Math.cos(front.hipAngle),
      (front.hip.y + front.knee.y) / 2,
      front.knee.x + 3,
      front.knee.y - 2
    );
    ctx.stroke();
    ctx.setLineDash([]);

    // Gastrocnemius (Calf Cable)
    ctx.strokeStyle = isPushOff ? '#fbbf24' : '#ef4444';
    ctx.lineWidth = isPushOff ? 4.0 : 2.5;
    ctx.beginPath();
    ctx.moveTo(front.knee.x + 2, front.knee.y + 4);
    ctx.quadraticCurveTo(
      front.knee.x + 16 * Math.cos(front.shankAngle),
      (front.knee.y + front.ankle.y) / 2,
      front.heel.x + 1,
      front.heel.y - 4
    );
    ctx.stroke();

    // 5. Front Bones
    this.drawLimb(front.hip, front.knee, front.ankle, '#f1f5f9', 6.0, 1.0);
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(front.heel.x, front.heel.y); ctx.lineTo(front.toe.x, front.toe.y); ctx.stroke();

    // 6. Coordinate Reference Triads (Hip & Knee)
    this.drawCoordinateTriad(front.hipTriad, 'H{1}');
    this.drawCoordinateTriad(front.kneeTriad, 'K{2}');
    this.drawCoordinateTriad(front.ankleTriad, 'A{3}');

    // 7. Front Arm
    this.drawLimb(front.shoulder, front.elbow, front.wrist, '#cbd5e1', 3.5, 1.0);

    // 8. Labels
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NEUROMUSCULOSKELETAL MODEL', cx, groundY + 28);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9.5px monospace';
    ctx.fillText('ESWA 2026 · Inverse Dynamics', cx, groundY + 44);

    ctx.restore();
  }

  /**
   * Renders the Wearable Powered Exoskeleton with actuator gearheads and torque vectors.
   */
  drawExoskeletonModel(cx, groundY, k, front, back, state) {
    const { ctx } = this;
    ctx.save();

    // 1. Back Robotic Arm
    this.drawLimb(back.shoulder, back.elbow, back.wrist, '#334155', 4.5, 0.4);

    // 2. Back Robotic Leg
    this.drawLimb(back.hip, back.knee, back.ankle, '#1e293b', 7.5, 0.35);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(back.hip.x, back.hip.y); ctx.lineTo(back.knee.x, back.knee.y); ctx.lineTo(back.ankle.x, back.ankle.y); ctx.stroke();

    // 3. Exoskeleton Rigid Spine & Pelvic Chassis Hub
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(cx - 4, front.pelvisY - 75); ctx.lineTo(cx, front.pelvisY); ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.fillRect(cx - 16, front.pelvisY - 60, 18, 64);
    ctx.strokeRect(cx - 16, front.pelvisY - 60, 18, 64);

    // Status LEDs
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(cx - 7, front.pelvisY - 40, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(cx - 7, front.pelvisY - 30, 2.5, 0, Math.PI * 2); ctx.fill();

    // Pilot Cybernetic Visor
    ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(cx - 12, front.shoulderY - 42, 24, 26, 4);
    ctx.fill();
    ctx.stroke();

    // 4. Front Carbon-Fiber Structural Spars
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(front.hip.x, front.hip.y); ctx.lineTo(front.knee.x, front.knee.y); ctx.stroke();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(front.hip.x, front.hip.y); ctx.lineTo(front.knee.x, front.knee.y); ctx.stroke();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(front.knee.x, front.knee.y); ctx.lineTo(front.ankle.x, front.ankle.y); ctx.stroke();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(front.knee.x, front.knee.y); ctx.lineTo(front.ankle.x, front.ankle.y); ctx.stroke();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(front.heel.x, front.heel.y); ctx.lineTo(front.toe.x, front.toe.y); ctx.stroke();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(front.heel.x, front.heel.y); ctx.lineTo(front.toe.x, front.toe.y); ctx.stroke();

    // 5. Actuator Gearheads (Concentric CAD circles)
    // Hip Actuator
    this.drawActuatorHousing(front.hip.x, front.hip.y, 14, '#38bdf8', '#fbbf24');
    // Knee SEA Actuator
    this.drawActuatorHousing(front.knee.x, front.knee.y, 13, '#06b6d4', '#10b981');

    // 6. Active Assistive Torque Arc (Active during terminal stance push-off 0.28 - 0.58)
    if (state.phase >= 0.28 && state.phase <= 0.58) {
      const torqueMag = Math.sin((state.phase - 0.28) / 0.30 * Math.PI);
      ctx.strokeStyle = `rgba(56, 189, 248, ${torqueMag.toFixed(2)})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(front.hip.x, front.hip.y, 22, -Math.PI * 0.8, Math.PI * 0.2);
      ctx.stroke();

      // Torque label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`+${(state.maxTorqueGain * torqueMag).toFixed(0)} N·m`, front.hip.x + 24, front.hip.y - 12);
    }

    // 7. Ground Reaction Force Vector (GRF) during stance
    if (state.phase >= 0.05 && state.phase <= 0.55) {
      const grfMag = Math.sin((state.phase - 0.05) / 0.50 * Math.PI);
      ctx.strokeStyle = `rgba(16, 185, 129, ${grfMag.toFixed(2)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(front.toe.x, front.toe.y);
      ctx.lineTo(front.toe.x - 12 * grfMag, front.toe.y - 42 * grfMag);
      ctx.stroke();
    }

    // 8. Coordinate Triads
    this.drawCoordinateTriad(front.hipTriad, 'H_exo');
    this.drawCoordinateTriad(front.kneeTriad, 'K_exo');

    // 9. Front Robotic Arm
    this.drawLimb(front.shoulder, front.elbow, front.wrist, '#475569', 5.0, 1.0);

    // 10. Labels
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POWERED EXOSKELETON', cx, groundY + 28);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9.5px monospace';
    ctx.fillText('IROS 2025 · Hm-DMP & PI²', cx, groundY + 44);

    ctx.restore();
  }

  drawLimb(p1, p2, p3, strokeStyle, lineWidth, opacity) {
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();
    ctx.restore();
  }

  drawCoordinateTriad(triad, label) {
    const { ctx } = this;
    ctx.save();
    // X Axis (Red)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(triad.ox, triad.oy); ctx.lineTo(triad.xx, triad.xy); ctx.stroke();
    // Y Axis (Green)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(triad.ox, triad.oy); ctx.lineTo(triad.yx, triad.yy); ctx.stroke();
    // Pivot dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(triad.ox, triad.oy, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  drawActuatorHousing(x, y, radius, outerColor, innerColor) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = '#0b1329';
    ctx.strokeStyle = outerColor;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.strokeStyle = innerColor;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = outerColor;
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  drawCoSimulationStreams(bioX, exoX, midX, midY) {
    const { ctx } = this;
    ctx.save();
    // Bio -> Estimator Data Stream
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(bioX + 25, midY - 20);
    ctx.lineTo(midX - 100, midY - 20);
    ctx.stroke();

    // Controller -> Exo Torque Stream
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.beginPath();
    ctx.moveTo(midX + 100, midY + 20);
    ctx.lineTo(exoX - 25, midY + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }
}

// Module export & browser window fallback
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CadRenderer };
} else {
  window.CadRenderer = CadRenderer;
}
