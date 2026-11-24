import React from 'react';

interface RubyEmblemProps {
  className?: string;
}

export const RubyEmblem: React.FC<RubyEmblemProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="w-full h-full fill-none">
        {/* Outer delicate golden diamond frame */}
        <path
          d="M32 4 L58 32 L32 60 L6 32 Z"
          stroke="#D4AF37"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Inner faceted ruby gem */}
        <path
          d="M32 13 L48 32 L32 51 L16 32 Z"
          fill="#9B111E"
          fillOpacity="0.88"
          stroke="#E8CE86"
          strokeWidth="1.4"
        />
        {/* Crown facet highlights */}
        <path
          d="M32 13 L39 32 L32 51 L25 32 Z"
          fill="#C41E3A"
          fillOpacity="0.65"
        />
        <path
          d="M16 32 L48 32"
          stroke="#F6E6B4"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        {/* Corner gold filigree accents */}
        <circle cx="32" cy="4" r="2" fill="#E8CE86" />
        <circle cx="32" cy="60" r="2" fill="#E8CE86" />
        <circle cx="6" cy="32" r="2" fill="#E8CE86" />
        <circle cx="58" cy="32" r="2" fill="#E8CE86" />
      </svg>
    </span>
  );
};
