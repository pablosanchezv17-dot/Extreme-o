import { SiteHeaderSolid, SiteFooter } from "@/components/SiteHeader";

export default function Privacidad() {
  return (
    <>
      <SiteHeaderSolid />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-body text-3xl font-bold text-neutral-800 mb-2">Política de Privacidad</h1>
        <p className="font-body text-sm text-neutral-400 mb-8">Última actualización: julio de 2026</p>

        <div className="font-body text-neutral-700 space-y-6">
          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">1. Responsable del tratamiento</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Denominación social:</strong> [COMPLETAR]</li>
              <li><strong>NIF/CIF:</strong> [COMPLETAR]</li>
              <li><strong>Domicilio:</strong> [COMPLETAR], Villa del Prado, Madrid</li>
              <li><strong>Email:</strong> info@hostalaazahar.es</li>
            </ul>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">2. Datos que recogemos</h2>
            <p>Recogemos los siguientes datos personales:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Al hacer una reserva:</strong> nombre, email, teléfono, fechas y datos de pago (gestionados por la pasarela de pago Redsys).</li>
              <li><strong>Al registrarte:</strong> nombre, email y contraseña (almacenada cifrada).</li>
              <li><strong>Al usar el formulario de contacto:</strong> nombre, email, teléfono y mensaje.</li>
              <li><strong>Al dejar una reseña:</strong> nombre y valoración.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">3. Finalidad y base jurídica</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Gestión de reservas:</strong> ejecución del contrato (art. 6.1.b RGPD).</li>
              <li><strong>Cuenta de usuario:</strong> ejecución del contrato (art. 6.1.b RGPD).</li>
              <li><strong>Atención al cliente:</strong> interés legítimo (art. 6.1.f RGPD).</li>
              <li><strong>Reseñas:</strong> consentimiento del usuario (art. 6.1.a RGPD).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">4. Conservación de datos</h2>
            <p>Los datos se conservan durante el tiempo necesario para la prestación del servicio y, una vez finalizado, durante los plazos legalmente exigidos (máximo 5 años para datos de reservas).</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">5. Destinatarios</h2>
            <p>No cedemos datos a terceros salvo obligación legal. Utilizamos los siguientes proveedores de servicios (encargados del tratamiento):</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Supabase Inc. — almacenamiento de base de datos (UE)</li>
              <li>Vercel Inc. — hosting web</li>
              <li>Redsys — procesamiento de pagos</li>
              <li>Anthropic PBC — asistente virtual IA (sin datos identificativos)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">6. Tus derechos</h2>
            <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, portabilidad, limitación y oposición escribiendo a <strong>info@hostalaazahar.es</strong>. También puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
