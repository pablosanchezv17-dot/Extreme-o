import { prisma } from "@/lib/prisma";
import { BookingsTable, type FilaReserva } from "@/components/admin/BookingsTable";

const ESTADOS = ["TODAS", "PENDIENTE_PAGO", "CONFIRMADA", "CANCELADA", "PAGO_FALLIDO", "COMPLETADA"] as const;

export default async function PaginaReservasAdmin({
  searchParams
}: {
  searchParams: { estado?: string };
}) {
  const estado = searchParams.estado ?? "TODAS";

  const reservas = await prisma.reserva.findMany({
    where: estado === "TODAS" ? {} : { estado: estado as never },
    orderBy: { fechaEntrada: "desc" },
    include: { habitacion: true },
    take: 200
  });

  const filas: FilaReserva[] = reservas.map((r) => ({
    id: r.id,
    numeroPedido: r.numeroPedido,
    nombreHuesped: r.nombreHuesped,
    habitacionNombre: r.habitacion.nombre,
    fechaEntrada: r.fechaEntrada.toISOString().slice(0, 10),
    fechaSalida: r.fechaSalida.toISOString().slice(0, 10),
    precioTotal: r.precioTotal.toNumber(),
    estado: r.estado
  }));

  return (
    <div>
      <span className="eyebrow">Gestión</span>
      <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Reservas</h1>

      <form method="get" className="mt-5 flex items-center gap-2">
        <label className="field-label !mb-0" htmlFor="estado">
          Estado
        </label>
        <select id="estado" name="estado" defaultValue={estado} className="input-field w-56">
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e.replace("_", " ")}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-secondary">
          Filtrar
        </button>
      </form>

      <div className="mt-5 overflow-x-auto rounded-ticket border border-hairline bg-paper p-4">
        <BookingsTable reservas={filas} />
      </div>
    </div>
  );
}
