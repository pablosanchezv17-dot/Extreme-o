import Link from "next/link";
import type { HabitacionSerializada } from "@/types";

const ETIQUETA_TIPO: Record<string, string> = {
  PRIVADA: "Privada",
  COMPARTIDA: "Compartida",
  DORMITORIO: "Dormitorio"
};

export function RoomCard({
  habitacion,
  noches,
  entrada,
  salida
}: {
  habitacion: HabitacionSerializada;
  noches: number;
  entrada: string;
  salida: string;
}) {
  const total = habitacion.precioPorNoche * noches;

  return (
    <Link
      href={`/habitaciones/${habitacion.id}?entrada=${entrada}&salida=${salida}`}
      className="ticket transition-shadow hover:shadow-md"
    >
      <div className="ticket-main">
        <span className="eyebrow">{ETIQUETA_TIPO[habitacion.tipo] ?? habitacion.tipo}</span>
        <h3 className="mt-1 font-display text-lg font-semibold text-ink">{habitacion.nombre}</h3>
        <p className="mt-1 line-clamp-2 font-body text-sm text-ink/70">{habitacion.descripcion}</p>
        {habitacion.comodidades.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {habitacion.comodidades.slice(0, 4).map((c) => (
              <li key={c} className="font-mono text-[11px] uppercase tracking-wide text-moss">
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="ticket-stub">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink/50">
          {noches} {noches === 1 ? "noche" : "noches"}
        </span>
        <span className="font-mono text-2xl font-medium text-ink">{total.toFixed(2)}€</span>
        <span className="font-mono text-[11px] text-ink/50">{habitacion.precioPorNoche.toFixed(2)}€/noche</span>
      </div>
    </Link>
  );
}
