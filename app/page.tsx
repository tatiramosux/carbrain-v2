"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import OfferForm from "@/components/OfferForm";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [initialVin, setInitialVin] = useState("");
  const [initialYear, setInitialYear] = useState("");
  const [initialMake, setInitialMake] = useState("");
  const [initialModel, setInitialModel] = useState("");
  const [initialTab, setInitialTab] = useState<"vin" | "ymm">("vin");

  function handleGetOffer({
    vin = "",
    year = "",
    make = "",
    model = "",
    tab = "vin",
  }: {
    vin?: string;
    year?: string;
    make?: string;
    model?: string;
    tab?: "vin" | "ymm";
  } = {}) {
    setInitialVin(vin);
    setInitialYear(year);
    setInitialMake(make);
    setInitialModel(model);
    setInitialTab(tab);
    setShowForm(true);
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#002147]">
      <Navbar onGetOffer={() => handleGetOffer()} />

      {showForm ? (
        <OfferForm
          onClose={() => setShowForm(false)}
          initialVin={initialVin}
          initialYear={initialYear}
          initialMake={initialMake}
          initialModel={initialModel}
          initialTab={initialTab}
        />
      ) : (
        <HeroSection onGetOffer={handleGetOffer} />
      )}

      <Footer />
    </main>
  );
}
