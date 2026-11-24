import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { RubyEmblem } from './RubyEmblem';

interface EnvelopeScreenProps {
  config: WeddingConfig;
  onOpen: () => void;
}

export const EnvelopeScreen: React.FC<EnvelopeScreenProps> = ({ config, onOpen }) => {
  const [stage, setStage] = useState<'sealed' | 'opening' | 'revealed'>('sealed');
  const [isDismissed, setIsDismissed] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  const finishIntro = useCallback(() => {
    if (isDismissed) return;
    setIsDismissed(true);
    onOpen();
    setTimeout(() => {
      setIsDestroyed(true);
    }, 750);
  }, [isDismissed, onOpen]);

  const handleOpenEnvelope = () => {
    if (stage !== 'sealed') return;
    // Start music immediately on user gesture so browsers allow autoplay
    onOpen();
    setStage('opening');

    setTimeout(() => {
      setStage('revealed');
    }, 650);

    setTimeout(() => {
      setIsDismissed(true);
      setTimeout(() => {
        setIsDestroyed(true);
      }, 700);
    }, 1750);
  };

  if (isDestroyed) return null;

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          key="ruby-envelope-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#140407] px-5 py-8 overflow-hidden select-none"
        >
          {/* Ambient radial crimson & champagne gold studio glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 42%, rgba(155, 17, 30, 0.34) 0%, rgba(30, 6, 11, 0.85) 55%, #140407 100%)'
            }}
          />

          {/* Subtle golden border frame around viewport */}
          <div className="pointer-events-none absolute inset-4 sm:inset-7 border border-[#D4AF37]/20 rounded-2xl" />

          {/* Discreet Skip Button */}
          <button
            type="button"
            onClick={finishIntro}
            className="absolute top-6 right-6 sm:top-9 sm:right-10 z-40 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#24090F]/80 hover:bg-[#2E0C14] border border-[#D4AF37]/30 text-[#E8CE86] text-xs font-medium tracking-wider transition-colors cursor-pointer whitespace-nowrap"
            aria-label="Saltar bienvenida"
          >
            <span>Saltar</span>
            <FastForward className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>

          {/* Main Centered Content */}
          <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
            {/* Invitation Header Above Envelope */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: stage === 'revealed' ? 0 : 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-10 space-y-2"
            >
              <div className="flex items-center justify-center gap-2.5 text-xs text-[#E8CE86] tracking-[0.26em] uppercase font-medium">
                <span>Tienes una invitación especial</span>
              </div>
              <h1 className="font-script text-5xl sm:text-6xl text-gold-gradient leading-tight">
                {config.quinceanera.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-[#E8D5CE]/85 tracking-[0.18em] uppercase font-light">
                Mis XV Años · 12 de Diciembre de 2026
              </p>
            </motion.div>

            {/* Interactive 3D Crimson Velvet & Gold Envelope */}
            <div
              onClick={handleOpenEnvelope}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenEnvelope();
                }
              }}
              aria-label="Abrir sobre de invitación de los XV años de Ruby"
              className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[1.45/1] perspective-1000 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-2xl"
            >
              {/* Soft Shadow Underneath */}
              <div className="absolute -inset-3 rounded-3xl bg-[#9B111E]/25 blur-2xl group-hover:bg-[#9B111E]/35 transition-colors duration-300" />

              {/* Envelope Back Base */}
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#3D0711] via-[#2A050C] to-[#1D0408] border border-[#D4AF37]/40 shadow-[0_24px_70px_rgba(0,0,0,0.75)] overflow-visible">
                {/* Inner Gold Filigree Accent */}
                <div className="absolute inset-2.5 rounded-xl border border-[#D4AF37]/20 pointer-events-none" />

                {/* Emerging Invitation Portrait Card (Slides up when envelope opens) */}
                <motion.div
                  initial={{ y: 0, scale: 0.92, opacity: 0.85 }}
                  animate={
                    stage === 'sealed'
                      ? { y: 0, scale: 0.92, opacity: 0.9 }
                      : stage === 'opening'
                      ? { y: -74, scale: 0.98, opacity: 1 }
                      : { y: -115, scale: 1.06, opacity: 1 }
                  }
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-5 top-3 bottom-3 z-10 rounded-xl overflow-hidden bg-[#1E060B] border border-[#D4AF37]/55 shadow-2xl"
                >
                  <img
                    src={config.heroImage}
                    alt={`Retrato principal de ${config.quinceanera.fullName}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140407]/90 via-[#140407]/20 to-transparent flex flex-col justify-end p-4 text-center">
                    <span className="font-script text-3xl text-[#F6E6B4] leading-none">
                      {config.quinceanera.fullName}
                    </span>
                    <span className="text-[10px] tracking-[0.22em] uppercase text-[#E8D5CE] mt-1">
                      Mis XV Años
                    </span>
                  </div>
                </motion.div>

                {/* Envelope Front Pocket Flaps (Left, Right, Bottom SVG for razor-sharp geometry) */}
                <svg
                  viewBox="0 0 400 276"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full z-20 rounded-2xl pointer-events-none"
                >
                  <defs>
                    <linearGradient id="pocketLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6D0A18" />
                      <stop offset="100%" stopColor="#4A0610" />
                    </linearGradient>
                    <linearGradient id="pocketRight" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#660916" />
                      <stop offset="100%" stopColor="#43050E" />
                    </linearGradient>
                    <linearGradient id="pocketBottom" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7E0D1E" />
                      <stop offset="100%" stopColor="#4E0612" />
                    </linearGradient>
                  </defs>

                  {/* Left triangular fold */}
                  <polygon points="0,0 200,148 0,276" fill="url(#pocketLeft)" />
                  {/* Right triangular fold */}
                  <polygon points="400,0 200,148 400,276" fill="url(#pocketRight)" />
                  {/* Bottom overlapping fold */}
                  <polygon points="0,276 200,132 400,276" fill="url(#pocketBottom)" />

                  {/* Subtle Gold Hairline Trim Along Folds */}
                  <polyline
                    points="0,276 200,132 400,276"
                    fill="none"
                    stroke="#D4AF37"
                    strokeOpacity="0.45"
                    strokeWidth="1.2"
                  />
                  <line
                    x1="0"
                    y1="0"
                    x2="165"
                    y2="122"
                    stroke="#D4AF37"
                    strokeOpacity="0.22"
                    strokeWidth="1"
                  />
                  <line
                    x1="400"
                    y1="0"
                    x2="235"
                    y2="122"
                    stroke="#D4AF37"
                    strokeOpacity="0.22"
                    strokeWidth="1"
                  />
                </svg>

                {/* Top Animated Triangular Flap */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={stage === 'sealed' ? { rotateX: 0 } : { rotateX: -180 }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'top center', zIndex: stage === 'sealed' ? 30 : 5 }}
                  className="absolute inset-x-0 top-0 h-[58%] preserve-3d pointer-events-none"
                >
                  <svg
                    viewBox="0 0 400 160"
                    preserveAspectRatio="none"
                    className="w-full h-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
                  >
                    <defs>
                      <linearGradient id="topFlap" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8F1123" />
                        <stop offset="100%" stopColor="#5C0815" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10,0 L 390,0 Q 400,0 400,10 L 200,154 L 0,10 Q 0,0 10,0 Z"
                      fill="url(#topFlap)"
                      stroke="#D4AF37"
                      strokeOpacity="0.55"
                      strokeWidth="1.4"
                    />
                  </svg>
                </motion.div>

                {/* Embossed Champagne Gold Wax Seal ("R · XV") */}
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={
                    stage === 'sealed'
                      ? { scale: [1, 1.03, 1], opacity: 1 }
                      : { scale: 1.25, opacity: 0 }
                  }
                  transition={
                    stage === 'sealed'
                      ? { repeat: Infinity, duration: 2.8, ease: 'easeInOut' }
                      : { duration: 0.35 }
                  }
                  className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-40"
                >
                  <div className="w-[74px] h-[74px] sm:w-[82px] sm:h-[82px] rounded-full bg-gradient-to-br from-[#F6E6B4] via-[#D4AF37] to-[#9A7520] p-[3px] shadow-[0_10px_28px_rgba(0,0,0,0.65),0_0_25px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform duration-200">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#DFBE62] via-[#C3992E] to-[#8C6718] border border-[#FFF3CD]/60 flex flex-col items-center justify-center shadow-inner">
                      <span className="font-display text-2xl sm:text-[26px] font-semibold text-[#2A050C] leading-none tracking-tight">
                        R
                      </span>
                      <span className="text-[9px] font-semibold tracking-[0.26em] text-[#2A050C]/90 uppercase mt-0.5">
                        XV
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Clean Call-to-Action Below Envelope */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage === 'sealed' ? 1 : 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-9 flex flex-col items-center gap-3"
            >
              <button
                type="button"
                onClick={handleOpenEnvelope}
                className="relative overflow-hidden inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-[#B88E2A] via-[#D4AF37] to-[#B88E2A] text-[#140407] font-semibold text-xs sm:text-sm tracking-[0.14em] uppercase shadow-[0_10px_30px_rgba(212,175,55,0.28)] hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Abrir Invitación</span>
              </button>
              <div className="flex items-center gap-2 text-xs text-[#E8D5CE]/70">
                <RubyEmblem className="w-3.5 h-3.5" />
                <span>Toca el sobre para descubrir todos los detalles</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
