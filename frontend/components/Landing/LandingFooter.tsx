"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const FooterLink: React.FC<{ href?: string; children: React.ReactNode }> = ({
  href = "#",
  children,
}) => (
  <li>
    <Link
      href={href}
      className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-500"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <a
    href="#"
    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-500"
  >
    {children}
  </a>
);

const LandingFooter: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <footer className="bg-transparent border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Trust & Security Section */}
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left items-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-500">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
              Your Privacy is Our Priority
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
              Your resume and personal data are encrypted and securely stored.
              We are fully GDPR and CCPA compliant. You can delete your data at
              any time.
            </p>
          </div>
          <div className="flex items-center justify-center md:justify-end space-x-4">
            {["GDPR", "CCPA", "SSL"].map((label) => (
              <div
                key={label}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 transition-all duration-500"
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8">
          {/* Logo & Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C13.8263 22 15.5262 21.5562 17 20.8135C15.8362 18.0333 15.8362 14.9667 17 12.1865C15.5262 11.4438 13.8263 11 12 11C8.68629 11 6 14.134 6 17.5C6 18.0053 6.06221 18.4947 6.17802 18.961C3.84476 17.4042 2.58333 14.8521 2.58333 12C2.58333 6.78451 6.78451 2.58333 12 2.58333C14.8521 2.58333 17.4042 3.84476 18.961 6.17802C18.4947 6.06221 18.0053 6 17.5 6C14.134 6 11 8.68629 11 12C11 13.8263 11.4438 15.5262 12.1865 17C14.9667 15.8362 18.0333 15.8362 20.8135 17C21.5562 15.5262 22 13.8263 22 12C22 6.47715 17.5228 2 12 2Z"
                  fill={isDark ? "#FFFFFF" : "#000000"}
                />
              </svg>
              <span className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-500">
                AirTech
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
              The AI-powered platform to help you land your dream job.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-7">
            <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">
              Product
            </h4>
            <ul className="mt-4 space-y-3">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#templates">Templates</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="/auth">Log in</FooterLink>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              <FooterLink>About Us</FooterLink>
              <FooterLink>Blog</FooterLink>
              <FooterLink>Contact</FooterLink>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">
              Legal
            </h4>
            <ul className="mt-4 space-y-3">
              <FooterLink>Terms of Service</FooterLink>
              <FooterLink>Privacy Policy</FooterLink>
              <FooterLink>Refund Policy</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center transition-colors duration-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AirTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
