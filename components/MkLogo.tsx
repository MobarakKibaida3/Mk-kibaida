import React from 'react';

interface MkLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export default function MkLogo({ className = '', size = 'md', showSubtitle = true }: MkLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Royal Crown + MK Monogram Emblem */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-b from-[#1F1B12] to-[#0D0D0D] border border-[#C9A227]/40 shadow-[0_0_20px_rgba(201,162,39,0.15)] shrink-0 p-1.5 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="35%" stopColor="#E5C158" />
              <stop offset="70%" stopColor="#C9A227" />
              <stop offset="100%" stopColor="#8A6B12" />
            </linearGradient>
            <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FFECA8" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#967718" />
            </linearGradient>
          </defs>

          {/* Royal Crown */}
          <path
            d="M 22 34 L 28 42 L 50 20 L 72 42 L 78 34 L 75 48 L 25 48 Z"
            fill="url(#crownGrad)"
          />
          {/* Crown Jewels / Circles */}
          <circle cx="22" cy="32" r="3.5" fill="#FFECA8" />
          <circle cx="50" cy="18" r="4.5" fill="#FFFBE6" />
          <circle cx="78" cy="32" r="3.5" fill="#FFECA8" />
          <circle cx="36" cy="27" r="2.5" fill="#FFECA8" />
          <circle cx="64" cy="27" r="2.5" fill="#FFECA8" />

          {/* Crown Arch Base */}
          <rect x="25" y="47" width="50" height="4" rx="2" fill="url(#goldGrad)" />
          
          {/* MK Monogram Interlocked */}
          <text
            x="50"
            y="84"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Playfair Display', serif, sans-serif"
            fontWeight="900"
            fontSize="36"
            letterSpacing="2"
            fill="url(#goldGrad)"
          >
            MK
          </text>
        </svg>
      </div>

      {/* Typography Brand Lockup */}
      <div className="flex flex-col text-right">
        <span
          className={`font-bold tracking-wider text-white font-serif uppercase ${textSizes[size]}`}
          style={{ letterSpacing: '0.08em' }}
        >
          Mobarak Kibaida
        </span>
        {showSubtitle && (
          <span className="text-[10px] md:text-xs tracking-widest text-[#C9A227] uppercase font-medium">
            Creative Design Studio
          </span>
        )}
      </div>
    </div>
  );
}
