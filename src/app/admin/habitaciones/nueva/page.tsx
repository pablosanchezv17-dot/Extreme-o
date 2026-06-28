import { RoomForm } from "@/components/admin/RoomForm";

export default function PaginaNuevaHabitacion() {
  return (
    <div>
      <span className="eyebrow">Gestión</span>
      <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Nueva habitación</h1>
      <div className="mt-6">
        <RoomForm modo="crear" />
      </div>
    </div>
  );
}
