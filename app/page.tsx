"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import OfferForm from "@/components/OfferForm";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [initialZip, setInitialZip] = useState("");
  const [initialVin, setInitialVin] = useState("");
  const [initialTab, setInitialTab] = useState<"zip" | "vin">("zip");

  function handleGetOffer(zip = "", vin = "", tab: "zip" | "vin" = "zip") {
    setInitialZip(zip);
    setInitialVin(vin);
    setInitialTab(tab);
    setShowForm(true);
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#002147]">
      <Navbar onGetOffer={() => handleGetOffer()} />

      {showForm ? (
        <OfferForm
          onClose={() => setShowForm(false)}
          initialZip={initialZip}
          initialVin={initialVin}
          initialTab={initialTab}
        />
      ) : (
        <HeroSection onGetOffer={handleGetOffer} />
      )}

      <Footer />
    </main>
  );
}
