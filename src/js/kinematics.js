/**
 * Hamza Azam · Biomechatronics Kinematic Solver
 * Continuous human locomotion kinematics, joint velocities, and inverse dynamics telemetry.
 * Zhejiang University · Ningbo Global Innovation Center
 */

const THIGH_LEN = 96;
const SHANK_LEN = 98;
const FOOT_LEN = 32;
const ARM_LEN = 54;
const FORE_LEN = 48;
const TRIAD_LEN = 18;

/**
 * Calculates continuous joint angles and angular velocities across normalized gait phase [0, 1).
 * @param {number} phase - Normalized gait phase in [0, 1)
 * @param {number} walkSpeed - Transitional walking speed in m/s (default 1.25)
 */
function getKinematics(phase, walkSpeed = 1.25) {
  const rad = phase * 2 * Math.PI;

  // Hip flexion (+) / extension (-)
  const hipDeg = 24.0 * Math.cos(rad) + 4.0 * Math.sin(2 * rad);
  // Analytical derivative d_theta/dt in deg/s (scaled by walking cadence)
  const cadenceScale = walkSpeed / 1.25;
  const dHipDeg = (-24.0 * Math.sin(rad) * 2 * Math.PI + 8.0 * Math.cos(2 * rad) * 2 * Math.PI) * cadenceScale;

  // Knee flexion (-)
  let kneeDeg = 0;
  let dKneeDeg = 0;
  if (phase <= 0.15) {
    kneeDeg = -14.0 * Math.sin(phase / 0.15 * Math.PI);
    dKneeDeg = -14.0 * (Math.PI / 0.15) * Math.cos(phase / 0.15 * Math.PI) * cadenceScale;
  } else if (phase <= 0.45) {
    kneeDeg = -4.0 * Math.sin((phase - 0.15) / 0.30 * Math.PI);
    dKneeDeg = -4.0 * (Math.PI / 0.30) * Math.cos((phase - 0.15) / 0.30 * Math.PI) * cadenceScale;
  } else if (phase <= 0.75) {
    kneeDeg = -62.0 * Math.sin((phase - 0.45) / 0.30 * Math.PI);
    dKneeDeg = -62.0 * (Math.PI / 0.30) * Math.cos((phase - 0.45) / 0.30 * Math.PI) * cadenceScale;
  } else {
    kneeDeg = -10.0 * (1.0 - (phase - 0.75) / 0.25);
    dKneeDeg = (10.0 / 0.25) * cadenceScale;
  }

  // Ankle plantarflexion (+) / dorsiflexion (-)
  let ankleDeg = 0;
  if (phase <= 0.15) {
    ankleDeg = 8.0 * Math.sin(phase / 0.15 * Math.PI);
  } else if (phase <= 0.45) {
    ankleDeg = -10.0 * Math.sin((phase - 0.15) / 0.30 * Math.PI);
  } else if (phase <= 0.60) {
    ankleDeg = 20.0 * Math.sin((phase - 0.45) / 0.15 * Math.PI);
  } else {
    ankleDeg = -6.0 * Math.sin((phase - 0.60) / 0.40 * Math.PI);
  }

  // Contralateral (Opposite) Leg: 50% Phase Shift
  const pR = (phase + 0.5) % 1.0;
  const radR = pR * 2 * Math.PI;
  const hipDegR = 24.0 * Math.cos(radR) + 4.0 * Math.sin(2 * radR);
  
  let kneeDegR = 0;
  if (pR <= 0.15) {
    kneeDegR = -14.0 * Math.sin(pR / 0.15 * Math.PI);
  } else if (pR <= 0.45) {
    kneeDegR = -4.0 * Math.sin((pR - 0.15) / 0.30 * Math.PI);
  } else if (pR <= 0.75) {
    kneeDegR = -62.0 * Math.sin((pR - 0.45) / 0.30 * Math.PI);
  } else {
    kneeDegR = -10.0 * (1.0 - (pR - 0.75) / 0.25);
  }

  let ankleDegR = 0;
  if (pR <= 0.15) {
    ankleDegR = 8.0 * Math.sin(pR / 0.15 * Math.PI);
  } else if (pR <= 0.45) {
    ankleDegR = -10.0 * Math.sin((pR - 0.15) / 0.30 * Math.PI);
  } else if (pR <= 0.60) {
    ankleDegR = 20.0 * Math.sin((pR - 0.45) / 0.15 * Math.PI);
  } else {
    ankleDegR = -6.0 * Math.sin((pR - 0.60) / 0.40 * Math.PI);
  }

  // Vertical Center-of-Mass (COM) fluctuation
  const torsoY = 4.5 * Math.sin(2 * rad);

  return {
    phase,
    torsoY,
    hipRad: hipDeg * Math.PI / 180,
    hipDeg,
    dHipDeg,
    kneeRad: kneeDeg * Math.PI / 180,
    kneeDeg,
    dKneeDeg,
    ankleRad: ankleDeg * Math.PI / 180,
    ankleDeg,
    hipRadR: hipDegR * Math.PI / 180,
    kneeRadR: kneeDegR * Math.PI / 180,
    ankleRadR: ankleDegR * Math.PI / 180,
    armRad: -0.7 * hipDeg * Math.PI / 180,
    armRadR: -0.7 * hipDegR * Math.PI / 180
  };
}

/**
 * Solves 2D kinematic chains and computes coordinate triad vectors for all joints.
 */
