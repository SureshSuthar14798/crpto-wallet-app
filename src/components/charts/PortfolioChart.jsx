import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

/**
 * Premium portfolio performance chart with enhanced gradients and styling
 */
export default function PortfolioChart({ 
  data, 
  height = 220, 
  width = "100%", 
  hideAxis = false,
  color = "#6366f1",
  id = "main",
  type = "area"
}) {
  const { isDark } = useTheme();
  
  const gradId = `portfolioGrad-${id}`;
  const strokeId = `strokeGrad-${id}`;

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
            boxShadow: `0 8px 32px ${color}20`,
          }}
        >
          {!hideAxis && <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5 font-medium">{label}</p>}
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = type === 'bar' ? BarChart : AreaChart;

  return (
    <ResponsiveContainer width={width} height={height}>
      <ChartComponent data={data} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
          <filter id={`chartGlow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {!hideAxis && (
          <CartesianGrid
            strokeDasharray="3 6"
            vertical={false}
            stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
          />
        )}
        {!hideAxis && (
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: isDark ? '#6b7280' : '#9ca3af', fontWeight: 500 }}
            interval="preserveStartEnd"
            tickCount={5}
            dy={6}
          />
        )}
        <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={hideAxis ? false : { fill: 'rgba(99, 102, 241, 0.05)', radius: 10 }} 
        />
        
        {type === 'bar' ? (
          <Bar
            dataKey="value"
            fill={color}
            radius={[6, 6, 0, 0]}
            barSize={12}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={0.6 + (index / data.length) * 0.4} />
            ))}
          </Bar>
        ) : (
          <Area
            type="monotone"
            dataKey="value"
            stroke={`url(#${strokeId})`}
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={hideAxis ? false : {
              r: 6,
              fill: color,
              stroke: isDark ? '#1e2030' : '#ffffff',
              strokeWidth: 3,
              filter: `url(#chartGlow-${id})`,
            }}
          />
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );
}
