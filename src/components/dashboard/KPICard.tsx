import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaText?: string;
  type?: 'neutral' | 'success' | 'warning' | 'danger' | 'critical';
  icon: React.ComponentType<any>;
  sparklineData?: number[];
  progress?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  delta,
  deltaText,
  type = 'neutral',
  icon: Icon,
  sparklineData,
  progress,
}) => {
  const getCardTypeStyles = () => {
    switch (type) {
      case 'critical':
        return {
          border: 'border-l-2 border-l-[#FF6B6B] border-y-[#1E2535] border-r-[#1E2535]',
          valueColor: 'text-[#FF6B6B]',
        };
      case 'danger':
        return {
          border: 'border-l-2 border-l-[#E05C6E] border-y-[#1E2535] border-r-[#1E2535]',
          valueColor: 'text-[#E05C6E]',
        };
      case 'warning':
        return {
          border: 'border-l-2 border-l-[#F6A623] border-y-[#1E2535] border-r-[#1E2535]',
          valueColor: 'text-[#F6A623]',
        };
      case 'success':
        return {
          border: 'border-l-2 border-l-[#52B788] border-y-[#1E2535] border-r-[#1E2535]',
          valueColor: 'text-[#52B788]',
        };
      case 'neutral':
      default:
        return {
          border: 'border-[#1E2535]',
          valueColor: 'text-[#E8EBF0]',
        };
    }
  };

  const style = getCardTypeStyles();

  // Helper to generate SVG path for sparkline
  const generateSparklinePath = (points: number[]) => {
    if (!points || points.length < 2) return '';
    const width = 80;
    const height = 24;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min === 0 ? 1 : max - min;
    
    return points
      .map((val, index) => {
        const x = (index / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div className={`bg-[#141820] border rounded-[6px] p-4 flex flex-col justify-between ${style.border}`}>
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[#4A5568] tracking-[0.06em] uppercase font-semibold">
          {label}
        </span>
        <div className="text-[#8C95A8] opacity-60">
          <Icon size={14} />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex items-baseline justify-between mt-1">
        <div className="flex flex-col">
          <span className={`text-[22px] font-bold tracking-[-0.03em] font-mono leading-none ${style.valueColor}`}>
            {value}
          </span>
          
          {/* Delta status */}
          {delta !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {delta > 0 ? (
                <span className="flex items-center gap-[2px] text-[10px] font-bold text-[#52B788]">
                  <ArrowUpRight size={10} />
                  +{delta}%
                </span>
              ) : delta < 0 ? (
                <span className="flex items-center gap-[2px] text-[10px] font-bold text-[#E05C6E]">
                  <ArrowDownRight size={10} />
                  {delta}%
                </span>
              ) : (
                <span className="flex items-center gap-[2px] text-[10px] font-bold text-[#8C95A8]">
                  <Minus size={10} />
                  0%
                </span>
              )}
              {deltaText && (
                <span className="text-[10px] text-[#4A5568]">
                  {deltaText}
                </span>
              )}
            </div>
          )}

          {/* Progress Bar (if provided) */}
          {progress !== undefined && (
            <div className="w-full mt-3">
              <div className="w-full h-[3px] bg-[#1A2030] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    type === 'critical' ? 'bg-[#FF6B6B]' : 
                    type === 'warning' ? 'bg-[#F6A623]' : 
                    type === 'success' ? 'bg-[#52B788]' : 'bg-[#2B6CB0]'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sparkline Graphic */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-[80px] h-[24px] self-end opacity-60">
            <svg width="80" height="24">
              <path
                d={generateSparklinePath(sparklineData)}
                fill="none"
                stroke={
                  type === 'critical' ? '#FF6B6B' : 
                  type === 'warning' ? '#F6A623' : 
                  type === 'success' ? '#52B788' : '#2B6CB0'
                }
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
