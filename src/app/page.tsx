import type { Metadata } from "next";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "FastDeliver | Système de gestion des livraisons",
  description:
    "Plateforme de gestion des livraisons : suivi des expéditions, gestion des chauffeurs, optimisation des itinéraires et rapports.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
