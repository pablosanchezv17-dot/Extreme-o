"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    const res = await signIn("credentials-admin", { redirect: false, email, password });
    setCargando(false);
    if (res?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Email o contraseña incorrectos.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-card">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-olive-700 text-2xl">🏡</div>
          <h1 className="font-body text-xl font-bold text-neutral-800">Panel de administración</h1>
          <p className="mt-1 font-body text-sm text-neutral-500">Hostal Azahar</p>
        </div>
        <form onSubmit={manejarSubmit} className="space-y-4">
          <div>
            <label className="field-label">Email</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Contraseña</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="font-body text-sm text-rose-600">{error}</p>}
          <button type="submit" disabled={cargando} className="btn-primary w-full">
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
