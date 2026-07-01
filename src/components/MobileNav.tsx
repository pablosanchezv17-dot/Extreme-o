"use client";

import Link from "next/link";
import { useState } from "react";

const ENLACES = [
  { href: "/#habitaciones", etiqueta: "Habitaciones" },
  { href: "/#galeria", etiqueta: "Galería" },
  { href: "/resenas", etiqueta: "Reseñas" },
  { href: "/contacto", etiqueta: "Contacto" },
];

export function MobileNav({ variant }: { variant: "transparent" | "solid" }) {
  const [abierto, setAbierto] = useState(false);

  const colorIcono = variant === "transparent" ? "text-white" : "text-neutral-700";

  return (
    <div className="md:hidden">
      <button
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir menú"
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          variant === "transparent" ? "bg-white/15" : "bg-neutral-100"
        }`}
      >
        <span className={`text-lg ${colorIcono}`}>{abierto ? "✕" : "☰"}</span>
      </button>

      {abierto && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30" onClick={() => setAbierto(false)} />
          <div className="fixed top-0 right-0 z-40 h-full w-64 bg-white shadow-card-hover p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-body text-base font-bold text-olive-700">Menú</span>
              <button onClick={() => setAbierto(false)} className="text-neutral-400 text-xl">✕</button>
            </div>
            <nav className="flex flex-col gap-1">
              {ENLACES.map((e) => (
                <Link
                  key={e.href}
                  href={e.href}
                  onClick={() => setAbierto(false)}
                  className="rounded-lg px-3 py-3 font-body text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  {e.etiqueta}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
