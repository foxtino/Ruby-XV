import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Download, ExternalLink, Check } from 'lucide-react';
import { RubyEmblem } from './RubyEmblem';

interface CountdownProps {
  targetDate: string;
  formattedDate: string;
  coupleNames: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  formattedDate,
  coupleNames
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const getGoogleCalendarUrl = () => {
    const startDate = new Date(targetDate).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(new Date(targetDate).getTime() + 6 * 3600 * 1000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');

    const title = encodeURIComponent(`XV Años de ${coupleNames}`);
    const details = encodeURIComponent(
      `¡Acompáñame a celebrar mis XV Años! Misa 5:30 PM en Parroquia de Nuestra Señora de San Juan de los Lagos. Casino Romano: Entrada al salón 7:30 PM, entrada de honor y vals 8:15 PM, cena 9:00 PM y gran fiesta 10:00 PM. Código de vestimenta: Negro (rojo reservado para la quinceañera).`
    );
    const location = encodeURIComponent(
      'Parroquia de Nuestra Señora de San Juan de los Lagos / Casino Romano, Monterrey, N.L.'
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  const downloadIcsFile = () => {
    const startISO = new Date(targetDate).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endISO = new Date(new Date(targetDate).getTime() + 6 * 3600 * 1000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Inolvidables Momentos//Invitacion XV Ruby//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:XV Años de ${coupleNames}
DESCRIPTION:Misa 5:30 PM en Parroquia de Nuestra Señora de San Juan de los Lagos. Casino Romano: Entrada al salón 7:30 PM, entrada de honor y vals 8:15 PM, cena 9:00 PM y gran fiesta 10:00 PM. Código de vestimenta: Negro.
LOCATION:Casino Romano, Monterrey, N.L.
DTSTART:${startISO}
DTEND:${endISO}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'XV_Anos_Ruby.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  const timeUnits = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds }
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#1E060B] text-[#FBF7F2] relative overflow-hidden border-b border-[#D4AF37]/15">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#D4AF37] mb-3">
          Cuenta Regresiva
        </p>

        <h2 className="font-display text-3xl sm:text-5xl text-[#FBF7F2] font-semibold tracking-tight mb-3 [text-wrap:balance]">
          Falta Muy Poco para el Gran Día
        </h2>

        <div className="flex items-center justify-center gap-3 my-4 max-w-[200px] mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
          <RubyEmblem className="w-4 h-4" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
        </div>

        <p className="text-sm sm:text-base text-[#E8D5CE] mb-10">
          {formattedDate} <span className="text-[#D4AF37] mx-1.5">·</span> Inicio 5:30 PM
        </p>

        {/* Tabular Countdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-2xl mx-auto mb-10">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-[#24090F] border border-[#D4AF37]/25 rounded-2xl p-6 flex flex-col items-center justify-center"
            >
              <span className="font-display text-4xl sm:text-5xl md:text-6xl text-[#E8CE86] font-semibold tabular-nums leading-none mb-2">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-xs text-[#E8D5CE]/80 tracking-[0.18em] uppercase font-medium">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Save Date Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E8CE86] text-[#140407] font-semibold text-xs tracking-wider uppercase transition-colors whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar en Google</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={downloadIcsFile}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#24090F] hover:bg-[#2E0C14] text-[#FBF7F2] border border-[#D4AF37]/35 font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap"
          >
            {isDownloaded ? (
              <>
                <Check className="w-4 h-4 text-[#E8CE86]" />
                <span>Guardado en Calendario</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Apple / Outlook (.ics)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
