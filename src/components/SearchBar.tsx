function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function mananaISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function SearchBar({
  entrada,
  salida,
  huespedes
}: {
  entrada?: string;
  salida?: string;
  huespedes?: string;
}) {
  return (
    <form action="/" method="get" className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
      <div>
        <label className="field-label" htmlFor="entrada">
          Entrada
        </label>
        <input
          id="entrada"
          name="entrada"
          type="date"
          min={hoyISO()}
          defaultValue={entrada ?? hoyISO()}
          className="input-field"
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor="salida">
          Salida
        </label>
        <input
          id="salida"
          name="salida"
          type="date"
          min={mananaISO()}
          defaultValue={salida ?? mananaISO()}
          className="input-field"
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor="huespedes">
          Huéspedes
        </label>
        <input
          id="huespedes"
          name="huespedes"
          type="number"
          min={1}
          max={20}
          defaultValue={huespedes ?? "1"}
          className="input-field w-24"
        />
      </div>
      <div className="flex items-end">
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Buscar
        </button>
      </div>
    </form>
  );
}
