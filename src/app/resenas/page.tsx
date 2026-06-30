import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeaderSolid, SiteFooter } from "@/components/SiteHeader";

function estrellas(puntuacion: number) {
  return "★".repeat(puntuacion) + "☆".repeat(5 - puntuacion);
}

export default async function PaginaResenas() {
  const resenas = await prisma.resena.findMany({
    where: { aprobada: true },
    orderBy: { creadaEn: "desc" },
    include: { habitacion: true },
  });

  const media =
    resenas.length > 0
      ? (resenas.reduce((acc, r) => acc + r.puntuacion, 0) / resenas.length).toFixed(1)
      : null;

  return (
    <>
      <SiteHeaderSolid />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center mb-10">
          <span className="eyebrow">Opiniones</span>
          <h1 className="mt-2 font-body text-2xl font-bold text-neutral-800">Lo que dicen nuestros huéspedes</h1>
          {media && (
            <p className="mt-2 font-body text-sm text-neutral-500">
              <span className="text-gold">{media}★</span> de media · {resenas.length} {resenas.length === 1 ? "reseña" : "reseñas"}
            </p>
          )}
        </div>

        {resenas.length === 0 ? (
          <p className="text-center font-body text-sm text-neutral-500">Todavía no hay reseñas publicadas.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {resenas.map((r) => (
              <div key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
                <span className="text-gold font-body">{estrellas(r.puntuacion)}</span>
                <p className="mt-3 font-body text-sm text-neutral-700 leading-relaxed">{r.comentario}</p>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <span className="font-body text-sm font-medium text-neutral-800">{r.nombreHuesped}</span>
                  <span className="font-body text-xs text-neutral-400">{r.habitacion.nombre}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/valorar" className="btn-secondary text-sm">
            ¿Has sido nuestro huésped? Deja tu reseña
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
