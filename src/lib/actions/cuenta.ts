"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function cancelarReservaCliente(reservaId: string, userId: string) {
  const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
  // Verificar que la reserva pertenece al usuario
  if (!reserva || reserva.userId !== userId) return;
  if (!["CONFIRMADA", "PENDIENTE_PAGO"].includes(reserva.estado)) return;
  await prisma.reserva.update({
    where: { id: reservaId },
    data: { estado: "CANCELADA" },
  });
  revalidatePath("/cuenta");
}

export async function actualizarPerfil(userId: string, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const email = formData.get("email") as string;
  const telefono = formData.get("telefono") as string;

  if (!nombre || !email) return;

  await prisma.user.update({
    where: { id: userId },
    data: { name: nombre, email, telefono: telefono || null },
  });

  revalidatePath("/cuenta/perfil");
  revalidatePath("/cuenta");
  redirect("/cuenta");
}
