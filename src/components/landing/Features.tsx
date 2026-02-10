"use client";

import { 
  Smartphone, 
  MessageCircle, 
  Target,
  BarChart3,
  Video,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Smartphone,
    title: 'Feito para o Celular',
    description: 'Seu cartão abre na hora e funciona perfeitamente em qualquer smartphone.',
  },
  {
    icon: MessageCircle,
    title: 'Venda pelo WhatsApp',
    description: 'Um botão direto para o cliente te chamar sem precisar salvar seu número.',
  },
  {
    icon: Target,
    title: 'Sua Marca em Destaque',
    description: 'Passe uma imagem muito mais profissional do que um simples papel.',
  },
  {
    icon: BarChart3,
    title: 'Saiba quem te visita',
    description: 'Veja quantas pessoas acessaram seu perfil e se interessaram pelo seu trabalho.',
    badge: 'Pro'
  },
  {
    icon: Video,
    title: 'Visual que Impressiona',
    description: 'Use fundos em vídeo para se destacar da concorrência e prender a atenção.',
    badge: 'Pro',
    featured: true
  },
];

export function Features() {
  return (
    <section id="como-funciona" className="py-32 relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Vantagens</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            O seu networking <br /> 
            <span className="gradient-text">merece um upgrade.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            Passe confiança imediata para seus clientes com um perfil digital moderno e facilite o fechamento de novos negócios.
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
