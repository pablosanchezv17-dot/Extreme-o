import Link from "next/link";
import { UserMenu } from "@/components/UserMenu";
import { MobileNav } from "@/components/MobileNav";

export function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
            <span className="text-lg">🏡</span>
          </div>
          <span className="font-body text-lg font-bold text-white drop-shadow">Hostal Azahar</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/#habitaciones" className="font-body text-sm font-medium text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
            Habitaciones
          </Link>
          <Link href="/#galeria" className="font-body text-sm font-medium text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
            Galería
          </Link>
          <Link href="/resenas" className="font-body text-sm font-medium text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
            Reseñas
          </Link>
          <Link href="/contacto" className="font-body text-sm font-medium text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
            Contacto
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <UserMenu />
          <MobileNav variant="transparent" />
        </div>
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
          <span className="font-body text-lg font-bold text-olive-700">Hostal Azahar</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/#habitaciones" className="btn-ghost text-sm">Habitaciones</Link>
          <Link href="/#galeria" className="btn-ghost text-sm">Galería</Link>
          <Link href="/resenas" className="btn-ghost text-sm">Reseñas</Link>
          <Link href="/contacto" className="btn-ghost text-sm">Contacto</Link>
        </nav>
        <div className="flex items-center gap-2">
          <UserMenu />
          <MobileNav variant="solid" />
        </div>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-olive-600">🏡</div>
              <span className="font-body text-base font-bold text-white">Hostal Azahar</span>
            </div>
            <p className="mt-3 font-body text-sm text-neutral-400 leading-relaxed">
              Alojamiento en Villa del Prado, Madrid. Reserva directa, sin comisiones.
            </p>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Alojamiento</p>
            <ul className="space-y-2">
              <li><Link href="/#habitaciones" className="font-body text-sm text-neutral-400 hover:text-white">Ver habitaciones</Link></li>
              <li><Link href="/#galeria" className="font-body text-sm text-neutral-400 hover:text-white">Galería</Link></li>
              <li><Link href="/resenas" className="font-body text-sm text-neutral-400 hover:text-white">Reseñas</Link></li>
              <li><Link href="/valorar" className="font-body text-sm text-neutral-400 hover:text-white">Dejar reseña</Link></li>
              <li><Link href="/contacto" className="font-body text-sm text-neutral-400 hover:text-white">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Mi cuenta</p>
            <ul className="space-y-2">
              <li><Link href="/cuenta" className="font-body text-sm text-neutral-400 hover:text-white">Mis reservas</Link></li>
              <li><Link href="/cuenta/registro" className="font-body text-sm text-neutral-400 hover:text-white">Registrarse</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Contacto</p>
            <ul className="space-y-2">
              <li><span className="font-body text-sm text-neutral-400">info@hostalazahar.es</span></li>
              <li><span className="font-body text-sm text-neutral-400">+34 600 000 000</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-700 pt-6 flex items-center justify-between">
          <p className="font-body text-xs text-neutral-500">© {new Date().getFullYear()} Hostal Azahar.</p>
          <span className="font-body text-xs text-neutral-500">Reserva directa · Sin comisiones</span>
        </div>
      </div>
    </footer>
  );
}
