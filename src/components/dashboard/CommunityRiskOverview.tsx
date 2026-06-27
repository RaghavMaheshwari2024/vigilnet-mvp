import React from 'react';
import { Network, ArrowUpRight, Users } from 'lucide-react';

interface ClusterData {
  id: string;
  name: string;
  accounts: number;
  avgRisk: number;
  volume: string;
  riskLevel: 'critical' | 'warning' | 'success';
  color: string;
  description: string;
}

const mockClusters: ClusterData[] = [
  {
    id: 'CL-01',
    name: 'Crypto Mixer Flow',
    accounts: 18,
    avgRisk: 94,
    volume: '$4.28M',
    riskLevel: 'critical',
    color: '#FF6B6B',
    description: 'High-velocity hops passing through unlicensed virtual asset service providers (VASPs).'
  },
  {
    id: 'CL-02',
    name: 'Layered Offshore Shells',
    accounts: 14,
    avgRisk: 78,
    volume: '$5.90M',
    riskLevel: 'warning',
    color: '#F6A623',
    description: 'Circular transfers indicating rapid layering through shell companies in Cayman Islands & UAE.'
  },
  {
    id: 'CL-03',
    name: 'Structured Deposits',
    accounts: 112,
    avgRisk: 22,
    volume: '$0.81M',
    riskLevel: 'success',
    color: '#52B788',
    description: 'Low-value cash deposits kept just below reporting thresholds (smurfing pattern).'
  }
];

export const CommunityRiskOverview: React.FC = () => {
  return (
    <div className="bg-[#0F1217] border border-[#1E2535] rounded-[6px] p-4 flex flex-col h-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[12px] font-bold text-[#E8EBF0] tracking-[0.01em] flex items-center gap-1.5">
            <Network size={13} className="text-[#2B6CB0]" />
            AI Community Risk Clusters
          </h3>
          <p className="text-[10px] text-[#4A5568] mt-0.5">
            Louvain clustering & Graph Neural Network (GATv2) hazard projections
          </p>
        </div>
        <span className="text-[9px] text-[#2B6CB0] font-mono font-semibold bg-[#1A2A3F] border border-[rgba(43,108,176,0.3)] rounded-[3px] px-1.5 py-0.5">
          GNN Active
        </span>
      </div>

      {/* Grid: SVG Visualization on Left, Details on Right */}
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Left Side: SVG Interactive Graph Simulation */}
        <div className="w-[140px] h-full bg-[#0A0C0F] border border-[#1E2535] rounded-[4px] relative overflow-hidden flex-shrink-0 flex items-center justify-center">
          
          {/* SVG Canvas */}
          <svg className="w-full h-full" viewBox="0 0 140 160">
            {/* Connection Lines (Edges) */}
            <line x1="35" y1="40" x2="105" y2="65" stroke="#E05C6E" strokeWidth={1} strokeDasharray="3 2" />
            <line x1="105" y1="65" x2="70" y2="125" stroke="#F6A623" strokeWidth={1} strokeDasharray="3 3" />
            <line x1="35" y1="40" x2="70" y2="125" stroke="#1E2535" strokeWidth={1} />
            
            {/* Cluster 1: Crypto Mixer (Critical) */}
            <g className="cursor-pointer">
              <circle cx="35" cy="40" r="14" fill="#2D0F0F" stroke="#FF6B6B" strokeWidth={1.5} />
              <circle cx="35" cy="40" r="18" fill="none" stroke="#FF6B6B" strokeWidth={1} strokeOpacity={0.2} className="animate-pulse" />
              {/* Inner Node dots */}
              <circle cx="31" cy="36" r="2" fill="#FF6B6B" />
              <circle cx="39" cy="38" r="1.5" fill="#FF6B6B" />
              <circle cx="33" cy="45" r="2" fill="#E8EBF0" />
              <text x="35" y="43" textAnchor="middle" fontSize={6} fontWeight="bold" fill="#FF6B6B" className="font-mono">94</text>
              <text x="35" y="64" textAnchor="middle" fontSize={7} fill="#8C95A8" fontWeight="500">CL-01</text>
            </g>

            {/* Cluster 2: Offshore Shells (Warning) */}
            <g className="cursor-pointer">
              <circle cx="105" cy="65" r="14" fill="#2A2010" stroke="#F6A623" strokeWidth={1.5} />
              <circle cx="101" cy="61" r="2" fill="#F6A623" />
              <circle cx="109" cy="63" r="1.5" fill="#F6A623" />
              <circle cx="105" cy="70" r="2" fill="#E8EBF0" />
              <text x="105" y="68" textAnchor="middle" fontSize={6} fontWeight="bold" fill="#F6A623" className="font-mono">78</text>
              <text x="105" y="89" textAnchor="middle" fontSize={7} fill="#8C95A8" fontWeight="500">CL-02</text>
            </g>

            {/* Cluster 3: Structured Deposits (Safe/Clear) */}
            <g className="cursor-pointer">
              <circle cx="70" cy="125" r="14" fill="#1A2D24" stroke="#52B788" strokeWidth={1.5} />
              <circle cx="66" cy="121" r="2" fill="#52B788" />
              <circle cx="74" cy="123" r="1.5" fill="#52B788" />
              <circle cx="70" cy="130" r="2" fill="#E8EBF0" />
              <text x="70" y="128" textAnchor="middle" fontSize={6} fontWeight="bold" fill="#52B788" className="font-mono">22</text>
              <text x="70" y="149" textAnchor="middle" fontSize={7} fill="#8C95A8" fontWeight="500">CL-03</text>
            </g>
          </svg>
        </div>

        {/* Right Side: Cluster Breakdown details */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {mockClusters.map(cluster => (
            <div
              key={cluster.id}
              className="bg-[#141820] border border-[#1E2535] rounded-[4px] p-2 hover:border-[#2A3347] cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#E8EBF0] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cluster.color }} />
                  {cluster.name}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-1 py-[0.5px] rounded-[2px] ${
                    cluster.riskLevel === 'critical'
                      ? 'bg-[#2D0F0F] text-[#FF6B6B]'
                      : cluster.riskLevel === 'warning'
                      ? 'bg-[#2A2010] text-[#F6A623]'
                      : 'bg-[#1A2D24] text-[#52B788]'
                  }`}
                >
                  {cluster.avgRisk} Risk
                </span>
              </div>
              
              <div className="flex items-center gap-3 mt-1.5 text-[9px] text-[#8C95A8] font-mono">
                <span className="flex items-center gap-0.5">
                  <Users size={9} />
                  {cluster.accounts} Accounts
                </span>
                <span className="text-[#4A5568]">|</span>
                <span className="flex items-center gap-0.5">
                  <ArrowUpRight size={9} />
                  {cluster.volume} Volume
                </span>
              </div>
              <p className="text-[9px] text-[#4A5568] leading-[1.3] mt-1 truncate-2-lines">
                {cluster.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
