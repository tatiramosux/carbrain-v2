"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar, faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Typewriter } from "@/components/ui/typewriter-text";

interface HeroSectionProps {
  onGetOffer: (initialZip?: string, initialVin?: string, initialTab?: "zip" | "vin") => void;
}

const CYCLING_WORDS = ["damaged", "worn-out", "broken", "stalled", "wrecked"];

export default function HeroSection({ onGetOffer }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<"zip" | "vin">("zip");
  const [zipCode, setZipCode] = useState("");
  const [vin, setVin]         = useState("");

  return (
    <section className="relative bg-[#002147] overflow-hidden font-nunito">
      {/* Background glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002147] via-[#2e5478]/40 to-[#002147] pointer-events-none" />
      <div className="hero-glow-cyan absolute top-0 right-[10%] w-[600px] h-[600px] pointer-events-none" />
      <div className="hero-glow-lime absolute bottom-0 left-[5%] w-[400px] h-[400px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[140px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16">

          {/* ── Left: hero copy ── */}
          <div className="flex-1 space-y-5">
            {/* Trust badge */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-white/80">
                Trusted by 1 million+ sellers nationwide
              </span>
            </div>

            {/* Headline — Paytone One, 72px desktop / 42px mobile */}
            <h1
              className="font-display text-white leading-tight
                         text-[42px] sm:text-[56px] lg:text-[72px]"
              style={{ lineHeight: "1.1" }}
            >
              The smartest way
              <br />
              to sell your
              <br />
              {/* Typewriter cycling through car condition words */}
              <Typewriter
                text={CYCLING_WORDS}
                speed={80}
                deleteSpeed={40}
                delay={1800}
                loop={true}
                cursor=""
                className={cn(
                  "font-display",
                  "text-[42px] sm:text-[56px] lg:text-[72px]",
                  "bg-gradient-to-r from-[#00bbea] to-[#8eebff]",
                  "bg-clip-text text-transparent",
                )}
              /><span className="animate-pulse text-[#00bbea]">|</span>{" "}car.
            </h1>

            {/* Sub copy — hidden on mobile to keep layout clean */}
            <p className="hidden md:block text-base text-white/70 max-w-md">
              Stop guessing and start selling. Get an instant, guaranteed offer
              you can actually bank on in as little as 90 seconds.
            </p>

            <p className="hidden md:block text-[#00bbea] font-semibold text-sm">
              No haggling. No price drops. Just a smarter sale.
            </p>

            {/* Rating badges — desktop only */}
            <div className="hidden md:flex items-center gap-6 pt-1">
              {["Trustpilot", "Google"].map((name) => (
                <div key={name} className="text-center">
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="w-3.5 h-3.5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-base text-white/60">{name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: offer widget ── */}
          <div className="w-full lg:w-[400px] bg-white rounded-2xl overflow-hidden shadow-2xl">

            {/* Card header — bright accent cyan matching reference */}
            <div className="bg-[#00c6ef] px-6 py-5 text-center">
              <p className="text-xs font-bold text-[#002147] uppercase tracking-widest">
                Get an offer instantly
              </p>
              <h2 className="text-2xl font-display text-[#002147] mt-1">
                Start with your vehicle.
              </h2>
              <p className="text-xs text-[#002147]/70 mt-1">
                Enter the basics and continue into the guided condition flow.
              </p>
            </div>

            {/* Tabs — ZipCode / Plate or VIN */}
            <div className="flex">
              {(["zip", "vin"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-3 text-sm font-bold transition-colors",
                    activeTab === tab
                      ? "bg-[#002147] text-white"
                      : "bg-[#deeeff] text-[#002147]/70 hover:bg-[#c1f4ff]"
                  )}
                >
                  {tab === "zip" ? "ZipCode" : "Plate or VIN"}
                </button>
              ))}
            </div>

            {/* Form fields */}
            <div className="px-5 py-5 space-y-3">
              {activeTab === "zip" ? (
                <div className="border border-gray-200 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#00bbea] focus-within:border-[#00bbea] transition-all bg-white">
                  <p className="text-[10px] font-bold text-[#002147]/50 uppercase tracking-wider">ZIPCODE</p>
                  <input
                    type="text"
                    placeholder="Type the zipcode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full text-base text-[#07182d] outline-none bg-transparent mt-0.5 placeholder-[#002147]/40"
                  />
                </div>
              ) : (
                <div className="border border-gray-200 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#00bbea] focus-within:border-[#00bbea] transition-all bg-white">
                  <p className="text-[10px] font-bold text-[#002147]/50 uppercase tracking-wider">PLATE / VIN</p>
                  <input
                    type="text"
                    placeholder="e.g. 1HGBH41JXMN109186"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    className="w-full text-base text-[#07182d] outline-none bg-transparent mt-0.5 placeholder-[#002147]/40"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">17-char VIN or license plate number</p>
                </div>
              )}

              {/* Use my location — only shown on ZipCode tab */}
              {activeTab === "zip" && (
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(() => {
                        // placeholder — in production reverse-geocode to zip
                        setZipCode("(detecting…)");
                      });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold
                             text-[#002147] border border-[#002147]/20 rounded-lg py-2
                             hover:bg-[#002147]/5 transition-colors"
                >
                  <FontAwesomeIcon icon={faLocationCrosshairs} className="w-3.5 h-3.5" />
                  add my current location
                </button>
              )}

              <button
                onClick={() => onGetOffer(zipCode, vin, activeTab)}
                className="w-full bg-[#00bbea] hover:bg-[#00c6ef] text-white font-bold py-4 rounded-xl
                           flex items-center justify-center gap-2 transition-colors text-base"
              >
                Get an Offer Now
                <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
