import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="text-center px-6 max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="horizontal" className="h-8" />
        </div>

        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Página não encontrada
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>

        {/* Decorative Element */}
        <div className="mt-16 opacity-20">
          <svg
            className="mx-auto w-64 h-64"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
