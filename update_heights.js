const fs = require('fs');
const path = require('path');

const heroFile = path.join(__dirname, 'components/HeroSection.tsx');
let hero = fs.readFileSync(heroFile, 'utf8');

// Tabs container
hero = hero.replace(
  /<div className="mx-6 mt-2 p-1 rounded-full flex items-center bg-\[#f5f5f6\] shadow-sm">/,
  '<div className="mx-6 mt-2 px-[6px] h-[60px] rounded-full flex items-center bg-[#f5f5f6] shadow-sm">'
);

// Tab buttons
hero = hero.replace(
  /"flex-1 py-2\.5 px-3 text-xs sm:text-sm font-extrabold transition-all rounded-full text-center",/g,
  '"flex-1 h-[48px] flex items-center justify-center px-3 text-xs sm:text-sm font-extrabold transition-all rounded-full text-center",'
);

// VIN input container
hero = hero.replace(
  /"border rounded-xl px-4 py-3\.5 transition-all bg-white",/g,
  '"h-[48px] border rounded-xl px-4 flex items-center transition-all bg-white",'
);

// Year/Make/Model dropdown containers
hero = hero.replace(
  /<div className="w-full flex items-center justify-between px-5 py-4 bg-white border border-\[#DFDFE0\] transition-all focus-within:ring-2 focus-within:ring-\[#00bbea\] rounded-xl">/g,
  '<div className="w-full h-[48px] flex items-center justify-between px-5 bg-white border border-[#DFDFE0] transition-all focus-within:ring-2 focus-within:ring-[#00bbea] rounded-xl">'
);
hero = hero.replace(
  /className=\{cn\(\n\s*"w-full flex items-center justify-between px-5 py-4 bg-white border border-\[#DFDFE0\] transition-all focus-within:ring-2 focus-within:ring-\[#00bbea\] rounded-xl",/g,
  'className={cn(\n                        "w-full h-[48px] flex items-center justify-between px-5 bg-white border border-[#DFDFE0] transition-all focus-within:ring-2 focus-within:ring-[#00bbea] rounded-xl",'
);

fs.writeFileSync(heroFile, hero);

// OfferForm fields
const offerFile = path.join(__dirname, 'components/OfferForm.tsx');
let offer = fs.readFileSync(offerFile, 'utf8');

// Find standard inputs and add h-[48px]
offer = offer.replace(/className="w-full border border-gray-300 rounded-full px-4 py-3 text-sm/g, 'className="w-full h-[48px] border border-gray-300 rounded-full px-4 text-sm');
offer = offer.replace(/className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm/g, 'className="flex-1 h-[48px] border border-gray-300 rounded-full px-4 text-sm');

// Also update VIN field in OfferForm
offer = offer.replace(/className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm/g, 'className="w-full h-[48px] border border-gray-300 rounded-xl px-4 text-sm');
offer = offer.replace(/className="w-full border border-gray-300 rounded-full px-4 py-3\.5 text-sm/g, 'className="w-full h-[48px] border border-gray-300 rounded-full px-4 text-sm');


fs.writeFileSync(offerFile, offer);
console.log('Heights updated.');
