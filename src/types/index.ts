export interface HabitacionSerializada {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  tipo: string;
  capacidad: number;
  precioPorNoche: number;
  imagenes: string[];
  comodidades: string[];
  activa: boolean;
}

export interface ReservaSerializada {
  id: string;
  numeroPedido: string;
  habitacionId: string;
  nombreHuesped: string;
  emailHuesped: string;
  telefonoHuesped: string;
  fechaEntrada: string;
  fechaSalida: string;
  noches: number;
  precioTotal: number;
  estado: string;
  creadaEn: string;
}

export interface ResenaSerializada {
  id: string;
  habitacionId: string;
  nombreHuesped: string;
  puntuacion: number;
  comentario: string;
  aprobada: boolean;
  creadaEn: string;
}

// Tipos mínimos para no depender de los tipos exactos generados por Prisma
// (que incluyen Decimal/Date) en este archivo de utilidades.
type ConPrecioDecimal = { precioPorNoche: { toNumber(): number } | number } & Record<string, unknown>;
type ConPrecioTotalDecimal = { precioTotal: { toNumber(): number } | number } & Record<string, unknown>;

function aNumero(valor: { toNumber(): number } | number): number {
  return typeof valor === "number" ? valor : valor.toNumber();
}

export function serializarHabitacion(h: ConPrecioDecimal): HabitacionSerializada {
  return {
    id: h.id as string,
    nombre: h.nombre as string,
    slug: h.slug as string,
    descripcion: h.descripcion as string,
    tipo: h.tipo as string,
    capacidad: h.capacidad as number,
    precioPorNoche: aNumero(h.precioPorNoche),
    imagenes: h.imagenes as string[],
    comodidades: h.comodidades as string[],
    activa: h.activa as boolean
  };
}

export function serializarReserva(r: ConPrecioTotalDecimal): ReservaSerializada {
  return {
    id: r.id as string,
    numeroPedido: r.numeroPedido as string,
    habitacionId: r.habitacionId as string,
    nombreHuesped: r.nombreHuesped as string,
    emailHuesped: r.emailHuesped as string,
    telefonoHuesped: r.telefonoHuesped as string,
    fechaEntrada: (r.fechaEntrada as Date).toISOString(),
    fechaSalida: (r.fechaSalida as Date).toISOString(),
    noches: r.noches as number,
    precioTotal: aNumero(r.precioTotal),
    estado: r.estado as string,
    creadaEn: (r.creadaEn as Date).toISOString()
  };
}
