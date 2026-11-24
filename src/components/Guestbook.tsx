import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, Heart, Loader2 } from 'lucide-react';
import { saveWish, subscribeWishes, WishData } from '../lib/firebase';
import { RubyEmblem } from './RubyEmblem';

function formatWishDate(createdAt: any): string {
  if (!createdAt) return 'Reciente';
  try {
    const date = typeof createdAt?.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
    if (isNaN(date.getTime())) return 'Reciente';
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return 'Reciente';
  }
}

export const Guestbook: React.FC = () => {
  const [wishes, setWishes] = useState<WishData[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeWishes((data) => {
      setWishes(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await saveWish({
        name: name.trim(),
        message: message.trim()
      });

      setName('');
      setMessage('');
      setIsSubmitting(false);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch (error) {
      console.error('Error saving wish:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="deseos"
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
            Libro de Recuerdos
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#FBF7F2] font-semibold tracking-tight [text-wrap:balance]">
            Muro de Buenos Deseos para Ruby
          </h2>
          <div className="flex items-center justify-center gap-3 my-4 max-w-[200px] mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <RubyEmblem className="w-4 h-4" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <p className="text-[#E8D5CE] text-sm max-w-lg mx-auto font-light">
            Déjale a Ruby un mensaje especial, una bendición o tus mejores deseos para esta nueva etapa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-[#24090F] border border-[#D4AF37]/30 p-6 sm:p-8 rounded-2xl"
          >
            <div className="flex items-center gap-2.5 text-[#E8CE86] mb-5">
              <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-display text-2xl text-[#FBF7F2] font-semibold">
                Escribir Mensaje
              </h3>
            </div>

            {successNotice && (
              <div className="mb-4 p-3.5 bg-[#3A0812] border border-[#D4AF37]/50 text-[#F6E6B4] text-xs rounded-xl flex items-center gap-2">
                <RubyEmblem className="w-4 h-4 shrink-0" />
                <span>Tu mensaje se ha publicado con cariño en el muro.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="wish-name"
                  className="block text-xs text-[#E8CE86] uppercase tracking-[0.14em] font-medium mb-1.5"
                >
                  Tu Nombre
                </label>
                <input
                  id="wish-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre o familia"
                  className="w-full bg-[#140407] border border-[#4A1822] focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-[#FBF7F2] placeholder-[#B89B93]/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="wish-msg"
                  className="block text-xs text-[#E8CE86] uppercase tracking-[0.14em] font-medium mb-1.5"
                >
                  Mensaje o Felicitación
                </label>
                <textarea
                  id="wish-msg"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tus palabras aquí..."
                  className="w-full bg-[#140407] border border-[#4A1822] focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-[#FBF7F2] placeholder-[#B89B93]/50 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E8CE86] text-[#140407] font-semibold text-xs uppercase tracking-[0.16em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publicar Mensaje</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Real-Time Wishes Feed */}
          <div className="lg:col-span-7 space-y-4 max-h-[540px] overflow-y-auto pr-1">
            {wishes.length === 0 ? (
              <div className="bg-[#24090F] border border-[#D4AF37]/20 p-8 rounded-2xl text-center">
                <Heart className="w-7 h-7 text-[#C41E3A] mx-auto mb-3 opacity-80" />
                <p className="text-sm text-[#E8D5CE] font-display italic text-lg">
                  Sé el primero en dejar un mensaje lleno de cariño para Ruby en sus quince años.
                </p>
              </div>
            ) : (
              wishes.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#24090F] border border-[#D4AF37]/20 p-6 rounded-2xl hover:border-[#D4AF37]/45 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="font-display text-xl text-[#E8CE86] font-semibold">
                      {item.name}
                    </span>
                    <span className="text-xs text-[#B89B93] tabular-nums shrink-0">
                      {formatWishDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[#FBF7F2]/90 leading-relaxed font-light italic">
                    “{item.message}”
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
