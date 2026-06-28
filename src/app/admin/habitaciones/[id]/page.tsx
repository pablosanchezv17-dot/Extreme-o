import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RoomForm } from "@/components/admin/RoomForm";

export default async function PaginaEditarHabitacion({ params }: { params: { id: string } }) {
  const habitacion = await prisma.habitacion.findUnique({ where: { id: params.id } });
  if (!habitacion) notFound();

  return (
    <div>
      <span className="eyebrow">Gestión</span>
      <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Editar habitación</h1>
      <div className="mt-6">
        <RoomForm
          modo="editar"
          valoresIniciales={{
            id: habitacion.id,
            nombre: habitacion.nombre,
            descripcion: habitacion.descripcion,
            tipo: habitacion.tipo,
            capacidad: habitacion.capacidad,
            precioPorNoche: habitacion.precioPorNoche.toNumber(),
            imagenes: habitacion.imagenes,
            comodidades: habitacion.comodidades,
            activa: habitacion.activa
          }}
        />
      </div>
    </div>
  );
}
