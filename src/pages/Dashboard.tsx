import React, { useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  User,
  ShieldAlert,
  Activity,
  Layers,
  Network,
  FileText,
  CheckCircle,
  Clock,
  Cpu,
  AlertCircle
} from 'lucide-react';

// Custom Node Component for React Flow representing accounts
const AccountNode = ({ data }: any) => {
  const getRiskBorder = (risk: number) => {
    if (risk >= 80) return 'border-[#FF6B6B] shadow-[0_0_10px_rgba(255,107,107,0.15)]';
    if (risk >= 50) return 'border-[#F6A623] shadow-[0_0_10px_rgba(246,166,35,0.15)]';
    return 'border-[#52B788]';
  };

  return (
    <div className={`p-3 rounded-[6px] border bg-[#0F1217] ${getRiskBorder(data.risk)} min-w-[170px] text-[#E8EBF0]`}>
      <Handle type="target" position={Position.Top} className="opacity-0 w-2 h-2" />

      {/* Node Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#1E2535] pb-1.5 mb-1.5">
        <span className="text-[9px] font-mono text-[#8C95A8] truncate">{data.id}</span>
        <span className={`text-[8.5px] font-bold font-mono px-1 rounded uppercase ${data.risk >= 80 ? 'bg-[#2D0F0F] text-[#FF6B6B]' :
            data.risk >= 50 ? 'bg-[#2A2010] text-[#F6A623]' :
              'bg-[#1A2D24] text-[#52B788]'
          }`}>
          {data.risk}%
        </span>
      </div>

      {/* Node Content */}
      <div className="text-[11px] font-bold truncate">{data.label}</div>
      <div className="text-[8.5px] text-[#8C95A8] mt-0.5 truncate uppercase font-mono tracking-wider">{data.role}</div>

      <Handle type="source" position={Position.Bottom} className="opacity-0 w-2 h-2" />
    </div>
  );
};

const nodeTypes = {
  account: AccountNode
};

interface CaseDetails {
  id: string;
  profile: {
    name: string;
    occupation: string;
    kyc: 'Verified' | 'Pending' | 'Failed';
    previousAlerts: number;
    riskLevel: 'Critical' | 'Warning' | 'Low';
    riskPercent: number;
  };
  transactions: {
    id: string;
    date: string;
    amount: string;
    type: string;
    status: 'Cleared' | 'Pending' | 'Flagged';
    description: string;
  }[];
  behaviourTimeline: {
    time: string;
    event: string;
    anomalyScore: number;
    severity: 'critical' | 'warning' | 'normal';
  }[];
  aiSummary: {
    executive: string;
    behaviour: string;
    graph: string;
    evidence: string[];
    recommendation: string;
  };
  flow: {
    nodes: any[];
    edges: any[];
  };
}

