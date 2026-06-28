import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-hairline bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          Tu Hostal
        </Link>
        <span className="eyebrow">Reserva directa · sin comisiones</span>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-hairline py-8">
      <div className="mx-auto max-w-5xl px-6 font-body text-sm text-ink/60">
        <p>Tu Hostal · Reservas gestionadas directamente por el alojamiento.</p>
      </div>
    </footer>
  );
}
