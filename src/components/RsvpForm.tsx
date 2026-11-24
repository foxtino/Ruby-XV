import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Send, Users, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveRsvp } from '../lib/firebase';
import { RubyEmblem } from './RubyEmblem';

export const RsvpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes');
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await saveRsvp({
        name: name.trim(),
        attendance,
        guestsCount: attendance === 'yes' ? guestsCount : 0,
        message: message.trim() || ''
      });

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Ruby Crimson & Champagne Gold Confetti
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#9B111E', '#C41E3A', '#D4AF37', '#E8CE86', '#FBF7F2']
      });
    } catch (err) {
      console.error('Error saving RSVP to Firebase:', err);
      setIsSubmitting(false);
      setErrorMessage('Hubo un error al guardar tu confirmación. Intenta nuevamente.');
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setAttendance('yes');
    setGuestsCount(1);
    setMessage('');
  };

  return (
    <section
      id="rsvp"
      className="py-24 bg-[#1E060B] text-[#FBF7F2] relative overflow-hidden border-b border-[#D4AF37]/15"
    >
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#D4AF37] mb-2">
            Confirmación de Asistencia
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#FBF7F2] font-semibold tracking-tight [text-wrap:balance]">
            ¿Nos Acompañas a Celebrar los XV de Ruby?
          </h2>
          <div className="flex items-center justify-center gap-3 my-4 max-w-[200px] mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <RubyEmblem className="w-4 h-4" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <p className="text-[#E8D5CE] text-sm max-w-lg mx-auto font-light">
            Por favor confirma tu asistencia con anticipación para reservar tus lugares en esta noche tan especial.
          </p>
        </motion.div>

        {/* Form Container */}
        <div className="bg-[#24090F] border border-[#D4AF37]/30 p-6 sm:p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="rsvp-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {errorMessage && (
                  <div className="p-4 bg-[#3A0812] border border-[#C41E3A] text-[#FBF7F2] rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#E8CE86]" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="rsvp-name"
                    className="block text-xs text-[#E8CE86] font-medium mb-2 tracking-[0.14em] uppercase"
                  >
                    Nombre Completo <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    id="rsvp-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Familia Ceballos o tu nombre completo"
                    className="w-full bg-[#140407] border border-[#4A1822] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-[#FBF7F2] placeholder-[#B89B93]/50 text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Attendance Selection */}
                <div>
                  <label className="block text-xs text-[#E8CE86] font-medium mb-3 tracking-[0.14em] uppercase">
                    ¿Asistirás a la celebración? <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setAttendance('yes')}
                      className={`py-3.5 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 border transition-colors cursor-pointer whitespace-nowrap ${
                        attendance === 'yes'
                          ? 'bg-[#D4AF37] text-[#140407] border-[#D4AF37]'
                          : 'bg-[#140407] text-[#E8D5CE] border-[#4A1822] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sí, Asistiré</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttendance('no')}
                      className={`py-3.5 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 border transition-colors cursor-pointer whitespace-nowrap ${
                        attendance === 'no'
                          ? 'bg-[#3A0812] text-[#FBF7F2] border-[#C41E3A]'
                          : 'bg-[#140407] text-[#E8D5CE] border-[#4A1822] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <span>No Podré Asistir</span>
                    </button>
                  </div>
                </div>

                {/* Guests Count */}
                {attendance === 'yes' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label
                      htmlFor="rsvp-guests"
                      className="block text-xs text-[#E8CE86] font-medium tracking-[0.14em] uppercase"
                    >
                      Número de Personas Confirmadas
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#140407] border border-[#4A1822] rounded-xl text-[#D4AF37]">
                        <Users className="w-5 h-5" />
                      </div>
                      <select
                        id="rsvp-guests"
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                        className="flex-1 bg-[#140407] border border-[#4A1822] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-[#FBF7F2] text-sm focus:outline-none transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num} className="bg-[#140407] text-[#FBF7F2]">
                            {num} {num === 1 ? 'Pase (1 persona)' : `Pases (${num} personas)`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Optional Message */}
                <div>
                  <label
                    htmlFor="rsvp-message"
                    className="block text-xs text-[#E8CE86] font-medium mb-2 tracking-[0.14em] uppercase"
                  >
                    Mensaje para Ruby (Opcional)
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe unas palabras especiales o buenos deseos..."
                    className="w-full bg-[#140407] border border-[#4A1822] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-[#FBF7F2] placeholder-[#B89B93]/50 text-sm focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#E8CE86] text-[#140407] text-xs font-semibold uppercase tracking-[0.16em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando Confirmación...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirmar Asistencia</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              /* Success State */
              <motion.div
                key="rsvp-success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#9B111E]/30 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#E8CE86]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="font-display text-3xl sm:text-4xl text-[#FBF7F2] font-semibold">
                  ¡Muchas Gracias por Confirmar!
                </h3>

                <p className="text-sm text-[#E8D5CE] max-w-md mx-auto leading-relaxed font-light">
                  Tu confirmación ha sido registrada correctamente. Nos hará inmensamente felices celebrar juntos los XV años de Ruby este sábado 12 de diciembre de 2026.
                </p>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#E8CE86] hover:underline uppercase tracking-widest font-medium cursor-pointer"
                  >
                    Enviar otra confirmación
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
