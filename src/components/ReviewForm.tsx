"use client";

import { useState } from "react";

export function ReviewForm({ numeroPedidoInicial }: { numeroPedidoInicial?: string }) {
  const [numeroPedido, setNumeroPedido] = useState(numeroPedidoInicial ?? "");
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);

    try {
      const respuesta = await fetch("/api/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroPedido, puntuacion, comentario })
      });
      const data = await respuesta.json();
      setResultado({ ok: respuesta.ok, mensaje: data.mensaje ?? data.error ?? "Algo no ha ido bien." });
    } catch {
      setResultado({ ok: false, mensaje: "Error de conexión. Inténtalo de nuevo." });
    } finally {
      setEnviando(false);
    }
  }

  if (resultado?.ok) {
    return <p className="font-body text-sm text-moss">{resultado.mensaje}</p>;
  }

  return (
    <form onSubmit={manejarSubmit} className="flex max-w-md flex-col gap-3">
      <div>
        <label className="field-label" htmlFor="numeroPedido">
          Localizador de tu reserva
        </label>
        <input
          id="numeroPedido"
          className="input-field"
          required
          value={numeroPedido}
          onChange={(e) => setNumeroPedido(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label" htmlFor="puntuacion">
          Puntuación
        </label>
        <select
          id="puntuacion"
          className="input-field"
          value={puntuacion}
          onChange={(e) => setPuntuacion(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "estrella" : "estrellas"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="comentario">
          Tu comentario
        </label>
        <textarea
          id="comentario"
          className="input-field min-h-[100px]"
          required
          minLength={10}
          maxLength={1000}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
      </div>
      {resultado && !resultado.ok && <p className="text-sm text-lantern">{resultado.mensaje}</p>}
      <button type="submit" disabled={enviando} className="btn-primary">
        {enviando ? "Enviando…" : "Enviar reseña"}
      </button>
    </form>
  );
}
