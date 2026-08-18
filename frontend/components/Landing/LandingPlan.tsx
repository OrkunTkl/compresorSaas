"use client";

import React, { useState, useEffect } from "react";

const plans = [
  {
    name: "Starter",
    price: "49",
    description:
      "Dijital bakım yönetimine yeni başlayan küçük işletmeler için.",
    features: [
      "5 Kompresöre Kadar",
      "Periyodik Bakım Planlama",
      "Temel raporlama (PDF çıktı)",
      "Standart e-posta desteği",
      "1 yönetici kullanıcı",
      "En fazla 3 ekip kullanıcısı",
    ],
    isPopular: false,
  },
  {
    name: "Growth",
    price: "99",
    description: "Detaylı raporlama ve analiz bekleyen büyüyen tesisler için.",
    features: [
      "15 Kompresöre Kadar",
      "Gelişmiş Analitik",
      "E-posta + uygulama içi bildirimler",
      "3 yönetici kullanıcı",
      "En fazla 10 ekip kullanıcısı",
      "Bakım Geçmişi Kayıtları",
    ],
    isPopular: true,
  },
  {
    name: "Scale",
    price: "199",
    description:
      "Çoklu saha yönetimi gerektiren büyük endüstriyel operasyonlar için.",
    features: [
      "Sınırsız Kompresör",
      "Özelleştirilebilir Bakım Akışları",
      "Gelişmiş Analiz Paneli",
      "API Erişimi",
      "Sınırsız yönetici kullanıcısı",
      "Sınırsız Ekip Kullanıcısı",
      "Denetime Hazır Raporlama",
    ],
    isPopular: false,
  },
];

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-emerald-500 mr-3 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const LandingPlan = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section
      id="pricing"
      className="py-24 bg-transparent transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Başlık Bölümü */}
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">
            Fiyatlandırma
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 transition-colors duration-500">
            Kesintisiz Üretim İçin <br /> Net ve Şeffaf Planlar.
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-500">
            Gizli maliyet yok. İşletmenizin büyüklüğüne en uygun olanı seçin.
          </p>
        </div>

        {/* Abonelik Kartları */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white/40 dark:bg-slate-950/40 backdrop-blur-md rounded-2xl border transition-all duration-500 ${
                plan.isPopular
                  ? "border-blue-500 shadow-xl lg:scale-105 z-10"
                  : "border-slate-200 dark:border-slate-800 shadow-sm"
              } p-8 flex flex-col`}
            >
              {plan.isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  En Çok Tercih Edilen
                </span>
              )}

              <div className="mb-8 text-left">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-500">
                  {plan.name}
                </h4>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-slate-900 dark:text-white transition-colors duration-500">
                    ${plan.price}
                  </span>
                  <span className="text-slate-500 ml-1 text-sm">/ay</span>
                </div>
                <p className="mt-4 text-sm text-slate-500 leading-relaxed min-h-[40px] transition-colors duration-500">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500"
                  >
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-bold transition-all duration-500 active:scale-95 ${
                  plan.isPopular
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {plan.name} ile Başla
              </button>
            </div>
          ))}
        </div>

        {/* Hibrit Model - Tek Seferlik Lisans */}
        <div className="bg-[#0F172A] rounded-2xl p-8 border border-slate-800 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <div className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded mb-4">
                Enterprise Çözüm
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">
                Tek Seferlik Lisans (On-Premise)
              </h4>
              <p className="text-slate-400 max-w-xl text-sm">
                Abonelik yerine yazılımın tam mülkiyetini mi tercih edersiniz?
                Kendi yerel sunucunuza kurulum, yıllık destek paketleri ve tam
                kontrol için lisans opsiyonumuzu değerlendirin.
              </p>
            </div>
            <div className="shrink-0 text-center">
              <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all duration-500 active:scale-95">
                Teklif Alın
              </button>
              <p className="text-[10px] text-slate-500 mt-3 italic">
                *1 yıllık teknik destek dahildir
              </p>
            </div>
          </div>

          {/* Arka Plan Süsü */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-500 group-hover:scale-110"></div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Tüm fiyatlara KDV dahildir. 50+ kompresör yönetimi için özel çözüm
            mü lazım?
            <a
              href="#"
              className="text-blue-600 font-bold ml-1 hover:underline"
            >
              Bizimle iletişime geçin.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingPlan;
