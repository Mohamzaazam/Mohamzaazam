/**
 * Hamza Azam · State-Space Phase Portrait & Limit-Cycle Attractor Module
 * Real-time dynamic visualization of Hm-DMP harmonic attractors (theta vs d_theta/dt)
 * Zhejiang University · Ningbo Global Innovation Center
 */

class StateSpaceVisualizer {
  constructor(options = {}) {
    this.orbitResolution = options.orbitResolution || 64;
    this.scaleTh = options.scaleTh || 2.2;
    this.scaleDTh = options.scaleDTh || 0.32;
    this.orbitCache = [];
    this.precomputeOrbit();
  }

  /**
   * Precomputes the nominal limit cycle attractor across 360 degrees of phase.
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
   * Renders the complete State-Space Phase Portrait onto a Canvas 2D context.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   * @param {number} cx - Center X coordinate on canvas
   * @param {number} cy - Center Y coordinate on canvas
   * @param {number} size - Box dimension (width/height)
   * @param {object} currentKinematics - Current frame kinematics object
   */
  render(ctx, cx, cy, size, currentKinematics) {
    const half = size / 2;
    ctx.save();

    // 1. Oscilloscope Frame & Background
    ctx.fillStyle = 'rgba(6, 11, 24, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(cx - half, cy - half, size, size, 8);
    ctx.fill();
    ctx.stroke();

    // Subtle CAD Grid within Oscilloscope
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 0.8;
    const gridStep = 25;
    for (let x = cx - half + gridStep; x < cx + half; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, cy - half); ctx.lineTo(x, cy + half); ctx.stroke();
    }
    for (let y = cy - half + gridStep; y < cy + half; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(cx - half, y); ctx.lineTo(cx + half, y); ctx.stroke();
    }

    // 2. Central Reticle Axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx - half + 10, cy); ctx.lineTo(cx + half - 10, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - half + 10); ctx.lineTo(cx, cy + half - 10); ctx.stroke();
    ctx.setLineDash([]);

    // 3. Concentric Limit Guides
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 65, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // 4. Vector Field Flow Direction Arrows
    ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
    // Arrow top-right (flow downwards/clockwise)
    this.drawVectorArrow(ctx, cx + 55, cy - 18, Math.PI * 0.65, 8);
    // Arrow bottom-left (flow upwards/clockwise)
    this.drawVectorArrow(ctx, cx - 55, cy + 18, Math.PI * 1.65, 8);

    // 5. Closed-Loop Limit Cycle Attractor Orbit
    ctx.beginPath();
    for (let i = 0; i < this.orbitCache.length; i++) {
      const pt = this.orbitCache[i];
      const px = cx + pt.th * this.scaleTh;
      const py = cy - (pt.dth * this.scaleDTh);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // 6. Dynamic Current State Point (theta, d_theta/dt)
    if (currentKinematics) {
      const curX = cx + currentKinematics.hipDeg * this.scaleTh;
      const curY = cy - (currentKinematics.dHipDeg * this.scaleDTh);

      // Trailing Pulse Ring
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(curX, curY, 8, 0, Math.PI * 2);
      ctx.stroke();

      // State Point Cursor
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(curX, curY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Coordinate Callout Tag
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `[${currentKinematics.hipDeg > 0 ? '+' : ''}${currentKinematics.hipDeg.toFixed(1)}°, ${currentKinematics.dHipDeg > 0 ? '+' : ''}${currentKinematics.dHipDeg.toFixed(0)}°/s]`,
        curX + 8,
        curY - 6
      );
    }

    // 7. Oscilloscope Annotations
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HM-DMP STATE-SPACE ORBIT', cx, cy - half + 14);

    ctx.fillStyle = '#64748b';
    ctx.font = '8.5px monospace';
    ctx.fillText('LIMIT-CYCLE PHASE ATTRACTOR', cx, cy - half + 26);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('θ_hip', cx + half - 10, cy - 5);
    ctx.textAlign = 'left';
    ctx.fillText('dθ/dt', cx + 6, cy - half + 38);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('λ_max < 0 · ORBITAL STABILITY', cx, cy + half - 10);

    ctx.restore();
  }

  drawVectorArrow(ctx, x, y, angle, length) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(length, 0);
    ctx.lineTo(-length, -length / 2);
    ctx.lineTo(-length / 2, 0);
    ctx.lineTo(-length, length / 2);
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
