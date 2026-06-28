import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatoFecha(fecha: Date): string {
  return fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

export default async function PaginaResumenAdmin() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [proximasReservas, pendientesPago, resenasPendientes] = await Promise.all([
    prisma.reserva.findMany({
      where: { estado: "CONFIRMADA", fechaEntrada: { gte: hoy } },
      orderBy: { fechaEntrada: "asc" },
      take: 8,
      include: { habitacion: true }
    }),
    prisma.reserva.count({ where: { estado: "PENDIENTE_PAGO" } }),
    prisma.resena.count({ where: { aprobada: false } })
  ]);

  return (
    <div>
      <span className="eyebrow">Resumen</span>
      <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Hola de nuevo</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-ticket border border-hairline bg-paper p-4">
          <span className="font-mono text-3xl text-ink">{proximasReservas.length}</span>
          <p className="mt-1 font-body text-sm text-ink/60">Próximas entradas confirmadas</p>
        </div>
        <div className="rounded-ticket border border-hairline bg-paper p-4">
          <span className="font-mono text-3xl text-gold">{pendientesPago}</span>
          <p className="mt-1 font-body text-sm text-ink/60">Reservas pendientes de pago</p>
        </div>
        <Link href="/admin/resenas" className="rounded-ticket border border-hairline bg-paper p-4 hover:bg-ink/5">
          <span className="font-mono text-3xl text-lantern">{resenasPendientes}</span>
          <p className="mt-1 font-body text-sm text-ink/60">Reseñas por moderar</p>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Próximas entradas</h2>
        {proximasReservas.length === 0 ? (
          <p className="font-body text-sm text-ink/50">No hay entradas próximas confirmadas.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {proximasReservas.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-md border border-hairline bg-paper px-4 py-3"
              >
                <span className="font-body text-sm text-ink">
                  {r.nombreHuesped} · {r.habitacion.nombre}
                </span>
                <span className="font-mono text-xs text-ink/50">
                  {formatoFecha(r.fechaEntrada)} → {formatoFecha(r.fechaSalida)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
