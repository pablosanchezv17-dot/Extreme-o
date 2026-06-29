"use client";

import { useState, useTransition } from "react";
import { crearHabitacion, actualizarHabitacion, type DatosHabitacion } from "@/lib/actions/habitaciones";

type ValoresIniciales = Partial<DatosHabitacion> & { id?: string };

export function RoomForm({ valoresIniciales, modo }: { valoresIniciales?: ValoresIniciales; modo: "crear" | "editar" }) {
  const [nombre, setNombre] = useState(valoresIniciales?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(valoresIniciales?.descripcion ?? "");
  const [tipo, setTipo] = useState<"PRIVADA" | "COMPARTIDA" | "DORMITORIO">(valoresIniciales?.tipo ?? "PRIVADA");
  const [capacidad, setCapacidad] = useState(valoresIniciales?.capacidad ?? 1);
  const [precioPorNoche, setPrecioPorNoche] = useState(valoresIniciales?.precioPorNoche ?? 0);
  const [imagenes, setImagenes] = useState((valoresIniciales?.imagenes ?? []).join("\n"));
  const [comodidades, setComodidades] = useState((valoresIniciales?.comodidades ?? []).join(", "));
  const [activa, setActiva] = useState(valoresIniciales?.activa ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const datos: DatosHabitacion = {
      nombre,
      descripcion,
      tipo: tipo as DatosHabitacion["tipo"],
      capacidad,
      precioPorNoche,
      imagenes: imagenes.split("\n").map((s) => s.trim()).filter(Boolean),
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
        // Next.js usa excepciones internas para los redirect() de las server
        // actions; si llega aquí es un error real.
        if (e instanceof Error && !e.message.includes("NEXT_REDIRECT")) {
          setError("No se ha podido guardar la habitación.");
        }
      }
    });
  }

  return (
    <form onSubmit={manejarSubmit} className="flex max-w-xl flex-col gap-3">
      <div>
        <label className="field-label" htmlFor="nombre">
          Nombre
        </label>
        <input id="nombre" className="input-field" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>

      <div>
        <label className="field-label" htmlFor="descripcion">
          Descripción
        </label>
        <textarea
          id="descripcion"
          className="input-field min-h-[90px]"
          required
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label" htmlFor="tipo">
            Tipo
          </label>
          <select id="tipo" className="input-field" value={tipo} onChange={(e) => setTipo(e.target.value as "PRIVADA" | "COMPARTIDA" | "DORMITORIO")}>
            <option value="PRIVADA">Privada</option>
            <option value="COMPARTIDA">Compartida</option>
            <option value="DORMITORIO">Dormitorio</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="capacidad">
            Capacidad (personas)
          </label>
          <input
            id="capacidad"
            type="number"
            min={1}
            max={20}
            className="input-field"
            required
            value={capacidad}
            onChange={(e) => setCapacidad(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="precioPorNoche">
          Precio por noche (€)
        </label>
        <input
          id="precioPorNoche"
          type="number"
          min={0}
          step={0.01}
          className="input-field"
          required
          value={precioPorNoche}
          onChange={(e) => setPrecioPorNoche(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="comodidades">
          Comodidades (separadas por comas)
        </label>
        <input
          id="comodidades"
          className="input-field"
          placeholder="Wifi, Taquilla, Aire acondicionado"
          value={comodidades}
          onChange={(e) => setComodidades(e.target.value)}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="imagenes">
          URLs de imágenes (una por línea)
        </label>
        <textarea
          id="imagenes"
          className="input-field min-h-[70px]"
          value={imagenes}
          onChange={(e) => setImagenes(e.target.value)}
        />
      </div>

      {modo === "editar" && (
        <label className="flex items-center gap-2 font-body text-sm text-ink">
          <input type="checkbox" checked={activa} onChange={(e) => setActiva(e.target.checked)} />
          Habitación activa (visible para los huéspedes)
        </label>
      )}

      {error && <p className="text-sm text-lantern">{error}</p>}

      <button type="submit" disabled={pendiente} className="btn-primary mt-1">
        {pendiente ? "Guardando…" : modo === "crear" ? "Crear habitación" : "Guardar cambios"}
      </button>
    </form>
  );
}
