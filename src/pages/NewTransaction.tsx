import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Coins,
  Zap,
  Activity
} from 'lucide-react';
import { AIProcessingScreen } from '../components/dashboard/AIProcessingScreen';

interface AccountOption {
  number: string;
  name: string;
  type: string;
  riskProfile: 'Critical' | 'Warning' | 'Low';
  watchlistMatch: boolean;
}

const mockAccounts: AccountOption[] = [
  { number: 'ACC-884291', name: 'Nexus Corp LLC (Cayman)', type: 'Corporate Shell', riskProfile: 'Critical', watchlistMatch: true },
  { number: 'ACC-774821', name: 'Orion Capital AG (Zurich)', type: 'Trust Agency', riskProfile: 'Warning', watchlistMatch: false },
  { number: 'ACC-110294', name: 'Raghav Maheshwari (Personal)', type: 'Retail Checking', riskProfile: 'Low', watchlistMatch: false },
  { number: 'ACC-552840', name: 'Meridian Trading UAE', type: 'Trade Import', riskProfile: 'Warning', watchlistMatch: false },
  { number: 'ACC-992144', name: 'Al-Zamil Trust (Riyadh)', type: 'Financial Brokerage', riskProfile: 'Warning', watchlistMatch: false },
  { number: 'ACC-441829', name: 'Westfield Partners (US)', type: 'Corporate Operating', riskProfile: 'Low', watchlistMatch: false },
];

