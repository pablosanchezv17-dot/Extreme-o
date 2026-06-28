import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const hoy = new Date();
  const limite = new Date();
  limite.setMonth(limite.getMonth() + 12);

  const reservas = await prisma.reserva.findMany({
    where: {
      habitacionId: params.id,
      estado: { in: ["PENDIENTE_PAGO", "CONFIRMADA", "COMPLETADA"] },
      fechaSalida: { gte: hoy },
      fechaEntrada: { lte: limite }
    },
    select: { fechaEntrada: true, fechaSalida: true }
  });

  return NextResponse.json({
    rangosOcupados: reservas.map((r) => ({
      entrada: r.fechaEntrada.toISOString().slice(0, 10),
      salida: r.fechaSalida.toISOString().slice(0, 10)
    }))
  });
}
