import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

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
