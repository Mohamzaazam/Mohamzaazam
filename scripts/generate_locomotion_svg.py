#!/usr/bin/env python3
"""
Algorithmic Locomotion SVG Generator
====================================
Doctoral Research Portfolio · Hamza Azam · Zhejiang University

Generates 'assets/algorithmic-locomotion.svg' featuring:
1. Pure '@' Character Architecture: The biomechatronic walker is composed
   EXCLUSIVELY of '@' signs — zero lines, zero circles, zero paths.
2. Dynamic Actuator Hubs: All major joints (Hip, Knee, Ankle, Shoulder, Elbow, Head)
   physically rotate in SVG matching anatomical joint angle derivatives.
3. High-Contrast Joint Hierarchy: Joints use large, bold '@' glyphs (17px - 23px, weight 900)
   to pop out as robotic actuator modules over connecting linkages (11px - 13px).
4. Reciprocal Counter-Phase Arm Swing: Foreground and background arms swing in
   strict 180° opposition with natural, biomechanically forward elbow flexion.
5. Closer Arm Forward '@' Emissions: As the closer (foreground) arm reaches its maximum
   forward extension towards the research console, it emits a stream of animated '@' data
   packets / telemetry sparks flowing into the dossier.
6. Decluttered Cybernetic Silhouette: Upper body nodes are spaced cleanly with anatomical
   breathing room (Head -> Shoulder -> Thorax -> Lumbar -> Pelvis), removing visual clutter.
7. Trackable & Version-Controlled: Re-run this script anytime to update the animation:
   `python scripts/generate_locomotion_svg.py`
"""

import math
import os
import sys

# Kinematic Constants
THIGH_LEN = 40.0
SHANK_LEN = 42.0
STRIDE_HALF = 14.4  # Half stride length in px
GROUND_Y = 168.0    # Treadmill ground datum
CX = 105.0          # Walker center of mass X datum
STANCE_LIMIT = 0.60 # 60% stance, 40% swing phase
NUM_FRAMES = 24     # 24 keyframes per 1.25s gait cycle

def rotate_foot_pt(x, y, theta):
    """Rotate local foot offset by sagittal pitch theta."""
    cos_t = math.cos(theta)
    sin_t = math.sin(theta)
    return (
        x * cos_t + y * sin_t,
        -x * sin_t + y * cos_t
    )

def interp(p1, p2, t):
    """Linear interpolation between two 2D points."""
    return (p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1]))

