import { prisma } from "@/lib/prisma";

/**
 * Dos rangos [entrada, salida) se solapan si una reserva empieza antes de que
 * la otra termine, y termina después de que la otra empiece. Se usa el rango
 * "noche de entrada incluida, noche de salida no incluida" como en cualquier
 * sistema de reservas hotelero.
 */
export async function habitacionDisponible(
  habitacionId: string,
  fechaEntrada: Date,
  fechaSalida: Date,
  excluirReservaId?: string
): Promise<boolean> {
  const solapadas = await prisma.reserva.findFirst({
    where: {
      habitacionId,
      id: excluirReservaId ? { not: excluirReservaId } : undefined,
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "COMPLETADA"] },
      fechaEntrada: { lt: fechaSalida },
      fechaSalida: { gt: fechaEntrada }
    },
    select: { id: true }
  });

  return solapadas === null;
}

/**
 * Devuelve, para un rango de fechas dado, las habitaciones activas que están
 * libres durante todo ese rango.
 */
export async function buscarHabitacionesDisponibles(
  fechaEntrada: Date,
  fechaSalida: Date,
  huespedes: number
) {
  const habitaciones = await prisma.habitacion.findMany({
    where: {
      activa: true,
      capacidad: { gte: huespedes }
    },
    orderBy: { precioPorNoche: "asc" }
  });

  const disponibles = [];
  for (const habitacion of habitaciones) {
    const libre = await habitacionDisponible(habitacion.id, fechaEntrada, fechaSalida);
    if (libre) disponibles.push(habitacion);
  }
  return disponibles;
}
