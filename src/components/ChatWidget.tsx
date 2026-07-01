"use client";

import { useState, useRef, useEffect } from "react";

type Mensaje = { role: "user" | "assistant"; content: string };

const MENSAJE_BIENVENIDA: Mensaje = {
  role: "assistant",
  content: "¡Hola! Soy el asistente del Hostal Azahar 🏡 Puedo ayudarte con dudas sobre habitaciones, precios o la piscina y el bar de la azotea. ¿En qué te ayudo?"
};

export function ChatWidget() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([MENSAJE_BIENVENIDA]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, abierto]);

  async function enviarMensaje(e: React.FormEvent) {
    e.preventDefault();
    const contenido = texto.trim();
    if (!contenido || cargando) return;

    const nuevosMensajes: Mensaje[] = [...mensajes, { role: "user", content: contenido }];
    setMensajes(nuevosMensajes);
    setTexto("");
    setCargando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensajes: nuevosMensajes.filter((m) => m !== MENSAJE_BIENVENIDA) })
      });
      const data = await res.json();

      if (!res.ok) {
        setMensajes((prev) => [...prev, { role: "assistant", content: data.error ?? "Ha ocurrido un error." }]);
      } else {
        setMensajes((prev) => [...prev, { role: "assistant", content: data.respuesta }]);
      }
    } catch {
      setMensajes((prev) => [
        ...prev,
        { role: "assistant", content: "No se ha podido conectar con el asistente. Inténtalo de nuevo." }
      ]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir chat de ayuda"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-olive-700 text-2xl text-white shadow-card-hover transition-transform hover:scale-105"
      >
        {abierto ? "✕" : "💬"}
      </button>

      {/* Ventana de chat */}
      {abierto && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[480px] w-[340px] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card-hover">
          {/* Cabecera */}
          <div className="flex items-center gap-2 bg-olive-700 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">🏡</div>
            <div>
              <p className="font-body text-sm font-semibold text-white">Asistente Hostal Azahar</p>
              <p className="font-body text-[11px] text-olive-200">Disponible 24h</p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-neutral-50 px-3 py-4">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 font-body text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-olive-700 text-white rounded-br-sm"
                      : "bg-white text-neutral-700 border border-neutral-200 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {cargando && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-neutral-200 bg-white px-3 py-2 font-body text-sm text-neutral-400">
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={finRef} />
          </div>

          {/* Input */}
          <form onSubmit={enviarMensaje} className="flex items-center gap-2 border-t border-neutral-200 p-3">
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 rounded-full border border-neutral-200 px-3 py-2 font-body text-sm focus:border-olive-600 focus:outline-none"
              disabled={cargando}
            />
            <button
              type="submit"
              disabled={cargando || !texto.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-olive-700 text-white disabled:opacity-40"
              aria-label="Enviar"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
