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
    title: 'Feito para Celular',
    description: 'Seu cartão abre na hora, rápido como um app, em qualquer dispositivo.',
  },
  {
    icon: MessageCircle,
    title: 'Venda pelo WhatsApp',
    description: 'Um clique e seu cliente já está falando com você, sem precisar salvar contatos.',
  },
  {
    icon: Target,
    title: 'Sua Marca em Foco',
    description: 'Passe mais autoridade online que qualquer papelaria poderia oferecer.',
  },
  {
    icon: BarChart3,
    title: 'Analytics de Visitas',
    description: 'Monitore quantas pessoas acessaram seu perfil todos os dias e se interessaram.',
    badge: 'Pro'
  },
  {
    icon: Video,
    title: 'Fundos em Vídeo Animado',
    description: 'Um design Premium absurdamente moderno através de fundos contínuos e Temas VIPS.',
    badge: 'Pro',
    featured: true
  },
];

export function Features() {
  return (
    <section id="como-funciona" className="py-32 relative overflow-hidden bg-slate-950 text-white">
      {/* Background Lights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 -ml-40 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 -mr-40 pointer-events-none" />

      <div className="container relative z-10 px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Evolução</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
            Seu novo padrão <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-400">
               de excelência
            </span>
          </h2>
          <p className="text-slate-400 text-lg font-medium">
            Passe confiança imediata para seus clientes com um perfil premium de altíssima conversão.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "group p-10 rounded-[2.5rem] transition-all duration-300 relative overflow-hidden backdrop-blur-xl",
                feature.featured 
                  ? "bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]" 
                  : "bg-white/5 border border-white/10 hover:border-white/20"
              )}
            >
              {feature.badge && (
                <div className="absolute top-8 left-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-[9px] font-black uppercase tracking-widest z-20 shadow-lg">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
                  {feature.badge}
                </div>
              )}
              
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                 <feature.icon className="w-32 h-32 text-primary" />
              </div>

              <div className={cn(
                "w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative",
                feature.badge ? "bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20" : "bg-white/10 border border-white/10"
              )}>
                <feature.icon className={cn("w-8 h-8", feature.badge ? "text-white" : "text-slate-300")} />
              </div>
              
              <h3 className="text-xl font-bold mb-4 tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-sm text-slate-400 font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
                {feature.description}
              </p>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
