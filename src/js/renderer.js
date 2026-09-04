/**
 * Hamza Azam · Vitruvian Biomechatronics & Renaissance Codex Canvas Renderer
 * Leonardo da Vinci Anatomical Study & Clockwork Automaton Co-Simulation Engine
 * Zhejiang University · Ningbo Global Innovation Center
 */

class CadRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    const StateSpaceClass = (typeof window !== 'undefined' && window.StateSpaceVisualizer)
      ? window.StateSpaceVisualizer
      : require('./state-space').StateSpaceVisualizer;
    this.stateSpace = new StateSpaceClass();
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

    // 1. Aged Renaissance Codex Parchment & Vitruvian Geometry
    this.drawCodexParchment(w, h);

    // 2. Antique Engraved Copperplate Ground Datum Baseline (with synchronized treadmill track ticks)
    this.drawCopperplateDatum(w, groundY, state.phase);

    // 3. Kinematic Solvers
    const kinEngine = (typeof window !== 'undefined' && window.KinematicsEngine)
      ? window.KinematicsEngine
      : require('./kinematics');
    const k = kinEngine.getKinematics(state.phase, state.walkSpeed);
    const solveChain = kinEngine.solveKinematicChain;

    const bioX = state.viewMode === 'bio' ? w / 2 : (state.viewMode === 'both' ? 240 : -999);
    const exoX = state.viewMode === 'exo' ? w / 2 : (state.viewMode === 'both' ? w - 240 : -999);
    const centerOrbX = w / 2;
    const centerOrbY = groundY - 185;

    // 4. Render Biological Anatomical Model (Leonardo da Vinci Codex Style)
    if (state.viewMode === 'both' || state.viewMode === 'bio') {
      const bioFront = solveChain(bioX, groundY, k, false);
      const bioBack = solveChain(bioX, groundY, k, true);
      this.drawAnatomicalVitruvianModel(bioX, groundY, k, bioFront, bioBack, state);
    }

    // 5. Render Wearable Powered Exoskeleton (Renaissance Clockwork Automaton)
    if (state.viewMode === 'both' || state.viewMode === 'exo') {
      const exoFront = solveChain(exoX, groundY, k, false);
      const exoBack = solveChain(exoX, groundY, k, true);
      this.drawClockworkAutomatonModel(exoX, groundY, k, exoFront, exoBack, state);
    }

    // 6. Render Astrolabe State-Space Phase Portrait
    if (state.viewMode === 'both') {
      this.stateSpace.render(ctx, centerOrbX, centerOrbY, 205, k);
      this.drawQuillDataStreams(bioX, exoX, centerOrbX, centerOrbY);
    } else {
      this.stateSpace.render(ctx, w - 125, 120, 180, k);
    }
  }

  /**
   * Draws aged Renaissance parchment texture, Vitruvian circles, and manuscript annotations.
   */
  drawCodexParchment(w, h) {
    const { ctx } = this;
    ctx.save();

    // Dark Antique Parchment Gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h) * 0.75);
    bgGrad.addColorStop(0, '#1c150e');
    bgGrad.addColorStop(0.55, '#160f09');
    bgGrad.addColorStop(1, '#0c0805');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Vitruvian Squaring-the-Circle & Harmonic Proportions
    ctx.strokeStyle = 'rgba(196, 154, 69, 0.07)';
    ctx.lineWidth = 1.0;

    // Central Vitruvian Canon Circle
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 20, 190, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary Harmonics
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 20, 130, 0, Math.PI * 2);
    ctx.stroke();

    // Vitruvian Square
    ctx.strokeRect(w / 2 - 190, h / 2 - 210, 380, 380);

    // Diagonal Golden Ratio Lines
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(w / 2 - 190, h / 2 - 210);
    ctx.lineTo(w / 2 + 190, h / 2 + 170);
    ctx.moveTo(w / 2 + 190, h / 2 - 210);
    ctx.lineTo(w / 2 - 190, h / 2 + 170);
    ctx.stroke();
    ctx.setLineDash([]);

    // Manuscript ruling lines
    ctx.strokeStyle = 'rgba(196, 154, 69, 0.04)';
    ctx.lineWidth = 0.6;
    for (let y = 30; y < h - 20; y += 22) {
      ctx.beginPath(); ctx.moveTo(25, y); ctx.lineTo(w - 25, y); ctx.stroke();
    }

    // Antique Top Caliper Datum Bar
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)';
    ctx.lineWidth = 1.0;
    ctx.beginPath(); ctx.moveTo(35, 24); ctx.lineTo(w - 35, 24); ctx.stroke();

    // Roman Numerals & Caliper Ticks
    for (let x = 40; x <= w - 40; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, 28); ctx.stroke();
    }

    ctx.fillStyle = '#9e8162';
    ctx.font = 'italic 9px "Cinzel", "Palatino Linotype", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('LIBER PRIMUS · DE MOTU ANIMALIUM ET ARTICULIS', 40, 17);
    ctx.textAlign = 'right';
    ctx.fillText('ZHEJIANGENSIS UNIVERSITAS · CODEX AZAM', w - 40, 17);

    ctx.restore();
  }

  /**
   * Draws antique engraved copperplate datum floor line with synchronized moving calibration ticks.
   */
  drawCopperplateDatum(w, groundY, phase) {
    const { ctx } = this;
    ctx.save();

    // Burnished Copper & Gold Floor Gradient
    const floorGrad = ctx.createLinearGradient(0, 0, w, 0);
    floorGrad.addColorStop(0, 'rgba(184, 115, 51, 0.1)');
    floorGrad.addColorStop(0.25, 'rgba(196, 154, 69, 0.85)');
    floorGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.95)');
    floorGrad.addColorStop(0.75, 'rgba(184, 115, 51, 0.85)');
    floorGrad.addColorStop(1, 'rgba(184, 115, 51, 0.1)');

    ctx.strokeStyle = floorGrad;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(30, groundY);
    ctx.lineTo(w - 30, groundY);
    ctx.stroke();

    // Synchronized Moving Caliper Ticks (Treadmill Belt Motion)
    // Moving rearward at the stance foot velocity: (2 * STRIDE_HALF / 0.60)
    const tickSpacing = 20;
    const beltDist = (phase / 0.60) * (2 * 38);
    const offset = beltDist % tickSpacing;

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 1.2;
    for (let x = 35 + ((tickSpacing - offset) % tickSpacing); x < w - 35; x += tickSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x, groundY + 5);
      ctx.stroke();
    }

    // Engraved diagonal cross-hatching beneath datum
    ctx.strokeStyle = 'rgba(158, 129, 98, 0.30)';
    ctx.lineWidth = 0.8;
    for (let x = 45; x < w - 45; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 5);
      ctx.lineTo(x - 8, groundY + 13);
      ctx.stroke();
    }

    // Roman Numerals along ground line
    ctx.fillStyle = '#9e8162';
    ctx.font = 'bold 8.5px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    const romanMarks = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    romanMarks.forEach((num, idx) => {
      const rx = 80 + idx * ((w - 160) / 10);
      ctx.fillText(num, rx, groundY + 22);
    });

    ctx.restore();
  }

  /**
   * Renders the Biological Musculoskeletal Human in Leonardo da Vinci's Anatomical Codex style.
   */
  drawAnatomicalVitruvianModel(cx, groundY, k, front, back, state) {
    const { ctx } = this;
    ctx.save();

    // 0. Soft Ground Contact Shadow under stance foot
    if (front.isStance) {
      ctx.fillStyle = 'rgba(28, 18, 11, 0.45)';
      ctx.beginPath();
      ctx.ellipse((front.heel.x + front.toe.x) / 2, groundY + 2, 26, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 1. Back Arm (Leonardo Sepia Wash)
    this.drawLimbBone(back.shoulder, back.elbow, back.wrist, '#5c4533', 3.0, 0.38);

    // 2. Back Leg (Femur, Tibia, and Foot with faint sepia wash)
    this.drawLimbBone(back.hip, back.knee, back.ankle, '#705741', 4.5, 0.4);
    this.drawAnatomicalFoot(back, '#705741', 0.4);

    // 3. Torso: Vertebral Column & Sanguine Neural Action Potentials
    // Spine vertebrae bones
    ctx.strokeStyle = '#e8dec4';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(cx, front.pelvisY);
    ctx.lineTo(cx, front.shoulderY);
    ctx.stroke();

    // Classical Sanguine Neural Pulse (Amber-Gold Traveling Action Potential)
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 12]);
    ctx.lineDashOffset = -(state.phase * 45);
    ctx.beginPath();
    ctx.moveTo(cx, front.shoulderY);
    ctx.lineTo(cx, front.pelvisY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Anatomical Pelvis Bone Basin (Iliac Crest & Sacrum)
    ctx.fillStyle = 'rgba(232, 222, 196, 0.22)';
    ctx.strokeStyle = '#e8dec4';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(cx, front.pelvisY, 17, 9, (front.thighAngle * 0.2), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Leonardo Vitruvian Skull Silhouette
    ctx.fillStyle = 'rgba(245, 239, 224, 0.18)';
    ctx.strokeStyle = '#f5efe0';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(cx, front.shoulderY - 32, 11, 14, 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 4. Front Leg: Anatomical Muscle Bellies with Sanguine / Sepia Cross-Hatching
    const m = front.muscles;

    // A. Gluteus Maximus (Posterior Hip Extensor - peaks at Initial Contact)
    this.drawAnatomicalMuscleBelly(
      { x: cx + 4, y: front.pelvisY - 4 },
      { x: front.hip.x + 8, y: front.hip.y + 18 },
      14 * Math.cos(front.thighAngle),
      m.gluteus,
      '#a84e32',
      'Gluteus'
    );

    // B. Quadriceps / Rectus Femoris (Anterior Thigh Muscle Belly)
    this.drawAnatomicalMuscleBelly(
      { x: front.hip.x - 6, y: front.hip.y + 4 },
      { x: front.knee.x - 4, y: front.knee.y - 6 },
      -18 * Math.cos(front.thighAngle),
      m.rectusFemoris,
      '#c85a3a', // sanguine terracotta
      'Rectus Femoris'
    );

    // C. Hamstrings / Biceps Femoris (Posterior Thigh Muscle Belly)
    this.drawAnatomicalMuscleBelly(
      { x: front.hip.x + 6, y: front.hip.y + 6 },
      { x: front.knee.x + 4, y: front.knee.y - 4 },
      16 * Math.cos(front.thighAngle),
      m.hamstrings,
      '#8c4227', // deep sepia sanguine
      'Hamstrings'
    );

    // D. Gastrocnemius & Soleus (Calf Muscle Bellies)
    this.drawAnatomicalMuscleBelly(
      { x: front.knee.x + 3, y: front.knee.y + 6 },
      { x: front.heel.x + 2, y: front.heel.y - 12 },
      17 * Math.cos(front.shankAngle),
      m.gastrocnemius,
      front.isPushOff ? '#d4af37' : '#c85a3a', // gold during propulsive push-off!
      'Gastrocnemius'
    );

    // E. Tibialis Anterior (Shin Muscle)
    this.drawAnatomicalMuscleBelly(
      { x: front.knee.x - 3, y: front.knee.y + 8 },
      { x: front.ankle.x - 2, y: front.ankle.y - 2 },
      -8 * Math.cos(front.shankAngle),
      m.tibialis,
      '#a84e32',
      'Tibialis Ant.'
    );

    // F. Fibrous Tendons (Patellar Ligament & Calcaneal Achilles Tendon)
    // Achilles Tendon: from gastrocnemius insertion down to calcaneus heel
    ctx.strokeStyle = '#e8dec4';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(front.knee.x + 4 * Math.sin(front.shankAngle), front.knee.y + 45 * Math.cos(front.shankAngle));
    ctx.lineTo(front.heel.x, front.heel.y);
    ctx.stroke();

    // Patellar Ligament: from patella to tibial tuberosity
    ctx.strokeStyle = '#e8dec4';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(front.knee.x - 2, front.knee.y);
    ctx.lineTo(front.knee.x - 1, front.knee.y + 14);
    ctx.stroke();

    // 5. Bones of the Front Leg (Vellum Ivory with Sepia Shading)
    this.drawLimbBone(front.hip, front.knee, front.ankle, '#f5efe0', 5.8, 1.0);

    // Anatomical Foot Bone Structure (Calcaneus Heel, Ankle, Ball, and Metatarsal Toe)
    this.drawAnatomicalFoot(front, '#f5efe0', 1.0);

    // 6. Renaissance Calipers / Angle Measurement Arcs
    this.drawCaliperArc(front.hip.x, front.hip.y, 24, Math.PI / 2, Math.PI / 2 - front.thighAngle, 'θ_coxa');
    this.drawCaliperArc(front.knee.x, front.knee.y, 20, front.thighAngle + Math.PI / 2, front.shankAngle + Math.PI / 2, 'θ_genu');

    // 7. Front Arm
    this.drawLimbBone(front.shoulder, front.elbow, front.wrist, '#e8dec4', 3.6, 1.0);

    // 8. Model Title Callout (Renaissance Parchment Scroll Style)
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 11px "Cinzel", "Palatino Linotype", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('HOMO VITRUVIANUS · ANATOMIA', cx, groundY + 38);

    ctx.fillStyle = '#9e8162';
    ctx.font = 'italic 9.5px "Cinzel", Georgia, serif';
    ctx.fillText('ESWA 2026 · Dynamic Joint Moments', cx, groundY + 52);

    ctx.restore();
  }

  /**
   * Renders the Wearable Powered Exoskeleton in Leonardo's Mechanical Knight Automaton style.
   */
  drawClockworkAutomatonModel(cx, groundY, k, front, back, state) {
    const { ctx } = this;
    ctx.save();

    // 0. Soft Ground Shadow under stance foot
    if (front.isStance) {
      ctx.fillStyle = 'rgba(28, 18, 11, 0.45)';
      ctx.beginPath();
      ctx.ellipse((front.heel.x + front.toe.x) / 2, groundY + 2, 28, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 1. Back Robotic Automaton Arm
    this.drawLimbBone(back.shoulder, back.elbow, back.wrist, '#4a3625', 4.5, 0.35);

    // 2. Back Automaton Leg
    this.drawLimbBone(back.hip, back.knee, back.ankle, '#38281a', 7.0, 0.35);
    ctx.strokeStyle = '#c49a45';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(back.hip.x, back.hip.y);
    ctx.lineTo(back.knee.x, back.knee.y);
    ctx.lineTo(back.ankle.x, back.ankle.y);
    ctx.stroke();

    // 3. Automaton Rigid Spine & Pelvic Chassis Hub
    ctx.strokeStyle = '#8c5a2b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx - 5, front.pelvisY - 76);
    ctx.lineTo(cx, front.pelvisY);
    ctx.stroke();

    // Bronze Chassis Box with Brass Rivets
    ctx.fillStyle = '#241a12';
    ctx.strokeStyle = '#c49a45';
    ctx.lineWidth = 1.8;
    ctx.fillRect(cx - 17, front.pelvisY - 60, 20, 64);
    ctx.strokeRect(cx - 17, front.pelvisY - 60, 20, 64);

    // Brass Rivets on Chassis
    ctx.fillStyle = '#d4af37';
    [-52, -38, -24, -10].forEach(dy => {
      ctx.beginPath(); ctx.arc(cx - 7, front.pelvisY + dy, 2.2, 0, Math.PI * 2); ctx.fill();
    });

    // Pilot Automaton Visor / Brass Mask
    ctx.fillStyle = 'rgba(36, 26, 18, 0.85)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(cx - 13, front.shoulderY - 42, 26, 26, 5);
    ctx.fill();
    ctx.stroke();

    // 4. Articulated Bronze & Copper Structural Spars
    // Thigh Spar (Antique Bronze Plate)
    this.drawBronzeSpar(front.hip, front.knee, 10, '#2d1e13', '#c49a45');
    // Shank Spar
    this.drawBronzeSpar(front.knee, front.ankle, 8.5, '#2d1e13', '#c49a45');
    // Articulated Foot Spar (Heel to Ball to Toe)
    this.drawBronzeSpar(front.heel, front.ball, 6, '#2d1e13', '#c49a45');
    this.drawBronzeSpar(front.ball, front.toe, 5, '#2d1e13', '#c49a45');

    // 5. Clockwork Spur Gears & Harmonic Drives at Joints
    // Hip Actuator Harmonic Gearhead (Rotates dynamically with angular velocity!)
    this.drawClockworkGear(front.hip.x, front.hip.y, 16, front.gearAngle, 12, '#c49a45', '#8c5a2b');

    // Knee SEA Actuator (Series Elastic Actuator with Helical Copper Spring)
    this.drawClockworkGear(front.knee.x, front.knee.y, 14, -front.gearAngle * 1.3, 10, '#b87333', '#c49a45');

    // Ankle Sensor Encoders (Rotates with ankle pitch)
    this.drawClockworkGear(front.ankle.x, front.ankle.y, 8, front.footAngle * 4.0, 6, '#d4af37', '#241a12');

    // 6. Series Elastic Actuator (SEA) Coiled Brass Spring
    // Dynamically compresses and rebounds with torque!
    this.drawCoiledSpring(
      front.knee.x + 8 * Math.sin(front.thighAngle),
      front.knee.y - 20 * Math.cos(front.thighAngle),
      front.knee.x + 8 * Math.sin(front.shankAngle),
      front.knee.y + 18 * Math.cos(front.shankAngle),
      front.springCompression
    );

    // 7. Dynamic Assistive Torque Indicator (Active during push-off 0.38 - 0.58)
    if (state.phase >= 0.38 && state.phase <= 0.58) {
      const torqueProgress = Math.sin(((state.phase - 0.38) / 0.20) * Math.PI);
      ctx.save();
      ctx.strokeStyle = `rgba(212, 175, 55, ${(0.3 + 0.7 * torqueProgress).toFixed(2)})`;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(front.hip.x, front.hip.y, 25, -Math.PI * 0.75, Math.PI * 0.25);
      ctx.stroke();
      ctx.restore();

      // Torque Banner Callout
      ctx.fillStyle = '#ffeed0';
      ctx.font = 'bold 9.5px "Cinzel", Georgia, serif';
      ctx.fillText(
        `+${(state.maxTorqueGain * torqueProgress).toFixed(0)} N·m [τ_auxiliaris]`,
        front.hip.x + 30,
        front.hip.y - 14
      );
    }

    // 8. Ground Reaction Force (GRF) Vector during stance
    if (front.isStance) {
      const grfProgress = Math.sin((front.phase / 0.60) * Math.PI);
      ctx.save();
      ctx.strokeStyle = `rgba(184, 115, 51, ${(0.4 + 0.6 * grfProgress).toFixed(2)})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(front.ball.x, front.ball.y);
      ctx.lineTo(front.ball.x - 14 * grfProgress, front.ball.y - 44 * grfProgress);
      ctx.stroke();

      // GRF Vector Arrowhead
      ctx.fillStyle = '#c49a45';
      ctx.beginPath();
      ctx.arc(front.ball.x - 14 * grfProgress, front.ball.y - 44 * grfProgress, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 9. Front Robotic Arm
    this.drawLimbBone(front.shoulder, front.elbow, front.wrist, '#8c5a2b', 4.8, 1.0);

    // 10. Model Title Callout (Renaissance Parchment Scroll Style)
    ctx.fillStyle = '#c49a45';
    ctx.font = 'bold 11px "Cinzel", "Palatino Linotype", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('AUTOMATON CO-SIMULATUM', cx, groundY + 38);

    ctx.fillStyle = '#9e8162';
    ctx.font = 'italic 9.5px "Cinzel", Georgia, serif';
    ctx.fillText('IROS 2025 · Hm-DMP & PI² Adaptatio', cx, groundY + 52);

    ctx.restore();
  }

  /**
   * Draws an anatomical foot structure: Calcaneus heel -> Ankle -> Ball of foot -> Toe.
   */
  drawAnatomicalFoot(leg, color, opacity) {
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    // Calcaneus Heel to Ball of foot (plantar fascia base)
    ctx.moveTo(leg.heel.x, leg.heel.y);
    ctx.lineTo(leg.ball.x, leg.ball.y);
    // Ball to Metatarsal Toe
    ctx.lineTo(leg.toe.x, leg.toe.y);
    // Toe back up to Ankle
    ctx.lineTo(leg.ankle.x, leg.ankle.y);
    // Ankle down to Calcaneus Heel
    ctx.lineTo(leg.heel.x, leg.heel.y);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws a classical anatomical muscle belly with Renaissance cross-hatching.
   */
  drawAnatomicalMuscleBelly(origin, insertion, bulgeOffset, tension, color, label) {
    const { ctx } = this;
    ctx.save();

    const midX = (origin.x + insertion.x) / 2 + bulgeOffset;
    const midY = (origin.y + insertion.y) / 2;

    // Muscle Contour Path
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.quadraticCurveTo(midX, midY, insertion.x, insertion.y);
    ctx.quadraticCurveTo(midX - bulgeOffset * 0.35, midY, origin.x, origin.y);
    ctx.closePath();

    // Muscle Belly Tone (Terracotta / Sanguine)
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.20 + 0.45 * tension;
    ctx.fill();

    // Contour Line
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4 + 1.2 * tension;
    ctx.globalAlpha = 0.65 + 0.35 * tension;
    ctx.stroke();

    // Leonardo Da Vinci Delicate Cross-Hatching inside the muscle belly
    ctx.save();
    ctx.clip(); // clip to muscle contour
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.9;
    ctx.globalAlpha = 0.35 + 0.45 * tension;

    const hatchSpacing = Math.max(3, 7 - Math.round(tension * 3));
    const angle = Math.atan2(insertion.y - origin.y, insertion.x - origin.x) + 0.55;
    const cosH = Math.cos(angle);
    const sinH = Math.sin(angle);

    for (let offset = -40; offset <= 40; offset += hatchSpacing) {
      const hx = midX + offset * -sinH;
      const hy = midY + offset * cosH;
      ctx.beginPath();
      ctx.moveTo(hx - 25 * cosH, hy - 25 * sinH);
      ctx.lineTo(hx + 25 * cosH, hy + 25 * sinH);
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  /**
   * Draws an articulated bronze spar with brass bevels and rivets.
   */
  drawBronzeSpar(p1, p2, width, coreColor, rimColor) {
    const { ctx } = this;
    ctx.save();

    // Core Spar
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Brass Bevel Lining
    ctx.strokeStyle = rimColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Domed Brass Rivets along the spar
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    ctx.fillStyle = rimColor;
    ctx.beginPath();
    ctx.arc(midX, midY, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws a rotating Renaissance Clockwork Gearhead with brass spokes and cut teeth.
   */
  drawClockworkGear(x, y, radius, rotationAngle, numTeeth, gearColor, innerColor) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationAngle);

    // Gear Body
    ctx.fillStyle = innerColor;
    ctx.strokeStyle = gearColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cut Clockwork Teeth
    ctx.fillStyle = gearColor;
    for (let i = 0; i < numTeeth; i++) {
      const toothAngle = (i / numTeeth) * Math.PI * 2;
      ctx.save();
      ctx.rotate(toothAngle);
      ctx.beginPath();
      ctx.moveTo(-radius * 0.12, -radius * 0.82);
      ctx.lineTo(-radius * 0.08, -radius);
      ctx.lineTo(radius * 0.08, -radius);
      ctx.lineTo(radius * 0.12, -radius * 0.82);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Brass Spokes
    ctx.strokeStyle = gearColor;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
      const spk = (i / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius * 0.75 * Math.cos(spk), radius * 0.75 * Math.sin(spk));
      ctx.stroke();
    }

    // Central Ruby / Bronze Pivot Hub
    ctx.fillStyle = '#ffeed0';
    ctx.beginPath();
    ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws a dynamically flexing Series Elastic Actuator (SEA) helical spring.
   */
  drawCoiledSpring(x1, y1, x2, y2, compression) {
    const { ctx } = this;
    ctx.save();

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    ctx.translate(x1, y1);
    ctx.rotate(angle);

    ctx.strokeStyle = '#c49a45';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, 0);

    const coils = 6;
    const coilWidth = 6.5;
    const coilStep = dist / (coils * 2);

    for (let i = 0; i < coils * 2; i++) {
      const cx = (i + 0.5) * coilStep;
      const cy = (i % 2 === 0 ? 1 : -1) * coilWidth * (1 + compression * 0.4);
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(dist, 0);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws bone segments with smooth rounded joins.
   */
  drawLimbBone(p1, p2, p3, strokeStyle, lineWidth, opacity) {
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draws Renaissance caliper measurement arcs showing instantaneous joint angles.
   */
  drawCaliperArc(x, y, radius, startAngle, endAngle, label) {
    const { ctx } = this;
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, (startAngle > endAngle));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  /**
   * Draws Renaissance dashed quill ink data interchange lines.
   */
  drawQuillDataStreams(bioX, exoX, midX, midY) {
    const { ctx } = this;
    ctx.save();

    // Bio -> Astrolabe Estimator Stream (Sanguine Quill Ink)
    ctx.strokeStyle = 'rgba(200, 90, 58, 0.7)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(bioX + 25, midY - 20);
    ctx.lineTo(midX - 105, midY - 20);
    ctx.stroke();

    // Astrolabe -> Automaton Assistive Torque Stream (Gold Quill Ink)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
    ctx.beginPath();
    ctx.moveTo(midX + 105, midY + 20);
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
