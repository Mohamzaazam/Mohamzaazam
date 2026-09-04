/**
 * Hamza Azam · Renaissance Astrolabe & State-Space Phase Portrait Module
 * Astrolabium de Statu Motus · Real-time Dynamic Hm-DMP Harmonic Attractor (theta vs d_theta/dt)
 * Zhejiang University · Ningbo Global Innovation Center
 */

class StateSpaceVisualizer {
  constructor(options = {}) {
    this.orbitResolution = options.orbitResolution || 96;
    this.scaleTh = options.scaleTh || 2.4;
    this.scaleDTh = options.scaleDTh || 0.36;
    this.orbitCache = [];
    this.precomputeOrbit();
  }

  /**
   * Precomputes the closed limit-cycle attractor orbit across 360 degrees of gait phase.
   */
  precomputeOrbit() {
    this.orbitCache = [];
    const getKin = (typeof window !== 'undefined' && window.KinematicsEngine)
      ? window.KinematicsEngine.getKinematics
      : require('./kinematics').getKinematics;

    for (let i = 0; i <= this.orbitResolution; i++) {
      const p = i / this.orbitResolution;
      const k = getKin(p, 1.25);
      this.orbitCache.push({
        phase: p,
        th: k.hipDeg,
        dth: k.dHipDeg
      });
    }
  }

