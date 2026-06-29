import Link from "next/link";
import Image from "next/image";
import type { HabitacionSerializada } from "@/types";

const ETIQUETA_TIPO: Record<string, string> = {
  PRIVADA: "Habitación privada",
  COMPARTIDA: "Habitación compartida",
  DORMITORIO: "Dormitorio"
};

const IMAGEN_FALLBACK: Record<string, string> = {
  PRIVADA: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  COMPARTIDA: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
  DORMITORIO: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?w=800&q=80"
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
  const imagen = habitacion.imagenes?.[0] ?? IMAGEN_FALLBACK[habitacion.tipo] ?? IMAGEN_FALLBACK.PRIVADA;

  return (
    <Link
      href={`/habitaciones/${habitacion.id}?entrada=${entrada}&salida=${salida}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-2xl bg-white border border-neutral-200 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
        {/* Imagen */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={imagen}
            alt={habitacion.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {/* Badge tipo */}
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 font-body text-xs font-semibold text-olive-700 shadow-sm">
              {ETIQUETA_TIPO[habitacion.tipo] ?? habitacion.tipo}
            </span>
          </div>
          {/* Badge capacidad */}
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 font-body text-xs font-medium text-neutral-700 shadow-sm">
              👥 {habitacion.capacidad} {habitacion.capacidad === 1 ? "persona" : "personas"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-body text-base font-semibold text-neutral-800 truncate group-hover:text-olive-700 transition-colors">
                {habitacion.nombre}
              </h3>
              <p className="mt-1 line-clamp-2 font-body text-sm text-neutral-500">
                {habitacion.descripcion}
              </p>
            </div>
          </div>

          {/* Comodidades */}
          {habitacion.comodidades.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {habitacion.comodidades.slice(0, 3).map((c) => (
                <span key={c} className="rounded-full bg-olive-50 px-2.5 py-1 font-body text-xs text-olive-700">
                  {c}
                </span>
              ))}
              {habitacion.comodidades.length > 3 && (
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-body text-xs text-neutral-500">
                  +{habitacion.comodidades.length - 3} más
                </span>
              )}
            </div>
          )}

          {/* Precio */}
          <div className="mt-4 flex items-end justify-between border-t border-neutral-100 pt-4">
            <div className="flex items-center gap-1 text-gold">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="text-xs">{s}</span>
              ))}
            </div>
            <div className="text-right">
              <div className="font-body text-lg font-bold text-neutral-800">
                {total.toFixed(2)}€
              </div>
              <div className="font-body text-xs text-neutral-500">
                {habitacion.precioPorNoche.toFixed(2)}€/noche · {noches} {noches === 1 ? "noche" : "noches"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
