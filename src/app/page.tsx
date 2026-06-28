import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { SearchBar } from "@/components/SearchBar";
import { RoomCard } from "@/components/RoomCard";
import { buscarHabitacionesDisponibles } from "@/lib/availability";
import { calcularNoches } from "@/lib/pricing";
import { serializarHabitacion } from "@/types";

function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function mananaISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default async function HomePage({
  searchParams
}: {
  searchParams: { entrada?: string; salida?: string; huespedes?: string };
}) {
  const entrada = searchParams.entrada ?? hoyISO();
  const salida = searchParams.salida ?? mananaISO();
  const huespedes = Number(searchParams.huespedes ?? "1") || 1;

  const fechaEntrada = new Date(entrada);
  const fechaSalida = new Date(salida);
  const fechasValidas = fechaSalida > fechaEntrada;

  const habitaciones = fechasValidas
    ? await buscarHabitacionesDisponibles(fechaEntrada, fechaSalida, huespedes)
    : [];

  const noches = fechasValidas ? calcularNoches(fechaEntrada, fechaSalida) : 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="border-b border-hairline pb-10">
          <span className="eyebrow">Bienvenido</span>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-ink sm:text-4xl">
            Reserva tu habitación directamente, sin comisiones de intermediarios.
          </h1>
          <div className="mt-8 rounded-ticket border border-hairline bg-paper p-5">
            <SearchBar entrada={entrada} salida={salida} huespedes={String(huespedes)} />
          </div>
        </section>

        <section className="py-10">
          {!fechasValidas ? (
            <p className="text-sm text-lantern">La fecha de salida debe ser posterior a la de entrada.</p>
          ) : habitaciones.length === 0 ? (
            <div className="rounded-ticket border border-dashed border-hairline p-8 text-center">
              <p className="font-display text-lg text-ink">No hay habitaciones libres para esas fechas.</p>
              <p className="mt-1 font-body text-sm text-ink/60">Prueba con otro rango de fechas o menos huéspedes.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <span className="eyebrow">
                {habitaciones.length} {habitaciones.length === 1 ? "habitación disponible" : "habitaciones disponibles"}
              </span>
              {habitaciones.map((h) => (
                <RoomCard
                  key={h.id}
                  habitacion={serializarHabitacion(h)}
                  noches={noches}
                  entrada={entrada}
                  salida={salida}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
