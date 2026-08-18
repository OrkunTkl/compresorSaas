"use client";

import React from "react";

/* ─── Mock Ekranlar ────────────────────────────────────────────────────────── */

const AdminMock = () => (
  <div className="w-full h-full bg-slate-950 flex flex-col text-[10px] font-mono select-none overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-slate-500 tracking-widest uppercase text-[9px]">
          KompresSys — Yönetici
        </span>
      </div>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-slate-700" />
        <div className="w-2 h-2 rounded-full bg-slate-700" />
        <div className="w-2 h-2 rounded-full bg-slate-700" />
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2 p-4 shrink-0">
      {[
        {
          l: "Aktif",
          v: "41",
          c: "text-emerald-400",
          b: "bg-emerald-500",
          w: "88%",
        },
        {
          l: "Uyarı",
          v: "6",
          c: "text-amber-400",
          b: "bg-amber-500",
          w: "15%",
        },
        { l: "Kritik", v: "2", c: "text-red-400", b: "bg-red-500", w: "5%" },
        { l: "Bakım", v: "23", c: "text-cyan-400", b: "bg-cyan-500", w: "55%" },
      ].map((s) => (
        <div
          key={s.l}
          className="bg-slate-900 rounded-lg p-2.5 border border-slate-800"
        >
          <p className="text-slate-600 text-[8px] uppercase tracking-wide mb-1">
            {s.l}
          </p>
          <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
          <div className="mt-1.5 h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${s.b} rounded-full`}
              style={{ width: s.w }}
            />
          </div>
        </div>
      ))}
    </div>
    <div className="flex-1 px-4 overflow-hidden">
      <p className="text-slate-600 text-[8px] uppercase tracking-widest mb-2">
        Makine Listesi
      </p>
      <div className="space-y-1.5">
        {[
          {
            id: "KMP-001",
            model: "Atlas Copco GA 90",
            bar: 68,
            sc: "text-emerald-400 border-emerald-500/30 bg-emerald-400/10",
            st: "Normal",
          },
          {
            id: "KMP-007",
            model: "Kaeser CSD 102",
            bar: 91,
            sc: "text-amber-400 border-amber-500/30 bg-amber-400/10",
            st: "Uyarı",
          },
          {
            id: "KMP-014",
            model: "Ingersoll-Rand R110",
            bar: 55,
            sc: "text-emerald-400 border-emerald-500/30 bg-emerald-400/10",
            st: "Normal",
          },
          {
            id: "KMP-019",
            model: "Boge S100",
            bar: 100,
            sc: "text-red-400 border-red-500/30 bg-red-400/10",
            st: "Kritik",
          },
          {
            id: "KMP-023",
            model: "Gardner Denver VS18",
            bar: 72,
            sc: "text-emerald-400 border-emerald-500/30 bg-emerald-400/10",
            st: "Normal",
          },
          {
            id: "KMP-031",
            model: "Compair L45",
            bar: 48,
            sc: "text-emerald-400 border-emerald-500/30 bg-emerald-400/10",
            st: "Normal",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-slate-900 rounded-md px-3 py-2 border border-slate-800"
          >
            <span className="text-slate-600 w-14 shrink-0">{m.id}</span>
            <span className="text-slate-300 flex-1 truncate">{m.model}</span>
            <div className="flex items-center gap-1.5 w-20 shrink-0">
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.bar > 90 ? "bg-red-500" : "bg-cyan-500"}`}
                  style={{ width: `${m.bar}%` }}
                />
              </div>
              <span className="text-slate-600 text-[8px] w-5 text-right">
                {m.bar}
              </span>
            </div>
            <span
              className={`text-[8px] px-1.5 py-0.5 rounded border font-bold shrink-0 ${m.sc}`}
            >
              {m.st}
            </span>
          </div>
        ))}
      </div>
    </div>
    <div className="px-4 py-3 shrink-0">
      <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600 text-[8px] uppercase tracking-wide">
            Aylık Bakım Trendi
          </span>
          <span className="text-emerald-400 text-[8px] font-bold">↑ 18%</span>
        </div>
        <svg viewBox="0 0 240 40" className="w-full">
          <defs>
            <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,36 C40,30 60,32 80,22 C100,12 120,16 140,9 C160,3 200,7 240,2 L240,40 L0,40Z"
            fill="url(#ag)"
          />
          <path
            d="M0,36 C40,30 60,32 80,22 C100,12 120,16 140,9 C160,3 200,7 240,2"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  </div>
);

const TabletMock = () => (
  <div className="w-full h-full bg-white flex flex-col font-mono text-[11px] select-none overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b border-slate-200 shrink-0">
      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 16 16"
          className="w-4 h-4"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        >
          <path d="M4 8h8M8 4v8" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-slate-800 font-bold text-[10px]">Servis Formu</p>
        <p className="text-slate-400 text-[9px]">KMP-007 · Kaeser CSD 102</p>
      </div>
      <div className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
    </div>
    <div className="flex-1 p-4 flex flex-col gap-2 overflow-hidden">
      {[
        { label: "Teknisyen", val: "Mehmet Yılmaz", dot: "bg-emerald-400" },
        { label: "Tarih", val: "24.02.2025 — 09:41", dot: "bg-emerald-400" },
        { label: "Basınç (bar)", val: "9.1", dot: "bg-amber-400" },
        {
          label: "Yağ Seviyesi",
          val: "Düşük — Yenilendi",
          dot: "bg-amber-400",
        },
      ].map((f, i) => (
        <div
          key={i}
          className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200"
        >
          <span className="text-slate-400 text-[9px] uppercase tracking-wide">
            {f.label}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-700 font-bold text-[10px]">
              {f.val}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />
          </div>
        </div>
      ))}
      <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 flex-1">
        <p className="text-slate-400 text-[9px] uppercase tracking-wide mb-2">
          Kontrol Listesi
        </p>
        {[
          { item: "Filtre değişimi", done: true },
          { item: "Soğutma sistemi", done: true },
          { item: "Kayış gerilimi", done: false },
          { item: "Emniyet valfi testi", done: false },
        ].map((c, i) => (
          <div key={i} className="flex items-center gap-2.5 py-1">
            <div
              className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 ${c.done ? "bg-indigo-600 border-indigo-600" : "border-slate-300"}`}
            >
              {c.done && (
                <svg viewBox="0 0 8 8" className="w-2.5 h-2.5">
                  <path
                    d="M1.5 4l2 2 3-3.5"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-[10px] ${c.done ? "text-slate-400 line-through" : "text-slate-700"}`}
            >
              {c.item}
            </span>
          </div>
        ))}
      </div>
      <div className="h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
        <span className="text-white text-[9px] font-bold tracking-widest uppercase">
          Formu Kaydet & Gönder
        </span>
      </div>
    </div>
  </div>
);

const ReportMock = () => (
  <div className="w-full h-full bg-slate-950 flex flex-col font-mono text-[10px] select-none overflow-hidden p-4">
    <div className="flex justify-between items-start mb-3 shrink-0">
      <div>
        <p className="text-slate-600 text-[8px] uppercase tracking-widest">
          Rapor
        </p>
        <p className="text-slate-200 font-bold text-sm">Şubat 2025</p>
      </div>
      <div className="flex gap-1.5">
        {["PDF", "XLS"].map((t) => (
          <span
            key={t}
            className="text-[8px] px-2 py-1 border border-slate-700 rounded text-slate-400"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
    <div className="flex gap-3 mb-3 shrink-0">
      <div className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke="#1e293b"
            strokeWidth="7"
          />
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="7"
            strokeDasharray={`${0.78 * 138.2} 138.2`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-cyan-400 font-bold text-base leading-none">
            78%
          </span>
          <span className="text-slate-600 text-[7px] mt-0.5">verimli</span>
        </div>
      </div>
      <div className="flex-1 space-y-2 pt-1">
        {[
          { l: "Toplam Arıza", v: "4 adet", d: "−2", good: true },
          { l: "Servis Maliyeti", v: "₺12.4K", d: "+8%", good: false },
          { l: "Ort. MTBF", v: "142 sa", d: "+22%", good: true },
        ].map((r, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-slate-600">{r.l}</span>
            <span className="text-slate-300 font-bold">
              {r.v}{" "}
              <span className={r.good ? "text-emerald-400" : "text-amber-400"}>
                {r.d}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-3 flex flex-col">
      <p className="text-slate-600 text-[8px] mb-2">Makine Başı Maliyet (₺)</p>
      <div className="flex items-end gap-1.5 flex-1">
        {[40, 65, 35, 88, 50, 70, 45].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background: i === 3 ? "#22d3ee" : "#1e3a4a",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {["O", "Ş", "M", "N", "M", "H", "T"].map((m, i) => (
          <span
            key={i}
            className="flex-1 text-center text-[7px] text-slate-700"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Ana Bileşen ──────────────────────────────────────────────────────────── */
const LandingPreview = () => {
  const screens = [
    {
      title: "Yönetici Paneli",
      desc: "Tüm operasyonu ve makine sağlığını tek bir merkezden, anlık verilerle izleyin.",
      tag: "Merkezi Kontrol",
      mock: <AdminMock />,
      style: "lg:col-span-2 lg:row-span-2",
    },
    {
      title: "Saha Ekibi",
      desc: "Teknisyenler için optimize edilmiş, hızlı servis formu girişi.",
      tag: "Tablet Arayüzü",
      mock: <TabletMock />,
      style: "lg:col-span-1 lg:row-span-1",
    },
    {
      title: "Akıllı Raporlama",
      desc: "Enerji verimliliği ve maliyet analizlerini saniyeler içinde oluşturun.",
      tag: "Analiz & Rapor",
      mock: <ReportMock />,
      style: "lg:col-span-1 lg:row-span-1",
    },
  ];

  return (
    <section className="py-24 bg-transparent transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Başlık Bölümü */}
        <div className="text-center mb-20">
          <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4">
            Ürün Önizleme
          </h2>
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white transition-all duration-500 tracking-tight">
            Her Şey Elinizin Altında.
          </h3>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-8 min-h-[700px]">
          {screens.map((screen, i) => (
            <div
              key={i}
              className={`group relative rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-900 transition-all duration-700 hover:scale-[1.02] shadow-xl ${screen.style}`}
            >
              {/* Mock Ekran */}
              <div className="absolute inset-0 z-10">{screen.mock}</div>

              {/* Bilgi Overlay — alttan yukarı çıkar, tıklama yok */}
              <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none overflow-hidden">
                <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div className="bg-gradient-to-t from-slate-950 via-slate-900/95 to-transparent pt-16 px-10 pb-10">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3 block">
                      {screen.tag}
                    </span>
                    <h4 className="text-3xl font-bold text-white mb-3">
                      {screen.title}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {screen.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cam Parlaması */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-40 z-30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPreview;
