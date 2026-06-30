import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeaderSolid, SiteFooter } from "@/components/SiteHeader";
import { cancelarReservaCliente } from "@/lib/actions/cuenta";

function formatoFecha(fecha: Date) {
  return fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function BadgeEstado({ estado }: { estado: string }) {
  const clases: Record<string, string> = {
    CONFIRMADA: "bg-green-100 text-green-700",
    PENDIENTE_PAGO: "bg-amber-100 text-amber-700",
    CANCELADA: "bg-red-100 text-red-600",
    PAGO_FALLIDO: "bg-red-100 text-red-600",
    COMPLETADA: "bg-neutral-100 text-neutral-600",
  };
  const etiquetas: Record<string, string> = {
    CONFIRMADA: "Confirmada",
    PENDIENTE_PAGO: "Pendiente de pago",
    CANCELADA: "Cancelada",
    PAGO_FALLIDO: "Pago fallido",
    COMPLETADA: "Completada",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${clases[estado] ?? "bg-neutral-100 text-neutral-600"}`}>
      {etiquetas[estado] ?? estado}
    </span>
  );
}

export default async function PanelCliente() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/cuenta/login");

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/cuenta/login");

  const reservas = await prisma.reserva.findMany({
    where: { userId },
    orderBy: { creadaEn: "desc" },
    include: { habitacion: true },
  });

  const proximas = reservas.filter((r) => ["CONFIRMADA", "PENDIENTE_PAGO"].includes(r.estado));
  const pasadas = reservas.filter((r) => ["COMPLETADA", "CANCELADA", "PAGO_FALLIDO"].includes(r.estado));

  return (
    <>
      <SiteHeaderSolid />
      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Cabecera */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="eyebrow">Mi cuenta</span>
            <h1 className="mt-1 font-body text-2xl font-bold text-neutral-800">
              Hola, {user.name?.split(" ")[0] ?? "viajero"} 👋
            </h1>
          </div>
          <Link href="/cuenta/perfil" className="btn-secondary text-sm">
            Editar perfil
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { valor: reservas.length, label: "Reservas totales" },
            { valor: proximas.length, label: "Próximas estancias" },
            { valor: pasadas.filter((r) => r.estado === "COMPLETADA").length, label: "Estancias completadas" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-card">
              <div className="font-body text-3xl font-bold text-olive-700">{s.valor}</div>
              <div className="mt-1 font-body text-xs text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reservas próximas */}
        <section className="mb-10">
          <h2 className="mb-4 font-body text-lg font-semibold text-neutral-800">Próximas estancias</h2>
          {proximas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
              <p className="font-body text-neutral-500">No tienes estancias próximas.</p>
              <Link href="/" className="mt-3 inline-block btn-primary text-sm">
                Buscar habitaciones
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {proximas.map((r) => (
                <div key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-body font-semibold text-neutral-800">{r.habitacion.nombre}</h3>
                      <p className="mt-1 font-body text-sm text-neutral-500">
                        {formatoFecha(r.fechaEntrada)} → {formatoFecha(r.fechaSalida)} · {r.noches} {r.noches === 1 ? "noche" : "noches"}
                      </p>
                      <p className="mt-1 font-body text-xs text-neutral-400">Localizador: {r.numeroPedido}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <BadgeEstado estado={r.estado} />
                      <p className="mt-2 font-body text-lg font-bold text-neutral-800">{r.precioTotal.toString()}€</p>
                    </div>
                  </div>
                  {r.estado === "CONFIRMADA" && (
                    <div className="mt-4 border-t border-neutral-100 pt-4">
                      <form action={cancelarReservaCliente.bind(null, r.id, userId)}>
                        <button type="submit" className="font-body text-sm text-red-500 hover:underline">
                          Cancelar reserva
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Historial */}
        {pasadas.length > 0 && (
          <section>
            <h2 className="mb-4 font-body text-lg font-semibold text-neutral-800">Historial</h2>
            <div className="space-y-3">
              {pasadas.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div>
                    <p className="font-body text-sm font-medium text-neutral-700">{r.habitacion.nombre}</p>
                    <p className="font-body text-xs text-neutral-500">
                      {formatoFecha(r.fechaEntrada)} · {r.noches} {r.noches === 1 ? "noche" : "noches"}
                    </p>
                  </div>
                  <div className="text-right">
                    <BadgeEstado estado={r.estado} />
                    <p className="mt-1 font-body text-sm font-semibold text-neutral-700">{r.precioTotal.toString()}€</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