const entityData: Record<string, CaseDetails> = {
  'Nexus Corp LLC': {
    id: 'CAS-2026-000241',
    profile: {
      name: 'Nexus Corp LLC',
      occupation: 'Corporate Shell (Offshore Holding)',
      kyc: 'Verified',
      previousAlerts: 4,
      riskLevel: 'Critical',
      riskPercent: 97
    },
    transactions: [
      { id: 'TX-99081', date: 'Just now', amount: '$2,500,000.00', type: 'SWIFT Transfer', status: 'Flagged', description: 'Large offshore transfer to Swiss accounts.' },
      { id: 'TX-98921', date: '3 hours ago', amount: '$1,800,000.00', type: 'Wire Transfer', status: 'Flagged', description: 'Intra-group liquidity allocation.' },
      { id: 'TX-98442', date: '2 days ago', amount: '$45,000.00', type: 'ACH Transfer', status: 'Cleared', description: 'Utility and server infrastructure payment.' },
      { id: 'TX-98011', date: '5 days ago', amount: '$120,000.00', type: 'SWIFT Transfer', status: 'Cleared', description: 'Consulting fees retainer.' }
    ],
    behaviourTimeline: [
      { time: '19:45:12', event: 'SWIFT transfer value exceeds historical standard deviation by 4.8x', anomalyScore: 94.7, severity: 'critical' },
      { time: '19:42:05', event: 'Dual login from offshore proxy node and domestic location within 10 mins', anomalyScore: 89.2, severity: 'critical' },
      { time: '18:12:00', event: 'Frequency of high-value wires spikes in off-market hours', anomalyScore: 71.0, severity: 'warning' },
      { time: 'Yesterday', event: 'Standard operating ledger reconciliation', anomalyScore: 12.5, severity: 'normal' }
    ],
    aiSummary: {
      executive: 'Nexus Corp LLC is a Cayman-registered corporate entity executing structured SWIFT routing loops to transfer large funds ($2.5M) to Zurich trusts. The behavior matches layered money laundering. GNN classifies it as a money mule with 97% probability.',
      behaviour: 'Velocity vectors indicate a 480% increase in outflow frequency during off-market bank hours. The timing gaps between source inflow and outward Swiss wires are under 12 minutes, indicative of structured pass-through accounts.',
      graph: 'Topological GNN routing highlights a 1-hop link to OFAC sanctioned shell companies in the Cayman Islands. Louvain community clustering identifies this entity in Cluster 092, which holds an average risk density of 88.5%.',
      evidence: [
        'UBO identity hidden behind proxy trust agents.',
        'Structured rapid transfer sequence matching money mule cycles.',
        'High PageRank centrality in risk-weighted transaction paths.',
        'Active VPN usage from blocklisted offshore ISP ranges.'
      ],
      recommendation: 'Escalate case to Federal Financial Crimes Enforcement Network (FinCEN). Approve filing of Suspicious Transaction Report (STR/SAR).'
    },
    flow: {
      nodes: [
        { id: '1', type: 'account', data: { id: 'ACC-884291', label: 'Nexus Corp LLC', role: 'Target (Cayman)', risk: 97 }, position: { x: 250, y: 150 } },
        { id: '2', type: 'account', data: { id: 'ACC-774821', label: 'Orion Capital AG', role: 'Intermediary (Zurich)', risk: 74 }, position: { x: 100, y: 300 } },
        { id: '3', type: 'account', data: { id: 'ACC-992144', label: 'Al-Zamil Trust', role: 'OFAC Watchlist Node', risk: 99 }, position: { x: 400, y: 300 } },
        { id: '4', type: 'account', data: { id: 'ACC-441829', label: 'Zurich Nominee Ltd', role: 'End Receiver (Swiss)', risk: 91 }, position: { x: 250, y: 450 } }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', label: '$2.5M SWIFT', animated: true, style: { stroke: '#FF6B6B' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },
        { id: 'e1-3', source: '1', target: '3', label: '$1.8M Wire', animated: true, style: { stroke: '#FF6B6B' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },
        { id: 'e2-4', source: '2', target: '4', label: '$2.2M Transfer', animated: true, style: { stroke: '#F6A623' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F6A623' } },
        { id: 'e3-4', source: '3', target: '4', label: '$1.5M Transfer', animated: true, style: { stroke: '#FF6B6B' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } }
      ]
    }
  },
  'Orion Capital AG': {
    id: 'CAS-2026-000189',
    profile: {
      name: 'Orion Capital AG',
      occupation: 'Trust Agency / Investment Services',
      kyc: 'Verified',
      previousAlerts: 1,
      riskLevel: 'Warning',
      riskPercent: 74
    },
    transactions: [
      { id: 'TX-98921', date: '3 hours ago', amount: '$1,800,000.00', type: 'Wire Transfer', status: 'Flagged', description: 'Intra-group liquidity allocation.' },
      { id: 'TX-98011', date: '5 days ago', amount: '$120,000.00', type: 'SWIFT Transfer', status: 'Cleared', description: 'Consulting fees retainer.' }
    ],
    behaviourTimeline: [
      { time: '18:12:00', event: 'High-value wire matching incoming shell deposit within 20 mins', anomalyScore: 71.2, severity: 'warning' },
      { time: 'Yesterday', event: 'Account profile update: Authorized signatory modified', anomalyScore: 45.0, severity: 'normal' }
    ],
    aiSummary: {
      executive: 'Orion Capital AG acts as a conduit/trust agency routing Cayman shell deposits into Swiss nominee accounts. Though KYC checks are verified, GNN highlights high flow-through connectivity with OFAC matching nodes.',
      behaviour: 'The transaction velocity is low but transfer amounts are extremely high (average value >$500k). Transitive cycles show funds are recycled to secondary offshore brokers.',
      graph: 'Direct linkages are identified within Cluster 092. The GNN attention weights flag Zurich Nominees as high-risk receivers.',
      evidence: [
        'Linkage with OFAC suspect nodes via Al-Zamil Trust.',
        'High value to flow ratio.',
        'Frequent changes in corporate directors.'
      ],
      recommendation: 'Escalate to Senior Compliance Manager. Request ultimate beneficiary clarification from Orion legal team.'
    },
    flow: {
      nodes: [
        { id: '1', type: 'account', data: { id: 'ACC-774821', label: 'Orion Capital AG', role: 'Target (Zurich)', risk: 74 }, position: { x: 250, y: 150 } },
        { id: '2', type: 'account', data: { id: 'ACC-441829', label: 'Zurich Nominee Ltd', role: 'Swiss Trust Receiver', risk: 91 }, position: { x: 150, y: 300 } },
        { id: '3', type: 'account', data: { id: 'ACC-552840', label: 'Meridian Trading', role: 'UAE Trade Broker', risk: 62 }, position: { x: 350, y: 300 } }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', label: '$2.2M Wire', animated: true, style: { stroke: '#F6A623' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F6A623' } },
        { id: 'e1-3', source: '1', target: '3', label: '$950K Fedwire', animated: true, style: { stroke: '#63B3ED' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#63B3ED' } }
      ]
    }
  },
  'Raghav Maheshwari': {
    id: 'CAS-2026-000104',
    profile: {
      name: 'Raghav Maheshwari',
      occupation: 'Software Engineer',
      kyc: 'Verified',
      previousAlerts: 0,
      riskLevel: 'Low',
      riskPercent: 12
    },
    transactions: [
      { id: 'TX-98442', date: '2 days ago', amount: '$2,500.00', type: 'ACH Transfer', status: 'Cleared', description: 'Monthly salary credit deposit.' },
      { id: 'TX-98001', date: '7 days ago', amount: '$450.00', type: 'ACH Transfer', status: 'Cleared', description: 'Utility Gas & Power payment.' }
    ],
    behaviourTimeline: [
      { time: '16:15:00', event: 'Regular monthly salary deposit received', anomalyScore: 5.2, severity: 'normal' },
      { time: '12:00:00', event: 'Card transaction at local grocery merchant', anomalyScore: 2.1, severity: 'normal' }
    ],
    aiSummary: {
      executive: 'Raghav Maheshwari is a retail checking customer with standard W2 salary deposits. No anomalous money flow routes or suspect community connections have been flagged.',
      behaviour: 'Transaction sizes, timing distribution, and merchant category codes map entirely to typical consumer spend profiles.',
      graph: 'GNN nodes are isolated from risk neighbors. Modularity scores are standard with local domestic checkings clusters.',
      evidence: [
        'Cleared KYC matches.',
        'W2 paycheck source verification.',
        'Device and IP match registered home address.'
      ],
      recommendation: 'Auto-dismiss case. Flag transaction as typical consumer profile activity.'
    },
    flow: {
      nodes: [
        { id: '1', type: 'account', data: { id: 'ACC-110294', label: 'Raghav Maheshwari', role: 'Target (Personal)', risk: 12 }, position: { x: 250, y: 150 } },
        { id: '2', type: 'account', data: { id: 'ACC-UTILITY', label: 'Power & Gas Utility', role: 'Billing Merchant', risk: 2 }, position: { x: 250, y: 300 } }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', label: '$450 ACH', animated: false, style: { stroke: '#52B788' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52B788' } }
      ]
    }
  }
};

export const Dashboard: React.FC = () => {
  const [activeEntityName, setActiveEntityName] = useState<string>('Nexus Corp LLC');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<number | null>(null);

  const activeCase = entityData[activeEntityName];

  // Sync React Flow nodes and edges when the active case changes
  useEffect(() => {
    setNodes(activeCase.flow.nodes);
    setEdges(activeCase.flow.edges);
  }, [activeEntityName, setNodes, setEdges]);

  // Load newly ingested transaction from local storage if it matches the name
  useEffect(() => {
    try {
      const storedCaseStr = localStorage.getItem('vigilnet_new_case');
      if (storedCaseStr) {
        const storedCase = JSON.parse(storedCaseStr);
        const name = storedCase.title.split(' → ')[0];

        // If the newly created case is in our list, switch to it
        if (entityData[name]) {
          setActiveEntityName(name);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'text-[#FF6B6B]';
      case 'Warning':
        return 'text-[#F6A623]';
      default:
        return 'text-[#52B788]';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-[#2D0F0F] border-[#FF6B6B]/20';
      case 'Warning':
        return 'bg-[#2A2010] border-[#F6A623]/20';
      default:
        return 'bg-[#1A2D24] border-[#52B788]/20';
    }
  };

  const handleAction = (type: string) => {
    alert(`Analyst Action: Case ${activeCase.id} updated with state "${type}".`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0C0F] text-[#E8EBF0] overflow-hidden">

      {/* Dashboard Sub-Header / Case Entity Switcher */}
      <div className="p-4 border-b border-[#1E2535] bg-[#0F1217] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div className="space-y-1">
          <h1 className="text-[16px] font-bold text-[#E8EBF0] tracking-[-0.01em] flex items-center gap-1.5 uppercase font-mono">
            <Cpu size={15} className="text-[#2B6CB0]" />
            AI AML Investigator Center
          </h1>
          <p className="text-[10px] text-[#8C95A8]">
            Palantir Foundry-style visual workbench running graph embeddings and behavioral analysis.
          </p>
        </div>

        {/* Entity Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#4A5568] uppercase font-bold">Investigation Target:</span>
          <select
            value={activeEntityName}
            onChange={(e) => setActiveEntityName(e.target.value)}
            className="bg-[#141820] border border-[#1E2535] rounded-[4px] px-3 h-[30px] text-[11px] text-[#E8EBF0] font-bold outline-none cursor-pointer hover:border-[#2B6CB0] transition-colors"
          >
            {Object.keys(entityData).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 4-Section Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

        {/* LEFT COLUMN (lg:col-span-3): Section 1 & Section 2 */}
        <div className="lg:col-span-3 border-r border-[#1E2535] flex flex-col min-w-0 overflow-y-auto divide-y divide-[#1E2535]/30">

          {/* SECTION 1: CUSTOMER PROFILE */}
          <div className="p-4.5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1E2535]/50 pb-2">
              <User size={13} className="text-[#2B6CB0]" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.03em]">Section 1: Customer Profile</h2>
            </div>

            <div className="space-y-3 text-[11px]">
              <div>
                <span className="text-[#4A5568] text-[9px] uppercase font-semibold block mb-0.5">Account Name</span>
                <span className="text-[#E8EBF0] font-bold text-[13px]">{activeCase.profile.name}</span>
              </div>

              <div>
                <span className="text-[#4A5568] text-[9px] uppercase font-semibold block mb-0.5">Occupation / Business</span>
                <span className="text-[#E8EBF0]">{activeCase.profile.occupation}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div>
                  <span className="text-[#4A5568] text-[8px] uppercase block mb-0.5">KYC Check</span>
                  <span className="bg-[#1A2D24] text-[#52B788] border border-[rgba(82,183,136,0.15)] text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                    {activeCase.profile.kyc}
                  </span>
                </div>
                <div>
                  <span className="text-[#4A5568] text-[8px] uppercase block mb-0.5">Alert History</span>
                  <span className={`text-[10px] font-bold ${activeCase.profile.previousAlerts > 0 ? 'text-[#F6A623]' : 'text-[#8C95A8]'}`}>
                    {activeCase.profile.previousAlerts} alerts match
                  </span>
                </div>
              </div>

              <div className={`p-2.5 rounded-[4px] border ${getRiskBg(activeCase.profile.riskLevel)} flex items-center justify-between`}>
                <div>
                  <span className="text-[#8C95A8] text-[8.5px] uppercase font-bold block">GNN Classifier Risk</span>
                  <span className={`text-[12px] font-bold font-mono ${getRiskColor(activeCase.profile.riskLevel)}`}>
                    {activeCase.profile.riskLevel}
                  </span>
                </div>
                <span className={`text-[20px] font-black font-mono leading-none ${getRiskColor(activeCase.profile.riskLevel)}`}>
                  {activeCase.profile.riskPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: TRANSACTION & BEHAVIOUR TIMELINES */}
          <div className="p-4.5 space-y-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 border-b border-[#1E2535]/50 pb-2 flex-shrink-0">
              <Activity size={13} className="text-[#2B6CB0]" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.03em]">Section 2: Timeline Telemetry</h2>
            </div>

            {/* Sub-section: Behaviour Timeline */}
            <div className="space-y-2 flex-shrink-0">
              <span className="text-[#4A5568] text-[8.5px] uppercase font-bold block tracking-wider">Behaviour Anomaly events</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {activeCase.behaviourTimeline.map((evt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTimelineEvent(selectedTimelineEvent === idx ? null : idx)}
                    className={`p-2 rounded border cursor-pointer transition-colors ${evt.severity === 'critical' ? 'bg-[#2D0F0F]/30 border-[#FF6B6B]/20 hover:bg-[#2D0F0F]/50' :
                        evt.severity === 'warning' ? 'bg-[#2A2010]/30 border-[#F6A623]/20 hover:bg-[#2A2010]/50' :
                          'bg-[#141820]/30 border-[#1E2535] hover:bg-[#141820]/50'
                      }`}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono mb-1">
                      <span className="text-[#8C95A8] flex items-center gap-1">
                        <Clock size={10} />
                        {evt.time}
                      </span>
                      <span className={`font-bold ${evt.severity === 'critical' ? 'text-[#FF6B6B]' :
                          evt.severity === 'warning' ? 'text-[#F6A623]' :
                            'text-[#52B788]'
                        }`}>
                        {evt.anomalyScore}% Dev
                      </span>
                    </div>
                    <p className="text-[10px] text-[#E8EBF0] leading-[1.3] line-clamp-2">
                      {evt.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-section: Recent Transactions List */}
            <div className="flex-1 flex flex-col min-h-0 space-y-2 pt-2">
              <span className="text-[#4A5568] text-[8.5px] uppercase font-bold block tracking-wider">Recent Ledgers</span>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {activeCase.transactions.map((tx) => (
                  <div key={tx.id} className="p-2 bg-[#141820]/30 border border-[#1E2535] rounded text-[10px]">
                    <div className="flex justify-between items-center font-mono">
                      <span className="text-[#63B3ED] font-semibold">{tx.id}</span>
                      <span className="text-[#8C95A8]">{tx.date}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[#E8EBF0] font-bold font-mono">{tx.amount}</span>
                      <span className={`text-[8.5px] font-mono uppercase px-1 rounded ${tx.status === 'Flagged' ? 'bg-[#2D0F0F] text-[#FF6B6B] border border-[#FF6B6B]/20' : 'bg-[#1A2D24] text-[#52B788]'
                        }`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-[9px] text-[#8C95A8] mt-1 leading-[1.3] truncate">
                      {tx.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN (lg:col-span-5): Section 3 */}
        <div className="lg:col-span-5 border-r border-[#1E2535] flex flex-col min-w-0 overflow-hidden relative">

          {/* Section 3 Header */}
          <div className="p-4 border-b border-[#1E2535] bg-[#0F1217] flex-shrink-0 flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-2">
              <Network size={14} className="text-[#2B6CB0]" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.03em]">Section 3: Interactive Network Flow</h2>
            </div>

            <div className="flex items-center gap-2 text-[9px] font-mono text-[#8C95A8] bg-[#141820] border border-[#1E2535] px-2 py-1 rounded">
              <Layers size={10} className="text-[#FF6B6B]" />
              <span>LOUVAIN COMMUNITY CLUSTER: 092</span>
            </div>
          </div>

          {/* Interactive Graph Canvas utilizing React Flow */}
          <div className="flex-1 bg-[#0A0C0F] relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-right"
              className="font-sans"
            >
              <Background color="#1E2535" gap={16} size={1} />
              <Controls className="bg-[#141820] border border-[#1E2535] text-[#E8EBF0] fill-white rounded shadow-2xl [&_button]:border-[#1E2535] [&_button]:bg-transparent [&_button:hover]:bg-[#1E2535]" />
              <MiniMap
                nodeColor={(node) => {
                  if (node.data?.risk >= 80) return '#FF6B6B';
                  if (node.data?.risk >= 50) return '#F6A623';
                  return '#52B788';
                }}
                nodeBorderRadius={3}
                maskColor="rgba(10, 12, 15, 0.7)"
                className="bg-[#0F1217] border border-[#1E2535] rounded"
              />
            </ReactFlow>
          </div>

          {/* Legend and graph statistics */}
          <div className="p-3 border-t border-[#1E2535] bg-[#0F1217] grid grid-cols-3 gap-2 text-[10px] text-[#8C95A8] font-mono flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#FF6B6B]" />
              <span>Sanction / Mule Node</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#F6A623]" />
              <span>Warning Conduit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#52B788]" />
              <span>Clean / Normal Node</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (lg:col-span-4): Section 4 */}
        <div className="lg:col-span-4 flex flex-col min-w-0 overflow-hidden bg-[#0F1217]/40">

          {/* Section 4 Header */}
          <div className="p-4 border-b border-[#1E2535] bg-[#0F1217] flex-shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-[#2B6CB0]" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.03em]">Section 4: AI Copilot Audit Report</h2>
            </div>
            <span className="bg-[#1A2A3F] border border-[rgba(99,179,237,0.2)] rounded px-1.5 py-0.5 text-[9px] text-[#63B3ED] font-mono">
              VIGIL-LLM v3
            </span>
          </div>

          {/* Audit report contents (scrollable) */}
          <div className="flex-1 overflow-y-auto p-4.5 space-y-4 text-[11px] leading-[1.5]">

            {/* Executive Summary */}
            <div className="space-y-1.5 bg-[#141820]/40 border border-[#1E2535] p-3 rounded">
              <span className="text-[#63B3ED] font-bold uppercase text-[9px] tracking-wider block">Executive Summary</span>
              <p className="text-[#E8EBF0]">
                {activeCase.aiSummary.executive}
              </p>
            </div>

            {/* Behaviour Findings */}
            <div className="space-y-1.5 border-l-2 border-[#F6A623] pl-3 py-0.5">
              <span className="text-[#F6A623] font-bold uppercase text-[9px] tracking-wider block">Behavioural Anomaly Findings</span>
              <p className="text-[#8C95A8]">
                {activeCase.aiSummary.behaviour}
              </p>
            </div>

            {/* Graph Findings */}
            <div className="space-y-1.5 border-l-2 border-[#FF6B6B] pl-3 py-0.5">
              <span className="text-[#FF6B6B] font-bold uppercase text-[9px] tracking-wider block">Graph Neural Net topological Findings</span>
              <p className="text-[#8C95A8]">
                {activeCase.aiSummary.graph}
              </p>
            </div>

            {/* Critical Evidence Bullet Points */}
            <div className="space-y-2 bg-[#1A2030]/20 border border-[#1E2535] p-3 rounded">
              <span className="text-[#E8EBF0] font-bold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                <AlertCircle size={11} className="text-[#63B3ED]" />
                Compiled Evidence List
              </span>
              <ul className="space-y-1.5 pl-3 list-disc text-[#8C95A8] text-[10.5px]">
                {activeCase.aiSummary.evidence.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* AI Recommendation */}
            <div className="space-y-2 p-3 border rounded bg-[#2D0F0F]/30 border-[#FF6B6B]/20">
              <span className="text-[#FF6B6B] font-bold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                <ShieldAlert size={11} />
                Strategic Recommendation
              </span>
              <p className="text-[#E8EBF0] font-medium leading-[1.4]">
                {activeCase.aiSummary.recommendation}
              </p>
            </div>

          </div>

          {/* Action Buttons Footer */}
          <div className="p-4 border-t border-[#1E2535] bg-[#0F1217] flex-shrink-0 space-y-3.5">
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('Approve STR')}
                className="flex-1 bg-[#2D0F0F] hover:bg-[#3D1414] border border-[#FF6B6B]/30 hover:border-[#FF6B6B]/60 text-[#FF6B6B] text-[10.5px] font-bold py-2 rounded-[4px] cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldAlert size={12} />
                <span>Approve STR</span>
              </button>

              <button
                onClick={() => handleAction('False Positive')}
                className="flex-1 bg-[#1A2D24] hover:bg-[#233C30] border border-[#52B788]/30 hover:border-[#52B788]/60 text-[#52B788] text-[10.5px] font-bold py-2 rounded-[4px] cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle size={12} />
                <span>False Positive</span>
              </button>
            </div>

            <button
              onClick={() => handleAction('Need More Investigation')}
              className="w-full bg-[#1A2A3F] hover:bg-[#233854] border border-[rgba(99,179,237,0.2)] hover:border-[#2B6CB0] text-[#63B3ED] text-[10.5px] font-bold py-2 rounded-[4px] cursor-pointer flex items-center justify-center gap-1 transition-all"
            >
              <span>Request Additional Graph Inspections</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
