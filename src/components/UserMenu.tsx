"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function UserMenu() {
  const { data: session } = useSession();
  const [abierto, setAbierto] = useState(false);

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/cuenta/login" className="btn-ghost text-sm">Iniciar sesión</Link>
        <Link href="/cuenta/registro" className="btn-primary text-sm px-4 py-2">Registrarse</Link>
      </div>
    );
  }

  const nombre = session.user?.name?.split(" ")[0] ?? "Mi cuenta";
  const inicial = nombre[0]?.toUpperCase() ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 hover:shadow-card transition-all"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-olive-700 font-body text-xs font-bold text-white">
          {inicial}
        </div>
        <span className="font-body text-sm font-medium text-neutral-700">{nombre}</span>
        <span className="text-neutral-400 text-xs">▾</span>
      </button>

      {abierto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAbierto(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border border-neutral-200 bg-white shadow-card-hover overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-100">
              <p className="font-body text-sm font-semibold text-neutral-800">{session.user?.name}</p>
              <p className="font-body text-xs text-neutral-500 truncate">{session.user?.email}</p>
            </div>
            <Link href="/cuenta" onClick={() => setAbierto(false)} className="block px-4 py-2.5 font-body text-sm text-neutral-700 hover:bg-neutral-50">
              Mis reservas
            </Link>
            <Link href="/cuenta/perfil" onClick={() => setAbierto(false)} className="block px-4 py-2.5 font-body text-sm text-neutral-700 hover:bg-neutral-50">
              Editar perfil
            </Link>
            <div className="border-t border-neutral-100">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2.5 font-body text-sm text-red-500 hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
