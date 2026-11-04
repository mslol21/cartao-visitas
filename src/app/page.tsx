import type { Metadata } from "next";
import { ImmersiveLanding } from "@/components/immersive/ImmersiveLanding";

export const metadata: Metadata = {
  title: "Konnexy | Sites, Google, Tráfego Pago e Sistemas Web",
  description: "Sites, presença no Google e soluções digitais para pequenos negócios em São Paulo e atendimento online.",
  alternates: {
    canonical: "https://konnexy.com.br"
  }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <ImmersiveLanding />
    </main>
  );
}
