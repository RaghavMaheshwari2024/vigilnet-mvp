import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '../../context/LayoutContext';
import { useMutation } from '@tanstack/react-query';
import { analyzeTransaction } from '../../services/inferenceService';
import type { InferenceResponse } from '../../services/inferenceService';
import { 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  FolderPlus,
  Compass,
  ArrowRight,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface AIProcessingScreenProps {
  amount: string;
  sender: string;
  receiver: string;
  currency: string;
  paymentMethod: string;
  txTime: string;
  txType: string;
  narration: string;
  onComplete: () => void;
}

interface StepItem {
  label: string;
  desc: string;
}

const processingSteps: StepItem[] = [
  { label: 'Receiving Transaction', desc: 'Decoding wire message ledger entries and security hashes.' },
  { label: 'Updating Behaviour Profile', desc: 'Loading historical transaction sequence vectors.' },
  { label: 'Updating Risk Memory', desc: 'Syncing risk state embeddings inside LSTM memory cells.' },
  { label: 'Updating Transaction Graph', desc: 'Constructing dynamic multi-hop links in network database.' },
  { label: 'Running Behaviour Transformer', desc: 'Running self-attention on behavioral transaction time series.' },
  { label: 'Running GAT Inference', desc: 'Evaluating neighborhood attention weights using GATv2 model layers.' },
  { label: 'Running Fusion Network', desc: 'Aggregating behavior vectors and GNN paths inside Fusion Network.' },
  { label: 'Computing Money Mule Probability', desc: 'Calculating probability of structured placement & layering patterns.' },
  { label: 'Creating AML Case', desc: 'Serializing audit logs, compiling dispatcher metadata, and creating case file.' }
];

export const AIProcessingScreen: React.FC<AIProcessingScreenProps> = ({ 
  amount, 
  sender, 
  receiver,
  currency,
  paymentMethod,
  txTime,
  txType,
  narration,
  onComplete 
}) => {
  const { setActiveTab } = useLayout();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [apiResolved, setApiResolved] = useState(false);
  const [resultData, setResultData] = useState<InferenceResponse | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const { mutate, isError, error } = useMutation({
    mutationFn: analyzeTransaction,
    onSuccess: (data) => {
      setResultData(data);
      setApiResolved(true);
    },
    onError: () => {
      // Handled in the UI using isError
    }
  });

  // Trigger the API request immediately on mount
  useEffect(() => {
    mutate({
      sender,
      receiver,
      amount: parseFloat(amount) || 0,
      currency,
      paymentMethod,
      txTime,
      txType,
      narration,
    });
  }, [mutate, sender, receiver, amount, currency, paymentMethod, txTime, txType, narration]);

  // Stepper logic: Animates through steps sequentially
  useEffect(() => {
    if (isError) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        // If we haven't completed all steps, keep moving
        if (prev < processingSteps.length - 1) {
          setCompletedSteps((completed) => [...completed, prev]);
          return prev + 1;
        } else if (prev === processingSteps.length - 1 && apiResolved) {
          // If we are at the last step and the API has finished, complete the final step
          setCompletedSteps((completed) => [...completed, prev]);
          return prev + 1;
        } else {
          // Otherwise, pause on the last step waiting for the API to resolve
          return prev;
        }
      });
    }, 400); // 400ms per step feels premium and professional

    return () => clearInterval(interval);
  }, [isError, apiResolved]);

  // Handle countdown to redirect
  useEffect(() => {
    const isFinished = apiResolved && currentStepIndex >= processingSteps.length;
    if (!isFinished) return;

    if (redirectCountdown <= 0) {
      setActiveTab('Cases');
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [apiResolved, currentStepIndex, redirectCountdown, setActiveTab, onComplete]);

  // Calculate live progress bar percentage
  const totalSteps = processingSteps.length;
  const progressPercent = Math.min(
    100,
    Math.round((completedSteps.length / totalSteps) * 100)
  );

  const isFinished = apiResolved && currentStepIndex >= processingSteps.length;

  const handleRetry = () => {
    setCompletedSteps([]);
    setCurrentStepIndex(0);
    setApiResolved(false);
    setResultData(null);
    mutate({
      sender,
      receiver,
      amount: parseFloat(amount) || 0,
      currency,
      paymentMethod,
      txTime,
      txType,
      narration,
    });
  };

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center bg-[#0A0C0F] p-8 min-h-screen text-[#E8EBF0] overflow-y-auto"
    >
      <div className="w-full max-w-[580px] space-y-6">
        
        {/* Top Header Card */}
        <div className="text-center space-y-2">
          <motion.div 
            animate={{ rotate: isFinished ? 0 : 360 }}
            transition={{ repeat: isFinished ? 0 : Infinity, duration: 8, ease: 'linear' }}
            className="w-10 h-10 rounded-full bg-[#1A2A3F] border border-[#2B6CB0]/30 flex items-center justify-center mx-auto text-[#63B3ED] mb-3"
          >
            <Cpu size={18} />
          </motion.div>
          <h1 className="text-[18px] font-bold tracking-[-0.02em] flex items-center justify-center gap-1.5">
            <Sparkles size={16} className="text-[#63B3ED]" />
            VigilNet Neural Pipeline Running
          </h1>
          <p className="text-[11px] text-[#8C95A8] max-w-[420px] mx-auto leading-[1.4]">
            Ingesting wire transfer of <span className="font-mono text-[#E8EBF0] font-semibold">{parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency })}</span> from <span className="font-mono text-[#63B3ED] font-semibold">{sender}</span> to <span className="font-mono text-[#63B3ED] font-semibold">{receiver}</span> to run transformer context updates, PageRank graphs, and deep neural node classification.
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#8C95A8]">
            <span>SYSTEM CONVERGENCE PROGRESS</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#141820] border border-[#1E2535] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#2B6CB0]"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Stepper Pipeline */}
        <div className="bg-[#0F1217] border border-[#1E2535] rounded-[6px] p-5 space-y-4 max-h-[300px] overflow-y-auto">
          {processingSteps.map((step, idx) => {
            const isCompleted = completedSteps.includes(idx);
            const isActive = currentStepIndex === idx && !isFinished && !isError;
            
            return (
              <div 
                key={idx} 
                className={`flex gap-3 text-[11px] items-start transition-opacity duration-200 ${
                  isCompleted || isActive ? 'opacity-100' : 'opacity-30'
                }`}
              >
                {/* Node Status Indicator */}
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle2 size={13} className="text-[#52B788]" />
                    </motion.div>
                  ) : isActive ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#63B3ED] border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-[#4A5568] flex items-center justify-center text-[8px] font-mono text-[#4A5568]">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Text details */}
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold ${isActive ? 'text-[#63B3ED]' : 'text-[#E8EBF0]'}`}>
                    {step.label}
                  </div>
                  {isActive && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="text-[9px] text-[#8C95A8] mt-0.5 leading-[1.3]"
                    >
                      {step.desc}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error State View */}
        <AnimatePresence>
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#2D0F0F] border border-[#FF6B6B]/20 rounded-[6px] p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-[#FF6B6B]/10 pb-2.5">
                <AlertTriangle size={16} className="text-[#FF6B6B]" />
                <h3 className="text-[12px] font-bold text-[#E8EBF0] uppercase tracking-[0.03em]">
                  API Inference Error
                </h3>
              </div>
              <p className="text-[11px] text-[#8C95A8] leading-[1.5]">
                {error instanceof Error ? error.message : 'Failed to communicate with the VigilNet FastAPI server. Please check if the local server is running on http://localhost:8000.'}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-[#2B6CB0] hover:bg-[#3182CE] text-white text-[11px] font-bold py-2 rounded-[4px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Retry Pipeline</span>
                </button>
                <button
                  onClick={onComplete}
                  className="px-4 py-2 border border-[#1E2535] hover:border-[#2A3347] text-[#8C95A8] hover:text-[#E8EBF0] text-[11px] rounded-[4px] transition-colors cursor-pointer"
                >
                  Back to Form
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Results Block Overlay */}
        <AnimatePresence>
          {isFinished && resultData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`${getRiskBg(resultData.risk_level)} border rounded-[6px] p-5 space-y-4 shadow-2xl`}
            >
              <div className="flex items-center gap-2 border-b border-[#1E2535]/50 pb-2.5">
                <FolderPlus size={16} className={getRiskColor(resultData.risk_level)} />
                <h3 className="text-[12px] font-bold text-[#E8EBF0] uppercase tracking-[0.03em]">
                  Real Inference Complete
                </h3>
                <span className={`ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${
                  resultData.risk_level === 'Critical' ? 'bg-[#2D0F0F] text-[#FF6B6B] border-[#FF6B6B]/30' :
                  resultData.risk_level === 'Warning' ? 'bg-[#2A2010] text-[#F6A623] border-[#F6A623]/30' :
                  'bg-[#1A2D24] text-[#52B788] border-[#52B788]/30'
                }`}>
                  {resultData.risk_level} Risk
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] font-mono">
                <div>
                  <span className="text-[#8C95A8] text-[9px] uppercase font-semibold block mb-0.5">Mule Probability</span>
                  <span className={`font-bold text-[13px] ${getRiskColor(resultData.risk_level)}`}>
                    {(resultData.risk_probability * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-[#8C95A8] text-[9px] uppercase font-semibold block mb-0.5">Risk Level</span>
                  <span className={`font-bold text-[13px] ${getRiskColor(resultData.risk_level)}`}>
                    {resultData.risk_level}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C95A8] text-[9px] uppercase font-semibold block mb-0.5">Case Dispatch ID</span>
                  <span className="text-[#63B3ED] font-bold text-[13px]">
                    {resultData.case_id}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C95A8] text-[9px] uppercase font-semibold block mb-0.5">Inference Status</span>
                  <span className="text-[#E8EBF0] font-bold text-[13px]">
                    {resultData.status}
                  </span>
                </div>
              </div>

              {/* Redirect Action Stepper / Timer */}
              <div className="flex items-center justify-between text-[10px] text-[#8C95A8] pt-3 border-t border-[#1E2535]/50">
                <span className="flex items-center gap-1.5 font-mono">
                  <Compass size={11} className="animate-spin" style={{ animationDuration: '3s' }} />
                  AUTOMATIC REDIRECT IN <strong className="text-[#E8EBF0]">{redirectCountdown}s</strong>
                </span>
                
                <button
                  onClick={() => {
                    setActiveTab('Cases');
                    onComplete();
                  }}
                  className="flex items-center gap-1 text-[#63B3ED] font-bold hover:underline transition-all cursor-pointer"
                >
                  <span>Go to Case Manager</span>
                  <ArrowRight size={10} />
                </button>
              </div>

              {/* Graphical representation of the redirect countdown bar */}
              <div className="w-full h-0.5 bg-[#1E2535] rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${
                    resultData.risk_level === 'Critical' ? 'bg-[#FF6B6B]/40' :
                    resultData.risk_level === 'Warning' ? 'bg-[#F6A623]/40' :
                    'bg-[#52B788]/40'
                  }`}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
