import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import type { PricePoint } from '../types/flight';

interface Props {
  data: PricePoint[];
  height?: number;
  showTooltip?: boolean;
  showAxis?: boolean;
}

export default function PriceChart({ data, height = 60, showTooltip = false, showAxis = false }: Props) {
  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const current = prices[prices.length - 1];
  const isDropping = current < prices[Math.floor(prices.length * 0.7)];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`gradient-${isDropping ? 'green' : 'red'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isDropping ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
            <stop offset="100%" stopColor={isDropping ? '#22c55e' : '#ef4444'} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showAxis && (
          <YAxis
            domain={[min * 0.95, max * 1.05]}
            hide={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickFormatter={(v: number) => `$${v}`}
            width={45}
          />
        )}
        {showTooltip && (
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#e2e8f0',
            }}
            formatter={(value: number) => [`$${value}`, 'Price']}
            labelFormatter={(label: string) => label}
          />
        )}
        <Area
          type="monotone"
          dataKey="price"
          stroke={isDropping ? '#22c55e' : '#ef4444'}
          strokeWidth={2}
          fill={`url(#gradient-${isDropping ? 'green' : 'red'})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
