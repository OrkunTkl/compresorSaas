"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform group-hover:scale-110"
      >
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C13.8263 22 15.5262 21.5562 17 20.8135C15.8362 18.0333 15.8362 14.9667 17 12.1865C15.5262 11.4438 13.8263 11 12 11C8.68629 11 6 14.134 6 17.5C6 18.0053 6.06221 18.4947 6.17802 18.961C3.84476 17.4042 2.58333 14.8521 2.58333 12C2.58333 6.78451 6.78451 2.58333 12 2.58333C14.8521 2.58333 17.4042 3.84476 18.961 6.17802C18.4947 6.06221 18.0053 6 17.5 6C14.134 6 11 8.68629 11 12C11 13.8263 11.4438 15.5262 12.1865 17C14.9667 15.8362 18.0333 15.8362 20.8135 17C21.5562 15.5262 22 13.8263 22 12C22 6.47715 17.5228 2 12 2Z"
          fill={isDark ? "#FFFFFF" : "#000000"}
        />
      </svg>
      <span
        className={`font-bold text-lg transition-colors duration-500 ${isDark ? "text-white" : "text-black"}`}
      >
        AirTech
      </span>
    </Link>
  );
};

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return <div className="h-20" />;

  const isDark = resolvedTheme === "dark";

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#templates", label: "Templates" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "border-b border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-black/40 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Logo />

        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-500"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/auth"
            className="hidden sm:block bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-all duration-500 active:scale-95"
          >
            Sign In
          </Link>

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-500 focus:outline-none"
            aria-label="Toggle Theme"
          >
            <span
              className={`flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500 ${
                isDark ? "translate-x-7" : "translate-x-1"
              }`}
            >
              {isDark ? "🌙" : "💡"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
