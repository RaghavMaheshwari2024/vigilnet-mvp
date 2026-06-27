import React from 'react';
import {
  FileText,
  ShieldAlert,
  UserPlus,
  CheckCircle2,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface ActionItem {
  id: string;
  analyst: string;
  role: string;
  action: string;
  targetId: string;
  time: string;
  type: 'file' | 'flag' | 'assign' | 'clear' | 'escalate' | 'ai';
}

const mockActions: ActionItem[] = [
  {
    id: 'a1',
    analyst: 'Raghav Maheshwari',
    role: 'Lead Investigator',
    action: 'Drafted Suspicious Transaction Report (STR-2025-01)',
    targetId: 'CAS-2291',
    time: '4 mins ago',
    type: 'file'
  },
  {
    id: 'a2',
    analyst: 'VigilNet AI agent',
    role: 'System Agent',
    action: 'Auto-escalated high risk graph cluster path (Risk 94)',
    targetId: 'CL-01',
    time: '12 mins ago',
    type: 'ai'
  },
  {
    id: 'a3',
    analyst: 'Ananya Patel',
    role: 'Senior Analyst',
    action: 'Sanctions list match verified and account frozen',
    targetId: 'CAS-2287',
    time: '1 hr ago',
    type: 'flag'
  },
  {
    id: 'a4',
    analyst: 'S. Chen',
    role: 'Risk Officer',
    action: 'Case reassigned to J. Martinez for high-priority dispatch',
    targetId: 'CAS-2281',
    time: '3 hrs ago',
    type: 'assign'
  },
  {
    id: 'a5',
    analyst: 'Auto-Agent (Level 1)',
    role: 'AI Assessor',
    action: 'False positive cleared after entity database sync',
    targetId: 'CAS-2279',
    time: '5 hrs ago',
    type: 'clear'
  }
];

export const AnalystActionsList: React.FC = () => {
  const getActionIcon = (type: ActionItem['type']) => {
    switch (type) {
      case 'file':
        return <FileText size={12} className="text-[#F6A623]" />;
      case 'flag':
        return <ShieldAlert size={12} className="text-[#FF6B6B]" />;
      case 'assign':
        return <UserPlus size={12} className="text-[#63B3ED]" />;
      case 'clear':
        return <CheckCircle2 size={12} className="text-[#52B788]" />;
      case 'ai':
        return <Sparkles size={12} className="text-[#63B3ED]" />;
      case 'escalate':
      default:
        return <ArrowUpRight size={12} className="text-[#E05C6E]" />;
    }
  };

  return (
    <div className="bg-[#0F1217] border border-[#1E2535] rounded-[6px] p-4 flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[12px] font-bold text-[#E8EBF0] tracking-[0.01em]">
          Audit Log & Analyst Dispatch
        </h3>
        <p className="text-[10px] text-[#4A5568] mt-0.5">
          Recent operational actions logged by humans and system agents
        </p>
      </div>

      {/* List Timeline */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 relative pl-3 border-l border-[#1E2535] ml-2">
        {mockActions.map(action => (
          <div key={action.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-[20px] top-[2px] w-[14px] h-[14px] rounded-full bg-[#141820] border border-[#1E2535] flex items-center justify-center">
              {getActionIcon(action.type)}
            </div>

            {/* Content box */}
            <div className="text-[11px]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#E8EBF0]">
                  {action.analyst}
                </span>
                <span className="text-[9px] text-[#4A5568] font-mono whitespace-nowrap">
                  {action.time}
                </span>
              </div>
              <div className="text-[10px] text-[#8C95A8] font-medium mt-[1px]">
                {action.role}
              </div>
              <div className="text-[#8C95A8] mt-1.5 leading-[1.4]">
                {action.action}{' '}
                <span className="font-mono text-[9px] text-[#63B3ED] bg-[#1A2A3F] border border-[rgba(43,108,176,0.2)] rounded-[2px] px-1 py-[0.5px] whitespace-nowrap ml-1 cursor-pointer">
                  {action.targetId}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
