"use client";

import React from "react";

const LandingProblem = () => {
  const problems = [
    {
      title: "Plansız Arızalar",
      desc: "Üretimin durmasına neden olan beklenmedik kompresör duruşları.",
      icon: "⚠️",
    },
    {
      title: "Kaçırılan Bakımlar",
      desc: "Zamanında yapılmayan yağ ve filtre değişimlerinin yarattığı büyük masraflar.",
      icon: "⏳",
    },
    {
      title: "Excel Karmaşası",
      desc: "Dosyalar arasında kaybolan servis formları ve güncelliğini yitirmiş tablolar.",
      icon: "📄",
    },
    {
      title: "Raporlama Eksikliği",
      desc: "Hangi makine ne kadar maliyet çıkardı, kestirememek.",
      icon: "📊",
    },
  ];

  const solutions = [
    {
      title: "Kompresör Odaklı Takip",
      desc: "Sadece bu iş için özelleşmiş detaylı makine kartları.",
      icon: "⚙️",
    },
    {
      title: "Otomatik Hatırlatıcılar",
      desc: "Bakım zamanı yaklaştığında SMS ve e-posta ile anlık uyarılar.",
      icon: "🔔",
    },
    {
      title: "Tablet Uyumlu Saha",
      desc: "Teknisyenlerin makine başında kolayca veri girebileceği arayüz.",
      icon: "📱",
    },
    {
      title: "Bulut Tabanlı Altyapı",
      desc: "Verilerinize her yerden, her cihazdan güvenle erişin.",
      icon: "☁️",
    },
  ];

  return (
    <section className="py-24 bg-transparent transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* 1. NASIL ÇALIŞIR - ARTIK EN ÜSTTE */}

        {/* 2. PROBLEM SECTION */}
        <div className="mb-16 border-t border-slate-200 dark:border-slate-800 pt-20">
          <div className="text-center mb-10">
            <h2 className="text-red-500 font-bold uppercase tracking-widest text-sm transition-colors duration-500">
              Sektörel Zorluklar
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((p, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white/30 dark:bg-slate-900/30 border border-red-100 dark:border-red-900/20 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-red-400 dark:hover:border-red-700 group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-500">
                  {p.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-500">
                  {p.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-500">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. SOLUTION SECTION */}
        <div id="features" className="mb-16 relative">
          <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
          <div className="text-center mb-10">
            <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm transition-colors duration-500">
              Bizim Çözümümüz
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((s, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-900/20 backdrop-blur-sm hover:scale-105 hover:border-indigo-500 transition-all duration-500 group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-500">
                  {s.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-500">
                  {s.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingProblem;
