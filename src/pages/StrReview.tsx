import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Send,
  User,
  Activity,
  Network,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  Edit3,
  Clock,
  Briefcase
} from 'lucide-react';

interface StrReport {
  reportId: string;
  caseId: string;
  creationDate: string;
  reportingOfficer: string;
  riskPercent: number;
  customerDetails: {
    name: string;
    accountNumber: string;
    occupation: string;
    kycStatus: string;
    jurisdiction: string;
    uboDetails: string;
  };
  transactionSummary: {
    volume: string;
    method: string;
    destination: string;
    dates: string;
  };
  behaviourAnalysis: string;
  graphAnalysis: string;
  evidenceList: string;
  reasonForSuspicion: string;
  aiRecommendation: string;
}

const defaultReport: StrReport = {
  reportId: 'STR-2026-F8821',
  caseId: 'CAS-2026-000241',
  creationDate: '2026-06-27 19:48:00',
  reportingOfficer: 'Raghav Maheshwari (Lead Analyst)',
  riskPercent: 97,
  customerDetails: {
    name: 'Nexus Corp LLC',
    accountNumber: 'ACC-884291',
    occupation: 'Corporate Shell / Offshore Holding',
    kycStatus: 'Verified (Level 3 Registry)',
    jurisdiction: 'Cayman Islands',
    uboDetails: 'Restricted Trust Agents (George Town nominees)'
  },
  transactionSummary: {
    volume: '$2,500,000.00',
    method: 'SWIFT Wire Transfer',
    destination: 'Orion Capital AG -> Zurich Nominees (Switzerland)',
    dates: '2026-06-27'
  },
  behaviourAnalysis: 'Inflow of $2.5M was immediately structured and dispatched to offshore accounts in Switzerland within 12 minutes. The activity is 4.8 standard deviations above the historical account average.',
  graphAnalysis: 'GNN features detect a 1-hop relation to OFAC watchlisted entities (Al-Zamil Trust). Louvain community detection places this account in cluster 092, presenting an average community risk of 88.5%. Modularity score is 0.72.',
  evidenceList: '1. Hidden Beneficial Owner structure.\n2. Pass-through sequence velocity anomaly.\n3. Cayman shell proxy routing.\n4. VPN active network signature.',
  reasonForSuspicion: 'The transaction represents a textbook layering sequence. Funds received from offshore accounts were structured and layered through international correspondent banks without any clear commercial rationale, matching organized money mule laundering profiles.',
  aiRecommendation: 'Approve file submission of Suspicious Activity Report (SAR) to FinCEN. Immediate freezing of account ACC-884291 advised.'
};

