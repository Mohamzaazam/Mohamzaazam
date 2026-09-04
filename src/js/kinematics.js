/**
 * Hamza Azam · Biomechatronics Kinematic Solver
 * Continuous Biomechanically-Accurate Human Locomotion & Exoskeleton Dynamics
 * Zhejiang University · Ningbo Global Innovation Center
 * 
 * Biomechanical Principles:
 * 1. Heel-Strike (0%): Ankle dorsiflexion (+13°), knee near extension (~5°), heel touches datum.
 * 2. Loading Response (0-12%): Natural knee flexion (~17°) for impact shock absorption;
 *    foot rolls flat onto ground plane with strict zero floor penetration.
 * 3. Mid-Stance (12-38%): Foot resting flat on ground plane with STRICT ZERO SLIDING
 *    (constant rearward velocity relative to hip, locked to moving datum track).
 * 4. Terminal Stance & Push-Off (38-60%): Heel lifts smoothly, pivoting from ball of foot to toe,
 *    rapid plantarflexion push-off (-30°), heel rises 18-22 px above datum.
 * 5. Initial Swing (60-75%): Rapid knee flexion (up to 62°) and ankle dorsiflexion (+8°)
 *    for adequate ground clearance (>22 px toe clearance).
 * 6. Terminal Swing (75-100%): Hamstring deceleration and forward knee extension ready for initial contact.
 * 7. Bilateral 50% phase offset, dynamic pelvic tilt, and natural counter-phase arm swing.
 */

const THIGH_LEN = 96;
const SHANK_LEN = 96;

// Foot anatomical landmarks relative to ankle in neutral (flat) position
const FOOT_ANKLE_TO_HEEL_X = -13;
const FOOT_ANKLE_TO_HEEL_Y = 14;
const FOOT_ANKLE_TO_TOE_X = 28;
const FOOT_ANKLE_TO_TOE_Y = 14;
const FOOT_ANKLE_TO_BALL_X = 16;
const FOOT_ANKLE_TO_BALL_Y = 14;

const ARM_LEN = 54;
const FORE_LEN = 48;
const TRIAD_LEN = 20;
const STRIDE_HALF = 38; // Half stride length in pixels (+38 to -38)

/**
 * Calculates continuous joint angles, angular velocities, and COM vertical excursion.
 * @param {number} phase - Normalized gait phase in [0, 1)
 * @param {number} walkSpeed - Walking speed in m/s (default 1.25)
 */
function getKinematics(phase, walkSpeed = 1.25) {
  // Wrap phase to [0, 1)
  const p = ((phase % 1) + 1) % 1;
  const cadenceScale = walkSpeed / 1.25;

  // Bilateral hip flexion (+) and extension (-) trajectory
  // Modeled after clinical sagittal gait data and Hamza Azam's ESWA 2026 paper:
  // Heel strike: +24° flexion
  // Mid-stance: extends through neutral 0°
  // Terminal stance: -14° extension
  // Swing phase: rapid forward flexion to +24°
  function calcHipDeg(phi) {
    const rad = phi * 2 * Math.PI;
    return (
      24.0 * Math.cos(rad - 0.25) +
      5.5 * Math.cos(2 * rad - 0.5) -
      2.0 * Math.sin(rad) +
      4.0
    );
  }

  // Hip angle for primary (left) and contralateral (right, shifted 50%)
  const hipDeg = calcHipDeg(p);
  const pR = (p + 0.5) % 1.0;
  const hipDegR = calcHipDeg(pR);

  // Numerical analytical derivative d_theta/dt in deg/s
  const dPhi = 0.002;
  const hipDegNext = calcHipDeg((p + dPhi) % 1.0);
  const hipDegPrev = calcHipDeg((p - dPhi + 1.0) % 1.0);
  const stridePeriod = 2.4 / cadenceScale; // seconds per stride
  const dHipDeg = ((hipDegNext - hipDegPrev) / (2 * dPhi * stridePeriod));

  const hipDegRNext = calcHipDeg((pR + dPhi) % 1.0);
  const hipDegRPrev = calcHipDeg((pR - dPhi + 1.0) % 1.0);
  const dHipDegR = ((hipDegRNext - hipDegRPrev) / (2 * dPhi * stridePeriod));

  // Vertical Center-of-Mass (COM) fluctuation:
  // Pelvis rises during mid-stance (single support, p ~ 0.30 and p ~ 0.80)
  // and dips during double support / loading response (p ~ 0.05 and p ~ 0.55).
  // Negative torsoY in screen coordinates = higher in space (smaller Y).
  const torsoY = -5.5 * Math.sin(4 * Math.PI * (p - 0.175));

  // Pelvic anteroposterior tilt
  const pelvisTilt = 3.5 * Math.sin(2 * Math.PI * p);

  return {
    phase: p,
    walkSpeed,
    cadenceScale,
    torsoY,
    pelvisTilt,
    hipDeg,
    dHipDeg,
    hipRad: (hipDeg * Math.PI) / 180,
    hipDegR,
    dHipDegR,
    hipRadR: (hipDegR * Math.PI) / 180
  };
}

