import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token as { role?: string } | null;

    // Rutas de admin: solo rol admin
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    // Rutas de cuenta: cualquier usuario autenticado
    const rutasPublicasCuenta = ["/cuenta/login", "/cuenta/registro"];
    if (pathname.startsWith("/cuenta") && !rutasPublicasCuenta.some((r) => pathname.startsWith(r))) {
      if (!token) {
        return NextResponse.redirect(new URL("/cuenta/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: { authorized: () => true },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/cuenta/:path*"],
};
