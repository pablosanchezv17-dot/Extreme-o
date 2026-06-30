import { PrismaClient, TipoHabitacion } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@tu-hostal.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "cambia-esta-clave";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.administrador.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      nombre: "Recepción",
      passwordHash
    }
  });

  console.log(`Administrador listo: ${adminEmail}`);

  // upsert por slug: si la habitación ya existe (p. ej. porque cambiaste el precio
  // a mano desde el panel), no se sobrescribe. Solo se crean las que faltan.
  const habitaciones = [
    {
      nombre: "Individual Económica",
      slug: "individual-economica",
      descripcion:
        "Habitación individual compacta en la primera planta, ideal para viajeros que buscan privacidad sin gastar de más.",
      tipo: TipoHabitacion.PRIVADA,
      capacidad: 1,
      precioPorNoche: 35.0,
      imagenes: [],
      comodidades: ["Wifi", "Ropa de cama incluida", "Aire acondicionado"]
    },
    {
      nombre: "Doble Estándar",
      slug: "doble-estandar",
      descripcion:
        "Habitación doble con cama de matrimonio, baño compartido en el pasillo y vistas a la calle.",
      tipo: TipoHabitacion.PRIVADA,
      capacidad: 2,
      precioPorNoche: 50.0,
      imagenes: [],
      comodidades: ["Wifi", "Ropa de cama incluida", "Taquilla", "Aire acondicionado"]
    },
    {
      nombre: "Doble Superior con baño",
      slug: "doble-superior-bano",
      descripcion:
        "Habitación doble más amplia en la segunda planta, con baño privado y escritorio.",
      tipo: TipoHabitacion.PRIVADA,
      capacidad: 2,
      precioPorNoche: 68.0,
      imagenes: [],
      comodidades: ["Wifi", "Baño privado", "Escritorio", "Aire acondicionado"]
    },
    {
      nombre: "Suite Deluxe",
      slug: "suite-deluxe",
      descripcion:
        "Nuestra habitación más espaciosa, en la segunda planta, con baño privado y zona de estar. La piscina y el bar de la azotea están disponibles para todos los huéspedes del hostal.",
      tipo: TipoHabitacion.SUITE,
      capacidad: 3,
      precioPorNoche: 90.0,
      imagenes: [],
      comodidades: ["Wifi", "Baño privado", "Zona de estar", "Aire acondicionado", "Minibar"]
    },
    {
      nombre: "Familiar",
      slug: "familiar",
      descripcion:
        "Habitación amplia pensada para grupos o familias, con dos camas de matrimonio y baño privado.",
      tipo: TipoHabitacion.SUITE,
      capacidad: 4,
      precioPorNoche: 110.0,
      imagenes: [],
      comodidades: ["Wifi", "Baño privado", "Dos camas de matrimonio", "Aire acondicionado"]
    },
    {
      nombre: "Dormitorio mixto (6 camas)",
      slug: "dormitorio-6-camas",
      descripcion:
        "Cama en dormitorio mixto de 6 plazas, literas con cortina de privacidad y taquilla individual.",
      tipo: TipoHabitacion.DORMITORIO,
      capacidad: 1,
      precioPorNoche: 18.0,
      imagenes: [],
      comodidades: ["Wifi", "Taquilla con candado", "Cortina de privacidad"]
    },
    {
      nombre: "Dormitorio compartido (4 camas)",
      slug: "dormitorio-4-camas",
      descripcion:
        "Dormitorio más reducido de 4 plazas, más tranquilo, con literas y taquilla individual.",
      tipo: TipoHabitacion.DORMITORIO,
      capacidad: 1,
      precioPorNoche: 22.0,
      imagenes: [],
      comodidades: ["Wifi", "Taquilla con candado", "Enchufe individual"]
    }
  ];

  for (const h of habitaciones) {
    await prisma.habitacion.upsert({
      where: { slug: h.slug },
      // Actualiza textos/comodidades si ya existe (por correcciones),
      // pero no toca precioPorNoche ni imagenes para no pisar cambios manuales del admin.
      update: {
        nombre: h.nombre,
        descripcion: h.descripcion,
        tipo: h.tipo,
        capacidad: h.capacidad,
        comodidades: h.comodidades
      },
      create: h
    });
  }

  // Corrige la habitación antigua "suite-azotea" si existía con datos incorrectos,
  // renombrándola a "suite-deluxe" para no duplicar habitaciones.
  const suiteAntigua = await prisma.habitacion.findUnique({ where: { slug: "suite-azotea" } });
  if (suiteAntigua) {
    await prisma.habitacion.update({
      where: { slug: "suite-azotea" },
      data: {
        slug: "suite-deluxe",
        nombre: "Suite Deluxe",
        descripcion:
          "Nuestra habitación más espaciosa, en la segunda planta, con baño privado y zona de estar. La piscina y el bar de la azotea están disponibles para todos los huéspedes del hostal.",
        comodidades: ["Wifi", "Baño privado", "Zona de estar", "Aire acondicionado", "Minibar"]
      }
    });
    console.log("Suite antigua corregida.");
  }

  console.log("Habitaciones de ejemplo listas.");

  // ── Reseñas de ejemplo ──────────────────────────────────────────────
  // Cada reseña falsa necesita una reserva "completada" detrás (relación
  // 1 a 1). Son datos de demostración, no pedidos reales de Redsys.
  const resenasEjemplo = [
    {
      pedido: "DEMO0001RESA",
      slug: "doble-estandar",
      nombre: "Laura Martínez",
      puntuacion: 5,
      comentario: "Habitación muy limpia y el personal super amable. La piscina de la azotea fue un acierto después de un día entero caminando por Madrid."
    },
    {
      pedido: "DEMO0002RESA",
      slug: "suite-deluxe",
      nombre: "Carlos Fernández",
      puntuacion: 5,
      comentario: "La suite tiene mucho espacio y el baño privado se agradece. Tomamos algo en el bar de la azotea y las vistas estaban genial."
    },
    {
      pedido: "DEMO0003RESA",
      slug: "dormitorio-6-camas",
      nombre: "Marta Gil",
      puntuacion: 4,
      comentario: "Buena relación calidad-precio para viajar con poco presupuesto. Las literas son cómodas y había buen ambiente con otros huéspedes."
    },
    {
      pedido: "DEMO0004RESA",
      slug: "familiar",
      nombre: "Javier Romero",
      puntuacion: 5,
      comentario: "Fuimos en familia y la habitación nos vino perfecta. Villa del Prado es un pueblo tranquilo, ideal para desconectar."
    },
    {
      pedido: "DEMO0005RESA",
      slug: "individual-economica",
      nombre: "Sofía Navarro",
      puntuacion: 4,
      comentario: "Viajaba sola y me sentí segura en todo momento. La habitación es pequeña pero tiene todo lo necesario."
    },
    {
      pedido: "DEMO0006RESA",
      slug: "doble-superior-bano",
      nombre: "Pablo Ruiz",
      puntuacion: 5,
      comentario: "El baño privado y el escritorio nos vinieron genial porque trabajé un par de días desde la habitación. Repetiremos."
    }
  ];

  for (const r of resenasEjemplo) {
    const habitacion = await prisma.habitacion.findUnique({ where: { slug: r.slug } });
    if (!habitacion) continue;

    const fechaEntrada = new Date();
    fechaEntrada.setDate(fechaEntrada.getDate() - 30);
    const fechaSalida = new Date(fechaEntrada);
    fechaSalida.setDate(fechaSalida.getDate() + 2);

    const reserva = await prisma.reserva.upsert({
      where: { numeroPedido: r.pedido },
      update: {},
      create: {
        numeroPedido: r.pedido,
        habitacionId: habitacion.id,
        nombreHuesped: r.nombre,
        emailHuesped: `${r.nombre.toLowerCase().replace(/ /g, ".")}@ejemplo.com`,
        telefonoHuesped: "600000000",
        fechaEntrada,
        fechaSalida,
        noches: 2,
        precioTotal: Number(habitacion.precioPorNoche) * 2,
        estado: "COMPLETADA"
      }
    });

    await prisma.resena.upsert({
      where: { reservaId: reserva.id },
      update: {},
      create: {
        habitacionId: habitacion.id,
        reservaId: reserva.id,
        nombreHuesped: r.nombre,
        puntuacion: r.puntuacion,
        comentario: r.comentario,
        aprobada: true
      }
    });
  }

  console.log("Reseñas de ejemplo listas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
