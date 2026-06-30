import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nombre: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const datos = schema.parse(body);

    const existe = await prisma.user.findUnique({ where: { email: datos.email } });
    if (existe) {
      return NextResponse.json({ error: "Este email ya tiene una cuenta." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(datos.password, 12);
    await prisma.user.create({
      data: { name: datos.nombre, email: datos.email, passwordHash }
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
