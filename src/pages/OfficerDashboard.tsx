import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Search,
  ShieldAlert,
  Send,
  Check
} from 'lucide-react';

interface OfficerReport {
  id: string;
  caseId: string;
  subjectName: string;
  volume: string;
  analyst: string;
  dateEscalated: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reasonForSuspicion: string;
  analystNotes: string;
  officerComments?: string;
}

const initialReports: OfficerReport[] = [
  {
    id: 'STR-2026-F8821',
    caseId: 'CAS-2026-000241',
    subjectName: 'Nexus Corp LLC',
    volume: '$2,500,000.00',
    analyst: 'Raghav Maheshwari',
    dateEscalated: '2026-06-27 19:48',
    status: 'Pending',
    reasonForSuspicion: 'The transaction represents a structured layering sequence. Funds received from offshore accounts were structured and layered through international correspondent banks without any clear commercial rationale, matching organized money mule laundering profiles.',
    analystNotes: 'High-risk GNN match linked with offshore shell corporations in Cluster 092. Freezing of assets suggested.',
    officerComments: ''
  },
  {
    id: 'STR-2026-F8799',
    caseId: 'CAS-2026-000189',
    subjectName: 'Orion Capital AG',
    volume: '$4,280,000.00',
    analyst: 'Raghav Maheshwari',
    dateEscalated: '2026-06-27 18:31',
    status: 'Pending',
    reasonForSuspicion: 'Entity acts as conduit routing Cayman shell deposits into Swiss nominee accounts. GNN highlights high flow-through connectivity with OFAC matching nodes.',
    analystNotes: 'Topological connectivity is extremely high, and PEP flag is active.',
    officerComments: ''
  },
  {
    id: 'STR-2026-F8102',
    caseId: 'CAS-2026-000094',
    subjectName: 'Meridian Trading UAE',
    volume: '$890,000.00',
    analyst: 'Auto-Agent (Level 1)',
    dateEscalated: '2026-06-25 12:15',
    status: 'Approved',
    reasonForSuspicion: 'Structured import/export invoices detailing trades with high-risk jurisdiction brokers. Funds cleared same-day.',
    analystNotes: 'Auto-escalated based on invoice mismatch telemetry.',
    officerComments: 'Filing confirmed with FinCEN on 2026-06-26. Reference ID: FIN-SAR-99120.'
  },
  {
    id: 'STR-2026-F7901',
    caseId: 'CAS-2026-000052',
    subjectName: 'Global Logistics Corp',
    volume: '$12,000.00',
    analyst: 'Jane Doe',
    dateEscalated: '2026-06-20 09:30',
    status: 'Rejected',
    reasonForSuspicion: 'Multiple cash withdrawals from ATMs in high-risk border regions.',
    analystNotes: 'Flagged manually during standard audit.',
    officerComments: 'Returned for correction. Withdrawals match verified crew travel expenses. Check corporate registry.'
  }
];

