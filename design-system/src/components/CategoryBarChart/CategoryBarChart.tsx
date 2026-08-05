import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
          <CartesianGrid stroke="#EFE8DA" vertical={false} />
          <XAxis dataKey="label" stroke="#9C8C6E" fontSize={12} tickLine={false} />
          <YAxis stroke="#9C8C6E" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip formatter={valueFormatter ? (value: number) => valueFormatter(value) : undefined} />
          <Bar dataKey="value" fill="#855023" radius={[6, 6, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
