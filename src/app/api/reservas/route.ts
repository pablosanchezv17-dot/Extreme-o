import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { habitacionDisponible } from "@/lib/availability";
import { calcularNoches, calcularPrecioTotal, generarNumeroPedido } from "@/lib/pricing";
import {
  generarParametrosPago,
  euroACentimos,
  REDSYS_URL_PRUEBAS,
  REDSYS_URL_PRODUCCION
} from "@/lib/redsys";

const reservaSchema = z.object({
  habitacionId: z.string().min(1),
  fechaEntrada: z.string(),
  fechaSalida: z.string(),
  nombreHuesped: z.string().min(2).max(120),
  emailHuesped: z.string().email(),
  telefonoHuesped: z.string().min(6).max(30)
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parseo = reservaSchema.safeParse(body);

  if (!parseo.success) {
    return NextResponse.json({ error: "Datos de reserva inválidos.", detalles: parseo.error.flatten() }, { status: 400 });
  }

  const { habitacionId, nombreHuesped, emailHuesped, telefonoHuesped } = parseo.data;
  const fechaEntrada = new Date(parseo.data.fechaEntrada);
  const fechaSalida = new Date(parseo.data.fechaSalida);

  if (Number.isNaN(fechaEntrada.getTime()) || Number.isNaN(fechaSalida.getTime()) || fechaSalida <= fechaEntrada) {
    return NextResponse.json({ error: "Rango de fechas inválido." }, { status: 400 });
  }

  const habitacion = await prisma.habitacion.findUnique({ where: { id: habitacionId } });
  if (!habitacion || !habitacion.activa) {
    return NextResponse.json({ error: "La habitación no existe o no está disponible." }, { status: 404 });
  }

  const libre = await habitacionDisponible(habitacionId, fechaEntrada, fechaSalida);
  if (!libre) {
    return NextResponse.json({ error: "La habitación ya no está disponible para esas fechas." }, { status: 409 });
  }

  const noches = calcularNoches(fechaEntrada, fechaSalida);
  // El precio se calcula siempre en el servidor a partir del precio guardado
  // en la base de datos: nunca se confía en un importe enviado por el cliente.
  const precioTotal = calcularPrecioTotal(habitacion.precioPorNoche.toNumber(), noches);
  const numeroPedido = generarNumeroPedido();

  const reserva = await prisma.reserva.create({
    data: {
      numeroPedido,
      habitacionId,
      nombreHuesped,
      emailHuesped,
      telefonoHuesped,
      fechaEntrada,
      fechaSalida,
      noches,
      precioTotal,
      estado: "PENDIENTE_PAGO"
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const merchantCode = process.env.REDSYS_MERCHANT_CODE;
  const terminal = process.env.REDSYS_TERMINAL;
  const claveSecreta = process.env.REDSYS_CLAVE_SECRETA;
  const entorno = process.env.REDSYS_ENTORNO ?? "pruebas";

  if (!baseUrl || !merchantCode || !terminal || !claveSecreta) {
    // No interrumpimos la reserva (ya está guardada como pendiente), pero
    // avisamos claramente de qué falta configurar.
    return NextResponse.json(
      {
        error:
          "Reserva creada pero falta configuración de Redsys (NEXT_PUBLIC_BASE_URL, REDSYS_MERCHANT_CODE, REDSYS_TERMINAL, REDSYS_CLAVE_SECRETA). Revisa el archivo .env.",
        reservaId: reserva.id
      },
      { status: 500 }
    );
  }

  const parametrosPago = generarParametrosPago(
    {
      Ds_Merchant_Amount: euroACentimos(precioTotal),
      Ds_Merchant_Order: numeroPedido,
      Ds_Merchant_MerchantCode: merchantCode,
      Ds_Merchant_Currency: "978",
      Ds_Merchant_TransactionType: "0",
      Ds_Merchant_Terminal: terminal,
      Ds_Merchant_MerchantURL: `${baseUrl}/api/redsys/notificacion`,
      Ds_Merchant_UrlOK: `${baseUrl}/reserva/confirmacion?pedido=${numeroPedido}`,
      Ds_Merchant_UrlKO: `${baseUrl}/reserva/error?pedido=${numeroPedido}`,
      Ds_Merchant_ProductDescription: habitacion.nombre.slice(0, 125),
      Ds_Merchant_ConsumerLanguage: "001"
    },
    claveSecreta
  );

  return NextResponse.json({
    reservaId: reserva.id,
    numeroPedido,
    redsysUrl: entorno === "produccion" ? REDSYS_URL_PRODUCCION : REDSYS_URL_PRUEBAS,
    camposFormulario: parametrosPago
  });
}
