const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/OfferForm.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove 'zip' from StepId type
content = content.replace(/\s*\|\s*"zip"/, '');

// 2. Remove 'zip' from STEPS array
content = content.replace(/\s*\{\s*id:\s*"zip",\s*section:\s*"Vehicle"\s*\},\n/, '\n');

// 3. Update State Initialization (stepIndex and form)
// The useState for stepIndex is currently: const [stepIndex, setStepIndex] = useState(0);
// We'll replace the state init block.
content = content.replace(
  /const \[stepIndex, setStepIndex\] = useState\(0\);\n\s*const \[form, setForm\] = useState<FormData>\(\{[\s\S]*? vehicleEntry:[\s\S]*?\}\);/m,
  `const isFastLane = Boolean(initialVin);
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
  });`
);

// 4. Move ZIP block to contact and remove case "zip":
// First, extract the Zip block we want (actually I'll just write it manually)
const zipBlock = `
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
                </div>`;

// Insert it into the contact block above Email Address
content = content.replace(
  /<div className="space-y-1.5">\s*<label className="block text-xs font-black text-\[#002147\] tracking-tight">\s*Email Address/m,
  zipBlock + '\n                <div className="space-y-1.5">\n                  <label className="block text-xs font-black text-[#002147] tracking-tight">\n                    Email Address'
);

// Remove `case "zip":` block
content = content.replace(
  /\s*\/\/ ---- Step 1: ZIP -+[\s\S]*?case "zip":[\s\S]*?return \([\s\S]*?\);\n/m,
  '\n'
);

// 5. Change `// ---- Step 2: Vehicle` to Step 1 etc if needed, but not strictly necessary.

fs.writeFileSync(file, content);
console.log('Flow update complete.');
