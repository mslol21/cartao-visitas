"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  Instagram, 
  MessageSquare, 
  ShoppingCart, 
  Share2, 
  Grid, 
  Tag, 
  Globe, 
  Zap, 
  BarChart3, 
  CheckCircle2, 
  Store, 
  Scissors, 
  Shirt, 
  UtensilsCrossed, 
  Dog, 
  LayoutDashboard, 
  Copy,
  Clock,
  ThumbsUp,
  TrendingUp,
  AlertTriangle,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Logo } from "../brand/Logo";

// Types
interface Product {
  name: string;
  price: number;
  image: string;
}

interface NicheConfig {
  name: string;
  title: string;
  tagline: string;
  description: string;
  themeColor: string;
  glowColor: string;
  icon: React.ComponentType<any>;
  categories: string[];
  products: Product[];
  whatsappMessage: string;
}

// Niche configuration details
const NICHES: Record<string, NicheConfig> = {
  adegas: {
    name: "Adegas",
    title: "Adega Express 🍷",
    tagline: "Organize pedidos e promoções da sua adega.",
    description: "Ideal para gerenciar entregas rápidas de bebidas, combos de destilados, gelo e carvão sem perder nenhuma venda.",
    themeColor: "from-amber-600 to-red-800",
    glowColor: "rgba(217, 119, 6, 0.4)",
    icon: Store,
    categories: ["Vinhos", "Cervejas", "Destilados", "Combos"],
    products: [
      { name: "Vinho Cabernet Sauvignon 750ml", price: 89.90, image: "🍷" },
      { name: "Cerveja IPA Artesanal Caneca", price: 18.90, image: "🍺" },
      { name: "Combo Gin Tanqueray + 4 Tônicas", price: 159.00, image: "🍹" },
      { name: "Carvão Eucalipto Saco 4kg", price: 22.00, image: "🪵" }
    ],
    whatsappMessage: "*Novo Pedido - Adega Express* 🍷\n\n*Cliente:* Roberto Lima\n*Tipo:* Entrega\n\n*Itens:*\n- 1x Vinho Cabernet Sauvignon (R$ 89,90)\n- 1x Combo Gin Tanqueray (R$ 159,00)\n\n*Total:* R$ 248,90\n*Pagamento:* Pix\n*Endereço:* Av. Paulista, 1000 - Ap 42"
  },
  religiosas: {
    name: "Lojas Religiosas",
    title: "Luz & Fé Artigos 📿",
    tagline: "Mostre seus artigos religiosos com um catálogo profissional.",
    description: "Exponha imagens, terços, velas, incensos e livros sagrados com o respeito e a organização que seus fiéis merecem.",
    themeColor: "from-sky-500 to-indigo-700",
    glowColor: "rgba(14, 165, 233, 0.4)",
    icon: ThumbsUp, // Peaceful representation
    categories: ["Terços", "Velas", "Imagens", "Livros"],
    products: [
      { name: "Terço de Madeira Clássico", price: 24.90, image: "📿" },
      { name: "Vela Aromática Mirra 200g", price: 34.90, image: "🕯️" },
      { name: "Estátua São Francisco de Assis 30cm", price: 79.00, image: "🗿" },
      { name: "Incenso Natural Sândalo Caixa", price: 12.50, image: "💨" }
    ],
    whatsappMessage: "*Novo Pedido - Luz & Fé* 📿\n\n*Cliente:* Maria Helena\n*Tipo:* Retirada na Loja\n\n*Itens:*\n- 2x Terço de Madeira Clássico (R$ 49,80)\n- 1x Vela Aromática Mirra (R$ 34,90)\n\n*Total:* R$ 84,70\n*Pagamento:* Pix\n*Horário:* Retirada às 16:30"
  },
  docerias: {
    name: "Docerias",
    title: "Ateliê do Doce Gourmet 🧁",
    tagline: "Receba encomendas organizadas pelo WhatsApp.",
    description: "Apresente seus bolos, docinhos, brigadeiros e lembranças de forma irresistível e organize sua agenda de produção.",
    themeColor: "from-pink-500 to-rose-700",
    glowColor: "rgba(244, 63, 94, 0.4)",
    icon: UtensilsCrossed,
    categories: ["Brigadeiros", "Bolos", "Cupcakes", "Combos"],
    products: [
      { name: "Caixa Presente C/ 6 Brigadeiros", price: 28.00, image: "🍬" },
      { name: "Bento Cake Chocolate Belga", price: 55.00, image: "🎂" },
      { name: "Cupcake Nutella e Leite Ninho", price: 12.00, image: "🧁" },
      { name: "Cento de Brigadeiros Variados", price: 120.00, image: "🍡" }
    ],
    whatsappMessage: "*Novo Pedido - Ateliê do Doce* 🧁\n\n*Cliente:* Ana Julia\n*Tipo:* Entrega (28/05)\n\n*Itens:*\n- 1x Bento Cake Chocolate (R$ 55,00)\n- 1x Caixa C/ 6 Brigadeiros (R$ 28,00)\n\n*Total:* R$ 83,00\n*Pagamento:* Pix\n*Entrega:* Rua das Flores, 123"
  },
  petshops: {
    name: "Pet Shops",
    title: "Pet Love & Cia 🐾",
    tagline: "Facilite pedidos e atendimento dos seus clientes.",
    description: "Organize as vendas de rações, petiscos, brinquedos e agendamentos de banho e tosa em um só link inteligente.",
    themeColor: "from-emerald-500 to-teal-700",
    glowColor: "rgba(16, 185, 129, 0.4)",
    icon: Dog,
    categories: ["Rações", "Brinquedos", "Higiene", "Petiscos"],
    products: [
      { name: "Ração Premium Cães Adultos 10kg", price: 149.90, image: "🐶" },
      { name: "Brinquedo Mordedor Resistente", price: 29.90, image: "🦴" },
      { name: "Shampoo Pet Hipoalergênico 500ml", price: 35.00, image: "🧴" },
      { name: "Bifinho Petisco de Carne 60g", price: 7.50, image: "🥩" }
    ],
    whatsappMessage: "*Novo Pedido - Pet Love & Cia* 🐾\n\n*Cliente:* Fernando Silva\n*Tipo:* Entrega\n\n*Itens:*\n- 1x Ração Premium Cães 10kg (R$ 149,90)\n- 2x Bifinho Petisco Carne (R$ 15,00)\n\n*Total:* R$ 164,90\n*Pagamento:* Cartão na Entrega"
  },
  varejo: {
    name: "Pequenos Varejistas",
    title: "Konnexy Fashion 🛍️",
    tagline: "Seu catálogo virtual, profissional e sob medida.",
    description: "Roupas, acessórios, artesanatos e eletrônicos. Crie categorias claras, gerencie variações de tamanho e cor sem mistério.",
    themeColor: "from-cyan-500 to-blue-700",
    glowColor: "rgba(6, 182, 212, 0.4)",
    icon: Shirt,
    categories: ["Camisetas", "Calças", "Acessórios", "Promoções"],
    products: [
      { name: "Camiseta Algodão Egípcio Minimal", price: 59.90, image: "👕" },
      { name: "Calça Jeans Slim Premium Flex", price: 129.90, image: "👖" },
      { name: "Boné Aba Curva Modern Casual", price: 45.00, image: "🧢" },
      { name: "Meia Cano Alto Knit Confort", price: 15.00, image: "🧦" }
    ],
    whatsappMessage: "*Novo Pedido - Konnexy Fashion* 🛍️\n\n*Cliente:* Amanda Costa\n*Tipo:* Entrega\n\n*Itens:*\n- 1x Camiseta Algodão Egípcio (R$ 59,90)\n- 1x Calça Jeans Slim (R$ 129,90)\n\n*Total:* R$ 189,80\n*Pagamento:* Pix\n*Endereço:* Rua Augusta, 850 - Apto 3"
  }
};

