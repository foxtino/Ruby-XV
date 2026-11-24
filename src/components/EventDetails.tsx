import React from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Navigation,
  Clock,
  Sparkles,
  Utensils,
  Music,
  DoorOpen,
  Church
} from 'lucide-react';
import { EventLocation, ScheduleItem } from '../types/wedding';
import { RubyEmblem } from './RubyEmblem';

interface EventDetailsProps {
  ceremony?: EventLocation;
  reception: EventLocation;
  itinerary?: ScheduleItem[];
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  ceremony,
  reception,
  itinerary = []
}) => {
  const venues = ceremony ? [ceremony, reception] : [reception];

  const getStepIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Church':
        return <Church className="w-5 h-5 text-[#D4AF37]" />;
      case 'DoorOpen':
        return <DoorOpen className="w-5 h-5 text-[#D4AF37]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-[#D4AF37]" />;
      case 'Music':
        return <Music className="w-5 h-5 text-[#D4AF37]" />;
      default:
        return <Clock className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  return (
    <section
      id="eventos"
      className="py-24 bg-[#1E060B] text-[#FBF7F2] relative overflow-hidden border-b border-[#D4AF37]/15"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#D4AF37] mb-2">
            Dónde y Cuándo
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#FBF7F2] font-semibold tracking-tight [text-wrap:balance]">
            Ceremonia y Recepción
          </h2>
          <div className="my-4 max-w-[200px] mx-auto flex items-center justify-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <RubyEmblem className="w-4 h-4" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <p className="text-sm sm:text-base text-[#E8D5CE]">
            Sábado, 12 de Diciembre de 2026
          </p>
        </motion.div>

        {/* Two Balanced Venue Cards (Iglesia & Casino Romano) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {venues.map((venue, index) => (
            <motion.article
              key={venue.venue}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.12 }}
              className="bg-[#24090F] border border-[#D4AF37]/30 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#D4AF37]/60 transition-colors"
            >
              <div>
                {/* Venue Photography */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#140407]">
                  <img
                    src={venue.imageUrl}
                    alt={venue.venue}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#24090F] via-[#24090F]/25 to-transparent pointer-events-none" />
                </div>

                {/* Venue Details */}
                <div className="p-7 sm:p-8 space-y-5">
                  <div>
                    <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#D4AF37] mb-1.5">
                      {venue.title} <span aria-hidden="true">·</span> {venue.time}
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl text-[#FBF7F2] font-semibold leading-snug [text-wrap:balance]">
                      {venue.venue}
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm text-[#E8D5CE]">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>
                        Inicio: <strong className="text-[#FBF7F2] font-semibold">{venue.time}</strong>
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[#FBF7F2] font-medium">{venue.address}</p>
                        <p className="text-[#B89B93] text-xs mt-0.5">{venue.city}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#E8D5CE]/85 leading-relaxed font-light">
                    {venue.description}
                  </p>
                </div>
              </div>

              {/* Google Maps Action */}
              <div className="px-7 pb-7 sm:px-8 sm:pb-8 pt-2">
                <a
                  href={venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#E8CE86] text-[#140407] font-semibold text-xs tracking-wider uppercase transition-colors whitespace-nowrap"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Ver Ubicación en Google Maps</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Celebration Itinerary */}
        {itinerary && itinerary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-16 pt-14 border-t border-[#D4AF37]/20"
          >
            <div className="text-center mb-10">
              <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#D4AF37] mb-2">
                Programa del Día
              </p>
              <h3 className="font-display text-2xl sm:text-4xl text-[#FBF7F2] font-semibold">
                Itinerario de la Celebración
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {itinerary.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#24090F] border border-[#D4AF37]/20 hover:border-[#D4AF37]/45 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      {getStepIcon(step.iconName)}
                      <span className="text-xs font-medium text-[#E8CE86] tabular-nums">
                        {step.time}
                      </span>
                    </div>
                    <h4 className="font-display text-lg text-[#FBF7F2] font-semibold mb-1.5 leading-snug">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#E8D5CE]/80 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
