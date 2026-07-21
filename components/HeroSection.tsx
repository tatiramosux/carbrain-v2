"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar, faCheck, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Typewriter } from "@/components/ui/typewriter-text";

import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface HeroSectionProps {
  onGetOffer: (params: {
    vin?: string;
    year?: string;
    make?: string;
    model?: string;
    tab?: "vin" | "ymm";
  }) => void;
}

const CYCLING_WORDS = ["damaged", "worn-out", "broken", "stalled", "wrecked"];

const YEARS = Array.from({ length: 37 }, (_, i) => String(2026 - i));

const VEHICLES_DATA: Record<string, string[]> = {
  Acura: ["MDX", "RDX", "TLX", "ILX", "TSX"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series"],
  Chevrolet: ["Silverado", "Equinox", "Malibu", "Cruze", "Tahoe", "Suburban", "Impala"],
  Dodge: ["Charger", "Challenger", "Durango", "Grand Caravan", "Journey"],
  Ford: ["F-150", "Escape", "Explorer", "Focus", "Fusion", "Mustang", "Edge"],
  GMC: ["Sierra 1500", "Yukon", "Acadia", "Terrain", "Canyon"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "Ridgeline", "Fit"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona"],
  Infiniti: ["Q50", "QX60", "QX80", "G37", "QX50"],
  Jeep: ["Grand Cherokee", "Wrangler", "Cherokee", "Compass", "Renegade"],
  Kia: ["Forte", "Optima", "Sorento", "Sportage", "Soul"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Discovery", "Evoque", "Defender"],
  Lexus: ["RX", "ES", "NX", "IS", "GX"],
  Lincoln: ["Navigator", "Aviator", "MKZ", "Continental", "Corsair"],
  Mazda: ["CX-5", "Mazda3", "Mazda6", "CX-9", "MX-5 Miata"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLE", "GLC"],
  Mini: ["Cooper", "Countryman", "Clubman"],
  Mitsubishi: ["Outlander", "Lancer", "Eclipse Cross", "Mirage"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Frontier", "Versa", "Murano"],
  Ram: ["1500", "2500", "3500"],
  Subaru: ["Outback", "Forester", "Impreza", "Crosstrek", "Legacy"],
  Toyota: ["Corolla", "Camry", "RAV4", "Highlander", "Tacoma", "Tundra", "Prius", "Sienna"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf"],
  Volvo: ["XC90", "XC60", "S60", "V60", "XC40"],
};

const MAKES = Object.keys(VEHICLES_DATA);

export default function HeroSection({ onGetOffer }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<"vin" | "ymm">("vin");
  const [vin, setVin] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [openDropdown, setOpenDropdown] = useState<"year" | "make" | "model" | null>(null);

  const [yearSearch, setYearSearch] = useState("");
  const [makeSearch, setMakeSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");

  // Sync inputs with selected states
  useEffect(() => {
    setYearSearch(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    setMakeSearch(selectedMake);
  }, [selectedMake]);

  useEffect(() => {
    setModelSearch(selectedModel);
  }, [selectedModel]);

  const handleBlur = (field: "year" | "make" | "model") => {
    setTimeout(() => {
      setOpenDropdown((current) => (current === field ? null : current));
      if (field === "year") {
        setYearSearch(selectedYear);
      } else if (field === "make") {
        setMakeSearch(selectedMake);
      } else if (field === "model") {
        setModelSearch(selectedModel);
      }
    }, 200);
  };

  const filteredYears = (yearSearch === selectedYear || !yearSearch)
    ? YEARS
    : YEARS.filter(y => y.includes(yearSearch));

  const filteredMakes = (makeSearch === selectedMake || !makeSearch)
    ? MAKES
    : MAKES.filter(m => m.toLowerCase().includes(makeSearch.toLowerCase()));

  const filteredModels = (modelSearch === selectedModel || !modelSearch)
    ? (selectedMake ? VEHICLES_DATA[selectedMake] : [])
    : (selectedMake ? VEHICLES_DATA[selectedMake].filter(m => m.toLowerCase().includes(modelSearch.toLowerCase())) : []);

  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);

  // Reset active option when dropdown changes
  useEffect(() => {
    setActiveOptionIndex(-1);
  }, [openDropdown]);

  // Scroll active option into view
  useEffect(() => {
    if (activeOptionIndex >= 0 && openDropdown) {
      const activeEl = document.getElementById(`${openDropdown}-opt-${activeOptionIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeOptionIndex, openDropdown]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "year" | "make" | "model",
    options: string[],
    onSelect: (val: string) => void
  ) => {
    if (!openDropdown) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setOpenDropdown(field);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveOptionIndex((prev) => (prev + 1 < options.length ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveOptionIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeOptionIndex >= 0 && activeOptionIndex < options.length) {
        onSelect(options[activeOptionIndex]);
        setOpenDropdown(null);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpenDropdown(null);
    }
  };


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".custom-dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel(""); // Reset model when make changes
  };

  const handleButtonClick = () => {
    onGetOffer({
      vin: activeTab === "vin" ? vin : "",
      year: activeTab === "ymm" ? selectedYear : "",
      make: activeTab === "ymm" ? selectedMake : "",
      model: activeTab === "ymm" ? selectedModel : "",
      tab: activeTab,
    });
  };

  return (
    <>
      <section className="relative bg-[#002147] overflow-hidden font-nunito">
        {/* Background glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#002147] via-[#2e5478]/40 to-[#002147] pointer-events-none" />
        <div className="hero-glow-cyan absolute top-0 right-[10%] w-[600px] h-[600px] pointer-events-none" />
        <div className="hero-glow-lime absolute bottom-0 left-[5%] w-[400px] h-[400px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[180px] pb-[140px]">
          <div className="flex flex-1 flex-col lg:flex-row items-center lg:items-center justify-center gap-8 lg:gap-16 min-h-[600px]">

            {/* ── Left: hero copy ── */}
            <div className="flex-1 flex flex-col justify-center space-y-5">
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
                />
                <span className="animate-pulse text-[#00bbea]">|</span> car.
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
            <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-2xl relative self-center">

              {/* Card header — white background matching reference design */}
              <div className="bg-white rounded-t-2xl px-6 py-6 text-center">
                <p className="text-[11px] font-bold text-[#002147]/80 uppercase tracking-widest">
                  Get an offer instantly
                </p>
                <h2 className="text-[26px] font-extrabold text-[#002147] mt-1.5 leading-tight">
                  Start with your vehicle.
                </h2>
                <p className="text-xs text-[#002147]/60 mt-1.5 leading-relaxed">
                  Enter the basics and continue into the guided condition flow.
                </p>
              </div>

              {/* Tabs — By VIN — fastest / Step by step */}
              <div className="mx-6 mt-2 px-[6px] h-[60px] rounded-full flex items-center bg-[#f5f5f6] shadow-sm">
                {(["vin", "ymm"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "flex-1 h-[48px] flex items-center justify-center px-3 text-xs sm:text-sm font-extrabold transition-all rounded-full text-center",
                      activeTab === tab
                        ? "bg-[#00bbea] text-[#002147] shadow-sm"
                        : "text-[#002147]/70 hover:text-[#002147]"
                    )}
                  >
                    {tab === "vin" ? "VIN" : "Year / Make / Model"}
                  </button>
                ))}
              </div>

              {/* Form fields */}
              <div className="px-6 py-6 space-y-4">
                {activeTab === "vin" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1 text-sm font-medium text-[#002147] mb-0.5">VIN <span className="text-red-500">*</span><FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5 text-gray-300 ml-1" /></label>
                      <div className={cn(
                        "h-[48px] border rounded-xl px-4 flex items-center transition-all bg-white",
                        vin.length > 0 && vin.length < 17 ? "border-[#DFDFE0] focus-within:ring-2 focus-within:ring-[#00bbea]" : "border-[#DFDFE0] focus-within:ring-2 focus-within:ring-[#00bbea]"
                      )}>
                        <input
                          type="text"
                          placeholder="Enter your 17-digit VIN"
                          maxLength={17}
                          value={vin}
                          onChange={(e) => {
                            // Mask: uppercase alphanumeric only
                            const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                            setVin(val);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleButtonClick();
                            }
                          }}
                          className="w-full text-sm font-medium text-[#002147] outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>
                    </div>
                    {vin.length > 0 && vin.length < 17 && (
                      <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                        <FontAwesomeIcon icon={faCircleInfo} className="w-3 h-3" />
                        VIN must be 17 characters
                      </p>
                    )}

                    {/* Inline VIN Helper Info Box (matching reference image) */}
                    <div className="bg-[#f0f6fa] rounded-2xl p-4 border border-[#e1eaf0] space-y-3 mt-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-[#002147]">Here&apos;s where to find your VIN:</span>
                        <span className="bg-white text-gray-700 font-mono text-xs font-semibold px-3 py-1 rounded-lg border border-[#e5e5e8]">
                          1XKTDB9X51J870436
                        </span>
                      </div>
                      <ul className="space-y-2 pt-0.5">
                        <li className="flex items-center gap-2.5 text-xs text-[#002147]/80 font-medium">
                          <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5 text-[#00bbea] flex-shrink-0" />
                          <span>Base of the windshield, driver&apos;s side.</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-xs text-[#002147]/80 font-medium">
                          <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5 text-[#00bbea] flex-shrink-0" />
                          <span>Inside the driver&apos;s side door jamb.</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-xs text-[#002147]/80 font-medium">
                          <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5 text-[#00bbea] flex-shrink-0" />
                          <span>On your insurance card and registration.</span>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {/* Year Dropdown */}
                    <div className="custom-dropdown relative w-full space-y-1.5">
                      <label className="flex items-center gap-1 text-sm font-medium text-[#002147] mb-0.5">Year <span className="text-red-500">*</span><FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5 text-gray-300 ml-1" /></label>
                      <div className="w-full h-[48px] flex items-center justify-between px-5 bg-white border border-[#DFDFE0] transition-all focus-within:ring-2 focus-within:ring-[#00bbea] rounded-xl">
                        <input
                          type="text"
                          value={yearSearch}
                          onChange={(e) => {
                            setYearSearch(e.target.value);
                            setOpenDropdown("year");
                          }}
                          onFocus={(e) => {
                            setOpenDropdown("year");
                            e.target.select();
                          }}
                          onBlur={() => handleBlur("year")}
                          onKeyDown={(e) => handleKeyDown(e, "year", filteredYears, (val) => setSelectedYear(val))}
                          placeholder="-- Select --"
                          className="w-full text-sm font-medium text-left text-[#002147] outline-none bg-transparent placeholder-[#002147]/40"
                        />
                        <svg
                          onClick={() => setOpenDropdown(openDropdown === "year" ? null : "year")}
                          className={cn("w-4 h-4 text-[#002147]/60 transition-transform duration-200 cursor-pointer", openDropdown === "year" ? "transform rotate-180" : "")}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {openDropdown === "year" && (
                        <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {filteredYears.length > 0 ? (
                            filteredYears.map((y, idx) => (
                              <button
                                key={y}
                                id={`year-opt-${idx}`}
                                type="button"
                                onMouseDown={() => {
                                  setSelectedYear(y);
                                  setOpenDropdown(null);
                                }}
                                className={cn(
                                  "w-full text-left px-5 py-2.5 text-sm text-[#002147] font-medium transition-colors border-b border-gray-50 last:border-b-0",
                                  idx === activeOptionIndex ? "bg-[#deeeff]" : "hover:bg-[#deeeff]"
                                )}
                              >
                                {y}
                              </button>
                            ))
                          ) : (
                            <div className="px-5 py-2.5 text-sm text-gray-400">No years found</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Make Dropdown */}
                    <div className="custom-dropdown relative w-full space-y-1.5">
                      <label className="flex items-center gap-1 text-sm font-medium text-[#002147] mb-0.5">Make <span className="text-red-500">*</span><FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5 text-gray-300 ml-1" /></label>
                      <div className="w-full h-[48px] flex items-center justify-between px-5 bg-white border border-[#DFDFE0] transition-all focus-within:ring-2 focus-within:ring-[#00bbea] rounded-xl">
                        <input
                          type="text"
                          value={makeSearch}
                          onChange={(e) => {
                            setMakeSearch(e.target.value);
                            setOpenDropdown("make");
                          }}
                          onFocus={(e) => {
                            setOpenDropdown("make");
                            e.target.select();
                          }}
                          onBlur={() => handleBlur("make")}
                          onKeyDown={(e) => handleKeyDown(e, "make", filteredMakes, (val) => handleMakeChange(val))}
                          placeholder="-- Select --"
                          className="w-full text-sm font-medium text-left text-[#002147] outline-none bg-transparent placeholder-[#002147]/40"
                        />
                        <svg
                          onClick={() => setOpenDropdown(openDropdown === "make" ? null : "make")}
                          className={cn("w-4 h-4 text-[#002147]/60 transition-transform duration-200 cursor-pointer", openDropdown === "make" ? "transform rotate-180" : "")}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {openDropdown === "make" && (
                        <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {filteredMakes.length > 0 ? (
                            filteredMakes.map((m, idx) => (
                              <button
                                key={m}
                                id={`make-opt-${idx}`}
                                type="button"
                                onMouseDown={() => {
                                  handleMakeChange(m);
                                  setOpenDropdown(null);
                                }}
                                className={cn(
                                  "w-full text-left px-5 py-2.5 text-sm text-[#002147] font-medium transition-colors border-b border-gray-50 last:border-b-0",
                                  idx === activeOptionIndex ? "bg-[#deeeff]" : "hover:bg-[#deeeff]"
                                )}
                              >
                                {m}
                              </button>
                            ))
                          ) : (
                            <div className="px-5 py-2.5 text-sm text-gray-400">No makes found</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Model Dropdown */}
                    <div className="custom-dropdown relative w-full space-y-1.5">
                      <label className="flex items-center gap-1 text-sm font-medium text-[#002147] mb-0.5">Model <span className="text-red-500">*</span><FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5 text-gray-300 ml-1" /></label>
                      <div className={cn(
                        "w-full h-[48px] flex items-center justify-between px-5 bg-white border border-[#DFDFE0] transition-all focus-within:ring-2 focus-within:ring-[#00bbea] rounded-xl",
                        !selectedMake && "opacity-50 cursor-not-allowed bg-gray-50"
                      )}>
                        <input
                          type="text"
                          value={modelSearch}
                          disabled={!selectedMake}
                          onChange={(e) => {
                            setModelSearch(e.target.value);
                            setOpenDropdown("model");
                          }}
                          onFocus={(e) => {
                            setOpenDropdown("model");
                            e.target.select();
                          }}
                          onBlur={() => handleBlur("model")}
                          onKeyDown={(e) => handleKeyDown(e, "model", filteredModels, (val) => setSelectedModel(val))}
                          placeholder="-- Select --"
                          className="w-full text-sm font-medium text-left text-[#002147] outline-none bg-transparent placeholder-[#002147]/40 disabled:cursor-not-allowed"
                        />
                        <svg
                          onClick={() => {
                            if (selectedMake) {
                              setOpenDropdown(openDropdown === "model" ? null : "model");
                            }
                          }}
                          className={cn("w-4 h-4 text-[#002147]/60 transition-transform duration-200 cursor-pointer", openDropdown === "model" ? "transform rotate-180" : "", !selectedMake && "cursor-not-allowed")}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {openDropdown === "model" && selectedMake && (
                        <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {filteredModels.length > 0 ? (
                            filteredModels.map((m, idx) => (
                              <button
                                key={m}
                                id={`model-opt-${idx}`}
                                type="button"
                                onMouseDown={() => {
                                  setSelectedModel(m);
                                  setOpenDropdown(null);
                                }}
                                className={cn(
                                  "w-full text-left px-5 py-2.5 text-sm text-[#002147] font-medium transition-colors border-b border-gray-50 last:border-b-0",
                                  idx === activeOptionIndex ? "bg-[#deeeff]" : "hover:bg-[#deeeff]"
                                )}
                              >
                                {m}
                              </button>
                            ))
                          ) : (
                            <div className="px-5 py-2.5 text-sm text-gray-400">No models found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Get and Offer CTA Button */}
                <button
                  onClick={handleButtonClick}
                  className="w-full bg-[#00bbea] hover:bg-[#0096bd] text-[#002147] font-extrabold py-4 rounded-full
                           flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
                >
                  Get an Offer
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
