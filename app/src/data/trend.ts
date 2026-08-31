/**
 * "Valor gerado no núcleo" — últimos seis meses, em milhares de reais.
 * Extraído de DesktopApp.dc.html / MobileApp.dc.html `renderVals().trend`
 * (idêntico nos dois protótipos, sem itens `desktopOnly`).
 */

export interface TrendPoint {
  label: string;
  value: number;
}

export const trend: TrendPoint[] = [
  { label: 'Fev', value: 38 },
  { label: 'Mar', value: 55 },
  { label: 'Abr', value: 47 },
  { label: 'Mai', value: 92 },
  { label: 'Jun', value: 118 },
  { label: 'Jul', value: 127 },
];
