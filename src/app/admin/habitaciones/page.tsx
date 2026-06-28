import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { marcarHabitacionInactiva, reactivarHabitacion } from "@/lib/actions/habitaciones";

export default async function PaginaHabitacionesAdmin() {
  const habitaciones = await prisma.habitacion.findMany({ orderBy: { creadaEn: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Gestión</span>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Habitaciones</h1>
        </div>
        <Link href="/admin/habitaciones/nueva" className="btn-primary">
          + Nueva habitación
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {habitaciones.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between rounded-ticket border border-hairline bg-paper p-4"
          >
            <div>
              <span className="font-body text-sm font-medium text-ink">{h.nombre}</span>
              <span className="ml-2 font-mono text-xs text-ink/50">{h.precioPorNoche.toFixed(2)}€/noche</span>
              {!h.activa && <span className="badge badge-cancelada ml-2">Inactiva</span>}
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/habitaciones/${h.id}`} className="font-body text-sm text-moss hover:underline">
                Editar
              </Link>
              <form
                action={async () => {
                  "use server";
                  if (h.activa) {
                    await marcarHabitacionInactiva(h.id);
                  } else {
                    await reactivarHabitacion(h.id);
                  }
                }}
              >
                <button type="submit" className="font-body text-sm text-ink/50 hover:underline">
                  {h.activa ? "Desactivar" : "Reactivar"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
