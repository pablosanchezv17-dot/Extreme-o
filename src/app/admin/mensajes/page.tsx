import { prisma } from "@/lib/prisma";
import { marcarMensajeLeido } from "@/lib/actions/mensajes";

function formatoFecha(fecha: Date) {
  return fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function PaginaMensajesAdmin() {
  const mensajes = await prisma.mensajeContacto.findMany({
    orderBy: { creadoEn: "desc" },
  });

  return (
    <div>
      <span className="eyebrow">Admin</span>
      <h1 className="mt-1 font-body text-2xl font-bold text-neutral-800">Mensajes de contacto</h1>

      {mensajes.length === 0 ? (
        <p className="mt-6 font-body text-sm text-neutral-500">No hay mensajes todavía.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {mensajes.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 ${m.leido ? "border-neutral-200 bg-white" : "border-olive-300 bg-olive-50"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-body font-semibold text-neutral-800">{m.nombre}</p>
                  <p className="font-body text-xs text-neutral-500">
                    {m.email}{m.telefono ? ` · ${m.telefono}` : ""}
                  </p>
                </div>
                <span className="font-body text-xs text-neutral-400 shrink-0">{formatoFecha(m.creadoEn)}</span>
              </div>
              <p className="mt-3 font-body text-sm text-neutral-700 whitespace-pre-wrap">{m.mensaje}</p>
              {!m.leido && (
                <form action={marcarMensajeLeido.bind(null, m.id)} className="mt-3">
                  <button type="submit" className="font-body text-xs text-olive-700 hover:underline">
                    Marcar como leído
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
