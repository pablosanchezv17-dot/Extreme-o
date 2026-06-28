import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buscarHabitacionesDisponibles } from "@/lib/availability";
import { serializarHabitacion } from "@/types";

const busquedaSchema = z.object({
  entrada: z.string(),
  salida: z.string(),
  huespedes: z.coerce.number().int().min(1).max(20).default(1)
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const parseo = busquedaSchema.safeParse({
    entrada: searchParams.get("entrada"),
    salida: searchParams.get("salida"),
    huespedes: searchParams.get("huespedes") ?? "1"
  });

  if (!parseo.success) {
    return NextResponse.json(
      { error: "Parámetros de búsqueda inválidos. Se requieren 'entrada' y 'salida' (YYYY-MM-DD)." },
      { status: 400 }
    );
  }

  const fechaEntrada = new Date(parseo.data.entrada);
  const fechaSalida = new Date(parseo.data.salida);

  if (Number.isNaN(fechaEntrada.getTime()) || Number.isNaN(fechaSalida.getTime())) {
    return NextResponse.json({ error: "Fechas inválidas." }, { status: 400 });
  }

  if (fechaSalida <= fechaEntrada) {
    return NextResponse.json(
      { error: "La fecha de salida debe ser posterior a la de entrada." },
      { status: 400 }
    );
  }

  const habitaciones = await buscarHabitacionesDisponibles(
    fechaEntrada,
    fechaSalida,
    parseo.data.huespedes
  );

  return NextResponse.json({
    habitaciones: habitaciones.map(serializarHabitacion)
  });
}
