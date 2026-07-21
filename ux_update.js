const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/OfferForm.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Swap trim and bodyStyle in STEPS
content = content.replace(
  /\{\s*id:\s*"bodyStyle",\s*section:\s*"Vehicle"\s*\},\n\s*\{\s*id:\s*"trim",\s*section:\s*"Vehicle"\s*\}/,
  '{ id: "trim", section: "Vehicle" },\n  { id: "bodyStyle", section: "Vehicle" }'
);

// 2. Enhance `update` function for VIN clearing
content = content.replace(
  /const update = <K extends keyof FormData>\(field: K, value: FormData\[K\]\) => \{\n\s*setForm\(\(prev\) => \(\{ \.\.\.prev, \[field\]: value \}\)\);\n\s*\};/,
  `const update = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => {
      const nextForm = { ...prev, [field]: value };
      if (field === 'year' || field === 'make' || field === 'model') {
        nextForm.vin = '';
      }
      return nextForm;
    });
  };`
);

// 3. Trim Dropdown conversion
const trimInputRegex = /<input\s+type="text"\s+placeholder="- Select -"\s+value=\{form\.trim\}\s+onChange=\{\(e\) => update\("trim", e\.target\.value\)\}\s+className="w-full h-\[48px\] border border-gray-300 rounded-full px-4 text-sm font-bold text-\[#002147\] focus:outline-none focus:ring-2 focus:ring-\[#00bbea\] placeholder-gray-400"\s*\/>/;

const trimSelect = `<div className="relative">
                <select
                  value={form.trim}
                  onChange={(e) => update("trim", e.target.value)}
                  className="w-full h-[48px] border border-gray-300 rounded-full px-4 pr-10 text-sm font-bold text-[#002147] focus:outline-none focus:ring-2 focus:ring-[#00bbea] appearance-none bg-white"
                >
                  <option value="" disabled>- Select -</option>
                  {["Base", "LE", "SE", "XLE", "Sport", "Limited", "LX", "EX", "Touring"].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>`;

content = content.replace(trimInputRegex, trimSelect);


// 4. Vehicle Step (YMM) modification
// Replace the entire case "vehicle": block content
// We want to remove Pick Your Lane and the VIN input branch, leaving only the Y/M/M fields.
const vehicleRegex = /case "vehicle":[\s\S]*?\/\/ ---- Step 2b: Body Style/m;

const newVehicleBlock = `case "vehicle":
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
          </div>
        );

      // ---- Step 2b: Body Style`;

content = content.replace(vehicleRegex, newVehicleBlock);

fs.writeFileSync(file, content);
console.log('UX updates complete.');
