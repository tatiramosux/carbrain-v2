"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faCheck,
  faRotate,
  faXmark,
  faCircleCheck,
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
  trim: string;
  mileage: string;
  // ownership
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
  trim: "",
  mileage: "",
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
  | "zip"
  | "vehicle"
  | "mileage"
  | "ownership"
  | "damage"
  | "bodywork"
  | "parts"
  | "mechanical"
  | "contact"
  | "calculating"
  | "offer"
  | "accepted";

const STEPS: { id: StepId; section: Section }[] = [
  { id: "zip", section: "Vehicle" },
  { id: "vehicle", section: "Vehicle" },
  { id: "mileage", section: "Vehicle" },
  { id: "ownership", section: "Ownership" },
  { id: "damage", section: "Conditions" },
  { id: "bodywork", section: "Conditions" },
  { id: "parts", section: "Conditions" },
  { id: "mechanical", section: "Conditions" },
  { id: "contact", section: "Get an Offer" },
  { id: "calculating", section: "Get an Offer" },
  { id: "offer", section: "Get an Offer" },
  { id: "accepted", section: "Get an Offer" },
];

const SECTIONS: Section[] = ["Vehicle", "Ownership", "Conditions", "Get an Offer"];

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
  initialTab?: "zip" | "vin";
}