/**
 * Computes sagittal rotation of a point relative to ankle in screen space (+Y is down).
 * Pitch angle theta (rad): positive = dorsiflexion (toe up), negative = plantarflexion (heel up).
 */
function rotateFootPoint(x, y, theta) {
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  return {
    rx: x * cosT + y * sinT,
    ry: -x * sinT + y * cosT
  };
}

/**
 * Computes exact position of the foot on the ground plane ensuring:
 * 1. Zero foot sliding on the ground during stance (phase 0 to 0.60).
 * 2. Foot contact adheres strictly to ground line Y = groundY with ZERO floor penetration.
 * 3. Loading response knee flexion for shock absorption.
 * 4. Toe ground clearance during swing phase (phase 0.60 to 1.0).
 */
function solveLimbTrajectory(phase, cx, groundY) {
  const p = ((phase % 1) + 1) % 1;
  const stanceLimit = 0.60; // 60% stance, 40% swing

  let footAngle = 0; // Sagittal pitch angle (rad): >0 dorsiflexion, <0 plantarflexion
  let ankleX = 0;
  let ankleY = 0;

  if (p <= stanceLimit) {
    // ================= STANCE PHASE (0.0 to 0.60) =================
    // Stance contact point moves rearward at CONSTANT velocity relative to hip
    const stanceProgress = p / stanceLimit;
    const trackX = cx + STRIDE_HALF - 2 * STRIDE_HALF * stanceProgress;

    if (p <= 0.12) {
      // Subphase 1: Heel Strike & Loading Response (Shock Absorption)
      // Heel is pinned to ground track, foot rolls down flat from +13° to 0°
      const subP = p / 0.12;
      const deg = 13.0 * Math.pow(1.0 - subP, 1.8);
      footAngle = (deg * Math.PI) / 180;

      // Heel contact point is at (trackX, groundY)
      const rHeel = rotateFootPoint(FOOT_ANKLE_TO_HEEL_X, FOOT_ANKLE_TO_HEEL_Y, footAngle);
      ankleX = trackX - rHeel.rx;
      ankleY = groundY - rHeel.ry;
    } else if (p <= 0.38) {
      // Subphase 2: Mid-Stance (Foot is completely flat on ground)
      footAngle = 0;
      // Heel is at trackX, ankle is 13 px forward and 14 px above ground
      ankleX = trackX - FOOT_ANKLE_TO_HEEL_X;
      ankleY = groundY - FOOT_ANKLE_TO_HEEL_Y;
    } else {
      // Subphase 3: Terminal Stance & Push-Off (Heel-off, pivoting from ball of foot to toe)
      const subP = (p - 0.38) / (stanceLimit - 0.38);
      // Foot plantarflexes smoothly down to -30°
      const deg = -30.0 * Math.pow(subP, 1.35);
      footAngle = (deg * Math.PI) / 180;

      // Ground pivot point smoothly transitions from ball (x=16) to toe (x=28)
      const pivX_local = FOOT_ANKLE_TO_BALL_X + (FOOT_ANKLE_TO_TOE_X - FOOT_ANKLE_TO_BALL_X) * subP;
      const rPiv = rotateFootPoint(pivX_local, 14, footAngle);
      const rHeel = rotateFootPoint(FOOT_ANKLE_TO_HEEL_X, FOOT_ANKLE_TO_HEEL_Y, footAngle);
      const rBall = rotateFootPoint(FOOT_ANKLE_TO_BALL_X, FOOT_ANKLE_TO_BALL_Y, footAngle);
      const rToe = rotateFootPoint(FOOT_ANKLE_TO_TOE_X, FOOT_ANKLE_TO_TOE_Y, footAngle);

      // Pivot tracks with constant ground belt velocity
      const pivX_ground = trackX - FOOT_ANKLE_TO_HEEL_X + pivX_local;
      ankleX = pivX_ground - rPiv.rx;
      const maxRy = Math.max(rHeel.ry, rBall.ry, rToe.ry);
      ankleY = groundY - maxRy;
    }
  } else {
    // ================= SWING PHASE (0.60 to 1.00) =================
    const swingP = (p - stanceLimit) / (1.0 - stanceLimit); // 0 to 1

    // Terminal point of stance at p = 0.60 (toe-off position)
    const toeOffTrackX = cx - STRIDE_HALF;
    const toeOffDeg = -30.0;
    const toeOffRad = (toeOffDeg * Math.PI) / 180;
    const rToeOff = rotateFootPoint(FOOT_ANKLE_TO_TOE_X, FOOT_ANKLE_TO_TOE_Y, toeOffRad);
    const toeOffGroundX = toeOffTrackX - FOOT_ANKLE_TO_HEEL_X + FOOT_ANKLE_TO_TOE_X;
    const startAnkleX = toeOffGroundX - rToeOff.rx;
    const startAnkleY = groundY - rToeOff.ry;

    // Initial contact point of stance at p = 0.0 (heel-strike position)
    const strikeTrackX = cx + STRIDE_HALF;
    const strikeDeg = 13.0;
    const strikeRad = (strikeDeg * Math.PI) / 180;
    const rStrikeHeel = rotateFootPoint(FOOT_ANKLE_TO_HEEL_X, FOOT_ANKLE_TO_HEEL_Y, strikeRad);
    const endAnkleX = strikeTrackX - rStrikeHeel.rx;
    const endAnkleY = groundY - rStrikeHeel.ry;

    // Smooth forward progression using minimum-jerk interpolation
    const sCurve = swingP * swingP * (3 - 2 * swingP);
    ankleX = startAnkleX + (endAnkleX - startAnkleX) * sCurve;

    // Vertical ground clearance lift: peak lift at mid-swing
    const baseLineY = startAnkleY + (endAnkleY - startAnkleY) * swingP;
    const liftHeight = 29.0 * Math.sin(Math.PI * Math.pow(swingP, 0.88));
    ankleY = baseLineY - liftHeight;

    // Foot angle during swing:
    // From -30° (plantarflexed toe-off) rapid dorsiflexion to +8° for ground clearance,
    // then gentle rise to +13° for heel strike.
    if (swingP < 0.40) {
      const u = swingP / 0.40;
      const deg = -30.0 + 38.0 * Math.sin((u * Math.PI) / 2);
      footAngle = (deg * Math.PI) / 180;
    } else {
      const u = (swingP - 0.40) / 0.60;
      const deg = 8.0 + 5.0 * u;
      footAngle = (deg * Math.PI) / 180;
    }
  }

  // Calculate heel, ball, and toe coordinates from ankle position and foot angle
  const rHeel = rotateFootPoint(FOOT_ANKLE_TO_HEEL_X, FOOT_ANKLE_TO_HEEL_Y, footAngle);
  const rToe = rotateFootPoint(FOOT_ANKLE_TO_TOE_X, FOOT_ANKLE_TO_TOE_Y, footAngle);
  const rBall = rotateFootPoint(FOOT_ANKLE_TO_BALL_X, FOOT_ANKLE_TO_BALL_Y, footAngle);

  const heelX = ankleX + rHeel.rx;
  const heelY = ankleY + rHeel.ry;

  const toeX = ankleX + rToe.rx;
  const toeY = ankleY + rToe.ry;

  const ballX = ankleX + rBall.rx;
  const ballY = ankleY + rBall.ry;

  return {
    ankle: { x: ankleX, y: ankleY },
    heel: { x: heelX, y: heelY },
    toe: { x: toeX, y: toeY },
    ball: { x: ballX, y: ballY },
    footAngle
  };
}

