"use client";

import { useState } from "react";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#25D366" fillOpacity="0.15" />
    <path d="M4.5 8L7 10.5L11.5 6" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 17L5 9L9.5 13L12 6L14.5 13L19 9L21 17H3Z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M3 20H21" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#a78bfa" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const FOUNDING_SPOTS = 20;
const spotsLeft = 7;

const plans = [
  {
    id: "founding",
    name: "Membro Fundador",
    price: "R$50",
    period: "pagamento único",
    description: "Acesso vitalício completo. Pague uma vez, use para sempre.",
    accent: "#ef4444",
    border: "#ef444440",
    cta: "Garantir minha vaga",
    ctaStyle: "solid-red",
    badge: "🔥 OFERTA DE LANÇAMENTO",
    features: [
      "Perfil público completo",
      "Links ilimitados",
      "Todos os temas visuais",
      "QR Code personalizado",
      "Analytics completo",
      "SEO personalizado",
      "Tipografia premium",
      "Filtro e borda de foto",
      "Horário de atendimento",
      "Banco de imagens Pixabay",
      "Todas as novidades futuras",
      "Suporte prioritário via WhatsApp",
    ],
    href: "/login?upgrade=true",
  },
  {
    id: "pro",
    name: "PRO",
    price: "R$29",
    period: "por mês",
    description: "Para profissionais que querem se destacar e converter mais.",
    icon: <CrownIcon />,
    accent: "#f59e0b",
    border: "#f59e0b30",
    cta: "Assinar PRO",
    ctaStyle: "solid-gold",
    features: [
      "Perfil público completo",
      "Links ilimitados",
      "Todos os temas visuais",
      "QR Code personalizado",
      "Analytics completo",
      "SEO personalizado",
      "Tipografia premium",
      "Filtro e borda de foto",
      "Horário de atendimento",
      "Banco de imagens Pixabay",
      "Suporte via WhatsApp",
    ],
    href: "/login?upgrade=true",
  },
  {
    id: "business",
    name: "Business",
    price: "R$49",
    period: "por mês",
    description: "Para empresas e agências que precisam do máximo controle.",
    icon: <StarIcon />,
    accent: "#a78bfa",
    border: "#a78bfa30",
    cta: "Assinar Business",
    ctaStyle: "solid-purple",
    features: [
      "Tudo do plano PRO",
      "Domínio próprio",
      "Remover marca Konnexy",
      "Analytics avançado",
      "Suporte prioritário",
    ],
    href: "/login?upgrade=true",
  },
];

