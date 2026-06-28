import { prisma } from "@/lib/prisma";

function estrellas(puntuacion: number): string {
  return "★".repeat(puntuacion) + "☆".repeat(5 - puntuacion);
}

export async function ReviewList({ habitacionId }: { habitacionId: string }) {
  const resenas = await prisma.resena.findMany({
    where: { habitacionId, aprobada: true },
    orderBy: { creadaEn: "desc" },
    take: 20
  });

  if (resenas.length === 0) {
    return <p className="font-body text-sm text-ink/50">Todavía no hay reseñas para esta habitación.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {resenas.map((r) => (
        <li key={r.id} className="border-b border-hairline pb-4 last:border-0">
          <div className="flex items-center justify-between">
            <span className="font-body text-sm font-medium text-ink">{r.nombreHuesped}</span>
            <span className="font-mono text-sm text-gold">{estrellas(r.puntuacion)}</span>
          </div>
          <p className="mt-1 font-body text-sm text-ink/70">{r.comentario}</p>
        </li>
      ))}
    </ul>
  );
}