export const StrReview: React.FC = () => {
  const [report, setReport] = useState<StrReport>(defaultReport);
  const [isEditing, setIsEditing] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync with localStorage newly generated case data if available
  useEffect(() => {
    try {
      const storedCaseStr = localStorage.getItem('vigilnet_new_case');
      if (storedCaseStr) {
        const storedCase = JSON.parse(storedCaseStr);
        setReport(prev => ({
          ...prev,
          caseId: storedCase.id,
          customerDetails: {
            ...prev.customerDetails,
            name: storedCase.title.split(' → ')[0] || prev.customerDetails.name,
            accountNumber: storedCase.id
          },
          transactionSummary: {
            ...prev.transactionSummary,
            volume: storedCase.volume,
            method: storedCase.type,
            destination: storedCase.title.split(' → ')[1] || prev.transactionSummary.destination
          }
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleFieldChange = (section: string, field: string, value: string) => {
    setReport(prev => {
      if (section === 'customerDetails') {
        return {
          ...prev,
          customerDetails: {
            ...prev.customerDetails,
            [field]: value
          }
        };
      }
      if (section === 'transactionSummary') {
        return {
          ...prev,
          transactionSummary: {
            ...prev.transactionSummary,
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSaveDraft = () => {
    localStorage.setItem('vigilnet_str_draft', JSON.stringify(report));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleSubmitReport = () => {
    setSubmitted(true);
    // Simulate updating case list and status
    localStorage.setItem('vigilnet_str_submitted', 'true');
    alert(`STR Report ${report.reportId} successfully signed and forwarded to Principal Officer for FinCEN dispatch.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0C0F] text-[#E8EBF0] overflow-hidden">

      {/* STR Editor Sub-Header */}
      <div className="p-4 border-b border-[#1E2535] bg-[#0F1217] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-[#2B6CB0]" />
            <h1 className="text-[15px] font-bold text-[#E8EBF0] uppercase tracking-[0.03em] font-mono">
              Suspicious Transaction Report (STR) Portal
            </h1>
          </div>
          <p className="text-[10px] text-[#8C95A8]">
            Regulatory Filing Desk · Draft Reference: <strong className="text-[#E8EBF0] font-mono">{report.reportId}</strong>
          </p>
        </div>

        {/* Edit and Mode indicators */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 border rounded-[4px] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${isEditing
                ? 'bg-[#2B6CB0] border-[#2B6CB0] text-white'
                : 'border-[#1E2535] hover:border-[#2A3347] text-[#8C95A8] hover:text-[#E8EBF0]'
              }`}
          >
            <Edit3 size={12} />
            <span>{isEditing ? 'Editing Report' : 'Unlock Editor'}</span>
          </button>

          <span className="text-[9px] bg-[#141820] border border-[#1E2535] rounded px-2.5 py-1 text-[#8C95A8] font-mono">
            STATUS: <strong className={submitted ? 'text-[#52B788]' : 'text-[#F6A623]'}>{submitted ? 'SUBMITTED' : 'DRAFT'}</strong>
          </span>
        </div>
      </div>

      {/* STR Report Details Form */}
      <div className="flex-1 overflow-y-auto p-5 max-w-[1000px] mx-auto w-full space-y-6">

        {/* Compliance Header Alert Box */}
        <div className="bg-[#141820] border border-[#1E2535] rounded-[4px] p-4 flex items-start gap-3">
          <ShieldAlert size={18} className="text-[#FF6B6B] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-[11px]">
            <span className="font-bold text-[#E8EBF0] block">STR Filing Warning Notice</span>
            <p className="text-[#8C95A8] leading-[1.4]">
              This report contains sensitive financial intelligence and GNN structural attention mapping. Once finalized, it will be signed by the Principal Officer and submitted to FinCEN. Unauthorized tipping-off is strictly prohibited under federal regulations.
            </p>
          </div>
        </div>

        {/* Section 1: Customer Details */}
        <div className="bg-[#0F1217] border border-[#1E2535] rounded-[4px] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2535] pb-2.5">
            <User size={14} className="text-[#2B6CB0]" />
            <h2 className="text-[12px] font-bold uppercase tracking-[0.03em] text-[#E8EBF0]">Part I: Subject Identity Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Subject Legal Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={report.customerDetails.name}
                onChange={e => handleFieldChange('customerDetails', 'name', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded px-3 py-2 text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Account Number (VigilNet ID)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={report.customerDetails.accountNumber}
                onChange={e => handleFieldChange('customerDetails', 'accountNumber', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded px-3 py-2 text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Occupation / Business Sector</label>
              <input
                type="text"
                disabled={!isEditing}
                value={report.customerDetails.occupation}
                onChange={e => handleFieldChange('customerDetails', 'occupation', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded px-3 py-2 text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">KYC Verification Status</label>
              <input
                type="text"
                disabled={!isEditing}
                value={report.customerDetails.kycStatus}
                onChange={e => handleFieldChange('customerDetails', 'kycStatus', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded px-3 py-2 text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Jurisdiction Code</label>
              <input
                type="text"
                disabled={!isEditing}
                value={report.customerDetails.jurisdiction}
                onChange={e => handleFieldChange('customerDetails', 'jurisdiction', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded px-3 py-2 text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Ultimate Beneficial Owner (UBO)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={report.customerDetails.uboDetails}
                onChange={e => handleFieldChange('customerDetails', 'uboDetails', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded px-3 py-2 text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Transaction Summary */}
        <div className="bg-[#0F1217] border border-[#1E2535] rounded-[4px] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2535] pb-2.5">
            <Briefcase size={14} className="text-[#2B6CB0]" />
            <h2 className="text-[12px] font-bold uppercase tracking-[0.03em] text-[#E8EBF0]">Part II: Transaction & Volume Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Financial Loss Exposure (Volume)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={report.transactionSummary.volume}
                onChange={e => handleFieldChange('transactionSummary', 'volume', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded px-3 py-2 text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0] font-bold font-mono text-[12px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Payment Routing Method</label>
              <input
                type="text"
                disabled={!isEditing}
                value={report.transactionSummary.method}
                onChange={e => handleFieldChange('transactionSummary', 'method', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded px-3 py-2 text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Destination Routing & Trace Path</label>
              <input
                type="text"
                disabled={!isEditing}
                value={report.transactionSummary.destination}
                onChange={e => handleFieldChange('transactionSummary', 'destination', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded px-3 py-2 text-[#63B3ED] outline-none disabled:opacity-60 focus:border-[#2B6CB0] font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: AI Telemetry Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Behaviour Analysis */}
          <div className="bg-[#0F1217] border border-[#1E2535] rounded-[4px] p-5 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-[#1E2535] pb-2.5">
              <Activity size={13} className="text-[#2B6CB0]" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.03em] text-[#E8EBF0]">Part III: Behavioural Telemetry</h2>
            </div>
            <textarea
              disabled={!isEditing}
              rows={4}
              value={report.behaviourAnalysis}
              onChange={e => handleFieldChange('general', 'behaviourAnalysis', e.target.value)}
              className="w-full bg-[#141820] border border-[#1E2535] rounded p-2.5 text-[11px] text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0] resize-none leading-[1.5]"
            />
          </div>

          {/* Graph Analysis */}
          <div className="bg-[#0F1217] border border-[#1E2535] rounded-[4px] p-5 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-[#1E2535] pb-2.5">
              <Network size={13} className="text-[#2B6CB0]" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.03em] text-[#E8EBF0]">Part IV: Topological Graph Telemetry</h2>
            </div>
            <textarea
              disabled={!isEditing}
              rows={4}
              value={report.graphAnalysis}
              onChange={e => handleFieldChange('general', 'graphAnalysis', e.target.value)}
              className="w-full bg-[#141820] border border-[#1E2535] rounded p-2.5 text-[11px] text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0] resize-none leading-[1.5]"
            />
          </div>
        </div>

        {/* Section 4: Narrative & Reason for Suspicion */}
        <div className="bg-[#0F1217] border border-[#1E2535] rounded-[4px] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2535] pb-2.5">
            <ShieldAlert size={14} className="text-[#FF6B6B]" />
            <h2 className="text-[12px] font-bold uppercase tracking-[0.03em] text-[#E8EBF0]">Part V: Suspicious Rationale & Rationale</h2>
          </div>

          <div className="space-y-4 text-[11px]">
            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Reason for Suspicion (Legal Narrative)</label>
              <textarea
                disabled={!isEditing}
                rows={4}
                value={report.reasonForSuspicion}
                onChange={e => handleFieldChange('general', 'reasonForSuspicion', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded p-3 text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#2B6CB0] leading-[1.5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#4A5568] font-bold uppercase text-[9px]">Compiled Material Evidence Checks</label>
              <textarea
                disabled={!isEditing}
                rows={4}
                value={report.evidenceList}
                onChange={e => handleFieldChange('general', 'evidenceList', e.target.value)}
                className="w-full bg-[#141820] border border-[#1E2535] rounded p-3 text-[#8C95A8] outline-none disabled:opacity-60 focus:border-[#2B6CB0] leading-[1.6] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 5: AI Recommendation */}
        <div className="bg-[#1A1112] border border-[#FF6B6B]/25 rounded-[4px] p-5 space-y-3">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={14} className="text-[#FF6B6B]" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.03em] text-[#FF6B6B]">VigilNet AI Regulatory Recommendation</h3>
          </div>
          <textarea
            disabled={!isEditing}
            rows={2}
            value={report.aiRecommendation}
            onChange={e => handleFieldChange('general', 'aiRecommendation', e.target.value)}
            className="w-full bg-[#1F1415] border border-[#FF6B6B]/15 rounded p-2.5 text-[11px] text-[#E8EBF0] outline-none disabled:opacity-60 focus:border-[#FF6B6B]/30 leading-[1.5]"
          />
        </div>

        {/* Form Action Controls */}
        <div className="flex items-center justify-between border-t border-[#1E2535] pt-4.5 pb-8">
          <span className="text-[10px] text-[#4A5568] font-mono flex items-center gap-1">
            <Clock size={12} />
            <span>Last Auto-Saved: {report.creationDate}</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="px-4.5 py-2 border border-[#1E2535] hover:border-[#2A3347] text-[#8C95A8] hover:text-[#E8EBF0] text-[11px] font-bold rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save size={13} />
              <span>{draftSaved ? 'Draft Saved' : 'Save Draft'}</span>
            </button>

            <button
              onClick={handleSubmitReport}
              disabled={submitted}
              className="px-5 py-2 bg-[#2B6CB0] hover:bg-[#3182CE] disabled:bg-[#1A2D24] disabled:text-[#52B788] text-white text-[11px] font-bold rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {submitted ? (
                <>
                  <CheckCircle size={13} />
                  <span>Submitted to Principal Officer</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Submit to Principal Officer</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
