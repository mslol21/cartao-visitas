"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Smartphone,
  Store,
  X,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const shell = "mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8";
const sectionY = "py-12 sm:py-16 lg:py-20";

const whatsappHref =
  "https://wa.me/5516991551200?text=Olá,%20quero%20conhecer%20as%20soluções%20da%20Konnexy%20para%20meu%20negócio.";

const solutions = [
  {
    icon: Search,
    title: "Ser encontrado",
    need: "Para quem precisa aparecer melhor quando o cliente já está procurando.",
    benefit: "Organizamos sua presença para facilitar descoberta, confiança e contato.",
    items: ["Perfil da Empresa no Google", "Google Ads", "Meta Ads"],
  },
  {
    icon: Store,
    title: "Apresentar melhor o negócio",
    need: "Para quem quer explicar melhor o que vende, como trabalha e como entrar em contato.",
    benefit: "Criamos uma apresentação mais profissional e fácil de compartilhar.",
    items: ["Sites profissionais", "Landing pages", "Link profissional"],
  },
  {
    icon: Zap,
    title: "Facilitar atendimento e operação",
    need: "Para quem quer reduzir tarefas manuais e deixar o atendimento mais simples.",
    benefit: "Conectamos ferramentas digitais ao dia a dia do negócio.",
    items: ["Catálogos e cardápios", "NFC e QR Code", "Sistemas web"],
  },
] as const;

const projects = [
  {
    name: "Konnexy Menu",
    segment: "Alimentação",
    description: "Cardápio digital com pedidos, retirada, delivery e apoio à operação.",
    image: "/catalogo.png",
    href: "https://menu.konnexy.com.br",
  },
  {
    name: "Konnexy Tag",
    segment: "NFC & QR Code",
    description: "Experiências por aproximação e QR para avaliações, links e contatos.",
    image: "/link.png",
    href: "https://tag.konnexy.com.br",
  },
  {
    name: "Konnexy Agenda",
    segment: "Agendamento",
    description: "Agenda online para negócios que trabalham com horários e serviços.",
    image: "/pet.png",
    href: "https://agenda.konnexy.com.br",
  },
  {
    name: "Konnexy PDV",
    segment: "Gestão",
    description: "PDV com caixa, estoque e operação pensada para pequenos negócios.",
    image: "/fabrica.png",
    href: "https://pdv.konnexy.com.br",
  },
] as const;

