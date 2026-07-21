const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/HeroSection.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add faCircleInfo
content = content.replace(
  /import \{ faArrowRight, faStar, faCheck \} from "@fortawesome\/free-solid-svg-icons";/,
  'import { faArrowRight, faStar, faCheck, faCircleInfo } from "@fortawesome/free-solid-svg-icons";'
);

// 2. Tab switcher bg
content = content.replace(
  /<div className="mx-6 mt-2 p-1 border border-\[#DFDFE0\] rounded-full flex items-center bg-white shadow-sm">/,
  '<div className="mx-6 mt-2 p-1 rounded-full flex items-center bg-[#f5f5f6] shadow-sm">'
);

// 3. VIN field
content = content.replace(
  /<label className="block text-xs font-black text-\[#002147\] tracking-tight">\s*Vehicle VIN\s*<\/label>/,
  '<label className="flex items-center gap-1 text-sm font-medium text-[#002147] mb-0.5">VIN <span className="text-red-500">*</span><FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5 text-gray-300 ml-1" /></label>'
);
content = content.replace(
  /"border rounded-full px-4 py-3\.5 transition-all bg-white"/,
  '"border rounded-xl px-4 py-3.5 transition-all bg-white"'
);
content = content.replace(
  /placeholder="ENTER YOUR 17-DIGIT VIN"/,
  'placeholder="Enter your 17-digit VIN"'
);
content = content.replace(
  /className="w-full text-sm font-extrabold text-\[#002147\] outline-none bg-transparent placeholder-\[#002147\]\/40 tracking-wider"/,
  'className="w-full text-sm font-medium text-[#002147] outline-none bg-transparent placeholder-gray-400"'
);

// 4. VIN Helper
content = content.replace(
  /<span className="font-extrabold text-xs text-\[#002147\]">Here&apos;s where to find your VIN<\/span>/,
  '<span className="font-semibold text-xs text-[#002147]">Here&apos;s where to find your VIN:</span>'
);
content = content.replace(
  /<span className="bg-\[#f5f5f6\] text-\[#4B4B53\] font-mono text-xs font-semibold px-3 py-1 rounded-xl border border-\[#e5e5e8\]">/,
  '<span className="bg-white text-gray-700 font-mono text-xs font-semibold px-3 py-1 rounded-lg border border-[#e5e5e8]">'
);

// 5. Year/Make/Model labels and containers
const fields = ['Year', 'Make', 'Model'];
for (const field of fields) {
  const regexLabel = new RegExp(`<label className="block text-xs font-black text-\\[#002147\\] tracking-tight">\\s*${field}\\s*<\\/label>`);
  content = content.replace(
    regexLabel,
    `<label className="flex items-center gap-1 text-sm font-medium text-[#002147] mb-0.5">${field} <span className="text-red-500">*</span><FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5 text-gray-300 ml-1" /></label>`
  );
}

// Containers: replace rounded-full with rounded-xl on dropdowns
content = content.replace(
  /<div className="w-full flex items-center justify-between px-5 py-4 bg-white border border-\[#DFDFE0\] transition-all focus-within:ring-2 focus-within:ring-\[#00bbea\] rounded-full">/g,
  '<div className="w-full flex items-center justify-between px-5 py-4 bg-white border border-[#DFDFE0] transition-all focus-within:ring-2 focus-within:ring-[#00bbea] rounded-xl">'
);
content = content.replace(
  /className=\{cn\(\s*"w-full flex items-center justify-between px-5 py-4 bg-white border border-\[#DFDFE0\] transition-all focus-within:ring-2 focus-within:ring-\[#00bbea\] rounded-full",/g,
  'className={cn(\n                        "w-full flex items-center justify-between px-5 py-4 bg-white border border-[#DFDFE0] transition-all focus-within:ring-2 focus-within:ring-[#00bbea] rounded-xl",'
);

// Placeholders: replace - Select - with -- Select --
content = content.replace(/placeholder="- Select -"/g, 'placeholder="-- Select --"');

// Font change on Y/M/M inputs
content = content.replace(
  /className="w-full text-base font-medium text-left text-\[#002147\] outline-none bg-transparent placeholder-\[#002147\]\/40"/g,
  'className="w-full text-sm font-medium text-left text-[#002147] outline-none bg-transparent placeholder-[#002147]/40"'
);
content = content.replace(
  /className="w-full text-base font-medium text-left text-\[#002147\] outline-none bg-transparent placeholder-\[#002147\]\/40 disabled:cursor-not-allowed"/g,
  'className="w-full text-sm font-medium text-left text-[#002147] outline-none bg-transparent placeholder-[#002147]/40 disabled:cursor-not-allowed"'
);

// Button text update: The image has "Get and Offer ->" on the button
// Actually the text is "Get and Offer" and it has an arrow icon.
// Checking if there's a button with Get and Offer:
content = content.replace(
  />\s*Get and Offer\s*<\/button>/g,
  '>\n                          <span className="flex items-center justify-center gap-2">Get and Offer <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" /></span>\n                        </button>'
);


fs.writeFileSync(file, content);
console.log('HeroSection.tsx styling updated.');
