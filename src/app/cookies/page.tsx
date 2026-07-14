import { SiteHeaderSolid, SiteFooter } from "@/components/SiteHeader";

export default function Cookies() {
  return (
    <>
      <SiteHeaderSolid />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-body text-3xl font-bold text-neutral-800 mb-2">Política de Cookies</h1>
        <p className="font-body text-sm text-neutral-400 mb-8">Última actualización: julio de 2026</p>

        <div className="font-body text-neutral-700 space-y-6">
          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Sirven para recordar tus preferencias y mejorar tu experiencia.</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">Cookies que utilizamos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Cookie</th>
                    <th className="px-4 py-2 text-left font-semibold">Tipo</th>
                    <th className="px-4 py-2 text-left font-semibold">Finalidad</th>
                    <th className="px-4 py-2 text-left font-semibold">Duración</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">next-auth.session-token</td>
                    <td className="px-4 py-2">Técnica</td>
                    <td className="px-4 py-2">Mantener la sesión iniciada</td>
                    <td className="px-4 py-2">30 días</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">next-auth.csrf-token</td>
                    <td className="px-4 py-2">Técnica</td>
                    <td className="px-4 py-2">Seguridad contra ataques CSRF</td>
                    <td className="px-4 py-2">Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-neutral-500">Solo utilizamos cookies técnicas estrictamente necesarias. No usamos cookies publicitarias ni de seguimiento de terceros.</p>
          </section>

          <section>
            <h2 className="font-body text-lg font-semibold text-neutral-800 mb-2">Cómo desactivar las cookies</h2>
            <p>Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que si deshabilitas las cookies técnicas no podrás iniciar sesión en tu cuenta. Instrucciones según navegador:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-olive-700 underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener" className="text-olive-700 underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="text-olive-700 underline">Safari</a></li>
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
