import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Instagram, Linkedin, Github, Globe } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="contato" className="bg-[#030712] py-20 border-t border-white/5 relative overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute bottom-[-150px] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-white/5">
          {/* Brand block (5 columns) */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center">
              <Logo variant="horizontal" className="scale-95 origin-left" />
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Desenvolvemos plataformas digitais completas e personalizadas para alavancar a gestão e as vendas de negócios em todo o Brasil.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00D4FF] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00D4FF] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00D4FF] transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#00D4FF] transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links block (7 columns: divided into 3 sub-columns) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">Soluções</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-405">
                <li><a href="#produtos" className="hover:text-white transition-colors">Konnexy Pet</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Konnexy Catálogo</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Konnexy Link</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Konnexy Vitrine</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Konnexy Sites</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">Institucional</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-405">
                <li><a href="#segmentos" className="hover:text-white transition-colors">Segmentos</a></li>
                <li><a href="#demonstracoes" className="hover:text-white transition-colors">Demonstrações</a></li>
                <li><a href="#precos" className="hover:text-white transition-colors">Orçamento</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Acessar Conta</a></li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">Suporte</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-405">
                <li>
                  <a href="https://wa.me/5516991551200?text=Olá,%20preciso%20de%20ajuda%20com%20meu%20projeto" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Atendimento Online
                  </a>
                </li>
                <li>
                  <a href="mailto:contato@konnexy.com.br" className="hover:text-white transition-colors">
                    contato@konnexy.com.br
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-slate-500 text-xs font-semibold">
            © {currentYear} Konnexy. Todos os direitos reservados.
          </div>
          <div className="text-slate-400 text-xs font-semibold tracking-wider italic">
            Konnexy — Tecnologia que conecta empresas ao futuro.
          </div>
        </div>
      </div>
    </footer>
  );
}
