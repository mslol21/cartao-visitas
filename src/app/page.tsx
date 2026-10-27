"use client";

import { KonnexyLanding } from "@/components/landing/KonnexyLanding";
import { KonnexyPageIntro } from "@/components/brand/KonnexyPageIntro";

export default function LandingPage() {
  return (
    <KonnexyPageIntro>
      <main className="min-h-screen">
        <KonnexyLanding />
      </main>
    </KonnexyPageIntro>
  );
}
