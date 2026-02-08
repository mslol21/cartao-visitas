import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://konnexy.com.br'),
  title: {
    default: "Cartão de Visitas Digital Grátis para Autônomos | Konnexy",
    template: "%s | Konnexy"
  },
  description: "Crie seu cartão de visitas digital grátis em minutos. Ideal para autônomos e liberais. Compartilhe no WhatsApp e feche mais negócios com a Konnexy.",
  keywords: ["cartão de visitas digital", "cartão de visitas virtual", "cartão de visitas online", "cartão de visitas digital grátis", "cartão de visitas digital WhatsApp", "cartão digital para autônomos"],
  authors: [{ name: "Konnexy Team" }],
  creator: "Konnexy",
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://konnexy.com.br",
    title: "Cartão de Visitas Digital Grátis para Autônomos | Konnexy",
    description: "Crie seu cartão de visitas digital grátis em minutos. Ideal para autônomos e liberais. Compartilhe no WhatsApp e feche mais negócios com a Konnexy.",
    siteName: "Konnexy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cartão de Visitas Digital Grátis para Autônomos | Konnexy",
    description: "Crie seu cartão de visitas digital grátis em minutos. Ideal para autônomos e liberais.",
  },
  robots: "index, follow",
};

export const viewport = "width=device-width, initial-scale=1, maximum-scale=1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
