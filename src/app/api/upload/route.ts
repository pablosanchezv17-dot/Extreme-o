import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const formData = await req.formData();
  const archivo = formData.get("archivo") as File | null;

  if (!archivo) {
    return NextResponse.json({ error: "No se ha enviado ningún archivo." }, { status: 400 });
  }

  // Validar tipo y tamaño
  if (!archivo.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten imágenes." }, { status: 400 });
  }
  if (archivo.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "La imagen no puede superar 5 MB." }, { status: 400 });
  }

  const extension = archivo.name.split(".").pop() ?? "jpg";
  const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const buffer = Buffer.from(await archivo.arrayBuffer());

  const { error } = await supabase.storage
    .from("fotos-habitaciones")
    .upload(nombre, buffer, { contentType: archivo.type, upsert: false });

  if (error) {
    console.error("Supabase upload error:", error);
    return NextResponse.json({ error: "Error al subir la imagen." }, { status: 500 });
  }

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos-habitaciones/${nombre}`;
  return NextResponse.json({ url }, { status: 201 });
}
