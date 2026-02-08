import { Metadata } from 'next'
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: 'Criar Conta - Cartão de Visitas Digital Grátis',
  description: 'Crie sua conta grátis na Konnexy e tenha seu cartão de visitas digital em minutos. Ideal para autônomos e profissionais liberais.',
  keywords: [
    'criar conta cartão digital',
    'cadastro grátis',
    'registro cartão de visitas',
    'conta konnexy'
  ],
  openGraph: {
    title: 'Criar Conta Grátis - Konnexy',
    description: 'Crie seu cartão de visitas digital grátis em minutos',
    type: 'website',
  },
  robots: 'noindex, nofollow', // Não indexar páginas de cadastro
}

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
