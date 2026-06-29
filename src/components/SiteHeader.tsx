import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
            <span className="text-lg">🏡</span>
          </div>
          <span className="font-body text-lg font-bold text-white drop-shadow">
            Hostal Extremeño
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/valorar" className="font-body text-sm font-medium text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
            Reseñas
          </Link>
          <Link href="/admin" className="font-body text-sm font-semibold bg-white text-olive-700 px-4 py-2 rounded-lg hover:bg-neutral-100 transition-all">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteHeaderSolid() {
  return (
    <header className="sticky top-0 z-20 bg-white shadow-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-olive-700">
            <span className="text-lg">🏡</span>
          </div>
          <span className="font-body text-lg font-bold text-olive-700">
            Hostal Extremeño
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/" className="btn-ghost text-sm">
            Habitaciones
          </Link>
          <Link href="/valorar" className="btn-ghost text-sm">
            Reseñas
          </Link>
          <Link href="/admin" className="btn-primary text-xs px-4 py-2">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-neutral-800 text-white mt-20">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-olive-600">
                <span className="text-lg">🏡</span>
              </div>
              <span className="font-body text-base font-bold text-white">Hostal Extremeño</span>
            </div>
            <p className="mt-3 font-body text-sm text-neutral-400 leading-relaxed">
              Alojamiento en el corazón de Extremadura. Reserva directa, sin comisiones.
            </p>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Alojamiento</p>
            <ul className="space-y-2">
              <li><Link href="/" className="font-body text-sm text-neutral-400 hover:text-white transition-colors">Ver habitaciones</Link></li>
              <li><Link href="/valorar" className="font-body text-sm text-neutral-400 hover:text-white transition-colors">Dejar reseña</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Contacto</p>
            <ul className="space-y-2">
              <li><span className="font-body text-sm text-neutral-400">info@hostalextremeno.es</span></li>
              <li><span className="font-body text-sm text-neutral-400">+34 600 000 000</span></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Legal</p>
            <ul className="space-y-2">
              <li><span className="font-body text-sm text-neutral-400">Política de privacidad</span></li>
              <li><span className="font-body text-sm text-neutral-400">Aviso legal</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-neutral-500">© {new Date().getFullYear()} Hostal Extremeño. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span className="font-body text-xs text-neutral-500">Reserva directa</span>
            <span className="text-olive-500 text-xs mx-1">·</span>
            <span className="font-body text-xs text-neutral-500">Sin comisiones</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
