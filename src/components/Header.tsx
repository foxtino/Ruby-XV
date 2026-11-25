import React from 'react';

interface HeaderProps {
  initials?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-40 bg-[#140407]/85 backdrop-blur-md border-b border-[#D4AF37]/15"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Wordmark */}
        <a
          href="#inicio"
          id="header-logo"
          className="font-display text-2xl sm:text-[26px] font-semibold tracking-wide text-[#FBF7F2] hover:text-[#E8CE86] transition-colors whitespace-nowrap shrink-0"
        >
          Ruby <span className="text-[#D4AF37] font-normal">· XV</span>
        </a>

        {/* Zone 2: 4 Concise Single-Line Text Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#E8D5CE]/90">
          <a
            href="#eventos"
            className="hover:text-[#E8CE86] transition-colors whitespace-nowrap shrink-0"
          >
            Eventos
          </a>
          <a
            href="#vestimenta"
            className="hover:text-[#E8CE86] transition-colors whitespace-nowrap shrink-0"
          >
            Vestimenta
          </a>
          <a
            href="#galeria"
            className="hover:text-[#E8CE86] transition-colors whitespace-nowrap shrink-0"
          >
            Galería
          </a>
          <a
            href="#regalos"
            className="hover:text-[#E8CE86] transition-colors whitespace-nowrap shrink-0"
          >
            Lluvia de Sobres
          </a>
          <a
            href="#deseos"
            className="hover:text-[#E8CE86] transition-colors whitespace-nowrap shrink-0"
          >
            Deseos
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <a
            href="#rsvp"
            className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E8CE86] text-[#140407] text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap shrink-0"
          >
            Confirmar
          </a>
        </div>
      </div>
    </header>
  );
};
