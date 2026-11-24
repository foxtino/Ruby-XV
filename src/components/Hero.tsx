import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Heart } from 'lucide-react';
import { WeddingConfig } from '../types/wedding';
import { RubyEmblem } from './RubyEmblem';

interface HeroProps {
  config: WeddingConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  return (
    <div id="inicio" className="relative bg-[#140407] overflow-hidden">
      {/* HERO COVER SECTION */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between text-[#FBF7F2] pt-20 pb-12 overflow-hidden">
        {/* Background Main Portrait: DSC03311.jpg */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <img
              src={config.heroImage}
              alt={`Retrato principal de ${config.quinceanera.fullName} en sus XV Años`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top sm:object-[center_20%] brightness-[0.82] contrast-[1.04]"
            />
          </motion.div>

          {/* Measured Contrast Scrims for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#140407]/80 via-[#140407]/25 to-[#140407]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140407] via-[#140407]/45 to-transparent" />
        </div>

        {/* Spacer for balanced lower-third editorial framing so Ruby's portrait shines */}
        <div className="relative z-10 flex-1" />

        {/* Editorial Hero Typography Block */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pb-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <p className="text-xs sm:text-sm font-medium tracking-[0.32em] uppercase text-[#E8CE86] mb-3">
              Mis XV Años
            </p>

            <h1 className="font-script text-7xl sm:text-8xl md:text-9xl text-gold-gradient leading-[0.95] drop-shadow-[0_6px_28px_rgba(20,4,7,0.9)] px-2">
              {config.quinceanera.fullName}
            </h1>

            {/* Delicate Gold Hairline & Ruby Divider */}
            <div className="my-5 w-full max-w-[260px] flex items-center justify-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-[#D4AF37]" />
              <RubyEmblem className="w-5 h-5" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#D4AF37]/70 to-[#D4AF37]" />
            </div>

            <p className="font-display text-lg sm:text-2xl text-[#FBF7F2] tracking-wide font-medium">
              {config.formattedDate}
            </p>
            <p className="text-xs sm:text-sm text-[#E8D5CE]/90 tracking-[0.16em] uppercase mt-1.5">
              Monterrey, Nuevo León · 5:30 PM
            </p>
          </motion.div>
        </div>

        {/* Scroll Down Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <a
            href="#agradecimiento"
            className="inline-flex flex-col items-center text-[#E8CE86] hover:text-[#FBF7F2] transition-colors p-2"
            aria-label="Ir al mensaje de agradecimiento"
          >
            <ChevronDown className="w-6 h-6" />
          </a>
        </motion.div>
      </section>

      {/* DEDICATION & HEARTFELT TRIBUTE TO MOTHER */}
      <section
        id="agradecimiento"
        className="relative z-20 bg-[#140407] py-20 sm:py-28 px-6 border-b border-[#D4AF37]/15"
      >
        <div className="max-w-3xl mx-auto space-y-12 text-center">
          {/* Quinceañera Opening Quote */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <RubyEmblem className="w-7 h-7 mx-auto" />
            <blockquote className="font-display text-2xl sm:text-3xl md:text-[34px] text-[#FBF7F2] font-normal italic leading-relaxed [text-wrap:balance]">
              “{config.tagline}”
            </blockquote>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
            <p className="font-script text-4xl sm:text-5xl text-[#E8CE86]">
              {config.quinceanera.fullName}
            </p>
          </motion.div>

          {/* Tribute Exclusively to Her Mother (Yesenia Abigail Ceballos Eguia) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-[#24090F] border border-[#D4AF37]/30 rounded-2xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-6"
          >
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#D4AF37]">
                Con la bendición y el amor de mi mamá
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#FBF7F2] font-semibold [text-wrap:balance]">
                {config.quinceanera.mother}
              </h2>
            </div>

            <div className="w-16 h-px bg-[#D4AF37]/50 mx-auto" />

            <div className="max-w-2xl mx-auto space-y-4">
              <p className="font-display text-lg sm:text-xl text-[#E8D5CE] italic leading-relaxed">
                “{config.quinceanera.motherTribute}”
              </p>
              <div className="inline-flex items-center gap-2 text-xs text-[#E8CE86] tracking-[0.18em] uppercase pt-1">
                <Heart className="w-3.5 h-3.5 text-[#C41E3A] fill-[#C41E3A]" />
                <span>Con todo mi amor y gratitud, {config.quinceanera.firstName}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
