import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  speedY: number;
  speedX: number;
  isPetal: boolean;
  angle: number;
  angleSpeed: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: string;
}

export const MagicalParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const getCount = () => (window.innerWidth < 768 ? 22 : 40);

    const createParticle = (initialY?: number): Particle => {
      const isPetal = Math.random() < 0.48;
      const size = isPetal ? Math.random() * 6 + 4.5 : Math.random() * 2.2 + 1;
      const baseAlpha = isPetal ? Math.random() * 0.28 + 0.16 : Math.random() * 0.42 + 0.18;

      const colors = isPetal
        ? ['#9B111E', '#B91C2E', '#7F1220', '#C41E3A']
        : ['#D4AF37', '#E8CE86', '#F6E6B4', '#C9A23F'];

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size,
        alpha: baseAlpha,
        baseAlpha,
        speedY: isPetal ? Math.random() * 0.5 + 0.25 : -(Math.random() * 0.25 + 0.12),
        speedX: (Math.random() - 0.5) * 0.35,
        isPetal,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02,
        pulseSpeed: Math.random() * 0.022 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    let particles: Particle[] = Array.from({ length: getCount() }, () => createParticle());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = Array.from({ length: getCount() }, () => createParticle());
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.pulsePhase += p.pulseSpeed;
        p.angle += p.angleSpeed;
        p.x += p.speedX + Math.sin(p.pulsePhase) * 0.25;
        p.y += p.speedY;

        if (p.isPetal) {
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        } else {
          if (p.y < -20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
        }

        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.1;
        const safeAlpha = Math.max(0.08, Math.min(0.65, currentAlpha));

        ctx.save();
        ctx.globalAlpha = safeAlpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.isPetal) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(
            p.size * 0.85,
            -p.size * 0.45,
            p.size * 0.85,
            p.size * 0.75,
            0,
            p.size * 1.1
          );
          ctx.bezierCurveTo(
            -p.size * 0.85,
            p.size * 0.75,
            -p.size * 0.85,
            -p.size * 0.45,
            0,
            -p.size
          );
          ctx.fill();
        } else {
          const rad = p.size;
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad * 2.4);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.25)');
          grad.addColorStop(1, 'rgba(20, 4, 7, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-80"
    />
  );
};
