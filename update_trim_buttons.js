const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/OfferForm.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Trim buttons div
const trimButtonsRegex = /<div className="flex flex-wrap gap-2">\s*\{\["Base", "LE", "SE", "XLE", "Sport", "Limited", "LX", "EX", "Touring"\]\.map\(\(t\) => \(\s*<button[\s\S]*?<\/button>\s*\)\)\}\s*<\/div>/;
content = content.replace(trimButtonsRegex, '');

// 2. Change Next button color
content = content.replace(
  /<button\s+onClick=\{next\}\s+className="flex items-center gap-1\.5 bg-\[#00bbea\] hover:bg-\[#0096bd\] text-white px-5 py-2\.5 rounded-full text-sm font-medium transition-colors"/,
  '<button\n                onClick={next}\n                className="flex items-center gap-1.5 bg-[#00bbea] hover:bg-[#0096bd] text-[#002147] px-5 py-2.5 rounded-full text-sm font-extrabold transition-colors"'
);

fs.writeFileSync(file, content);
console.log('Update complete.');
