import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Criar Conta - Konnexy',
  description: 'O cadastro de novos usuários está temporariamente restrito.',
  robots: 'noindex, nofollow',
}

export default function SignupPage() {
  // Redireciona para o login informando que o cadastro está fechado
  redirect('/login?message=O cadastro público está desativado. Entre em contato com o administrador.');
}

