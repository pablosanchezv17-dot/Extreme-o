"use client";

import { useEffect, useMemo, useState } from "react";

interface RangoOcupado {
  entrada: string; // YYYY-MM-DD
  salida: string; // YYYY-MM-DD
}

const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

function aISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

function esMismoDiaOPosterior(a: Date, b: Date): boolean {
  return a.getTime() >= b.getTime();
}

export function AvailabilityCalendar({
  habitacionId,
  entradaInicial,
  salidaInicial,
  onSeleccion
}: {
  habitacionId: string;
  entradaInicial?: string;
  salidaInicial?: string;
  onSeleccion: (entrada: string, salida: string) => void;
}) {
  const [rangosOcupados, setRangosOcupados] = useState<RangoOcupado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mesVisible, setMesVisible] = useState(() => {
    const base = entradaInicial ? new Date(entradaInicial) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [entrada, setEntrada] = useState<Date | null>(entradaInicial ? new Date(entradaInicial) : null);
  const [salida, setSalida] = useState<Date | null>(salidaInicial ? new Date(salidaInicial) : null);

  useEffect(() => {
    let activo = true;
    fetch(`/api/habitaciones/${habitacionId}/disponibilidad`)
      .then((r) => r.json())
      .then((data) => {
        if (activo) setRangosOcupados(data.rangosOcupados ?? []);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [habitacionId]);

  const diasOcupados = useMemo(() => {
    const set = new Set<string>();
    for (const rango of rangosOcupados) {
      const cursor = new Date(rango.entrada);
      const fin = new Date(rango.salida);
      while (cursor < fin) {
        set.add(aISO(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return set;
  }, [rangosOcupados]);

  const hoy = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  function hayOcupadoEntre(desde: Date, hasta: Date): boolean {
    const cursor = new Date(desde);
    cursor.setDate(cursor.getDate() + 1);
    while (cursor < hasta) {
      if (diasOcupados.has(aISO(cursor))) return true;
      cursor.setDate(cursor.getDate() + 1);
    }
    return false;
  }

  function manejarClickDia(fecha: Date) {
    if (!esMismoDiaOPosterior(fecha, hoy) || diasOcupados.has(aISO(fecha))) return;

    if (!entrada || (entrada && salida)) {
      setEntrada(fecha);
      setSalida(null);
      return;
    }

    if (fecha <= entrada || hayOcupadoEntre(entrada, fecha)) {
      setEntrada(fecha);
      setSalida(null);
      return;
    }

    setSalida(fecha);
    onSeleccion(aISO(entrada), aISO(fecha));
  }

  const primerDiaSemana = (mesVisible.getDay() + 6) % 7; // lunes = 0
  const diasEnMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0).getDate();
  const celdas: (Date | null)[] = [
    ...Array(primerDiaSemana).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => new Date(mesVisible.getFullYear(), mesVisible.getMonth(), i + 1))
  ];

  return (
    <div className="rounded-ticket border border-hairline bg-paper p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMesVisible(new Date(mesVisible.getFullYear(), mesVisible.getMonth() - 1, 1))}
          className="rounded px-2 py-1 text-sm text-ink/60 hover:bg-ink/5"
          aria-label="Mes anterior"
        >
          ←
        </button>
        <span className="font-display text-sm font-medium capitalize text-ink">
          {MESES[mesVisible.getMonth()]} {mesVisible.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => setMesVisible(new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 1))}
          className="rounded px-2 py-1 text-sm text-ink/60 hover:bg-ink/5"
          aria-label="Mes siguiente"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DIAS_SEMANA.map((d) => (
          <span key={d} className="font-mono text-[11px] text-ink/40">
            {d}
          </span>
        ))}
        {celdas.map((fecha, i) => {
          if (!fecha) return <span key={`vacio-${i}`} />;

          const iso = aISO(fecha);
          const pasado = !esMismoDiaOPosterior(fecha, hoy);
          const ocupado = diasOcupados.has(iso);
          const esEntrada = entrada && iso === aISO(entrada);
          const esSalida = salida && iso === aISO(salida);
          const enRango = entrada && salida && fecha > entrada && fecha < salida;

          return (
            <button
              key={iso}
              type="button"
              disabled={pasado || ocupado}
              onClick={() => manejarClickDia(fecha)}
              className={[
                "aspect-square rounded-md font-mono text-xs transition-colors",
                pasado || ocupado ? "cursor-not-allowed text-ink/20 line-through" : "text-ink hover:bg-moss/10",
                esEntrada || esSalida ? "bg-lantern text-paper hover:bg-lantern" : "",
                enRango ? "bg-moss/15" : ""
              ].join(" ")}
            >
              {fecha.getDate()}
            </button>
          );
        })}
      </div>

      {cargando && <p className="mt-3 font-mono text-[11px] text-ink/40">Cargando disponibilidad…</p>}
      <p className="mt-3 font-mono text-[11px] text-ink/50">
        {entrada && !salida && "Elige la fecha de salida."}
        {entrada && salida && `${aISO(entrada)} → ${aISO(salida)}`}
        {!entrada && "Elige la fecha de entrada."}
      </p>
    </div>
  );
}
