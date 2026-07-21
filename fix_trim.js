const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/OfferForm.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add state for trim dropdown
if (!content.includes('const [trimDropdownOpen, setTrimDropdownOpen] = useState(false);')) {
  content = content.replace(
    /const \[expandedSections, setExpandedSections\] = useState<Record<Section, boolean>>\(\{/,
    'const [trimDropdownOpen, setTrimDropdownOpen] = useState(false);\n  const [expandedSections, setExpandedSections] = useState<Record<Section, boolean>>({'
  );
}

// 2. Replace the native select with a custom dropdown
const trimRegex = /<div className="relative">\s*<select[\s\S]*?<\/select>\s*<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">[\s\S]*?<\/div>\s*<\/div>/;

const customDropdown = `<div className="relative">
                <div
                  onClick={() => setTrimDropdownOpen(!trimDropdownOpen)}
                  className="w-full h-[48px] border border-gray-300 rounded-full px-4 pr-10 flex items-center justify-between text-sm font-bold text-[#002147] cursor-pointer bg-white"
                >
                  <span className={form.trim ? "text-[#002147]" : "text-gray-400 font-medium"}>
                    {form.trim || "- Select -"}
                  </span>
                  <svg className={\`w-4 h-4 text-gray-500 transition-transform \${trimDropdownOpen ? 'rotate-180' : ''}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {trimDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                    <ul className="py-2">
                      {["Base", "LE", "SE", "XLE", "Sport", "Limited", "LX", "EX", "Touring"].map((opt) => (
                        <li key={opt}>
                          <button
                            type="button"
                            onClick={() => {
                              update("trim", opt);
                              setTrimDropdownOpen(false);
                            }}
                            className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm font-semibold text-[#002147] transition-colors"
                          >
                            {opt}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>`;

content = content.replace(trimRegex, customDropdown);

fs.writeFileSync(file, content);
console.log('Trim dropdown fixed.');
