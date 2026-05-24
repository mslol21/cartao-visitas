import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#05070B] py-20 border-t border-white/5">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center">
              <Logo variant="horizontal" className="scale-75 origin-left" />
            </Link>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Venda mais pelo WhatsApp</p>
          </div>

          <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            <a href="#funcionalidades" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00D4FF] transition-colors">
              Recursos
            </a>
            <a href="#nichos" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00D4FF] transition-colors">
              Nichos
            </a>
            <a href="#faq" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00D4FF] transition-colors">
              FAQ
            </a>
            <a href="https://wa.me/5516991551200?text=Olá,%20preciso%20de%20suporte%20com%20o%20Konnexy" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00D4FF] transition-colors">
              Suporte
            </a>
            <a href="https://wa.me/5516991551200" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00D4FF] transition-colors">
              WhatsApp
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00D4FF] transition-colors">
              Instagram
            </a>
          </nav>

          <div className="text-center md:text-right space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
              © {currentYear} Konnexy.
            </p>
            <p className="text-[9px] font-medium text-muted-foreground/40">
              Transforme seu Instagram e WhatsApp em uma máquina de vendas.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
