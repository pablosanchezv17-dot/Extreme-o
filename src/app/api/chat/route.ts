import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_MENSAJES_HISTORIAL = 12;

async function construirContexto(): Promise<string> {
  const habitaciones = await prisma.habitacion.findMany({
    where: { activa: true },
    orderBy: { precioPorNoche: "asc" }
  });

  const listado = habitaciones
    .map(
      (h) =>
        `- ${h.nombre} (${h.tipo}): ${Number(h.precioPorNoche).toFixed(2)}€/noche, capacidad ${h.capacidad} ${h.capacidad === 1 ? "persona" : "personas"}. ${h.descripcion}`
    )
    .join("\n");

  return `Eres el asistente virtual del Hostal Extremeño, un hostal de 2 plantas en Villa del Prado, Madrid, con piscina y bar/restaurante en la azotea (de uso común para todos los huéspedes).

HABITACIONES DISPONIBLES ACTUALMENTE:
${listado || "No hay información de habitaciones cargada."}

INSTRUCCIONES:
- Responde siempre en español, de forma breve, cercana y útil.
- Usa solo los datos de habitaciones de arriba. Si te preguntan algo que no sabes (disponibilidad para fechas concretas, normas internas, etc.), indica que pueden comprobarlo con el buscador de la web o contactar mediante el formulario de /contacto.
- Para reservar, indica que pueden usar el buscador de la página principal seleccionando fechas y número de huéspedes.
- No inventes precios, políticas de cancelación, ni datos que no tengas.
- No puedes procesar pagos ni confirmar reservas tú mismo, solo orientar.
- Si preguntan por la piscina o el bar de la azotea: están disponibles para todos los huéspedes del hostal, no son exclusivos de ninguna habitación.
- Si preguntan por la ubicación: Villa del Prado, Madrid.
- Sé conciso: la mayoría de respuestas deben caber en 2-4 frases.`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "El chat no está configurado todavía (falta ANTHROPIC_API_KEY)." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const mensajes: { role: "user" | "assistant"; content: string }[] = Array.isArray(body?.mensajes)
      ? body.mensajes
      : [];

    if (mensajes.length === 0) {
      return NextResponse.json({ error: "No se ha enviado ningún mensaje." }, { status: 400 });
    }

    // Limitar historial para no disparar el coste/tama\u00f1o del contexto
    const historial = mensajes.slice(-MAX_MENSAJES_HISTORIAL);

    const systemPrompt = await construirContexto();

    const client = new Anthropic({ apiKey });

    const respuesta = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: systemPrompt,
      messages: historial.map((m) => ({ role: m.role, content: m.content }))
    });

    const textoBlocks = respuesta.content.filter((b) => b.type === "text") as { type: "text"; text: string }[];
    const texto = textoBlocks.map((b) => b.text).join("\n").trim();

    return NextResponse.json({ respuesta: texto || "No he podido generar una respuesta, inténtalo de nuevo." });
  } catch (e) {
    console.error("Error en /api/chat:", e);
    return NextResponse.json({ error: "Ha ocurrido un error al contactar con el asistente." }, { status: 500 });
  }
}
