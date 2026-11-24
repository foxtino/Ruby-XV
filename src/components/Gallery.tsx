import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Grid,
  Pause,
  Play
} from 'lucide-react';
import { subscribeImgbbImages } from '../lib/imgbb';
import { RubyEmblem } from './RubyEmblem';

interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

interface GalleryProps {
  gallery: GalleryItem[];
  onOpenAdmin?: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ gallery }) => {
  const [imgbbItems, setImgbbItems] = useState<GalleryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'destacadas' | 'sesion'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(16);

  // Featured Slideshow state
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeImgbbImages((records) => {
      const seen = new Set<string>();
      const converted: GalleryItem[] = records
        .filter((r) => r.inGallery !== false)
        .map((r, i) => ({
          id: r.id || `imgbb-${i}`,
          url: r.displayUrl || r.url,
          caption: r.title && r.title.length > 2 ? r.title : 'Sesión de XV Años — Ruby'
        }))
        .filter((item) => {
          if (!item.url || seen.has(item.url)) return false;
          seen.add(item.url);
          return true;
        });

      setImgbbItems(converted);
    });

    return () => unsubscribe();
  }, []);

  // Ruby's curated 46 photos come first (starting with DSC03311), followed by any newly uploaded ImgBB photos
  const combinedGallery: GalleryItem[] = React.useMemo(() => {
    const seen = new Set<string>();
    const all = [...gallery, ...imgbbItems];
    return all.filter((item) => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  }, [gallery, imgbbItems]);

  const featuredItems = React.useMemo(() => {
    if (combinedGallery.length <= 6) return combinedGallery;
    return combinedGallery.slice(0, 6);
  }, [combinedGallery]);

  useEffect(() => {
    if (!isPlaying || featuredItems.length === 0) return;
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, featuredItems.length]);

  const filteredGallery = React.useMemo(() => {
    if (filter === 'destacadas') {
      return combinedGallery.filter((_, idx) => idx % 2 === 0 || idx < 6);
    }
    if (filter === 'sesion') {
      return combinedGallery.slice(0, 24);
    }
    return combinedGallery;
  }, [combinedGallery, filter]);

  const openLightbox = (index: number) => {
    const globalIdx = combinedGallery.findIndex(
      (item) => item.url === filteredGallery[index]?.url
    );
    setSelectedIndex(globalIdx >= 0 ? globalIdx : index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % combinedGallery.length);
  }, [selectedIndex, combinedGallery.length]);

  const prevImage = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + combinedGallery.length) % combinedGallery.length);
  }, [selectedIndex, combinedGallery.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, nextImage, prevImage]);

  return (
    <section
      id="galeria"
      className="py-24 bg-[#1E060B] text-[#FBF7F2] relative overflow-hidden select-none border-b border-[#D4AF37]/15"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#D4AF37] mb-2">
            Galería Fotográfica
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#FBF7F2] font-semibold tracking-tight [text-wrap:balance]">
            Sesión de Mis XV Años
          </h2>
          <div className="flex items-center justify-center gap-3 my-4 max-w-[200px] mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <RubyEmblem className="w-4 h-4" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <p className="text-[#E8D5CE] text-sm sm:text-base max-w-lg mx-auto font-light">
            Cada fotografía guarda la ilusión, la alegría y la elegancia de Ruby en sus quince años.
          </p>
        </motion.div>

        {/* Featured Slideshow Hero Card */}
        {featuredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12 relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#140407]"
          >
            <div className="relative h-[360px] sm:h-[520px] lg:h-[580px] w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={featuredItems[featuredIndex]?.id || `featured-${featuredIndex}`}
                  src={featuredItems[featuredIndex]?.url}
                  alt={featuredItems[featuredIndex]?.caption}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="w-full h-full object-cover object-top"
                />
              </AnimatePresence>

              {/* Contrast Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#140407]/85 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Caption & Controls */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-7 flex items-end justify-between gap-4 z-20">
                <div className="text-left">
                  <p className="text-xs text-[#E8CE86] tabular-nums">
                    {featuredIndex + 1} / {featuredItems.length}
                  </p>
                  <p className="font-display text-xl sm:text-2xl text-[#FBF7F2] italic">
                    {featuredItems[featuredIndex]?.caption}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-[#140407]/85 p-1.5 rounded-xl border border-[#D4AF37]/30 backdrop-blur-md shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setFeaturedIndex(
                        (prev) => (prev - 1 + featuredItems.length) % featuredItems.length
                      )
                    }
                    className="p-2 rounded-lg hover:bg-[#D4AF37]/20 text-[#E8CE86] transition-colors cursor-pointer"
                    aria-label="Fotografía anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-lg hover:bg-[#D4AF37]/20 text-[#E8CE86] transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pausar presentación' : 'Reproducir presentación'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeaturedIndex((prev) => (prev + 1) % featuredItems.length)}
                    className="p-2 rounded-lg hover:bg-[#D4AF37]/20 text-[#E8CE86] transition-colors cursor-pointer"
                    aria-label="Fotografía siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtle Gold Progress Bar */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-[#2E0C14] z-20">
                <motion.div
                  key={featuredIndex}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: isPlaying ? 5 : 0, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-[#9B111E] via-[#D4AF37] to-[#F6E6B4]"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#D4AF37]/15">
          <div className="flex items-center gap-1 bg-[#24090F] p-1 rounded-xl border border-[#D4AF37]/20">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-[#D4AF37] text-[#140407] font-semibold'
                  : 'text-[#E8D5CE] hover:text-[#FBF7F2]'
              }`}
            >
              Todas ({combinedGallery.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('destacadas')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'destacadas'
                  ? 'bg-[#D4AF37] text-[#140407] font-semibold'
                  : 'text-[#E8D5CE] hover:text-[#FBF7F2]'
              }`}
            >
              Destacadas
            </button>
            <button
              type="button"
              onClick={() => setFilter('sesion')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'sesion'
                  ? 'bg-[#D4AF37] text-[#140407] font-semibold'
                  : 'text-[#E8D5CE] hover:text-[#FBF7F2]'
              }`}
            >
              Sesión de Gala
            </button>
          </div>

          <p className="text-xs text-[#B89B93] tabular-nums">
            Mostrando {Math.min(visibleCount, filteredGallery.length)} de {filteredGallery.length} fotografías
          </p>
        </div>

        {/* Masonry Gallery Grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
          {filteredGallery.slice(0, visibleCount).map((item, index) => (
            <motion.div
              key={`gallery-item-${item.id}-${index}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (index % 4) * 0.05 }}
              onClick={() => openLightbox(index)}
              className="break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer border border-[#D4AF37]/20 bg-[#24090F] group transition-colors hover:border-[#D4AF37]/60"
            >
              <img
                src={item.url}
                alt={item.caption}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#140407]/90 via-[#140407]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                <span className="font-display italic text-sm text-[#FBF7F2] mb-1">
                  {item.caption}
                </span>
                <span className="text-[11px] text-[#E8CE86] font-medium flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Ver en grande</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredGallery.length && (
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 16)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#24090F] hover:bg-[#2E0C14] border border-[#D4AF37]/40 text-[#E8CE86] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap"
            >
              <Grid className="w-4 h-4 text-[#D4AF37]" />
              <span>
                Ver Más Fotografías ({filteredGallery.length - visibleCount} restantes)
              </span>
            </button>
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0D0204]/96 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between w-full max-w-7xl mx-auto pt-1">
                <div className="text-[#E8D5CE] text-xs sm:text-sm tabular-nums">
                  Fotografía {selectedIndex + 1} de {combinedGallery.length}
                </div>

                <button
                  type="button"
                  onClick={closeLightbox}
                  id="close-lightbox"
                  className="p-2.5 bg-[#24090F] hover:bg-[#D4AF37] text-[#FBF7F2] hover:text-[#140407] rounded-full transition-colors border border-[#D4AF37]/30 cursor-pointer"
                  aria-label="Cerrar visor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Stage */}
              <div className="relative flex-1 flex items-center justify-center my-4">
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-[#24090F]/90 hover:bg-[#D4AF37] text-[#FBF7F2] hover:text-[#140407] rounded-full transition-colors border border-[#D4AF37]/30 cursor-pointer"
                  aria-label="Fotografía anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-[#24090F]/90 hover:bg-[#D4AF37] text-[#FBF7F2] hover:text-[#140407] rounded-full transition-colors border border-[#D4AF37]/30 cursor-pointer"
                  aria-label="Fotografía siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={combinedGallery[selectedIndex]?.id || selectedIndex}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center max-w-5xl max-h-[75vh] px-10 sm:px-14"
                  >
                    <img
                      src={combinedGallery[selectedIndex]?.url}
                      alt={combinedGallery[selectedIndex]?.caption}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-[68vh] object-contain rounded-xl border border-[#D4AF37]/35 shadow-2xl"
                    />
                    <p className="text-[#FBF7F2] font-display italic text-lg sm:text-xl mt-4 text-center max-w-2xl">
                      {combinedGallery[selectedIndex]?.caption}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnail Strip */}
              <div className="w-full max-w-5xl mx-auto overflow-x-auto py-2">
                <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max px-2">
                  {combinedGallery.map((item, idx) => (
                    <button
                      type="button"
                      key={`lightbox-thumb-${item.id}-${idx}`}
                      onClick={() => setSelectedIndex(idx)}
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all border cursor-pointer shrink-0 ${
                        idx === selectedIndex
                          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37] opacity-100'
                          : 'border-[#4A1822] opacity-45 hover:opacity-90'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
