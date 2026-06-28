import { prisma } from "@/lib/prisma";
import { aprobarResena, rechazarResena } from "@/lib/actions/resenas";

function estrellas(puntuacion: number): string {
  return "★".repeat(puntuacion) + "☆".repeat(5 - puntuacion);
}

export default async function PaginaResenasAdmin() {
  const resenas = await prisma.resena.findMany({
    orderBy: { creadaEn: "desc" },
    include: { habitacion: true }
  });

  const pendientes = resenas.filter((r) => !r.aprobada);
  const aprobadas = resenas.filter((r) => r.aprobada);

  return (
    <div>
      <span className="eyebrow">Gestión</span>
      <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Reseñas</h1>

      <section className="mt-6">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Pendientes de moderar</h2>
        {pendientes.length === 0 ? (
          <p className="font-body text-sm text-ink/50">No hay reseñas pendientes.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendientes.map((r) => (
              <div key={r.id} className="rounded-ticket border border-hairline bg-paper p-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm font-medium text-ink">
                    {r.nombreHuesped} · {r.habitacion.nombre}
                  </span>
                  <span className="font-mono text-sm text-gold">{estrellas(r.puntuacion)}</span>
                </div>
                <p className="mt-2 font-body text-sm text-ink/70">{r.comentario}</p>
                <div className="mt-3 flex gap-3">
                  <form action={aprobarResena.bind(null, r.id)}>
                    <button type="submit" className="font-body text-sm text-moss hover:underline">
                      Aprobar
                    </button>
                  </form>
                  <form action={rechazarResena.bind(null, r.id)}>
                    <button type="submit" className="font-body text-sm text-lantern hover:underline">
                      Rechazar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Publicadas</h2>
        {aprobadas.length === 0 ? (
          <p className="font-body text-sm text-ink/50">Todavía no hay reseñas publicadas.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {aprobadas.map((r) => (
              <div key={r.id} className="flex items-center justify-between border-b border-hairline py-2">
                <span className="font-body text-sm text-ink">
                  {r.nombreHuesped} · {r.habitacion.nombre}
                </span>
                <span className="font-mono text-sm text-gold">{estrellas(r.puntuacion)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
