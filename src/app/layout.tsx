import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateOrganizationSchema } from "@/lib/seo/structured-data";

import { SITE_URL, SITE_DESCRIPTION, SOCIAL_IMAGE } from "@/lib/seo/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Konnexy | Sites e soluções digitais para pequenos negócios", template: "%s | Konnexy" },
  description: SITE_DESCRIPTION,
  authors: [{ name: 'Konnexy' }], creator: 'Konnexy', publisher: 'Konnexy',
  icons: { icon: [{ url: '/icons/koi-32.png', sizes: '32x32', type: 'image/png' }], apple: [{ url: '/icons/koi-180.png', sizes: '180x180', type: 'image/png' }] },
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Konnexy', title: 'Konnexy — Conecta • Organiza • Vende', description: SITE_DESCRIPTION, images: [SOCIAL_IMAGE] },
  twitter: { card: 'summary_large_image', title: 'Konnexy — Conecta • Organiza • Vende', description: SITE_DESCRIPTION, images: [{url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt}] },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#03050d' };

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
