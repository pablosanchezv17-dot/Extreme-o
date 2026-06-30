import { notFound } from "next/navigation";
import Image from "next/image";
import { SiteHeaderSolid, SiteFooter } from "@/components/SiteHeader";
import { BookingForm } from "@/components/BookingForm";
import { ReviewList } from "@/components/ReviewList";
import { prisma } from "@/lib/prisma";
import { serializarHabitacion } from "@/types";

const ETIQUETA_TIPO: Record<string, string> = {
  PRIVADA: "Habitación privada",
  COMPARTIDA: "Habitación compartida",
  DORMITORIO: "Dormitorio",
  SUITE: "Suite"
};

const IMAGEN_FALLBACK: Record<string, string> = {
  PRIVADA: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
  COMPARTIDA: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
  DORMITORIO: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?w=1200&q=80",
  SUITE: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80"
};

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
  const imagen = habitacionSerializada.imagenes?.[0] ?? IMAGEN_FALLBACK[habitacionSerializada.tipo] ?? IMAGEN_FALLBACK.PRIVADA;

  return (
    <>
      <SiteHeaderSolid />

      {/* Imagen principal */}
      <div className="relative h-72 w-full overflow-hidden sm:h-96">
        <Image
          src={imagen}
          alt={habitacionSerializada.nombre}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          {/* Columna izquierda */}
          <div>
            <span className="eyebrow">{ETIQUETA_TIPO[habitacionSerializada.tipo] ?? habitacionSerializada.tipo}</span>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">{habitacionSerializada.nombre}</h1>
            <p className="mt-1 font-body text-sm text-ink/50">
              Capacidad: {habitacionSerializada.capacidad} {habitacionSerializada.capacidad === 1 ? "persona" : "personas"}
            </p>

            <p className="mt-5 font-body leading-relaxed text-ink/70">{habitacionSerializada.descripcion}</p>

            {habitacionSerializada.comodidades.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display text-lg font-semibold text-ink">Lo que incluye</h2>
                <ul className="mt-3 grid grid-cols-2 gap-2">
                  {habitacionSerializada.comodidades.map((c) => (
                    <li key={c} className="flex items-center gap-2 font-body text-sm text-ink/70">
                      <span className="text-moss">✓</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <section className="mt-10 border-t border-hairline pt-8">
              <h2 className="mb-4 font-display text-xl font-semibold text-ink">Opiniones de huéspedes</h2>
              <ReviewList habitacionId={habitacion.id} />
            </section>
          </div>

          {/* Columna derecha: formulario de reserva */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-hairline bg-paper p-6 shadow-lg">
              <div className="mb-4 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-ink">
                  {habitacionSerializada.precioPorNoche.toFixed(2)}€
                </span>
                <span className="font-body text-sm text-ink/50">/noche</span>
              </div>
              <BookingForm
                habitacion={habitacionSerializada}
                entradaInicial={searchParams.entrada}
                salidaInicial={searchParams.salida}
              />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
