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

  const habitacionesExistentes = await prisma.habitacion.count();
  if (habitacionesExistentes === 0) {
    await prisma.habitacion.createMany({
      data: [
        {
          nombre: "Privada con vistas al patio",
          slug: "privada-patio",
          descripcion:
            "Habitación privada con cama de matrimonio, baño compartido en el pasillo y vistas al patio interior.",
          tipo: TipoHabitacion.PRIVADA,
          capacidad: 2,
          precioPorNoche: 38.0,
          imagenes: [],
          comodidades: ["Wifi", "Ropa de cama incluida", "Taquilla", "Aire acondicionado"]
        },
        {
          nombre: "Dormitorio compartido (6 camas)",
          slug: "dormitorio-6-camas",
          descripcion:
            "Cama en dormitorio mixto de 6 plazas, literas con cortina de privacidad y taquilla individual.",
          tipo: TipoHabitacion.DORMITORIO,
          capacidad: 1,
          precioPorNoche: 16.0,
          imagenes: [],
          comodidades: ["Wifi", "Taquilla con candado", "Cortina de privacidad"]
        }
      ]
    });
    console.log("Habitaciones de ejemplo creadas.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
