import { Metadata } from 'next'
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: 'Planos e Preços - Catálogo Digital e Vendas WhatsApp',
  description: 'Escolha o plano ideal para gerenciar seu catálogo digital e organizar seus pedidos pelo WhatsApp com a Konnexy.',
  keywords: [
    'preços catálogo digital',
    'planos catálogo whatsapp',
    'catálogo digital whatsapp',
    'vender pelo whatsapp',
    'pedidos whatsapp saas'
  ],
  openGraph: {
    title: 'Planos e Preços - Catálogo Digital e Vendas WhatsApp | Konnexy',
    description: 'Escolha o plano ideal para gerenciar seu catálogo digital e organizar seus pedidos pelo WhatsApp com a Konnexy.',
    type: 'website',
  },
  alternates: {
    canonical: '/pricing',
  },
}

export const dynamic = 'force-dynamic';

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      <Pricing />
      <Footer />
    </main>
  );
}
