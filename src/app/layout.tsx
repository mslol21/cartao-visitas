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
  metadataBase: new URL("https://konnexy.com.br"),
  title: {
    default: "Konnexy | Sites, Google, Tráfego Pago e Sistemas Web",
    template: "%s | Konnexy"
  },
  description: "Soluções digitais para empresas: criação de sites, otimização do Perfil da Empresa no Google, tráfego pago, catálogos, NFC/QR Code e sistemas web sob medida.",
  keywords: [
    "Konnexy",
    "criação de sites",
    "site profissional",
    "otimização Google Meu Negócio",
    "Perfil da Empresa no Google",
    "SEO local",
    "Google Ads",
    "tráfego pago",
    "sistemas web",
    "catálogo digital",
    "link profissional",
    "NFC para empresas",
    "QR Code para empresas",
    "soluções digitais São Paulo"
  ],
  authors: [{ name: "Konnexy" }],
  creator: "Konnexy",
  publisher: "Konnexy",
  icons: {
    icon: "/images/koi_hero.png",
    shortcut: "/images/koi_hero.png",
    apple: "/images/koi_hero.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "Konnexy | Sites, Google, Tráfego Pago e Sistemas Web",
    description: "Sites, Perfil da Empresa no Google, tráfego pago, catálogos, NFC/QR Code e sistemas personalizados para pequenos negócios.",
    siteName: "Konnexy",
    images: [
      {
        url: "/images/koi_hero.png",
        width: 1200,
        height: 630,
        alt: "Konnexy - Soluções Web e Tecnologia"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Konnexy | Soluções Digitais para Empresas",
    description: "Sites, Google, tráfego pago, catálogos, NFC/QR Code e sistemas web sob medida.",
    images: ["/images/koi_hero.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
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
