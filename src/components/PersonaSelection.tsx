'use client';

import { PersonaType } from '@/types/tarot';
import { PERSONA_PRESETS } from '@/config/personas';

interface PersonaSelectionProps {
  selectedPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
}

export default function PersonaSelection({ selectedPersona, onSelectPersona }: PersonaSelectionProps) {
  const personas = Object.values(PERSONA_PRESETS);

  return (
    <div>
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h3 
          style={{ 
            fontFamily: 'var(--font-heading)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: '#f97316',
            marginBottom: '0.75rem',
            letterSpacing: '0.02em',
            textShadow: '0 0 12px rgba(249, 115, 22, 0.3)'
          }}
        >
          Choose Your Guide
        </h3>
        <p style={{ 
          fontFamily: 'var(--font-body)',
          color: '#94a3b8', 
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          margin: 0,
          marginBottom: '0.5rem'
        }}>
          Select the voice that will interpret your cards
        </p>
        <p style={{ 
          fontFamily: 'var(--font-body)',
          color: '#f97316', 
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          margin: 0,
          fontStyle: 'italic'
        }}>
          ✨ Get a new reading to hear the new voice
        </p>
      </div>

      <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
        {personas.map((persona) => {
          const isSelected = selectedPersona === persona.id;
          
          return (
            <button
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className="text-left transition-all duration-300"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '0.75rem',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0.15) 100%)' 
                  : 'rgba(15, 23, 42, 0.6)',
                border: isSelected
                  ? '2px solid #f97316'
                  : '2px solid rgba(249, 115, 22, 0.25)',
                boxShadow: isSelected
                  ? '0 4px 20px rgba(249, 115, 22, 0.3), 0 0 40px rgba(249, 115, 22, 0.15)'
                  : '0 2px 8px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 
                    style={{ 
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: isSelected ? '#f97316' : '#e2e8f0',
                      marginBottom: '0.5rem',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {persona.name}
                  </h4>
                  <p 
                    style={{ 
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: '#94a3b8',
                      lineHeight: 1.5,
                      marginBottom: '0.75rem'
                    }}
                  >
                    {persona.description}
                  </p>
                  <div 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.375rem',
                      background: 'rgba(163, 230, 53, 0.1)',
                      color: '#a3e635',
                      border: '1px solid rgba(163, 230, 53, 0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    <span>🎤</span>
                    <span>{persona.voice}</span>
                  </div>
                </div>
                
                {isSelected && (
                  <div 
                    className="ml-4 flex-shrink-0"
                    style={{ 
                      color: '#f97316', 
                      fontSize: '1.75rem',
                      filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.6))'
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
