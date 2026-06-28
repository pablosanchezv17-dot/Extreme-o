"use client";

import { useState } from "react";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { calcularNoches, calcularPrecioTotal } from "@/lib/pricing";
import type { HabitacionSerializada } from "@/types";

function enviarFormularioRedsys(redsysUrl: string, campos: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = redsysUrl;

  for (const [nombre, valor] of Object.entries(campos)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = nombre;
    input.value = valor;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

export function BookingForm({
  habitacion,
  entradaInicial,
  salidaInicial
}: {
  habitacion: HabitacionSerializada;
  entradaInicial?: string;
  salidaInicial?: string;
}) {
  const [entrada, setEntrada] = useState(entradaInicial ?? "");
  const [salida, setSalida] = useState(salidaInicial ?? "");
  const [nombreHuesped, setNombreHuesped] = useState("");
  const [emailHuesped, setEmailHuesped] = useState("");
  const [telefonoHuesped, setTelefonoHuesped] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const noches = entrada && salida ? calcularNoches(new Date(entrada), new Date(salida)) : 0;
  const total = noches > 0 ? calcularPrecioTotal(habitacion.precioPorNoche, noches) : 0;

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!entrada || !salida || noches <= 0) {
      setError("Selecciona primero las fechas de entrada y salida en el calendario.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitacionId: habitacion.id,
          fechaEntrada: entrada,
          fechaSalida: salida,
          nombreHuesped,
          emailHuesped,
          telefonoHuesped
        })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setError(data.error ?? "No se ha podido crear la reserva.");
        setEnviando(false);
        return;
      }

      enviarFormularioRedsys(data.redsysUrl, data.camposFormulario);
      // No quitamos "enviando" aquí: la página está a punto de navegar al TPV.
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <AvailabilityCalendar
        habitacionId={habitacion.id}
        entradaInicial={entradaInicial}
        salidaInicial={salidaInicial}
        onSeleccion={(e, s) => {
          setEntrada(e);
          setSalida(s);
        }}
      />

      <form onSubmit={manejarSubmit} className="flex flex-col gap-3">
        <div>
          <label className="field-label" htmlFor="nombreHuesped">
            Nombre completo
          </label>
          <input
            id="nombreHuesped"
            className="input-field"
            required
            minLength={2}
            value={nombreHuesped}
            onChange={(e) => setNombreHuesped(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="emailHuesped">
            Email
          </label>
          <input
            id="emailHuesped"
            type="email"
            className="input-field"
            required
            value={emailHuesped}
            onChange={(e) => setEmailHuesped(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="telefonoHuesped">
            Teléfono
          </label>
          <input
            id="telefonoHuesped"
            type="tel"
            className="input-field"
            required
            minLength={6}
            value={telefonoHuesped}
            onChange={(e) => setTelefonoHuesped(e.target.value)}
          />
        </div>

        <div className="ticket mt-2">
          <div className="ticket-main">
            <span className="eyebrow">Resumen</span>
            <p className="mt-1 font-body text-sm text-ink/70">
              {noches > 0 ? `${noches} ${noches === 1 ? "noche" : "noches"}` : "Selecciona fechas"}
            </p>
          </div>
          <div className="ticket-stub">
            <span className="font-mono text-2xl font-medium text-ink">{total.toFixed(2)}€</span>
          </div>
        </div>

        {error && <p className="text-sm text-lantern">{error}</p>}

        <button type="submit" disabled={enviando} className="btn-primary mt-1">
          {enviando ? "Redirigiendo al pago…" : "Reservar y pagar"}
        </button>
        <p className="font-mono text-[11px] text-ink/40">Pago seguro a través de Redsys.</p>
      </form>
    </div>
  );
}