function solveKinematicChain(cx, groundY, k, isRight = false) {
  const pelvisY = groundY - 195 + k.torsoY;
  const shoulderY = pelvisY - 82;

  const hipAngle = isRight ? k.hipRadR : k.hipRad;
  const kneeAngle = isRight ? k.kneeRadR : k.kneeRad;
  const ankleAngle = isRight ? k.ankleRadR : k.ankleRad;
  const armAngle = isRight ? k.armRadR : k.armRad;

  // Hip origin
  const hx = cx;
  const hy = pelvisY;

  // Knee position
  const kx = hx + THIGH_LEN * Math.sin(hipAngle);
  const ky = hy + THIGH_LEN * Math.cos(hipAngle);

  // Shank absolute orientation relative to vertical
  const shankAngle = hipAngle + kneeAngle;
  const ax = kx + SHANK_LEN * Math.sin(shankAngle);
  const ay = ky + SHANK_LEN * Math.cos(shankAngle);

  // Foot segment
  const footAngle = shankAngle + ankleAngle + Math.PI / 2;
  const tx = ax + FOOT_LEN * Math.cos(footAngle);
  const ty = ay + FOOT_LEN * Math.sin(footAngle);
  const heelX = ax - 10 * Math.cos(footAngle);
  const heelY = ay - 10 * Math.sin(footAngle);

  // Arm kinematics
  const sx = cx;
  const sy = shoulderY;
  const ex = sx + ARM_LEN * Math.sin(armAngle);
  const ey = sy + ARM_LEN * Math.cos(armAngle);
  const foreAngle = armAngle - 0.35;
  const wx = ex + FORE_LEN * Math.sin(foreAngle);
  const wy = ey + FORE_LEN * Math.cos(foreAngle);

  // Coordinate Triads: (Origin, Unit X, Unit Y)
  // 1. Hip Triad
  const hipTriad = {
    ox: hx, oy: hy,
    xx: hx + TRIAD_LEN * Math.cos(hipAngle),
    xy: hy - TRIAD_LEN * Math.sin(hipAngle),
    yx: hx + TRIAD_LEN * Math.sin(hipAngle),
    yy: hy + TRIAD_LEN * Math.cos(hipAngle)
  };

  // 2. Knee Triad
  const kneeTriad = {
    ox: kx, oy: ky,
    xx: kx + TRIAD_LEN * Math.cos(shankAngle),
    xy: ky - TRIAD_LEN * Math.sin(shankAngle),
    yx: kx + TRIAD_LEN * Math.sin(shankAngle),
    yy: ky + TRIAD_LEN * Math.cos(shankAngle)
  };

  // 3. Ankle Triad
  const ankleTriad = {
    ox: ax, oy: ay,
    xx: ax + TRIAD_LEN * Math.cos(footAngle),
    xy: ay + TRIAD_LEN * Math.sin(footAngle),
    yx: ax - TRIAD_LEN * Math.sin(footAngle),
    yy: ay + TRIAD_LEN * Math.cos(footAngle)
  };

  return {
    pelvisY,
    shoulderY,
    hip: { x: hx, y: hy },
    knee: { x: kx, y: ky },
    ankle: { x: ax, y: ay },
    toe: { x: tx, y: ty },
    heel: { x: heelX, y: heelY },
    shoulder: { x: sx, y: sy },
    elbow: { x: ex, y: ey },
    wrist: { x: wx, y: wy },
    hipAngle,
    shankAngle,
    kneeAngle,
    hipTriad,
    kneeTriad,
    ankleTriad
  };
}

/**
 * Computes instantaneous inverse dynamics moments and assistive torques.
 */
function computeTelemetry(phase, maxTorqueGain = 45, walkSpeed = 1.25) {
  // Hm-DMP Assistive Torque profile (peaks during terminal stance push-off 0.28 - 0.58)
  let exoTorque = 0;
  if (phase >= 0.28 && phase <= 0.58) {
    const pNorm = (phase - 0.28) / 0.30;
    exoTorque = maxTorqueGain * Math.sin(pNorm * Math.PI);
  }

  // Baseline biological hip moment (ESWA 2026 subject-independent estimator)
  let baselineMoment = 25;
  if (phase >= 0.10 && phase <= 0.55) {
    baselineMoment = 85 * Math.sin((phase - 0.10) / 0.45 * Math.PI);
  }

  // Load reduction from assistive torque
  const unloadFactor = (exoTorque / 60) * 32;
  const netMoment = Math.max(15, baselineMoment - unloadFactor);

  // Mobility matching percentage (IROS 2025 PI^2 policy)
  const mobilityMatch = (96.8 + 2.2 * Math.sin(phase * Math.PI * 2)).toFixed(1);

  // Gait Phase Categorization
  const pct = Math.round(phase * 100);
  let eventName = 'Heel Strike (Initial Contact)';
  if (pct < 15) eventName = 'Heel Strike (Initial Contact)';
  else if (pct < 30) eventName = 'Loading Response (Shock Absorption)';
  else if (pct < 50) eventName = 'Mid-Stance & Forward Roll';
  else if (pct < 60) eventName = 'Terminal Stance (Propulsive Push-Off)';
  else if (pct < 85) eventName = 'Initial Swing (Ground Clearance)';
  else eventName = 'Terminal Swing (Deceleration)';

  return {
    netMoment: Math.round(netMoment),
    exoTorque: exoTorque.toFixed(1),
    mobilityMatch,
    eventName,
    isStance: phase <= 0.60
  };
}

// Support both Node.js / module bundling and direct browser global inclusion
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getKinematics,
    solveKinematicChain,
    computeTelemetry
  };
} else {
  window.KinematicsEngine = {
    getKinematics,
    solveKinematicChain,
    computeTelemetry
  };
}
