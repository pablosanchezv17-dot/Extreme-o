"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PaginaLoginAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const resultado = await signIn("credentials", { email, password, redirect: false });

    if (resultado?.error) {
      setError("Email o contraseña incorrectos.");
      setEnviando(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <form onSubmit={manejarSubmit} className="w-full max-w-sm rounded-ticket border border-hairline bg-paper p-6">
        <span className="eyebrow">Panel de administración</span>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Acceso de recepción</h1>

        <div className="mt-5">
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="field-label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="input-field"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="mt-3 text-sm text-lantern">{error}</p>}

        <button type="submit" disabled={enviando} className="btn-primary mt-5 w-full">
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
