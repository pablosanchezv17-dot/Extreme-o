import { Providers } from "@/components/Providers";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="grid min-h-screen grid-cols-[220px_1fr] bg-canvas">
        <AdminNav />
        <main className="overflow-x-auto p-8">{children}</main>
      </div>
    </Providers>
  );
}
