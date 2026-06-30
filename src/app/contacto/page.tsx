"use client";

import { useState } from "react";
import { SiteHeaderSolid, SiteFooter } from "@/components/SiteHeader";

export default function PaginaContacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const res = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, telefono, mensaje }),
    });

    setEnviando(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "No se ha podido enviar el mensaje.");
      return;
    }

    setEnviado(true);
    setNombre("");
    setEmail("");
    setTelefono("");
    setMensaje("");
  }

  return (
    <>
      <SiteHeaderSolid />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="text-center mb-8">
          <span className="eyebrow">Contacto</span>
          <h1 className="mt-2 font-body text-2xl font-bold text-neutral-800">¿Tienes alguna pregunta?</h1>
          <p className="mt-2 font-body text-sm text-neutral-500">
            Escríbenos y te responderemos lo antes posible.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
          {enviado ? (
            <div className="text-center py-8">
              <span className="text-4xl">✅</span>
              <p className="mt-4 font-body text-lg font-semibold text-neutral-800">Mensaje enviado</p>
              <p className="mt-1 font-body text-sm text-neutral-500">Gracias por escribirnos, te responderemos pronto.</p>
              <button onClick={() => setEnviado(false)} className="mt-5 btn-secondary text-sm">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={manejarSubmit} className="space-y-4">
              <div>
                <label className="field-label">Nombre</label>
                <input type="text" className="input-field" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="field-label">Teléfono (opcional)</label>
                <input type="tel" className="input-field" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
              <div>
                <label className="field-label">Mensaje</label>
                <textarea className="input-field min-h-[120px]" value={mensaje} onChange={(e) => setMensaje(e.target.value)} required />
              </div>
              {error && <p className="font-body text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={enviando} className="btn-primary w-full">
                {enviando ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
