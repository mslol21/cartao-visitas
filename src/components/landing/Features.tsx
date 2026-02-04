"use client";

import { 
  Smartphone, 
  Share2, 
  MessageCircle, 
  Palette, 
  Zap, 
  Target,
  BarChart3,
  Globe,
  PenTool,
  Play,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile-First Experience',
    description: 'Projetado especificamente para o comportamento do usuário mobile. Carregamento instantâneo em qualquer dispositivo.',
  },
  {
    icon: Play,
    title: 'Perfil com Fundo em Vídeo',
    description: 'Vá além das fotos estáticas. No Plano Pro, você pode subir vídeos de até 10 segundos que rodam em loop no fundo do seu perfil, criando uma conexão imediata e profissional com seu cliente.',
    badge: 'Premium',
    featured: true
  },
  {
    icon: Target,
    title: 'Foco em Conversão',
    description: 'Botões estrategicamente posicionados para levar seu cliente direto ao fechamento via WhatsApp ou Site.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Avançado',
    description: 'Acompanhe quantos cliques e visitas seu cartão recebe. Saiba exatamente de onde vem seu tráfego.',
  },
  {
    icon: Palette,
    title: 'Design Premium',
    description: 'Estética minimalista e moderna. Cause uma primeira impressão poderosa sem precisar contratar um designer.',
  },
  {
    icon: Globe,
    title: 'SEO Profissional',
    description: 'Seu perfil indexado corretamente no Google para que clientes te encontrem localmente com facilidade.',
  },
  {
    icon: PenTool,
    title: 'Customização Total',
    description: 'Altere cores, serviços, links e fotos em tempo real. Seu cartão evolui junto com o seu negócio.',
  },
  {
    icon: ShieldCheck,
    title: 'Perfil Verificado',
    description: 'Passe mais confiança para o seu cliente final. O selo de verificado no seu perfil Konnexy mostra que você é um profissional sério e estabelecido, aumentando as chances de fechar o orçamento logo no primeiro contato.',
    badge: 'Confiança'
  },
];

export function Features() {
  return (
    <section id="como-funciona" className="py-32 relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Funcionalidades</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Muito mais que um <br /> 
            <span className="gradient-text">simples link na bio.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            Entregamos a infraestrutura completa para você gerenciar sua presença digital profissional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "group p-10 rounded-[2.5rem] transition-all duration-300 relative overflow-hidden",
                feature.featured 
                  ? "bg-primary/5 border-primary/20 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.1)]" 
                  : "bg-slate-50 dark:bg-slate-900 border border-border/50"
              )}
            >
              {feature.badge && (
                <div className="absolute top-8 left-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest z-20">
                  <Sparkles className="w-2.5 h-2.5" />
                  {feature.badge}
                </div>
              )}
              
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform">
                 <feature.icon className="w-32 h-32" />
              </div>
              <div className={cn(
                "w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform",
                feature.badge ? "bg-primary text-white" : "bg-white dark:bg-slate-800"
              )}>
                <feature.icon className={cn("w-8 h-8", feature.badge ? "text-white" : "text-primary")} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
