"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faCommentDots, faCircleUser, faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  onGetOffer?: () => void;
}

const NAV_LINKS = ["How It Works", "Recent purchase", "Area served", "Help"];

export default function Navbar({ onGetOffer }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#002147] border-b border-white/10 font-nunito relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Left: hamburger (mobile) + logo ── */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only, left of logo */}
            <button
              className="md:hidden text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FontAwesomeIcon icon={faXmark} className="w-5 h-5" /> : <FontAwesomeIcon icon={faBars} className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/carbrain-logo.svg"
                alt="CarBrain"
                height={28}
                className="h-7 w-auto"
              />
            </a>
          </div>

          {/* ── Center: desktop nav links ── */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-black text-white hover:text-[#00c6ef] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* ── Right: CTA buttons ── */}
          <div className="flex items-center gap-2">
            {/* Chat Now — icon + text on desktop, icon only on mobile */}
            <button
              className="flex items-center gap-2 font-semibold text-white border border-[#00bbea] rounded-full
                         px-4 py-1.5 hover:bg-[#00bbea]/10 transition-colors text-sm"
            >
              <FontAwesomeIcon icon={faCommentDots} className="w-4 h-4 text-[#00bbea] flex-shrink-0" />
              <span className="hidden md:inline">Chat Now</span>
            </button>

            {/* Sign In — person icon + text on desktop, icon only on mobile */}
            <button
              className="flex items-center gap-2 font-semibold text-white border border-white/30 rounded-full
                         px-4 py-1.5 hover:bg-white/10 transition-colors text-sm"
            >
              <FontAwesomeIcon icon={faCircleUser} className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline">Sign In</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 top-16 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Menu panel */}
          <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-[#002147] border-t border-white/10 shadow-2xl">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-3 px-2 rounded-lg text-sm font-semibold
                             text-white/80 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  {item}
                  <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 rotate-[-90deg] text-white/40" />
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
