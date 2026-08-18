"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Yönlendirme için eklendi
import { motion, AnimatePresence } from "framer-motion";

const Scene = () => (
  <svg
    viewBox="0 0 500 620"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a2236" />
        <stop offset="100%" stopColor="#0d1220" />
      </linearGradient>
      <linearGradient id="compBodyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2d3f5e" />
        <stop offset="100%" stopColor="#1a2742" />
      </linearGradient>
      <linearGradient id="compTopGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b4f72" />
        <stop offset="100%" stopColor="#243351" />
      </linearGradient>
      <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e2d4a" />
      </linearGradient>
      <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="100%" stopColor="#b8855c" />
      </linearGradient>
      <linearGradient id="uniformGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e3a6e" />
        <stop offset="100%" stopColor="#162d56" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow
          dx="0"
          dy="10"
          stdDeviation="14"
          floodColor="#000"
          floodOpacity="0.8"
        />
      </filter>
      <filter id="compShadow">
        <feDropShadow
          dx="6"
          dy="12"
          stdDeviation="16"
          floodColor="#000"
          floodOpacity="0.6"
        />
      </filter>
      <filter id="glow3">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* ── ARKA PLAN ── */}
    <rect width="500" height="620" fill="#080d16" />
    <rect x="0" y="0" width="500" height="490" fill="#0c1220" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={0} y={i * 122} width={500} height={1} fill="#131d30" />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={i * 125} y={0} width={1} height={490} fill="#131d30" />
    ))}

    {/* Zemin */}
    <rect x="0" y="488" width="500" height="132" fill="url(#floorGrad)" />
    <rect x="0" y="488" width="500" height="2" fill="#2d3f5e" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <line
        key={i}
        x1={i * 70 - 20}
        y1={490}
        x2={i * 60 + 50}
        y2={620}
        stroke="#131d30"
        strokeWidth="1"
      />
    ))}
    {[510, 540, 570, 600].map((y) => (
      <line
        key={y}
        x1={0}
        y1={y}
        x2={500}
        y2={y}
        stroke="#131d30"
        strokeWidth="1"
      />
    ))}

    {/* Tavan lambası */}
    <rect x="160" y="0" width="180" height="6" rx="2" fill="#1e2d4a" />
    <motion.rect
      x="165"
      y="5"
      width="170"
      height="3"
      rx="1.5"
      fill="#fef3c7"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ repeat: Infinity, duration: 3.5 }}
    />

    {/* Arka raf */}
    <rect
      x="12"
      y="160"
      width="60"
      height="330"
      rx="4"
      fill="#0f1520"
      stroke="#1a2840"
      strokeWidth="1"
    />
    {[200, 260, 320, 380].map((y) => (
      <rect key={y} x={12} y={y} width={60} height={2} fill="#1a2840" />
    ))}
    {[170, 210, 270, 330].map((y, i) => (
      <g key={y}>
        <rect
          x={18}
          y={y}
          width={22}
          height={28}
          rx={3}
          fill="#1a2840"
          stroke="#243351"
          strokeWidth={1}
        />
        <motion.circle
          cx={28}
          cy={y + 8}
          r={3}
          fill={["#22c55e", "#6366f1", "#f59e0b", "#22c55e"][i]}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
        />
        <rect
          x={43}
          y={y + 4}
          width={22}
          height={20}
          rx={3}
          fill="#1a2840"
          stroke="#243351"
          strokeWidth={1}
        />
      </g>
    ))}

    {/* ══════════ KOMPRESÖR ══════════ */}
    <ellipse cx="185" cy="492" rx="130" ry="12" fill="#000" opacity="0.5" />

    {/* Ayaklar */}
    <rect
      x="72"
      y="460"
      width="226"
      height="30"
      rx="4"
      fill="#0d1220"
      stroke="#1a2840"
      strokeWidth="1"
    />
    {[90, 138, 196, 254, 282].map((x) => (
      <rect
        key={x}
        x={x}
        y={456}
        width={16}
        height={36}
        rx={3}
        fill="#0a0f1a"
        stroke="#1e2d4a"
        strokeWidth={1}
      />
    ))}

    {/* Ana gövde */}
    <rect
      x="72"
      y="270"
      width="226"
      height="195"
      rx="10"
      fill="url(#compBodyGrad)"
      stroke="#3b4f72"
      strokeWidth="1.5"
      filter="url(#compShadow)"
    />
    <rect x="72" y="330" width="226" height="2" fill="#1a2742" />
    <rect x="72" y="390" width="226" height="2" fill="#1a2742" />
    <rect x="148" y="270" width="2" height="195" fill="#1a2742" opacity="0.6" />
    <rect x="230" y="270" width="2" height="195" fill="#1a2742" opacity="0.6" />

    {/* Motor bloğu */}
    <rect
      x="78"
      y="228"
      width="214"
      height="48"
      rx="8"
      fill="url(#compTopGrad)"
      stroke="#4a6080"
      strokeWidth="1.5"
    />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
      <rect
        key={i}
        x={82 + i * 21}
        y={232}
        width={15}
        height={40}
        rx={2}
        fill="#1e2d4a"
        stroke="#2d4066"
        strokeWidth={0.5}
      />
    ))}
    <ellipse
      cx="185"
      cy="228"
      rx="107"
      ry="11"
      fill="#3b4f72"
      stroke="#4a6a90"
      strokeWidth="1.5"
    />

    {/* Egzoz borusu */}
    <rect
      x="290"
      y="235"
      width="20"
      height="90"
      rx="10"
      fill="#1a2332"
      stroke="#2d4066"
      strokeWidth="1.5"
    />
    <ellipse
      cx="300"
      cy="235"
      rx="10"
      ry="6"
      fill="#243351"
      stroke="#3b5070"
      strokeWidth="1"
    />
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.ellipse
        key={i}
        cx={300 + (i - 2) * 5}
        cy={228}
        rx={4 + i * 2}
        ry={4 + i * 2}
        fill="white"
        opacity={0}
        animate={{
          opacity: [0, 0.12, 0],
          cy: [228, 190 - i * 12],
          rx: [4 + i * 2, 10 + i * 4, 16 + i * 5],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          delay: i * 0.55,
          ease: "easeOut",
        }}
      />
    ))}

    {/* Sol hava filtresi */}
    <rect
      x="72"
      y="292"
      width="30"
      height="56"
      rx="5"
      fill="#111827"
      stroke="#2d4066"
      strokeWidth="1.5"
    />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <rect
        key={i}
        x={76}
        y={296 + i * 6}
        width={22}
        height={3}
        rx={1.5}
        fill="#1a2740"
      />
    ))}

    {/* Basınç tankı */}
    <ellipse
      cx="264"
      cy="300"
      rx="24"
      ry="11"
      fill="#1e2d4a"
      stroke="#3b4f72"
      strokeWidth="1.5"
    />
    <rect
      x="240"
      y="300"
      width="48"
      height="82"
      fill="#1e2d4a"
      stroke="#3b4f72"
      strokeWidth="1.5"
    />
    <ellipse
      cx="264"
      cy="382"
      rx="24"
      ry="11"
      fill="#182436"
      stroke="#3b4f72"
      strokeWidth="1.5"
    />
    <motion.ellipse
      cx="264"
      cy="341"
      rx="18"
      ry="6"
      fill="none"
      stroke="#6366f1"
      strokeWidth="1"
      animate={{ opacity: [0.1, 0.5, 0.1], rx: [18, 22, 18] }}
      transition={{ repeat: Infinity, duration: 2.5 }}
    />

    {/* Boru bağlantıları */}
    <rect
      x="100"
      y="398"
      width="148"
      height="10"
      rx="5"
      fill="#131d30"
      stroke="#2d3f5e"
      strokeWidth="1"
    />
    <rect
      x="112"
      y="388"
      width="10"
      height="20"
      rx="5"
      fill="#131d30"
      stroke="#2d3f5e"
      strokeWidth="1"
    />
    <rect
      x="228"
      y="388"
      width="10"
      height="20"
      rx="5"
      fill="#131d30"
      stroke="#2d3f5e"
      strokeWidth="1"
    />
    {[112, 160, 228].map((x) => (
      <circle
        key={x}
        cx={x + 5}
        cy={403}
        r={7}
        fill="#1e2d4a"
        stroke="#3b5070"
        strokeWidth={1.5}
      />
    ))}

    {/* Kontrol paneli */}
    <rect
      x="96"
      y="418"
      width="160"
      height="38"
      rx="6"
      fill="#0a0f1a"
      stroke="#2d3f5e"
      strokeWidth="1.5"
    />
    {[
      { x: 116, c: "#22c55e", l: "PWR" },
      { x: 148, c: "#f59e0b", l: "PRE" },
      { x: 180, c: "#6366f1", l: "RUN" },
      { x: 212, c: "#22c55e", l: "OIL" },
      { x: 244, c: "#ef4444", l: "TMP" },
    ].map((d) => (
      <g key={d.x}>
        <motion.circle
          cx={d.x}
          cy={431}
          r={6}
          fill={d.c}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 1.5 + d.x * 0.002,
            delay: d.x * 0.01,
          }}
        />
        <text
          x={d.x}
          y={447}
          textAnchor="middle"
          fontSize="5"
          fill="#475569"
          fontFamily="monospace"
        >
          {d.l}
        </text>
      </g>
    ))}

    {/* Analog gösterge */}
    <circle
      cx="185"
      cy="355"
      r="32"
      fill="#0a0f1a"
      stroke="#3b4f72"
      strokeWidth="2"
    />
    <circle
      cx="185"
      cy="355"
      r="26"
      fill="#060b14"
      stroke="#1e2d4a"
      strokeWidth="1"
    />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => {
      const a = ((-135 + t * 27) * Math.PI) / 180;
      return (
        <line
          key={t}
          x1={185 + Math.cos(a) * 21}
          y1={355 + Math.sin(a) * 21}
          x2={185 + Math.cos(a) * 25}
          y2={355 + Math.sin(a) * 25}
          stroke={t > 7 ? "#ef4444" : "#2d4066"}
          strokeWidth={t % 5 === 0 ? 2 : 1}
        />
      );
    })}
    <motion.line
      x1="185"
      y1="355"
      x2="185"
      y2="334"
      stroke="#f59e0b"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ transformOrigin: "185px 355px" }}
      animate={{ rotate: [-45, 20, -45] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    />
    <circle cx="185" cy="355" r="4" fill="#f59e0b" filter="url(#glow3)" />
    <text
      x="185"
      y="375"
      textAnchor="middle"
      fontSize="6.5"
      fill="#64748b"
      fontFamily="monospace"
    >
      BAR
    </text>

    {/* ══════════ TEKNİSYEN ══════════ */}
    <ellipse cx="390" cy="492" rx="65" ry="10" fill="#000" opacity="0.55" />

    {/* Bacaklar */}
    <rect x="353" y="400" width="30" height="92" rx="10" fill="#1e3a6e" />
    <rect x="353" y="445" width="30" height="47" rx="8" fill="#162d56" />
    <rect x="345" y="468" width="42" height="18" rx="6" fill="#111827" />
    <rect x="343" y="477" width="46" height="10" rx="5" fill="#0a0f1a" />
    <rect x="390" y="400" width="30" height="92" rx="10" fill="#1e3a6e" />
    <rect x="390" y="445" width="30" height="47" rx="8" fill="#162d56" />
    <rect x="382" y="468" width="42" height="18" rx="6" fill="#111827" />
    <rect x="380" y="477" width="46" height="10" rx="5" fill="#0a0f1a" />
    <rect
      x="356"
      y="422"
      width="24"
      height="5"
      rx="2.5"
      fill="#fbbf24"
      opacity="0.6"
    />
    <rect
      x="393"
      y="422"
      width="24"
      height="5"
      rx="2.5"
      fill="#fbbf24"
      opacity="0.6"
    />

    {/* Gövde/tulum */}
    <rect
      x="342"
      y="300"
      width="89"
      height="108"
      rx="14"
      fill="url(#uniformGrad)"
      filter="url(#shadow)"
    />
    <rect x="383" y="305" width="7" height="96" rx="3.5" fill="#132447" />
    {[308, 320, 332, 344, 356, 368, 378].map((y) => (
      <rect
        key={y}
        x={385}
        y={y}
        width={3}
        height={6}
        rx={1.5}
        fill="#1e3570"
      />
    ))}
    <rect
      x="350"
      y="325"
      width="28"
      height="24"
      rx="5"
      fill="#132447"
      stroke="#1e3570"
      strokeWidth="1"
    />
    <rect x="353" y="329" width="22" height="2" rx="1" fill="#1e3570" />
    <rect x="353" y="334" width="16" height="2" rx="1" fill="#1e3570" />
    <rect
      x="392"
      y="322"
      width="30"
      height="22"
      rx="4"
      fill="#0d1a30"
      stroke="#1e3570"
      strokeWidth="1"
    />
    <text
      x="407"
      y="336"
      textAnchor="middle"
      fontSize="6.5"
      fill="#6366f1"
      fontFamily="monospace"
      fontWeight="bold"
    >
      KSY
    </text>
    <rect
      x="342"
      y="365"
      width="89"
      height="7"
      rx="3.5"
      fill="#fbbf24"
      opacity="0.45"
    />
    <rect
      x="342"
      y="334"
      width="89"
      height="4"
      rx="2"
      fill="#fbbf24"
      opacity="0.25"
    />

    {/* Sol kol — kompresöre uzanıyor */}
    <motion.g
      style={{ transformOrigin: "342px 316px" }}
      animate={{ rotate: [-8, 4, -8] }}
      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
    >
      <rect x="304" y="308" width="40" height="22" rx="11" fill="#1e3a6e" />
      <rect x="280" y="318" width="28" height="18" rx="9" fill="#1e3a6e" />
      <ellipse cx="274" cy="327" rx="13" ry="10" fill="url(#skinGrad)" />
      <rect x="262" y="323" width="9" height="5" rx="2.5" fill="#c8956c" />
      <rect x="262" y="329" width="9" height="5" rx="2.5" fill="#c8956c" />
    </motion.g>
    <motion.circle
      cx="270"
      cy="326"
      r="6"
      fill="#6366f1"
      opacity={0}
      animate={{ opacity: [0, 0.3, 0], r: [6, 12, 6] }}
      transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
    />

    {/* Sağ kol — tableti tutuyor */}
    <rect x="425" y="308" width="36" height="22" rx="11" fill="#1e3a6e" />
    <motion.g
      style={{ transformOrigin: "425px 319px" }}
      animate={{ rotate: [-4, 4, -4] }}
      transition={{
        repeat: Infinity,
        duration: 2.8,
        ease: "easeInOut",
        delay: 0.4,
      }}
    >
      <rect x="420" y="319" width="22" height="72" rx="9" fill="#1e3a6e" />
      <rect
        x="423"
        y="382"
        width="16"
        height="14"
        rx="7"
        fill="url(#skinGrad)"
      />
      <ellipse cx="431" cy="400" rx="13" ry="10" fill="url(#skinGrad)" />
      <rect x="420" y="396" width="8" height="5" rx="2.5" fill="#c8956c" />
      <rect x="420" y="402" width="8" height="5" rx="2.5" fill="#c8956c" />
      <rect x="436" y="394" width="8" height="4" rx="2" fill="#c8956c" />
    </motion.g>

    {/* ══════════ TABLET ══════════ */}
    <motion.g
      style={{ transformOrigin: "431px 375px" }}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{
        repeat: Infinity,
        duration: 2.8,
        ease: "easeInOut",
        delay: 0.4,
      }}
    >
      <rect
        x="392"
        y="325"
        width="88"
        height="118"
        rx="9"
        fill="#141b2d"
        stroke="#2d3f5e"
        strokeWidth="2.5"
        filter="url(#shadow)"
      />
      <circle cx="436" cy="332" r="2.5" fill="#0a0f1a" />
      <rect
        x="396"
        y="337"
        width="80"
        height="96"
        rx="4"
        fill="url(#screenGrad)"
      />
      <rect x="396" y="337" width="80" height="14" rx="3" fill="#0f1e36" />
      <text x="400" y="347" fontSize="6" fill="#64748b" fontFamily="monospace">
        ● KMP-001
      </text>
      <motion.circle
        cx="468"
        cy="344"
        r="3.5"
        fill="#22c55e"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
      {[
        { y: 358, label: "BASINÇ", val: "8.2 bar", c: "#22c55e" },
        { y: 370, label: "SICAKLIK", val: "72°C", c: "#f59e0b" },
        { y: 382, label: "VERİM", val: "%94", c: "#6366f1" },
        { y: 394, label: "YAĞ", val: "NORMAL", c: "#22c55e" },
      ].map((r) => (
        <g key={r.y}>
          <rect
            x="396"
            y={r.y - 5}
            width="80"
            height="11"
            rx="2"
            fill={r.y % 2 === 0 ? "#0a1424" : "#0d1a2e"}
          />
          <text
            x="399"
            y={r.y + 3}
            fontSize="5.5"
            fill="#475569"
            fontFamily="monospace"
          >
            {r.label}
          </text>
          <text
            x="474"
            y={r.y + 3}
            textAnchor="end"
            fontSize="6"
            fill={r.c}
            fontFamily="monospace"
            fontWeight="bold"
          >
            {r.val}
          </text>
        </g>
      ))}
      <rect x="396" y="408" width="80" height="21" rx="3" fill="#080f1e" />
      <polyline
        points="399,426 407,421 415,423 424,416 432,418 441,412 450,415 458,409 466,411 474,406"
        fill="none"
        stroke="#6366f1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polyline
        points="399,426 407,421 415,423 424,416 432,418 441,412 450,415 458,409 466,411 474,406 474,429 399,429"
        fill="#6366f1"
        opacity="0.07"
      />
      <motion.circle
        cx="474"
        cy="406"
        r="2.5"
        fill="#6366f1"
        filter="url(#glow3)"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      <rect
        x="400"
        y="432"
        width="72"
        height="8"
        rx="4"
        fill="#6366f1"
        opacity="0.8"
      />
      <text
        x="436"
        y="438"
        textAnchor="middle"
        fontSize="5"
        fill="white"
        fontFamily="monospace"
      >
        FORMU KAYDET
      </text>
      <rect x="420" y="443" width="32" height="4" rx="2" fill="#1e2d4a" />
      <rect
        x="396"
        y="337"
        width="24"
        height="96"
        rx="3"
        fill="white"
        opacity="0.015"
      />
    </motion.g>
    <motion.rect
      x="396"
      y="337"
      width="80"
      height="96"
      rx="4"
      fill="#6366f1"
      opacity={0}
      animate={{ opacity: [0, 0.04, 0] }}
      transition={{ repeat: Infinity, duration: 3, delay: 0.8 }}
    />

    {/* Boyun */}
    <rect
      x="373"
      y="284"
      width="24"
      height="22"
      rx="10"
      fill="url(#skinGrad)"
    />

    {/* Baret */}
    <rect x="348" y="248" width="74" height="18" rx="9" fill="#f59e0b" />
    <ellipse cx="385" cy="248" rx="37" ry="10" fill="#d97706" />
    <rect x="344" y="256" width="82" height="8" rx="4" fill="#b45309" />
    <rect x="344" y="264" width="82" height="4" rx="2" fill="#92400e" />

    {/* Yüz */}
    <ellipse cx="385" cy="276" rx="26" ry="26" fill="url(#skinGrad)" />
    <rect x="352" y="264" width="66" height="8" rx="4" fill="#5c3d1e" />
    <path
      d="M369 262 Q376 259 382 262"
      stroke="#7a5230"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M388 262 Q394 259 401 262"
      stroke="#7a5230"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="376" cy="270" rx="5" ry="5.5" fill="#1a1208" />
    <ellipse cx="394" cy="270" rx="5" ry="5.5" fill="#1a1208" />
    <circle cx="377.5" cy="268.5" r="2" fill="white" />
    <circle cx="395.5" cy="268.5" r="2" fill="white" />
    <circle cx="378" cy="268" r="1" fill="white" opacity="0.7" />
    <circle cx="396" cy="268" r="1" fill="white" opacity="0.7" />
    <path
      d="M385 273 Q383 279 381 280 Q385 282 389 280 Q387 279 385 273"
      fill="#c8956c"
    />
    <path
      d="M378 286 Q385 288 392 286"
      stroke="#9a6845"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="359" cy="276" rx="6" ry="8" fill="url(#skinGrad)" />
    <ellipse cx="411" cy="276" rx="6" ry="8" fill="url(#skinGrad)" />
    <rect
      x="361"
      y="252"
      width="48"
      height="10"
      rx="5"
      fill="#0f172a"
      stroke="#2d4066"
      strokeWidth="1.5"
    />
    <rect
      x="363"
      y="253"
      width="20"
      height="7"
      rx="3.5"
      fill="#1e3a5f"
      opacity="0.8"
    />
    <rect
      x="385"
      y="253"
      width="20"
      height="7"
      rx="3.5"
      fill="#1e3a5f"
      opacity="0.8"
    />
    <rect
      x="354"
      y="270"
      width="7"
      height="14"
      rx="3.5"
      fill="#0a0f1a"
      stroke="#2d4066"
      strokeWidth="1"
    />
    <motion.circle
      cx="357"
      cy="277"
      r="3.5"
      fill="#6366f1"
      animate={{ opacity: [0.4, 0.9, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.8 }}
    />

    {/* ══════════ AR TARAMA ══════════ */}
    <motion.g
      animate={{ opacity: [0, 0.65, 0] }}
      transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
    >
      <rect
        x="72"
        y="228"
        width="226"
        height="262"
        rx="8"
        fill="none"
        stroke="#6366f1"
        strokeWidth="1"
        strokeDasharray="10 5"
      />
      {[
        [72, 228],
        [278, 228],
        [72, 480],
        [278, 480],
      ].map(([x, y], i) => (
        <g key={i}>
          <line
            x1={x + (i % 2 === 0 ? 0 : -16)}
            y1={y}
            x2={x + (i % 2 === 0 ? 16 : 0)}
            y2={y}
            stroke="#6366f1"
            strokeWidth="2.5"
          />
          <line
            x1={x}
            y1={y + (i < 2 ? 0 : -16)}
            x2={x}
            y2={y + (i < 2 ? 16 : 0)}
            stroke="#6366f1"
            strokeWidth="2.5"
          />
        </g>
      ))}
    </motion.g>
    <motion.rect
      x="72"
      y="228"
      width="226"
      height="3"
      rx="1.5"
      fill="#6366f1"
      opacity="0.35"
      animate={{ y: [228, 480, 228] }}
      transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
    />

    {/* Veri balonu — kompresörün üstünde */}
    <motion.g
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        repeat: Infinity,
        duration: 5,
        times: [0, 0.15, 0.85, 1],
        delay: 0.5,
      }}
    >
      {/* Balon kutusu */}
      <rect
        x="155"
        y="100"
        width="140"
        height="68"
        rx="8"
        fill="#080f1e"
        stroke="#6366f1"
        strokeWidth="1"
      />
      {/* Kompresöre bağlayan çizgi */}
      <line
        x1="200"
        y1="168"
        x2="190"
        y2="228"
        stroke="#6366f1"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <circle cx="190" cy="228" r="3" fill="#6366f1" />
      {/* İçerik */}
      <text
        x="167"
        y="116"
        fontSize="6.5"
        fill="#64748b"
        fontFamily="monospace"
      >
        ATLAS COPCO GA90
      </text>
      <text
        x="167"
        y="128"
        fontSize="7"
        fill="#22c55e"
        fontFamily="monospace"
        fontWeight="bold"
      >
        ● ÇALIŞIYOR
      </text>
      <rect x="167" y="132" width="116" height="1" fill="#1a2840" />
      <text x="167" y="144" fontSize="6" fill="#94a3b8" fontFamily="monospace">
        Kapasite: 8.5 m³/dak
      </text>
      <text x="167" y="156" fontSize="6" fill="#f59e0b" fontFamily="monospace">
        ⚠ Sonraki bakım: 14g
      </text>
    </motion.g>

    {/* Zemin uyarı çizgileri */}
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <rect
        key={i}
        x={72 + i * 33}
        y={484}
        width={18}
        height={7}
        rx={2}
        fill={i % 2 === 0 ? "#f59e0b" : "#1a2236"}
        opacity="0.65"
      />
    ))}

    {/* Alt sistem çubuğu */}
    <rect x="0" y="584" width="500" height="36" fill="#050810" />
    <rect x="0" y="584" width="500" height="1" fill="#131d30" />
    <motion.text
      x="16"
      y="606"
      fontSize="7.5"
      fill="#1e3a5f"
      fontFamily="monospace"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      ■ SİSTEM AKTİF · 2 MAKİNE İZLENİYOR · SON GÜNCELLEME: 09:41:22
    </motion.text>
  </svg>
);