def solve_kinematics(p):
    """
    Solves full-body biomechatronic kinematics for normalized gait phase p in [0, 1).
    Returns complete joint coordinates and rotation angles.
    """
    p = ((p % 1.0) + 1.0) % 1.0
    
    # -------------------------------------------------------------
    # 1. Pelvis & Torso Dynamics (Vertical Oscillation & Sagittal Tilt)
    # -------------------------------------------------------------
    torso_y = -3.5 * math.sin(4 * math.pi * (p - 0.175))
    pelvis_y = GROUND_Y - 94.0 + torso_y
    tilt = 0.04 + 0.02 * math.sin(2 * math.pi * p)
    pelvis_x = CX + 1.2 * math.sin(2 * math.pi * p)
    
    # -------------------------------------------------------------
    # 2. Decluttered Upper Body: Shoulder, Spine, and Head
    # -------------------------------------------------------------
    # Shoulder sits 32px above pelvis along the spinal tilt vector
    shoulder_x = pelvis_x - 32.0 * math.sin(tilt)
    shoulder_y = pelvis_y - 32.0 * math.cos(tilt)
    
    # Two clean spinal core nodes (breathing room: ~10-11px apart)
    lumbar = interp((pelvis_x, pelvis_y), (shoulder_x, shoulder_y), 0.32)
    thorax = interp((pelvis_x, pelvis_y), (shoulder_x, shoulder_y), 0.66)
    
    # Commanding Cybernetic Head: 18px above shoulder, cleanly separated
    head_x = shoulder_x + 1.2 - 18.0 * math.sin(tilt)
    head_y = shoulder_y - 18.0 * math.cos(tilt)
    head_angle_deg = math.degrees(tilt) * 2.2
    
    # -------------------------------------------------------------
    # 3. Leg Kinematics: 2-Link Analytic IK (Stance & Swing)
    # -------------------------------------------------------------
    foot_angle = 0.0
    if p <= STANCE_LIMIT:
        # Stance phase: foot contacts ground and translates backward with treadmill
        sp = p / STANCE_LIMIT
        track_x = CX + STRIDE_HALF - 2 * STRIDE_HALF * sp
        if p <= 0.12:
            # Heel strike & initial acceptance
            sub_p = p / 0.12
            deg = 12.0 * math.pow(1.0 - sub_p, 1.8)
            foot_angle = math.radians(deg)
            rx_heel, ry_heel = rotate_foot_pt(-10.0, 10.0, foot_angle)
            ankle_x = track_x - rx_heel
            ankle_y = GROUND_Y - ry_heel
        elif p <= 0.38:
            # Mid-stance flat foot contact
            foot_angle = 0.0
            ankle_x = track_x + 10.0
            ankle_y = GROUND_Y - 10.0
        else:
            # Terminal stance heel-off & roll to metatarsal toe pivot
            sub_p = (p - 0.38) / (STANCE_LIMIT - 0.38)
            deg = -26.0 * math.pow(sub_p, 1.3)
            foot_angle = math.radians(deg)
            piv_local_x = 10.0 + 8.0 * sub_p
            rx_piv, ry_piv = rotate_foot_pt(piv_local_x, 10.0, foot_angle)
            piv_ground_x = track_x + 10.0 + (piv_local_x - 10.0)
            ankle_x = piv_ground_x - rx_piv
            rx_heel, ry_heel = rotate_foot_pt(-10.0, 10.0, foot_angle)
            ankle_y = GROUND_Y - max(ry_heel, ry_piv)
    else:
        # Swing phase: smooth forward trajectory with ground clearance
        sw_p = (p - STANCE_LIMIT) / (1.0 - STANCE_LIMIT)
        toe_off_x = CX - STRIDE_HALF + 18.0
        deg_to = -26.0
        rad_to = math.radians(deg_to)
        rx_to, ry_to = rotate_foot_pt(18.0, 10.0, rad_to)
        start_ankle_x = toe_off_x - rx_to
        start_ankle_y = GROUND_Y - ry_to
        
        strike_x = CX + STRIDE_HALF - 10.0
        deg_st = 12.0
        rad_st = math.radians(deg_st)
        rx_st, ry_st = rotate_foot_pt(-10.0, 10.0, rad_st)
        end_ankle_x = strike_x - rx_st
        end_ankle_y = GROUND_Y - ry_st
        
        s = sw_p * sw_p * (3.0 - 2.0 * sw_p)
        ankle_x = start_ankle_x + (end_ankle_x - start_ankle_x) * s
        base_y = start_ankle_y + (end_ankle_y - start_ankle_y) * sw_p
        lift = 19.0 * math.sin(math.pi * math.pow(sw_p, 0.85))
        ankle_y = base_y - lift
        
        if sw_p < 0.40:
            u = sw_p / 0.40
            deg = -26.0 + 34.0 * math.sin(u * math.pi / 2.0)
            foot_angle = math.radians(deg)
        else:
            u = (sw_p - 0.40) / 0.60
            deg = 8.0 + 4.0 * u
            foot_angle = math.radians(deg)

    # 2-Link Analytic Closed-Form IK for Knee
    dx = ankle_x - pelvis_x
    dy = ankle_y - pelvis_y
    dist = math.hypot(dx, dy)
    dist = max(abs(THIGH_LEN - SHANK_LEN) + 2.0, min(THIGH_LEN + SHANK_LEN - 0.4, dist))
    chord = math.atan2(dx, dy)
    cos_half = (THIGH_LEN**2 + dist**2 - SHANK_LEN**2) / (2.0 * THIGH_LEN * dist)
    cos_half = max(-1.0, min(1.0, cos_half))
    half_bend = math.acos(cos_half)
    
    thigh_angle = chord + half_bend
    knee_x = pelvis_x + THIGH_LEN * math.sin(thigh_angle)
    knee_y = pelvis_y + THIGH_LEN * math.cos(thigh_angle)
    
    shank_angle = math.atan2(ankle_x - knee_x, ankle_y - knee_y)
    knee_flexion = thigh_angle - shank_angle
    
    # Joint Rotation Angles (in degrees):
    hip_rot_deg = math.degrees(thigh_angle) * 1.8
    knee_rot_deg = math.degrees(knee_flexion) * 1.8
    ankle_rot_deg = math.degrees(foot_angle) * 2.2
    
    # Foot plate nodes
    rx_heel, ry_heel = rotate_foot_pt(-10.0, 10.0, foot_angle)
    rx_toe, ry_toe = rotate_foot_pt(18.0, 10.0, foot_angle)
    rx_ball, ry_ball = rotate_foot_pt(9.0, 10.0, foot_angle)
    
    heel_pt = (ankle_x + rx_heel, ankle_y + ry_heel)
    toe_pt = (ankle_x + rx_toe, ankle_y + ry_toe)
    ball_pt = (ankle_x + rx_ball, ankle_y + ry_ball)
    
    # Clean Thigh & Shank intermediate shaft nodes (2 nodes each, ~13px spacing)
    thigh_1 = interp((pelvis_x, pelvis_y), (knee_x, knee_y), 0.35)
    thigh_2 = interp((pelvis_x, pelvis_y), (knee_x, knee_y), 0.70)
    
    shank_1 = interp((knee_x, knee_y), (ankle_x, ankle_y), 0.35)
    shank_2 = interp((knee_x, knee_y), (ankle_x, ankle_y), 0.70)
    
    # -------------------------------------------------------------
    # 4. Reciprocal Counter-Phase Arm Kinematics
    # -------------------------------------------------------------
    # Ipsilateral arm swings counter to leg:
    # At p = 0.0 (leg forward): arm swings backward (-25.2 deg)
    # At p = 0.5 (leg push-off): arm reaches maximum forward (+25.2 deg)
    arm_pitch = -0.44 * math.cos(2 * math.pi * p)
    
    ARM_LEN = 18.0
    FOREARM_LEN = 16.0
    
    elbow_x = shoulder_x + ARM_LEN * math.sin(arm_pitch)
    elbow_y = shoulder_y + ARM_LEN * math.cos(arm_pitch)
    
    # Forward elbow flexion (always anatomically flexed forward, never backward)
    flex_norm = (arm_pitch + 0.44) / 0.88  # 0 to 1
    elbow_flex = 0.20 + 0.55 * (flex_norm ** 1.2)
    forearm_pitch = arm_pitch + elbow_flex
    
    hand_x = elbow_x + FOREARM_LEN * math.sin(forearm_pitch)
    hand_y = elbow_y + FOREARM_LEN * math.cos(forearm_pitch)
    
    arm_u = interp((shoulder_x, shoulder_y), (elbow_x, elbow_y), 0.50)
    arm_f = interp((elbow_x, elbow_y), (hand_x, hand_y), 0.50)
    
    shoulder_rot_deg = math.degrees(arm_pitch) * 1.5
    elbow_rot_deg = math.degrees(elbow_flex) * 2.0
    
    # -------------------------------------------------------------
    # 5. Assistive Torque Arc (Push-off phase: 0.38 - 0.58)
    # -------------------------------------------------------------
    torque_opacity = 0.0
    if 0.38 <= p <= 0.58:
        u = (p - 0.38) / 0.20
        torque_opacity = math.sin(u * math.pi)
        
    torq_at_1 = (pelvis_x + 15.0, pelvis_y - 12.0)
    torq_at_2 = (pelvis_x + 20.0, pelvis_y - 3.0)
    torq_at_3 = (pelvis_x + 16.0, pelvis_y + 8.0)

    return {
        'p': p,
        'head': (head_x, head_y),
        'head_rot': head_angle_deg,
        'shoulder': (shoulder_x, shoulder_y),
        'shoulder_rot': shoulder_rot_deg,
        'thorax': thorax,
        'lumbar': lumbar,
        'pelvis': (pelvis_x, pelvis_y),
        'hip_rot': hip_rot_deg,
        'thigh_1': thigh_1,
        'thigh_2': thigh_2,
        'knee': (knee_x, knee_y),
        'knee_rot': knee_rot_deg,
        'shank_1': shank_1,
        'shank_2': shank_2,
        'ankle': (ankle_x, ankle_y),
        'ankle_rot': ankle_rot_deg,
        'heel': heel_pt,
        'ball': ball_pt,
        'toe': toe_pt,
        'arm_u': arm_u,
        'elbow': (elbow_x, elbow_y),
        'elbow_rot': elbow_rot_deg,
        'arm_f': arm_f,
        'hand': (hand_x, hand_y),
        'torq_op': torque_opacity,
        'torq_at_1': torq_at_1,
        'torq_at_2': torq_at_2,
        'torq_at_3': torq_at_3
    }

