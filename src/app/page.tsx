"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { PlanComparison } from "@/components/landing/PlanComparison";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { 
  WhatIsSection, 
  HowItWorksSection, 
  TargetAudienceSection, 
  WhyChooseSection, 
  FAQSection,
  FinalCTASection 
} from "@/components/landing/Sections";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <WhatIsSection />
      <HowItWorksSection />
      <TargetAudienceSection />
      <WhyChooseSection />
      <Features />
      <PlanComparison />
      <Pricing />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