const faq = [
  {
    question: "Já tenho Instagram. Como um site pode ajudar?",
    answer:
      "O Instagram ajuda na divulgação, mas o site organiza informações, serviços, contatos e pode servir como ponto central para Google, anúncios e WhatsApp.",
  },
  {
    question: "Preciso saber mexer com tecnologia?",
    answer:
      "Não. A proposta é deixar a solução simples para o uso do dia a dia e orientar o que realmente precisa ser feito.",
  },
  {
    question: "Qual solução faz sentido para meu negócio?",
    answer:
      "Depende do objetivo atual. Primeiro entendemos sua necessidade e indicamos uma opção adequada ao momento do negócio.",
  },
  {
    question: "Como funciona o orçamento?",
    answer:
      "O orçamento é montado conforme a solução e o nível de personalização necessário. Você recebe uma proposta antes de qualquer contratação.",
  },
  {
    question: "Existem serviços com mensalidade?",
    answer:
      "Sim, alguns serviços e sistemas podem ter mensalidade. Isso varia conforme a solução escolhida e é informado na proposta.",
  },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-300">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-black leading-[1.05] tracking-[-0.03em] text-white">
        {title}
      </h2>
      {text ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{text}</p> : null}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    ["Soluções", "#solucoes"],
    ["Projetos", "#projetos"],
    ["Como funciona", "#como-funciona"],
    ["Contato", "#contato"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050711]/90 backdrop-blur-xl">
      <div className={`${shell} flex h-16 items-center justify-between`}>
        <Link href="/" className="flex items-center gap-3" aria-label="Konnexy - página inicial">
          <Image src="/logo.png" alt="Konnexy" width={40} height={40} priority className="h-9 w-9 object-contain" />
          <div>
            <div className="text-sm font-black text-white sm:text-base">Konnexy</div>
            <div className="hidden text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:block">Soluções web & tecnologia</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-semibold text-slate-300 transition hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild variant="whatsapp" className="h-11 rounded-full px-5 text-sm">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Conversar pelo WhatsApp
            </a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#050711] lg:hidden">
          <nav className={`${shell} flex flex-col gap-1 py-4`} aria-label="Navegação mobile">
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5"
              >
                {label}
              </a>
            ))}
            <Button asChild variant="whatsapp" className="mt-2 h-11 rounded-xl">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Conversar pelo WhatsApp
              </a>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-hero]", y: 24, stagger: 0.08, start: "top 92%" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#050711] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(37,99,235,.15),transparent_28%)]" />
      <div className={`${shell} relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20`}>
        <div>
          <div data-hero className="opacity-0">
            <Eyebrow>Soluções digitais para pequenos negócios</Eyebrow>
          </div>
          <h1 data-hero className="mt-4 max-w-3xl text-[clamp(2.15rem,4.2vw,3.5rem)] font-black leading-[1.04] tracking-[-0.035em] opacity-0">
            Seu negócio mais fácil de encontrar, conhecer e chamar.
          </h1>
          <p data-hero className="mt-5 max-w-2xl text-base leading-7 text-slate-300 opacity-0 sm:text-lg">
            Sites, presença no Google e soluções digitais para apresentar seu trabalho e facilitar o contato com seus clientes.
          </p>

          <div data-hero className="mt-7 flex flex-col gap-3 opacity-0 sm:flex-row">
            <Button asChild variant="whatsapp" className="h-12 rounded-xl px-5 text-sm">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Conversar pelo WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-5 text-sm font-bold text-white hover:bg-white/[0.06] hover:text-white">
              <a href="#projetos">
                Ver projetos <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div data-hero className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400 opacity-0">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-300" /> São Paulo e atendimento online</span>
            <span className="inline-flex items-center gap-2"><Smartphone className="h-4 w-4 text-cyan-300" /> Soluções fáceis de usar</span>
          </div>
        </div>

        <div data-hero className="relative opacity-0">
          <div className="grid grid-cols-2 gap-3 rounded-[24px] border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/20">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
              <Image src="/site.png" alt="Exemplo de site profissional desenvolvido pela Konnexy" fill priority sizes="(max-width: 1024px) 45vw, 280px" className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
              <Image src="/catalogo.png" alt="Exemplo de catálogo digital Konnexy" fill sizes="(max-width: 1024px) 45vw, 280px" className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
              <Image src="/link.png" alt="Exemplo de link profissional Konnexy" fill sizes="(max-width: 1024px) 45vw, 280px" className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
              <Image src="/fabrica.png" alt="Exemplo de sistema web desenvolvido pela Konnexy" fill sizes="(max-width: 1024px) 45vw, 280px" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-solution]", y: 22, stagger: 0.07, start: "top 82%" });

  return (
    <section id="solucoes" ref={ref} className={`${sectionY} scroll-mt-20 bg-[#0a0d17] text-white`}>
      <div className={shell}>
        <SectionHeading
          eyebrow="Soluções"
          title="Comece pela necessidade do seu negócio."
          text="Em vez de apresentar uma lista técnica, organizamos as soluções pelo problema que você quer resolver agora."
        />

        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <article data-solution key={solution.title} className="rounded-[22px] border border-white/10 bg-[#0d1220] p-6 opacity-0">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-black">{solution.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{solution.need}</p>
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-200">{solution.benefit}</p>

                <div className="mt-5 space-y-2">
                  {solution.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />
                      {item}
                    </div>
                  ))}
                </div>

                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200">
                  Conversar sobre esta solução <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-project]", y: 20, stagger: 0.06, start: "top 84%" });

  return (
    <section id="projetos" ref={ref} className={`${sectionY} scroll-mt-20 bg-[#f5f4ef] text-[#07111f]`}>
      <div className={shell}>
        <div className="max-w-3xl">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Projetos reais</div>
          <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-black leading-[1.05] tracking-[-0.03em]">
            Veja algumas soluções Konnexy funcionando.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Uma seleção enxuta de produtos e projetos com acesso direto para você entender a proposta na prática.
          </p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article data-project key={project.name} className="overflow-hidden rounded-[22px] border border-slate-200 bg-white opacity-0 shadow-sm">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <Image src={project.image} alt={project.name} fill sizes="(max-width: 768px) 100vw, 560px" loading="lazy" className="object-cover transition duration-500 hover:scale-[1.02]" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-700">{project.segment}</div>
                <h3 className="mt-2 text-xl font-black">{project.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#07111f] hover:text-blue-700">
                  Ver projeto <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-step]", y: 18, stagger: 0.07, start: "top 82%" });

  const steps = [
    ["01", "Entendemos seu negócio", "Você explica o que vende, como atende e qual dificuldade quer resolver."],
    ["02", "Indicamos a solução", "Mostramos uma opção adequada e explicamos de forma simples como ela pode ajudar."],
    ["03", "Colocamos em funcionamento", "Configuramos o projeto aprovado e orientamos o uso do que foi contratado."],
  ];

  return (
    <section id="como-funciona" ref={ref} className={`${sectionY} scroll-mt-20 bg-[#050711] text-white`}>
      <div className={shell}>
        <SectionHeading eyebrow="Como funciona" title="Um processo simples, sem complicar o que não precisa." />
        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {steps.map(([number, title, text]) => (
            <div data-step key={number} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-6 opacity-0">
              <div className="text-sm font-black text-cyan-300">{number}</div>
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyKonnexy() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-why]", y: 16, stagger: 0.06, start: "top 84%" });

  const items = [
    "Atendimento direto, sem linguagem complicada.",
    "Soluções adequadas ao momento do negócio.",
    "Experiência próxima de comércios e serviços locais.",
    "Integração entre presença digital, contato e operação.",
  ];

  return (
    <section ref={ref} className={`${sectionY} bg-[#0a0d17] text-white`}>
      <div className={`${shell} grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center`}>
        <div>
          <SectionHeading
            eyebrow="Por que a Konnexy"
            title="Tecnologia explicada de um jeito que faça sentido para o negócio."
            text="O foco não é vender a ferramenta mais complexa. É encontrar uma solução útil, clara e compatível com a sua realidade."
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div data-why key={item} className="flex gap-3 rounded-[18px] border border-white/10 bg-[#0d1220] p-5 opacity-0">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
              <p className="text-sm font-semibold leading-6 text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className={`${sectionY} bg-[#f5f4ef] text-[#07111f]`}>
      <div className={shell}>
        <div className="max-w-3xl">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Perguntas frequentes</div>
          <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-black leading-[1.05] tracking-[-0.03em]">
            Dúvidas comuns antes de começar.
          </h2>
        </div>

        <div className="mt-8 divide-y divide-slate-200 rounded-[20px] border border-slate-200 bg-white">
          {faq.map((item) => (
            <details key={item.question} className="group px-5 py-1 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-bold">
                <span>{item.question}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-180" />
              </summary>
              <p className="max-w-3xl pb-5 text-sm leading-6 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-cta]", y: 20, stagger: 0.07, start: "top 86%" });

  return (
    <section id="contato" ref={ref} className={`${sectionY} scroll-mt-20 bg-[#d2b66f] text-[#07111f]`}>
      <div className={shell}>
        <div className="max-w-3xl">
          <div data-cta className="opacity-0">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#07111f]/60">Próximo passo</div>
          </div>
          <h2 data-cta className="mt-3 text-[clamp(2rem,4vw,3rem)] font-black leading-[1.04] tracking-[-0.03em] opacity-0">
            Vamos encontrar uma solução para o seu negócio?
          </h2>
          <p data-cta className="mt-4 max-w-2xl text-base leading-7 text-[#07111f]/75 opacity-0">
            Conte o que você vende ou qual serviço oferece. A Konnexy mostra uma opção na prática e prepara uma proposta conforme sua necessidade.
          </p>
          <div data-cta className="mt-7 opacity-0">
            <Button asChild className="h-12 rounded-xl bg-[#07111f] px-5 text-sm font-black text-white hover:bg-[#0d1b2a]">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Conversar pelo WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#03050d] py-10 text-white">
      <div className={`${shell} grid gap-8 md:grid-cols-[1fr_auto] md:items-end`}>
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Konnexy" width={40} height={40} className="h-9 w-9 object-contain" />
            <div>
              <div className="font-black">Konnexy</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">Conecta • Organiza • Vende</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
            Soluções digitais para pequenos negócios, com atendimento em São Paulo e online.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-500">
          <Link href="/servicos" className="hover:text-white">Serviços</Link>
          <a href="https://www.instagram.com/konnexy.web" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}

export function ImmersiveLanding() {
  return (
    <div className="overflow-x-clip bg-[#050711] font-sans selection:bg-cyan-300/30">
      <Header />
      <main>
        <Hero />
        <Solutions />
        <Projects />
        <HowItWorks />
        <WhyKonnexy />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
