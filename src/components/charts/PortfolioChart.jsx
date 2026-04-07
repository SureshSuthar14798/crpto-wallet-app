import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

/**
 * Portfolio performance line chart
 */
export default function PortfolioChart({ data, height = 220 }) {
  const { isDark } = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-dark-100/95 backdrop-blur-xl px-4 py-2.5 rounded-xl shadow-glass border border-white/20 dark:border-white/10">
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const gradientId = 'portfolioGrad';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#6366f1" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }}
          interval="preserveStartEnd"
          tickCount={5}
        />
        <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{
            r: 5,
            fill: '#6366f1',
            stroke: isDark ? '#141623' : '#fff',
            strokeWidth: 3,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
