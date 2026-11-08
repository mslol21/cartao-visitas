import { StructuredData } from '@/components/seo/StructuredData'
import { generatePageGraph } from '@/lib/seo/structured-data'
import { pageMetadata } from '@/lib/seo/site'
import { Metadata } from 'next'
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = pageMetadata('Planos e orçamento | Konnexy', 'Conheça as opções de catálogo digital e solicite uma proposta para o seu negócio.', '/pricing');

export const dynamic = 'force-dynamic';

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-16">
      <StructuredData data={generatePageGraph({ title: "Planos e orçamento", description: "Opções de catálogo digital da Konnexy", path: "/pricing" })} />
      <Navbar />
      <Pricing />
      <Footer />
    </main>
  );
}
