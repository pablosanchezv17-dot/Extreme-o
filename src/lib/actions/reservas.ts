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

export async function cancelarReservaManual(id: string) {
  await exigirSesion();
  await prisma.reserva.update({ where: { id }, data: { estado: "CANCELADA" } });
  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
}
