const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/OfferForm.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add Data Constants
const constants = `
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
`;

if (!content.includes('const YEARS = Array.from')) {
  content = content.replace(
    /const STEPS: \{ id: StepId; section: Section \}\[\] = \[/,
    constants + '\nconst STEPS: { id: StepId; section: Section }[] = ['
  );
}

// 2. Add openDropdown state
if (!content.includes('const [openDropdown, setOpenDropdown] = useState')) {
  content = content.replace(
    /const \[trimDropdownOpen, setTrimDropdownOpen\] = useState\(false\);/,
    'const [trimDropdownOpen, setTrimDropdownOpen] = useState(false);\n  const [openDropdown, setOpenDropdown] = useState<"year" | "make" | "model" | null>(null);'
  );
}

// 3. Replace YMM inputs with custom dropdowns
const vehicleStepRegex = /<\(.*?\[\s*\{\s*key:\s*"year".*?\)\.map\(\(\{ key, placeholder \}\) => \([\s\S]*?<\/[dD]iv>\s*\)\)\}\s*<\/div>/;

const customYMMDropdowns = `
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Year Dropdown */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-black text-[#002147] tracking-tight">Year</label>
                  <div
                    onClick={() => setOpenDropdown(openDropdown === "year" ? null : "year")}
                    className="w-full h-[48px] border border-gray-300 rounded-full px-4 flex items-center justify-between text-sm font-bold cursor-pointer bg-white"
                  >
                    <span className={form.year ? "text-[#002147]" : "text-gray-400 font-medium"}>
                      {form.year || "Year"}
                    </span>
                    <svg className={\`w-4 h-4 text-gray-500 transition-transform \${openDropdown === "year" ? 'rotate-180' : ''}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  {openDropdown === "year" && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                      <ul className="py-2">
                        {YEARS.map((y) => (
                          <li key={y}>
                            <button
                              type="button"
                              onClick={() => {
                                update("year", y);
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm font-semibold text-[#002147] transition-colors"
                            >
                              {y}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Make Dropdown */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-black text-[#002147] tracking-tight">Make</label>
                  <div
                    onClick={() => setOpenDropdown(openDropdown === "make" ? null : "make")}
                    className="w-full h-[48px] border border-gray-300 rounded-full px-4 flex items-center justify-between text-sm font-bold cursor-pointer bg-white"
                  >
                    <span className={form.make ? "text-[#002147]" : "text-gray-400 font-medium"}>
                      {form.make || "Make"}
                    </span>
                    <svg className={\`w-4 h-4 text-gray-500 transition-transform \${openDropdown === "make" ? 'rotate-180' : ''}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  {openDropdown === "make" && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                      <ul className="py-2">
                        {MAKES.map((m) => (
                          <li key={m}>
                            <button
                              type="button"
                              onClick={() => {
                                update("make", m);
                                update("model", ""); // reset model when make changes
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm font-semibold text-[#002147] transition-colors"
                            >
                              {m}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Model Dropdown */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-black text-[#002147] tracking-tight">Model</label>
                  <div
                    onClick={() => {
                      if (form.make) setOpenDropdown(openDropdown === "model" ? null : "model");
                    }}
                    className={\`w-full h-[48px] border border-gray-300 rounded-full px-4 flex items-center justify-between text-sm font-bold \${form.make ? 'cursor-pointer bg-white' : 'cursor-not-allowed bg-gray-50'}\`}
                  >
                    <span className={form.model ? "text-[#002147]" : "text-gray-400 font-medium"}>
                      {form.model || "Model"}
                    </span>
                    <svg className={\`w-4 h-4 text-gray-500 transition-transform \${openDropdown === "model" ? 'rotate-180' : ''}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  {openDropdown === "model" && form.make && VEHICLES_DATA[form.make as string] && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                      <ul className="py-2">
                        {VEHICLES_DATA[form.make as string].map((m) => (
                          <li key={m}>
                            <button
                              type="button"
                              onClick={() => {
                                update("model", m);
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm font-semibold text-[#002147] transition-colors"
                            >
                              {m}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
`;

content = content.replace(vehicleStepRegex, customYMMDropdowns.trim());

fs.writeFileSync(file, content);
console.log('YMM updated.');