  /**
   * Renders the Renaissance Horological Astrolabe State-Space Portrait.
   */
  render(ctx, cx, cy, size, currentKinematics) {
    const radius = size / 2;
    ctx.save();

    // 1. Astrolabe Outer Brass Bezel Ring
    const bezelGrad = ctx.createRadialGradient(cx, cy, radius * 0.75, cx, cy, radius);
    bezelGrad.addColorStop(0, '#1c140d');
    bezelGrad.addColorStop(0.7, '#2a1f14');
    bezelGrad.addColorStop(0.9, '#8c6227');
    bezelGrad.addColorStop(1, '#c49a45');

    ctx.fillStyle = '#140e09';
    ctx.strokeStyle = '#c49a45';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner Parchment Field
    const parchmentGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.92);
    parchmentGrad.addColorStop(0, '#261c13');
    parchmentGrad.addColorStop(0.75, '#1e160e');
    parchmentGrad.addColorStop(1, '#150f09');
    ctx.fillStyle = parchmentGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.92, 0, Math.PI * 2);
    ctx.fill();

    // 2. Brass Astrolabe Rim Graduations & Roman Hour Markers
    ctx.save();
    ctx.strokeStyle = '#c49a45';
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const isMajor = i % 3 === 0;
      const rInner = isMajor ? radius * 0.88 : radius * 0.91;
      ctx.lineWidth = isMajor ? 1.5 : 0.75;
      ctx.beginPath();
      ctx.moveTo(cx + rInner * Math.cos(angle), cy + rInner * Math.sin(angle));
      ctx.lineTo(cx + radius * 0.96 * Math.cos(angle), cy + radius * 0.96 * Math.sin(angle));
      ctx.stroke();
    }

    // Roman Cardinal Numerals (XII, III, VI, IX)
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 9px "Cinzel", "Palatino Linotype", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('XII', cx, cy - radius * 0.84);
    ctx.fillText('VI', cx, cy + radius * 0.84);
    ctx.fillText('III', cx + radius * 0.84, cy);
    ctx.fillText('IX', cx - radius * 0.84, cy);
    ctx.restore();

    // 3. Vitruvian Harmonic Grid & Reticle Crosshairs
    ctx.save();
    ctx.strokeStyle = 'rgba(196, 154, 69, 0.12)';
    ctx.lineWidth = 0.8;
    const gridStep = 24;
    for (let x = cx - radius * 0.75; x <= cx + radius * 0.75; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, cy - radius * 0.75); ctx.lineTo(x, cy + radius * 0.75); ctx.stroke();
    }
    for (let y = cy - radius * 0.75; y <= cy + radius * 0.75; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(cx - radius * 0.75, y); ctx.lineTo(cx + radius * 0.75, y); ctx.stroke();
    }

    // Principal Reticle Axes
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(cx - radius * 0.8, cy); ctx.lineTo(cx + radius * 0.8, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - radius * 0.8); ctx.lineTo(cx, cy + radius * 0.8); ctx.stroke();
    ctx.setLineDash([]);

    // Concentric Vitruvian Circles
    ctx.strokeStyle = 'rgba(196, 154, 69, 0.18)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    // 4. Vector Field Directional Fleurons (Clockwise Dynamic Flow)
    ctx.fillStyle = 'rgba(196, 154, 69, 0.75)';
    this.drawFleuron(ctx, cx + radius * 0.52, cy - radius * 0.15, Math.PI * 0.62, 7);
    this.drawFleuron(ctx, cx - radius * 0.52, cy + radius * 0.15, Math.PI * 1.62, 7);

    // 5. Limit-Cycle Closed Attractor Orbit (Harmonic Copper & Gold)
    if (this.orbitCache.length > 0) {
      ctx.beginPath();
      for (let i = 0; i < this.orbitCache.length; i++) {
        const pt = this.orbitCache[i];
        const px = cx + pt.th * this.scaleTh;
        const py = cy - (pt.dth * this.scaleDTh);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Subtle warm golden fill
      ctx.fillStyle = 'rgba(212, 175, 55, 0.07)';
      ctx.fill();

      // Glowing copper stroke
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = 9;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    }

    // 6. Dynamic Instantaneous State Pointer & Sunburst Beacon
    if (currentKinematics) {
      const curX = cx + currentKinematics.hipDeg * this.scaleTh;
      const curY = cy - (currentKinematics.dHipDeg * this.scaleDTh);

      // Astrolabe Sight Line from Origin
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(curX, curY); ctx.stroke();
      ctx.setLineDash([]);

      // Dynamic Sunburst Beacon
      ctx.save();
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 12;

      // Outer Halo
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(curX, curY, 8, 0, Math.PI * 2); ctx.stroke();

      // Glowing Sun Center
      ctx.fillStyle = '#ffeed0';
      ctx.strokeStyle = '#b87333';
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(curX, curY, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();

      // Antique Cartouche Coordinate Callout
      ctx.save();
      const txt = `[θ: ${currentKinematics.hipDeg > 0 ? '+' : ''}${currentKinematics.hipDeg.toFixed(1)}°, dθ: ${currentKinematics.dHipDeg > 0 ? '+' : ''}${currentKinematics.dHipDeg.toFixed(0)}°/s]`;
      ctx.font = 'bold 9px "Cinzel", "JetBrains Mono", Georgia, monospace';
      const textW = ctx.measureText(txt).width;
      const boxX = Math.min(cx + radius * 0.85 - textW - 8, Math.max(cx - radius * 0.85, curX + 10));
      const boxY = Math.min(cy + radius * 0.75 - 18, Math.max(cy - radius * 0.75, curY - 10));

      ctx.fillStyle = 'rgba(24, 17, 11, 0.92)';
      ctx.strokeStyle = '#c49a45';
      ctx.lineWidth = 0.8;
      ctx.fillRect(boxX, boxY - 11, textW + 10, 15);
      ctx.strokeRect(boxX, boxY - 11, textW + 10, 15);

      ctx.fillStyle = '#ffeed0';
      ctx.textAlign = 'left';
      ctx.fillText(txt, boxX + 5, boxY);
      ctx.restore();
    }

    // 7. Astrolabe Titles & Latin Mirror-Script Flourish
    ctx.save();
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 10.5px "Cinzel", "Palatino Linotype", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('ASTROLABIUM DE STATU MOTUS', cx, cy - radius * 0.62);

    ctx.fillStyle = '#9e8162';
    ctx.font = 'italic 8.5px "Cinzel", "Palatino Linotype", Georgia, serif';
    ctx.fillText('ATTRACTOR HARMONICUS (Hm-DMP)', cx, cy - radius * 0.50);

    // Axis Labels
    ctx.fillStyle = '#c49a45';
    ctx.font = 'bold 9px "Cinzel", Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText('θ_coxa', cx + radius * 0.74, cy - 6);
    ctx.textAlign = 'left';
    ctx.fillText('dθ/dt', cx + 6, cy - radius * 0.70);

    // Stability Banner
    ctx.fillStyle = '#2d7a6e';
    ctx.font = 'bold 8.5px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('λ_max < 0 · AEQUILIBRIUM ORBITALE', cx, cy + radius * 0.64);
    ctx.restore();

    ctx.restore();
  }

  /**
   * Draws a classical Renaissance direction fleuron arrow.
   */
  drawFleuron(ctx, x, y, angle, length) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(length, 0);
    ctx.lineTo(-length, -length / 2.2);
    ctx.lineTo(-length / 2, 0);
    ctx.lineTo(-length, length / 2.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// Module export & browser window fallback
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StateSpaceVisualizer };
} else {
  window.StateSpaceVisualizer = StateSpaceVisualizer;
}
