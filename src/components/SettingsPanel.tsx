'use client';

import { PersonaType } from '@/types/tarot';
import PersonaSelection from './PersonaSelection';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
}

export default function SettingsPanel({ 
  isOpen, 
  onClose, 
  selectedPersona, 
  onSelectPersona 
}: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 overflow-y-auto transition-transform duration-300"
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'linear-gradient(135deg, #0b1120 0%, #020617 100%)',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.5)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 flex items-center justify-between"
          style={{
            padding: '1.5rem 2rem',
            background: 'rgba(2, 6, 23, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '2px solid rgba(249, 115, 22, 0.3)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '1.75rem', filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.6))' }}>
              ⚙️
            </span>
            <h2 
              style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#f97316',
                margin: 0,
                letterSpacing: '0.02em',
                textShadow: '0 0 12px rgba(249, 115, 22, 0.3)'
              }}
            >
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="transition-all duration-200"
            style={{ 
              color: '#94a3b8',
              background: 'rgba(249, 115, 22, 0.1)',
              border: '2px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              padding: '0.5rem 0.75rem',
              fontSize: '1.5rem',
              lineHeight: 1,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.2)';
              e.currentTarget.style.color = '#f97316';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)';
              e.currentTarget.style.color = '#94a3b8';
            }}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          <PersonaSelection
            selectedPersona={selectedPersona}
            onSelectPersona={onSelectPersona}
          />
        </div>
      </div>
    </>
  );
}
