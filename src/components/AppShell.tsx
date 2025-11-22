'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import AccessibilityControls from './AccessibilityControls';

interface AppShellProps {
  children: ReactNode;
  onOpenSettings?: () => void;
}

export default function AppShell({ children, onOpenSettings }: AppShellProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);

  // Vanta.js disabled to show background image
  // useEffect(() => {
  //   if (!vantaRef.current || typeof window === 'undefined') return;

  //   const initVanta = async () => {
  //     try {
  //       const THREE = await import('three');
  //       const VANTA = await import('vanta/dist/vanta.fog.min.js');

  //       if (vantaRef.current && !vantaEffect.current) {
  //         vantaEffect.current = (VANTA as any).default({
  //           el: vantaRef.current,
  //           THREE: THREE,
  //           mouseControls: true,
  //           touchControls: true,
  //           gyroControls: false,
  //           minHeight: 200.00,
  //           minWidth: 200.00,
  //           highlightColor: 0xff8c00,
  //           midtoneColor: 0xfbbf24,
  //           lowlightColor: 0x0a0604,
  //           baseColor: 0x1a0f0a,
  //           blurFactor: 0.8,
  //           speed: 1.0,
  //           zoom: 1.0,
  //         });
  //       }
  //     } catch (error) {
  //       console.log('Vanta.js not available (test environment)');
  //     }
  //   };

  //   initVanta();

  //   return () => {
  //     if (vantaEffect.current && vantaEffect.current.destroy) {
  //       vantaEffect.current.destroy();
  //     }
  //   };
  // }, []);

  // Start ambient audio on first user interaction
  const startAmbientAudio = () => {
    if (!audioStarted && audioRef.current && audioRef.current.play) {
      const playPromise = audioRef.current.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(err => {
          console.log('Audio autoplay prevented:', err);
        });
      }
      setAudioStarted(true);
    }
  };

  return (
    <div 
      ref={vantaRef}
      className="min-h-screen relative overflow-x-hidden"
      onClick={startAmbientAudio}
      onKeyDown={startAmbientAudio}
      style={{
        backgroundImage: 'url(/background.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Ambient soundscape */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/sounds/ambient.mp3" type="audio/mpeg" />
      </audio>

      {/* Dark overlay for better text readability and mystical atmosphere */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(10, 6, 4, 0.7) 0%, rgba(10, 6, 4, 0.85) 100%)'
        }}
      />

      {/* Floating particles for atmosphere */}
      <div className="floating-particle" />
      <div className="floating-particle" />
      <div className="floating-particle" />
      <div className="floating-particle" />
      <div className="floating-particle" />
      
      <div className="min-h-screen relative z-10">
        {/* Main content */}
        <div className="relative z-10 py-6 px-4 md:py-8 md:px-6">
          {/* Settings button - fixed top right */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="fixed top-4 right-4 p-3 rounded-lg transition-all duration-300 z-50"
              style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '2px solid rgba(249, 115, 22, 0.3)',
                color: '#f97316',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(249, 115, 22, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Open settings"
            >
              ⚙️
            </button>
          )}

          {/* Header */}
          <header className="text-center mb-12 max-w-4xl mx-auto relative">
            
            {/* Logo */}
            <div className="flex justify-center" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <div
                className="logo-horror-animation"
                style={{
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  filter: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.8))',
                }}
              >
                🔮
              </div>
            </div>
            
            <style jsx>{`
              @keyframes horror-pulse {
                0%, 100% {
                  filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.8)) brightness(1);
                  transform: translateY(0px) scale(1);
                }
                25% {
                  filter: drop-shadow(0 0 30px rgba(249, 115, 22, 1)) brightness(1.2);
                  transform: translateY(-3px) scale(1.05);
                }
                50% {
                  filter: drop-shadow(0 0 15px rgba(249, 115, 22, 0.6)) brightness(0.9);
                  transform: translateY(0px) scale(0.98);
                }
                75% {
                  filter: drop-shadow(0 0 35px rgba(249, 115, 22, 1)) drop-shadow(0 0 50px rgba(163, 230, 53, 0.3)) brightness(1.3);
                  transform: translateY(-2px) scale(1.03);
                }
              }
              
              @keyframes flicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.85; }
              }
              
              .logo-horror-animation {
                animation: horror-pulse 4s ease-in-out infinite, flicker 2s ease-in-out infinite;
              }
            `}</style>

            <h1 
              className="floating-header"
              style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                letterSpacing: '0.05em',
                marginBottom: '1.5rem',
                textShadow: '0 0 30px rgba(249, 115, 22, 0.5), 0 2px 10px rgba(0, 0, 0, 0.8)',
                lineHeight: 1.1
              }}
            >
              AI Psychic Hotline
            </h1>
            <p 
              style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: 'var(--text-secondary)',
                maxWidth: '42rem',
                margin: '0 auto',
                lineHeight: 1.6,
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)'
              }}
            >
              Ask a question. Draw the cards. Hear what the spirits say.
            </p>
          </header>

          {/* Content area */}
          <main className="max-w-6xl mx-auto">
            {children}
          </main>

          {/* Footer with flickering candle */}
          <footer className="mt-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="candle-flicker text-3xl">🕯️</span>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                The spirits await your questions...
              </p>
              <span className="candle-flicker text-3xl">🕯️</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Accessibility Controls */}
      <AccessibilityControls />
    </div>
  );
}
