"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";

/* npm install three @types/three */

const FEATURES = [
  {
    id: "pressure",
    label: "Gerçek Zamanlı Basınç",
    desc: "0–16 bar · ±1% hassasiyet",
    side: "right",
    pct: 0.18,
    endPct: 0.46,
  },
  {
    id: "motor",
    label: "Motor Diagnostiği",
    desc: "IE3 sınıfı · termal izleme",
    side: "left",
    pct: 0.3,
    endPct: 0.58,
  },
  {
    id: "valve",
    label: "Emniyet Valfi",
    desc: "12.5 bar'da otomatik açılım",
    side: "left",
    pct: 0.44,
    endPct: 0.72,
  },
  {
    id: "outlet",
    label: "Hava Çıkışı",
    desc: "G¾ BSP · 500 L/min @ 8 bar",
    side: "right",
    pct: 0.57,
    endPct: 0.82,
  },
  {
    id: "life",
    label: "Filtre Ömrü",
    desc: "Prediktif değişim uyarıları",
    side: "right",
    pct: 0.68,
    endPct: 0.93,
  },
];

export default function LandingHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scrollP, setScrollP] = useState(0);
  const [active, setActive] = useState<string[]>([]);

  /* dark mode watcher */
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  /* scroll */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / total));
      setScrollP(p);
      setActive(
        FEATURES.filter((f) => p >= f.pct && p <= f.endPct).map((f) => f.id),
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* THREE scene */
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let raf = 0;
    const W = el.clientWidth || window.innerWidth;
    const H = el.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 0.9 : 1.15;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const BG = new THREE.Color(isDark ? 0x080c14 : 0xf0f2fa);
    scene.background = BG;
    scene.fog = new THREE.FogExp2(
      isDark ? 0x080c14 : 0xf0f2fa,
      isDark ? 0.022 : 0.016,
    );

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 200);
    camera.position.set(0, 3, 13);
    camera.lookAt(0, 0, 0);

    const mk = (geo: THREE.BufferGeometry, mat: THREE.Material) => {
      const m = new THREE.Mesh(geo, mat);
      return m;
    };

    // ── MATERIALS ──────────────────────────────────────────────
    const matSteel = new THREE.MeshStandardMaterial({
      color: isDark ? 0x9ab0c8 : 0x7a9ab8,
      metalness: 0.95,
      roughness: 0.12,
      envMapIntensity: 1.2,
    });
    const matSteelMid = new THREE.MeshStandardMaterial({
      color: isDark ? 0x5a7a96 : 0x506880,
      metalness: 0.9,
      roughness: 0.22,
    });
    const matSteelDark = new THREE.MeshStandardMaterial({
      color: isDark ? 0x2e3d52 : 0x3d5060,
      metalness: 0.85,
      roughness: 0.32,
    });
    const matBrass = new THREE.MeshStandardMaterial({
      color: isDark ? 0xe0a835 : 0xc49428,
      metalness: 0.95,
      roughness: 0.1,
    });
    const matBrassDark = new THREE.MeshStandardMaterial({
      color: isDark ? 0xa07820 : 0x806018,
      metalness: 0.9,
      roughness: 0.2,
    });
    const matAccent = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.5,
      roughness: 0.18,
      emissive: 0x4338ca,
      emissiveIntensity: isDark ? 1.1 : 0.45,
    });
    const matEmerald = new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0x10b981,
      emissiveIntensity: isDark ? 1.0 : 0.4,
    });
    const matRed = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: isDark ? 0.85 : 0.35,
    });
    const matAmber = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: isDark ? 0.9 : 0.4,
    });
    const matGlass = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1e3a5a : 0xdbeafe,
      transparent: true,
      opacity: 0.55,
      metalness: 0.05,
      roughness: 0.0,
    });
    const matBlack = new THREE.MeshStandardMaterial({
      color: isDark ? 0x111620 : 0x1a2030,
      metalness: 0.7,
      roughness: 0.4,
    });
    const matHose = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1e2834 : 0x2a3848,
      metalness: 0.3,
      roughness: 0.8,
    });
    const matYellow = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.2,
      roughness: 0.6,
    });

    const root = new THREE.Group();
    scene.add(root);

    // ── COMPRESSOR BASE / FRAME ────────────────────────────────
    const frameG = new THREE.Group();
    root.add(frameG);

    // Main base plate
    const basePlate = mk(new THREE.BoxGeometry(4.2, 0.18, 2.6), matSteelDark);
    basePlate.position.y = -2.85;
    basePlate.castShadow = basePlate.receiveShadow = true;
    frameG.add(basePlate);

    // Rubber feet
    for (const [fx, fz] of [
      [-1.7, -1.1],
      [1.7, -1.1],
      [-1.7, 1.1],
      [1.7, 1.1],
    ]) {
      const foot = mk(
        new THREE.CylinderGeometry(0.18, 0.22, 0.14, 16),
        matBlack,
      );
      foot.position.set(fx, -2.96, fz);
      frameG.add(foot);
    }

    // Frame rails (yellow safety markings)
    for (const fz of [-1.15, 1.15]) {
      const rail = mk(new THREE.BoxGeometry(4.2, 0.1, 0.1), matSteelMid);
      rail.position.set(0, -2.77, fz);
      frameG.add(rail);
    }

    // ── AIR RECEIVER TANK ──────────────────────────────────────
    const tankG = new THREE.Group();
    tankG.position.set(1.0, 0, 0);
    root.add(tankG);

    // Main cylinder
    const tank = mk(new THREE.CylinderGeometry(1.0, 1.0, 3.8, 96), matSteel);
    tank.castShadow = tank.receiveShadow = true;
    tankG.add(tank);

    // End caps (dished heads)
    for (const [py, rx] of [
      [1.9, 0],
      [-1.9, Math.PI],
    ]) {
      const cap = mk(
        new THREE.SphereGeometry(1.0, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2),
        matSteel,
      );
      cap.position.y = py;
      cap.rotation.x = rx;
      cap.castShadow = true;
      tankG.add(cap);
    }

    // Weld seams
    for (let i = 0; i < 8; i++) {
      const seam = mk(
        new THREE.TorusGeometry(1.002, 0.016, 8, 100),
        matSteelMid,
      );
      seam.rotation.x = Math.PI / 2;
      seam.position.y = -1.75 + i * 0.5;
      tankG.add(seam);
    }

    // Flange rings top/bottom
    for (const fy of [2.0, -2.0]) {
      const flange = mk(
        new THREE.CylinderGeometry(1.18, 1.18, 0.12, 96),
        matSteelDark,
      );
      flange.position.y = fy;
      tankG.add(flange);
      // Bolts
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 2;
        const bolt = mk(
          new THREE.CylinderGeometry(0.04, 0.04, 0.18, 8),
          matBrass,
        );
        bolt.position.set(Math.cos(ang) * 1.08, fy, Math.sin(ang) * 1.08);
        tankG.add(bolt);
        const head = mk(
          new THREE.CylinderGeometry(0.07, 0.07, 0.06, 6),
          matBrassDark,
        );
        head.position.set(
          Math.cos(ang) * 1.08,
          fy + (fy > 0 ? 0.12 : -0.12),
          Math.sin(ang) * 1.08,
        );
        tankG.add(head);
      }
    }

    // Reinforcement bands
    for (let i = 0; i < 6; i++) {
      const band = mk(
        new THREE.CylinderGeometry(1.01, 1.01, 0.055, 96),
        matSteelDark,
      );
      band.position.y = -1.25 + i * 0.5;
      tankG.add(band);
    }

    // Support legs
    for (const fz of [-0.8, 0.8]) {
      const leg = mk(new THREE.BoxGeometry(0.14, 1.0, 0.14), matSteelDark);
      leg.position.set(0, -2.35, fz);
      tankG.add(leg);
      const legFoot = mk(new THREE.BoxGeometry(0.5, 0.1, 0.4), matSteelDark);
      legFoot.position.set(0, -2.85, fz);
      tankG.add(legFoot);
    }

    // Safety valve on top
    const svStem = mk(
      new THREE.CylinderGeometry(0.065, 0.065, 0.45, 14),
      matBrass,
    );
    svStem.position.set(0.3, 2.55, 0);
    tankG.add(svStem);
    const svBody = mk(
      new THREE.CylinderGeometry(0.14, 0.14, 0.3, 14),
      matBrass,
    );
    svBody.position.set(0.3, 2.85, 0);
    tankG.add(svBody);
    const svCap = mk(
      new THREE.SphereGeometry(0.14, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      matRed,
    );
    svCap.position.set(0.3, 3.0, 0);
    tankG.add(svCap);

    // Drain valve at bottom
    const drain = mk(
      new THREE.CylinderGeometry(0.08, 0.08, 0.28, 12),
      matBrass,
    );
    drain.rotation.z = Math.PI / 2;
    drain.position.set(1.12, -2.1, 0);
    tankG.add(drain);
    const drainHandle = mk(new THREE.BoxGeometry(0.2, 0.05, 0.12), matYellow);
    drainHandle.position.set(1.35, -2.1, 0);
    tankG.add(drainHandle);

    // ── COMPRESSOR PUMP HEAD ───────────────────────────────────
    const pumpG = new THREE.Group();
    pumpG.position.set(-1.4, -0.4, 0);
    root.add(pumpG);

    // Pump crankcase body
    const crankcase = mk(new THREE.BoxGeometry(1.1, 0.9, 1.3), matSteelMid);
    crankcase.position.y = 0;
    crankcase.castShadow = true;
    pumpG.add(crankcase);

    // Crankcase ribs
    for (let i = 0; i < 6; i++) {
      const rib = mk(new THREE.BoxGeometry(1.12, 0.06, 0.06), matSteelDark);
      rib.position.y = -0.35 + i * 0.14;
      pumpG.add(rib);
    }

    // Cylinders (2-stage V-twin style)
    for (const [cx, cy, cz, rx] of [
      [-0.08, 0.9, 0.3, -0.3],
      [-0.08, 0.9, -0.3, 0.3],
    ]) {
      const cylG = new THREE.Group();
      cylG.position.set(cx, cy, cz);
      cylG.rotation.x = rx;
      pumpG.add(cylG);

      const cylBody = mk(
        new THREE.CylinderGeometry(0.26, 0.28, 0.8, 32),
        matSteelMid,
      );
      cylBody.castShadow = true;
      cylG.add(cylBody);

      // Cooling fins
      for (let f = 0; f < 10; f++) {
        const fin = mk(
          new THREE.CylinderGeometry(0.34, 0.34, 0.04, 32),
          matSteel,
        );
        fin.position.y = -0.32 + f * 0.072;
        cylG.add(fin);
      }

      // Cylinder head
      const cylHead = mk(
        new THREE.CylinderGeometry(0.28, 0.28, 0.22, 32),
        matSteelDark,
      );
      cylHead.position.y = 0.5;
      cylHead.castShadow = true;
      cylG.add(cylHead);

      // Head bolts
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const hb = mk(
          new THREE.CylinderGeometry(0.035, 0.035, 0.3, 6),
          matBrass,
        );
        hb.position.set(Math.cos(ang) * 0.22, 0.5, Math.sin(ang) * 0.22);
        cylG.add(hb);
      }

      // Valve ports
      const port = mk(
        new THREE.CylinderGeometry(0.055, 0.055, 0.18, 10),
        matBrass,
      );
      port.rotation.z = Math.PI / 2;
      port.position.set(0.32, 0.55, 0);
      cylG.add(port);
    }

    // Intercooler coil (copper tube style)
    const coilPoints: THREE.Vector3[] = [];
    for (let t = 0; t < Math.PI * 4; t += 0.12) {
      coilPoints.push(
        new THREE.Vector3(
          Math.cos(t) * 0.42,
          t * 0.055 - 0.44,
          Math.sin(t) * 0.42 + 0.0,
        ),
      );
    }
    const coilCurve = new THREE.CatmullRomCurve3(coilPoints);
    const coilGeo = new THREE.TubeGeometry(coilCurve, 120, 0.038, 10, false);
    const coilMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xe07820 : 0xc06010,
      metalness: 0.92,
      roughness: 0.1,
    });
    const coil = mk(coilGeo, coilMat);
    coil.position.set(0.78, 0.55, 0);
    coil.castShadow = true;
    pumpG.add(coil);

    // ── ELECTRIC MOTOR ─────────────────────────────────────────
    const motorG = new THREE.Group();
    motorG.position.set(-1.3, -1.5, 0);
    root.add(motorG);

    const motorBody = mk(
      new THREE.CylinderGeometry(0.7, 0.7, 2.0, 64),
      matSteelDark,
    );
    motorBody.rotation.z = Math.PI / 2;
    motorBody.castShadow = true;
    motorG.add(motorBody);

    // Motor cooling fins
    for (let i = 0; i < 20; i++) {
      const mf = mk(
        new THREE.CylinderGeometry(0.78, 0.78, 0.05, 64),
        matSteelMid,
      );
      mf.rotation.z = Math.PI / 2;
      mf.position.x = -0.88 + i * 0.095;
      motorG.add(mf);
    }

    // Motor end caps
    for (const mx of [-1.06, 1.06]) {
      const cap = mk(new THREE.CylinderGeometry(0.62, 0.7, 0.14, 32), matSteel);
      cap.rotation.z = Math.PI / 2;
      cap.position.x = mx;
      motorG.add(cap);
    }

    // Motor shaft & coupling
    const mShaft = mk(
      new THREE.CylinderGeometry(0.07, 0.07, 0.45, 14),
      matBrass,
    );
    mShaft.rotation.z = Math.PI / 2;
    mShaft.position.x = 1.28;
    motorG.add(mShaft);

    // Fan cover (drive end)
    const fanCover = mk(
      new THREE.CylinderGeometry(0.74, 0.74, 0.1, 32),
      matBlack,
    );
    fanCover.rotation.z = Math.PI / 2;
    fanCover.position.x = -1.1;
    motorG.add(fanCover);

    // Motor nameplate
    const nameplate = mk(new THREE.BoxGeometry(0.7, 0.08, 0.4), matAccent);
    nameplate.position.set(0, 0.72, 0);
    motorG.add(nameplate);

    // Motor terminal box
    const termBox = mk(new THREE.BoxGeometry(0.4, 0.22, 0.35), matSteelDark);
    termBox.position.set(0.2, -0.78, 0);
    termBox.castShadow = true;
    motorG.add(termBox);

    // ── BELT / DRIVE PULLEY ────────────────────────────────────
    const driveG = new THREE.Group();
    driveG.position.set(-0.65, -0.95, 0);
    root.add(driveG);

    // Belt guard (transparent cover)
    const beltGuard = mk(
      new THREE.CylinderGeometry(0.9, 0.9, 0.22, 48),
      new THREE.MeshStandardMaterial({
        color: isDark ? 0x1a2a3a : 0xb0c8e0,
        transparent: true,
        opacity: isDark ? 0.18 : 0.22,
        metalness: 0.1,
        roughness: 0.0,
        side: THREE.DoubleSide,
      }),
    );
    beltGuard.rotation.x = Math.PI / 2;
    driveG.add(beltGuard);

    // Large flywheel / driven pulley
    const flywheel = mk(
      new THREE.CylinderGeometry(0.76, 0.76, 0.12, 64),
      matSteelDark,
    );
    flywheel.rotation.x = Math.PI / 2;
    driveG.add(flywheel);
    const flywheelRim = mk(
      new THREE.TorusGeometry(0.76, 0.05, 10, 64),
      matSteel,
    );
    driveG.add(flywheelRim);
    // Spokes
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const spoke = mk(
        new THREE.CylinderGeometry(0.04, 0.04, 0.68, 8),
        matSteelMid,
      );
      spoke.position.set(Math.cos(ang) * 0.34, 0, Math.sin(ang) * 0.34);
      spoke.rotation.z = ang + Math.PI / 2;
      spoke.rotation.x = Math.PI / 2;
      driveG.add(spoke);
    }

    // ── PRESSURE GAUGE ─────────────────────────────────────────
    const gaugeG = new THREE.Group();
    gaugeG.position.set(2.08, 0.55, 0.55);
    gaugeG.rotation.y = -Math.PI / 3.5;
    root.add(gaugeG);

    const gaugeStem = mk(
      new THREE.CylinderGeometry(0.058, 0.058, 0.3, 14),
      matBrass,
    );
    gaugeStem.rotation.z = Math.PI / 2;
    gaugeStem.position.x = -0.24;
    gaugeG.add(gaugeStem);

    const gaugeNut = mk(
      new THREE.CylinderGeometry(0.1, 0.1, 0.08, 6),
      matBrass,
    );
    gaugeNut.rotation.z = Math.PI / 2;
    gaugeNut.position.x = -0.12;
    gaugeG.add(gaugeNut);

    const gaugeBody = mk(
      new THREE.CylinderGeometry(0.4, 0.4, 0.1, 48),
      matSteel,
    );
    gaugeBody.rotation.x = Math.PI / 2;
    gaugeG.add(gaugeBody);

    const bezel = mk(new THREE.TorusGeometry(0.4, 0.038, 12, 60), matBrass);
    bezel.position.z = 0.06;
    gaugeG.add(bezel);

    const gaugeFace = mk(new THREE.CircleGeometry(0.36, 60), matGlass);
    gaugeFace.position.z = 0.065;
    gaugeG.add(gaugeFace);

    // Dial markings
    for (let i = 0; i <= 16; i++) {
      const a = -Math.PI * 0.75 + (i / 16) * Math.PI * 1.5;
      const isMain = i % 4 === 0;
      const tick = mk(
        new THREE.BoxGeometry(
          isMain ? 0.024 : 0.014,
          isMain ? 0.09 : 0.055,
          0.008,
        ),
        new THREE.MeshStandardMaterial({ color: isDark ? 0x94a3b8 : 0x334155 }),
      );
      tick.position.set(Math.cos(a) * 0.29, Math.sin(a) * 0.29, 0.072);
      tick.rotation.z = a;
      gaugeG.add(tick);
    }

    // Danger zone arc (red)
    for (let i = 12; i <= 16; i++) {
      const a = -Math.PI * 0.75 + (i / 16) * Math.PI * 1.5;
      const danger = mk(
        new THREE.BoxGeometry(0.022, 0.08, 0.008),
        new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xef4444,
          emissiveIntensity: 0.5,
        }),
      );
      danger.position.set(Math.cos(a) * 0.29, Math.sin(a) * 0.29, 0.073);
      danger.rotation.z = a;
      gaugeG.add(danger);
    }

    const needleG = new THREE.Group();
    needleG.position.z = 0.075;
    gaugeG.add(needleG);

    // Needle shape
    const needleTip = mk(new THREE.BoxGeometry(0.018, 0.27, 0.012), matRed);
    needleTip.position.y = 0.135;
    needleG.add(needleTip);
    const needleBase = mk(new THREE.BoxGeometry(0.03, 0.08, 0.012), matRed);
    needleBase.position.y = -0.04;
    needleG.add(needleBase);
    const pivot = mk(new THREE.SphereGeometry(0.04, 12, 12), matBrass);
    needleG.add(pivot);

    // ── CONTROL PANEL / PRESSURE SWITCH ────────────────────────
    const panelG = new THREE.Group();
    panelG.position.set(-0.4, 1.9, 0.85);
    panelG.rotation.y = 0.2;
    root.add(panelG);

    const panelBase = mk(new THREE.BoxGeometry(0.85, 0.62, 0.12), matBlack);
    panelBase.castShadow = true;
    panelG.add(panelBase);

    const panelFace = mk(new THREE.BoxGeometry(0.78, 0.55, 0.02), matSteelDark);
    panelFace.position.z = 0.07;
    panelG.add(panelFace);

    // Panel LEDs
    const ledColors = [
      { c: 0x10b981, e: 0x10b981, ei: isDark ? 1.4 : 0.7 },
      { c: 0xef4444, e: 0xef4444, ei: isDark ? 1.0 : 0.5 },
      { c: 0xf59e0b, e: 0xf59e0b, ei: isDark ? 1.1 : 0.55 },
    ];
    ledColors.forEach((lc, i) => {
      const led = mk(
        new THREE.SphereGeometry(0.045, 12, 12),
        new THREE.MeshStandardMaterial({
          color: lc.c,
          emissive: lc.e,
          emissiveIntensity: lc.ei,
        }),
      );
      led.position.set(-0.25 + i * 0.25, 0.14, 0.09);
      panelG.add(led);
    });

    // On/off button
    const bigBtn = mk(
      new THREE.CylinderGeometry(0.09, 0.09, 0.06, 20),
      matEmerald,
    );
    bigBtn.rotation.x = Math.PI / 2;
    bigBtn.position.set(-0.22, -0.1, 0.09);
    panelG.add(bigBtn);

    // Emergency stop (red mushroom)
    const eStop = mk(new THREE.CylinderGeometry(0.1, 0.085, 0.05, 20), matRed);
    eStop.rotation.x = Math.PI / 2;
    eStop.position.set(0.2, -0.1, 0.09);
    panelG.add(eStop);
    const eStopTop = mk(
      new THREE.SphereGeometry(0.11, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      matRed,
    );
    eStopTop.rotation.x = Math.PI / 2;
    eStopTop.position.set(0.2, -0.1, 0.13);
    panelG.add(eStopTop);

    // Pressure knob
    const knob = mk(
      new THREE.CylinderGeometry(0.065, 0.065, 0.06, 20),
      matBrass,
    );
    knob.rotation.x = Math.PI / 2;
    knob.position.set(0.0, -0.1, 0.09);
    panelG.add(knob);

    // ── PIPES & CONNECTIONS ─────────────────────────────────────
    // Main pressure pipe (pump head → tank)
    const pipe1 = mk(new THREE.CylinderGeometry(0.07, 0.07, 1.6, 16), matSteel);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(-0.2, 1.1, 0.3);
    root.add(pipe1);

    const elbow1 = mk(
      new THREE.TorusGeometry(0.22, 0.07, 14, 28, Math.PI / 2),
      matSteel,
    );
    elbow1.position.set(0.6, 1.1, 0.3);
    root.add(elbow1);

    const pipe2 = mk(new THREE.CylinderGeometry(0.07, 0.07, 1.0, 16), matSteel);
    pipe2.position.set(0.82, 1.55, 0.3);
    root.add(pipe2);

    // Tank outlet pipe
    const outPipe = mk(
      new THREE.CylinderGeometry(0.09, 0.09, 0.9, 16),
      matSteel,
    );
    outPipe.rotation.z = Math.PI / 2;
    outPipe.position.set(1.65, -0.4, 0);
    tankG.add(outPipe);

    const outCap = mk(
      new THREE.CylinderGeometry(0.13, 0.13, 0.1, 16),
      matBrass,
    );
    outCap.rotation.z = Math.PI / 2;
    outCap.position.set(2.1, -0.4, 0);
    tankG.add(outCap);

    // Quick-connect fitting
    const qc = mk(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 14), matBrass);
    qc.rotation.z = Math.PI / 2;
    qc.position.set(2.28, -0.4, 0);
    tankG.add(qc);
    const qcCollar = mk(
      new THREE.CylinderGeometry(0.13, 0.13, 0.08, 14),
      matBlack,
    );
    qcCollar.rotation.z = Math.PI / 2;
    qcCollar.position.set(2.37, -0.4, 0);
    tankG.add(qcCollar);

    // Air hose (curved tube)
    const hosePoints: THREE.Vector3[] = [];
    for (let t = 0; t <= 1; t += 0.05) {
      hosePoints.push(
        new THREE.Vector3(
          3.45 + t * 0.6,
          -0.4 + Math.sin(t * Math.PI) * 0.4,
          t * 0.5,
        ),
      );
    }
    const hoseCurve = new THREE.CatmullRomCurve3(hosePoints);
    const hoseGeo = new THREE.TubeGeometry(hoseCurve, 40, 0.07, 10, false);
    const hose = mk(hoseGeo, matHose);
    root.add(hose);

    // Pressure switch on tank
    const psG = new THREE.Group();
    psG.position.set(-0.5, 2.05, 0.75);
    tankG.add(psG);
    const psBody = mk(new THREE.BoxGeometry(0.28, 0.22, 0.22), matBlack);
    psG.add(psBody);
    const psStem = mk(
      new THREE.CylinderGeometry(0.04, 0.04, 0.22, 10),
      matBrass,
    );
    psStem.position.y = -0.22;
    psG.add(psStem);

    // ── ACCENT RING ─────────────────────────────────────────────
    const accentRing = mk(
      new THREE.TorusGeometry(1.005, 0.055, 14, 100),
      matAccent,
    );
    accentRing.rotation.x = Math.PI / 2;
    tankG.add(accentRing);

    // ── FLOOR ───────────────────────────────────────────────────
    const floor = mk(
      new THREE.CircleGeometry(7, 80),
      new THREE.MeshStandardMaterial({
        color: isDark ? 0x0a1020 : 0xdde2f0,
        metalness: 0.05,
        roughness: 0.95,
        transparent: true,
        opacity: 0.55,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.12;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor grid lines
    for (let i = -6; i <= 6; i++) {
      const gl = mk(
        new THREE.BoxGeometry(12, 0.004, 0.012),
        new THREE.MeshStandardMaterial({
          color: isDark ? 0x1a2840 : 0xb8c0d8,
          transparent: true,
          opacity: 0.3,
        }),
      );
      gl.position.set(0, -3.11, i);
      scene.add(gl);
      const gl2 = mk(
        new THREE.BoxGeometry(0.012, 0.004, 12),
        new THREE.MeshStandardMaterial({
          color: isDark ? 0x1a2840 : 0xb8c0d8,
          transparent: true,
          opacity: 0.3,
        }),
      );
      gl2.position.set(i, -3.11, 0);
      scene.add(gl2);
    }

    // ── PARTICLES ───────────────────────────────────────────────
    const PC = 280;
    const pPos = new Float32Array(PC * 3);
    const pVel = new Float32Array(PC * 3);
    const pLife = new Float32Array(PC);

    const resetP = (i: number) => {
      const r = 2.5 + Math.random() * 5;
      const a = Math.random() * Math.PI * 2;
      pPos[i * 3] = Math.cos(a) * r;
      pPos[i * 3 + 1] = -3.5 + Math.random() * 10;
      pPos[i * 3 + 2] = Math.sin(a) * r;
      pVel[i * 3] = (Math.random() - 0.5) * 0.005;
      pVel[i * 3 + 1] = 0.004 + Math.random() * 0.009;
      pVel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
      pLife[i] = Math.random();
    };
    for (let i = 0; i < PC; i++) resetP(i);

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pts = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: isDark ? 0x818cf8 : 0x6366f1,
        size: isDark ? 0.06 : 0.045,
        transparent: true,
        opacity: isDark ? 0.55 : 0.35,
        sizeAttenuation: true,
      }),
    );
    scene.add(pts);

    // ── LIGHTS ──────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.65 : 2.2));

    const keyL = new THREE.DirectionalLight(
      isDark ? 0xe0e8ff : 0xffffff,
      isDark ? 5.0 : 6.5,
    );
    keyL.position.set(6, 10, 8);
    keyL.castShadow = true;
    keyL.shadow.mapSize.set(2048, 2048);
    keyL.shadow.camera.top = keyL.shadow.camera.right = 10;
    keyL.shadow.camera.bottom = keyL.shadow.camera.left = -10;
    keyL.shadow.bias = -0.0003;
    scene.add(keyL);

    const rimL = new THREE.DirectionalLight(
      isDark ? 0x818cf8 : 0xa5b4fc,
      isDark ? 3.0 : 2.0,
    );
    rimL.position.set(-8, 3, -5);
    scene.add(rimL);

    const fillL = new THREE.DirectionalLight(0x10b981, isDark ? 1.8 : 1.2);
    fillL.position.set(2, -7, -6);
    scene.add(fillL);

    const underL = new THREE.DirectionalLight(
      isDark ? 0x1e3a5a : 0x90b0d0,
      isDark ? 1.5 : 0.8,
    );
    underL.position.set(0, -5, 5);
    scene.add(underL);

    const glowL = new THREE.PointLight(0x4f46e5, isDark ? 4.5 : 3.0, 8);
    tankG.add(glowL);

    const motorGlow = new THREE.PointLight(0x10b981, isDark ? 2.5 : 1.5, 5);
    motorGlow.position.set(-1.3, -1.5, 0);
    root.add(motorGlow);

    let extScrollP = 0;
    (el as any).__setScroll = (p: number) => {
      extScrollP = p;
    };

    let clock = 0;
    setTimeout(() => setVisible(true), 300);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      clock += 0.009;

      const targetRotY = extScrollP * Math.PI * 0.6;
      root.rotation.y += (targetRotY - root.rotation.y) * 0.055;
      camera.position.z += (13 + extScrollP * 2.0 - camera.position.z) * 0.055;
      camera.position.y += (3.0 + extScrollP * 1.0 - camera.position.y) * 0.055;
      camera.position.x =
        Math.sin(clock * 0.12) * (extScrollP > 0.05 ? 0.18 : 0.45);
      camera.lookAt(0, 0.5, 0);

      root.position.y = Math.sin(clock * 0.55) * 0.05;

      // Flywheel / pulley rotation
      driveG.rotation.z = clock * 4.5;

      // Motor shaft
      mShaft.rotation.x = clock * 9;

      // Needle animation (realistic pressure oscillation)
      needleG.rotation.z =
        -0.72 +
        Math.sin(clock * 0.7) * 0.38 +
        Math.sin(clock * 1.9) * 0.07 +
        Math.sin(clock * 4.8) * 0.025;

      // Pulsing emissives
      matAccent.emissiveIntensity =
        (isDark ? 1.1 : 0.45) + Math.sin(clock * 1.6) * 0.25;
      matEmerald.emissiveIntensity =
        (isDark ? 1.0 : 0.4) + Math.sin(clock * 2.2) * 0.2;
      glowL.intensity = (isDark ? 4.5 : 3.0) + Math.sin(clock * 1.8) * 1.2;
      motorGlow.intensity = (isDark ? 2.5 : 1.5) + Math.sin(clock * 2.6) * 0.8;

      // Particle update
      for (let i = 0; i < PC; i++) {
        pPos[i * 3] += pVel[i * 3];
        pPos[i * 3 + 1] += pVel[i * 3 + 1];
        pPos[i * 3 + 2] += pVel[i * 3 + 2];
        pLife[i] += 0.007;
        if (pLife[i] > 1 || pPos[i * 3 + 1] > 6) resetP(i);
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const nW = el.clientWidth,
        nH = el.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [isDark]);

  useEffect(() => {
    if (mountRef.current) (mountRef.current as any).__setScroll?.(scrollP);
  }, [scrollP]);

  const heroOpacity = Math.max(0, 1 - scrollP * 7);
  const ctaOpacity = scrollP > 0.88 ? (scrollP - 0.88) / 0.12 : 0;

  return (
    <div ref={wrapRef} style={{ height: "500vh", position: "relative" }}>
      <div
        className="sticky overflow-hidden"
        style={{ top: 0, width: "100%", height: "100vh" }}
      >
        {/* 3-D canvas */}
        <div
          ref={mountRef}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
        />

        {/* fade-in */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-[900ms]"
          style={{
            zIndex: 8,
            opacity: visible ? 0 : 1,
            background: isDark ? "#080c14" : "#f0f2fa",
          }}
        />

        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: isDark
              ? "radial-gradient(ellipse at 60% 48%, transparent 22%, rgba(8,12,20,0.84) 100%)"
              : "radial-gradient(ellipse at 60% 48%, transparent 22%, rgba(240,242,250,0.80) 100%)",
          }}
        />

        {/* bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            zIndex: 3,
            height: 150,
            background: isDark
              ? "linear-gradient(to bottom,transparent,#080c14)"
              : "linear-gradient(to bottom,transparent,#f0f2fa)",
          }}
        />

        {/* ── HERO COPY ── */}
        <div
          className="absolute left-0 top-0 bottom-0 flex flex-col justify-center pointer-events-none"
          style={{
            zIndex: 10,
            paddingLeft: "clamp(28px,6vw,88px)",
            maxWidth: 540,
            opacity: visible ? heroOpacity : 0,
            transform: `translateX(${visible ? 0 : -16}px)`,
            transition: "transform 0.8s ease, opacity 0.1s linear",
          }}
        >
          <div
            className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full w-fit pointer-events-auto"
            style={{
              background: "rgba(16,185,129,0.10)",
              border: "1px solid rgba(16,185,129,0.22)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Sistem Aktif · %99.9 Uptime
            </span>
          </div>

          <h1
            className="font-black text-gray-900 dark:text-white"
            style={{
              fontSize: "clamp(38px,4.2vw,72px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Kompresörünüzün{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Kontrolü
            </span>{" "}
            Elinizde.
          </h1>

          <p
            className="text-gray-500 dark:text-slate-400 leading-relaxed"
            style={{
              fontSize: "clamp(14px,1.3vw,16px)",
              maxWidth: 400,
              marginTop: 18,
            }}
          >
            Beklenmedik arızaları önleyin, bakımları takip edin ve tüm kompresör
            sistemlerinizi tek platformdan yönetin.
          </p>

          <div
            className="flex gap-3 pointer-events-auto"
            style={{ marginTop: 26 }}
          >
            <Link
              href="/auth"
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5"
              style={{ fontSize: 14, textDecoration: "none" }}
            >
              Ücretsiz Başla →
            </Link>
            <button
              className="px-7 py-3.5 bg-gray-100 dark:bg-white/8 hover:bg-gray-200 dark:hover:bg-white/12 text-gray-800 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-white/12 transition-all duration-200 hover:-translate-y-0.5"
              style={{ fontSize: 14 }}
            >
              Demo İzle
            </button>
          </div>

          <div
            className="flex gap-8 border-t border-gray-200 dark:border-white/10"
            style={{ marginTop: 28, paddingTop: 22 }}
          >
            {[
              {
                v: "3 Tık",
                l: "İşlem Akışı",
                c: "text-gray-900 dark:text-white",
              },
              { v: "−40%", l: "Daha Az Duruş", c: "text-emerald-500" },
              {
                v: "Bulut",
                l: "Gerçek Zamanlı",
                c: "text-indigo-600 dark:text-indigo-400",
              },
            ].map(({ v, l, c }) => (
              <div key={l}>
                <p
                  className={`font-black ${c}`}
                  style={{ fontSize: 22, margin: 0 }}
                >
                  {v}
                </p>
                <p
                  className="text-gray-500 font-semibold uppercase"
                  style={{ fontSize: 10, letterSpacing: ".08em", marginTop: 2 }}
                >
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SCROLL ANNOTATIONS ── */}
        {FEATURES.map((f) => {
          const on = active.includes(f.id);
          const isR = f.side === "right";
          return (
            <div
              key={f.id}
              className="absolute pointer-events-none"
              style={{
                top: "50%",
                left: isR ? "auto" : "5%",
                right: isR ? "5%" : "auto",
                zIndex: 15,
                display: "flex",
                alignItems: "center",
                flexDirection: isR ? "row" : "row-reverse",
                gap: 10,
                opacity: on ? 1 : 0,
                transition: "opacity 0.4s ease, transform 0.4s ease",
                transform: `translateY(-50%) translateX(${on ? 0 : isR ? 16 : -16}px)`,
              }}
            >
              <div
                style={{
                  height: 1,
                  flexShrink: 0,
                  width: on ? 52 : 0,
                  background: isR
                    ? "linear-gradient(90deg,rgba(99,102,241,0),#6366f1)"
                    : "linear-gradient(270deg,rgba(99,102,241,0),#6366f1)",
                  transition: "width 0.5s 0.08s ease",
                }}
              />
              <div
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-indigo-200/50 dark:border-indigo-500/20 rounded-xl shadow-lg"
                style={{ padding: "10px 14px", minWidth: 175 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#6366f1",
                      boxShadow: "0 0 7px #6366f1",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="text-gray-900 dark:text-white"
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {f.label}
                  </span>
                </div>
                <p
                  className="text-gray-500 dark:text-slate-400"
                  style={{ fontSize: 11, lineHeight: 1.5, margin: 0 }}
                >
                  {f.desc}
                </p>
              </div>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4f46e5",
                  boxShadow: "0 0 9px #6366f1",
                  flexShrink: 0,
                }}
              />
            </div>
          );
        })}

        {/* ── END CTA ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none"
          style={{
            bottom: "12%",
            zIndex: 16,
            opacity: ctaOpacity,
            transition: "opacity 0.3s",
            pointerEvents: ctaOpacity > 0.5 ? "auto" : "none",
          }}
        >
          <p
            className="font-black text-gray-900 dark:text-white"
            style={{
              fontSize: "clamp(22px,3vw,42px)",
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            Duruşları Azaltmaya Hazır mısınız?
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/auth"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-2xl shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5"
              style={{ fontSize: 15, textDecoration: "none" }}
            >
              Ücretsiz Başla →
            </Link>
            <button
              className="px-8 py-4 bg-gray-100 dark:bg-white/8 hover:bg-gray-200 dark:hover:bg-white/12 text-gray-800 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5"
              style={{ fontSize: 15 }}
            >
              Demo İzle
            </button>
          </div>
        </div>

        {/* progress bar */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ zIndex: 20, height: 2 }}
        >
          <div
            style={{
              height: "100%",
              width: `${scrollP * 100}%`,
              background: "linear-gradient(90deg,#4f46e5,#10b981)",
              transition: "width .1s",
            }}
          />
        </div>

        {/* scroll hint */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            bottom: 24,
            zIndex: 10,
            opacity: visible && scrollP < 0.04 ? 0.45 : 0,
            transition: "opacity 0.5s",
          }}
        >
          <div
            style={{
              width: 22,
              height: 34,
              borderRadius: 11,
              border: `1px solid ${isDark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.12)"}`,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 5,
            }}
          >
            <div
              style={{
                width: 4,
                height: 7,
                borderRadius: 2,
                background: "#6366f1",
                animation: "sdot 1.5s ease infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`@keyframes sdot{0%{transform:translateY(0);opacity:1}100%{transform:translateY(10px);opacity:0}}`}</style>
    </div>
  );
}
