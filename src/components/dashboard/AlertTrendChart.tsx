import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface WeeklyAlertTrend {
  week: string;
  legacyRules: number;
  aiPrioritized: number;
}

const mockAlertData: WeeklyAlertTrend[] = [
  { week: 'W01', legacyRules: 410, aiPrioritized: 52 },
  { week: 'W02', legacyRules: 480, aiPrioritized: 58 },
  { week: 'W03', legacyRules: 390, aiPrioritized: 44 },
  { week: 'W04', legacyRules: 510, aiPrioritized: 62 },
  { week: 'W05', legacyRules: 560, aiPrioritized: 69 },
  { week: 'W06', legacyRules: 420, aiPrioritized: 48 },
  { week: 'W07', legacyRules: 610, aiPrioritized: 78 },
  { week: 'W08', legacyRules: 590, aiPrioritized: 72 },
  { week: 'W09', legacyRules: 650, aiPrioritized: 88 },
  { week: 'W10', legacyRules: 440, aiPrioritized: 54 },
  { week: 'W11', legacyRules: 480, aiPrioritized: 59 },
  { week: 'W12', legacyRules: 520, aiPrioritized: 64 },
];

export const AlertTrendChart: React.FC = () => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const legacy = payload[0].value;
      const ai = payload[1].value;
      const reduction = (((legacy - ai) / legacy) * 100).toFixed(0);
      
      return (
        <div className="bg-[#141820] border border-[#2A3347] p-2.5 rounded-[4px] shadow-2xl">
          <div className="text-[10px] text-[#4A5568] uppercase font-bold tracking-wider mb-1.5 font-mono">
            Week {label.replace('W', '')} Summary
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-4 justify-between">
              <span className="text-[11px] text-[#8C95A8]">Legacy Rules:</span>
              <span className="text-[11px] font-bold text-[#8C95A8] font-mono">{legacy}</span>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <span className="text-[11px] text-[#E8EBF0] font-semibold">VigilNet AI:</span>
              <span className="text-[11px] font-bold text-[#63B3ED] font-mono">{ai}</span>
            </div>
            <div className="border-t border-[#1E2535] pt-1.5 mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-[#52B788] font-semibold">Noise Reduction:</span>
              <span className="text-[10px] font-mono font-bold text-[#52B788]">
                {reduction}%
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
            Noise Suppression Ratio
          </h3>
          <p className="text-[10px] text-[#4A5568] mt-0.5">
            Legacy rule alerts vs. GNN-prioritized alerts (last 12 weeks)
          </p>
        </div>
        <div className="bg-[#1A2D24] border border-[rgba(82,183,136,0.2)] rounded-[3px] px-2 py-0.5 text-[9px] text-[#52B788] font-semibold font-mono">
          88% Avg Reduction
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-0 text-[10px] font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockAlertData}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" vertical={false} />
            <XAxis
              dataKey="week"
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
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Rule-based line (noisy) */}
            <Line
              type="monotone"
              dataKey="legacyRules"
              stroke="#4A5568"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, stroke: '#4A5568', strokeWidth: 1 }}
            />
            
            {/* AI-prioritized line (clean) */}
            <Line
              type="monotone"
              dataKey="aiPrioritized"
              stroke="#63B3ED"
              strokeWidth={2}
              dot={{ r: 2, stroke: '#63B3ED', strokeWidth: 1 }}
              activeDot={{ r: 4, stroke: '#E8EBF0', strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-[#1E2535]/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-[1.5px] border-t-2 border-dashed border-[#4A5568]" />
          <span className="text-[10px] text-[#8C95A8] font-medium">Legacy Rule Engine</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-[1.5px] border-t-2 border-[#63B3ED]" />
          <span className="text-[10px] text-[#8C95A8] font-medium">VigilNet GNN Model</span>
        </div>
      </div>
    </div>
  );
};
