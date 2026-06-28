import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const resenaSchema = z.object({
  numeroPedido: z.string().min(1),
  puntuacion: z.coerce.number().int().min(1).max(5),
  comentario: z.string().min(10).max(1000)
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parseo = resenaSchema.safeParse(body);

  if (!parseo.success) {
    return NextResponse.json({ error: "Datos de reseña inválidos." }, { status: 400 });
  }

  const reserva = await prisma.reserva.findUnique({
    where: { numeroPedido: parseo.data.numeroPedido },
    include: { resena: true }
  });

  if (!reserva) {
    return NextResponse.json({ error: "No encontramos esa reserva." }, { status: 404 });
  }

  if (!["CONFIRMADA", "COMPLETADA"].includes(reserva.estado)) {
    return NextResponse.json(
      { error: "Solo se puede valorar una estancia con reserva confirmada." },
      { status: 403 }
    );
  }

  if (reserva.resena) {
    return NextResponse.json({ error: "Ya existe una reseña para esta reserva." }, { status: 409 });
  }

  await prisma.resena.create({
    data: {
      habitacionId: reserva.habitacionId,
      reservaId: reserva.id,
      nombreHuesped: reserva.nombreHuesped,
      puntuacion: parseo.data.puntuacion,
      comentario: parseo.data.comentario,
      aprobada: false
    }
  });

  return NextResponse.json({ ok: true, mensaje: "Gracias, tu reseña se publicará tras ser revisada." });
}
