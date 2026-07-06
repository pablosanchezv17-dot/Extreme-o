import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { ChatWidgetGate } from "@/components/ChatWidgetGate";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Hostal Azahar — Reservas directas",
  description: "Alojamiento en Villa del Prado, Madrid. Reserva tu habitación directamente.",
  manifest: "/manifest.json",
  themeColor: "#965616",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hostal Azahar"
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#965616" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hostal Azahar" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body`}>
        <Providers>
          {children}
          <ChatWidgetGate />
        </Providers>
      </body>
    </html>
  );
}
