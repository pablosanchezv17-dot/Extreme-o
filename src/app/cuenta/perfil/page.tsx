import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SiteHeaderSolid, SiteFooter } from "@/components/SiteHeader";
import { actualizarPerfil } from "@/lib/actions/cuenta";
import Link from "next/link";

export default async function EditarPerfil() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/cuenta/login");

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/cuenta/login");

  return (
    <>
      <SiteHeaderSolid />
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-6">
          <Link href="/cuenta" className="font-body text-sm text-neutral-500 hover:text-neutral-800 flex items-center gap-1">
            ← Volver a mi cuenta
          </Link>
          <h1 className="mt-3 font-body text-2xl font-bold text-neutral-800">Editar perfil</h1>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
          <form action={actualizarPerfil.bind(null, userId)} className="space-y-5">
            <div>
              <label className="field-label">Nombre completo</label>
              <input
                name="nombre"
                type="text"
                className="input-field"
                defaultValue={user.name ?? ""}
                required
              />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input
                name="email"
                type="email"
                className="input-field"
                defaultValue={user.email ?? ""}
                required
              />
            </div>
            <div>
              <label className="field-label">Teléfono (opcional)</label>
              <input
                name="telefono"
                type="tel"
                className="input-field"
                defaultValue={user.telefono ?? ""}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Guardar cambios
            </button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
