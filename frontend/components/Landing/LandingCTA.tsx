"use client";

import React from "react";

const LandingCTA = () => {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Ana Konteyner: Dış Çerçeve ve Parlama */}
        <div className="relative group rounded-[4rem] p-[1px] overflow-hidden bg-gradient-to-b from-slate-800 to-transparent shadow-2xl">
          {/* Hareketli Dinamik Işıklar */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/30 blur-[120px] rounded-full group-hover:bg-indigo-500/40 transition-colors duration-700" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-500/30 transition-colors duration-700" />

          {/* İç İçerik: Glassmorphism Derinlik */}
          <div className="relative bg-slate-950/90 backdrop-blur-3xl rounded-[4rem] px-8 py-24 md:py-32 overflow-hidden border border-white/5">
            {/* Arka Plan Grid/Noise Dokusu */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Canlı Durum Rozeti */}
              <div className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-white/80 text-xs font-medium tracking-wide">
                  Hemen Denemeye Başla
                </span>
              </div>

              {/* Dev Tipografi */}
              <h2 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8 tracking-tighter">
                Kaosu Bitirin. <br />
                <span className="italic font-serif text-indigo-400">
                  Verimliliği
                </span>{" "}
                Başlatın.
              </h2>

              {/* Açıklama Metni */}
              <p className="max-w-2xl text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-medium">
                Kompresör arızalarını dert etmeyi bırakın. Modern dünyanın
                servis yönetim yazılımıyla tanışın. Saniyeler içinde kurulum
                yapın, farkı bugün görün.
              </p>

              {/* Ultra-Modern Buton */}
              <div className="relative group/btn mb-12">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-30 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-200"></div>

                <button className="relative px-12 py-6 bg-white text-black font-black rounded-2xl flex items-center gap-4 hover:bg-slate-100 transition-all duration-300 transform active:scale-95">
                  <span className="text-xl uppercase tracking-tighter">
                    Ücretsiz Deneyin
                  </span>
                  <svg
                    className="w-6 h-6 transition-transform duration-300 group-hover/btn:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>

              {/* Güven Veren Özellikler (O garip isimlerin yerine) */}
              <div className="flex flex-wrap justify-center gap-8 border-t border-white/5 pt-12 w-full max-w-2xl">
                {[
                  "Kurulum Gerektirmez",
                  "14 Gün Ücretsiz",
                  "İstediğin Zaman İptal Et",
                  "7/24 Teknik Destek",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-slate-500"
                  >
                    <svg
                      className="w-5 h-5 text-emerald-500/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm font-bold tracking-wide uppercase">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;
