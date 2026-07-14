"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const ENLACES = [
  { href: "/admin", etiqueta: "Resumen", icono: "📊" },
  { href: "/admin/reservas", etiqueta: "Reservas", icono: "📅" },
  { href: "/admin/habitaciones", etiqueta: "Habitaciones", icono: "🛏" },
  { href: "/admin/resenas", etiqueta: "Reseñas", icono: "⭐" },
  { href: "/admin/mensajes", etiqueta: "Mensajes", icono: "✉️" }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Sidebar escritorio (md+) ────────────────────────────────── */}
      <nav className="hidden md:flex h-full flex-col border-r border-hairline bg-paper p-5">
        <span className="font-display text-lg font-semibold text-ink">Hostal Azahar</span>
        <span className="eyebrow mt-1 block">Administración</span>

        <ul className="mt-8 flex flex-col gap-1">
          {ENLACES.map((e) => {
            const activo = pathname === e.href;
            return (
              <li key={e.href}>
                <Link
                  href={e.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-all ${
                    activo ? "bg-olive-700 text-white font-medium" : "text-ink/70 hover:bg-ink/5"
                  }`}
                >
                  <span>{e.icono}</span>
                  {e.etiqueta}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-body text-sm text-ink/50 hover:bg-ink/5"
        >
          <span>🚪</span> Cerrar sesión
        </button>
      </nav>

      {/* ── Barra superior móvil ────────────────────────────────────── */}
      <div className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b border-hairline bg-paper px-4 py-3">
        <span className="font-display text-base font-semibold text-ink">Hostal Azahar</span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="font-body text-xs text-ink/50"
        >
          🚪 Salir
        </button>
      </div>

      {/* ── Bottom nav fija móvil ───────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-hairline bg-paper">
        <ul className="flex items-center justify-around">
          {ENLACES.map((e) => {
            const activo = pathname === e.href;
            return (
              <li key={e.href} className="flex-1">
                <Link
                  href={e.href}
                  className={`flex flex-col items-center gap-0.5 py-2.5 transition-all ${
                    activo ? "text-olive-700" : "text-ink/40"
                  }`}
                >
                  <span className="text-xl leading-none">{e.icono}</span>
                  <span className={`font-body text-[10px] ${activo ? "font-semibold" : ""}`}>
                    {e.etiqueta}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
