"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { crearHabitacion, actualizarHabitacion, type DatosHabitacion } from "@/lib/actions/habitaciones";

type ValoresIniciales = Partial<DatosHabitacion> & { id?: string };

export function RoomForm({ valoresIniciales, modo }: { valoresIniciales?: ValoresIniciales; modo: "crear" | "editar" }) {
  const [nombre, setNombre] = useState(valoresIniciales?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(valoresIniciales?.descripcion ?? "");
  const [tipo, setTipo] = useState<"PRIVADA" | "COMPARTIDA" | "DORMITORIO" | "SUITE">(valoresIniciales?.tipo ?? "PRIVADA");
  const [capacidad, setCapacidad] = useState(valoresIniciales?.capacidad ?? 1);
  const [precioPorNoche, setPrecioPorNoche] = useState(valoresIniciales?.precioPorNoche ?? 0);
  const [imagenes, setImagenes] = useState<string[]>(valoresIniciales?.imagenes ?? []);
  const [comodidades, setComodidades] = useState((valoresIniciales?.comodidades ?? []).join(", "));
  const [activa, setActiva] = useState(valoresIniciales?.activa ?? true);
  const [error, setError] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [pendiente, iniciarTransicion] = useTransition();
  const inputFotoRef = useRef<HTMLInputElement>(null);

  async function subirFotos(archivos: FileList) {
    setSubiendo(true);
    setError(null);
    const urls: string[] = [];

    for (const archivo of Array.from(archivos)) {
      const form = new FormData();
      form.append("archivo", archivo);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al subir una imagen.");
        setSubiendo(false);
        return;
      }
      urls.push(data.url);
    }

    setImagenes((prev) => [...prev, ...urls]);
    setSubiendo(false);
    if (inputFotoRef.current) inputFotoRef.current.value = "";
  }

  function quitarImagen(url: string) {
    setImagenes((prev) => prev.filter((u) => u !== url));
  }

  function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const datos: DatosHabitacion = {
      nombre,
      descripcion,
      tipo: tipo as DatosHabitacion["tipo"],
      capacidad,
      precioPorNoche,
      imagenes,
      comodidades: comodidades.split(",").map((s) => s.trim()).filter(Boolean),
      activa
    };

    iniciarTransicion(async () => {
      try {
        if (modo === "crear") {
          await crearHabitacion(datos);
        } else if (valoresIniciales?.id) {
          await actualizarHabitacion(valoresIniciales.id, datos);
        }
      } catch (e) {
        if (e instanceof Error && !e.message.includes("NEXT_REDIRECT")) {
          setError("No se ha podido guardar la habitación.");
        }
      }
    });
  }

  return (
    <form onSubmit={manejarSubmit} className="flex max-w-xl flex-col gap-4">
      <div>
        <label className="field-label" htmlFor="nombre">Nombre</label>
        <input id="nombre" className="input-field" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>

      <div>
        <label className="field-label" htmlFor="descripcion">Descripción</label>
        <textarea id="descripcion" className="input-field min-h-[90px]" required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label" htmlFor="tipo">Tipo</label>
          <select id="tipo" className="input-field" value={tipo} onChange={(e) => setTipo(e.target.value as "PRIVADA" | "COMPARTIDA" | "DORMITORIO" | "SUITE")}>
            <option value="PRIVADA">Privada</option>
            <option value="COMPARTIDA">Compartida</option>
            <option value="DORMITORIO">Dormitorio</option>
            <option value="SUITE">Suite</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="capacidad">Capacidad (personas)</label>
          <input id="capacidad" type="number" min={1} max={20} className="input-field" required value={capacidad} onChange={(e) => setCapacidad(Number(e.target.value))} />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="precio">Precio por noche (€)</label>
        <input id="precio" type="number" min={0} step={0.01} className="input-field" required value={precioPorNoche} onChange={(e) => setPrecioPorNoche(Number(e.target.value))} />
      </div>

      <div>
        <label className="field-label" htmlFor="comodidades">Comodidades (separadas por comas)</label>
        <input id="comodidades" className="input-field" placeholder="Wifi, Aire acondicionado, Baño privado" value={comodidades} onChange={(e) => setComodidades(e.target.value)} />
      </div>

      {/* ── Subida de fotos ── */}
      <div>
        <label className="field-label">Fotos</label>

        {/* Miniaturas actuales */}
        {imagenes.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {imagenes.map((url) => (
              <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-hairline">
                <Image src={url} alt="foto" fill className="object-cover" sizes="96px" />
                <button
                  type="button"
                  onClick={() => quitarImagen(url)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botón subir */}
        <input
          ref={inputFotoRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && subirFotos(e.target.files)}
        />
        <button
          type="button"
          onClick={() => inputFotoRef.current?.click()}
          disabled={subiendo}
          className="btn-secondary text-sm gap-2"
        >
          {subiendo ? "Subiendo..." : "📷 Subir fotos"}
        </button>
        <p className="mt-1 font-body text-xs text-neutral-400">Máx. 5 MB por foto. JPG, PNG o WEBP.</p>
      </div>

      {modo === "editar" && (
        <label className="flex items-center gap-2 font-body text-sm text-ink">
          <input type="checkbox" checked={activa} onChange={(e) => setActiva(e.target.checked)} />
          Habitación activa (visible para los huéspedes)
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={pendiente || subiendo} className="btn-primary mt-1">
        {pendiente ? "Guardando…" : modo === "crear" ? "Crear habitación" : "Guardar cambios"}
      </button>
    </form>
  );
}
