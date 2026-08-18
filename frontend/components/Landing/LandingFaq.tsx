"use client";

import React, { useRef, useState, useEffect } from "react";

const faqData = [
  {
    question: "What is this software exactly?",
    answer:
      "This is a compressor-focused maintenance management software designed to track preventive maintenance, monitor breakdowns, and manage service operations for compressed air systems.",
  },
  {
    question: "Is this a general CMMS software?",
    answer:
      "No. Unlike generic CMMS platforms, this system is specifically built for compressors and compressed air systems, with dedicated metrics such as runtime tracking and pressure-related data.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No installation is required. The software runs in the cloud and can be accessed from any device with an internet connection.",
  },
  {
    question: "Can my technicians use it on tablets?",
    answer:
      "Yes. The system is optimized for tablet-first usage, allowing field technicians to open, update, and close work orders easily.",
  },
  {
    question: "What happens if I cancel my subscription?",
    answer:
      "If you cancel your subscription, you will have read-only access for a limited period and can export your data (PDF/Excel). After that, your account will be archived.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. All data is securely stored in the cloud with regular backups and industry-standard security protocols.",
  },
  {
    question: "Is this suitable for large factories?",
    answer:
      "Yes. The system is scalable and suitable for both small businesses and large industrial facilities.",
  },
];

const FaqItem: React.FC<{
  item: (typeof faqData)[0];
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 transition-colors duration-500">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-6 text-left"
      >
        <span className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-500">
          {item.question}
        </span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          <svg
            className="w-6 h-6 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </button>
      <div
        ref={contentRef}
        style={{
          height: `${height}px`,
          transition: "height 0.4s ease",
        }}
        className="overflow-hidden"
      >
        <div className="pb-6 pr-8 text-gray-600 dark:text-gray-400 transition-colors duration-500">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

const LandingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-32 bg-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900 dark:text-white transition-colors duration-500">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 mx-auto text-lg text-gray-600 dark:text-gray-400 transition-colors duration-500">
            Have questions? We've got answers.
          </p>
        </div>
        <div className="mt-12 space-y-4">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFaq;
