/**
 * Integración con Redsys (TPV Virtual), modalidad "redirección" con firma
 * HMAC_SHA256_V1, que es el método vigente en la documentación pública de
 * Redsys para comercios españoles.
 *
 * IMPORTANTE — léelo antes de poner esto en producción:
 * 1. Necesitas que tu banco active el "Servicio de TPV Virtual" y te entregue:
 *    FUC (Ds_Merchant_MerchantCode), Terminal y la Clave de cifrado (en Base64).
 *    Redsys también ofrece un entorno de pruebas con sus propias claves de test.
 * 2. Este código implementa el algoritmo documentado por Redsys (3DES para
 *    derivar una clave de operación a partir del número de pedido, y HMAC-SHA256
 *    sobre los parámetros en Base64). No ha podido probarse aquí contra el
 *    entorno real de Redsys porque este entorno de desarrollo no tiene acceso
 *    a red. Antes de aceptar pagos reales, prueba a fondo en el entorno de
 *    pruebas de Redsys y compara con los ejemplos de su manual de integración.
 * 3. Verifica siempre los nombres exactos de campo contra el manual que te
 *    entregue tu banco: algunos bancos personalizan ligeramente la integración.
 */

import crypto from "crypto";

const SIGNATURE_VERSION = "HMAC_SHA256_V1";

export const REDSYS_URL_PRUEBAS = "https://sis-t.redsys.es:25443/sis/realizarPago";
export const REDSYS_URL_PRODUCCION = "https://sis.redsys.es/sis/realizarPago";

export interface ParametrosPagoRedsys {
  Ds_Merchant_Amount: string; // Importe en céntimos, solo dígitos (10,50€ -> "1050")
  Ds_Merchant_Order: string; // 4-12 caracteres, los 4 primeros numéricos
  Ds_Merchant_MerchantCode: string; // FUC proporcionado por el banco
  Ds_Merchant_Currency: string; // "978" = Euro
  Ds_Merchant_TransactionType: string; // "0" = Autorización estándar
  Ds_Merchant_Terminal: string;
  Ds_Merchant_MerchantURL: string; // Notificación servidor-a-servidor (webhook)
  Ds_Merchant_UrlOK: string; // Redirección del navegador si el pago es correcto
  Ds_Merchant_UrlKO: string; // Redirección del navegador si el pago falla
  Ds_Merchant_ProductDescription?: string;
  Ds_Merchant_MerchantName?: string;
  Ds_Merchant_ConsumerLanguage?: string; // "001" = español
}

/**
 * Deriva la "clave de operación" cifrando el número de pedido con 3DES
 * (clave del comercio, IV de 8 bytes a cero, sin padding adicional).
 */
function derivarClaveOperacion(numeroPedido: string, claveComercioBase64: string): Buffer {
  const clave = Buffer.from(claveComercioBase64, "base64");
  const iv = Buffer.alloc(8, 0);

  let pedido = numeroPedido;
  const resto = pedido.length % 8;
  if (resto !== 0) {
    pedido = pedido + "\0".repeat(8 - resto);
  }

  const cipher = crypto.createCipheriv("des-ede3-cbc", clave, iv);
  cipher.setAutoPadding(false);
  return Buffer.concat([cipher.update(pedido, "utf8"), cipher.final()]);
}

/**
 * Genera los tres campos que hay que enviar en el formulario HTML que
 * redirige al cliente a la pasarela de Redsys.
 */
export function generarParametrosPago(
  parametros: ParametrosPagoRedsys,
  claveComercioBase64: string
) {
  const parametrosJson = JSON.stringify(parametros);
  const parametrosBase64 = Buffer.from(parametrosJson, "utf8").toString("base64");

  const claveOperacion = derivarClaveOperacion(parametros.Ds_Merchant_Order, claveComercioBase64);
  const firma = crypto.createHmac("sha256", claveOperacion).update(parametrosBase64).digest("base64");

  return {
    Ds_SignatureVersion: SIGNATURE_VERSION,
    Ds_MerchantParameters: parametrosBase64,
    Ds_Signature: firma
  };
}

/**
 * Verifica la notificación servidor-a-servidor que envía Redsys tras el pago.
 * Redsys hace un POST con Ds_SignatureVersion, Ds_MerchantParameters y
 * Ds_Signature. Hay que recalcular la firma y compararla en tiempo constante
 * antes de fiarse de los datos.
 */
export function verificarNotificacion(
  parametrosBase64: string,
  firmaRecibida: string,
  claveComercioBase64: string
): { valido: boolean; datos: Record<string, string> | null } {
  let datos: Record<string, string>;
  try {
    datos = JSON.parse(Buffer.from(parametrosBase64, "base64").toString("utf8"));
  } catch {
    return { valido: false, datos: null };
  }

  const numeroPedido = datos.Ds_Order ?? datos.Ds_Merchant_Order;
  if (!numeroPedido) return { valido: false, datos: null };

  const claveOperacion = derivarClaveOperacion(numeroPedido, claveComercioBase64);
  const firmaCalculada = crypto
    .createHmac("sha256", claveOperacion)
    .update(parametrosBase64)
    .digest("base64");

  // Redsys puede usar la variante URL-safe del Base64 (- y _) en este campo.
  const normalizar = (s: string) => s.replace(/-/g, "+").replace(/_/g, "/");
  const a = Buffer.from(normalizar(firmaCalculada));
  const b = Buffer.from(normalizar(firmaRecibida));

  const valido = a.length === b.length && crypto.timingSafeEqual(a, b);
  return { valido, datos };
}

/** Códigos de respuesta 0000-0099 indican autorización aprobada. */
export function esRespuestaAprobada(dsResponse: string): boolean {
  const codigo = parseInt(dsResponse, 10);
  return !Number.isNaN(codigo) && codigo >= 0 && codigo <= 99;
}

export function euroACentimos(importe: number): string {
  return Math.round(importe * 100).toString();
}
