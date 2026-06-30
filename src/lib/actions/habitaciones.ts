"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function exigirSesion() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
}

function aSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface DatosHabitacion {
  nombre: string;
  descripcion: string;
  tipo: "PRIVADA" | "COMPARTIDA" | "DORMITORIO" | "SUITE";
  capacidad: number;
  precioPorNoche: number;
  imagenes: string[];
  comodidades: string[];
  activa: boolean;
}

export async function crearHabitacion(datos: DatosHabitacion) {
  await exigirSesion();

  await prisma.habitacion.create({
    data: {
      ...datos,
      slug: `${aSlug(datos.nombre)}-${Date.now().toString(36)}`
    }
  });

  revalidatePath("/admin/habitaciones");
  revalidatePath("/");
  redirect("/admin/habitaciones");
}

export async function actualizarHabitacion(id: string, datos: DatosHabitacion) {
  await exigirSesion();

  await prisma.habitacion.update({
    where: { id },
    data: datos
  });

  revalidatePath("/admin/habitaciones");
  revalidatePath("/");
  redirect("/admin/habitaciones");
}

/** No se borra físicamente para no perder el histórico de reservas asociadas. */
export async function marcarHabitacionInactiva(id: string) {
  await exigirSesion();

  await prisma.habitacion.update({ where: { id }, data: { activa: false } });

  revalidatePath("/admin/habitaciones");
  revalidatePath("/");
}

export async function reactivarHabitacion(id: string) {
  await exigirSesion();

  await prisma.habitacion.update({ where: { id }, data: { activa: true } });

  revalidatePath("/admin/habitaciones");
  revalidatePath("/");
}
