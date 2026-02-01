import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "ConnectCard | Networking Digital de Elite",
    template: "%s | ConnectCard"
  },
  description: "A plataforma nº 1 para criação de cartões de visita digitais focados em conversão e SEO profissional.",
  keywords: ["cartão de visita digital", "link no whatsapp", "bio link profissional", "marketing digital", "networking", "saas"],
  authors: [{ name: "ConnectCard Team" }],
  creator: "ConnectCard Inc",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://connectcard.io",
    title: "ConnectCard | Networking Digital de Elite",
    description: "Crie seu cartão de visita digital em segundos e conquiste mais clientes.",
    siteName: "ConnectCard",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConnectCard | Networking Digital de Elite",
    description: "Cartão de visita digital focado em conversão.",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  robots: "index, follow",
};

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
