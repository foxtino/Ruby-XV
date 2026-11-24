import React from 'react';
import { motion } from 'motion/react';
import { Shirt, Ban, CheckCircle2 } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { RubyEmblem } from './RubyEmblem';

interface DressCodeProps {
  dressCode: WeddingConfig['dressCode'];
  notes: WeddingConfig['notes'];
}

export const DressCode: React.FC<DressCodeProps> = ({ dressCode, notes }) => {
  return (
    <section
      id="vestimenta"
      className="py-24 bg-[#140407] text-[#FBF7F2] relative overflow-hidden border-b border-[#D4AF37]/15"
    >
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#D4AF37] mb-2">
            Etiqueta y Recomendaciones
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#FBF7F2] font-semibold tracking-tight [text-wrap:balance]">
            Código de Vestimenta
          </h2>
          <div className="my-4 max-w-[200px] mx-auto flex items-center justify-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <RubyEmblem className="w-4 h-4" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Dress Code Card: NEGRO & Rojo Reservado */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#24090F] border border-[#D4AF37]/30 p-8 rounded-2xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-[#D4AF37]">
                <Shirt className="w-6 h-6 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#E8CE86]">
                    Vestimenta Solicitada
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl text-[#FBF7F2] font-semibold">
                    {dressCode.style}
                  </h3>
                </div>
              </div>

              <p className="text-[#E8D5CE] text-sm leading-relaxed font-light">
                {dressCode.description}
              </p>

              {/* Visual Black Attire Swatch */}
              <div className="pt-2 space-y-2.5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#E8CE86]">
                  Tono Sugerido para Invitados
                </p>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#140407] border border-[#D4AF37]/20">
                  <div className="w-10 h-10 rounded-lg bg-[#09090B] border border-zinc-700 shrink-0 shadow-inner" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#FBF7F2]">Negro Formal</p>
                    <p className="text-xs text-[#B89B93]">
                      Vestido negro de noche para damas · Traje o smoking negro para caballeros
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reserved Color Notice: Red exclusively for Ruby */}
            <div className="p-5 rounded-xl bg-[#3A0812] border border-[#C41E3A]/60 space-y-3">
              <div className="flex items-center gap-2 text-[#F6E6B4] text-xs font-semibold tracking-[0.16em] uppercase">
                <Ban className="w-4 h-4 text-[#E11D48] shrink-0" />
                <span>Color Reservado</span>
              </div>
              <p className="text-sm text-[#FBF7F2] leading-relaxed">
                El <strong className="text-[#F6E6B4] font-semibold">color rojo</strong> (en todas sus tonalidades) está reservado exclusivamente para <strong className="text-[#F6E6B4] font-semibold">Ruby</strong>.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="h-8 rounded-lg bg-[#9B111E] border border-[#E8CE86]/30 flex items-center justify-center text-[11px] font-medium text-[#FBF7F2]">
                  Rojo Rubí
                </div>
                <div className="h-8 rounded-lg bg-[#B91C1C] border border-[#E8CE86]/30 flex items-center justify-center text-[11px] font-medium text-[#FBF7F2]">
                  Carmesí
                </div>
                <div className="h-8 rounded-lg bg-[#7F1D1D] border border-[#E8CE86]/30 flex items-center justify-center text-[11px] font-medium text-[#FBF7F2]">
                  Vino / Tinto
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notes & Recommendations Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="bg-[#24090F] border border-[#D4AF37]/25 p-8 rounded-2xl flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <RubyEmblem className="w-6 h-6" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#E8CE86]">
                    Para Tu Comodidad
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl text-[#FBF7F2] font-semibold">
                    Notas Importantes
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {notes.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 pb-4 border-b border-[#D4AF37]/15 last:border-none last:pb-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                    <p className="text-sm text-[#E8D5CE] font-light leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#D4AF37]/20">
              <p className="font-display italic text-base text-[#E8CE86]">
                “Gracias por ayudarnos a que cada detalle brille en esta noche inolvidable.”
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
