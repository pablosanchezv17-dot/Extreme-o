import { SiteHeaderSolid, SiteFooter } from "@/components/SiteHeader";

export default function AvisoLegal() {
  return (
    <>
      <SiteHeaderSolid />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-body text-3xl font-bold text-neutral-800 mb-2">Aviso Legal</h1>
        <p className="font-body text-sm text-neutral-400 mb-8">Última actualización: julio de 2026</p>

        <div className="prose prose-neutral max-w-none font-body text-neutral-700 space-y-6">
          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">1. Datos identificativos</h2>
            <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Denominación social:</strong> [COMPLETAR — Nombre de la SL]</li>
              <li><strong>NIF/CIF:</strong> [COMPLETAR]</li>
              <li><strong>Domicilio social:</strong> [COMPLETAR — Dirección completa], Villa del Prado, Madrid</li>
              <li><strong>Email:</strong> info@hostalaazahar.es</li>
              <li><strong>Sitio web:</strong> https://hostal-azahar.vercel.app</li>
            </ul>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">2. Objeto</h2>
            <p>El presente Aviso Legal regula el acceso y uso del sitio web del Hostal Azahar, cuya finalidad es facilitar información sobre el alojamiento y permitir la realización de reservas online.</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">3. Propiedad intelectual</h2>
            <p>Todos los contenidos del sitio web (textos, imágenes, logotipos, diseño) son propiedad de [COMPLETAR] o de terceros que han autorizado su uso. Queda prohibida su reproducción, distribución o modificación sin autorización expresa.</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">4. Responsabilidad</h2>
            <p>El titular del sitio web no se responsabiliza de los daños derivados del uso del mismo, ni de posibles errores en los contenidos. El usuario acepta que el acceso y uso del sitio es bajo su propia responsabilidad.</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">5. Legislación aplicable</h2>
            <p>El presente Aviso Legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Madrid.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
