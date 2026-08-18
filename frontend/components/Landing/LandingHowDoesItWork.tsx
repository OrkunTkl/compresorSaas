"use client";

import React, { useEffect, useRef, useState } from "react";

const LandingHowDoesItWork = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const thetaRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentIndexRef = useRef(0);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const steps = [
    {
      id: "01",
      title: "Kompresörleri Ekleyin",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=500&auto=format&fit=crop",
      back: "Marka, model, seri numarası ve mevcut çalışma saatlerini kolayca sisteme girin. Tüm ekipmanlarınız tek bir panelde görünür hale gelir.",
    },
    {
      id: "02",
      title: "Bakım Planı Oluşturun",
      image:
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=500&auto=format&fit=crop",
      back: "Her kompresör için yağ, filtre ve genel bakım aralıklarını tanımlayın. Sistem, takvimi otomatik hesaplar ve sizi zamanında uyarır.",
    },
    {
      id: "03",
      title: "Saha Ekibini Yönetin",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500&auto=format&fit=crop",
      back: "Teknisyenler tablet veya telefondan iş emirlerini görür, makine başında formu doldurur. Kağıt ve Excel tamamen ortadan kalkar.",
    },
    {
      id: "04",
      title: "Arızaları Kayıt Altına Alın",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop",
      back: "Ani duruş veya hata oluştuğunda anında arıza kaydı açın. Müdahale süresi, parça ve işçilik maliyeti otomatik hesaplanır.",
    },
    {
      id: "05",
      title: "Bildirimleri Alın",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop",
      back: "Bakım tarihi yaklaşınca SMS ve e-posta ile anında uyarı alırsınız. Kritik eşik aşımlarında sistem sizi gecikmesiz bilgilendirir.",
    },
    {
      id: "06",
      title: "Takip Edin & Raporlayın",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop",
      back: "Makine başına maliyet, bakım geçmişi ve verimlilik trendlerini tek ekranda görün. Veriye dayalı kararlar alın, maliyetleri düşürün.",
    },
  ];

  const totalCards = steps.length;
  const getRadius = () =>
    typeof window !== "undefined" && window.innerWidth <= 768 ? 260 : 400;

  const arrangeCards = () => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.querySelectorAll<HTMLElement>(".hw-card");
    const angle = 360 / totalCards;
    const r = getRadius();
    cards.forEach((card, i) => {
      card.style.transform = `rotateY(${angle * i}deg) translateZ(${r}px)`;
      card.dataset.index = String(i);
    });
  };

  const rotateCarousel = () => {
    if (!carouselRef.current) return;
    carouselRef.current.style.transform = `rotateY(${thetaRef.current}deg)`;
    const angle = 360 / totalCards;
    let idx = Math.round(Math.abs(thetaRef.current / angle) % totalCards);
    if (idx >= totalCards) idx = 0;
    currentIndexRef.current = idx;
  };

  const nextCard = () => {
    thetaRef.current -= 360 / totalCards;
    rotateCarousel();
  };
  const prevCard = () => {
    thetaRef.current += 360 / totalCards;
    rotateCarousel();
  };

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const cardIndex = parseInt(
      (e.currentTarget as HTMLElement).dataset.index ?? "0",
    );
    if (cardIndex === currentIndexRef.current) {
      setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
    }
  };

  useEffect(() => {
    arrangeCards();
    rotateCarousel();

    const wrapper = carouselRef.current?.parentElement;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      startXRef.current =
        (e as MouseEvent).pageX ?? (e as TouchEvent).touches?.[0]?.pageX;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const cx =
        (e as MouseEvent).pageX ??
        (e as TouchEvent).touches?.[0]?.pageX ??
        startXRef.current;
      if (carouselRef.current)
        carouselRef.current.style.transform = `rotateY(${thetaRef.current + (cx - startXRef.current) * 0.5}deg)`;
    };
    const onUp = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const cx =
        (e as MouseEvent).pageX ??
        (e as TouchEvent).changedTouches?.[0]?.pageX ??
        startXRef.current;
      const diff = cx - startXRef.current;
      if (Math.abs(diff) > 20) {
        diff > 0 ? prevCard() : nextCard();
      } else {
        const a = 360 / totalCards;
        thetaRef.current = Math.round(thetaRef.current / a) * a;
        rotateCarousel();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") nextCard();
      if (e.key === "ArrowRight") prevCard();
    };
    const onResize = () => {
      arrangeCards();
      rotateCarousel();
    };

    wrapper?.addEventListener("mousedown", onDown as EventListener);
    wrapper?.addEventListener("touchstart", onDown as EventListener, {
      passive: true,
    });
    document.addEventListener("mousemove", onMove as EventListener);
    document.addEventListener("touchmove", onMove as EventListener, {
      passive: false,
    });
    document.addEventListener("mouseup", onUp as EventListener);
    document.addEventListener("touchend", onUp as EventListener);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      wrapper?.removeEventListener("mousedown", onDown as EventListener);
      wrapper?.removeEventListener("touchstart", onDown as EventListener);
      document.removeEventListener("mousemove", onMove as EventListener);
      document.removeEventListener("touchmove", onMove as EventListener);
      document.removeEventListener("mouseup", onUp as EventListener);
      document.removeEventListener("touchend", onUp as EventListener);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="py-24 bg-transparent transition-colors duration-500">
      <style>{`
        .hw-perspective {
          perspective: 1000px;
          transform-style: preserve-3d;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 520px;
          position: relative;
          cursor: grab;
          touch-action: none;
          user-select: none;
        }
        .hw-perspective:active { cursor: grabbing; }
        .hw-carousel {
          position: relative;
          width: 400px;
          height: 400px;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }
        .hw-card {
          position: absolute;
          width: 270px;
          height: 370px;
          left: 50%; top: 50%;
          margin-left: -135px;
          margin-top: -185px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.175,0.885,0.32,1.275);
          cursor: pointer;
        }
        .hw-card-inner {
          position: relative;
          width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .hw-card:hover .hw-card-inner { transform: translateZ(20px); }
        .hw-card.flipped .hw-card-inner { transform: rotateY(180deg); }
        .hw-card.flipped:hover .hw-card-inner { transform: rotateY(180deg) translateZ(20px); }
        .hw-front, .hw-back {
          position: absolute;
          width: 100%; height: 100%;
          backface-visibility: hidden;
          border-radius: 24px;
          overflow: hidden;
        }
        .hw-back { transform: rotateY(180deg); }
        .hw-glow {
          position: absolute; inset: 0;
          border-radius: 24px;
          pointer-events: none;
          background: radial-gradient(circle at 50% 30%, rgba(99,102,241,0.15), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .hw-card:hover .hw-glow { opacity: 1; }
        .hw-controls {
          position: absolute;
          bottom: -90px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 16px;
          z-index: 50;
        }
        .hw-btn {
          background: rgba(20,20,50,0.7);
          border: 1px solid rgba(99,102,241,0.45);
          color: white;
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s;
          box-shadow: 0 0 10px rgba(99,102,241,0.3);
        }
        .hw-btn:hover { background: rgba(99,102,241,0.25); transform: scale(1.1); }
        .hw-hint {
          position: absolute;
          bottom: -124px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.72rem;
          white-space: nowrap;
          letter-spacing: 0.05em;
        }
        @media (max-width: 768px) {
          .hw-perspective { height: 420px; }
          .hw-carousel { width: 260px; height: 260px; }
          .hw-card { width: 220px; height: 310px; margin-left: -110px; margin-top: -155px; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white transition-colors duration-500">
            Nasıl Çalışır?
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-base transition-colors duration-500">
            Kartları sürükle, döndür ve detayları keşfet
          </p>
        </div>

        <div className="hw-perspective">
          <div className="hw-carousel" ref={carouselRef}>
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`hw-card${flippedCards[idx] ? " flipped" : ""}`}
                data-index={idx}
                onClick={(e) => handleFlip(e, idx)}
              >
                <div className="hw-card-inner">
                  {/* FRONT */}
                  <div className="hw-front backdrop-blur-sm shadow-xl transition-colors duration-500">
                    <div className="relative h-[55%] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover grayscale opacity-90 dark:opacity-60 dark:mix-blend-luminosity transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-slate-900/80 via-transparent to-transparent transition-colors duration-500" />
                      <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-black px-2 py-1 rounded-lg tracking-widest">
                        {step.id}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <div className="h-1 w-10 bg-indigo-500 rounded-full" />
                      <h4 className="text-slate-900 dark:text-white font-bold text-lg leading-tight transition-colors duration-500">
                        {step.title}
                      </h4>
                      <p className="text-indigo-500 dark:text-indigo-400 text-xs font-medium transition-colors duration-500">
                        Detay için tıkla →
                      </p>
                    </div>
                    <div className="hw-glow" />
                  </div>

                  {/* BACK */}
                  <div className="hw-back bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl transition-colors duration-500">
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-indigo-600 text-white text-xs font-black px-2 py-1 rounded-lg tracking-widest">
                          {step.id}
                        </span>
                        <div className="h-[1px] flex-1 bg-indigo-200 dark:bg-indigo-800 transition-colors duration-500" />
                      </div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-3 leading-tight transition-colors duration-500">
                        {step.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-1 transition-colors duration-500">
                        {step.back}
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
                        <p className="text-indigo-500 dark:text-indigo-400 text-xs font-medium transition-colors duration-500">
                          ← Geri dön
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hw-controls">
            <button className="hw-btn" onClick={prevCard}>
              ‹
            </button>
            <button className="hw-btn" onClick={nextCard}>
              ›
            </button>
          </div>
          <div className="hw-hint text-slate-400 dark:text-slate-600 transition-colors duration-500">
            ← → tuşları veya sürükle
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHowDoesItWork;
