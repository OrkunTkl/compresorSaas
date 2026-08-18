"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
} from "recharts";

declare global {
  interface Window {
    THREE: any;
    anime: any;
  }
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface ChartData {
  name: string;
  value: number;
  color: string;
}
interface TrendPoint {
  day: string;
  Completed: number;
  Overdue: number;
  Scheduled: number;
}

// ── Script loader ──────────────────────────────────────────────────────────────
const scriptCache: Record<string, Promise<void>> = {};
const loadScript = (src: string): Promise<void> => {
  if (scriptCache[src]) return scriptCache[src];
  scriptCache[src] = new Promise<void>((res, rej) => {
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
  return scriptCache[src];
};

// ── Zoom helper ────────────────────────────────────────────────────────────────
function addZoom(cv: HTMLCanvasElement, camera: any) {
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    camera.position.z = Math.max(3, Math.min(20, camera.position.z * delta));
  };
  // Pinch zoom
  let lastPinch = 0;
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 2) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (lastPinch) {
      const delta = lastPinch / dist;
      camera.position.z = Math.max(3, Math.min(20, camera.position.z * delta));
    }
    lastPinch = dist;
  };
  const onTouchEnd = () => {
    lastPinch = 0;
  };
  cv.addEventListener("wheel", onWheel, { passive: false });
  cv.addEventListener("touchmove", onTouchMove, { passive: true });
  cv.addEventListener("touchend", onTouchEnd);
  return () => {
    cv.removeEventListener("wheel", onWheel);
    cv.removeEventListener("touchmove", onTouchMove);
    cv.removeEventListener("touchend", onTouchEnd);
  };
}