export default function OfferForm({ onClose, initialZip = "", initialVin = "", initialTab = "zip" }: OfferFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormData>({
    ...INITIAL_FORM,
    zipCode: initialZip,
    vin: initialVin,
    // If user came from VIN tab, pre-select VIN entry in the vehicle step
    vehicleEntry: initialVin ? "vin" : "ymm",
  });
  const [calculating, setCalculating] = useState(false);
  const [calcStage, setCalcStage] = useState(0);

  const currentStep = STEPS[stepIndex];

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (currentStep.id === "damage" && form.bodyDamage === false) {
      // skip bodywork step
      setStepIndex((i) =>
        STEPS.findIndex((s) => s.id === "parts")
      );
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function back() {
    if (currentStep.id === "parts" && form.bodyDamage === false) {
      // skip back over bodywork
      setStepIndex(STEPS.findIndex((s) => s.id === "damage"));
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function goToStep(id: StepId) {
    const idx = STEPS.findIndex((s) => s.id === id);
    if (idx !== -1) setStepIndex(idx);
  }

  // Auto-advance from calculating
  useEffect(() => {
    if (currentStep.id === "calculating") {
      let stage = 0;
      const timer = setInterval(() => {
        stage += 1;
        setCalcStage(stage);
        if (stage >= 4) {
          clearInterval(timer);
          setTimeout(() => {
            setStepIndex(STEPS.findIndex((s) => s.id === "offer"));
          }, 500);
        }
      }, 800);
      return () => clearInterval(timer);
    }
  }, [currentStep.id]);

  const vehicleLabel = (() => {
    if (form.year && form.make && form.model) {
      return `${form.year} ${form.make} ${form.model}${form.trim ? " · " + form.trim : ""}`;
    }
    return null;
  })();

  // ── Sidebar ──────────────────────────────────────────────────────────────────

  const sidebar = (
    <aside className="hidden md:flex w-64 flex-shrink-0 bg-[#eef2f7] border-r border-[#dce4ef] flex-col">
      <div className="p-6 flex-1">
        <h2 className="text-lg font-display text-[#002147] mb-1">
          Get an Instant Offer
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          We keep track of answers here. If needed, you can jump back to
          completed sections.
        </p>

        <nav className="space-y-1">
          {SECTIONS.map((section) => {
            const status = getSectionStatus(section, currentStep.id);
            const num = getSectionNumber(section);
            return (
              <div key={section}>
                <div
                  className={cn(
                    "flex items-center justify-between py-3 border-b border-[#dce4ef]",
                    status === "active" ? "opacity-100" : "opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      status === "active"
                        ? "text-[#00bbea]"
                        : "text-[#002147]"
                    )}
                  >
                    {section}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={cn(
                      "w-4 h-4",
                      status === "active"
                        ? "text-[#00bbea]"
                        : "text-gray-400"
                    )}
                  />
                </div>

                {/* Vehicle label when completed */}
                {section === "Vehicle" && vehicleLabel && (
                  <div className="py-2 flex items-center justify-between text-xs text-[#00bbea] font-medium">
                    <span>{vehicleLabel}</span>
                    <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 flex-shrink-0" />
                  </div>
                )}

                {/* Ownership completed badge */}
                {section === "Ownership" &&
                  getSectionStatus("Ownership", currentStep.id) ===
                    "completed" && (
                    <div className="py-2 flex items-center justify-between text-xs text-[#00bbea] font-medium">
                      <span>Completed</span>
                      <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 flex-shrink-0" />
                    </div>
                  )}

                {/* Conditions completed badge */}
                {section === "Conditions" &&
                  getSectionStatus("Conditions", currentStep.id) ===
                    "completed" && (
                    <div className="py-2 flex items-center justify-between text-xs text-[#00bbea] font-medium">
                      <span>Completed</span>
                      <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 flex-shrink-0" />
                    </div>
                  )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Restart */}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={() => {
            setStepIndex(0);
            setForm(INITIAL_FORM);
            setCalcStage(0);
          }}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded-full px-3 py-1.5 transition-colors"
        >
          <FontAwesomeIcon icon={faRotate} className="w-3 h-3" />
          Restart
        </button>
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
      // ---- Step 1: ZIP --------------------------------------------------------
      case "zip":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Where is your car located?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                We use your zip code to find buyers near you.
              </p>
            </div>
            <input
              type="text"
              placeholder="Enter your zip code  (e.g. 30318)"
              value={form.zipCode}
              onChange={(e) => update("zipCode", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bbea] focus:border-[#00bbea] placeholder-gray-400"
            />
            <p className="text-xs text-[#00bbea]">
              We&apos;ll match you with local buyers in your area.
            </p>
          </div>
        );

      // ---- Step 2: Vehicle ----------------------------------------------------
      case "vehicle":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Tell us about your car
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter your VIN for the fastest results, or select year / make /
                model.
              </p>
            </div>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              {(["vin", "ymm"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update("vehicleEntry", t)}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium transition-colors",
                    form.vehicleEntry === t
                      ? "bg-white text-[#002147] shadow-inner border-b-2 border-[#002147]"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {t === "vin" ? "Enter VIN (faster way)" : "Year / Make / Model / Trim"}
                </button>
              ))}
            </div>

            {form.vehicleEntry === "vin" ? (
              <div>
                <input
                  type="text"
                  placeholder="e.g. 1HGBH41JXMN109186"
                  value={form.vin}
                  onChange={(e) => update("vin", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bbea] focus:border-[#00bbea] placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-2">
                  17-character code — found on your dashboard or door jamb.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { key: "year", placeholder: "Year" },
                    { key: "make", placeholder: "Make" },
                    { key: "model", placeholder: "Model" },
                    { key: "trim", placeholder: "Trim" },
                  ] as { key: keyof FormData; placeholder: string }[]
                ).map(({ key, placeholder }) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={placeholder}
                    value={form[key] as string}
                    onChange={(e) => update(key, e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bbea] placeholder-gray-400"
                  />
                ))}
              </div>
            )}
          </div>
        );

      // ---- Step 3: Mileage ----------------------------------------------------
      case "mileage":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                How many miles are on your car?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter your current odometer reading.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="87,400"
                value={form.mileage}
                onChange={(e) => update("mileage", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bbea] placeholder-gray-400"
              />
              <span className="text-sm text-gray-500">miles</span>
            </div>
            <p className="text-xs text-gray-400">
              Approximate is fine — round to the nearest thousand.
            </p>
          </div>
        );

      // ---- Step 4: Ownership --------------------------------------------------
      case "ownership":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Tell us about ownership
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Two quick questions — then you&apos;re into the home stretch.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                TITLE
              </p>
              <div className="space-y-2">
                {[
                  { value: "clean", label: "Clean title" },
                  { value: "salvage", label: "Salvage / rebuilt title" },
                  { value: "none", label: "No title — exit" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors",
                      form.title === opt.value
                        ? "border-[#00bbea] bg-[#00bbea]/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0",
                        form.title === opt.value
                          ? "border-[#00bbea] bg-[#00bbea]"
                          : "border-gray-300"
                      )}
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                    <input
                      type="radio"
                      className="sr-only"
                      checked={form.title === opt.value}
                      onChange={() => update("title", opt.value as any)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                DRIVABILITY
              </p>
              <div className="space-y-2">
                {[
                  { value: "drives", label: "Drives" },
                  { value: "starts", label: "Starts only — but can't drive" },
                  { value: "nostart", label: "No start" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors",
                      form.drivability === opt.value
                        ? "border-[#00bbea] bg-[#00bbea]/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0",
                        form.drivability === opt.value
                          ? "border-[#00bbea] bg-[#00bbea]"
                          : "border-gray-300"
                      )}
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                    <input
                      type="radio"
                      className="sr-only"
                      checked={form.drivability === opt.value}
                      onChange={() => update("drivability", opt.value as any)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      // ---- Step 5: Damage -----------------------------------------------------
      case "damage":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Any damage to your car?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Check all that apply — we&apos;ll ask for details if needed.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                EXTERIOR
              </p>
              <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl">
                <span className="text-sm text-gray-700">Body damage?</span>
                <YesNoToggle
                  value={form.bodyDamage}
                  onChange={(v) => update("bodyDamage", v)}
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                ENVIRONMENTAL
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl">
                  <span className="text-sm text-gray-700">Flood damage?</span>
                  <YesNoToggle
                    value={form.floodDamage}
                    onChange={(v) => update("floodDamage", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl">
                  <span className="text-sm text-gray-700">Fire damage?</span>
                  <YesNoToggle
                    value={form.fireDamage}
                    onChange={(v) => update("fireDamage", v)}
                  />
                </div>
              </div>
            </div>

            {(form.bodyDamage !== null ||
              form.floodDamage !== null ||
              form.fireDamage !== null) &&
              (form.bodyDamage === null ||
                form.floodDamage === null ||
                form.fireDamage === null) && (
                <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-200">
                  All damage questions must be answered Yes or No to continue.
                </div>
              )}
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
              <p className="text-sm text-gray-500 mt-1">
                Select everything that applies to the body damage.
              </p>
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

      // ---- Step 7: Parts ------------------------------------------------------
      case "parts":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-display text-[#002147]">
                Any parts removed or missing?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Include aftermarket swaps, stolen parts, or removed components.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                GENERAL PARTS
              </p>
              <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl">
                <span className="text-sm text-gray-700">
                  Parts removed or missing?
                </span>
                <YesNoToggle
                  value={form.partsRemoved}
                  onChange={(v) => update("partsRemoved", v)}
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                EMISSIONS
              </p>
              <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl">
                <span className="text-sm text-gray-700">
                  Catalytic converter removed or replaced?
                </span>
                <YesNoToggle
                  value={form.catalyticConverter}
                  onChange={(v) => update("catalyticConverter", v)}
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-600">
              If parts were removed, a follow-up question will ask what happened
              to them.
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
              <p className="text-sm text-gray-500 mt-1">
                Be as accurate as you can — it won&apos;t disqualify your car.
              </p>
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
              <p className="text-sm text-gray-500 mt-1">
                We&apos;ll send your offer here and arrange pickup.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                CONTACT
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bbea] placeholder-gray-400"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00bbea] placeholder-gray-400"
                />
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
              <p className="text-sm text-gray-500 mt-1">
                Checking market data and matching local buyers...
              </p>
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
              <p className="text-sm text-gray-500 mt-1">
                Review your offer below — it&apos;s valid for 7 days.
              </p>
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
                    vehicleLabel ||
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
              <p className="text-sm text-gray-500 mt-1">
                We&apos;ll be in touch within 2 hours to schedule your pickup.
              </p>
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

  const showNav =
    currentStep.id !== "calculating" && currentStep.id !== "accepted";

  return (
    <section className="flex-1 bg-[#002147] relative overflow-hidden font-nunito">
      {/* Background glows — match hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002147] via-[#2e5478]/30 to-[#002147] pointer-events-none" />
      <div className="hero-glow-cyan absolute top-0 right-[10%] w-[500px] h-[500px] pointer-events-none" />

      <div className="relative max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back to home link */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
          Back to home
        </button>

        {/* White card: sidebar + content */}
        <div className="bg-white rounded-2xl shadow-2xl w-full flex overflow-hidden min-h-[560px] font-nunito">

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
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={back}
                disabled={stepIndex === 0}
                className={cn(
                  "flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors",
                  stepIndex === 0
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-[#00bbea] text-[#00bbea] hover:bg-[#00bbea]/10"
                )}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={next}
                className="flex items-center gap-1.5 bg-[#00bbea] hover:bg-[#00c6ef] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                Next
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Accept offer button on offer screen */}
          {currentStep.id === "offer" && (
            <div className="px-8 pb-6">
              <button
                onClick={() =>
                  setStepIndex(STEPS.findIndex((s) => s.id === "accepted"))
                }
                className="w-full bg-[#00bbea] hover:bg-[#00c6ef] text-white font-semibold py-4 rounded-xl text-base transition-colors"
              >
                Accept Offer → Schedule Pickup
              </button>
            </div>
          )}
        </div>
        </div>{/* end white card */}
      </div>{/* end max-w container */}
    </section>
  );
}
