import React, { useState, useEffect } from 'react';
import { VigilNetLogo } from '../layout/VigilNetLogo';
import { ShieldCheck, Cpu, Network } from 'lucide-react';

interface SplashEntryProps {
  onEnterWorkspace: () => void;
}

export const SplashEntry: React.FC<SplashEntryProps> = ({ onEnterWorkspace }) => {
  const [stage, setStage] = useState<'idle' | 'initializing' | 'complete'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const initLogs = [
    'Establishing secure websocket handshake to FastAPI:8005...',
    'Loading GATv2 model configurations and PyTorch memory weights...',
    'Fetching graph embeddings lookup dictionary (515,000 active nodes)...',
    'Syncing Louvain community clusters & PageRank coefficients...',
    'Verifying active AML compliance pipelines & security clearances...',
    'Authentication verified. Principal Officer authorization granted.'
  ];

  const handleStart = () => {
    setStage('initializing');
  };

  useEffect(() => {
    if (stage !== 'initializing') return;

    let logIndex = 0;
    let currentProgress = 0;

    const interval = setInterval(() => {
      // Progress calculation
      currentProgress += 2.5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(interval);
        setStage('complete');
        // Let user see 'complete' for a brief moment before transition
        setTimeout(() => {
          onEnterWorkspace();
        }, 800);
      } else {
        setProgress(currentProgress);
      }

      // Add log entries periodically
      const expectedLogIdx = Math.floor((currentProgress / 100) * initLogs.length);
      if (expectedLogIdx > logIndex && logIndex < initLogs.length) {
        setLogs(prev => [...prev, initLogs[logIndex]]);
        logIndex++;
      }
    }, 45);

    // Initial log
    setLogs([initLogs[0]]);
    logIndex = 1;

    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center logo-grid-bg overflow-hidden select-none">
      
      {/* Dynamic central layout */}
      <div className="w-[580px] bg-[#0A0C16]/95 border border-[#16274D]/60 rounded-lg p-10 shadow-[0_0_60px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col items-center text-center space-y-7">
        
        {/* Glowing Logo Container */}
        <div className="glow-pulse transition-all duration-300 transform hover:scale-105">
          <VigilNetLogo size={90} hideText={true} />
        </div>

        {/* Brand Text */}
        <div className="space-y-1.5">
          <h1 className="text-[30px] font-black text-[#E8EBF0] tracking-tight">
            VigilNet<span className="text-[#00E5FF]">.tech</span>
          </h1>
          <p className="text-[11px] text-[#5A6F94] uppercase tracking-[0.18em] font-bold">
            AI GNN & Behavioural Transformer AML System
          </p>
        </div>

        {/* Context Status Description */}
        {stage === 'idle' && (
          <div className="space-y-6 w-full pt-4">
            <p className="text-[13px] text-[#8C95A8] leading-[1.6] max-w-[420px] mx-auto">
              Access the high-throughput transactional flow, GNN community detection canvas, and automated STR triage workspace.
            </p>
            
            <button
              onClick={handleStart}
              className="w-full py-4 bg-[#0B7C6F] hover:bg-[#0EA292] text-[#E8EBF0] text-[13px] font-bold tracking-[0.05em] uppercase rounded border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 shadow-[0_4px_25px_rgba(0,229,255,0.18)] transition-all cursor-pointer"
            >
              Initialize Workspace
            </button>
          </div>
        )}

        {/* Initialization logs & progress */}
        {stage !== 'idle' && (
          <div className="w-full space-y-4 pt-2">
            
            {/* Simulated terminal logs */}
            <div className="w-full h-[160px] bg-[#050914] border border-[#16223D] rounded p-4 text-left font-mono text-[11px] text-[#8C95A8] space-y-2 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1.5 leading-tight">
                  <span className="text-[#00E5FF]">{'>'}</span>
                  <span className={idx === logs.length - 1 ? 'text-[#E8EBF0]' : ''}>{log}</span>
                </div>
              ))}
            </div>

            {/* Custom Progress Bar */}
            <div className="space-y-1.5 text-left font-mono">
              <div className="flex justify-between text-[10px] text-[#5A6F94]">
                <span>CORE BOOTSTRAP</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1 bg-[#10192D] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Security badges footer */}
        <div className="flex justify-center gap-7 pt-4 border-t border-[#16274D]/40 w-full text-[#4A5E85] text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#00E5FF]" />
            <span>SSL SECURE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu size={13} className="text-[#00E5FF]" />
            <span>CUDA v12.1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Network size={13} className="text-[#00E5FF]" />
            <span>GNN CORE</span>
          </div>
        </div>

      </div>

    </div>
  );
};