// ── Shared 3D Modal Shell ──────────────────────────────────────────────────────
function Modal3D({
  cardBg,
  borderC,
  textSec,
  title,
  onClose,
  children,
}: {
  cardBg: string;
  borderC: string;
  textSec: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "90vw",
          maxWidth: 900,
          height: "78vh",
          background: cardBg,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${borderC}`,
          boxShadow:
            "0 0 80px rgba(59,130,246,0.16), 0 40px 80px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 52,
            flexShrink: 0,
            borderBottom: `1px solid ${borderC}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            background: cardBg,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#3b82f6",
                boxShadow: "0 0 8px #3b82f6",
                animation: "m3d_pulse 1.5s infinite",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                color: textSec,
                textTransform: "uppercase",
              }}
            >
              3D Chart Viewer
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6" }}>
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
              borderRadius: 7,
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, position: "relative" }}>{children}</div>
      </div>
      <style>{`
        @keyframes m3d_spin { to { transform: rotate(360deg); } }
        @keyframes m3d_pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}

function M3DLoader({ borderC, textSec }: { borderC: string; textSec: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          border: `3px solid ${borderC}`,
          borderTopColor: "#3b82f6",
          borderRadius: "50%",
          animation: "m3d_spin 0.9s linear infinite",
        }}
      />
      <span style={{ fontSize: 11, letterSpacing: 2, color: textSec }}>
        LOADING 3D…
      </span>
    </div>
  );
}

function M3DHint({ textSec }: { textSec: string }) {
  return (
    <span
      style={{
        position: "absolute",
        bottom: 14,
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
  );
}

// ── Bar 3D Modal ───────────────────────────────────────────────────────────────
function Bar3DModal({
  data,
  title,
  onClose,
  isDark,
}: {
  data: ChartData[];
  title: string;
  onClose: () => void;
  isDark: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<any>(null);
  const drag = useRef({ active: false, x: 0, y: 0 });
  const autoRot = useRef(true);
  const rafRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);

  const cardBg = isDark ? "#070e1e" : "#ffffff";
  const borderC = isDark ? "#1d3a5c" : "#d0dcf0";
  const textSec = isDark ? "#5a7aa0" : "#6b7a99";
  const maxVal = Math.max(...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
      );
      // Extra guard: wait for THREE to actually be on window
      let tries = 0;
      while (!window.THREE && tries++ < 20)
        await new Promise((r) => setTimeout(r, 100));
      if (disposed || !mountRef.current || !window.THREE) return;

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
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        el.clientWidth / el.clientHeight,
        0.1,
        100,
      );
      // Lower camera so bars start from bottom-center of view
      camera.position.set(0, 2, 12);
      camera.lookAt(0, 1, 0);

      scene.add(new THREE.AmbientLight(0x334466, 1.4));
      const key = new THREE.DirectionalLight(0x88aaff, 2.2);
      key.position.set(5, 10, 8);
      key.castShadow = true;
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xff8844, 0.6);
      fill.position.set(-5, 3, -3);
      scene.add(fill);

      const group = new THREE.Group();
      groupRef.current = group;
      scene.add(group);

      const spacing = 2.2;
      const startX = -((data.length - 1) * spacing) / 2;

      data.forEach((d, i) => {
        const targetH = (d.value / maxVal) * 4 + 0.3;
        const hex = parseInt(d.color.replace("#", ""), 16);
        const barMat = new THREE.MeshStandardMaterial({
          color: hex,
          emissive: hex,
          emissiveIntensity: 0.25,
          metalness: 0.7,
          roughness: 0.2,
        });
        const capMat = new THREE.MeshStandardMaterial({
          color: hex,
          emissive: hex,
          emissiveIntensity: 0.8,
          metalness: 0.3,
          roughness: 0.1,
        });

        const bg2 = new THREE.Group();
        bg2.position.set(startX + i * spacing, 0, 0);

        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1, 0.9), barMat);
        bar.castShadow = true;
        bar.scale.y = 0.01;
        bg2.add(bar);

        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(0.92, 0.08, 0.92),
          capMat,
        );
        cap.position.y = 0.5;
        bg2.add(cap);

        const pl = new THREE.PointLight(hex, 0.6, 3);
        pl.position.y = targetH + 0.5;
        bg2.add(pl);

        group.add(bg2);

        const ao = { h: 0.01 };
        anime({
          targets: ao,
          h: targetH,
          duration: 1200,
          delay: 200 + i * 120,
          easing: "easeOutElastic(1, 0.5)",
          update: () => {
            bar.scale.y = ao.h;
            bar.position.y = ao.h / 2;
            cap.position.y = ao.h + 0.04;
            pl.position.y = ao.h + 0.5;
          },
        });
      });

      // Particles
      const pArr = new Float32Array(100 * 3).map(
        () => (Math.random() - 0.5) * 14,
      );
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
      const pts = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0x3b82f6,
          size: 0.04,
          transparent: true,
          opacity: 0.35,
        }),
      );
      scene.add(pts);

      setLoaded(true);

      group.scale.setScalar(0.01);
      group.position.y = -3;
      const ao0 = { s: 0.01, y: -3 };
      anime({
        targets: ao0,
        s: 1,
        y: 0,
        duration: 1000,
        easing: "easeOutElastic(1, 0.7)",
        update: () => {
          group.scale.setScalar(ao0.s);
          group.position.y = ao0.y;
        },
      });

      const cv = renderer.domElement;
      const mouseDown = (e: MouseEvent) => {
        drag.current = { active: true, x: e.clientX, y: e.clientY };
        autoRot.current = false;
      };
      const mouseMove = (e: MouseEvent) => {
        if (!drag.current.active) return;
        group.rotation.y += (e.clientX - drag.current.x) * 0.01;
        group.rotation.x = Math.max(
          -0.6,
          Math.min(
            0.6,
            group.rotation.x + (e.clientY - drag.current.y) * 0.005,
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
        if (!drag.current.active || e.touches.length !== 1) return;
        group.rotation.y += (e.touches[0].clientX - drag.current.x) * 0.01;
        group.rotation.x = Math.max(
          -0.6,
          Math.min(
            0.6,
            group.rotation.x + (e.touches[0].clientY - drag.current.y) * 0.005,
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
      window.addEventListener("touchend", touchEnd);
      window.addEventListener("resize", onResize);
      const removeZoom = addZoom(cv, camera);

      let t = 0;
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        t += 0.01;
        if (autoRot.current && !drag.current.active) group.rotation.y += 0.005;
        pts.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        cv.removeEventListener("mousedown", mouseDown);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
        cv.removeEventListener("touchstart", touchStart);
        cv.removeEventListener("touchmove", touchMove);
        window.removeEventListener("touchend", touchEnd);
        window.removeEventListener("resize", onResize);
        removeZoom();
        renderer.dispose();
        if (mountRef.current?.contains(cv)) mountRef.current.removeChild(cv);
      };
    })().catch(console.error);

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <Modal3D
      cardBg={cardBg}
      borderC={borderC}
      textSec={textSec}
      title={title}
      onClose={onClose}
    >
      {/* Y-axis */}
      <div
        style={{
          position: "absolute",
          left: 12,
          top: "18%",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "55%",
          pointerEvents: "none",
        }}
      >
        {[
          maxVal,
          Math.round(maxVal * 0.75),
          Math.round(maxVal * 0.5),
          Math.round(maxVal * 0.25),
          0,
        ].map((v) => (
          <div key={v} style={{ fontSize: 9, color: textSec, fontWeight: 600 }}>
            {v}
          </div>
        ))}
      </div>
      {/* Stats */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          width: 155,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: textSec,
            letterSpacing: 1,
            marginBottom: 2,
          }}
        >
          BREAKDOWN
        </div>
        {data.map((d) => (
          <div
            key={d.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: isDark ? "#0d1929bb" : "#f0f4ffdd",
              borderRadius: 7,
              padding: "5px 8px",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: d.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: isDark ? "#c9d1e0" : "#4a5568",
                flex: 1,
              }}
            >
              {d.name}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>
              {d.value}
            </span>
          </div>
        ))}
        <div
          style={{
            marginTop: 2,
            padding: "6px 8px",
            background: isDark ? "#0d1929bb" : "#f0f4ffdd",
            borderRadius: 7,
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ fontSize: 9, color: textSec, marginBottom: 2 }}>
            TOP ISSUE
          </div>
          <div
            style={{ fontSize: 12, fontWeight: 700, color: sorted[0].color }}
          >
            {sorted[0].name}
          </div>
          <div style={{ fontSize: 10, color: textSec }}>
            {Math.round((sorted[0].value / total) * 100)}% of total
          </div>
        </div>
      </div>
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", cursor: "grab" }}
      >
        {!loaded && <M3DLoader borderC={borderC} textSec={textSec} />}
        {loaded && <M3DHint textSec={textSec} />}
      </div>
    </Modal3D>
  );
}

// ── Pie 3D Modal ───────────────────────────────────────────────────────────────
function Pie3DModal({
  data,
  title,
  onClose,
  isDark,
}: {
  data: ChartData[];
  title: string;
  onClose: () => void;
  isDark: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<any>(null);
  const drag = useRef({ active: false, x: 0, y: 0 });
  const autoRot = useRef(true);
  const rafRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);

  const cardBg = isDark ? "#070e1e" : "#ffffff";
  const borderC = isDark ? "#1d3a5c" : "#d0dcf0";
  const textSec = isDark ? "#5a7aa0" : "#6b7a99";
  const total = data.reduce((s, d) => s + d.value, 0);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
      );
      let tries = 0;
      while (!window.THREE && tries++ < 20)
        await new Promise((r) => setTimeout(r, 100));
      if (disposed || !mountRef.current || !window.THREE) return;

      const THREE = window.THREE;
      const anime = window.anime;
      const el = mountRef.current;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        el.clientWidth / el.clientHeight,
        0.1,
        100,
      );
      camera.position.set(0, 2, 12);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0x334466, 1.0));
      const key = new THREE.DirectionalLight(0x88aaff, 2.0);
      key.position.set(6, 10, 6);
      key.castShadow = true;
      scene.add(key);
      const dl2 = new THREE.DirectionalLight(0xff8844, 0.5);
      dl2.position.set(-5, 2, -4);
      scene.add(dl2);

      const group = new THREE.Group();
      groupRef.current = group;
      scene.add(group);

      const outerR = 2.8,
        innerR = 1.4,
        height = 0.7;
      let angle = 0;
      const segments: { mesh: any; mat: any }[] = [];

      data.forEach((d) => {
        const slice = (d.value / total) * Math.PI * 2;
        const hex = parseInt(d.color.replace("#", ""), 16);
        const shape = new THREE.Shape();
        const N = 40,
          sA = angle,
          eA = angle + slice;
        for (let j = 0; j <= N; j++) {
          const a = sA + (j / N) * (eA - sA);
          j === 0
            ? shape.moveTo(Math.cos(a) * outerR, Math.sin(a) * outerR)
            : shape.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR);
        }
        for (let j = N; j >= 0; j--) {
          const a = sA + (j / N) * (eA - sA);
          shape.lineTo(Math.cos(a) * innerR, Math.sin(a) * innerR);
        }
        shape.closePath();

        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: height,
          bevelEnabled: false,
        });
        geo.rotateX(-Math.PI / 2);
        const mat = new THREE.MeshStandardMaterial({
          color: hex,
          emissive: hex,
          emissiveIntensity: 0.2,
          metalness: 0.7,
          roughness: 0.15,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.scale.setScalar(0.01);

        const mid = sA + slice / 2;
        const pl = new THREE.PointLight(hex, 0.5, 4);
        pl.position.set(
          (Math.cos(mid) * (outerR + innerR)) / 2,
          0.5,
          (Math.sin(mid) * (outerR + innerR)) / 2,
        );
        group.add(pl);
        group.add(mesh);
        segments.push({ mesh, mat });
        angle += slice;
      });

      const pArr = new Float32Array(100 * 3).map(
        () => (Math.random() - 0.5) * 12,
      );
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
      const pts = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0x3b82f6,
          size: 0.04,
          transparent: true,
          opacity: 0.35,
        }),
      );
      scene.add(pts);

      setLoaded(true);

      group.scale.setScalar(0.01);
      const ao0 = { s: 0.01, ry: 0 };
      anime({
        targets: ao0,
        s: 1,
        ry: Math.PI * 2,
        duration: 1200,
        easing: "easeOutElastic(1, 0.6)",
        update: () => {
          group.scale.setScalar(ao0.s);
          group.rotation.y = ao0.ry;
        },
      });
      segments.forEach(({ mesh }, i) => {
        const ao2 = { s: 0.01 };
        anime({
          targets: ao2,
          s: 1,
          duration: 900,
          delay: 300 + i * 100,
          easing: "easeOutBack(1.5)",
          update: () => {
            mesh.scale.setScalar(ao2.s);
          },
        });
      });

      const cv = renderer.domElement;
      const mouseDown = (e: MouseEvent) => {
        drag.current = { active: true, x: e.clientX, y: e.clientY };
        autoRot.current = false;
      };
      const mouseMove = (e: MouseEvent) => {
        if (!drag.current.active) return;
        group.rotation.y += (e.clientX - drag.current.x) * 0.01;
        group.rotation.x = Math.max(
          -0.8,
          Math.min(
            0.8,
            group.rotation.x + (e.clientY - drag.current.y) * 0.006,
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
        if (!drag.current.active || e.touches.length !== 1) return;
        group.rotation.y += (e.touches[0].clientX - drag.current.x) * 0.01;
        group.rotation.x = Math.max(
          -0.8,
          Math.min(
            0.8,
            group.rotation.x + (e.touches[0].clientY - drag.current.y) * 0.006,
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
      window.addEventListener("touchend", touchEnd);
      window.addEventListener("resize", onResize);
      const removeZoom = addZoom(cv, camera);

      let t = 0;
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        t += 0.01;
        if (autoRot.current && !drag.current.active) group.rotation.y += 0.006;
        pts.rotation.y += 0.001;
        segments.forEach(({ mat }, i) => {
          mat.emissiveIntensity = 0.15 + Math.sin(t * 2 + i) * 0.1;
        });
        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        cv.removeEventListener("mousedown", mouseDown);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
        cv.removeEventListener("touchstart", touchStart);
        cv.removeEventListener("touchmove", touchMove);
        window.removeEventListener("touchend", touchEnd);
        window.removeEventListener("resize", onResize);
        removeZoom();
        renderer.dispose();
        if (mountRef.current?.contains(cv)) mountRef.current.removeChild(cv);
      };
    })().catch(console.error);

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <Modal3D
      cardBg={cardBg}
      borderC={borderC}
      textSec={textSec}
      title={title}
      onClose={onClose}
    >
      {/* Distribution */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          width: 150,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: textSec,
            letterSpacing: 1,
            marginBottom: 2,
          }}
        >
          DISTRIBUTION
        </div>
        {data.map((d) => {
          const pct = Math.round((d.value / total) * 100);
          return (
            <div
              key={d.name}
              style={{
                background: isDark ? "#0d1929bb" : "#f0f4ffdd",
                borderRadius: 8,
                padding: "6px 10px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: d.color,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDark ? "#c9d1e0" : "#2d3748",
                  }}
                >
                  {d.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: d.color,
                    marginLeft: "auto",
                  }}
                >
                  {pct}%
                </span>
              </div>
              <div
                style={{
                  height: 4,
                  background: isDark ? "#1e2130" : "#e2e8f0",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: d.color,
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", cursor: "grab" }}
      >
        {!loaded && <M3DLoader borderC={borderC} textSec={textSec} />}
        {loaded && <M3DHint textSec={textSec} />}
      </div>
    </Modal3D>
  );
}

// ── Line 3D Modal ──────────────────────────────────────────────────────────────
function Line3DModal({
  data,
  title,
  onClose,
  isDark,
}: {
  data: TrendPoint[];
  title: string;
  onClose: () => void;
  isDark: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<any>(null);
  const drag = useRef({ active: false, x: 0, y: 0 });
  const autoRot = useRef(true);
  const rafRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);

  const cardBg = isDark ? "#070e1e" : "#ffffff";
  const borderC = isDark ? "#1d3a5c" : "#d0dcf0";
  const textSec = isDark ? "#5a7aa0" : "#6b7a99";

  const totalCompleted = data.reduce((s, d) => s + d.Completed, 0);
  const totalOverdue = data.reduce((s, d) => s + d.Overdue, 0);
  const totalScheduled = data.reduce((s, d) => s + d.Scheduled, 0);
  const trend = data[data.length - 1].Completed - data[0].Completed;

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
      );
      let tries = 0;
      while (!window.THREE && tries++ < 20)
        await new Promise((r) => setTimeout(r, 100));
      if (disposed || !mountRef.current || !window.THREE) return;

      const THREE = window.THREE;
      const anime = window.anime;
      const el = mountRef.current;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        el.clientWidth / el.clientHeight,
        0.1,
        100,
      );
      camera.position.set(0, 2, 13);
      camera.lookAt(0, 1, 0);

      scene.add(new THREE.AmbientLight(0x334466, 1.2));
      const key = new THREE.DirectionalLight(0x88aaff, 2.0);
      key.position.set(5, 10, 8);
      key.castShadow = true;
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xff8844, 0.5);
      fill.position.set(-5, 3, -4);
      scene.add(fill);

      const group = new THREE.Group();
      groupRef.current = group;
      scene.add(group);

      const cfgs = [
        { key: "Completed" as keyof TrendPoint, color: 0x10b981 },
        { key: "Overdue" as keyof TrendPoint, color: 0xef4444 },
        { key: "Scheduled" as keyof TrendPoint, color: 0x3b82f6 },
      ];
      const maxV = Math.max(
        ...data.flatMap((d) => [d.Completed, d.Overdue, d.Scheduled]),
      );
      const sX = 10 / (data.length - 1),
        sY = 4 / maxV,
        offX = -5;
      const lineObjs: { tube: any; mat: any }[] = [];

      cfgs.forEach(({ key, color }, li) => {
        const pts3 = data.map(
          (d, i) =>
            new THREE.Vector3(
              offX + i * sX,
              (d[key] as number) * sY,
              li * 1.2 - 1.2,
            ),
        );
        const curve = new THREE.CatmullRomCurve3(pts3);
        const mat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.6,
          metalness: 0.5,
          roughness: 0.2,
        });
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 60, 0.06, 8, false),
          mat,
        );
        tube.castShadow = true;
        tube.scale.x = 0.01;
        tube.position.x = offX;
        group.add(tube);

        pts3.forEach((pt) => {
          const sp = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 16, 16),
            new THREE.MeshStandardMaterial({
              color,
              emissive: color,
              emissiveIntensity: 1,
              metalness: 0.3,
              roughness: 0.1,
            }),
          );
          sp.position.copy(pt);
          sp.scale.setScalar(0.01);
          group.add(sp);
          const ao2 = { s: 0.01 };
          anime({
            targets: ao2,
            s: 1,
            duration: 600,
            delay: 800 + li * 150,
            easing: "easeOutBack(2)",
            update: () => {
              sp.scale.setScalar(ao2.s);
            },
          });
        });

        lineObjs.push({ tube, mat });
        const ao3 = { x: 0.01 };
        anime({
          targets: ao3,
          x: 1,
          duration: 1200,
          delay: 200 + li * 200,
          easing: "easeInOutQuart",
          update: () => {
            tube.scale.x = ao3.x;
            tube.position.x = offX * (1 - ao3.x);
          },
        });
      });

      const pArr = new Float32Array(80 * 3).map(
        () => (Math.random() - 0.5) * 12,
      );
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
      const pts = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          color: 0x3b82f6,
          size: 0.04,
          transparent: true,
          opacity: 0.35,
        }),
      );
      scene.add(pts);

      setLoaded(true);

      const ao = { s: 0.01, y: -4 };
      group.scale.setScalar(0.01);
      group.position.y = -4;
      anime({
        targets: ao,
        s: 1,
        y: 0,
        duration: 1000,
        easing: "easeOutElastic(1, 0.6)",
        update: () => {
          group.scale.setScalar(ao.s);
          group.position.y = ao.y;
        },
      });

      const cv = renderer.domElement;
      const mouseDown = (e: MouseEvent) => {
        drag.current = { active: true, x: e.clientX, y: e.clientY };
        autoRot.current = false;
      };
      const mouseMove = (e: MouseEvent) => {
        if (!drag.current.active) return;
        group.rotation.y += (e.clientX - drag.current.x) * 0.01;
        group.rotation.x = Math.max(
          -0.7,
          Math.min(
            0.7,
            group.rotation.x + (e.clientY - drag.current.y) * 0.006,
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
        if (!drag.current.active || e.touches.length !== 1) return;
        group.rotation.y += (e.touches[0].clientX - drag.current.x) * 0.01;
        group.rotation.x = Math.max(
          -0.7,
          Math.min(
            0.7,
            group.rotation.x + (e.touches[0].clientY - drag.current.y) * 0.006,
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
      window.addEventListener("touchend", touchEnd);
      window.addEventListener("resize", onResize);
      const removeZoom = addZoom(cv, camera);

      let t = 0;
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        t += 0.01;
        if (autoRot.current && !drag.current.active) group.rotation.y += 0.004;
        pts.rotation.y += 0.001;
        lineObjs.forEach(({ mat }, i) => {
          mat.emissiveIntensity = 0.5 + Math.sin(t * 2 + i * 1.5) * 0.3;
        });
        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        cv.removeEventListener("mousedown", mouseDown);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
        cv.removeEventListener("touchstart", touchStart);
        cv.removeEventListener("touchmove", touchMove);
        window.removeEventListener("touchend", touchEnd);
        window.removeEventListener("resize", onResize);
        removeZoom();
        renderer.dispose();
        if (mountRef.current?.contains(cv)) mountRef.current.removeChild(cv);
      };
    })().catch(console.error);

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <Modal3D
      cardBg={cardBg}
      borderC={borderC}
      textSec={textSec}
      title={title}
      onClose={onClose}
    >
      {/* Series stats */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          width: 158,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: textSec,
            letterSpacing: 1,
            marginBottom: 2,
          }}
        >
          SERIES
        </div>
        {[
          { label: "Completed", color: "#10b981", value: totalCompleted },
          { label: "Overdue", color: "#ef4444", value: totalOverdue },
          { label: "Scheduled", color: "#3b82f6", value: totalScheduled },
        ].map((l) => (
          <div
            key={l.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: isDark ? "#0d1929bb" : "#f0f4ffdd",
              borderRadius: 7,
              padding: "5px 8px",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                width: 14,
                height: 3,
                background: l.color,
                borderRadius: 99,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: isDark ? "#c9d1e0" : "#4a5568",
                flex: 1,
              }}
            >
              {l.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: l.color }}>
              {l.value}
            </span>
          </div>
        ))}
        <div
          style={{
            marginTop: 2,
            padding: "7px 8px",
            background: isDark ? "#0d1929bb" : "#f0f4ffdd",
            borderRadius: 7,
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ fontSize: 9, color: textSec, marginBottom: 2 }}>
            COMPLETION TREND
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: trend >= 0 ? "#10b981" : "#ef4444",
            }}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}
          </div>
          <div style={{ fontSize: 10, color: textSec }}>
            tasks vs period start
          </div>
        </div>
      </div>
      {/* X-axis labels */}
      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: "6%",
          right: 175,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        {data.map((d) => (
          <div
            key={d.day}
            style={{ fontSize: 9, color: textSec, whiteSpace: "nowrap" }}
          >
            {d.day}
          </div>
        ))}
      </div>
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", cursor: "grab" }}
      >
        {!loaded && <M3DLoader borderC={borderC} textSec={textSec} />}
        {loaded && <M3DHint textSec={textSec} />}
      </div>
    </Modal3D>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export interface DashboardGraphProps {
  isDark?: boolean;
  failureData: ChartData[];
  trendData: TrendPoint[];
  healthData: ChartData[];
  card: string;
  border: string;
  muted: string;
  text: string;
}

export default function DashboardGraph({
  isDark = true,
  failureData,
  trendData,
  healthData,
  card,
  border,
  muted,
  text,
}: DashboardGraphProps) {
  const [activeModal, setActiveModal] = useState<null | {
    type: "bar" | "pie" | "line";
    title: string;
  }>(null);
  const close = useCallback(() => setActiveModal(null), []);

  const tooltipStyle = {
    background: card,
    border: `1px solid ${border}`,
    borderRadius: 8,
    fontSize: 12,
  };

  return (
    <>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        {/* ── Failure Analysis ── */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() =>
              setActiveModal({ type: "bar", title: "Failure Analysis" })
            }
            title="Click to open 3D view"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
              fontSize: 10,
              fontWeight: 700,
              color: "#f97316",
              background: "#f9731615",
              padding: "3px 8px",
              borderRadius: 20,
              cursor: "pointer",
              letterSpacing: 1,
            }}
          >
            3D VIEW ↗
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={failureData}
              layout="vertical"
              margin={{ left: 0, right: 10 }}
              onClick={() =>
                setActiveModal({ type: "bar", title: "Failure Analysis" })
              }
              style={{ cursor: "pointer" }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: muted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: text }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {failureData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Maintenance Trend ── */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() =>
              setActiveModal({ type: "line", title: "Maintenance Trend" })
            }
            title="Click to open 3D view"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
              fontSize: 10,
              fontWeight: 700,
              color: "#3b82f6",
              background: "#3b82f615",
              padding: "3px 8px",
              borderRadius: 20,
              cursor: "pointer",
              letterSpacing: 1,
            }}
          >
            3D VIEW ↗
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={trendData}
              style={{ cursor: "pointer", outline: "none" }}
              onClick={() =>
                setActiveModal({ type: "line", title: "Maintenance Trend" })
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#1e2130" : "#f0f0f0"}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: muted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: muted }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="Completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Overdue"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Scheduled"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── System Health ── */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() =>
              setActiveModal({ type: "pie", title: "System Health" })
            }
            title="Click to open 3D view"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
              fontSize: 10,
              fontWeight: 700,
              color: "#10b981",
              background: "#10b98115",
              padding: "3px 8px",
              borderRadius: 20,
              cursor: "pointer",
              letterSpacing: 1,
            }}
          >
            3D VIEW ↗
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart
              onClick={() =>
                setActiveModal({ type: "pie", title: "System Health" })
              }
              style={{ cursor: "pointer" }}
            >
              <Pie
                data={healthData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={58}
                dataKey="value"
                paddingAngle={3}
              >
                {healthData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {healthData.map((d) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: muted,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: d.color,
                  }}
                />
                {d.name}{" "}
                {Math.round(
                  (d.value / healthData.reduce((s, x) => s + x.value, 0)) * 100,
                )}
                %
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3D Modals ── */}
      {activeModal?.type === "bar" && (
        <Bar3DModal
          data={failureData}
          title={activeModal.title}
          onClose={close}
          isDark={isDark}
        />
      )}
      {activeModal?.type === "pie" && (
        <Pie3DModal
          data={healthData}
          title={activeModal.title}
          onClose={close}
          isDark={isDark}
        />
      )}
      {activeModal?.type === "line" && (
        <Line3DModal
          data={trendData}
          title={activeModal.title}
          onClose={close}
          isDark={isDark}
        />
      )}
    </>
  );
}