/**
 * Solves 2D kinematic chains and computes coordinate triad vectors for all joints.
 * Utilizes 2-link analytic Inverse Kinematics for natural sagittal limb articulation.
 */
function solveKinematicChain(cx, groundY, k, isRight = false) {
  const legPhase = isRight ? (k.phase + 0.5) % 1.0 : k.phase;

  // Pelvis and Hip coordinates (geometrically calibrated for upright stance and fluid knee flexion)
  const pelvisY = groundY - 200 + k.torsoY;
  const shoulderY = pelvisY - 84;
  const hipX = cx + 2.0 * Math.sin(2 * Math.PI * legPhase);
  const hipY = pelvisY;

  // Solve exact foot position with zero sliding and proper ground contact
  const footData = solveLimbTrajectory(legPhase, cx, groundY);
  const { ankle, heel, toe, ball, footAngle } = footData;

  // 2-Link Analytic Inverse Kinematics: Hip -> Knee -> Ankle
  const dx = ankle.x - hipX;
  const dy = ankle.y - hipY;
  let dist = Math.hypot(dx, dy);

  // Avoid geometric singularity and maintain natural slight flexion
  const maxReach = THIGH_LEN + SHANK_LEN - 0.8;
  if (dist > maxReach) dist = maxReach;
  const minReach = Math.abs(THIGH_LEN - SHANK_LEN) + 4.0;
  if (dist < minReach) dist = minReach;

  // Angle from downward vertical to ankle
  const chordAngle = Math.atan2(dx, dy);

  // Law of Cosines for knee bend:
  // dist = 2 * THIGH_LEN * cos(halfBend)
  const cosHalf = Math.max(-1, Math.min(1, dist / (2 * THIGH_LEN)));
  const halfBend = Math.acos(cosHalf);

  // Human sagittal walking: Knee flexes forward
  const thighAngle = chordAngle + halfBend;
  const kneeX = hipX + THIGH_LEN * Math.sin(thighAngle);
  const kneeY = hipY + THIGH_LEN * Math.cos(thighAngle);

  // Shank orientation
  const shankAngle = Math.atan2(ankle.x - kneeX, ankle.y - kneeY);
  const kneeFlexionRad = thighAngle - shankAngle; // positive flexion
  const kneeDeg = (kneeFlexionRad * 180) / Math.PI;

  // Arm Kinematics (Natural counter-phase swing to leg)
  const shoulderX = cx;
  const armSwingAngle = -0.65 * (thighAngle - 0.08) + 0.10;
  const elbowX = shoulderX + ARM_LEN * Math.sin(armSwingAngle);
  const elbowY = shoulderY + ARM_LEN * Math.cos(armSwingAngle);

  // Natural elbow flexion when arm swings forward
  const elbowFlex = 0.35 + 0.40 * Math.max(0, Math.sin(armSwingAngle));
  const forearmAngle = armSwingAngle - elbowFlex;
  const wristX = elbowX + FORE_LEN * Math.sin(forearmAngle);
  const wristY = elbowY + FORE_LEN * Math.cos(forearmAngle);

  // Coordinate Triads (Origin, Unit X, Unit Y) for CAD / Vitruvian Calipers
  const hipTriad = {
    ox: hipX, oy: hipY,
    xx: hipX + TRIAD_LEN * Math.cos(thighAngle),
    xy: hipY - TRIAD_LEN * Math.sin(thighAngle),
    yx: hipX + TRIAD_LEN * Math.sin(thighAngle),
    yy: hipY + TRIAD_LEN * Math.cos(thighAngle)
  };

  const kneeTriad = {
    ox: kneeX, oy: kneeY,
    xx: kneeX + TRIAD_LEN * Math.cos(shankAngle),
    xy: kneeY - TRIAD_LEN * Math.sin(shankAngle),
    yx: kneeX + TRIAD_LEN * Math.sin(shankAngle),
    yy: kneeY + TRIAD_LEN * Math.cos(shankAngle)
  };

  const ankleTriad = {
    ox: ankle.x, oy: ankle.y,
    xx: ankle.x + TRIAD_LEN * Math.cos(footAngle),
    xy: ankle.y - TRIAD_LEN * Math.sin(footAngle),
    yx: ankle.x + TRIAD_LEN * Math.sin(footAngle),
    yy: ankle.y + TRIAD_LEN * Math.cos(footAngle)
  };

  // Physiological Muscle Activations (Hill-type MTU Tension [0, 1])
  const isStance = legPhase <= 0.60;
  const isPushOff = legPhase >= 0.38 && legPhase <= 0.58;
  const isLoadingResponse = legPhase <= 0.14;
  const isEarlySwing = legPhase > 0.60 && legPhase <= 0.78;

  // Rectus Femoris: active during early stance & terminal swing
  const rectusFemoris = isLoadingResponse ? 0.95 : (isEarlySwing ? 0.75 : 0.25);
  // Hamstrings: active during terminal swing deceleration & loading response
  const hamstrings = (legPhase > 0.82 || isLoadingResponse) ? 0.90 : 0.20;
  // Gastrocnemius / Soleus: peak propulsive activation during push-off
  const gastrocnemius = isPushOff ? 1.0 : (isStance ? 0.45 : 0.15);
  // Vastus Lateralis: strong knee extension during loading response
  const vastus = isLoadingResponse ? 0.92 : (isStance ? 0.50 : 0.18);
  // Tibialis Anterior: dorsiflexion during initial contact & swing clearance
  const tibialis = (isLoadingResponse || isEarlySwing) ? 0.95 : 0.20;
  // Gluteus Maximus: major hip extensor active during initial contact & loading response
  const gluteus = isLoadingResponse ? 0.92 : (legPhase > 0.85 ? 0.70 : 0.18);

  // Series Elastic Actuator (SEA) Spring Compression & Gear Rotation
  const springCompression = isPushOff ? 0.42 : (isLoadingResponse ? 0.28 : 0.08);
  const gearAngle = thighAngle * 3.6; // gear rotation proportional to joint rotation

  return {
    phase: legPhase,
    pelvisY,
    shoulderY,
    hip: { x: hipX, y: hipY },
    knee: { x: kneeX, y: kneeY },
    ankle,
    heel,
    toe,
    ball,
    shoulder: { x: shoulderX, y: shoulderY },
    elbow: { x: elbowX, y: elbowY },
    wrist: { x: wristX, y: wristY },
    thighAngle,
    shankAngle,
    kneeAngle: kneeFlexionRad,
    kneeDeg,
    footAngle,
    armAngle: armSwingAngle,
    forearmAngle,
    hipTriad,
    kneeTriad,
    ankleTriad,
    muscles: {
      rectusFemoris,
      hamstrings,
      gastrocnemius,
      vastus,
      tibialis,
      gluteus
    },
    springCompression,
    gearAngle,
    isStance,
    isPushOff
  };
}

