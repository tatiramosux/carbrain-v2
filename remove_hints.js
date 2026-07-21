const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/OfferForm.tsx');
let content = fs.readFileSync(file, 'utf8');

// Remove subtitle hint texts under headings
content = content.replace(/<p className="text-sm text-gray-500 mt-1">[\s\S]*?<\/p>/g, '');

// Remove specific hint texts under fields
content = content.replace(/<p className="text-xs text-\[#00bbea\]">[\s\S]*?<\/p>/g, '');
content = content.replace(/<p className="text-xs text-gray-400">\s*17-character code found on windshield[\s\S]*?<\/p>/g, '');
content = content.replace(/<p className="text-xs text-gray-400">\s*Approximate is fine — round to the nearest thousand\.[\s\S]*?<\/p>/g, '');

// Change placeholders to "- Select -"
content = content.replace(/placeholder="Year"/g, 'placeholder="- Select -"');
content = content.replace(/placeholder="Make"/g, 'placeholder="- Select -"');
content = content.replace(/placeholder="Model"/g, 'placeholder="- Select -"');
content = content.replace(/placeholder="e.g. LX, EX, LE, Sport, Limited, Base"/g, 'placeholder="- Select -"');

fs.writeFileSync(file, content);
console.log('OfferForm.tsx updated.');
