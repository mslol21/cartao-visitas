import { Profile } from '../types/profile';

/**
 * Verifica se o usuário possui um plano pago ativo.
 */
export function isPaidUser(user: Profile | null | undefined): boolean {
  if (!user) return false;
  
  // Planos considerados "pagos"
  const paidPlans = ['pro', 'fundador_local'];
  return paidPlans.includes(user.plan);
}

/**
 * Verifica se o plano manual expirou e retorna o plano atualizado.
 * Se billing_type for 'manual' e a data de expiração já passou,
 * o plano deve ser revertido para 'free'.
 */
export function checkPlanExpiration(user: Profile): Partial<Profile> {
  if (user.billing_type === 'manual' && user.plan_expires_at) {
    const expirationDate = new Date(user.plan_expires_at);
    const now = new Date();
    
    if (expirationDate < now) {
      return {
        plan: 'free',
        billing_type: 'stripe' // Volta ao padrão Stripe para futuras assinaturas
      };
    }
  }
  
  return {};
}

/**
 * Verifica se o usuário pode customizar o tema.
 * Bloqueia se can_customize_theme for false.
 */
export function canCustomize(user: Profile | null | undefined): boolean {
  if (!user) return false;
  
  // Se for fundador_local com can_customize_theme = false, bloqueia.
  // Usuários do plano free geralmente não customizam também.
  if (user.plan === 'free') return false;
  
  return user.can_customize_theme;
}
