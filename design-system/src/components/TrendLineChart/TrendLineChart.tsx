import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { brandColors, semanticColors } from '../../tokens/colors';

export interface TrendLineChartDatum {
  label: string;
  value: number;
}

export interface TrendLineChartProps {
  data: TrendLineChartDatum[];
  /** Formats the tooltip value, e.g. `(v) => `R$ ${v} mil``. */
  valueFormatter?: (value: number) => string;
}

/** Themed line chart — "Valor gerado pelo grupo" trend in the Painel screen. */
export function TrendLineChart({ data, valueFormatter }: TrendLineChartProps) {
  return (
    <div style={{ height: 210 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={semanticColors.gridLine} vertical={false} />
          <XAxis dataKey="label" stroke={brandColors.bronze} fontSize={12} tickLine={false} />
          <YAxis stroke={brandColors.bronze} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip formatter={valueFormatter ? (value: number) => valueFormatter(value) : undefined} />
          <Line type="monotone" dataKey="value" stroke={brandColors.brown} strokeWidth={3} dot={{ fill: brandColors.gold, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
