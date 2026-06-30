import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { SearchBar } from "@/components/SearchBar";
import { RoomCard } from "@/components/RoomCard";
import { Gallery } from "@/components/Gallery";
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
  const hayBusqueda = !!searchParams.entrada;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[580px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-olive-900/80 via-olive-800/60 to-olive-900/80" />
        <SiteHeader />

        <div className="relative z-10 w-full max-w-4xl px-6 pt-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-2 mb-4">
            <span className="text-white/90 font-body text-sm">📍 Villa del Prado, Madrid · Reserva directa</span>
          </div>
          <h1 className="font-body text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-tight">
            Tu alojamiento perfecto<br />
            <span className="text-olive-300">con piscina en la azotea</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-white/80">
            Sin comisiones. Sin intermediarios. Precios directos del hostal.
          </p>

          {/* Buscador */}
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="rounded-2xl bg-white p-2 shadow-2xl">
              <SearchBar entrada={entrada} salida={salida} huespedes={String(huespedes)} />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex items-center justify-center gap-8">
            {[
              { valor: "100+", label: "Huéspedes felices" },
              { valor: "4.9★", label: "Valoración media" },
              { valor: "0%", label: "Comisiones" }
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-body text-xl font-bold text-white">{s.valor}</div>
                <div className="font-body text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* Features — solo si no hay búsqueda activa */}
        {!hayBusqueda && (
          <section className="mb-14">
            <div className="text-center mb-8">
              <span className="eyebrow">¿Por qué elegirnos?</span>
              <h2 className="mt-2 font-body text-2xl font-bold text-neutral-800">
                La experiencia más cómoda
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { icono: "🏊", titulo: "Piscina en la azotea", texto: "Disfruta de nuestra piscina con vistas y relájate después de un día explorando Madrid." },
                { icono: "🍹", titulo: "Bar y restaurante", texto: "En la misma azotea, junto a la piscina, encontrarás nuestro bar y restaurante para todo el día." },
                { icono: "💰", titulo: "Sin comisiones", texto: "Reserva directamente. El precio que ves es exactamente lo que pagas, sin sorpresas." }
              ].map((f) => (
                <div key={f.titulo} className="rounded-2xl border border-neutral-200 bg-white p-7 hover:border-olive-300 hover:shadow-card transition-all">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-olive-50 text-2xl mb-4">
                    {f.icono}
                  </div>
                  <h3 className="font-body text-base font-semibold text-neutral-800">{f.titulo}</h3>
                  <p className="mt-2 font-body text-sm text-neutral-500 leading-relaxed">{f.texto}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Galería de fotos */}
        {!hayBusqueda && (
          <section className="mb-14">
            <Gallery />
          </section>
        )}

        {/* Habitaciones */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="eyebrow">Disponibilidad</span>
              <h2 className="mt-1 font-body text-2xl font-bold text-neutral-800">
                {hayBusqueda ? "Habitaciones disponibles" : "Nuestras habitaciones"}
              </h2>
            </div>
            {fechasValidas && habitaciones.length > 0 && (
              <span className="rounded-full bg-olive-50 px-4 py-1.5 font-body text-sm font-medium text-olive-700">
                {habitaciones.length} disponibles · {noches} {noches === 1 ? "noche" : "noches"}
              </span>
            )}
          </div>

          {!fechasValidas ? (
            <p className="text-sm text-rose">La fecha de salida debe ser posterior a la de entrada.</p>
          ) : habitaciones.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-16 text-center">
              <span className="text-5xl">🔍</span>
              <p className="mt-4 font-body text-xl font-semibold text-neutral-700">No hay habitaciones libres</p>
              <p className="mt-2 font-body text-sm text-neutral-500">Prueba con otro rango de fechas o menos huéspedes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* CTA contacto */}
        {!hayBusqueda && (
          <section className="mt-16 rounded-3xl bg-olive-700 p-10 text-center text-white">
            <h2 className="font-body text-2xl font-bold">¿Tienes alguna pregunta?</h2>
            <p className="mt-2 font-body text-olive-200">Contáctanos directamente y te ayudamos a encontrar la opción perfecta.</p>
            <a href="mailto:info@hostalextremeno.es" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-body text-sm font-semibold text-olive-700 hover:bg-olive-50 transition-all">
              ✉️ Escribirnos
            </a>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
