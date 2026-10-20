import React, { useState } from 'react';

interface DataPoint {
  date: string;
  price: number;
}

interface MandiChartProps {
  data: DataPoint[];
  commodityName: string;
  unit: string;
  color?: string;
  height?: number;
}

export const MandiChart: React.FC<MandiChartProps> = ({
  data,
  commodityName,
  unit,
  color = '#176B45',
  height = 180,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="text-xs text-gray-400 py-6 text-center">No historical trend data available</div>;
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;
  const padding = range * 0.15;
  const effectiveMin = Math.max(0, minPrice - padding);
  const effectiveMax = maxPrice + padding;
  const effectiveRange = effectiveMax - effectiveMin;

  const width = 500;
  const plotWidth = width - 40;
  const plotHeight = height - 40;

  const points = data.map((d, i) => {
    const x = 30 + (i / (data.length - 1)) * plotWidth;
    const y = 15 + plotHeight - ((d.price - effectiveMin) / effectiveRange) * plotHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - 20} L ${points[0].x} ${height - 20} Z`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Top summary row */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="font-semibold text-gray-700 flex items-center gap-1.5">
          <span>7-Day APMC Market Trend</span>
          <span className="text-[10px] bg-[#E8F5EC] text-[#176B45] font-bold px-1.5 py-0.5 rounded">
            {commodityName} (₹/{unit})
          </span>
        </div>
        {hoveredPoint ? (
          <div className="text-[#176B45] font-bold text-xs bg-white px-2 py-0.5 rounded shadow-xs border border-gray-100">
            {hoveredPoint.date}: ₹{hoveredPoint.price.toLocaleString('en-IN')}/{unit}
          </div>
        ) : (
          <div className="text-gray-500 text-[11px]">
            Latest: <span className="font-bold text-[#176B45]">₹{data[data.length - 1].price}/{unit}</span>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => {
          setHoveredPoint(null);
          setHoverIndex(null);
        }}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = 15 + plotHeight * (1 - ratio);
          const priceVal = Math.round(effectiveMin + effectiveRange * ratio);
          return (
            <g key={idx}>
              <line
                x1="30"
                y1={y}
                x2={width - 10}
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x="25"
                y={y + 3}
                textAnchor="end"
                className="text-[9px] fill-gray-400 font-medium"
              >
                ₹{priceVal}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#chartGradient)" />

        {/* Line stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Date labels on X-axis */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 5}
            textAnchor="middle"
            className="text-[9px] fill-gray-400 font-medium"
          >
            {p.date}
          </text>
        ))}

        {/* Data points & Interactive hover circles */}
        {points.map((p, i) => {
          const isHovered = hoverIndex === i;
          return (
            <g key={i} className="cursor-pointer">
              {isHovered && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="7"
                  fill={color}
                  fillOpacity="0.2"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? '4.5' : '3'}
                fill="#ffffff"
                stroke={color}
                strokeWidth="2"
                onMouseEnter={() => {
                  setHoveredPoint(p);
                  setHoverIndex(i);
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
