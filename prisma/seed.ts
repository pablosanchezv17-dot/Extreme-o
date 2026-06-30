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
      nombre: "Suite con acceso a azotea",
      slug: "suite-azotea",
      descripcion:
        "Nuestra habitación más espaciosa, en la segunda planta, con baño privado y acceso directo a la azotea con piscina y bar.",
      tipo: TipoHabitacion.SUITE,
      capacidad: 3,
      precioPorNoche: 90.0,
      imagenes: [],
      comodidades: ["Wifi", "Baño privado", "Acceso directo a la azotea", "Aire acondicionado", "Minibar"]
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
      update: {},
      create: h
    });
  }

  console.log("Habitaciones de ejemplo listas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
