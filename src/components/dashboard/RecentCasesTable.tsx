import React, { useState } from 'react';
import { MoreVertical, ArrowRight, ExternalLink } from 'lucide-react';

interface CaseItem {
  id: string;
  entity: string;
  volume: string;
  riskScore: number;
  jurisdiction: string;
  status: 'SAR Filed' | 'Flagged' | 'Under Review' | 'Cleared';
  analyst: string;
  date: string;
}

const mockCases: CaseItem[] = [
  {
    id: 'CAS-2291',
    entity: 'Nexus Corp LLC',
    volume: '$4,280,000',
    riskScore: 94,
    jurisdiction: 'Cayman Islands',
    status: 'SAR Filed',
    analyst: 'J. Martinez',
    date: '2 min ago'
  },
  {
    id: 'CAS-2287',
    entity: 'Orion Capital AG',
    volume: '$5,900,000',
    riskScore: 88,
    jurisdiction: 'Switzerland',
    status: 'Flagged',
    analyst: 'A. Patel',
    date: '1 hr ago'
  },
  {
    id: 'CAS-2281',
    entity: 'Meridian Holdings',
    volume: '$812,450',
    riskScore: 71,
    jurisdiction: 'United Arab Emirates',
    status: 'Under Review',
    analyst: 'S. Chen',
    date: '3 hrs ago'
  },
  {
    id: 'CAS-2279',
    entity: 'Westfield Partners',
    volume: '$128,900',
    riskScore: 22,
    jurisdiction: 'United States',
    status: 'Cleared',
    analyst: 'Auto-Agent',
    date: '5 hrs ago'
  },
  {
    id: 'CAS-2274',
    entity: 'Al-Zamil Financials',
    volume: '$1,450,000',
    riskScore: 65,
    jurisdiction: 'Saudi Arabia',
    status: 'Under Review',
    analyst: 'J. Martinez',
    date: '1 day ago'
  }
];

export const RecentCasesTable: React.FC = () => {
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  const handleSelectCase = (id: string) => {
    setSelectedCases(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCases.length === mockCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(mockCases.map(c => c.id));
    }
  };

  const getStatusBadge = (status: CaseItem['status']) => {
    switch (status) {
      case 'SAR Filed':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.04em] px-2 py-0.5 rounded-[3px] bg-[#2D0F0F] text-[#FF6B6B] border border-[rgba(255,107,107,0.15)] uppercase">
            <span className="w-1 h-1 rounded-full bg-[#FF6B6B]" />
            SAR Filed
          </span>
        );
      case 'Flagged':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.04em] px-2 py-0.5 rounded-[3px] bg-[#2A1018] text-[#E05C6E] border border-[rgba(224,92,110,0.15)] uppercase">
            <span className="w-1 h-1 rounded-full bg-[#E05C6E]" />
            Flagged
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.04em] px-2 py-0.5 rounded-[3px] bg-[#2A2010] text-[#F6A623] border border-[rgba(246,166,35,0.15)] uppercase">
            <span className="w-1 h-1 rounded-full bg-[#F6A623]" />
            Reviewing
          </span>
        );
      case 'Cleared':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.04em] px-2 py-0.5 rounded-[3px] bg-[#1A2D24] text-[#52B788] border border-[rgba(82,183,136,0.15)] uppercase">
            <span className="w-1 h-1 rounded-full bg-[#52B788]" />
            Cleared
          </span>
        );
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#FF6B6B] bg-[#FF6B6B]';
    if (score >= 70) return 'text-[#E05C6E] bg-[#E05C6E]';
    if (score >= 50) return 'text-[#F6A623] bg-[#F6A623]';
    return 'text-[#52B788] bg-[#52B788]';
  };

  return (
    <div className="bg-[#0F1217] border border-[#1E2535] rounded-[6px] p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[12px] font-bold text-[#E8EBF0] tracking-[0.01em]">
            Active High-Priority Cases
          </h3>
          <p className="text-[10px] text-[#4A5568] mt-0.5">
            Real-time queue of cases requiring investigator dispatch
          </p>
        </div>
        <button className="text-[10px] text-[#8C95A8] hover:text-[#E8EBF0] flex items-center gap-1 border border-[#1E2535] rounded-[4px] px-2.5 py-1 bg-[#141820] hover:border-[#2A3347] transition-all">
          View Queue
          <ArrowRight size={10} />
        </button>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto min-h-0">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-[#1E2535]">
              <th className="py-2.5 px-3 w-8">
                <input
                  type="checkbox"
                  checked={selectedCases.length === mockCases.length}
                  onChange={handleSelectAll}
                  className="rounded-[2px] bg-[#1A2030] border-[#1E2535] text-[#2B6CB0] focus:ring-0 focus:ring-offset-0 w-3 h-3 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3 text-[#4A5568] font-semibold tracking-wider uppercase text-[9px]">
                Case ID
              </th>
              <th className="py-2.5 px-3 text-[#4A5568] font-semibold tracking-wider uppercase text-[9px]">
                Subject Entity
              </th>
              <th className="py-2.5 px-3 text-[#4A5568] font-semibold tracking-wider uppercase text-[9px]">
                Tx Volume
              </th>
              <th className="py-2.5 px-3 text-[#4A5568] font-semibold tracking-wider uppercase text-[9px] w-[110px]">
                Risk Score
              </th>
              <th className="py-2.5 px-3 text-[#4A5568] font-semibold tracking-wider uppercase text-[9px]">
                Jurisdiction
              </th>
              <th className="py-2.5 px-3 text-[#4A5568] font-semibold tracking-wider uppercase text-[9px]">
                Status
              </th>
              <th className="py-2.5 px-3 text-[#4A5568] font-semibold tracking-wider uppercase text-[9px]">
                Assigned
              </th>
              <th className="py-2.5 px-3 text-[#4A5568] font-semibold tracking-wider uppercase text-[9px] w-[90px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2535]/30">
            {mockCases.map(item => {
              const isSelected = selectedCases.includes(item.id);
              const scoreColor = getRiskScoreColor(item.riskScore);
              
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#141820]/40 transition-colors ${
                    isSelected ? 'bg-[#141820]/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectCase(item.id)}
                      className="rounded-[2px] bg-[#1A2030] border-[#1E2535] text-[#2B6CB0] focus:ring-0 focus:ring-offset-0 w-3 h-3 cursor-pointer"
                    />
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#8C95A8] font-medium">
                    {item.id}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#E8EBF0]">
                    {item.entity}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-[#8C95A8]">
                    {item.volume}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-[4px] bg-[#1A2030] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${scoreColor.split(' ')[1]}`}
                          style={{ width: `${item.riskScore}%` }}
                        />
                      </div>
                      <span className={`font-mono text-[10px] font-bold min-w-[20px] ${scoreColor.split(' ')[0]}`}>
                        {item.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#8C95A8]">
                    {item.jurisdiction}
                  </td>
                  <td className="py-2.5 px-3">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-2.5 px-3 text-[#8C95A8]">
                    {item.analyst}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="text-[10px] text-[#2B6CB0] hover:text-[#63B3ED] hover:bg-[#1A2A3F] border border-transparent hover:border-[rgba(99,179,237,0.2)] rounded-[3px] px-2 py-0.5 font-medium transition-all flex items-center gap-0.5">
                        Investigate
                        <ExternalLink size={10} />
                      </button>
                      <button className="text-[#4A5568] hover:text-[#8C95A8] p-0.5 rounded-[3px] hover:bg-[#1A2030] transition-colors">
                        <MoreVertical size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
