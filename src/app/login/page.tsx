import { Metadata } from 'next'
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: 'Login - Painel Administrativo Konnexy',
  description: 'Faça login na Konnexy para gerenciar seu catálogo digital, organizar pedidos e acompanhar suas vendas pelo WhatsApp.',
  openGraph: {
    title: 'Login - Konnexy',
    description: 'Acesse sua conta Konnexy',
    type: 'website',
  },
  robots: 'noindex, nofollow', // Não indexar páginas de login
}

import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}

