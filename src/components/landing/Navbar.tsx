"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, Sparkles } from 'lucide-react';
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
    { name: 'Soluções', href: '#funcionalidades' },
    { name: 'Nichos', href: '#nichos' },
    { name: 'Demonstração', href: '#demonstracao' },
    { name: 'Preços', href: '#precos' },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full",
        scrolled
          ? "bg-[#05070B]/95 border-b border-white/5 py-3 shadow-2xl backdrop-blur-xl"
          : "bg-transparent border-b border-transparent py-5 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full">
        {/* Brand */}
        <Link href="/" className="flex items-center group">
          <Logo variant="horizontal" showTagline={false} />
        </Link>

        {/* Nav Links - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#00D4FF] transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Auth Actions - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button asChild className="rounded-xl h-10 px-5 bg-gradient-to-r from-[#0D5B80] to-[#0A3D58] hover:from-[#116F9C] hover:to-[#0D5073] text-white font-bold shadow-lg border border-[#00B4D8]/20">
              <Link href="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Meu Painel
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-xl font-semibold text-sm h-10 text-slate-300 hover:text-white hover:bg-white/5">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="rounded-xl h-10 px-5 bg-gradient-to-r from-[#0D5B80] to-[#0A3D58] hover:from-[#116F9C] hover:to-[#0D5073] text-white font-bold shadow-lg border border-[#00B4D8]/20 transition-all hover:scale-[1.02]">
                <a href="https://wa.me/5516991551200?text=Ol%C3%A1%2C%20quero%20criar%20meu%20cat%C3%A1logo%20na%20Konnexy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                  Criar Catálogo
                </a>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center transition-all active:scale-90 text-slate-300"
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
            className="md:hidden absolute top-full left-0 right-0 bg-[#05070B]/98 border-b border-white/5 backdrop-blur-xl shadow-2xl z-50 px-6 py-6"
          >
            <nav className="flex flex-col gap-4 mb-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-[0.15em] text-slate-300 hover:text-[#00D4FF] border-b border-white/5 pb-4 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              {user ? (
                <Button asChild className="rounded-xl w-full bg-gradient-to-r from-[#0D5B80] to-[#0A3D58] text-white font-bold border border-[#00B4D8]/20">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>Meu Painel</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="rounded-xl w-full border-white/10 text-slate-300">
                    <Link href="/login" onClick={() => setIsOpen(false)}>Entrar</Link>
                  </Button>
                  <Button asChild className="rounded-xl w-full bg-gradient-to-r from-[#0D5B80] to-[#0A3D58] text-white font-bold border border-[#00B4D8]/20">
                    <a href="https://wa.me/5516991551200?text=Ol%C3%A1%2C%20quero%20criar%20meu%20cat%C3%A1logo%20na%20Konnexy" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                      Criar Catálogo
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
