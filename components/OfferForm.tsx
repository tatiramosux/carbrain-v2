"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
  faCheck,
  faRotate,
  faXmark,
  faCircleCheck,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "Vehicle" | "Ownership" | "Conditions" | "Get an Offer";

interface FormData {
  zipCode: string;
  vehicleEntry: "vin" | "ymm";
  vin: string;
  year: string;
  make: string;
  model: string;
  bodyStyle: string;
  trim: string;
  mileage: string;
  // ownership
  paidOff: boolean | null;
  title: "" | "clean" | "salvage" | "none";
  drivability: "" | "drives" | "starts" | "nostart";
  // conditions
  bodyDamage: boolean | null;
  floodDamage: boolean | null;
  fireDamage: boolean | null;
  bodyWork: string[];
  partsRemoved: boolean | null;
  catalyticConverter: boolean | null;
  mechanical: "" | "fine" | "minor" | "major";
  // contact
  email: string;
  phone: string;
  pickupType: "residential" | "business";
}

const INITIAL_FORM: FormData = {
  zipCode: "",
  vehicleEntry: "vin",
  vin: "",
  year: "",
  make: "",
  model: "",
  bodyStyle: "",
  trim: "",
  mileage: "",
  paidOff: null,
  title: "",
  drivability: "",
  bodyDamage: null,
  floodDamage: null,
  fireDamage: null,
  bodyWork: [],
  partsRemoved: null,
  catalyticConverter: null,
  mechanical: "",
  email: "",
  phone: "",
  pickupType: "residential",
};

// ─── Step definitions ─────────────────────────────────────────────────────────

type StepId =
  | "vehicle"
  | "bodyStyle"
  | "trim"
  | "mileage"
  | "paidOff"
  | "titleType"
  | "exterior"
  | "environmental"
  | "bodywork"
  | "generalParts"
  | "emissions"
  | "mechanical"
  | "contact"
  | "calculating"
  | "offer"
  | "accepted";


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

const STEPS: { id: StepId; section: Section }[] = [
  { id: "vehicle", section: "Vehicle" },
  { id: "trim", section: "Vehicle" },
  { id: "bodyStyle", section: "Vehicle" },
  { id: "mileage", section: "Vehicle" },
  { id: "paidOff", section: "Ownership" },
  { id: "titleType", section: "Ownership" },
  { id: "exterior", section: "Conditions" },
  { id: "environmental", section: "Conditions" },
  { id: "bodywork", section: "Conditions" },
  { id: "generalParts", section: "Conditions" },
  { id: "emissions", section: "Conditions" },
  { id: "mechanical", section: "Conditions" },
  { id: "contact", section: "Get an Offer" },
  { id: "calculating", section: "Get an Offer" },
  { id: "offer", section: "Get an Offer" },
  { id: "accepted", section: "Get an Offer" },
];

const SECTIONS: Section[] = ["Vehicle", "Ownership", "Conditions", "Get an Offer"];

interface SidebarSubItem {
  label: string;
  stepId: StepId;
}

interface SidebarSectionConfig {
  section: Section;
  items: SidebarSubItem[];
}

const SIDEBAR_SECTIONS: SidebarSectionConfig[] = [
  {
    section: "Vehicle",
    items: [
      { label: "Year, make & model", stepId: "vehicle" },
      { label: "Trim", stepId: "trim" },
      { label: "Body style", stepId: "bodyStyle" },
    ],
  },
  {
    section: "Ownership",
    items: [
      { label: "Paid off?", stepId: "paidOff" },
      { label: "Title type", stepId: "titleType" },
    ],
  },
  {
    section: "Conditions",
    items: [
      { label: "Mileage", stepId: "mileage" },
      { label: "Exterior damage", stepId: "exterior" },
      { label: "Environmental damage", stepId: "environmental" },
      { label: "Body work", stepId: "bodywork" },
      { label: "General parts", stepId: "generalParts" },
      { label: "Emissions", stepId: "emissions" },
      { label: "Mechanical", stepId: "mechanical" },
    ],
  },
  {
    section: "Get an Offer",
    items: [{ label: "Your offer", stepId: "contact" }],
  },
];

function getSectionStatus(
  section: Section,
  currentStepId: StepId
): "completed" | "active" | "pending" {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStepId);
  const sectionSteps = STEPS.filter((s) => s.section === section);
  const firstIdx = STEPS.findIndex((s) => s.section === section);
  const lastIdx = firstIdx + sectionSteps.length - 1;

  if (currentIdx > lastIdx) return "completed";
  if (currentIdx >= firstIdx) return "active";
  return "pending";
}

