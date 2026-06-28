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

export async function aprobarResena(id: string) {
  await exigirSesion();
  await prisma.resena.update({ where: { id }, data: { aprobada: true } });
  revalidatePath("/admin/resenas");
}

export async function rechazarResena(id: string) {
  await exigirSesion();
  await prisma.resena.delete({ where: { id } });
  revalidatePath("/admin/resenas");
}
