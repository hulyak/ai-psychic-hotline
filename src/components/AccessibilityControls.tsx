'use client';

import { useState, useEffect } from 'react';

interface AccessibilityControlsProps {
  onReducedMotionChange?: (enabled: boolean) => void;
  onSoundChange?: (enabled: boolean) => void;
}

export default function AccessibilityControls({
  onReducedMotionChange,
  onSoundChange
}: AccessibilityControlsProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Check system preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (onReducedMotionChange) {
        onReducedMotionChange(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [onReducedMotionChange]);

  // Apply reduced motion class to body
  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    if (onReducedMotionChange) {
      onReducedMotionChange(newValue);
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    if (onSoundChange) {
      onSoundChange(newValue);
    }
  };

  return (
    <>
      {/* Floating accessibility button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accessibility-toggle"
        aria-label="Accessibility settings"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.3) 0%, rgba(251, 191, 36, 0.2) 100%)',
          border: '2px solid var(--accent-primary)',
          boxShadow: '0 0 30px var(--card-glow), 0 4px 20px rgba(0, 0, 0, 0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 0 50px var(--card-glow-intense), 0 4px 20px rgba(0, 0, 0, 0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 30px var(--card-glow), 0 4px 20px rgba(0, 0, 0, 0.5)';
        }}
      >
        ♿
      </button>

      {/* Accessibility panel */}
      {isOpen && (
        <div
          className="accessibility-panel"
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '2rem',
            width: '300px',
            padding: '1.5rem',
            borderRadius: '1rem',
            background: 'var(--panel-bg)',
            border: '2px solid var(--panel-border)',
            boxShadow: '0 0 60px var(--card-glow), 0 10px 40px rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            backdropFilter: 'blur(15px)'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--accent-secondary)',
              marginBottom: '1rem',
              textShadow: '0 0 10px var(--card-glow)'
            }}
          >
            Accessibility
          </h3>

          {/* Reduced Motion Toggle */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            >
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={toggleReducedMotion}
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  cursor: 'pointer',
                  accentColor: 'var(--accent-primary)'
                }}
              />
              <span>
                <strong>Reduce Motion</strong>
                <br />
                <small style={{ color: 'var(--text-muted)' }}>
                  Disable animations
                </small>
              </span>
            </label>
          </div>

          {/* Sound Toggle */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            >
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={toggleSound}
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  cursor: 'pointer',
                  accentColor: 'var(--accent-primary)'
                }}
              />
              <span>
                <strong>Sound Effects</strong>
                <br />
                <small style={{ color: 'var(--text-muted)' }}>
                  Enable audio
                </small>
              </span>
            </label>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: 'rgba(255, 140, 0, 0.1)',
              border: '1px solid var(--accent-primary)',
              color: 'var(--accent-secondary)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 140, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 140, 0, 0.1)';
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Global CSS for reduced motion */}
      <style jsx global>{`
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `}</style>
    </>
  );
}
