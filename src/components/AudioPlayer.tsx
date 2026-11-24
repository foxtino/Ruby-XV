import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  musicUrl: string;
  songTitle: string;
  autoPlayTrigger?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  musicUrl,
  songTitle,
  autoPlayTrigger
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const safePlay = () => {
    if (!audioRef.current) return;
    try {
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        playPromiseRef.current = promise;
        promise
          .then(() => {
            playPromiseRef.current = null;
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch((err: any) => {
            playPromiseRef.current = null;
            if (err?.name === 'AbortError') return;
          });
      }
    } catch {
      // Ignore browser autoplay block until user interacts
    }
  };

  const safePause = () => {
    if (!audioRef.current) return;
    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        })
        .catch(() => {
          if (audioRef.current) {
            try {
              audioRef.current.pause();
              setIsPlaying(false);
            } catch {}
          }
        });
    } else {
      try {
        audioRef.current.pause();
        setIsPlaying(false);
      } catch {}
    }
  };

  useEffect(() => {
    const encodedUrl = encodeURI(musicUrl);
    const audio = new Audio(encodedUrl);
    audio.loop = true;
    audio.volume = 0.55;
    audioRef.current = audio;

    const handleUserInteraction = () => {
      if (!hasInteracted && !isPlaying) {
        safePlay();
      }
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      safePause();
      audioRef.current = null;
    };
  }, [musicUrl]);

  useEffect(() => {
    if (autoPlayTrigger && !isPlaying) {
      safePlay();
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      safePause();
    } else {
      safePlay();
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      id="audio-player"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2.5 bg-[#1E060B]/95 backdrop-blur-md text-[#FBF7F2] px-3 py-2 rounded-full shadow-[0_12px_35px_rgba(0,0,0,0.55)] border border-[#D4AF37]/35 hover:border-[#D4AF37]/65 transition-colors"
    >
      <button
        type="button"
        onClick={togglePlay}
        id="play-pause-btn"
        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8CE86] to-[#B88E2A] text-[#140407] flex items-center justify-center hover:brightness-110 transition-all cursor-pointer shrink-0"
        title={isPlaying ? 'Pausar música' : 'Reproducir música'}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-[#140407] fill-[#140407]" />
        ) : (
          <Play className="w-4 h-4 ml-0.5 text-[#140407] fill-[#140407]" />
        )}
      </button>

      <div className="flex flex-col pr-1 min-w-0">
        <span className="text-[10px] font-medium tracking-[0.16em] text-[#D4AF37] uppercase leading-tight">
          {isPlaying ? 'Reproduciendo' : 'Música'}
        </span>
        <span
          className="text-xs text-[#FBF7F2] max-w-[140px] sm:max-w-[175px] truncate leading-snug"
          title={songTitle}
        >
          {songTitle}
        </span>
      </div>

      <button
        type="button"
        onClick={toggleMute}
        id="mute-btn"
        className="p-1.5 text-[#E8D5CE] hover:text-[#E8CE86] transition-colors cursor-pointer shrink-0"
        title={isMuted ? 'Activar sonido' : 'Silenciar'}
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-[#C41E3A]" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
