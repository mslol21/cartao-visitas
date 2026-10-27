"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/Logo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Produtos', href: '#produtos' },
    { name: 'Segmentos', href: '#segmentos' },
    { name: 'Demonstrações', href: '#demonstracoes' },
    { name: 'Orçamento', href: '#precos' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300",
        scrolled
          ? "bg-[#070914]/92 border-b border-violet-400/15 py-2.5 sm:py-3 shadow-2xl backdrop-blur-xl"
          : "bg-[#070914]/82 border-b border-violet-400/10 py-2.5 sm:py-4 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex min-w-0 items-center">
          <Logo variant="horizontal" showTagline={true} />
        </Link>

        {/* Nav Links - Desktop (Linear/Stripe inspired) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors duration-200 relative py-2 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Auth Actions - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Button asChild className="rounded-xl h-10 px-5 bg-white text-black hover:bg-white/90 font-bold transition-all shadow-md">
              <Link href="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Painel Admin
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-xl font-medium text-xs h-10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="rounded-xl h-10 px-5 bg-gradient-to-r from-cyan-400 to-emerald-300 hover:brightness-110 text-[#041014] font-bold shadow-lg shadow-cyan-500/10 transition-all hover:scale-[1.02] border border-[#EADBB9]/20">
                <a href="https://wa.me/5516991551200?text=Olá,%20gostaria%20de%20solicitar%20uma%20demonstração%20das%20soluções%20da%20Konnexy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <span>Falar Conosco</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-300 transition-all active:scale-95 md:hidden sm:h-10 sm:w-10"
          aria-label="Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-50 border-b border-white/5 bg-[#030c1b]/98 px-4 py-6 shadow-2xl backdrop-blur-xl sm:px-6 sm:py-8 md:hidden"
          >
            <nav className="flex flex-col gap-4 mb-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-slate-300 hover:text-white border-b border-white/5 pb-4 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              {user ? (
                <Button asChild className="rounded-xl w-full bg-white text-black hover:bg-white/90 font-bold">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>Painel Admin</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="rounded-xl w-full border-white/10 text-slate-300">
                    <Link href="/login" onClick={() => setIsOpen(false)}>Entrar</Link>
                  </Button>
                  <Button asChild className="rounded-xl w-full bg-gradient-to-r from-[#EADBB9] to-[#C5CAD2] text-white font-bold">
                    <a href="https://wa.me/5516991551200?text=Olá,%20gostaria%20de%20solicitar%20uma%20demonstração%20das%20soluções%20da%20Konnexy" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                      Falar Conosco
                    </a>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