export const OfficerDashboard: React.FC = () => {
  const [reports, setReports] = useState<OfficerReport[]>(initialReports);
  const [selectedReportId, setSelectedReportId] = useState<string>('STR-2026-F8821');
  const [activeQueueTab, setActiveQueueTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Officer Input States
  const [commentInput, setCommentInput] = useState('');
  const [commentsLog, setCommentsLog] = useState<Record<string, string[]>>({});

  // Sync with newly submitted STR from local storage if exists
  useEffect(() => {
    try {
      const submittedFlag = localStorage.getItem('vigilnet_str_submitted');
      const storedCaseStr = localStorage.getItem('vigilnet_new_case');
      if (submittedFlag === 'true' && storedCaseStr) {
        const storedCase = JSON.parse(storedCaseStr);
        const name = storedCase.title.split(' → ')[0];

        // Add new pending item to the top
        const newReport: OfficerReport = {
          id: 'STR-2026-F8821', // Reuse standard ID or generate
          caseId: storedCase.id,
          subjectName: name,
          volume: storedCase.volume,
          analyst: 'Raghav Maheshwari',
          dateEscalated: 'Just now',
          status: 'Pending',
          reasonForSuspicion: `The transaction of ${storedCase.volume} represents a layered wire path. Source account is linked to suspected mule clusters.`,
          analystNotes: 'Ingested via online API and pushed to STR filing queue.',
          officerComments: ''
        };

        setReports(prev => {
          if (prev.some(r => r.caseId === newReport.caseId)) {
            return prev;
          }
          return [newReport, ...prev];
        });
        setSelectedReportId(newReport.id);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleApprove = (id: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Approved',
          officerComments: commentInput || 'Report approved and signed for regulatory submission.'
        };
      }
      return r;
    }));
    setCommentInput('');
    alert(`STR Report ${id} approved and signed for FinCEN dispatch.`);
  };

  const handleReject = (id: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Rejected',
          officerComments: commentInput || 'Report rejected. Returned to analyst for further investigation.'
        };
      }
      return r;
    }));
    setCommentInput('');
    alert(`STR Report ${id} returned to analyst.`);
  };

  const handleAddComment = (id: string) => {
    if (!commentInput.trim()) return;
    setCommentsLog(prev => {
      const logs = prev[id] || [];
      return {
        ...prev,
        [id]: [...logs, commentInput.trim()]
      };
    });
    setCommentInput('');
  };

  const filteredReports = reports.filter(r => {
    const matchesTab = r.status === activeQueueTab;
    const matchesSearch = r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.analyst.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: OfficerReport['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-[#1A2D24] text-[#52B788] border-green-900/30';
      case 'Rejected':
        return 'bg-[#2D0F0F] text-[#FF6B6B] border-red-900/30';
      case 'Pending':
      default:
        return 'bg-[#2A2010] text-[#F6A623] border-[#F6A623]/20';
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0A0C0F]">

      {/* LEFT COLUMN (45% Width): Review Queue & Metrics */}
      <div className="w-[360px] flex flex-col border-r border-[#1E2535] bg-[#0F1217] flex-shrink-0 min-w-0">

        {/* Header Toolbar */}
        <div className="p-4 border-b border-[#1E2535] space-y-3.5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-[13px] font-bold text-[#E8EBF0] uppercase tracking-[0.03em] font-mono flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-[#2B6CB0]" />
              Officer STR Triage
            </h1>
            <span className="text-[9px] bg-[#141820] border border-[#1E2535] rounded px-2 py-0.5 text-[#8C95A8] font-mono">
              ROLE: OFFICER
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-[#2A2010]/30 border border-[#F6A623]/10 p-1.5 rounded">
              <span className="text-[#8C95A8] text-[8px] block uppercase">Pending</span>
              <span className="text-[12px] font-bold text-[#F6A623]">
                {reports.filter(r => r.status === 'Pending').length}
              </span>
            </div>
            <div className="bg-[#1A2D24]/30 border border-[#52B788]/10 p-1.5 rounded">
              <span className="text-[#8C95A8] text-[8px] block uppercase">Approved</span>
              <span className="text-[12px] font-bold text-[#52B788]">
                {reports.filter(r => r.status === 'Approved').length}
              </span>
            </div>
            <div className="bg-[#2D0F0F]/30 border border-[#FF6B6B]/10 p-1.5 rounded">
              <span className="text-[#8C95A8] text-[8px] block uppercase">Returned</span>
              <span className="text-[12px] font-bold text-[#FF6B6B]">
                {reports.filter(r => r.status === 'Rejected').length}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex items-center bg-[#141820] border border-[#1E2535] rounded-[4px] px-2.5 h-[30px]">
            <Search size={12} className="text-[#4A5568] mr-2" />
            <input
              type="text"
              placeholder="Search suspect, STR code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] text-[#E8EBF0] placeholder-[#4A5568] w-full"
            />
          </div>
        </div>

        {/* Tab Headers: Pending, Approved, Rejected */}
        <div className="flex border-b border-[#1E2535]/50 bg-[#0F1217] select-none text-[10px] uppercase font-bold tracking-wider flex-shrink-0">
          {(['Pending', 'Approved', 'Rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveQueueTab(tab)}
              className={`flex-1 py-2.5 border-b-2 text-center transition-all cursor-pointer ${activeQueueTab === tab
                  ? 'text-[#E8EBF0] border-[#2B6CB0] bg-[#141820]/30'
                  : 'text-[#4A5568] border-transparent hover:text-[#8C95A8]'
                }`}
            >
              {tab} Queue
            </button>
          ))}
        </div>

        {/* STR list queue */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#1E2535]/30">
          {filteredReports.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedReportId(item.id)}
              className={`p-3.5 cursor-pointer transition-colors flex justify-between items-start gap-4 ${selectedReportId === item.id ? 'bg-[#141820]' : 'hover:bg-[#141820]/30'
                }`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-semibold text-[#63B3ED]">
                    {item.id}
                  </span>
                  <span className={`text-[8.5px] font-mono font-bold px-1.5 py-[0.5px] rounded border uppercase ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-[12px] font-bold text-[#E8EBF0] truncate">
                  {item.subjectName}
                </h3>
                <div className="flex items-center gap-1.5 text-[9.5px] text-[#8C95A8]">
                  <span>By {item.analyst}</span>
                  <span className="text-[#1E2535]">•</span>
                  <span>{item.dateEscalated}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0 font-mono text-[11px] font-bold text-[#E8EBF0]">
                {item.volume}
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="p-8 text-center text-[#4A5568] uppercase font-bold text-[9px] tracking-wider">
              No reports in this queue.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN (55% Width): Preview Panel & Auditor Actions */}
      <div className="flex-1 flex flex-col bg-[#0A0C0F] overflow-hidden">
        {selectedReport ? (
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Preview Panel Header */}
            <div className="p-4.5 border-b border-[#1E2535] bg-[#0F1217] flex-shrink-0 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-[#4A5568] uppercase font-bold block">Document Review Preview</span>
                <h2 className="text-[13px] font-bold text-[#E8EBF0] flex items-center gap-1.5 uppercase font-mono">
                  <FileText size={14} className="text-[#2B6CB0]" />
                  {selectedReport.id}
                </h2>
              </div>

              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getStatusBadge(selectedReport.status)}`}>
                {selectedReport.status}
              </span>
            </div>

            {/* Document Preview Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-[11px] leading-[1.5]">

              {/* Part 1: Subject Profile Summary */}
              <div className="bg-[#0F1217] border border-[#1E2535] rounded p-4 space-y-2.5">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#63B3ED] border-b border-[#1E2535] pb-1.5">
                  Subject Profile Summary
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="text-[#4A5568] text-[8.5px] uppercase block mb-0.5">Subject Legal Entity</span>
                    <span className="text-[#E8EBF0] font-bold">{selectedReport.subjectName}</span>
                  </div>
                  <div>
                    <span className="text-[#4A5568] text-[8.5px] uppercase block mb-0.5">Associated Case</span>
                    <span className="text-[#E8EBF0] font-mono">{selectedReport.caseId}</span>
                  </div>
                  <div>
                    <span className="text-[#4A5568] text-[8.5px] uppercase block mb-0.5">Report Volume</span>
                    <span className="text-[#FF6B6B] font-bold font-mono">{selectedReport.volume}</span>
                  </div>
                  <div>
                    <span className="text-[#4A5568] text-[8.5px] uppercase block mb-0.5">Escalated Analyst</span>
                    <span className="text-[#E8EBF0]">{selectedReport.analyst}</span>
                  </div>
                </div>
              </div>

              {/* Part 2: Reason for Suspicion (Narrative) */}
              <div className="space-y-1.5">
                <span className="text-[#4A5568] font-bold uppercase text-[8.5px] tracking-wider block">Reason for Suspicion (Filing Narrative)</span>
                <p className="text-[#E8EBF0] bg-[#141820]/40 border border-[#1E2535] rounded p-3 leading-[1.6]">
                  {selectedReport.reasonForSuspicion}
                </p>
              </div>

              {/* Part 3: Analyst Intake Comments */}
              <div className="space-y-1.5">
                <span className="text-[#4A5568] font-bold uppercase text-[8.5px] tracking-wider block">Analyst Investigation Notes</span>
                <p className="text-[#8C95A8] border-l-2 border-[#2B6CB0] pl-3 py-0.5">
                  {selectedReport.analystNotes}
                </p>
              </div>

              {/* Part 4: Officer Comments Log (Historical Trail) */}
              {(selectedReport.officerComments || (commentsLog[selectedReport.id] && commentsLog[selectedReport.id].length > 0)) && (
                <div className="bg-[#1A2030]/20 border border-[#1E2535] rounded p-4 space-y-2">
                  <span className="text-[#E8EBF0] font-bold uppercase text-[8.5px] tracking-wider block flex items-center gap-1">
                    <MessageSquare size={11} className="text-[#63B3ED]" />
                    Auditor Decision & Log Comments
                  </span>

                  <div className="space-y-2.5">
                    {selectedReport.officerComments && (
                      <div className="text-[10.5px]">
                        <span className="text-[#4A5568] font-bold font-mono block">FINAL RESOLUTION VERDICT:</span>
                        <p className="text-[#E8EBF0] leading-[1.4] mt-0.5">{selectedReport.officerComments}</p>
                      </div>
                    )}

                    {commentsLog[selectedReport.id]?.map((cmt, idx) => (
                      <div key={idx} className="text-[10px] pt-1.5 border-t border-[#1E2535]/30">
                        <span className="text-[#8C95A8] font-mono block">Officer Comment (Draft Log):</span>
                        <p className="text-[#E8EBF0] italic leading-[1.4] mt-0.5">"{cmt}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Officer Decisions Panel Footer */}
            <div className="p-4 border-t border-[#1E2535] bg-[#0F1217] flex-shrink-0 space-y-3.5">

              {/* Comments Box */}
              <div className="space-y-1.5">
                <label className="text-[#4A5568] font-bold uppercase text-[9px] block">Officer Comments & Directives</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter audit logs, instructions, or resolution notes..."
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    className="flex-1 bg-[#141820] border border-[#1E2535] rounded px-3 py-1.5 text-[11px] text-[#E8EBF0] outline-none focus:border-[#2B6CB0]"
                  />
                  <button
                    onClick={() => handleAddComment(selectedReport.id)}
                    className="bg-[#141820] hover:bg-[#1E2535] border border-[#1E2535] px-3.5 text-[#8C95A8] hover:text-[#E8EBF0] text-[11px] font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send size={12} />
                    <span>Comment</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-1">
                <button
                  onClick={() => handleReject(selectedReport.id)}
                  disabled={selectedReport.status !== 'Pending'}
                  className="px-4.5 py-2 border border-[#FF6B6B]/30 hover:border-[#FF6B6B]/60 text-[#FF6B6B] hover:bg-[#2D0F0F]/30 disabled:opacity-40 disabled:hover:border-[#FF6B6B]/30 disabled:hover:bg-transparent text-[11px] font-bold rounded-[4px] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <XCircle size={13} />
                  <span>Reject & Return</span>
                </button>

                <button
                  onClick={() => handleApprove(selectedReport.id)}
                  disabled={selectedReport.status !== 'Pending'}
                  className="px-5 py-2 bg-[#2B6CB0] hover:bg-[#3182CE] disabled:bg-[#1A2D24] disabled:text-[#52B788] text-white text-[11px] font-bold rounded-[4px] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {selectedReport.status === 'Approved' ? (
                    <>
                      <Check size={13} />
                      <span>Filing Approved</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={13} />
                      <span>Sign & Approve Submission</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#4A5568] space-y-2.5">
            <ShieldAlert size={28} />
            <span className="text-[11px] uppercase tracking-wider font-semibold">Select an STR from the queue to review</span>
          </div>
        )}
      </div>

    </div>
  );
};
