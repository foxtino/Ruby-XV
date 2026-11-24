import React from 'react';
import { motion } from 'motion/react';
import { Mail, Gift } from 'lucide-react';
import { BankAccount, ExternalRegistry } from '../types/wedding';
import { RubyEmblem } from './RubyEmblem';

interface GiftRegistryProps {
  gifts: {
    message: string;
    envelopeNote?: string;
    bankAccount?: BankAccount;
    externalRegistries?: ExternalRegistry[];
  };
}

export const GiftRegistry: React.FC<GiftRegistryProps> = ({ gifts }) => {
  return (
    <section
      id="regalos"
      className="py-24 bg-[#140407] text-[#FBF7F2] relative overflow-hidden border-b border-[#D4AF37]/15"
    >
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#D4AF37] mb-2">
            Sugerencia de Obsequios
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#FBF7F2] font-semibold tracking-tight [text-wrap:balance]">
            Lluvia de Sobres y Regalos
          </h2>
          <div className="flex items-center justify-center gap-3 my-4 max-w-[200px] mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <RubyEmblem className="w-4 h-4" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
        </motion.div>

        {/* Centered Editorial Gift Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[#24090F] border border-[#D4AF37]/30 p-8 sm:p-12 rounded-2xl text-center max-w-2xl mx-auto space-y-6"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#140407] border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37]">
              <Mail className="w-5 h-5" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#140407] border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37]">
              <Gift className="w-5 h-5" />
            </div>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl text-[#FBF7F2] font-semibold">
            Lluvia de Sobres y Mesa de Regalos
          </h3>

          <p className="font-display italic text-lg sm:text-xl text-[#E8D5CE] leading-relaxed">
            “{gifts.message}”
          </p>

          {gifts.envelopeNote && (
            <p className="text-xs sm:text-sm text-[#E8CE86] pt-4 border-t border-[#D4AF37]/20">
              {gifts.envelopeNote}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
