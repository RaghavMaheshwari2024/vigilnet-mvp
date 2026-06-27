import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartDataPoint {
  time: string;
  volume: number;
  elevated: number;
  critical: number;
}

const mockTrendData: ChartDataPoint[] = [
  { time: '08:00', volume: 120, elevated: 12, critical: 2 },
  { time: '09:00', volume: 240, elevated: 22, critical: 4 },
  { time: '10:00', volume: 380, elevated: 48, critical: 8 },
  { time: '11:00', volume: 490, elevated: 56, critical: 12 },
  { time: '12:00', volume: 550, elevated: 64, critical: 15 },
  { time: '13:00', volume: 420, elevated: 38, critical: 9 },
  { time: '14:00', volume: 680, elevated: 94, critical: 22 },
  { time: '15:00', volume: 890, elevated: 112, critical: 31 },
  { time: '16:00', volume: 750, elevated: 88, critical: 24 },
  { time: '17:00', volume: 620, elevated: 70, critical: 18 },
  { time: '18:00', volume: 480, elevated: 44, critical: 10 },
  { time: '19:00', volume: 320, elevated: 28, critical: 5 },
];

export const TrendChart: React.FC = () => {
  const formatYAxis = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#141820] border border-[#2A3347] p-2.5 rounded-[4px] shadow-2xl">
          <div className="text-[10px] text-[#4A5568] uppercase font-bold tracking-wider mb-1.5">
            {label} UTC
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-[11px] text-[#8C95A8]">Volume:</span>
              <span className="text-[11px] font-bold text-[#E8EBF0] font-mono">
                {payload[0].value} tx/s
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-[11px] text-[#F6A623]">Elevated:</span>
              <span className="text-[11px] font-bold text-[#F6A623] font-mono">
                {payload[1].value}
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-[11px] text-[#FF6B6B]">Critical:</span>
              <span className="text-[11px] font-bold text-[#FF6B6B] font-mono">
                {payload[2].value}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0F1217] border border-[#1E2535] rounded-[6px] p-4 flex flex-col h-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[12px] font-bold text-[#E8EBF0] tracking-[0.01em]">
            Transaction Processing & Alert Velocity
          </h3>
          <p className="text-[10px] text-[#4A5568] mt-0.5">
            Real-time transaction volume vs. suspicious activities identified
          </p>
        </div>
        <div className="flex gap-1.5">
          <span className="bg-[#141820] border border-[#1E2535] rounded-[4px] px-2 py-0.5 text-[9px] text-[#8C95A8] font-semibold uppercase">
            Live Stream
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-0 text-[10px] font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockTrendData}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2B6CB0" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2B6CB0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorElevated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F6A623" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F6A623" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#4A5568"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="#4A5568"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1E2535', strokeWidth: 1 }} />
            
            {/* Base Volume Area */}
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#2B6CB0"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorVolume)"
            />
            {/* Elevated Risk Area */}
            <Area
              type="monotone"
              dataKey="elevated"
              stroke="#F6A623"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorElevated)"
            />
            {/* Critical Risk Area */}
            <Area
              type="monotone"
              dataKey="critical"
              stroke="#FF6B6B"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorCritical)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-[#1E2535]/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#2B6CB0]" />
          <span className="text-[10px] text-[#8C95A8] font-medium">Normal Flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#F6A623]" />
          <span className="text-[10px] text-[#8C95A8] font-medium">Elevated Alerts</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
          <span className="text-[10px] text-[#8C95A8] font-medium">Critical (SAR Trigger)</span>
        </div>
      </div>
    </div>
  );
};