export const NewTransaction: React.FC = () => {
  // Form state
  const [senderAcc, setSenderAcc] = useState(mockAccounts[0].number);
  const [receiverAcc, setReceiverAcc] = useState(mockAccounts[1].number);
  const [amount, setAmount] = useState('2500000');
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('SWIFT');
  const [txTime, setTxTime] = useState(new Date().toISOString().substring(0, 16));
  const [txType, setTxType] = useState('Transfer');
  const [narration, setNarration] = useState('Consulting fees payment for strategic offshore services');

  // Animation & Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Dynamic estimated pre-analysis risk based on inputs
  const [estRisk, setEstRisk] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Compute live pre-analysis risk score
  useEffect(() => {
    let risk = 10;
    const errors: string[] = [];

    const sender = mockAccounts.find(a => a.number === senderAcc);
    const receiver = mockAccounts.find(a => a.number === receiverAcc);
    const amtNum = parseFloat(amount) || 0;

    // Sender risk
    if (sender) {
      if (sender.riskProfile === 'Critical') risk += 30;
      else if (sender.riskProfile === 'Warning') risk += 15;
      if (sender.watchlistMatch) {
        risk += 15;
        errors.push(`Sender Match: ${sender.name} flagged on OFAC Watchlist.`);
      }
    }

    // Receiver risk
    if (receiver) {
      if (receiver.riskProfile === 'Critical') risk += 30;
      else if (receiver.riskProfile === 'Warning') risk += 15;
      if (receiver.watchlistMatch) {
        risk += 15;
        errors.push(`Receiver Match: ${receiver.name} flagged on OFAC Watchlist.`);
      }
    }

    // Amount thresholds
    if (amtNum > 1000000) {
      risk += 20;
      errors.push('High-Value Threshold exceeded (>$1M).');
    } else if (amtNum > 250000) {
      risk += 10;
    }

    // High risk method + offshore combination
    if (paymentMethod === 'SWIFT' && (senderAcc === 'ACC-884291' || receiverAcc === 'ACC-884291')) {
      risk += 10;
      errors.push('Offshore wire layering pattern detected.');
    }

    // Cap risk at 99 for estimation
    setEstRisk(Math.min(risk, 99));
    setValidationErrors(errors);
  }, [senderAcc, receiverAcc, amount, paymentMethod]);

  const handleReset = () => {
    setSenderAcc(mockAccounts[0].number);
    setReceiverAcc(mockAccounts[1].number);
    setAmount('2500000');
    setCurrency('USD');
    setPaymentMethod('SWIFT');
    setTxTime(new Date().toISOString().substring(0, 16));
    setTxType('Transfer');
    setNarration('Consulting fees payment for strategic offshore services');
    setIsAnalyzing(false);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-[#FF6B6B]';
    if (score >= 50) return 'text-[#F6A623]';
    return 'text-[#52B788]';
  };


  if (isAnalyzing) {
    return (
      <AIProcessingScreen
        amount={amount}
        sender={senderAcc}
        receiver={receiverAcc}
        currency={currency}
        paymentMethod={paymentMethod}
        txTime={txTime}
        txType={txType}
        narration={narration}
        onComplete={() => {
          setIsAnalyzing(false);
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0C0F] p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#1E2535]/30">
        <div>
          <h1 className="text-[20px] font-bold text-[#E8EBF0] tracking-[-0.02em] flex items-center gap-2">
            <ArrowRightLeft size={18} className="text-[#2B6CB0]" />
            Transaction Ingestion & Intake Wizard
          </h1>
          <p className="text-[11px] text-[#8C95A8] mt-0.5">
            Manually inject transactions to simulate real-time ML risk scoring and GNN prediction pipelines.
          </p>
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Section: Form (7 Columns) */}
        <div className="lg:col-span-7 bg-[#0F1217] border border-[#1E2535] rounded-[6px] p-5 space-y-4">
          <h2 className="text-[12px] font-bold text-[#E8EBF0] tracking-[0.03em] uppercase pb-2 border-b border-[#1E2535] flex items-center gap-1.5">
            <Coins size={14} className="text-[#8C95A8]" />
            Transaction Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Account */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8C95A8] font-semibold uppercase tracking-[0.02em]">
                Sender Account
              </label>
              <select
                value={senderAcc}
                onChange={e => setSenderAcc(e.target.value)}
                className="bg-[#141820] border border-[#1E2535] rounded-[4px] px-3 py-2 text-[12px] text-[#E8EBF0] font-mono outline-none focus:border-[#2A3347] cursor-pointer"
              >
                {mockAccounts.map(acc => (
                  <option key={acc.number} value={acc.number}>
                    {acc.number} - {acc.name} ({acc.riskProfile})
                  </option>
                ))}
              </select>
            </div>

            {/* Receiver Account */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8C95A8] font-semibold uppercase tracking-[0.02em]">
                Receiver Account
              </label>
              <select
                value={receiverAcc}
                onChange={e => setReceiverAcc(e.target.value)}
                className="bg-[#141820] border border-[#1E2535] rounded-[4px] px-3 py-2 text-[12px] text-[#E8EBF0] font-mono outline-none focus:border-[#2A3347] cursor-pointer"
              >
                {mockAccounts.map(acc => (
                  <option key={acc.number} value={acc.number}>
                    {acc.number} - {acc.name} ({acc.riskProfile})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8C95A8] font-semibold uppercase tracking-[0.02em]">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5568] text-[11px] font-semibold font-mono">
                  $
                </span>
                <input
                  type="text"
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  className="w-full bg-[#141820] border border-[#1E2535] rounded-[4px] pl-6 pr-3 py-2 text-[12px] text-[#E8EBF0] font-mono outline-none focus:border-[#2A3347]"
                />
              </div>
            </div>

            {/* Currency */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8C95A8] font-semibold uppercase tracking-[0.02em]">
                Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="bg-[#141820] border border-[#1E2535] rounded-[4px] px-3 py-2 text-[12px] text-[#E8EBF0] font-semibold outline-none focus:border-[#2A3347] cursor-pointer"
              >
                {['USD', 'EUR', 'GBP', 'AED', 'CHF'].map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8C95A8] font-semibold uppercase tracking-[0.02em]">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="bg-[#141820] border border-[#1E2535] rounded-[4px] px-3 py-2 text-[12px] text-[#E8EBF0] outline-none focus:border-[#2A3347] cursor-pointer"
              >
                {['SWIFT', 'Fedwire', 'ACH', 'SEPA', 'Crypto Transfer'].map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8C95A8] font-semibold uppercase tracking-[0.02em]">
                Transaction Type
              </label>
              <select
                value={txType}
                onChange={e => setTxType(e.target.value)}
                className="bg-[#141820] border border-[#1E2535] rounded-[4px] px-3 py-2 text-[12px] text-[#E8EBF0] outline-none focus:border-[#2A3347] cursor-pointer"
              >
                {['Transfer', 'Deposit', 'Withdrawal', 'Payment'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Transaction Time */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] text-[#8C95A8] font-semibold uppercase tracking-[0.02em]">
                Transaction Timestamp (UTC)
              </label>
              <input
                type="datetime-local"
                value={txTime}
                onChange={e => setTxTime(e.target.value)}
                className="bg-[#141820] border border-[#1E2535] rounded-[4px] px-3 py-2 text-[12px] text-[#E8EBF0] font-mono outline-none focus:border-[#2A3347] cursor-pointer"
              />
            </div>

            {/* Narration */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] text-[#8C95A8] font-semibold uppercase tracking-[0.02em]">
                Narration / Purpose Code
              </label>
              <textarea
                value={narration}
                onChange={e => setNarration(e.target.value)}
                rows={2}
                placeholder="Details of the commercial transaction..."
                className="bg-[#141820] border border-[#1E2535] rounded-[4px] px-3 py-2 text-[12px] text-[#E8EBF0] outline-none focus:border-[#2A3347] resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#1E2535]/30">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !amount}
              className="flex-1 bg-[#2B6CB0] hover:bg-[#3182CE] disabled:bg-[#1A2A3F] disabled:text-[#4A5568] text-white text-[12px] font-bold py-2 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Processing ML models...</span>
                </>
              ) : (
                <>
                  <Zap size={12} />
                  <span>Analyze Transaction</span>
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={isAnalyzing}
              className="px-4 py-2 border border-[#1E2535] hover:border-[#2A3347] text-[#8C95A8] hover:text-[#E8EBF0] text-[12px] rounded-[4px] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right Section: Live Summary & Result (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Live Parameter Telemetry Summary */}
          <div className="bg-[#0F1217] border border-[#1E2535] rounded-[6px] p-5 space-y-4">
            <h2 className="text-[12px] font-bold text-[#E8EBF0] tracking-[0.03em] uppercase pb-2 border-b border-[#1E2535] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity size={14} className="text-[#8C95A8]" />
                Live Ingestion Stream
              </span>
              <span className="text-[8px] bg-[#1A2D24] text-[#52B788] border border-[rgba(82,183,136,0.15)] rounded-full px-2 py-0.5 font-bold uppercase tracking-wider font-mono">
                active
              </span>
            </h2>

            <div className="space-y-3.5 text-[11px]">
              {/* Sender Summary */}
              <div className="flex justify-between items-start border-b border-[#1E2535]/30 pb-2">
                <span className="text-[#4A5568] font-semibold uppercase">Sender Account</span>
                <div className="text-right">
                  <div className="font-mono text-[#E8EBF0] font-semibold">{senderAcc}</div>
                  <div className="text-[10px] text-[#8C95A8] mt-0.5">
                    {mockAccounts.find(a => a.number === senderAcc)?.name}
                  </div>
                </div>
              </div>

              {/* Receiver Summary */}
              <div className="flex justify-between items-start border-b border-[#1E2535]/30 pb-2">
                <span className="text-[#4A5568] font-semibold uppercase">Receiver Account</span>
                <div className="text-right">
                  <div className="font-mono text-[#E8EBF0] font-semibold">{receiverAcc}</div>
                  <div className="text-[10px] text-[#8C95A8] mt-0.5">
                    {mockAccounts.find(a => a.number === receiverAcc)?.name}
                  </div>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="flex justify-between items-center border-b border-[#1E2535]/30 pb-2">
                <span className="text-[#4A5568] font-semibold uppercase">Net Value</span>
                <div className="font-mono text-[14px] font-bold text-[#E8EBF0]">
                  {parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency })}
                </div>
              </div>

              {/* Pre-Analysis Risk Meter */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#4A5568] font-semibold uppercase">Pre-Analysis GNN Risk</span>
                  <span className={`font-mono font-bold ${getRiskColor(estRisk)}`}>
                    {estRisk}%
                  </span>
                </div>
                <div className="w-full h-1 bg-[#1A2030] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-current transition-all duration-300"
                    style={{
                      width: `${estRisk}%`,
                      color: estRisk >= 80 ? '#FF6B6B' : estRisk >= 50 ? '#F6A623' : '#52B788'
                    }}
                  />
                </div>
              </div>

              {/* Ingestion Warnings */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[#4A5568] font-semibold uppercase">Real-Time Validation Checks</span>
                {validationErrors.length > 0 ? (
                  <div className="space-y-1">
                    {validationErrors.map((err, i) => (
                      <div key={i} className="flex gap-1.5 text-[9px] text-[#E05C6E] font-medium leading-[1.3] items-start bg-[#2A1018]/50 border border-[rgba(224,92,110,0.1)] rounded-[3px] p-1.5">
                        <AlertTriangle size={10} className="flex-shrink-0 mt-[1px]" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-1.5 text-[9px] text-[#52B788] font-medium leading-[1.3] items-center bg-[#1A2D24]/50 border border-[rgba(82,183,136,0.1)] rounded-[3px] p-1.5">
                    <CheckCircle size={10} className="flex-shrink-0" />
                    <span>Parameters structurally valid. Sanitization check passed.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
