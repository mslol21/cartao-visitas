import type { Metadata } from "next";
import { KonnexyLanding } from "@/components/landing/KonnexyLanding";
import { KonnexyPageIntro } from "@/components/brand/KonnexyPageIntro";

export const metadata: Metadata = {
  title: "Konnexy | Sites, Google, Tráfego Pago e Sistemas Web",
  description: "Soluções digitais para empresas: criação de sites, otimização do Perfil da Empresa no Google, tráfego pago, catálogos, NFC/QR Code e sistemas web sob medida.",
  alternates: {
    canonical: "https://konnexy.com.br"
  }
};

export default function LandingPage() {
  return (
    <KonnexyPageIntro>
      <main className="min-h-screen">
        <KonnexyLanding />
      </main>
    </KonnexyPageIntro>
  );
}