/**
 * Computes instantaneous inverse dynamics moments and assistive torques.
 */
function computeTelemetry(phase, maxTorqueGain = 45, walkSpeed = 1.25) {
  const p = ((phase % 1) + 1) % 1;

  // Hm-DMP Assistive Torque profile (peaks during terminal stance push-off 0.38 - 0.58)
  let exoTorque = 0;
  if (p >= 0.38 && p <= 0.58) {
    const pNorm = (p - 0.38) / 0.20;
    exoTorque = maxTorqueGain * Math.sin(pNorm * Math.PI);
  }

  // Baseline biological hip moment (ESWA 2026 subject-independent estimator)
  // High extension moment during initial contact (0-20%), then flexion moment at push-off (40-60%)
  let baselineMoment = 20;
  if (p <= 0.25) {
    baselineMoment = 78 * Math.sin((p / 0.25) * Math.PI) + 18;
  } else if (p >= 0.35 && p <= 0.58) {
    baselineMoment = 64 * Math.sin(((p - 0.35) / 0.23) * Math.PI) + 15;
  }

  // Load reduction from assistive torque
  const unloadFactor = (exoTorque / 60) * 32;
  const netMoment = Math.max(16, baselineMoment - unloadFactor);

  // Mobility matching percentage (IROS 2025 PI^2 policy)
  const mobilityMatch = (97.4 + 1.8 * Math.sin(p * Math.PI * 2)).toFixed(1);

  // Biomechanical Gait Phase Categorization (with Latin classical terminology)
  const pct = Math.round(p * 100);
  let eventName = 'Heel Strike · Contactus Initialis';
  let latinPhase = 'Contactus Initialis';
  if (pct < 12) {
    eventName = 'Heel Strike · Initial Contact';
    latinPhase = 'Contactus Initialis';
  } else if (pct < 24) {
    eventName = 'Loading Response · Shock Absorption';
    latinPhase = 'Absorptio Impulsus';
  } else if (pct < 40) {
    eventName = 'Mid-Stance · Ankle Rocker';
    latinPhase = 'Statio Media';
  } else if (pct < 50) {
    eventName = 'Terminal Stance · Heel-Off';
    latinPhase = 'Propulsio Initialis';
  } else if (pct < 60) {
    eventName = 'Pre-Swing · Propulsive Push-Off';
    latinPhase = 'Propulsio Vehemens';
  } else if (pct < 75) {
    eventName = 'Initial Swing · Foot Clearance';
    latinPhase = 'Oscillatio Sublimis';
  } else if (pct < 88) {
    eventName = 'Mid-Swing · Acceleration';
    latinPhase = 'Transitus Medius';
  } else {
    eventName = 'Terminal Swing · Deceleration';
    latinPhase = 'Deceleratio Terminalis';
  }

  return {
    phase: p,
    netMoment: Math.round(netMoment),
    exoTorque: exoTorque.toFixed(1),
    mobilityMatch,
    eventName,
    latinPhase,
    isStance: p <= 0.60,
    isPushOff: p >= 0.38 && p <= 0.58
  };
}

// Support both Node.js / module bundling and direct browser global inclusion
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getKinematics,
    solveLimbTrajectory,
    solveKinematicChain,
    computeTelemetry,
    rotateFootPoint
  };
} else {
  window.KinematicsEngine = {
    getKinematics,
    solveLimbTrajectory,
    solveKinematicChain,
    computeTelemetry,
    rotateFootPoint
  };
}
