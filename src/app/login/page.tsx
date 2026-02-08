import { Metadata } from 'next'
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: 'Login - Acesse seu Cartão de Visitas Digital',
  description: 'Faça login na Konnexy para gerenciar seu cartão de visitas digital, visualizar estatísticas e editar suas informações profissionais.',
  openGraph: {
    title: 'Login - Konnexy',
    description: 'Acesse sua conta Konnexy',
    type: 'website',
  },
  robots: 'noindex, nofollow', // Não indexar páginas de login
}

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