def get_emitted_sparks(p, hand_x, hand_y):
    """
    Computes animated '@' particles emitted from the foreground hand when
    the closer arm reaches maximum forward extension towards the console (p in [0.40, 0.72]).
    """
    configs = [
        # (t_start, t_peak, t_end, target_dx, target_dy, font_size, font_weight)
        (0.40, 0.50, 0.64, 58.0,  -4.0, '12px', '800'),
        (0.44, 0.54, 0.68, 45.0, -16.0, '10px', '700'),
        (0.48, 0.58, 0.72, 38.0,  12.0, '9.5px', '700'),
        (0.46, 0.56, 0.70, 70.0,  -2.0, '11px', '900'),
    ]
    sparks = []
    for t0, t_mid, t1, dx, dy, size, weight in configs:
        if t0 <= p <= t1:
            progress = (p - t0) / (t1 - t0)
            ease = 1.0 - math.pow(1.0 - progress, 2.0)
            sx = hand_x + dx * ease
            sy = hand_y + dy * ease
            if p <= t_mid:
                op = (p - t0) / (t_mid - t0)
            else:
                op = (t1 - p) / (t1 - t_mid)
            op = max(0.0, min(1.0, op))
        else:
            sx = hand_x
            sy = hand_y
            op = 0.0
        sparks.append((sx, sy, op, size, weight))
    return sparks

