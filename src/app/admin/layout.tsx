import { Providers } from "@/components/Providers";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-canvas md:grid md:grid-cols-[220px_1fr]">
        <AdminNav />
        {/* pb-20 en móvil para que el contenido no quede tapado por la bottom nav */}
        <main className="overflow-x-auto p-4 pb-24 md:p-8 md:pb-8">
          {children}
        </main>
      </div>
    </Providers>
  );
}