export function Pricing() {
  const [hovered, setHovered] = useState<string | null>(null);
  const filled = FOUNDING_SPOTS - spotsLeft;

  return (
    <section id="precos" style={{
      minHeight: "100vh",
      background: "#080c18",
      fontFamily: "'Sora', sans-serif",
      color: "#fff",
      padding: "0 16px 80px",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Decorative backgrounds inside section logic */}
      <div style={{ position: "absolute", top: "-150px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", background: "radial-gradient(ellipse, #ef444410 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "0", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(ellipse, #a78bfa08 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "60px", textAlign: "center", position: "relative", zIndex: 10 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "48px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "linear-gradient(135deg, #25D366, #1aab52)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "17px", color: "#fff" }}>K</div>
          <span style={{ fontWeight: 700, fontSize: "19px", letterSpacing: "-0.5px" }}>Konnexy</span>
        </div>

        {/* Founding banner */}
        <div style={{ background: "linear-gradient(135deg, #ef444412, #f9731610)", border: "1px solid #ef444428", borderRadius: "14px", padding: "14px 22px", marginBottom: "32px", display: "inline-flex", alignItems: "center", gap: "12px", textAlign: "left" }}>
          <span style={{ fontSize: "20px" }}>🔥</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.5px" }}>OFERTA DE LANÇAMENTO — VAGAS LIMITADAS</div>
            <div style={{ fontSize: "12px", color: "#ffffff55", marginTop: "2px" }}>
              Apenas <strong style={{ color: "#fff" }}>{spotsLeft} vagas restantes</strong> de {FOUNDING_SPOTS} para acesso vitalício por R$50
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ maxWidth: "380px", margin: "0 auto 48px", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "#ffffff35" }}>Vagas preenchidas</span>
            <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 700 }}>{filled}/{FOUNDING_SPOTS}</span>
          </div>
          <div style={{ height: "5px", background: "#ffffff08", borderRadius: "100px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(filled / FOUNDING_SPOTS) * 100}%`, background: "linear-gradient(90deg, #ef4444, #f97316)", borderRadius: "100px" }} />
          </div>
        </div>

        <h2 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", margin: "0 0 12px 0", background: "linear-gradient(135deg, #fff 40%, #ffffff65)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Seu cartão digital,<br />do seu jeito.
        </h2>
        <p style={{ color: "#ffffff45", fontSize: "15px", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 52px" }}>
          Sem Linktree. Sem mensalidades ocultas. Presença digital completa em minutos.
        </p>

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(265px, 1fr))", gap: "14px", alignItems: "start", textAlign: "left" }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              onMouseEnter={() => setHovered(plan.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: plan.id === "founding" ? "linear-gradient(160deg, #180a0a 0%, #0d1020 100%)" : "#0c1020",
                border: `1px solid ${hovered === plan.id ? plan.border.replace("30", "70").replace("40", "80") : plan.border}`,
                borderRadius: "20px", padding: "28px 22px", position: "relative",
                transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                transform: hovered === plan.id ? "translateY(-5px)" : "translateY(0)",
                boxShadow: plan.id === "founding" ? `0 0 40px #ef444412` : "none",
              }}
            >
              {plan.badge && (
                <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg, #ef4444, #f97316)", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "4px 14px", borderRadius: "100px", whiteSpace: "nowrap", letterSpacing: "0.8px" }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                  {plan.id === "founding"
                    ? <span style={{ fontSize: "16px" }}>🔥</span>
                    : plan.icon}
                  <span style={{ fontSize: "11px", fontWeight: 700, color: plan.accent, letterSpacing: "1.5px", textTransform: "uppercase" }}>{plan.name}</span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-1.5px", color: "#fff" }}>{plan.price}</span>
                  <span style={{ fontSize: "12px", color: "#ffffff30" }}>{plan.period}</span>
                </div>

                {plan.id === "founding" && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#ef444412", border: "1px solid #ef444425", borderRadius: "6px", padding: "3px 8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600 }}>✦ Pague uma vez, use para sempre</span>
                  </div>
                )}

                <p style={{ fontSize: "12px", color: "#ffffff40", lineHeight: 1.5, margin: 0 }}>{plan.description}</p>
              </div>

              <a
                href={plan.href}
                style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  width: "100%", padding: "13px", borderRadius: "12px", boxSizing: "border-box",
                  fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: 700,
                  cursor: "pointer", marginBottom: "20px", border: "none",
                  ...(plan.ctaStyle === "solid-red"
                    ? { background: "linear-gradient(135deg, #ef4444, #f97316)", color: "#fff", boxShadow: "0 4px 24px #ef444435" }
                    : plan.ctaStyle === "solid-gold"
                    ? { background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#000", boxShadow: "0 4px 20px #f59e0b25" }
                    : { background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff", boxShadow: "0 4px 20px #a78bfa20" }),
                }}
              >
                {plan.cta} →
              </a>

              <div style={{ height: "1px", background: "#ffffff07", marginBottom: "18px" }} />

              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13px", color: "#ffffffa0" }}>
                    <CheckIcon />{f}
                  </li>
                ))}
              </ul>

              {plan.id === "founding" && (
                <div style={{ marginTop: "18px", padding: "11px", background: "#ef44440a", borderRadius: "10px", border: "1px solid #ef444418", fontSize: "12px", color: "#ffffff45", textAlign: "center", lineHeight: 1.5 }}>
                  ⚡ Após as 20 vagas, valor muda para <strong style={{ color: "#fff" }}>R$29/mês</strong>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "28px", marginTop: "44px", flexWrap: "wrap" }}>
          {["🔒 Pagamento seguro", "💬 Suporte via WhatsApp", "⚡ Acesso imediato"].map((item) => (
            <span key={item} style={{ fontSize: "12px", color: "#ffffff25", fontWeight: 500 }}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
