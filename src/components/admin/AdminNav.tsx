"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const ENLACES = [
  { href: "/admin", etiqueta: "Resumen" },
  { href: "/admin/reservas", etiqueta: "Reservas" },
  { href: "/admin/habitaciones", etiqueta: "Habitaciones" },
  { href: "/admin/resenas", etiqueta: "Reseñas" },
  { href: "/admin/mensajes", etiqueta: "Mensajes" }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col border-r border-hairline bg-paper p-5">
      <span className="font-display text-lg font-semibold text-ink">Tu Hostal</span>
      <span className="eyebrow mt-1">Administración</span>

      <ul className="mt-8 flex flex-col gap-1">
        {ENLACES.map((enlace) => {
          const activo = pathname === enlace.href;
          return (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                className={`block rounded-md px-3 py-2 font-body text-sm ${
                  activo ? "bg-moss/10 font-medium text-moss" : "text-ink/70 hover:bg-ink/5"
                }`}
              >
                {enlace.etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-auto rounded-md px-3 py-2 text-left font-body text-sm text-ink/50 hover:bg-ink/5"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}
