const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/OfferForm.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace fulfilledVehicleSummary
const oldSummary = `const fulfilledVehicleSummary = (() => {
    if (form.year && form.make && form.model) {
      return \`\${form.year} \${form.make} \${form.model}\${form.trim ? " · " + form.trim : ""}\`;
    }
    if (form.vin) {
      return \`VIN: \${form.vin}\`;
    }
    return null;
  })();`;

const newSummary = `const fulfilledVehicleSummary = (() => {
    if (form.year || form.make || form.model) {
      const parts = [form.year, form.make, form.model].filter(Boolean).join(" ");
      return parts + (form.trim ? " · " + form.trim : "");
    }
    if (form.vin) {
      return \`VIN: \${form.vin}\`;
    }
    return null;
  })();`;

content = content.replace(oldSummary, newSummary);
fs.writeFileSync(file, content);
console.log('Summary updated.');
