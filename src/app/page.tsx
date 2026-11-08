import { pageMetadata, SITE_DESCRIPTION } from "@/lib/seo/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { generatePageGraph } from "@/lib/seo/structured-data";
import { services } from "@/config/services";
import type { Metadata } from "next";
import { ImmersiveLanding } from "@/components/immersive/ImmersiveLanding";

export const metadata: Metadata = {
  ...pageMetadata('Konnexy | Sites e soluções digitais para pequenos negócios', SITE_DESCRIPTION, '/'),
  openGraph: { ...pageMetadata('Konnexy — Conecta • Organiza • Vende', 'Conheça sites e soluções digitais para apresentar seu negócio, organizar o atendimento e facilitar suas vendas.', '/').openGraph },
  twitter: { ...pageMetadata('Konnexy — Conecta • Organiza • Vende', 'Conheça sites e soluções digitais para apresentar seu negócio, organizar o atendimento e facilitar suas vendas.', '/').twitter },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <StructuredData data={generatePageGraph({ title: "Konnexy", description: SITE_DESCRIPTION, path: "/", services })} />
      <ImmersiveLanding />
    </main>
  );
}
