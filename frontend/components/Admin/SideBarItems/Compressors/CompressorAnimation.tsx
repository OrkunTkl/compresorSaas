"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    THREE: any;
    anime: any;
  }
}

export interface Compressor {
  id: number;
  serial_number: string;
  name: string;
  status: string;
  health: number;
  current_pressure: string | number;
  current_temp: string | number;
  max_operating_hours: number;
  average_daily_hours: number;
  model: string;
}

interface Props {
  compressor: Compressor;
  onClose: () => void;
  isDark?: boolean;
}

const SC = (s: string) =>
  s === "Running" ? "#10b981" : s === "Warning" ? "#f59e0b" : "#ef4444";
const HC = (h: number) => (h > 80 ? "#10b981" : h > 40 ? "#f97316" : "#ef4444");

const loadScript = (src: string) =>
  new Promise<void>((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      res();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => res();
    s.onerror = rej;
    document.head.appendChild(s);
  });

export default function CompressorAnimation({
  compressor,
  onClose,
  isDark = true,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const drag = useRef({ active: false, x: 0, y: 0 });
  const autoRot = useRef(true);
  const ledRef = useRef<any>(null);

  const [loaded, setLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [liveData, setLiveData] = useState<Compressor>(compressor);
  const [fetching, setFetching] = useState(false);

  const sc = SC(liveData.status);
  const hc = HC(liveData.health);

  const cardBg = isDark ? "#070e1e" : "#ffffff";
  const headerBg = isDark ? "rgba(8,14,28,0.94)" : "rgba(248,250,255,0.94)";
  const borderC = isDark ? "#1d3a5c" : "#d0dcf0";
  const textPri = isDark ? "#e2e8f0" : "#1a202c";
  const textSec = isDark ? "#5a7aa0" : "#6b7a99";
  const trackBg = isDark ? "#0d1929" : "#e2e8f4";
  const metaBg = (c: string) => (isDark ? `${c}12` : `${c}18`);
  const metaBd = (c: string) => (isDark ? `${c}28` : `${c}55`);

  // ── Fetch fresh data from backend when details opened ─────────────────────
  const fetchLive = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/compressors/${compressor.id}`);
      if (res.ok) {
        const d = await res.json();
        setLiveData(d);
      }
    } catch {
      /* keep existing data */
    } finally {
      setFetching(false);
    }
  };

  const toggleDetails = () => {
    const next = !showDetails;
    setShowDetails(next);
    autoRot.current = !next;
    if (next) fetchLive();
    if (window.anime && cameraRef.current) {
      const c = cameraRef.current;
      const o = { x: c.position.x };
      window.anime({
        targets: o,
        x: next ? -1.8 : 0,
        duration: 700,
        easing: "easeInOutQuart",
        update: () => {
          c.position.x = o.x;
        },
      });
    }
  };

  // ── 3-D scene ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let disposed = false;
    let disposeScene: (() => void) | undefined;

    (async () => {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
      );
      if (disposed || !mountRef.current) return;

      const THREE = window.THREE;
      const anime = window.anime;
      const el = mountRef.current;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      el.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        el.clientWidth / el.clientHeight,
        0.1,
        100,
      );
      camera.position.set(0, 1.2, 6.5);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Lights
      scene.add(new THREE.AmbientLight(0x404060, 0.8));
      const key = new THREE.DirectionalLight(0x4488ff, 1.5);
      key.position.set(5, 8, 5);
      key.castShadow = true;
      key.shadow.mapSize.setScalar(2048);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xff8844, 0.6);
      fill.position.set(-5, 3, -3);
      scene.add(fill);
      const rim = new THREE.PointLight(0x00ffcc, 0.8, 15);
      rim.position.set(-3, 4, -4);
      scene.add(rim);

      const M = (
        color: number,
        metalness = 0.85,
        roughness = 0.15,
        emissive?: number,
        emissiveIntensity = 0,
      ) =>
        new THREE.MeshStandardMaterial({
          color,
          metalness,
          roughness,
          ...(emissive != null ? { emissive, emissiveIntensity } : {}),
        });

      const mBody = M(0x1e3a5f);
      const mAccent = M(0x3b82f6, 0.9, 0.1, 0x1a3a6e, 0.3);
      const mDark = M(0x0d1929, 0.7, 0.3);
      const mPipe = M(0xc0c8d8, 0.95, 0.05);
      const scHex = parseInt(sc.replace("#", ""), 16);
      const mGlow = M(scHex, 0.2, 0.3, scHex, 0.9);

      // ── Group ──────────────────────────────────────────────────────────────
      const g = new THREE.Group();
      groupRef.current = g;
      g.scale.setScalar(0.01);
      g.position.y = -5;

      const add = (
        geo: any,
        mat: any,
        pos: [number, number, number] = [0, 0, 0],
        rot: [number, number, number] = [0, 0, 0],
      ) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(...pos);
        m.rotation.set(...rot);
        m.castShadow = m.receiveShadow = true;
        g.add(m);
        return m;
      };

      // Tank (horizontal cylinder)
      add(
        new THREE.CylinderGeometry(0.8, 0.8, 3, 40),
        mBody,
        [0, 0, 0],
        [0, 0, Math.PI / 2],
      );
      // Caps
      const capG = new THREE.SphereGeometry(
        0.8,
        32,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2,
      );
      add(capG, mAccent, [-1.5, 0, 0], [0, 0, Math.PI / 2]);
      add(capG, mAccent, [1.5, 0, 0], [0, 0, -Math.PI / 2]);

      // ── LEGS: attached directly to tank bottom ─────────────────────────────
      // Tank bottom is at y = -0.8 (radius). Legs go from tank bottom down to y = -1.5
      // 4 legs evenly placed under the tank, connected at the tank body
      const legXZ: [number, number][] = [
        [-1.0, 0.45],
        [-1.0, -0.45],
        [1.0, 0.45],
        [1.0, -0.45],
      ];
      legXZ.forEach(([lx, lz]) => {
        // Vertical leg strut — top at tank bottom (-0.8), bottom at -1.55
        const legH = 0.75;
        add(new THREE.CylinderGeometry(0.055, 0.055, legH, 12), mDark, [
          lx,
          -0.8 - legH / 2,
          lz,
        ]);
        // Foot pad
        add(new THREE.BoxGeometry(0.22, 0.05, 0.22), mAccent, [
          lx,
          -0.8 - legH,
          lz,
        ]);
        // Diagonal brace from leg top to tank side (cosmetic connector strip)
        add(new THREE.BoxGeometry(0.04, 0.04, 0.04), mAccent, [lx, -0.8, lz]);
      });

      // Motor block on top
      add(new THREE.BoxGeometry(1.4, 0.9, 1.1), mDark, [-0.5, 1.1, 0]);
      add(new THREE.BoxGeometry(1.45, 0.12, 1.15), mAccent, [-0.5, 1.57, 0]);
      // Compressor head
      add(new THREE.BoxGeometry(1.0, 0.85, 0.95), mBody, [0.8, 1.05, 0]);

      // Fan blades
      for (let i = 0; i < 6; i++) {
        const fg = new THREE.Group();
        fg.position.set(-0.5, 1.1, 0.56);
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.34, 0.04),
          mAccent,
        );
        const a = (i / 6) * Math.PI * 2;
        b.position.set(Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0);
        b.rotation.z = a;
        fg.add(b);
        g.add(fg);
      }
      add(
        new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16),
        mGlow,
        [-0.5, 1.1, 0.58],
        [Math.PI / 2, 0, 0],
      );

      // Pipes
      add(
        new THREE.CylinderGeometry(0.07, 0.07, 1.2, 12),
        mPipe,
        [1.1, 0.8, 0],
      );
      add(
        new THREE.CylinderGeometry(0.07, 0.07, 0.8, 12),
        mPipe,
        [0.75, 1.35, 0],
        [0, 0, Math.PI / 2],
      );
      add(
        new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12),
        mPipe,
        [-0.5, 0.6, 0.5],
        [Math.PI / 2, 0, 0],
      );
      add(new THREE.BoxGeometry(0.18, 0.18, 0.22), mAccent, [-0.5, 0.6, 0.85]);

      // LED + Gauge
      const led = add(
        new THREE.SphereGeometry(0.08, 16, 16),
        mGlow,
        [0.8, 1.52, 0.4],
      );
      ledRef.current = led.material;
      add(
        new THREE.TorusGeometry(0.18, 0.025, 8, 32),
        mAccent,
        [0.8, 1.05, 0.48],
      );
      add(
        new THREE.CircleGeometry(0.15, 32),
        M(0x0a1628, 0.5, 0.5),
        [0.8, 1.05, 0.49],
      );
      add(
        new THREE.BoxGeometry(0.02, 0.12, 0.01),
        M(0xff3333, 0.2, 0.4, 0xff2222, 0.5),
        [0.8, 1.09, 0.5],
        [0, 0, -0.5],
      );
      add(
        new THREE.PlaneGeometry(0.6, 0.2),
        M(0x1a3a6e, 0.5, 0.5, 0x1a3a6e, 0.4),
        [-0.5, 1.1, 0.56],
      );

      scene.add(g);

      // Particles only (no grid, no ring)
      const pArr = new Float32Array(80 * 3).map(
        () => (Math.random() - 0.5) * 10,
      );
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
      const pts = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0x3b82f6,
          size: 0.04,
          transparent: true,
          opacity: 0.45,
        }),
      );
      scene.add(pts);

      setLoaded(true);

      // Entry animation
      const ao = { y: -5, s: 0.01, ry: 0 };
      anime({
        targets: ao,
        y: 0,
        s: 1,
        ry: Math.PI * 2,
        duration: 1400,
        easing: "easeOutElastic(1, 0.6)",
        update: () => {
          if (!groupRef.current) return;
          groupRef.current.position.y = ao.y;
          groupRef.current.scale.setScalar(ao.s);
          groupRef.current.rotation.y = ao.ry;
        },
      });

      // Render loop
      let t = 0;
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        t += 0.01;
        if (autoRot.current && !drag.current.active && groupRef.current)
          groupRef.current.rotation.y += 0.006;
        pts.rotation.y += 0.001;
        if (ledRef.current)
          ledRef.current.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.4;
        renderer.render(scene, camera);
      };
      loop();

      // Drag
      const cv = renderer.domElement;
      const mouseDown = (e: MouseEvent) => {
        drag.current = { active: true, x: e.clientX, y: e.clientY };
        autoRot.current = false;
      };
      const mouseMove = (e: MouseEvent) => {
        if (!drag.current.active || !groupRef.current) return;
        groupRef.current.rotation.y += (e.clientX - drag.current.x) * 0.01;
        groupRef.current.rotation.x = Math.max(
          -0.7,
          Math.min(
            0.7,
            groupRef.current.rotation.x + (e.clientY - drag.current.y) * 0.01,
          ),
        );
        drag.current = { active: true, x: e.clientX, y: e.clientY };
      };
      const mouseUp = () => {
        drag.current.active = false;
      };
      const touchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;
        drag.current = {
          active: true,
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        autoRot.current = false;
      };
      const touchMove = (e: TouchEvent) => {
        if (!drag.current.active || e.touches.length !== 1 || !groupRef.current)
          return;
        groupRef.current.rotation.y +=
          (e.touches[0].clientX - drag.current.x) * 0.01;
        groupRef.current.rotation.x = Math.max(
          -0.7,
          Math.min(
            0.7,
            groupRef.current.rotation.x +
              (e.touches[0].clientY - drag.current.y) * 0.01,
          ),
        );
        drag.current = {
          active: true,
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      };
      const touchEnd = () => {
        drag.current.active = false;
      };

      // Scroll zoom
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        camera.position.z = Math.max(
          3,
          Math.min(14, camera.position.z * (e.deltaY > 0 ? 1.1 : 0.9)),
        );
      };
      // Pinch zoom
      let lastPinch = 0;
      const onPinchMove = (e: TouchEvent) => {
        if (e.touches.length !== 2) return;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastPinch)
          camera.position.z = Math.max(
            3,
            Math.min(14, camera.position.z * (lastPinch / dist)),
          );
        lastPinch = dist;
      };
      const onPinchEnd = () => {
        lastPinch = 0;
      };

      const onResize = () => {
        if (!mountRef.current) return;
        camera.aspect =
          mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          mountRef.current.clientWidth,
          mountRef.current.clientHeight,
        );
      };

      cv.addEventListener("mousedown", mouseDown);
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
      cv.addEventListener("touchstart", touchStart, { passive: true });
      cv.addEventListener("touchmove", touchMove, { passive: true });
      cv.addEventListener("touchmove", onPinchMove, { passive: true });
      window.addEventListener("touchend", touchEnd);
      window.addEventListener("touchend", onPinchEnd);
      cv.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("resize", onResize);

      disposeScene = () => {
        cancelAnimationFrame(rafRef.current);
        cv.removeEventListener("mousedown", mouseDown);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
        cv.removeEventListener("touchstart", touchStart);
        cv.removeEventListener("touchmove", touchMove);
        cv.removeEventListener("touchmove", onPinchMove);
        window.removeEventListener("touchend", touchEnd);
        window.removeEventListener("touchend", onPinchEnd);
        cv.removeEventListener("wheel", onWheel);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (mountRef.current?.contains(cv)) mountRef.current.removeChild(cv);
      };
    })().catch(console.error);

    return () => {
      disposed = true;
      disposeScene?.();
    };
  }, []);

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "92vw",
          maxWidth: 1100,
          height: "80vh",
          background: cardBg,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${borderC}`,
          boxShadow:
            "0 0 80px rgba(59,130,246,0.14), 0 40px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            zIndex: 10,
            background: headerBg,
            borderBottom: `1px solid ${borderC}`,
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: sc,
                boxShadow: `0 0 8px ${sc}`,
                animation: "ca_pulse 1.5s infinite",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 2,
                color: textSec,
                textTransform: "uppercase",
              }}
            >
              3D Compressor Viewer
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6" }}>
              {liveData.serial_number}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={toggleDetails}
              style={{
                background: showDetails ? "#3b82f6" : "transparent",
                border: "1px solid #3b82f6",
                color: showDetails ? "#fff" : "#3b82f6",
                borderRadius: 7,
                padding: "6px 14px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.25s",
              }}
            >
              {showDetails ? "← CLOSE" : "DETAILS →"}
            </button>
            <button
              onClick={onClose}
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.28)",
                color: "#ef4444",
                borderRadius: 7,
                width: 34,
                height: 34,
                cursor: "pointer",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* 3-D Canvas */}
        <div
          ref={mountRef}
          style={{
            flex: showDetails ? "0 0 55%" : "1",
            marginTop: 56,
            cursor: "grab",
            position: "relative",
            transition: "flex 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {!loaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  border: `3px solid ${borderC}`,
                  borderTopColor: "#3b82f6",
                  borderRadius: "50%",
                  animation: "ca_spin 0.9s linear infinite",
                }}
              />
              <span style={{ fontSize: 11, letterSpacing: 2, color: textSec }}>
                LOADING 3D MODEL…
              </span>
            </div>
          )}
          {loaded && !showDetails && (
            <span
              style={{
                position: "absolute",
                bottom: 18,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 11,
                color: textSec,
                letterSpacing: 1,
                whiteSpace: "nowrap",
              }}
            >
              🖱 DRAG · SCROLL TO ZOOM
            </span>
          )}
        </div>

        {/* Details Panel */}
        <div
          style={{
            width: showDetails ? "45%" : "0%",
            opacity: showDetails ? 1 : 0,
            overflow: "hidden",
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
            marginTop: 56,
            background: cardBg,
            borderLeft: showDetails ? `1px solid ${borderC}` : "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: 24,
              height: "100%",
              overflowY: "auto",
              transform: showDetails ? "translateX(0)" : "translateX(22px)",
              transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1) 0.1s",
            }}
          >
            {fetching ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: `3px solid ${borderC}`,
                    borderTopColor: "#3b82f6",
                    borderRadius: "50%",
                    animation: "ca_spin 0.9s linear infinite",
                  }}
                />
                <span
                  style={{ fontSize: 11, color: textSec, letterSpacing: 1 }}
                >
                  FETCHING DATA…
                </span>
              </div>
            ) : (
              <>
                {/* Name & Model */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#3b82f6",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Unit Name
                  </div>
                  <div
                    style={{ fontSize: 20, fontWeight: 800, color: textPri }}
                  >
                    {liveData.name}
                  </div>
                  <div style={{ fontSize: 12, color: textSec, marginTop: 3 }}>
                    Model: {liveData.model}
                  </div>
                </div>

                {/* Status */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: metaBg(sc),
                    border: `1px solid ${metaBd(sc)}`,
                    borderRadius: 20,
                    padding: "5px 12px",
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: sc,
                      boxShadow: `0 0 6px ${sc}`,
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: sc }}>
                    {liveData.status}
                  </span>
                </div>

                {/* Metrics */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {(
                    [
                      {
                        label: "Pressure",
                        value: `${liveData.current_pressure} bar`,
                        icon: "⬆",
                        color: "#3b82f6",
                      },
                      {
                        label: "Temperature",
                        value: `${liveData.current_temp}°C`,
                        icon: "🌡",
                        color: "#f97316",
                      },
                      {
                        label: "Max Op. Hours",
                        value: `${liveData.max_operating_hours} hrs`,
                        icon: "⏱",
                        color: "#8b5cf6",
                      },
                      {
                        label: "Daily Avg Hours",
                        value: `${liveData.average_daily_hours} hrs/day`,
                        icon: "📊",
                        color: "#10b981",
                      },
                    ] as const
                  ).map((m) => (
                    <div
                      key={m.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: metaBg(m.color),
                        border: `1px solid ${metaBd(m.color)}`,
                        borderRadius: 10,
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          background: metaBg(m.color),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                        }}
                      >
                        {m.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: textSec,
                            letterSpacing: 1,
                            textTransform: "uppercase",
                          }}
                        >
                          {m.label}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: textPri,
                            marginTop: 2,
                          }}
                        >
                          {m.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Health bar */}
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: textSec,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      System Health
                    </span>
                    <span
                      style={{ fontSize: 13, fontWeight: 800, color: textPri }}
                    >
                      {liveData.health}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 7,
                      background: trackBg,
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: showDetails ? `${liveData.health}%` : "0%",
                        height: "100%",
                        borderRadius: 99,
                        background: `linear-gradient(90deg, ${hc}, ${hc}aa)`,
                        boxShadow: `0 0 8px ${hc}80`,
                        transition: "width 1.1s cubic-bezier(0.4,0,0.2,1) 0.4s",
                      }}
                    />
                  </div>
                </div>

                {/* Serial */}
                <div
                  style={{
                    marginTop: 14,
                    padding: "10px 14px",
                    background: metaBg("#3b82f6"),
                    border: `1px dashed ${borderC}`,
                    borderRadius: 9,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: textSec,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 3,
                    }}
                  >
                    Serial Number
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#3b82f6",
                      fontFamily: "monospace",
                      letterSpacing: 2,
                    }}
                  >
                    {liveData.serial_number}
                  </div>
                </div>

                {/* Refresh button */}
                <button
                  onClick={fetchLive}
                  style={{
                    marginTop: 14,
                    width: "100%",
                    padding: "9px 0",
                    background: "transparent",
                    border: `1px solid ${borderC}`,
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    color: textSec,
                    cursor: "pointer",
                    letterSpacing: 1,
                  }}
                >
                  ↻ REFRESH DATA
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ca_spin    { to { transform: rotate(360deg); } }
        @keyframes ca_pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}