/* ══════════════════════════════════════════════════════════
   AUTH PAGE
   ══════════════════════════════════════════════════════════ */
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Router hook'u

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Payload hazırlığı
    const payload = {
      ...data,
      username: data.email, // Django login için şart
    };

    try {
      const endpoint = isLogin ? "/api/token/" : "/api/auth/register/";
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        // localhost yerine 127.0.0.1 bazen daha kararlıdır
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Hata mesajını detaylı göster ki ne olduğunu anla
        alert(`Hata: ${result.detail || JSON.stringify(result)}`);
        setLoading(false);
        return;
      }

      if (isLogin) {
        // GİRİŞ BAŞARILI
        localStorage.setItem("access_token", result.access);
        localStorage.setItem("refresh_token", result.refresh);

        // Kullanıcı verisini ve abonelik durumunu çek
        const meRes = await fetch("http://127.0.0.1:8000/api/auth/me/", {
          headers: { Authorization: `Bearer ${result.access}` },
        });

        if (meRes.ok) {
          const meData = await meRes.json();
          // Dökümandaki Multi-tenant/Subscription kuralı:
          if (meData.company?.subscription_status === "expired") {
            alert("Abonelik süreniz dolmuş!");
            router.push("/billing");
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/dashboard"); // MeView patlasa bile en azından içeri girsin
        }
      } else {
        // KAYIT BAŞARILI
        setIsLogin(true);
        alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      }
    } catch (err) {
      console.error("Bağlantı Hatası:", err);
      alert("Sunucuya bağlanılamadı. Django'nun çalıştığından emin ol!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-[#0b0f19] flex overflow-hidden">
      {/* ── SOL TARAF (SAHNE) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#080d16] overflow-hidden">
        {/* Ana Sayfa — sol üst */}
        <Link
          href="/"
          className="absolute top-5 left-6 z-30 flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full"
        >
          ← Ana Sayfa
        </Link>
        {/* Sahne */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Scene />
        </motion.div>
      </div>

      {/* ── SAĞ TARAF ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">
              {isLogin ? "Giriş Yap" : "Hesap Aç"}
            </h2>
            <p className="text-slate-500 mt-2">
              Profesyonel servis yönetimine başlayın.
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <input
                    name="company_name" // EKLE
                    type="text"
                    required
                    placeholder="Şirket Adı"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                )}
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="E-posta"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Şifre"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : isLogin ? (
                    "Oturum Aç"
                  ) : (
                    "Denemeyi Başlat"
                  )}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center text-sm">
            {isLogin ? "Hesabınız yok mu?" : "Zaten üye misiniz?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-indigo-600 font-semibold"
            >
              {isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
