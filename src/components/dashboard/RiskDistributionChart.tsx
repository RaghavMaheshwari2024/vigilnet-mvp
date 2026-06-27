import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskDataPoint {
  name: string;
  value: number;
  color: string;
  textColor: string;
}

const mockRiskData: RiskDataPoint[] = [
  { name: 'Critical', value: 142, color: '#FF6B6B', textColor: 'text-[#FF6B6B]' },
  { name: 'High', value: 274, color: '#E05C6E', textColor: 'text-[#E05C6E]' },
  { name: 'Medium', value: 371, color: '#F6A623', textColor: 'text-[#F6A623]' },
  { name: 'Low', value: 497, color: '#52B788', textColor: 'text-[#52B788]' },
];

export const RiskDistributionChart: React.FC = () => {
  const totalAlerts = mockRiskData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-[#0F1217] border border-[#1E2535] rounded-[6px] p-4 flex flex-col h-[280px]">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[12px] font-bold text-[#E8EBF0] tracking-[0.01em]">
          Risk Distribution
        </h3>
        <p className="text-[10px] text-[#4A5568] mt-0.5">
          By alert severity · {totalAlerts.toLocaleString()} total
        </p>
      </div>

      {/* Donut Chart Canvas + Legend */}
      <div className="flex-1 flex items-center justify-between min-h-0 gap-4">
        {/* Left Side: Recharts Pie Chart */}
        <div className="relative w-[130px] h-[130px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockRiskData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={48}
                paddingAngle={3}
                dataKey="value"
              >
                {mockRiskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F1217" strokeWidth={1} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Inner Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-[15px] font-bold font-mono text-[#E8EBF0] leading-none">
              {totalAlerts}
            </span>
            <span className="text-[8px] text-[#4A5568] uppercase font-semibold mt-1">
              alerts
            </span>
          </div>
        </div>

        {/* Right Side: List Legend */}
        <div className="flex-1 flex flex-col justify-center space-y-2 text-[11px]">
          {mockRiskData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#8C95A8] font-medium">{item.name}</span>
              </div>
              <span className={`font-mono font-bold ${item.textColor}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
