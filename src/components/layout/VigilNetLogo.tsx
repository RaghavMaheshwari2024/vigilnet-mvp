import React from 'react';

interface VigilNetLogoProps {
  className?: string;
  size?: number; // Size of the emblem SVG in pixels
  hideText?: boolean;
  textColor?: string;
}

export const VigilNetLogo: React.FC<VigilNetLogoProps> = ({ 
  className = '', 
  size = 32, 
  hideText = false,
  textColor = 'text-[#E8EBF0]' 
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      
      {/* SVG Emblem (Faceted Shield + Glow Trend Graph) */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        className="flex-shrink-0 filter drop-shadow-[0_0_8px_rgba(0,229,255,0.35)]"
      >
        <defs>
          {/* Facet Gradients */}
          <linearGradient id="shieldLeftGrad" x1="20" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B4B43" />
            <stop offset="100%" stopColor="#052D28" />
          </linearGradient>
          <linearGradient id="shieldRightGrad" x1="80" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0E7C6F" />
            <stop offset="100%" stopColor="#094A42" />
          </linearGradient>
          <linearGradient id="trendGrad" x1="18" y1="65" x2="82" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          
          {/* Node Glow Filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Faceted Shield Base */}
        {/* Left Dark Facet */}
        <path 
          d="M 50,15 L 20,25 C 20,25 18,62 50,85 Z" 
          fill="url(#shieldLeftGrad)" 
          stroke="#0D5C52"
          strokeWidth="1"
        />
        
        {/* Right Light Facet */}
        <path 
          d="M 50,15 L 80,25 C 80,25 82,62 50,85 Z" 
          fill="url(#shieldRightGrad)" 
          stroke="#0F8B7C"
          strokeWidth="1"
        />
        
        {/* Shield Highlights */}
        <path 
          d="M 50,15 L 50,85" 
          stroke="rgba(0, 229, 255, 0.18)" 
          strokeWidth="1.5" 
        />

        {/* Trend Graph Node Line */}
        <path 
          d="M 18,65 L 38,48 L 55,55 L 82,35" 
          stroke="url(#trendGrad)" 
          strokeWidth="4" 
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Trend Graph Nodes */}
        <circle cx="18" cy="65" r="4.5" fill="#00E5FF" filter="url(#glow)" />
        <circle cx="38" cy="48" r="4.5" fill="#00E5FF" filter="url(#glow)" />
        <circle cx="55" cy="55" r="4.5" fill="#00E5FF" filter="url(#glow)" />
        <circle cx="82" cy="35" r="5" fill="#38BDF8" filter="url(#glow)" />
      </svg>

      {/* Typography side */}
      {!hideText && (
        <div className="flex flex-col select-none">
          <span className={`text-[15px] font-black tracking-[-0.02em] ${textColor} font-sans leading-none`}>
            VigilNet
          </span>
          <div className="flex items-center gap-1.5 mt-0.5 w-[72px]">
            <div className="h-[1px] bg-[#1E2535] flex-1" />
            <span className="text-[#00E5FF] text-[9px] font-bold tracking-widest font-mono leading-none">
              tech
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
