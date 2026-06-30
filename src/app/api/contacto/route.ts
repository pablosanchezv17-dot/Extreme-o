import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nombre: z.string().min(2).max(80),
  email: z.string().email(),
  telefono: z.string().max(30).optional(),
  mensaje: z.string().min(5).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const datos = schema.parse(body);

    await prisma.mensajeContacto.create({
      data: {
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono || null,
        mensaje: datos.mensaje,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Revisa los datos del formulario." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
