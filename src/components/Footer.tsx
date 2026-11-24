import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { RubyEmblem } from './RubyEmblem';

interface FooterProps {
  config: WeddingConfig;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAdmin }) => {
  return (
    <footer className="bg-[#0D0204] text-[#FBF7F2] py-16 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2.5 text-xs text-[#D4AF37] uppercase tracking-[0.26em] font-medium">
            <RubyEmblem className="w-4 h-4" />
            <span>Mis XV Años</span>
            <RubyEmblem className="w-4 h-4" />
          </div>

          <p className="font-script text-6xl sm:text-7xl text-gold-gradient leading-none mt-1">
            {config.quinceanera.fullName}
          </p>
        </div>

        <p className="text-[#E8D5CE] text-sm tracking-wide">
          {config.formattedDate} <span className="text-[#D4AF37] mx-1.5">·</span> Monterrey, Nuevo León
        </p>

        <p className="text-xs text-[#E8CE86] tracking-[0.2em] uppercase">
          {config.hashtag}
        </p>

        {onOpenAdmin && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs text-[#B89B93] hover:text-[#E8CE86] transition-colors cursor-pointer"
              title="Panel de Administración"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administración</span>
            </button>
          </div>
        )}

        <div className="pt-8 border-t border-[#D4AF37]/15 flex flex-col items-center justify-center gap-3">
          <div className="px-5 py-3 rounded-xl bg-[#FBF7F2] border border-[#D4AF37]/40 flex items-center justify-center">
            <img
              src="https://i.ibb.co/SDdjPCkq/inolvidablenegro.png"
              alt="Inolvidables Momentos"
              referrerPolicy="no-referrer"
              className="h-11 sm:h-14 max-w-[240px] sm:max-w-[290px] object-contain"
            />
          </div>
          <p className="text-[#B89B93] text-xs font-light tracking-wide">
            Invitación digital creada por{' '}
            <span className="text-[#E8CE86] font-medium">Inolvidables Momentos</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
