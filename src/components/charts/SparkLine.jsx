import { useMemo } from 'react';

/**
 * Premium tiny inline sparkline with gradient fill
 */
export default function SparkLine({ data, color = '#6366f1', width = 80, height = 28 }) {
  if (!data || data.length < 2) return null;

  const { linePath, areaPath } = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const px = 2;

    const pts = data.map((val, i) => ({
      x: px + (i / (data.length - 1)) * (width - px * 2),
      y: px + (1 - (val - min) / range) * (height - px * 2),
    }));

    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const area = `${line} L${pts[pts.length - 1].x},${height} L${pts[0].x},${height} Z`;

    return { linePath: line, areaPath: area };
  }, [data, color, width, height]);

  const gradId = `sp-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
