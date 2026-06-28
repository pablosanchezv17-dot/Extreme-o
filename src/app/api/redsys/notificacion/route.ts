import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verificarNotificacion, esRespuestaAprobada } from "@/lib/redsys";

/**
 * Redsys llama a esta URL directamente desde sus servidores (no es el navegador
 * del huésped) tras procesar el pago, con el resultado en application/x-www-form-urlencoded.
 * Por eso esta es la fuente de verdad para confirmar la reserva — la redirección
 * del navegador (Ds_Merchant_UrlOK) es solo para mostrarle algo al huésped y
 * puede llegar antes, después, o no llegar si cierra la pestaña.
 */
export async function POST(request: NextRequest) {
  const claveSecreta = process.env.REDSYS_CLAVE_SECRETA;
  if (!claveSecreta) {
    console.error("Falta REDSYS_CLAVE_SECRETA: no se puede verificar la notificación de Redsys.");
    return new NextResponse("Configuración incompleta", { status: 500 });
  }

  const datosFormulario = await request.formData();
  const parametrosBase64 = datosFormulario.get("Ds_MerchantParameters")?.toString();
  const firmaRecibida = datosFormulario.get("Ds_Signature")?.toString();

  if (!parametrosBase64 || !firmaRecibida) {
    return new NextResponse("Faltan parámetros", { status: 400 });
  }

  const { valido, datos } = verificarNotificacion(parametrosBase64, firmaRecibida, claveSecreta);

  if (!valido || !datos) {
    console.warn("Notificación de Redsys con firma inválida.", { datos });
    return new NextResponse("Firma inválida", { status: 400 });
  }

  const numeroPedido = datos.Ds_Order ?? datos.Ds_Merchant_Order;
  const dsResponse = datos.Ds_Response ?? "";

  const reserva = await prisma.reserva.findUnique({ where: { numeroPedido } });
  if (!reserva) {
    console.warn(`Notificación de Redsys para un pedido desconocido: ${numeroPedido}`);
    // Respondemos 200 igualmente: si devolvemos error, Redsys reintentará
    // indefinidamente una notificación que nunca vamos a poder resolver.
    return new NextResponse("OK", { status: 200 });
  }

  const aprobado = esRespuestaAprobada(dsResponse);

  await prisma.reserva.update({
    where: { numeroPedido },
    data: {
      estado: aprobado ? "CONFIRMADA" : "PAGO_FALLIDO",
      redsysAuthCode: datos.Ds_AuthorisationCode ?? null,
      redsysResponse: dsResponse
    }
  });

  return new NextResponse("OK", { status: 200 });
}
