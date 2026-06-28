import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ReviewForm } from "@/components/ReviewForm";

export default function PaginaValorar({ searchParams }: { searchParams: { pedido?: string } }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <span className="eyebrow">Tu opinión nos ayuda</span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Valora tu estancia</h1>
        <p className="mt-2 font-body text-ink/70">
          Solo pueden valorar la estancia los huéspedes con una reserva confirmada.
        </p>
        <div className="mt-8">
          <ReviewForm numeroPedidoInicial={searchParams.pedido} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
