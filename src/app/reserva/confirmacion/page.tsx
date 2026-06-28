import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";

function formatoFecha(fecha: Date): string {
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PaginaConfirmacion({
  searchParams
}: {
  searchParams: { pedido?: string };
}) {
  const numeroPedido = searchParams.pedido;

  const reserva = numeroPedido
    ? await prisma.reserva.findUnique({
        where: { numeroPedido },
        include: { habitacion: true }
      })
    : null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-16">
        {!reserva ? (
          <p className="font-body text-ink/70">No encontramos esa reserva.</p>
        ) : reserva.estado === "CONFIRMADA" || reserva.estado === "COMPLETADA" ? (
          <>
            <span className="eyebrow">Reserva confirmada</span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink">¡Todo listo, {reserva.nombreHuesped}!</h1>
            <p className="mt-2 font-body text-ink/70">Te hemos enviado los detalles a {reserva.emailHuesped}.</p>

            <div className="ticket mt-8">
              <div className="ticket-main">
                <span className="eyebrow">{reserva.habitacion.nombre}</span>
                <p className="mt-2 font-body text-sm text-ink/70">
                  {formatoFecha(reserva.fechaEntrada)} → {formatoFecha(reserva.fechaSalida)}
                </p>
                <p className="mt-1 font-mono text-xs text-ink/40">Localizador: {reserva.numeroPedido}</p>
              </div>
              <div className="ticket-stub">
                <span className="font-mono text-[11px] uppercase tracking-wide text-ink/50">
                  {reserva.noches} {reserva.noches === 1 ? "noche" : "noches"}
                </span>
                <span className="font-mono text-2xl font-medium text-ink">{reserva.precioTotal.toFixed(2)}€</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="eyebrow">Procesando pago</span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Estamos confirmando tu pago</h1>
            <p className="mt-2 font-body text-ink/70">
              Esto puede tardar unos segundos. Te avisaremos por email en cuanto se confirme. Si el cargo no aparece
              en unos minutos, contacta con recepción indicando el localizador{" "}
              <span className="font-mono">{reserva.numeroPedido}</span>.
            </p>
          </>
        )}

        <Link href="/" className="btn-secondary mt-10 inline-flex">
          Volver al inicio
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
