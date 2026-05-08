import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Filmet — Descubre tu próxima película",
    template: "%s | Filmet",
  },
  description: "Descubre películas en cartelera, tendencias y próximos estrenos. Guarda tu lista, valora y comenta.",
  keywords: ["películas", "cine", "cartelera", "streaming", "estrenos"],
  authors: [{ name: "Filmet" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Filmet",
    title: "Filmet — Descubre tu próxima película",
    description: "Descubre películas en cartelera, tendencias y próximos estrenos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Filmet",
    description: "Descubre películas en cartelera, tendencias y próximos estrenos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