function getSectionNumber(section: Section): number {
  return SECTIONS.indexOf(section) + 1;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-1">
      {(["Yes", "No"] as const).map((opt) => {
        const isYes = opt === "Yes";
        const selected = value === isYes;
        return (
          <button
            key={opt}
            onClick={() => onChange(isYes)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded border transition-colors",
              selected
                ? "bg-[#00bbea]/10 border-[#00bbea] text-[#00bbea]"
                : "border-gray-200 text-gray-500 hover:border-gray-400"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface OfferFormProps {
  onClose: () => void;
  initialZip?: string;
  initialVin?: string;
  initialYear?: string;
  initialMake?: string;
  initialModel?: string;
  initialTab?: "vin" | "ymm";
}

export default function OfferForm({
  onClose,
  initialZip = "",
  initialVin = "",
  initialYear = "",
  initialMake = "",
  initialModel = "",
  initialTab = "vin",
}: OfferFormProps) {
  const isFastLane = Boolean(initialVin);
  const initialStepId = isFastLane ? "trim" : "vehicle";
  const initialIndex = Math.max(0, STEPS.findIndex(s => s.id === initialStepId));
  
  const [stepIndex, setStepIndex] = useState(initialIndex);
  const [form, setForm] = useState<FormData>({
    ...INITIAL_FORM,
    zipCode: initialZip,
    vin: initialVin,
    year: initialVin ? "2021" : initialYear,
    make: initialVin ? "Chevrolet" : initialMake,
    model: initialVin ? "Cruze" : initialModel,
    vehicleEntry: initialVin
      ? "vin"
      : (initialYear || initialMake || initialModel)
      ? "ymm"
      : (initialTab === "ymm" ? "ymm" : "vin"),
  });
  const [trimDropdownOpen, setTrimDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"year" | "make" | "model" | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<Section, boolean>>({
    Vehicle: true,
    Ownership: false,
    Conditions: false,
    "Get an Offer": false,
  });

  const currentStep = STEPS[stepIndex];
  const [calcStage, setCalcStage] = useState(1);
  const [mileageWarning, setMileageWarning] = useState<'greater' | 'lower' | null>(null);
  const [mileageConfirmed, setMileageConfirmed] = useState(false);

  useEffect(() => {
    if (currentStep.id === "calculating") {
      setCalcStage(1);
      const timers = [
        setTimeout(() => setCalcStage(2), 800),
        setTimeout(() => setCalcStage(3), 1600),
        setTimeout(() => setCalcStage(4), 2400),
        setTimeout(() => {
          setCalcStage(5);
          setTimeout(() => setStepIndex(STEPS.findIndex(s => s.id === "offer")), 500);
        }, 3200),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [currentStep.id]);

  function toggleSection(sec: Section) {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  }

  const update = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => {
      const nextForm = { ...prev, [field]: value };
      if (field === 'year' || field === 'make' || field === 'model') {
        nextForm.vin = '';
      }
      return nextForm;
    });
  };

  const fulfilledVehicleSummary = (() => {
    if (form.year || form.make || form.model) {
      const parts = [form.year, form.make, form.model].filter(Boolean).join(" ");
      return parts + (form.trim ? " · " + form.trim : "");
    }
    if (form.vin) {
      return `VIN: ${form.vin}`;
    }
    return null;
  })();

  // ── Sidebar ──────────────────────────────────────────────────────────────────

  const sidebar = (
    <aside className="hidden md:flex w-72 flex-shrink-0 bg-[#f7fafc] border-r border-[#e1eaf0] flex-col font-nunito overflow-hidden">
      {/* Fixed header */}
      <div className="px-5 pt-5 pb-3 flex-shrink-0">
        <h2 className="text-base font-black text-[#002147] mb-1">
          Get an Instant Offer
        </h2>
        <p className="text-xs text-gray-500">
          Progress is saved automatically. Click any question to navigate directly.
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Fulfilled Information Storage Box — Read-Only */}
        {fulfilledVehicleSummary && (
          <div className="bg-[#f4f6f8] border border-[#d8dee6] rounded-2xl p-4 mb-4">
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#d0d7df] mb-3">
              <FontAwesomeIcon icon={faCar} className="w-5 h-5 text-[#1e2f42]" />
              <div className="text-[11px] font-bold text-[#4a5c70] uppercase tracking-[0.15em] pt-0.5">
                Your Vehicle
              </div>
            </div>
            
            {/* Details */}
            <div className="text-[15px] font-extrabold text-[#002147] mb-2 leading-tight">
              {fulfilledVehicleSummary}
            </div>
            
            {form.title && (
              <div className="text-xs font-semibold text-[#5a6a7c] flex items-center gap-1.5 mb-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                <span className="capitalize">{form.title} Title</span>
              </div>
            )}
            
            {form.mileage && (
              <div className="text-xs font-medium text-[#5a6a7c]">
                {Number(form.mileage).toLocaleString()} miles
              </div>
            )}
          </div>
        )}

        {/* Section Accordions */}
        <div className="space-y-1">
          {SIDEBAR_SECTIONS.map(({ section, items }) => {
            const sectionStatus = getSectionStatus(section, currentStep.id);
            const isCurrentSection = sectionStatus === "active";
            const isCompletedSection = sectionStatus === "completed";
            // Auto-collapse completed sections; expand active/pending
            const isExpanded = expandedSections[section];

            return (
              <div key={section}>
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-2xl flex items-center justify-between font-black text-sm transition-all text-left",
                    isCurrentSection
                      ? "bg-[#e3f4fc] text-[#00bbea] shadow-xs"
                      : isCompletedSection
                      ? "text-[#6b7a8d] hover:bg-gray-100/60"
                      : "text-[#002147]/50 hover:text-[#002147]/70 hover:bg-gray-100/60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {/* Section status indicator */}
                    {isCompletedSection ? (
                      <svg className="w-3.5 h-3.5 text-[#00bbea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className={cn(
                        "w-3.5 h-3.5 rounded-full border-2 flex-shrink-0",
                        isCurrentSection ? "border-[#00bbea]" : "border-gray-300"
                      )} />
                    )}
                    <span>{section}</span>
                  </div>
                  <FontAwesomeIcon
                    icon={isExpanded ? faChevronUp : faChevronDown}
                    className={cn("w-3 h-3", isCurrentSection ? "text-[#00bbea]" : "text-gray-400")}
                  />
                </button>

                {/* Sub-item List */}
                {isExpanded && (
                  <div className="pl-5 pr-2 pb-1 mt-0.5 space-y-0.5">
                    {items.map((sub, idx) => {
                      const isSubActive = currentStep.id === sub.stepId;
                      const subStepIdx = STEPS.findIndex((s) => s.id === sub.stepId);
                      const currentIdx = STEPS.findIndex((s) => s.id === currentStep.id);
                      const isCompleted = subStepIdx < currentIdx;

                      return (
                        <div
                          key={`${sub.label}-${idx}`}
                          onClick={() => setStepIndex(subStepIdx)}
                          className={cn(
                            "flex items-center gap-2.5 py-1.5 px-2 rounded-lg cursor-pointer transition-all",
                            isSubActive
                              ? "bg-[#e3f4fc]"
                              : isCompleted
                              ? "hover:bg-gray-100/60"
                              : "hover:bg-gray-100/40"
                          )}
                        >
                          {/* Circle indicator — no radio feel, just a clean dot */}
                          <div className={cn(
                            "w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                            isSubActive
                              ? "border-[#00bbea] bg-[#00bbea]"
                              : isCompleted
                              ? "border-[#00bbea] bg-white"
                              : "border-gray-200 bg-white"
                          )}>
                            {isCompleted && (
                              <svg className="w-2 h-2" fill="none" stroke="#00bbea" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={cn(
                            "text-xs",
                            isSubActive
                              ? "font-black text-[#002147]"
                              : isCompleted
                              ? "font-semibold text-[#6b7a8d]"
                              : "font-medium text-gray-400"
                          )}>
                            {sub.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );

  // ── Top step indicator ────────────────────────────────────────────────────────

  const topSections: { label: string; num: number; status: "done" | "active" | "pending" }[] = [
    { label: "Vehicle",     num: 1, status: getSectionStatus("Vehicle",      currentStep.id) === "completed" ? "done" : getSectionStatus("Vehicle",      currentStep.id) === "active" ? "active" : "pending" },
    { label: "Ownership",   num: 2, status: getSectionStatus("Ownership",    currentStep.id) === "completed" ? "done" : getSectionStatus("Ownership",    currentStep.id) === "active" ? "active" : "pending" },
    { label: "Condition",   num: 3, status: getSectionStatus("Conditions",   currentStep.id) === "completed" ? "done" : getSectionStatus("Conditions",   currentStep.id) === "active" ? "active" : "pending" },
    { label: "Get An Offer",num: 4, status: getSectionStatus("Get an Offer", currentStep.id) === "completed" ? "done" : getSectionStatus("Get an Offer", currentStep.id) === "active" ? "active" : "pending" },
  ];

  const stepIndicator = (
    <div className="border-b border-gray-100">
      {/* ── Desktop stepper: number + label side by side ── */}
      <div className="hidden md:flex items-center gap-2 px-8 py-5">
        {topSections.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0",
              s.status !== "pending" ? "bg-[#00bbea] text-white" : "bg-gray-100 text-gray-400"
            )}>
              {s.num}
            </div>
            <span className={cn(
              "text-sm font-black whitespace-nowrap",
              s.status === "active" ? "text-[#002147]" : "text-gray-400"
            )}>
              {s.label}
            </span>
            {i < topSections.length - 1 && (
              <div className={cn(
                "h-0.5 w-10 flex-shrink-0",
                s.status === "done" ? "bg-[#00bbea]" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* ── Mobile stepper: number on top, label below ── */}
      <div className="flex md:hidden items-start justify-between px-4 py-4">
        {topSections.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1">
            {/* Step item */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0",
                s.status !== "pending" ? "bg-[#00bbea] text-white" : "bg-gray-100 text-gray-400"
              )}>
                {s.num}
              </div>
              <span className={cn(
                "text-[10px] font-black text-center leading-tight",
                s.status === "active" ? "text-[#002147]" : "text-gray-400"
              )}>
                {s.label}
              </span>
            </div>
            {/* Connector line — not after last item */}
            {i < topSections.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-1 mt-[-10px]",
                s.status === "done" ? "bg-[#00bbea]" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Step content ──────────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep.id) {

      // ---- Step 2: Vehicle ----------------------------------------------------
      case "vehicle":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Select Your Vehicle
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    { key: "year", placeholder: "Year" },
                    { key: "make", placeholder: "Make" },
                    { key: "model", placeholder: "Model" },
                  ] as { key: keyof FormData; placeholder: string }[]
                ).map(({ key, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="block text-xs font-black text-[#002147] tracking-tight">
                      {placeholder}
                    </label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={form[key] as string}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full h-[48px] border border-gray-300 rounded-full px-4 text-sm font-bold text-[#002147] focus:outline-none focus:ring-2 focus:ring-[#00bbea] placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <button className="text-[13px] text-[#00bbea] hover:text-[#0096bd] font-semibold transition-colors underline-offset-4 hover:underline">
                Can't find your vehicle? Click here
              </button>
            </div>
          </div>
        );

      // ---- Step 2b: Body Style (Scenic Route) --------------------------------
      case "bodyStyle":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Select Your Car&apos;s Body Style
              </h3>
              
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                "Sedan",
                "SUV / Crossover",
                "Coupe",
                "Truck / Pickup",
                "Convertible",
                "Hatchback",
                "Wagon",
                "Van / Minivan",
              ].map((style) => (
                <button
                  key={style}
                  onClick={() => update("bodyStyle", style)}
                  className={cn(
                    "p-4 rounded-xl border font-extrabold text-sm transition-all text-center flex flex-col items-center justify-center gap-1",
                    form.bodyStyle === style
                      ? "border-[#00bbea] bg-[#00bbea]/10 text-[#002147] ring-2 ring-[#00bbea]"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span>{style}</span>
                </button>
              ))}
            </div>
            
            <div className="pt-2">
              <button className="text-[13px] text-[#00bbea] hover:text-[#0096bd] font-semibold transition-colors underline-offset-4 hover:underline">
                Can't find your vehicle? Click here
              </button>
            </div>
          </div>
        );

      // ---- Step 2c: Trim (Scenic Route) --------------------------------------
      case "trim":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Select Your Car&apos;s Trim
              </h3>
              
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-[#002147] tracking-tight">
                Trim
              </label>
              <div className="relative">
                <div
                  onClick={() => setTrimDropdownOpen(!trimDropdownOpen)}
                  className="w-full h-[48px] border border-gray-300 rounded-full px-4 pr-10 flex items-center justify-between text-sm font-bold text-[#002147] cursor-pointer bg-white"
                >
                  <span className={form.trim ? "text-[#002147]" : "text-gray-400 font-medium"}>
                    {form.trim || "- Select -"}
                  </span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${trimDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {trimDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                    <ul className="py-2">
                      {["Base", "LE", "SE", "XLE", "Sport", "Limited", "LX", "EX", "Touring"].map((opt) => (
                        <li key={opt}>
                          <button
                            type="button"
                            onMouseDown={() => { update("trim", opt); setTrimDropdownOpen(false); }}
                            className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm font-semibold text-[#002147] transition-colors"
                          >
                            {opt}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-2">
              <button className="text-[13px] text-[#00bbea] hover:text-[#0096bd] font-semibold transition-colors underline-offset-4 hover:underline">
                Can't find your vehicle? Click here
              </button>
            </div>
          </div>
        );

      // ---- Step 2d: Mileage / Tell Us More (Scenic Route) ---------------------
      case "mileage":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Tell Us More
              </h3>
              
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-[#002147] tracking-tight">
                Mileage
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="87,400"
                  value={form.mileage}
                  onChange={(e) => { update("mileage", e.target.value); setMileageConfirmed(false); }}
                  className="flex-1 h-[48px] border border-gray-300 rounded-full px-4 text-sm font-bold text-[#002147] focus:outline-none focus:ring-2 focus:ring-[#00bbea] placeholder-gray-400"
                />
                <span className="text-sm font-bold text-[#002147]">miles</span>
              </div>
            </div>
            
          </div>
        );

      // ---- Step 4: Ownership --------------------------------------------------
      // ---- Step 4a: Paid Off ---------------------------------------------------
      case "paidOff":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black text-[#002147] uppercase tracking-widest mb-1">
                Ownership
              </p>
              <h3 className="text-2xl font-display text-[#002147]">
                Is your car paid off?
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { value: true, label: "Yes — it's paid off", desc: "I own it free and clear" },
                { value: false, label: "No — I still owe money", desc: "There is a lien or loan on it" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => update("paidOff", opt.value)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                    form.paidOff === opt.value
                      ? "border-[#00bbea] bg-[#00bbea]/5 ring-1 ring-[#00bbea]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
                    form.paidOff === opt.value ? "border-[#00bbea] bg-[#00bbea]" : "border-gray-300"
                  )} />
                  <div>
                    <p className="text-sm font-semibold text-[#002147]">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      // ---- Step 4b: Title Type -------------------------------------------------
      case "titleType":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black text-[#002147] uppercase tracking-widest mb-1">
                Ownership
              </p>
              <h3 className="text-2xl font-display text-[#002147]">
                What kind of title do you have?
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { value: "clean", label: "Clean title", desc: "No accidents or major issues on record" },
                { value: "salvage", label: "Salvage / rebuilt title", desc: "Vehicle was declared a total loss at some point" },
                { value: "none", label: "No title", desc: "I don't have a title for this vehicle" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("title", opt.value as any)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                    form.title === opt.value
                      ? "border-[#00bbea] bg-[#00bbea]/5 ring-1 ring-[#00bbea]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
                    form.title === opt.value ? "border-[#00bbea] bg-[#00bbea]" : "border-gray-300"
                  )} />
                  <div>
                    <p className="text-sm font-semibold text-[#002147]">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      // ---- Step 5a: Exterior Damage --------------------------------------------
      case "exterior":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black text-[#002147] uppercase tracking-widest mb-1">
                Conditions
              </p>
              <h3 className="text-2xl font-display text-[#002147]">
                Any exterior damage?
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { value: true, label: "Yes — there is body damage", desc: "Dents, scratches, cracks, or bent panels" },
                { value: false, label: "No — exterior looks fine", desc: "No visible body damage" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => update("bodyDamage", opt.value)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                    form.bodyDamage === opt.value
                      ? "border-[#00bbea] bg-[#00bbea]/5 ring-1 ring-[#00bbea]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
                    form.bodyDamage === opt.value ? "border-[#00bbea] bg-[#00bbea]" : "border-gray-300"
                  )} />
                  <div>
                    <p className="text-sm font-semibold text-[#002147]">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      // ---- Step 5b: Environmental Damage --------------------------------------
      case "environmental":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black text-[#002147] uppercase tracking-widest mb-1">
                Conditions
              </p>
              <h3 className="text-2xl font-display text-[#002147]">
                Any environmental damage?
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-[#002147] tracking-tight">Flood damage?</label>
                <div className="space-y-2">
                  {[
                    { value: true, label: "Yes — flood damaged" },
                    { value: false, label: "No flood damage" },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => update("floodDamage", opt.value)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                        form.floodDamage === opt.value
                          ? "border-[#00bbea] bg-[#00bbea]/5 ring-1 ring-[#00bbea]"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0",
                        form.floodDamage === opt.value ? "border-[#00bbea] bg-[#00bbea]" : "border-gray-300"
                      )} />
                      <span className="text-sm font-semibold text-[#002147]">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-[#002147] tracking-tight">Fire damage?</label>
                <div className="space-y-2">
                  {[
                    { value: true, label: "Yes — fire damaged" },
                    { value: false, label: "No fire damage" },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => update("fireDamage", opt.value)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                        form.fireDamage === opt.value
                          ? "border-[#00bbea] bg-[#00bbea]/5 ring-1 ring-[#00bbea]"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0",
                        form.fireDamage === opt.value ? "border-[#00bbea] bg-[#00bbea]" : "border-gray-300"
                      )} />
                      <span className="text-sm font-semibold text-[#002147]">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      // ---- Step 6: Body work --------------------------------------------------
      case "bodywork":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                What work does your car need?
              </h3>
              
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Dents",
                "Paint damage",
                "Bumper",
                "Frame / structural",
                "Collision damage",
                "Glass / windshield",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    const next = form.bodyWork.includes(item)
                      ? form.bodyWork.filter((w) => w !== item)
                      : [...form.bodyWork, item];
                    update("bodyWork", next);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                    form.bodyWork.includes(item)
                      ? "border-[#00bbea] bg-[#00bbea]/10 text-[#00bbea]"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            {form.bodyWork.includes("Collision damage") && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                Heavy collision damage triggers a manual review — your offer
                will still be generated.
              </div>
            )}
          </div>
        );

      // ---- Step 7a: General Parts ---------------------------------------------
      case "generalParts":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black text-[#002147] uppercase tracking-widest mb-1">
                Parts
              </p>
              <h3 className="text-2xl font-display text-[#002147]">
                Any parts removed or missing?
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { value: true, label: "Yes — parts are missing", desc: "Some parts have been removed or are no longer on the vehicle" },
                { value: false, label: "No — all parts are intact", desc: "Nothing has been removed from the vehicle" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => update("partsRemoved", opt.value)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                    form.partsRemoved === opt.value
                      ? "border-[#00bbea] bg-[#00bbea]/5 ring-1 ring-[#00bbea]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
                    form.partsRemoved === opt.value ? "border-[#00bbea] bg-[#00bbea]" : "border-gray-300"
                  )} />
                  <div>
                    <p className="text-sm font-semibold text-[#002147]">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      // ---- Step 7b: Emissions --------------------------------------------------
      case "emissions":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black text-[#002147] uppercase tracking-widest mb-1">
                Emissions
              </p>
              <h3 className="text-2xl font-display text-[#002147]">
                Catalytic converter status?
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { value: true, label: "Yes — removed or replaced", desc: "The catalytic converter is not original or is missing" },
                { value: false, label: "No — still original", desc: "The original catalytic converter is intact" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => update("catalyticConverter", opt.value)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                    form.catalyticConverter === opt.value
                      ? "border-[#00bbea] bg-[#00bbea]/5 ring-1 ring-[#00bbea]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
                    form.catalyticConverter === opt.value ? "border-[#00bbea] bg-[#00bbea]" : "border-gray-300"
                  )} />
                  <div>
                    <p className="text-sm font-semibold text-[#002147]">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      // ---- Step 8: Mechanical -------------------------------------------------
      case "mechanical":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Any mechanical issues?
              </h3>
              
            </div>

            <div className="space-y-2">
              {[
                {
                  value: "fine",
                  label: "Runs fine",
                  sub: "No known mechanical issues",
                },
                {
                  value: "minor",
                  label: "Minor issues",
                  sub: "Warning lights, minor repairs needed",
                },
                {
                  value: "major",
                  label: "Major issues",
                  sub: "Engine, transmission, or won't run",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors",
                    form.mechanical === opt.value
                      ? "border-[#00bbea] bg-[#00bbea]/5"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0",
                      form.mechanical === opt.value
                        ? "border-[#00bbea] bg-[#00bbea]"
                        : "border-gray-300"
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500">{opt.sub}</p>
                  </div>
                  <input
                    type="radio"
                    className="sr-only"
                    checked={form.mechanical === opt.value}
                    onChange={() => update("mechanical", opt.value as any)}
                  />
                </label>
              ))}
            </div>
          </div>
        );

      // ---- Step 9: Contact ----------------------------------------------------
      case "contact":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Almost there — last details
              </h3>
              
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                CONTACT
              </p>
              <div className="space-y-3">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-[#002147] tracking-tight">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your zip code (e.g. 30318)"
                    value={form.zipCode}
                    onChange={(e) => update("zipCode", e.target.value)}
                    className="w-full h-[48px] border border-gray-300 rounded-full px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bbea] placeholder-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-[#002147] tracking-tight">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full h-[48px] border border-gray-300 rounded-full px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bbea] placeholder-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-[#002147] tracking-tight">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full h-[48px] border border-gray-300 rounded-full px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bbea] placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                PICKUP LOCATION
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "residential",
                    label: "Residential",
                    sub: "Home or private driveway",
                  },
                  {
                    value: "business",
                    label: "Business",
                    sub: "Commercial address or lot",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors",
                      form.pickupType === opt.value
                        ? "border-[#00bbea] bg-[#00bbea]/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5",
                        form.pickupType === opt.value
                          ? "border-[#00bbea] bg-[#00bbea]"
                          : "border-gray-300"
                      )}
                    />
                    <div>
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          form.pickupType === opt.value
                            ? "text-[#00bbea]"
                            : "text-gray-700"
                        )}
                      >
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-500">{opt.sub}</p>
                    </div>
                    <input
                      type="radio"
                      className="sr-only"
                      checked={form.pickupType === opt.value}
                      onChange={() =>
                        update("pickupType", opt.value as any)
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      // ---- Step 10: Calculating -----------------------------------------------
      case "calculating":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Calculating your offer
              </h3>
              
            </div>

            <div className="space-y-4">
              {[
                "Vehicle verified",
                "Condition assessed",
                "Matching local buyers",
                "Pricing your offer",
              ].map((label, i) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-2.5 h-2.5 rounded-full flex-shrink-0",
                        calcStage > i
                          ? "bg-[#00bbea]"
                          : "bg-gray-300"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        calcStage > i ? "text-[#002147]" : "text-gray-400"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center">
                    {calcStage > i + 1 ? (
                      <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5 text-[#00bbea]" />
                    ) : calcStage === i + 1 ? (
                      <FontAwesomeIcon icon={faRotate} className="w-4 h-4 text-[#00bbea] animate-spin" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400">
              Most offers ready in under 30 seconds.
            </p>
          </div>
        );

      // ---- Step 11: Offer ready -----------------------------------------------
      case "offer":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Your offer is ready
              </h3>
              
            </div>

            <div className="border-l-4 border-[#00bbea] bg-blue-50 rounded-r-xl p-5">
              <p className="text-xs font-semibold text-[#00bbea] uppercase tracking-wider mb-2">
                YOUR OFFER
              </p>
              <p className="text-5xl font-extrabold text-[#002147]">$4,250</p>
              <p className="text-xs text-gray-500 mt-2">
                Valid for 7 days · Free pickup included
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              {[
                {
                  label: "Vehicle",
                  value:
                    fulfilledVehicleSummary ||
                    `${form.year || "2013"} ${form.make || "Chevrolet"} ${form.model || "Cruze"} · ${form.trim || "LT"}`,
                },
                {
                  label: "Mileage",
                  value: form.mileage
                    ? `${parseInt(form.mileage).toLocaleString()} miles`
                    : "87,400 miles",
                },
                {
                  label: "Pickup location",
                  value: form.zipCode
                    ? `${form.zipCode}`
                    : "Atlanta, GA 30318",
                },
                { label: "Payment method", value: "Check at pickup" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-[#00bbea] font-medium">
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-[#002147]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      // ---- Step 12: Accepted --------------------------------------------------
      case "accepted":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Offer accepted!
              </h3>
              
            </div>

            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center">
                <FontAwesomeIcon icon={faCheck} className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                WHAT HAPPENS NEXT
              </p>
              <div className="space-y-2">
                {[
                  {
                    n: 1,
                    title: "We call to schedule pickup",
                    sub: "Usually within 2 hours",
                  },
                  {
                    n: 2,
                    title: "Driver picks up your car",
                    sub: "Free tow, same or next day",
                  },
                  {
                    n: 3,
                    title: "You get paid",
                    sub: "Check handed to you at pickup",
                  },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl"
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                      {step.n}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#002147]">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  const proceedToNextStep = () => {
    if (stepIndex < STEPS.length - 1) {
      const nextStepIndex = stepIndex + 1;
      const currentSection = STEPS[stepIndex].section;
      const nextSection = STEPS[nextStepIndex].section;
      // When moving into a new section, collapse the old one and expand the new
      if (currentSection !== nextSection) {
        setExpandedSections((prev) => ({
          ...prev,
          [currentSection]: false,
          [nextSection]: true,
        }));
      }
      setStepIndex(nextStepIndex);
    }
  };

  const next = () => {
    if (currentStep.id === "mileage" && form.mileage && !mileageConfirmed) {
      const year = parseInt(form.year || "2012");
      const currentYear = new Date().getFullYear();
      const age = Math.max(1, currentYear - year);
      const val = parseInt(form.mileage.replace(/,/g, ""));
      if (val < age * 5000) {
        setMileageWarning("lower");
        return;
      }
      if (val > age * 25000) {
        setMileageWarning("greater");
        return;
      }
    }
    setMileageWarning(null);
    proceedToNextStep();
  };

  const back = () => {
    if (stepIndex > 0) {
      const prevStepIndex = stepIndex - 1;
      const currentSection = STEPS[stepIndex].section;
      const prevSection = STEPS[prevStepIndex].section;
      // When going back into a previous section, expand it
      if (currentSection !== prevSection) {
        setExpandedSections((prev) => ({
          ...prev,
          [prevSection]: true,
        }));
      }
      setStepIndex(prevStepIndex);
    }
  };

  const showNav =
    currentStep.id !== "calculating" && currentStep.id !== "accepted" && currentStep.id !== "offer";

  return (
    <section className="flex-1 bg-[#002147] relative overflow-hidden font-nunito">
      {/* Background glows — match hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002147] via-[#2e5478]/30 to-[#002147] pointer-events-none" />
      <div className="hero-glow-cyan absolute top-0 right-[10%] w-[500px] h-[500px] pointer-events-none" />

      <div className="relative max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-10">
        {/* Back to home link */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
          Back to home
        </button>

        {/* White card: sidebar + content */}
        <div className="bg-white rounded-2xl shadow-2xl w-full flex overflow-hidden h-[650px] font-nunito">

        {/* Sidebar */}
        {sidebar}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Step indicator */}
          {currentStep.id !== "accepted" && stepIndicator}

          {/* Step body */}
          <div className="flex-1 px-8 py-8 overflow-y-auto">
            {renderStep()}
          </div>

          {/* Navigation */}
          {showNav && (
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between gap-3">
              {/* Restart button — left side */}
              <button
                onClick={() => {
                  setStepIndex(0);
                  setForm(INITIAL_FORM);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium border border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors bg-white"
              >
                <FontAwesomeIcon icon={faRotate} className="w-3.5 h-3.5" />
                Restart
              </button>

              {/* Back + Next — right side */}
              <div className="flex items-center gap-3">
                <button
                  onClick={back}
                  disabled={stepIndex === 0}
                  className={cn(
                    "flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors",
                    stepIndex === 0
                      ? "border-[#b3ebf9] text-[#b3ebf9] cursor-not-allowed"
                      : "border-[#00bbea] text-[#00bbea] hover:border-[#0096bd] hover:text-[#0096bd]"
                  )}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={next}
                  className="flex items-center gap-1.5 bg-[#00bbea] hover:bg-[#0096bd] text-[#002147] px-5 py-2.5 rounded-full text-sm font-extrabold transition-colors"
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Accept offer button on offer screen */}
          {currentStep.id === "offer" && (
            <div className="px-8 pb-6">
              <button
                onClick={() =>
                  setStepIndex(STEPS.findIndex((s) => s.id === "accepted"))
                }
                className="w-full bg-[#00bbea] hover:bg-[#0096bd] text-white font-semibold py-4 rounded-full text-base transition-colors"
              >
                Accept Offer → Schedule Pickup
              </button>
            </div>
          )}
        </div>
        </div>{/* end white card */}
        
        {/* Spanish language toggle */}
        <div className="mt-6 flex justify-center">
          <button className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors">
            <span className="text-sm rounded overflow-hidden leading-none pt-0.5">🇪🇸</span>
            <span>Continúa en español</span>
          </button>
        </div>
      </div>{/* end max-w container */}
      {/* Mileage Warning Modal */}
      {mileageWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002147]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden font-nunito animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#e1eaf0] flex items-center justify-between">
              <h3 className="text-[22px] font-extrabold text-[#002147]">Please confirm your car mileage</h3>
              <button 
                onClick={() => setMileageWarning(null)} 
                className="w-8 h-8 flex items-center justify-center bg-[#f0f4f8] text-[#6b7a8d] rounded-full hover:bg-[#e1eaf0] hover:text-[#002147] transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-8 text-center text-[#4a5c70] text-[16px] leading-relaxed">
              We noticed your car <span className="font-extrabold text-[#002147]">{Number(form.mileage.replace(/,/g, '')).toLocaleString()}</span> mileage is <span className="font-extrabold text-[#002147]">{mileageWarning}</span> than an average car from <span className="font-extrabold text-[#002147]">{form.year || "2012"}</span>. Are you sure the mileage on your car is: <span className="font-extrabold text-[#002147]">{Number(form.mileage.replace(/,/g, '')).toLocaleString()}</span>?
            </div>
            
            {/* Footer Buttons */}
            <div className="px-8 pb-8 flex items-center justify-center gap-4">
              <button 
                onClick={() => setMileageWarning(null)} 
                className="bg-white border-2 border-[#00bbea] text-[#00bbea] font-extrabold px-10 py-3 rounded-full hover:bg-[#f0fcff] transition-all"
              >
                No
              </button>
              <button 
                onClick={() => { 
                  setMileageWarning(null); 
                  setMileageConfirmed(true); 
                  proceedToNextStep();
                }} 
                className="bg-[#00bbea] hover:bg-[#0096bd] text-[#002147] font-extrabold px-10 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
