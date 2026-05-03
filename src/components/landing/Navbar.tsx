"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, User, LayoutDashboard, Globe } from 'lucide-react';
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
    { name: 'Soluções', href: '#como-funciona' },
    { name: 'Planos', href: '#precos' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6",
        scrolled ? "py-4" : "py-8"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto rounded-[2rem] transition-all duration-500",
        scrolled ? "glass shadow-2xl px-6 h-16" : "px-0 h-20"
      )}>
        <div className="flex items-center justify-between h-full">
          {/* Brand */}
          <Link href="/" className="flex items-center group">
            <Logo variant="horizontal" showTagline={false} className="scale-75 origin-left" />
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button asChild variant="hero" className="rounded-2xl h-11 px-6 shadow-xl shadow-primary/20">
                <Link href="/dashboard">
                   <LayoutDashboard className="w-4 h-4 mr-2" />
                   Meu Painel
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="rounded-xl font-bold text-xs h-11">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="rounded-2xl h-11 px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-xl shadow-amber-500/20 transition-all border-0">
                  <a href="https://wa.me/5516991551200?text=Ol%C3%A1%2C%20gostaria%20de%20me%20cadastrar" target="_blank" rel="noopener noreferrer">
                    Começar Grátis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-all active:scale-90"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-full left-6 right-6 mt-4 p-8 glass rounded-[2.5rem] shadow-3xl z-50 overflow-hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xl font-black tracking-tighter border-b border-border/10 pb-4"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-4">
                {user ? (
                  <Button asChild variant="hero" size="lg" className="rounded-2xl w-full">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>Meu Painel</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" size="lg" className="rounded-2xl w-full">
                      <Link href="/login" onClick={() => setIsOpen(false)}>Entrar</Link>
                    </Button>
                    <Button asChild variant="hero" size="lg" className="rounded-2xl w-full">
                      <a href="https://wa.me/5516991551200?text=Ol%C3%A1%2C%20gostaria%20de%20me%20cadastrar" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>Começar Grátis</a>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