export function KonnexyLanding() {
  // Active Niche selector state
  const [activeNiche, setActiveNiche] = useState<string>("adegas");
  // Interactive Dashboard Tab state
  const [activeTab, setActiveTab] = useState<string>("geral");
  // Dashboard catalog mock toggle status state
  const [productActiveState, setProductActiveState] = useState<boolean[]>([true, true, true, false]);
  // Copy to clipboard notification state
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Phone simulation states
  const [simStep, setSimStep] = useState<number>(0);
  const [simCart, setSimCart] = useState<number[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Trigger toast alert
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Run catalog checkout simulation automatically when selected niche changes
  useEffect(() => {
    setSimStep(0);
    setSimCart([]);
    setIsSimulating(false);
  }, [activeNiche]);

  const handleStartSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(0);
    setSimCart([]);

    // Step 1: Add first item
    setTimeout(() => {
      setSimStep(1);
      setSimCart([0]);
      showToast("Produto adicionado ao carrinho!");

      // Step 2: Add second item
      setTimeout(() => {
        setSimStep(2);
        setSimCart([0, 2]);
        showToast("Segundo produto adicionado!");

        // Step 3: Open checkout drawer
        setTimeout(() => {
          setSimStep(3);
          
          // Step 4: Display final WhatsApp message layout
          setTimeout(() => {
            setSimStep(4);
            setIsSimulating(false);
          }, 3500);
        }, 2200);
      }, 2000);
    }, 1200);
  };

  // Handle clipboard copy
  const handleCopyLink = () => {
    setCopiedLink(true);
    showToast("Link copiado para a área de transferência!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleProduct = (idx: number) => {
    const nextState = [...productActiveState];
    nextState[idx] = !nextState[idx];
    setProductActiveState(nextState);
    showToast(nextState[idx] ? "Produto ativado no catálogo!" : "Produto pausado no catálogo!");
  };

  const activeConfig = NICHES[activeNiche];

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 font-sans selection:bg-[#00B4D8]/30 selection:text-white overflow-x-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-gradient-to-b from-[#0F2333]/15 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-20%] w-[60%] h-[500px] rounded-full bg-[#0D3A5F]/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[-20%] w-[60%] h-[600px] rounded-full bg-[#0E517A]/10 blur-[180px] pointer-events-none z-0" />

      {/* Styled Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <Navbar />

      {/* Floating Interactive Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-[200] bg-slate-900/90 border border-[#00B4D8]/30 px-6 py-3.5 rounded-full text-white text-sm font-medium shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-[#00B4D8] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-24 overflow-hidden z-10">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#0A1F30] border border-[#104D73]/40 text-[#00D4FF] text-xs font-semibold uppercase tracking-[0.2em] mb-8"
              >
                <Sparkles className="w-4.5 h-4.5 text-[#00D4FF]" />
                <span>O WhatsApp do seu negócio no próximo nível</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-black tracking-tight mb-6 font-display"
              >
                Venda mais pelo WhatsApp com um <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-[#00D4FF]">catálogo profissional</span>.
              </motion.h1>

              {/* Subheadline */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 font-normal leading-relaxed"
              >
                Transforme Instagram e WhatsApp em uma central organizada de pedidos, promoções e atendimento.
              </motion.p>

              {/* Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4.5 w-full sm:w-auto mb-10 justify-center lg:justify-start"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#0D5B80] to-[#0A3D58] hover:from-[#116F9C] hover:to-[#0D5073] text-white font-bold text-base h-14 rounded-2xl shadow-2xl shadow-[#0D5B80]/20 hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#00B4D8]/30"
                  asChild
                >
                  <a href="https://wa.me/5516991551200?text=Olá, vi o site da Konnexy e gostaria de criar meu catálogo." target="_blank" rel="noopener noreferrer">
                    Criar Meu Catálogo
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </a>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-800 bg-slate-950/40 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-slate-700 font-semibold text-base h-14 rounded-2xl backdrop-blur-md"
                  onClick={() => {
                    const el = document.getElementById("demonstracao");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Ver Demonstração
                </Button>
              </motion.div>

              {/* Trust badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3.5 text-xs text-slate-500 font-semibold uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00B4D8]" />
                  <span>Configurado em 24h</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-700 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-[#00B4D8]" />
                  <span>Sem mensalidades absurdas</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-700 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#00B4D8]" />
                  <span>Foco 100% no celular</span>
                </div>
              </motion.div>
            </div>

            {/* Right Side Mockups (Catalog & WhatsApp Parallel) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              
              {/* Decorative Glow */}
              <div className="absolute w-[400px] h-[400px] rounded-full bg-[#00D4FF]/5 blur-[120px] -z-10 animate-pulse-slow" />
              <div className="absolute w-[250px] h-[250px] rounded-full bg-[#0D5B80]/10 blur-[80px] -z-10 bottom-0 right-0" />

              {/* Main Showcase Container */}
              <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[4/5] flex items-center justify-center">
                
                {/* 1. Phone Frame with high-fidelity generated mockup */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, rotate: -2, y: 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: -2, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-[260px] sm:w-[290px] rounded-[3rem] border-[8px] border-[#0F1420] bg-[#05070B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/15 relative z-10 group"
                >
                  {/* Camera notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30" />
                  
                  {/* Content (Mockup Image) */}
                  <div className="relative w-full h-[480px] sm:h-[530px] overflow-hidden">
                    <img 
                      src="/catalog_hero_mockup.png" 
                      alt="Konnexy Premium Catalog Mockup"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </motion.div>

                {/* 2. Floating WhatsApp Order Bubble (overlapping) */}
                <motion.div
                  initial={{ opacity: 0, x: 40, y: 30 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
                  className="absolute -right-4 bottom-12 z-20 w-[220px] sm:w-[240px] bg-[#0B141F] border border-emerald-500/20 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] p-4 text-[10px] text-white flex flex-col gap-2.5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all"
                >
                  {/* WhatsApp contact info */}
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">✓</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[9px] truncate">Adega Express</div>
                      <div className="text-[7px] text-emerald-400 font-semibold leading-none mt-0.5">Novo Pedido Recebido!</div>
                    </div>
                  </div>

                  {/* Message details */}
                  <div className="font-sans space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-[9px]">
                    <div className="text-emerald-400 font-bold uppercase tracking-wider text-[7px] mb-1">DETALHES DO PEDIDO</div>
                    <div className="text-slate-300">
                      <span className="font-bold text-white">1x</span> Combo Gin Tanqueray + 4 Tônicas
                    </div>
                    <div className="text-slate-300">
                      <span className="font-bold text-white">1x</span> Vinho Cabernet Sauvignon 750ml
                    </div>
                    <div className="border-t border-white/5 pt-1.5 mt-1.5 flex items-center justify-between text-white font-bold">
                      <span>Total:</span>
                      <span className="text-[#00D4FF]">R$ 248,90</span>
                    </div>
                  </div>

                  {/* Floating Action */}
                  <div className="bg-[#25D366] text-slate-950 font-black text-[8px] py-1.5 text-center rounded-lg uppercase tracking-wider shadow-md flex items-center justify-center gap-1">
                    <MessageSquare className="w-3 h-3 fill-current" />
                    Enviar pelo WhatsApp
                  </div>
                </motion.div>

                {/* 3. Tiny Floating Pix / Trust Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -30, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -left-6 top-16 z-20 bg-slate-900/90 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 flex items-center gap-2.5 hover:scale-105 transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[#00D4FF]">
                    <Zap className="w-4.5 h-4.5 fill-current" />
                  </div>
                  <div>
                    <div className="text-[7.5px] text-slate-400 font-bold uppercase tracking-wider">PAGAMENTO RÁPIDO</div>
                    <div className="text-[10px] text-white font-black">Pix Integrado</div>
                  </div>
                </motion.div>
                
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DORES SECTION ("Ainda vende de forma desorganizada?") */}
      <section className="py-24 border-t border-white/5 bg-[#070A0F]/60 backdrop-blur-md relative z-10">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-display">
              Ainda vende de forma desorganizada?
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Vender manualmente pelas redes sociais consome seu tempo e afasta o cliente moderno que preza pela agilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
            
            {/* Pain Point 1 */}
            <div className="lg:col-span-2 group bg-[#0C0F16]/80 hover:bg-[#0E121C]/80 border border-white/5 hover:border-red-500/25 p-8 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-red-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-900/25 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <X className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">Pedidos Bagunçados</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Itens e detalhes anotados incorretamente em conversas compridas, gerando retrabalho e devoluções.
                </p>
              </div>
              {/* Simulated chat widget */}
              <div className="relative z-10 bg-slate-950/60 border border-white/5 rounded-2xl p-4.5 text-[11px] font-mono text-slate-450 space-y-2 mt-4 group-hover:border-red-500/10 transition-colors">
                <div className="text-red-400 text-[10px] font-bold">Cliente às 14:22:</div>
                <div className="text-slate-300">"Esqueci de avisar, o combo é com refrigerante zero e entrega rápida, por favor..."</div>
                <div className="text-red-400 text-[10px] font-bold mt-2">Você às 14:50:</div>
                <div className="text-slate-350">"Eita, já saiu com refrigerante comum..."</div>
              </div>
            </div>

            {/* Pain Point 2 */}
            <div className="lg:col-span-4 group bg-[#0C0F16]/80 hover:bg-[#0E121C]/80 border border-white/5 hover:border-red-500/25 p-8 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-red-500/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-900/25 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">Clientes perguntando preço toda hora</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Gastar 90% do seu tempo respondendo "qual o valor?", "tem frete?" e enviando fotos repetidas.
                </p>
              </div>
              {/* Simulated visual */}
              <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
                {[
                  { q: "Quanto tá?", t: "14:02" },
                  { q: "Tem fotos?", t: "14:05" },
                  { q: "Qual valor?", t: "14:10" },
                  { q: "Ainda tem?", t: "14:15" }
                ].map((item, index) => (
                  <div key={index} className="bg-slate-950/60 border border-white/5 group-hover:border-red-500/10 rounded-2xl p-3 text-[10px] flex items-center justify-between text-slate-400 font-mono transition-colors">
                    <span>"{item.q}"</span>
                    <span className="text-red-500/70 font-bold">{item.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pain Point 3 */}
            <div className="lg:col-span-2 group bg-[#0C0F16]/80 hover:bg-[#0E121C]/80 border border-white/5 hover:border-red-500/25 p-8 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-red-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-red-950/40 border border-red-900/25 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Tag className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-base font-bold mb-2.5 text-white">Promoções perdidas</h3>
                <p className="text-xs.5 text-slate-400 leading-relaxed">
                  Postagens promocionais de Stories que desaparecem e ofertas enterradas sob centenas de mensagens antigas.
                </p>
              </div>
            </div>

            {/* Pain Point 4 */}
            <div className="lg:col-span-2 group bg-[#0C0F16]/80 hover:bg-[#0E121C]/80 border border-white/5 hover:border-red-500/25 p-8 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-red-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-red-950/40 border border-red-900/25 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-base font-bold mb-2.5 text-white">Atendimento lento</h3>
                <p className="text-xs.5 text-slate-400 leading-relaxed">
                  Clientes esperando horas por respostas básicas de preço ou frete e acabando comprando da concorrência.
                </p>
              </div>
            </div>

            {/* Pain Point 5 */}
            <div className="lg:col-span-2 group bg-[#0C0F16]/80 hover:bg-[#0E121C]/80 border border-white/5 hover:border-red-500/25 p-8 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-red-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-red-950/40 border border-red-900/25 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Instagram className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-base font-bold mb-2.5 text-white">Fotos Espalhadas</h3>
                <p className="text-xs.5 text-slate-400 leading-relaxed">
                  Fotos perdidas no feed do Instagram, sem botão de compra ou informação de tamanho, gerando atrito para o cliente.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SOLUÇÃO SECTION */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-display">
              O cliente escolhe. O pedido chega pronto.
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Em apenas três passos rápidos, sua operação de vendas se torna totalmente digitalizada, reduzindo erros a zero.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            
            {/* Connector line */}
            <div className="hidden md:block absolute top-[44px] left-[15%] w-[70%] h-[2px] bg-gradient-to-r from-[#00D4FF]/20 via-[#0D5B80]/40 to-[#22C55E]/20 -z-10" />

            {/* Step 1 */}
            <div className="bg-[#0C0F16]/80 border border-white/5 p-6 rounded-2xl relative text-center">
              <div className="w-14 h-14 rounded-full bg-[#0E1B29] border border-[#104D73] text-[#00B4D8] flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-xl shadow-[#00B4D8]/5">
                1
              </div>
              <h3 className="text-base font-bold mb-2.5">Catálogo Digital</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Você compartilha o link profissional do seu catálogo no Instagram e no WhatsApp.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0C0F16]/80 border border-white/5 p-6 rounded-2xl relative text-center">
              <div className="w-14 h-14 rounded-full bg-[#0E1B29] border border-[#104D73] text-[#00B4D8] flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-xl shadow-[#00B4D8]/5">
                2
              </div>
              <h3 className="text-base font-bold mb-2.5">Navegação e Categorias</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O cliente acessa, filtra por categorias, visualiza produtos e monta o carrinho de pedidos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0C0F16]/80 border border-white/5 p-6 rounded-2xl relative text-center">
              <div className="w-14 h-14 rounded-full bg-[#0E1B29] border border-[#104D73] text-[#00B4D8] flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-xl shadow-[#00B4D8]/5">
                3
              </div>
              <h3 className="text-base font-bold mb-2.5">Pedido Automático</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O carrinho calcula os valores de frete e subtotal, direcionando o pedido pronto no seu WhatsApp.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#0C0F16]/80 border border-white/5 p-6 rounded-2xl relative text-center">
              <div className="w-14 h-14 rounded-full bg-[#0F2D24] border border-[#16604D] text-[#22C55E] flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-xl shadow-green-500/5">
                4
              </div>
              <h3 className="text-base font-bold mb-2.5">Compartilhamento Fácil</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Em segundos, envie a chave PIX e atualize o status de entrega do pedido com mensagens pré-formatadas.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SEÇÃO DE NICHOS (Interactive Simulator) */}
      <section className="py-24 border-t border-white/5 bg-[#070A0F]/60 backdrop-blur-md relative z-10">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-display">
              Uma única plataforma. Múltiplos nichos.
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Personalize o catálogo com as cores, categorias e produtos perfeitos para o seu ramo de atuação.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Interactive Niche list */}
            <div className="lg:col-span-7 space-y-4">
              {Object.keys(NICHES).map((key) => {
                const config = NICHES[key];
                const Icon = config.icon;
                const isSelected = activeNiche === key;
                return (
                  <div
                    key={key}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveNiche(key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveNiche(key);
                      }
                    }}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-5 items-start group focus:outline-none focus:ring-1 focus:ring-[#00D4FF]/20 ${
                      isSelected 
                        ? 'bg-[#0E1524] border-[#0D5B80] shadow-2xl' 
                        : 'bg-[#080B10] border-white/5 hover:border-slate-800'
                    }`}
                  >
                    <div className={`p-3 rounded-xl border shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-[#104C70]/30 border-[#0D5B80] text-[#00D4FF]' 
                        : 'bg-slate-900 border-white/5 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-base text-white">{config.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D4FF] bg-[#00D4FF]/10 px-2.5 py-0.5 rounded-full">
                            Selecionado
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {config.tagline}
                      </p>
                      
                      {/* Sub-details visible only when active */}
                      {isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-white/5 space-y-4"
                        >
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {config.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button 
                              size="sm" 
                              className="bg-[#00D4FF] hover:bg-[#00B4D8] text-slate-950 font-black text-xs px-4 h-9 uppercase tracking-wider flex items-center gap-1.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartSimulation();
                              }}
                              disabled={isSimulating}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              {isSimulating ? "Simulando..." : "Ver Exemplo"}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Custom Phone Mockup Visualizer */}
            <div className="lg:col-span-5 flex justify-center">
              
              <div className="relative">
                {/* Visual Glow */}
                <div 
                  className="absolute inset-0 w-[300px] h-[300px] rounded-full blur-[100px] -z-10 transition-all duration-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                  style={{ backgroundColor: activeConfig.glowColor }}
                />

                {/* Smartphone container */}
                <div className="relative w-[280px] sm:w-[300px] rounded-[2.8rem] border-[8px] border-[#0E131F] bg-[#080B10] shadow-3xl overflow-hidden ring-1 ring-white/15">
                  
                  {/* Status Bar */}
                  <div className="h-6.5 bg-[#0E131F] flex items-center justify-between px-7 text-[8px] text-slate-500 font-bold">
                    <span>12:00</span>
                    <div className="w-16 h-3.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-2 bg-slate-600 rounded-2xs" />
                    </div>
                  </div>

                  {/* Top Bar simulating active theme */}
                  <div className={`p-4 bg-gradient-to-r ${activeConfig.themeColor} text-white flex items-center justify-between relative shadow-lg`}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center font-bold text-xs shadow-md">
                        {activeConfig.name[0]}
                      </div>
                      <div>
                        <div className="font-black text-xs leading-none">{activeConfig.title}</div>
                        <div className="text-[7px] font-bold text-white/80 uppercase tracking-widest mt-1">
                          Catalogo Konnexy
                        </div>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                      🔍
                    </div>
                  </div>

                  {/* Catalog simulated content */}
                  <div className="bg-[#07090F] h-[400px] overflow-y-auto scroll-hide p-3.5 space-y-4">
                    
                    {/* Catalog banner info */}
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <div className="text-[8px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                        📍 Atendimento & Entrega
                      </div>
                      <div className="text-[10px] font-bold flex justify-between">
                        <span>WhatsApp Vendas</span>
                        <span className="text-green-400 font-mono">Disponível</span>
                      </div>
                    </div>

                    {/* Category tabs */}
                    <div className="flex gap-2 overflow-x-auto scroll-hide pb-0.5">
                      {activeConfig.categories.map((cat, idx) => (
                        <span 
                          key={idx} 
                          className={`px-3 py-1 rounded-full text-[7px] font-bold uppercase tracking-wider shrink-0 ${
                            idx === 0 
                              ? `bg-gradient-to-r ${activeConfig.themeColor} text-white`
                              : "bg-slate-900 text-slate-400 border border-white/5"
                          }`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Products Grid */}
                    <div className="space-y-2.5">
                      {activeConfig.products.map((prod, idx) => {
                        const isAdded = simCart.includes(idx);
                        return (
                          <div 
                            key={idx} 
                            className={`p-2.5 rounded-xl border flex gap-3 items-center justify-between transition-all duration-300 ${
                              isAdded 
                                ? "bg-slate-900 border-green-500/40" 
                                : "bg-slate-900/50 border-white/5 hover:border-slate-800"
                            }`}
                          >
                            <div className="w-12 h-12 bg-slate-850 rounded-lg flex items-center justify-center text-2xl border border-white/5">
                              {prod.image}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-[9px] text-slate-200 truncate">{prod.name}</h4>
                              <p className="font-black text-xs mt-1 text-slate-100 font-mono">
                                R$ {prod.price.toFixed(2)}
                              </p>
                            </div>
                            <button 
                              className={`px-2.5 py-1.5 rounded-md font-bold text-[7px] uppercase tracking-wider transition-all cursor-pointer ${
                                isAdded 
                                  ? "bg-green-500 text-white" 
                                  : `bg-gradient-to-r ${activeConfig.themeColor} text-white shadow-md`
                              }`}
                            >
                              {isAdded ? "Adicionado" : "Adicionar"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shopping cart summary bar bottom */}
                  <AnimatePresence>
                    {simStep >= 1 && simStep < 4 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute bottom-0 inset-x-0 bg-slate-950/95 border-t border-white/10 p-3 flex items-center justify-between z-20 backdrop-blur-md"
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <ShoppingCart className="w-5 h-5 text-[#00D4FF]" />
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                              {simCart.length}
                            </span>
                          </div>
                          <div className="text-[8px]">
                            <div className="font-bold">Total do carrinho</div>
                            <div className="text-[#00D4FF] font-black font-mono">
                              R$ {simCart.reduce((sum, idx) => sum + activeConfig.products[idx].price, 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <button className="bg-green-500 text-white font-black text-[8px] px-3.5 py-2 rounded-lg uppercase tracking-wider shadow-lg shadow-green-500/20 flex items-center gap-1">
                          Enviar no WhatsApp
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Simulated WhatsApp screen layer */}
                  <AnimatePresence>
                    {simStep === 4 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0B141F] z-35 flex flex-col pt-6"
                      >
                        {/* Custom WA Header */}
                        <div className="bg-[#075E54] p-3.5 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs">📲</div>
                          <div>
                            <div className="font-bold text-[9.5px] text-white">{activeConfig.title}</div>
                            <div className="text-[6.5px] text-green-300">Online</div>
                          </div>
                        </div>
                        {/* Chat Messages */}
                        <div className="flex-1 p-3.5 space-y-3.5 flex flex-col justify-end">
                          <div className="bg-slate-900/40 border border-white/5 py-1 text-[7.5px] text-center text-slate-500 rounded-full mx-auto px-4">
                            Hoje
                          </div>
                          
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-[#056162] text-white p-3 rounded-xl text-[7px] font-mono leading-relaxed max-w-[85%] ml-auto shadow-md border border-white/5 space-y-1"
                          >
                            {activeConfig.whatsappMessage.split('\n').map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </motion.div>
                          
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 }}
                            className="bg-green-500/10 border border-green-500/20 text-green-400 text-[8.5px] py-2 px-3 rounded-lg text-center font-bold"
                          >
                            ✓ Mensagem enviada com sucesso!
                          </motion.div>
                        </div>
                        
                        {/* Simulation complete close button */}
                        <div className="p-3 bg-slate-950 border-t border-white/5">
                          <Button 
                            className="w-full bg-slate-900 border border-white/5 text-xs text-slate-400 hover:text-white"
                            onClick={() => setSimStep(0)}
                          >
                            Reiniciar Simulação
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. FUNCIONALIDADES (Bento Grid) */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-display">
              Recursos modernos para impulsionar suas vendas
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Esqueça planilhas e anotações em papel. Gerencie seu catálogo, estoque e promoções com total simplicidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#0C0F16] border border-white/5 p-8 rounded-3xl hover:border-[#0D5B80]/30 transition-all duration-300 flex flex-col justify-between group shadow-2xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0E1D2D] border border-[#104D73] text-[#00D4FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Grid className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">Catálogo Digital</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Crie categorias, insira preços e fotos em alta definição em um link personalizado feito sob medida para mobile.
                </p>
              </div>
              <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-4 flex gap-3.5 items-center">
                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center border border-white/5">🍔</div>
                <div className="flex-1">
                  <div className="h-2.5 w-16 bg-slate-800 rounded mb-1.5" />
                  <div className="h-2.5 w-24 bg-slate-800 rounded" />
                </div>
                <span className="text-[#00D4FF] font-black text-xs font-mono">R$ 29,90</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0C0F16] border border-white/5 p-8 rounded-3xl hover:border-[#0D5B80]/30 transition-all duration-300 flex flex-col justify-between group shadow-2xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0E1D2D] border border-[#104D73] text-[#00D4FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">Pedido Automático</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Receba pedidos inteiramente estruturados no WhatsApp contendo taxa de entrega, método de pagamento e lista de produtos.
                </p>
              </div>
              <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-4 text-[10px] font-mono text-emerald-400 space-y-1">
                <div>*PRODUTOS:* 1x Burguer + Fritas</div>
                <div>*ENTREGA:* Av. Central, 500</div>
                <div className="font-bold text-white">*TOTAL: R$ 34,90*</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0C0F16] border border-white/5 p-8 rounded-3xl hover:border-[#0D5B80]/30 transition-all duration-300 flex flex-col justify-between group shadow-2xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0E1D2D] border border-[#104D73] text-[#00D4FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Tag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">Cupons e Promoções</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Apresente banners chamativos no topo e crie cupons de desconto exclusivos para impulsionar suas campanhas nas redes sociais.
                </p>
              </div>
              <div className="bg-slate-950/60 rounded-2xl border border-[#00B4D8]/20 p-4.5 text-center flex flex-col gap-2 items-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#00D4FF]">Cupom de Primeira Compra</span>
                <span className="bg-[#00D4FF]/10 text-[#00D4FF] text-xs font-black px-4 py-1 border border-[#00B4D8]/30 rounded-md font-mono">KONNEXY10</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#0C0F16] border border-white/5 p-8 rounded-3xl hover:border-[#0D5B80]/30 transition-all duration-300 flex flex-col justify-between group shadow-2xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0E1D2D] border border-[#104D73] text-[#00D4FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">Link para Bio</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Um agregador de links profissional integrado que direciona os clientes do Instagram diretamente ao seu catálogo oficial.
                </p>
              </div>
              <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-4.5 space-y-2">
                <div className="bg-slate-900 border border-white/5 py-1.5 rounded-lg text-center text-[9px] font-bold">🛒 Fazer Pedido Online</div>
                <div className="bg-slate-900 border border-white/5 py-1.5 rounded-lg text-center text-[9px] font-bold">💬 Falar com Atendente</div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#0C0F16] border border-white/5 p-8 rounded-3xl hover:border-[#0D5B80]/30 transition-all duration-300 flex flex-col justify-between group shadow-2xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0E1D2D] border border-[#104D73] text-[#00D4FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">Compartilhamento Fácil</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Compartilhe links específicos de categorias ou produtos direto nas suas campanhas publicitárias ou stories do Instagram.
                </p>
              </div>
              <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-4.5 flex items-center justify-between gap-4">
                <span className="text-[9px] truncate text-slate-500 font-mono">konnexy.app/p/combo-artesanal</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8.5 rounded-lg border-slate-800 text-[10px] px-3 font-semibold shrink-0 cursor-pointer flex items-center gap-1.5"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedLink ? "Copiado!" : "Copiar"}
                </Button>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#0C0F16] border border-white/5 p-8 rounded-3xl hover:border-[#0D5B80]/30 transition-all duration-300 flex flex-col justify-between group shadow-2xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0E1D2D] border border-[#104D73] text-[#00D4FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">Atendimento Organizado</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Monitore a evolução dos pedidos do recebimento até o status de saída para entrega sem perder nenhuma notificação.
                </p>
              </div>
              <div className="flex gap-2.5 justify-center mt-2.5">
                <span className="bg-[#1E293B] border border-slate-700 text-slate-300 text-[9px] px-3 py-1 rounded-full font-bold">Pendente</span>
                <span className="bg-[#1E3A8A] border border-blue-800 text-blue-300 text-[9px] px-3 py-1 rounded-full font-bold">Preparando</span>
                <span className="bg-[#064E3B] border border-emerald-800 text-green-300 text-[9px] px-3 py-1 rounded-full font-bold">Saiu para Entrega</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. DEMONSTRAÇÃO (Interactive Owner Dashboard Panel) */}
      <section id="demonstracao" className="py-24 border-t border-white/5 bg-[#070A0F]/60 backdrop-blur-md relative z-10">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-display">
              Veja funcionando na prática
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Experimente a facilidade de gerenciar produtos, preços e pedidos em tempo real através da nossa central administrativa.
            </p>
          </div>

          {/* Interactive Owner Board Frame */}
          <div className="bg-[#0C0F16] border border-white/5 rounded-3xl overflow-hidden shadow-3xl max-w-4xl mx-auto">
            {/* Header / Mac OS dots */}
            <div className="bg-[#080B10] p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Painel Administrativo Konnexy</span>
              <div className="w-12 h-4" /> {/* Spacer */}
            </div>

            {/* Content area: Sidebar + Main Content */}
            <div className="grid md:grid-cols-4 min-h-[460px]">
              
              {/* Sidebar Menu */}
              <div className="bg-[#080B10]/80 p-5 border-r border-white/5 space-y-2">
                {[
                  { id: "geral", label: "Visão Geral", icon: LayoutDashboard },
                  { id: "produtos", label: "Gerenciar Catálogo", icon: Grid },
                  { id: "pedidos", label: "Painel de Pedidos", icon: ShoppingCart }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#104C70]/30 border border-[#0D5B80]/40 text-[#00D4FF]' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-3 p-8 bg-[#0C0F16]">
                <AnimatePresence mode="wait">
                  
                  {/* Tab 1: Visão Geral */}
                  {activeTab === "geral" && (
                    <motion.div 
                      key="geral"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Vendas Hoje</span>
                          <div className="text-lg font-black text-white font-mono">R$ 1.480,90</div>
                          <span className="text-[8px] text-green-400 font-bold block mt-1">+12% vs ontem</span>
                        </div>
                        <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Pedidos</span>
                          <div className="text-lg font-black text-white font-mono">48</div>
                          <span className="text-[8px] text-green-400 font-bold block mt-1">4 pendentes</span>
                        </div>
                        <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Visualizações</span>
                          <div className="text-lg font-black text-[#00D4FF] font-mono">1.240</div>
                          <span className="text-[8px] text-slate-500 font-bold block mt-1">Taxa conv. 3.8%</span>
                        </div>
                      </div>

                      {/* Performance Graphic Placeholder styled cleanly */}
                      <div className="bg-slate-950/60 border border-white/5 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Desempenho Semanal</span>
                          <span className="text-[9px] font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Crescimento constante</span>
                        </div>
                        
                        {/* Custom visual curve lines representing chart using pure HTML/CSS */}
                        <div className="h-32 flex items-end justify-between pt-4 gap-2 relative">
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="border-b border-white/5 w-full h-[1px]" />
                            <div className="border-b border-white/5 w-full h-[1px]" />
                            <div className="border-b border-white/5 w-full h-[1px]" />
                          </div>
                          {[
                            { day: "Seg", h: "40%" },
                            { day: "Ter", h: "55%" },
                            { day: "Qua", h: "35%" },
                            { day: "Qui", h: "70%" },
                            { day: "Sex", h: "85%" },
                            { day: "Sáb", h: "100%" },
                            { day: "Dom", h: "90%" }
                          ].map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center z-10">
                              <div 
                                className="w-full bg-gradient-to-t from-[#0D5B80] to-[#00D4FF] rounded-t-md relative group cursor-pointer"
                                style={{ height: d.h }}
                              >
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white font-mono text-[8px] py-0.5 px-1.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {d.h}
                                </div>
                              </div>
                              <span className="text-[8px] text-slate-500 font-bold uppercase mt-2">{d.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 2: Gerenciar Catálogo */}
                  {activeTab === "produtos" && (
                    <motion.div 
                      key="produtos"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300">Catálogo Principal</span>
                        <Button size="sm" className="bg-[#00D4FF] hover:bg-[#00B4D8] text-slate-950 font-black text-[9px] uppercase tracking-wider px-3 h-8.5">
                          + Novo Produto
                        </Button>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          { name: "Combo Gin Tanqueray + 4 Tônicas", price: 159.00, cat: "Combos", emoji: "🍹" },
                          { name: "Vinho Cabernet Sauvignon 750ml", price: 89.90, cat: "Vinhos", emoji: "🍷" },
                          { name: "Cerveja Artesanal IPA Caneca", price: 18.90, cat: "Cervejas", emoji: "🍺" },
                          { name: "Carvão Eucalipto Saco 4kg", price: 22.00, cat: "Conveniência", emoji: "🪵" }
                        ].map((prod, idx) => {
                          const isActive = productActiveState[idx];
                          return (
                            <div key={idx} className="bg-slate-950/60 border border-white/5 p-3.5 rounded-xl flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center border border-white/5 text-lg">
                                  {prod.emoji}
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs leading-none mb-1 text-slate-200">{prod.name}</h4>
                                  <span className="text-[8px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                    {prod.cat}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-5">
                                <span className="font-black font-mono text-xs text-white">R$ {prod.price.toFixed(2)}</span>
                                <button
                                  onClick={() => handleToggleProduct(idx)}
                                  className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                                    isActive ? "bg-green-500" : "bg-slate-800"
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                    isActive ? "translate-x-5" : "translate-x-0"
                                  }`} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 3: Painel de Pedidos */}
                  {activeTab === "pedidos" && (
                    <motion.div 
                      key="pedidos"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-4"
                    >
                      <span className="text-xs font-bold text-slate-300 block mb-2">Pedidos Recentes (WhatsApp)</span>

                      <div className="space-y-2.5">
                        {[
                          { id: "#1084", client: "Roberto Lima", items: "1x Vinho Cab., 1x Combo Gin", total: 248.90, status: "Pendente", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                          { id: "#1083", client: "Maria Helena", items: "2x Terço de Madeira, 1x Vela Aromática", total: 84.70, status: "Preparando", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                          { id: "#1082", client: "Ana Julia", items: "1x Bento Cake, 1x Caixa Doces", total: 83.00, status: "Aprovado", color: "text-green-400 bg-green-500/10 border-green-500/20" }
                        ].map((order, idx) => (
                          <div key={idx} className="bg-slate-950/60 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] font-black text-slate-500">{order.id}</span>
                                <span className="font-bold text-xs text-white">{order.client}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate max-w-[220px]">{order.items}</p>
                            </div>
                            <div className="flex items-center gap-4.5">
                              <div className="text-right">
                                <div className="font-black text-xs text-white font-mono">R$ {order.total.toFixed(2)}</div>
                                <span className="text-[8px] text-slate-500 block">WhatsApp</span>
                              </div>
                              <span className={`text-[8.5px] font-bold px-2.5 py-0.5 rounded-full border ${order.color}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 7. BENEFÍCIOS (Grid structure) */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 font-display">
                Toda a infraestrutura de vendas, sem complicação.
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Desenvolvemos o Konnexy com foco absoluto na usabilidade do pequeno varejista. Sem taxas surpresas, sem configuração confusa e sem a necessidade de baixar novos aplicativos.
              </p>

              {/* Grid checklists */}
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "Sem complicação", desc: "Configuramos tudo para o seu negócio." },
                  { title: "Fácil de usar", desc: "Foco total na usabilidade móvel." },
                  { title: "Sem comissão", desc: "100% do valor da venda fica com você." },
                  { title: "Sem app extra", desc: "Funciona direto no navegador do cliente." },
                  { title: "Instagram Otimizado", desc: "Link direto da bio para o carrinho." },
                  { title: "Pedidos organizados", desc: "Sem conversas confusas ou perdidas." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-5.5 h-5.5 rounded-full bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF] shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white mb-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual element: Premium Grid Layout with tags */}
            <div className="bg-[#0C0F16] border border-white/5 p-8 rounded-3xl relative shadow-2xl overflow-hidden flex flex-col justify-center min-h-[340px]">
              {/* Backglow */}
              <div className="absolute w-[200px] h-[200px] bg-[#00D4FF]/5 rounded-full blur-[80px] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              
              <div className="space-y-6 max-w-sm mx-auto text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00D4FF]">DIFERENCIAL DE ENTRADA</span>
                <h3 className="text-2xl font-black font-display text-white">Pronto para vender hoje mesmo.</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Não perca mais tempo tentando programar sites complicados. Com o Konnexy, seu catálogo entra no ar em até 24h pronto para receber pedidos.
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <div className="bg-slate-900 border border-white/5 py-2 px-4 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">SETUP INCLUÍDO</span>
                  </div>
                  <div className="bg-slate-900 border border-white/5 py-2 px-4 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">SUPORTE VIA WHATSAPP</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* 8. COMO FUNCIONA (Timeline) */}
      <section id="como-funciona" className="py-24 border-t border-white/5 bg-[#070A0F]/30 relative overflow-hidden z-10">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#00D4FF]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="container px-6 mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4FF] mb-3 block">Linha do Tempo</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 font-display text-white">
              Como funciona o Konnexy?
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Em apenas três etapas simples, sua loja está configurada e pronta para receber pedidos direto no WhatsApp.
            </p>
          </div>

          <div className="relative">
            {/* Center line for desktop timeline */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00D4FF]/20 via-[#0D5B80]/40 to-[#00D4FF]/10" />

            <div className="space-y-16 lg:space-y-24 relative">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
              >
                <div className="lg:w-1/2 lg:text-right flex flex-col items-center lg:items-end order-2 lg:order-1">
                  <span className="text-[10px] font-black text-[#00D4FF] bg-[#00D4FF]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-3">Passo 1</span>
                  <h3 className="text-xl font-bold text-white mb-3">Cadastre seus produtos</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md lg:text-right text-center">
                    Crie categorias claras e adicione fotos, preços e variações em poucos cliques. Nosso painel é 100% otimizado para celular.
                  </p>
                </div>
                {/* Timeline node */}
                <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-[#00D4FF] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#00D4FF]/10 z-10 shrink-0 order-1 lg:order-2">
                  1
                </div>
                <div className="lg:w-1/2 order-3">
                  <div className="bg-[#0C0F16] border border-white/5 p-6 rounded-2xl max-w-md mx-auto lg:mx-0 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0D5B80]/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0D5B80]/40" />
                    </div>
                    <div className="h-20 bg-slate-950/60 rounded-xl border border-white/5 flex items-center justify-center border-dashed text-slate-500 text-xs font-medium">
                      + Adicionar Novo Produto
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
              >
                <div className="lg:w-1/2 order-2 lg:order-1 lg:block hidden" />
                {/* Timeline node */}
                <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-[#00D4FF] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#00D4FF]/10 z-10 shrink-0 order-1">
                  2
                </div>
                <div className="lg:w-1/2 flex flex-col items-center lg:items-start order-2 lg:order-3">
                  <span className="text-[10px] font-black text-[#00D4FF] bg-[#00D4FF]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-3">Passo 2</span>
                  <h3 className="text-xl font-bold text-white mb-3">Compartilhe seu link</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md lg:text-left text-center">
                    Coloque o link do seu catálogo digital na biografia do seu Instagram ou envie diretamente no WhatsApp para seus clientes.
                  </p>
                </div>
                <div className="lg:w-1/2 order-3 lg:hidden block">
                  <div className="bg-[#0C0F16] border border-white/5 p-6 rounded-2xl max-w-md mx-auto shadow-xl">
                    <div className="bg-slate-950/60 px-4 py-3.5 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono text-[#00D4FF]">
                      <span>konnexy.app/sua-loja</span>
                      <Copy className="w-4.5 h-4.5 text-slate-500 cursor-pointer hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
                {/* Desktop layout for step 2 visual on left */}
                <div className="lg:w-1/2 lg:block hidden order-1">
                  <div className="bg-[#0C0F16] border border-white/5 p-6 rounded-2xl max-w-md ml-auto shadow-xl">
                    <div className="bg-slate-950/60 px-4 py-3.5 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono text-[#00D4FF]">
                      <span>konnexy.app/sua-loja</span>
                      <Copy className="w-4.5 h-4.5 text-slate-500 cursor-pointer hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
              >
                <div className="lg:w-1/2 lg:text-right flex flex-col items-center lg:items-end order-2 lg:order-1">
                  <span className="text-[10px] font-black text-[#00D4FF] bg-[#00D4FF]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-3">Passo 3</span>
                  <h3 className="text-xl font-bold text-white mb-3">Receba pedidos organizados</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md lg:text-right text-center">
                    Seu cliente navega pelo catálogo e monta o pedido. Você recebe tudo resumido no WhatsApp, pronto para finalizar.
                  </p>
                </div>
                {/* Timeline node */}
                <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-[#00D4FF] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#00D4FF]/10 z-10 shrink-0 order-1 lg:order-2">
                  3
                </div>
                <div className="lg:w-1/2 order-3">
                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-2xl max-w-md mx-auto lg:mx-0 shadow-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</div>
                    <div>
                      <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">WHATSAPP RECEBIDO</div>
                      <div className="text-xs text-white font-semibold">"Novo pedido feito pelo catálogo!"</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECTION — DEPOIMENTOS (Testimonials) */}
      <section id="depoimentos" className="py-24 border-t border-white/5 relative z-10 bg-[#05070B]">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4FF] mb-3 block">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-display text-white">
              Quem usa, recomenda o Konnexy
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Veja como donos de negócios locais transformaram suas vendas e organizaram sua rotina.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="group bg-[#0C0F16]/80 hover:bg-[#0E121C]/80 border border-white/5 hover:border-[#00D4FF]/20 p-8 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#00D4FF]/5 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-6 text-amber-500">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic mb-8">
                  "Antes do Konnexy, meus atendentes passavam o dia enviando fotos de garrafas de vinho e preços individuais. Hoje o cliente monta o carrinho direto no link da bio e o pedido cai no nosso sistema 100% resumido. As vendas da adega aumentaram em 35%."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0D5B80] flex items-center justify-center font-bold text-white text-sm shadow-md">
                  RL
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Roberto Lima</h4>
                  <p className="text-xs text-[#00D4FF] font-semibold">Adega Express 🍷</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group bg-[#0C0F16]/80 hover:bg-[#0E121C]/80 border border-white/5 hover:border-[#00D4FF]/20 p-8 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#00D4FF]/5 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-6 text-amber-500">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic mb-8">
                  "Expor nossos terços e velas aromáticas com clareza era um desafio no Instagram. Com o catálogo digital do Konnexy, criamos uma vitrine profissional e cheia de respeito. Nossos fiéis compram com muito mais facilidade."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0D5B80] flex items-center justify-center font-bold text-white text-sm shadow-md">
                  MH
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Maria Helena</h4>
                  <p className="text-xs text-[#00D4FF] font-semibold">Luz & Fé Artigos 📿</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group bg-[#0C0F16]/80 hover:bg-[#0E121C]/80 border border-white/5 hover:border-[#00D4FF]/20 p-8 rounded-3xl transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#00D4FF]/5 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-6 text-amber-500">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic mb-8">
                  "Fazer bolos gourmet sob encomenda exige organização na agenda. O Konnexy nos ajudou a padronizar as informações dos pedidos (sabor, tamanho, data de entrega, taxa) direto no carrinho. Sem erros de produção."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0D5B80] flex items-center justify-center font-bold text-white text-sm shadow-md">
                  AJ
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Ana Julia</h4>
                  <p className="text-xs text-[#00D4FF] font-semibold">Ateliê do Doce Gourmet 🧁</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA FINAL */}
      <section className="py-28 bg-gradient-to-b from-slate-950 to-[#070A0F] border-t border-white/5 relative overflow-hidden z-10">
        
        {/* Soft petroleum blue radial leaks */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[300px] rounded-full bg-[#00D4FF]/5 blur-[120px] pointer-events-none" />

        <div className="container px-6 mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00D4FF]">Comece agora</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight font-display leading-[1.1]">
              Seu Instagram pode vender muito mais.
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Transforme cliques em clientes recorrentes e decole seu faturamento no WhatsApp com um catálogo de elite.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="xl" 
                className="bg-green-500 hover:bg-green-600 text-white font-bold h-16 px-10 rounded-2xl shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-0 flex items-center gap-3.5"
                asChild
              >
                <a href="https://wa.me/5516991551200?text=Olá, vi o site da Konnexy e quero começar agora!" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-6 h-6 fill-current" />
                  Começar Agora
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-6">
              <span>✓ Sem taxa de configuração</span>
              <span>✓ Configurado em até 24h</span>
              <span>✓ Suporte humanizado</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5516991551200?text=Olá, vi o site da Konnexy e gostaria de entender como funciona." 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14.5 h-14.5 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 hover:scale-110 active:scale-95 transition-all z-50 animate-bounce hover:animate-none"
        aria-label="Atendimento via WhatsApp"
      >
        <MessageSquare className="w-7 h-7 fill-current" />
      </a>

      <Footer />
    </div>
  );
}
