import React from 'react';
import { motion } from 'motion/react';
import { StoryTimelineItem } from '../types/wedding';
import { RubyEmblem } from './RubyEmblem';

interface OurStoryProps {
  story: StoryTimelineItem[];
}

export const OurStory: React.FC<OurStoryProps> = ({ story }) => {
  return (
    <section
      id="historia"
      className="py-24 bg-[#140407] text-[#FBF7F2] relative overflow-hidden border-b border-[#D4AF37]/15"
    >
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#D4AF37] mb-2">
            Un Sueño Cumplido
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#FBF7F2] font-semibold tracking-tight [text-wrap:balance]">
            El Camino Hacia Mis XV Años
          </h2>
          <div className="my-4 max-w-[200px] mx-auto flex items-center justify-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <RubyEmblem className="w-4 h-4" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
        </motion.div>

        {/* Editorial Alternating Chapters */}
        <div className="space-y-16 md:space-y-24">
          {story.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={item.year + item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Portrait Frame */}
                <div className="w-full md:w-1/2 overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#24090F] group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140407]/55 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Editorial Copy */}
                <div className="w-full md:w-1/2 text-left space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37] tracking-[0.2em] uppercase font-medium">
                    <span>0{index + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.year}</span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl text-[#FBF7F2] font-semibold leading-tight [text-wrap:balance]">
                    {item.title}
                  </h3>
                  <p className="text-[#E8D5CE] text-base leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
