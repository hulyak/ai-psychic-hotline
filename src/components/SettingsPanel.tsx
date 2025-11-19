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
          className="sticky top-0 z-10 p-6 flex items-center justify-between"
          style={{
            background: 'rgba(2, 6, 23, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(249, 115, 22, 0.3)',
          }}
        >
          <h2 
            className="text-2xl font-bold"
            style={{ color: '#f97316' }}
          >
            ⚙️ Settings
          </h2>
          <button
            onClick={onClose}
            className="text-3xl leading-none transition-colors"
            style={{ 
              color: '#94a3b8',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <PersonaSelection
            selectedPersona={selectedPersona}
            onSelectPersona={onSelectPersona}
          />
        </div>
      </div>
    </>
  );
}
