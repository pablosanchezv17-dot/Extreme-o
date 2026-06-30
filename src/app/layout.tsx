import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
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
  title: "Hostal Extremeño — Reservas directas",
  description: "Alojamiento en Extremadura. Reserva tu habitación directamente, sin comisiones."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
