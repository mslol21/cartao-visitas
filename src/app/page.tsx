import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import { ImmersiveLanding } from "@/components/immersive/ImmersiveLanding";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-konnexy-sans",
  display: "swap",
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Konnexy | Sites, Google, Tráfego Pago e Sistemas Web",
  description:
    "Sites, presença no Google e soluções digitais para pequenos negócios em São Paulo e atendimento online.",
  alternates: {
    canonical: "https://konnexy.com.br",
  },
};

export default function LandingPage() {
  return (
    <main className={`${space.className} ${space.variable} ${instrument.variable} min-h-screen`}>
      <ImmersiveLanding />
    </main>
  );
}
