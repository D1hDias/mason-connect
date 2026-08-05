import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { brandColors, semanticColors } from '../../tokens/colors';

export interface CategoryBarChartDatum {
  label: string;
  value: number;
}

export interface CategoryBarChartProps {
  data: CategoryBarChartDatum[];
  valueFormatter?: (value: number) => string;
}

/** Themed bar chart — "Indicações por membro" in Relatórios. */
export function CategoryBarChart({ data, valueFormatter }: CategoryBarChartProps) {
  return (
    <div style={{ height: 230 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
          <CartesianGrid stroke={semanticColors.gridLine} vertical={false} />
          <XAxis dataKey="label" stroke={brandColors.bronze} fontSize={12} tickLine={false} />
          <YAxis stroke={brandColors.bronze} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip formatter={valueFormatter ? (value: number) => valueFormatter(value) : undefined} />
          <Bar dataKey="value" fill={brandColors.brown} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
