import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

/**
 * Premium portfolio performance chart with enhanced gradients and styling
 */
export default function PortfolioChart({ data, height = 220 }) {
  const { isDark } = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="px-4 py-2.5 rounded-xl border"
          style={{
            background: isDark
              ? 'rgba(30, 32, 48, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.12)',
          }}
        >
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5 font-medium">{label}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
        <defs>
          {/* primary area gradient */}
          <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="30%" stopColor="#818cf8" stopOpacity={0.2} />
            <stop offset="70%" stopColor="#a78bfa" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0} />
          </linearGradient>
          {/* stroke gradient */}
          <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          {/* glow filter */}
          <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid
          strokeDasharray="3 6"
          vertical={false}
          stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
        />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: isDark ? '#6b7280' : '#9ca3af', fontWeight: 500 }}
          interval="preserveStartEnd"
          tickCount={5}
          dy={6}
        />
        <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="url(#strokeGrad)"
          strokeWidth={2.5}
          fill="url(#portfolioGrad)"
          dot={false}
          activeDot={{
            r: 6,
            fill: '#6366f1',
            stroke: isDark ? '#1e2030' : '#ffffff',
            strokeWidth: 3,
            filter: 'url(#chartGlow)',
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
