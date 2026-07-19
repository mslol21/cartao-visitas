"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, Sparkles, ArrowRight } from 'lucide-react';
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
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full",
        scrolled
          ? "bg-[#030712]/80 border-b border-white/5 py-4 shadow-2xl backdrop-blur-xl"
          : "bg-transparent border-b border-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <Logo variant="horizontal" showTagline={false} />
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
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#EADBB9] transition-all duration-300 group-hover:w-full" />
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
              <Button asChild className="rounded-xl h-10 px-5 bg-gradient-to-r from-[#EADBB9] to-[#C5CAD2] hover:from-[#f3e7d3] hover:to-[#d2d6dd] text-white font-bold shadow-lg shadow-amber-500/5 transition-all hover:scale-[1.02] border border-[#EADBB9]/20">
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
          className="md:hidden w-10 h-10 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-center transition-all active:scale-95 text-slate-350 hover:text-white"
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
            className="md:hidden absolute top-full left-0 right-0 bg-[#030c1b]/98 border-b border-white/5 backdrop-blur-xl shadow-2xl z-50 px-6 py-8"
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
