"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelarReservaManual } from "@/lib/actions/reservas";

export interface FilaReserva {
  id: string;
  numeroPedido: string;
  nombreHuesped: string;
  habitacionNombre: string;
  fechaEntrada: string;
  fechaSalida: string;
  precioTotal: number;
  estado: string;
}

const CLASE_BADGE: Record<string, string> = {
  PENDIENTE_PAGO: "badge-pendiente",
  CONFIRMADA: "badge-confirmada",
  CANCELADA: "badge-cancelada",
  PAGO_FALLIDO: "badge-cancelada",
  COMPLETADA: "badge-completada"
};

export function BookingsTable({ reservas }: { reservas: FilaReserva[] }) {
  const router = useRouter();
  const [cancelando, setCancelando] = useState<string | null>(null);

  async function manejarCancelar(id: string) {
    if (!confirm("¿Cancelar esta reserva? Esta acción liberará las fechas de la habitación.")) return;
    setCancelando(id);
    await cancelarReservaManual(id);
    router.refresh();
    setCancelando(null);
  }

  if (reservas.length === 0) {
    return <p className="font-body text-sm text-ink/50">No hay reservas que coincidan con el filtro.</p>;
  }

  return (
    <table className="w-full min-w-[700px] border-collapse text-left">
      <thead>
        <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink/50">
          <th className="py-2 pr-4">Huésped</th>
          <th className="py-2 pr-4">Habitación</th>
          <th className="py-2 pr-4">Fechas</th>
          <th className="py-2 pr-4">Total</th>
          <th className="py-2 pr-4">Estado</th>
          <th className="py-2 pr-4">Localizador</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {reservas.map((r) => (
          <tr key={r.id} className="border-b border-hairline/60 font-body text-sm text-ink">
            <td className="py-3 pr-4">{r.nombreHuesped}</td>
            <td className="py-3 pr-4">{r.habitacionNombre}</td>
            <td className="py-3 pr-4 font-mono text-xs">
              {r.fechaEntrada} → {r.fechaSalida}
            </td>
            <td className="py-3 pr-4 font-mono">{r.precioTotal.toFixed(2)}€</td>
            <td className="py-3 pr-4">
              <span className={`badge ${CLASE_BADGE[r.estado] ?? ""}`}>{r.estado.replace("_", " ")}</span>
            </td>
            <td className="py-3 pr-4 font-mono text-xs text-ink/50">{r.numeroPedido}</td>
            <td className="py-3 text-right">
              {(r.estado === "CONFIRMADA" || r.estado === "PENDIENTE_PAGO") && (
                <button
                  type="button"
                  disabled={cancelando === r.id}
                  onClick={() => manejarCancelar(r.id)}
                  className="font-body text-xs text-lantern hover:underline disabled:opacity-50"
                >
                  Cancelar
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
