import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export default function PaginaError({ searchParams }: { searchParams: { pedido?: string } }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <span className="eyebrow">Pago no completado</span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">El pago no se ha podido procesar</h1>
        <p className="mt-2 font-body text-ink/70">
          No se ha realizado ningún cargo. Puedes intentarlo de nuevo o elegir otra habitación.
        </p>
        {searchParams.pedido && (
          <p className="mt-1 font-mono text-xs text-ink/40">Referencia: {searchParams.pedido}</p>
        )}
        <Link href="/" className="btn-primary mt-8 inline-flex">
          Volver a intentarlo
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
