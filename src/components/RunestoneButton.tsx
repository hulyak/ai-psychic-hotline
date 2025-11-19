'use client';

interface RunestoneButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export default function RunestoneButton({ 
  onClick, 
  children, 
  variant = 'primary',
  disabled = false,
  className = ''
}: RunestoneButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.2) 0%, rgba(251, 191, 36, 0.15) 100%)',
          border: '3px solid var(--accent-primary)',
          color: 'var(--accent-secondary)',
          boxShadow: `
            0 0 30px var(--card-glow),
            0 0 60px rgba(255, 140, 0, 0.3),
            inset 0 2px 0 rgba(255, 140, 0, 0.3),
            inset 0 0 20px rgba(255, 140, 0, 0.1)
          `
        };
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(255, 140, 0, 0.15) 100%)',
          border: '3px solid var(--accent-secondary)',
          color: 'var(--accent-secondary)',
          boxShadow: `
            0 0 30px rgba(251, 191, 36, 0.5),
            0 0 60px rgba(251, 191, 36, 0.3),
            inset 0 2px 0 rgba(251, 191, 36, 0.3)
          `
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(255, 140, 0, 0.15) 100%)',
          border: '3px solid var(--accent-tertiary)',
          color: 'var(--accent-tertiary)',
          boxShadow: `
            0 0 30px rgba(220, 38, 38, 0.5),
            0 0 60px rgba(220, 38, 38, 0.3),
            inset 0 2px 0 rgba(220, 38, 38, 0.3)
          `
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`runestone-button ${className}`}
      style={{
        ...styles,
        padding: '1rem 2rem',
        borderRadius: '0.75rem',
        fontFamily: 'var(--font-heading)',
        fontSize: '1rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        textShadow: `0 0 10px currentColor`,
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          e.currentTarget.style.boxShadow = variant === 'primary' 
            ? '0 0 50px var(--card-glow-intense), 0 0 100px var(--card-glow), inset 0 2px 0 rgba(255, 140, 0, 0.5)'
            : variant === 'secondary'
            ? '0 0 50px rgba(251, 191, 36, 0.8), 0 0 100px rgba(251, 191, 36, 0.4)'
            : '0 0 50px rgba(220, 38, 38, 0.8), 0 0 100px rgba(220, 38, 38, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = styles.boxShadow;
        }
      }}
    >
      {/* Rune texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 140, 0, 0.03) 10px,
              rgba(255, 140, 0, 0.03) 20px
            )
          `,
          pointerEvents: 'none'
        }}
      />
      
      {/* Glow orb */}
      <div
        className="runestone-glow"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, var(--card-glow) 0%, transparent 70%)',
          opacity: 0.2,
          filter: 'blur(20px)',
          pointerEvents: 'none',
          animation: 'runeGlow 3s ease-in-out infinite'
        }}
      />

      {/* Button content */}
      <span style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>

      <style jsx>{`
        @keyframes runeGlow {
          0%, 100% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
      `}</style>
    </button>
  );
}
