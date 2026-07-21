const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/OfferForm.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace onClick with onMouseDown for the list items inside the custom dropdowns
// Specifically target the buttons inside the ul > li blocks we just added

// Fix Trim
content = content.replace(
  /onClick=\{\(\) => \{\s*update\("trim", opt\);\s*setTrimDropdownOpen\(false\);\s*\}\}/g,
  'onMouseDown={() => { update("trim", opt); setTrimDropdownOpen(false); }}'
);

// Fix Year
content = content.replace(
  /onClick=\{\(\) => \{\s*update\("year", y\);\s*setOpenDropdown\(null\);\s*\}\}/g,
  'onMouseDown={() => { update("year", y); setOpenDropdown(null); }}'
);

// Fix Make
content = content.replace(
  /onClick=\{\(\) => \{\s*update\("make", m\);\s*update\("model", ""\);[\s\S]*?setOpenDropdown\(null\);\s*\}\}/g,
  'onMouseDown={() => { update("make", m); update("model", ""); setOpenDropdown(null); }}'
);

// Fix Model
content = content.replace(
  /onClick=\{\(\) => \{\s*update\("model", m\);\s*setOpenDropdown\(null\);\s*\}\}/g,
  'onMouseDown={() => { update("model", m); setOpenDropdown(null); }}'
);

fs.writeFileSync(file, content);
console.log('Fixed dropdown clicks.');