def fmt_arr(arr, fmt="{:.1f}"):
    return ";".join(fmt.format(v) for v in arr)

def generate_svg():
    """Generates the full SVG string with complete animated characters and presentation console."""
    frames_fg = []
    frames_bg = []
    sparks_series = [[] for _ in range(4)]
    
    for i in range(NUM_FRAMES + 1):
        p = i / float(NUM_FRAMES)
        fg = solve_kinematics(p)
        bg = solve_kinematics(p + 0.5)
        frames_fg.append(fg)
        frames_bg.append(bg)
        
        # Emitted sparks from the foreground hand
        cur_sparks = get_emitted_sparks(p, fg['hand'][0], fg['hand'][1])
        for s_idx in range(4):
            sparks_series[s_idx].append(cur_sparks[s_idx])

    def s2d(frames, key):
        return fmt_arr([f[key][0] for f in frames]), fmt_arr([f[key][1] for f in frames])

    def trans_series(frames, key):
        xs = [f[key][0] for f in frames]
        ys = [f[key][1] for f in frames]
        return ";".join(f"{x:.1f} {y:.1f}" for x, y in zip(xs, ys))

    def rot_series(frames, key_rot):
        return ";".join(f"{f[key_rot]:.1f} 0 0" for f in frames)

    # Static position text node
    def at_node_static(frames, key, font_size, fill, font_weight="700"):
        xs, ys = s2d(frames, key)
        return f'''    <text class="at-node" font-size="{font_size}" font-weight="{font_weight}" fill="{fill}">@
      <animate attributeName="x" values="{xs}" dur="1.25s" repeatCount="indefinite"/>
      <animate attributeName="y" values="{ys}" dur="1.25s" repeatCount="indefinite"/>
    </text>'''

    # Rotating Joint Node: Nested <g> with translate and rotate around center (0,0)
    def at_node_rotating(frames, key_pos, key_rot, font_size, fill, font_weight="900"):
        t_vals = trans_series(frames, key_pos)
        r_vals = rot_series(frames, key_rot)
        return f'''    <g>
      <animateTransform attributeName="transform" type="translate" values="{t_vals}" dur="1.25s" repeatCount="indefinite"/>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="{r_vals}" dur="1.25s" repeatCount="indefinite"/>
        <text class="at-node" x="0" y="0" font-size="{font_size}" font-weight="{font_weight}" fill="{fill}">@</text>
      </g>
    </g>'''

    # Background arm nodes (Contralateral - Muted Depth)
    bg_arm = [
        at_node_static(frames_bg, 'arm_u', '11px', '#444444', '600'),
        at_node_rotating(frames_bg, 'elbow', 'elbow_rot', '16px', '#555555', '800'),
        at_node_static(frames_bg, 'arm_f', '10.5px', '#444444', '600'),
        at_node_static(frames_bg, 'hand', '11.5px', '#484848', '700')
    ]

    # Background leg nodes (Contralateral - Muted Depth)
    bg_leg = [
        at_node_static(frames_bg, 'thigh_1', '12px', '#404040', '600'),
        at_node_static(frames_bg, 'thigh_2', '12px', '#404040', '600'),
        at_node_rotating(frames_bg, 'knee', 'knee_rot', '19px', '#555555', '900'),
        at_node_static(frames_bg, 'shank_1', '11.5px', '#404040', '600'),
        at_node_static(frames_bg, 'shank_2', '11.5px', '#404040', '600'),
        at_node_rotating(frames_bg, 'ankle', 'ankle_rot', '16px', '#505050', '800'),
        at_node_static(frames_bg, 'heel', '11.5px', '#404040', '700'),
        at_node_static(frames_bg, 'ball', '11.5px', '#404040', '700'),
        at_node_static(frames_bg, 'toe', '12px', '#444444', '700')
    ]

    # Torso, Spine & Head (Clean, Uncluttered, Distinct Breathing Room)
    torso_head = [
        # Rotating Pelvis Actuator Hub (Large @: 23px)
        at_node_rotating(frames_fg, 'pelvis', 'hip_rot', '23px', '#ffffff', '900'),
        # Lumbar core node
        at_node_static(frames_fg, 'lumbar', '13.5px', '#ffffff', '700'),
        # Thorax core node
        at_node_static(frames_fg, 'thorax', '13.5px', '#ffffff', '700'),
        # Rotating Shoulder Joint (Large @: 20px)
        at_node_rotating(frames_fg, 'shoulder', 'shoulder_rot', '20px', '#ffffff', '900'),
        # Rotating Iconic Cybernetic Head (Commanding @: 22px)
        at_node_rotating(frames_fg, 'head', 'head_rot', '22px', '#ffffff', '900')
    ]

    # Foreground leg (Primary Illuminated Exoskeleton)
    fg_leg = [
        at_node_static(frames_fg, 'thigh_1', '12.5px', '#ffffff', '700'),
        at_node_static(frames_fg, 'thigh_2', '12.5px', '#ffffff', '700'),
        # Rotating Knee SEA Actuator (Very Large @: 22px)
        at_node_rotating(frames_fg, 'knee', 'knee_rot', '22px', '#ffffff', '900'),
        at_node_static(frames_fg, 'shank_1', '11.5px', '#ffffff', '700'),
        at_node_static(frames_fg, 'shank_2', '11.5px', '#ffffff', '700'),
        # Rotating Ankle Encoder (Large @: 18px)
        at_node_rotating(frames_fg, 'ankle', 'ankle_rot', '18px', '#ffffff', '900'),
        # Articulated Foot Plate
        at_node_static(frames_fg, 'heel', '12px', '#ffffff', '700'),
        at_node_static(frames_fg, 'ball', '12px', '#ffffff', '700'),
        at_node_static(frames_fg, 'toe', '13px', '#ffffff', '800')
    ]

    # Foreground arm (Reciprocal Counter-Phase Arm Swing)
    fg_arm = [
        at_node_static(frames_fg, 'arm_u', '11px', '#ffffff', '600'),
        # Rotating Elbow Joint (Large @: 17px)
        at_node_rotating(frames_fg, 'elbow', 'elbow_rot', '17px', '#ffffff', '900'),
        at_node_static(frames_fg, 'arm_f', '11px', '#ffffff', '600'),
        at_node_static(frames_fg, 'hand', '12.5px', '#ffffff', '800')
    ]

    # Emitted @ Particles (Bursting from closer hand at forward reach towards console)
    emitted_particles = []
    for s_idx in range(4):
        p_frames = sparks_series[s_idx]
        xs = fmt_arr([pt[0] for pt in p_frames])
        ys = fmt_arr([pt[1] for pt in p_frames])
        ops = fmt_arr([pt[2] for pt in p_frames], "{:.2f}")
        size = p_frames[0][3]
        weight = p_frames[0][4]
        elem = f'''    <text class="at-node" font-size="{size}" font-weight="{weight}" fill="#ffffff">
      <animate attributeName="x" values="{xs}" dur="1.25s" repeatCount="indefinite"/>
      <animate attributeName="y" values="{ys}" dur="1.25s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="{ops}" dur="1.25s" repeatCount="indefinite"/>
      @
    </text>'''
        emitted_particles.append(elem)

    # Dynamic Pure @ Assistive Torque Arc (peaks during push-off 0.38 - 0.58)
    torq_ops = fmt_arr([f['torq_op'] for f in frames_fg], "{:.2f}")
    t1_x, t1_y = s2d(frames_fg, 'torq_at_1')
    t2_x, t2_y = s2d(frames_fg, 'torq_at_2')
    t3_x, t3_y = s2d(frames_fg, 'torq_at_3')
    
    torq_arc_nodes = [
        f'''    <text class="at-node" font-size="11px" font-weight="900" fill="#ffffff">
      <animate attributeName="x" values="{t1_x}" dur="1.25s" repeatCount="indefinite"/>
      <animate attributeName="y" values="{t1_y}" dur="1.25s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="{torq_ops}" dur="1.25s" repeatCount="indefinite"/>
      @
    </text>''',
        f'''    <text class="at-node" font-size="14px" font-weight="900" fill="#ffffff">
      <animate attributeName="x" values="{t2_x}" dur="1.25s" repeatCount="indefinite"/>
      <animate attributeName="y" values="{t2_y}" dur="1.25s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="{torq_ops}" dur="1.25s" repeatCount="indefinite"/>
      @
    </text>''',
        f'''    <text class="at-node" font-size="11px" font-weight="900" fill="#ffffff">
      <animate attributeName="x" values="{t3_x}" dur="1.25s" repeatCount="indefinite"/>
      <animate attributeName="y" values="{t3_y}" dur="1.25s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="{torq_ops}" dur="1.25s" repeatCount="indefinite"/>
      @
    </text>'''
    ]

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200" width="100%" height="100%" role="img" aria-label="Animated Character Composed Entirely of @ Signs Walking and Bringing Doctoral Research Information">
  <defs>
    <style><![CDATA[
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800;900&family=Inter:wght@400;600;700&display=swap');
      .mono-bg {{ fill: #0a0a0a; }}
      .outer-frame {{ fill: none; stroke: #1a1a1a; stroke-width: 1; }}
      .card-bg {{ fill: #111111; stroke: #222222; stroke-width: 1; }}
      .ground-line {{ stroke: #222222; stroke-width: 1.5; }}
      .treadmill-tick {{ stroke: #333333; stroke-width: 1.2; }}
      .at-node {{ font-family: 'JetBrains Mono', 'Courier New', monospace; text-anchor: middle; dominant-baseline: central; user-select: none; }}
      .terminal-header {{ font-family: 'JetBrains Mono', monospace; font-size: 10px; fill: #555555; font-weight: 600; letter-spacing: 0.5px; }}
    ]]></style>
  </defs>

  <!-- Clean Monochrome Background -->
  <rect width="1000" height="200" class="mono-bg"/>
  <rect x="6" y="6" width="988" height="188" rx="4" class="outer-frame"/>

  <!-- Datum Ground Line -->
  <line x1="25" y1="168.0" x2="975" y2="168.0" class="ground-line"/>

  <!-- Treadmill Moving Ground Baseline Ticks -->
  <g id="treadmill-datum">
    <animateTransform attributeName="transform" type="translate" values="0,0;-24,0" dur="0.625s" repeatCount="indefinite"/>
    {' '.join(f'<line x1="{x}" y1="168.0" x2="{x}" y2="173.0" class="treadmill-tick"/>' for x in range(0, 1080, 24))}
  </g>

  <!-- ================= INFORMATION CARRIER CONSOLE (25s Cycle) ================= -->
  <!-- Information Card Display -->
  <rect x="200" y="36" width="765" height="114" rx="6" class="card-bg"/>

  <!-- Terminal Header Bar -->
  <line x1="200" y1="56" x2="965" y2="56" stroke="#1c1c1c" stroke-width="1"/>
  <text x="215" y="49" class="terminal-header">HAMZA AZAM · RESEARCH DOSSIER</text>
  <text x="950" y="49" text-anchor="end" class="terminal-header">ZHEJIANG UNIVERSITY</text>

  <!-- Dynamic Information Slides (Synchronized 25s Cycle) -->
  <!-- Slide 1: Musculoskeletal Modeling & Gait Biomechanics -->
  <g id="slide-1" opacity="1">
    <animate attributeName="opacity" values="1;1;0;0;0;0;0;0;0;0;1" keyTimes="0.00;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;0.98;1.00" dur="25s" repeatCount="indefinite"/>
    <text x="225" y="74" fill="#777777" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.8">01 / 05 · DOCTORAL RESEARCH · ZHEJIANG UNIVERSITY</text>
    <text x="225" y="96" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="700">Musculoskeletal Modeling &amp; Gait Biomechanics</text>
    <text x="225" y="117" fill="#aaaaaa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="400">Inferring unobservable joint dynamics from wearable sensors outside laboratory constraints.</text>
    <rect x="225" y="132" width="12" height="3" rx="1.5" fill="#ffffff"/><rect x="243" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="261" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="279" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="297" y="132" width="12" height="3" rx="1.5" fill="#262626"/>
  </g>

  <!-- Slide 2: Subject-Independent Hip Moment Estimation -->
  <g id="slide-2" opacity="0">
    <animate attributeName="opacity" values="0;0;1;1;0;0;0;0;0;0;0" keyTimes="0.00;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;0.98;1.00" dur="25s" repeatCount="indefinite"/>
    <text x="225" y="74" fill="#777777" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.8">02 / 05 · FLAGSHIP PUBLICATION · ESWA 2026</text>
    <text x="225" y="96" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="700">Subject-Independent Hip Moment Estimation</text>
    <text x="225" y="117" fill="#aaaaaa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="400">Continuous sagittal moments from bilateral encoder angles in transitional &amp; steady gait (R² &gt; 0.92).</text>
    <rect x="225" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="243" y="132" width="12" height="3" rx="1.5" fill="#ffffff"/><rect x="261" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="279" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="297" y="132" width="12" height="3" rx="1.5" fill="#262626"/>
  </g>

  <!-- Slide 3: Dynamic Exoskeleton Gait Adaptation -->
  <g id="slide-3" opacity="0">
    <animate attributeName="opacity" values="0;0;0;0;1;1;0;0;0;0;0" keyTimes="0.00;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;0.98;1.00" dur="25s" repeatCount="indefinite"/>
    <text x="225" y="74" fill="#777777" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.8">03 / 05 · ROBOTIC EXOSKELETON CONTROL · IEEE/RSJ IROS 2025</text>
    <text x="225" y="96" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="700">Dynamic Exoskeleton Gait Adaptation (Hm-DMP &amp; PI²)</text>
    <text x="225" y="117" fill="#aaaaaa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="400">Harmonizing biological locomotion with robotic assistance using Dynamic Movement Primitives.</text>
    <rect x="225" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="243" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="261" y="132" width="12" height="3" rx="1.5" fill="#ffffff"/><rect x="279" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="297" y="132" width="12" height="3" rx="1.5" fill="#262626"/>
  </g>

  <!-- Slide 4: MetaTran: Hybrid Transformers -->
  <g id="slide-4" opacity="0">
    <animate attributeName="opacity" values="0;0;0;0;0;0;1;1;0;0;0" keyTimes="0.00;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;0.98;1.00" dur="25s" repeatCount="indefinite"/>
    <text x="225" y="74" fill="#777777" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.8">04 / 05 · DEEP LEARNING TRANSFORMERS · MST 2026</text>
    <text x="225" y="96" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="700">MetaTran: Hybrid Transformers for Fatigue Life</text>
    <text x="225" y="117" fill="#aaaaaa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="400">1D-dilated convolutions and self-attention transformers predicting multi-scale biological &amp; structural fatigue.</text>
    <rect x="225" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="243" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="261" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="279" y="132" width="12" height="3" rx="1.5" fill="#ffffff"/><rect x="297" y="132" width="12" height="3" rx="1.5" fill="#262626"/>
  </g>

  <!-- Slide 5: Closed-Loop Mobility Matching -->
  <g id="slide-5" opacity="0">
    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;1;1;0" keyTimes="0.00;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;0.98;1.00" dur="25s" repeatCount="indefinite"/>
    <text x="225" y="74" fill="#777777" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.8">05 / 05 · WEARABLE BIOMECHATRONICS PARADIGM</text>
    <text x="225" y="96" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="700">Closed-Loop Mobility Matching &amp; Wearable Robotics</text>
    <text x="225" y="117" fill="#aaaaaa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="400">Series Elastic Actuators · Zero Per-Subject Calibration · Adaptive Real-Time Torque Assistance.</text>
    <rect x="225" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="243" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="261" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="279" y="132" width="12" height="3" rx="1.5" fill="#262626"/><rect x="297" y="132" width="12" height="3" rx="1.5" fill="#ffffff"/>
  </g>

  <!-- ================= THE COMPLETE CHARACTER (COMPOSED EXCLUSIVELY OF @ SIGNS) ================= -->
  <!-- Every single anatomical node of the character is strictly an @ sign: NO lines, NO dots, NO paths! -->
  <g id="walking-at-character">
    <!-- 1. Background / Contralateral Arm (@) -->
{chr(10).join(bg_arm)}

    <!-- 2. Background / Contralateral Leg (@) -->
{chr(10).join(bg_leg)}

    <!-- 3. Decluttered Torso, Spine & Head (@) -->
{chr(10).join(torso_head)}

    <!-- 4. Foreground / Primary Leg (@) -->
{chr(10).join(fg_leg)}

    <!-- 5. Foreground / Primary Arm (@) -->
{chr(10).join(fg_arm)}

    <!-- 6. Emitted @ Telemetry Sparks from Closer Hand at Forward Apex (@) -->
{chr(10).join(emitted_particles)}

    <!-- 7. Real-Time Assistive Torque Push-Off Arc (Pure @ Arc) -->
{chr(10).join(torq_arc_nodes)}
  </g>
</svg>
'''
    return svg

def main():
    svg_content = generate_svg()
    
    # Target path relative to repository
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    assets_dir = os.path.join(project_root, 'assets')
    os.makedirs(assets_dir, exist_ok=True)
    
    output_path = os.path.join(assets_dir, 'algorithmic-locomotion.svg')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    
    print(f"Successfully generated locomotion SVG ({len(svg_content)} bytes)")
    print(f"Output saved to: {output_path}")

if __name__ == '__main__':
    main()
