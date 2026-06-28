import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { BookingForm } from "@/components/BookingForm";
import { ReviewList } from "@/components/ReviewList";
import { prisma } from "@/lib/prisma";
import { serializarHabitacion } from "@/types";

export default async function PaginaHabitacion({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { entrada?: string; salida?: string };
}) {
  const habitacion = await prisma.habitacion.findUnique({ where: { id: params.id } });

  if (!habitacion || !habitacion.activa) {
    notFound();
  }

  const habitacionSerializada = serializarHabitacion(habitacion);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <span className="eyebrow">{habitacionSerializada.tipo}</span>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{habitacionSerializada.nombre}</h1>
        <p className="mt-3 max-w-2xl font-body text-ink/70">{habitacionSerializada.descripcion}</p>

        {habitacionSerializada.comodidades.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {habitacionSerializada.comodidades.map((c) => (
              <li key={c} className="badge bg-moss/10 text-moss">
                {c}
              </li>
            ))}
          </ul>
        )}

        <section className="mt-10 border-t border-hairline pt-8">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">Reserva tus fechas</h2>
          <BookingForm
            habitacion={habitacionSerializada}
            entradaInicial={searchParams.entrada}
            salidaInicial={searchParams.salida}
          />
        </section>

        <section className="mt-10 border-t border-hairline pt-8">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">Opiniones de huéspedes</h2>
          <ReviewList habitacionId={habitacion.id} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
