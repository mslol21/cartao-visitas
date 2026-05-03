import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateOrganizationSchema } from "@/lib/seo/structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Konnexy | Organize seu atendimento, pedidos e vendas no WhatsApp",
    template: "%s | Konnexy"
  },
  description: "Soluções simples para pequenos negócios venderem mais e se organizarem melhor. Presença digital, catálogo de vendas e gestão de pedidos no WhatsApp.",
  keywords: ["konnexy", "vendas whatsapp", "catálogo digital", "pedidos whatsapp", "organização de atendimento", "pequenos negócios"],
  authors: [{ name: "Konnexy Team" }],
  creator: "Konnexy",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://konnexy.com.br",
    title: "Konnexy | Soluções Digitais para Pequenos Negócios",
    description: "Organize seu atendimento, pedidos e vendas no WhatsApp com a Konnexy. Simples, rápido e profissional.",
    siteName: "Konnexy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Konnexy | Organize seu negócio no WhatsApp",
    description: "Soluções simples para pequenos negócios venderem mais e se organizarem melhor.",
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
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased overflow-x-hidden`}>
        <StructuredData data={generateOrganizationSchema()} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
