# CarBrain Prototype

A Next.js prototype for the CarBrain website, built with shadcn/ui component patterns and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **shadcn/ui** component patterns
- **Lucide React** icons
- **TypeScript**

## Structure

```
app/
  layout.tsx        # Root layout + metadata
  page.tsx          # Landing page (client component)
  globals.css       # Global styles + Tailwind directives

components/
  Navbar.tsx        # Top navigation (responsive)
  HeroSection.tsx   # Hero + offer widget
  OfferForm.tsx     # Full 12-step interactive offer flow
  Footer.tsx        # Footer with link columns

lib/
  utils.ts          # cn() helper
```

## Deploy to Vercel

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial prototype"
   gh repo create carbrain-prototype --public --source=. --push
   ```

2. Import the repo at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Next.js, no config needed.

## Form Flow (12 steps)

1. **ZIP** — car location
2. **Vehicle** — VIN or Year/Make/Model/Trim
3. **Mileage** — odometer reading
4. **Ownership** — title type + drivability
5. **Damage** — body / flood / fire (Y/N)
6. **Body work** — chip multi-select (skipped if no body damage)
7. **Parts** — removed/missing + catalytic converter
8. **Mechanical** — runs fine / minor / major issues
9. **Contact** — email, phone, pickup type
10. **Calculating** — animated loading (auto-advances)
11. **Offer ready** — $4,250 offer card
12. **Accepted** — confirmation + next steps
