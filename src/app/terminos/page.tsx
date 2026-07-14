import { SiteHeaderSolid, SiteFooter } from "@/components/SiteHeader";

export default function Terminos() {
  return (
    <>
      <SiteHeaderSolid />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-body text-3xl font-bold text-neutral-800 mb-2">Términos y Condiciones de Reserva</h1>
        <p className="font-body text-sm text-neutral-400 mb-8">Última actualización: julio de 2026</p>

        <div className="font-body text-neutral-700 space-y-6">
          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">1. Titular del servicio</h2>
            <p>[COMPLETAR — Nombre de la SL], con CIF [COMPLETAR] y domicilio en [COMPLETAR], Villa del Prado, Madrid. Email: info@hostalaazahar.es</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">2. Proceso de reserva</h2>
            <p>La reserva se formaliza cuando el cliente completa el proceso de pago online a través de la pasarela de pago segura Redsys. En ese momento recibirá un número de localizador que confirma su reserva.</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">3. Precios</h2>
            <p>Todos los precios mostrados en el sitio web están expresados en euros (€) e incluyen el IVA aplicable. El precio final de cada reserva se muestra antes de confirmar el pago.</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">4. Cancelación y modificación</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cancelación gratuita:</strong> hasta 48 horas antes de la fecha de entrada.</li>
              <li><strong>Cancelación tardía:</strong> con menos de 48 horas de antelación, se cobrará el importe de la primera noche.</li>
              <li><strong>No presentación:</strong> se cobrará el importe total de la reserva.</li>
            </ul>
            <p className="mt-2 text-sm text-neutral-500">Para cancelar, el cliente puede hacerlo desde su panel de cuenta o contactando con el hostal en info@hostalaazahar.es.</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">5. Check-in y check-out</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Check-in:</strong> a partir de las 14:00 h.</li>
              <li><strong>Check-out:</strong> antes de las 12:00 h.</li>
              <li>Se puede solicitar check-in o check-out fuera de horario sujeto a disponibilidad.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">6. Normas del alojamiento</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>No se permiten mascotas salvo autorización previa.</li>
              <li>No se permite fumar en el interior del hostal.</li>
              <li>El horario de silencio es de 23:00 a 08:00 h.</li>
              <li>El hostal se reserva el derecho de admisión.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">7. Responsabilidad</h2>
            <p>El hostal no se responsabiliza de los objetos de valor dejados en las habitaciones sin utilizar la caja de seguridad disponible en recepción. Los daños causados por el cliente en las instalaciones serán repercutidos en su tarjeta de pago.</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">8. Legislación aplicable</h2>
            <p>Estos términos se rigen por la legislación española. Para cualquier reclamación, las partes se someten a los juzgados de Madrid, sin perjuicio del fuero que corresponda al consumidor.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
