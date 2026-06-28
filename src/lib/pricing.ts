export function calcularNoches(fechaEntrada: Date, fechaSalida: Date): number {
  const msPorDia = 1000 * 60 * 60 * 24;
  const noches = Math.round((fechaSalida.getTime() - fechaEntrada.getTime()) / msPorDia);
  return noches;
}

export function calcularPrecioTotal(precioPorNoche: number, noches: number): number {
  return Math.round(precioPorNoche * noches * 100) / 100;
}

/**
 * Genera un número de pedido válido para Redsys: entre 4 y 12 caracteres,
 * los 4 primeros deben ser numéricos. Usamos timestamp + sufijo aleatorio.
 */
export function generarNumeroPedido(): string {
  const timestamp = Date.now().toString().slice(-8); // 8 dígitos
  const sufijo = Math.random().toString(36).slice(2, 6).toUpperCase(); // 4 chars alfanuméricos
  return `${timestamp}${sufijo}`; // 12 caracteres, empieza por dígitos
}
