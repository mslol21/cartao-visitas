import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 py-20 border-t border-border/30">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-xl">
                <span className="text-white dark:text-slate-900 font-black text-xs">CV</span>
              </div>
              <span className="font-black text-2xl tracking-tighter">ConnectCard</span>
            </Link>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Networking Digital de Elite</p>
          </div>

          <nav className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Início
            </Link>
            <a href="#como-funciona" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Soluções
            </a>
            <a href="#precos" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Preços
            </a>
            <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Termos
            </Link>
          </nav>

          <div className="text-center md:text-right space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
              © {currentYear} ConnectCard Inc.
            </p>
            <p className="text-[9px] font-medium text-muted-foreground/40">
              Feito com excelência para profissionais globais.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
