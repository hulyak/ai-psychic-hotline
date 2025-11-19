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
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{ color: '#f97316' }}
        >
          Choose Your Guide
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Select the voice that will interpret your cards
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {personas.map((persona) => {
          const isSelected = selectedPersona === persona.id;
          
          return (
            <button
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className="text-left p-4 rounded-lg transition-all duration-300"
              style={{
                background: isSelected 
                  ? 'rgba(249, 115, 22, 0.2)' 
                  : 'rgba(15, 23, 42, 0.6)',
                border: isSelected
                  ? '2px solid #f97316'
                  : '2px solid rgba(249, 115, 22, 0.3)',
                boxShadow: isSelected
                  ? '0 0 20px rgba(249, 115, 22, 0.4)'
                  : 'none',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 
                    className="text-lg font-semibold mb-1"
                    style={{ color: isSelected ? '#f97316' : '#e2e8f0' }}
                  >
                    {persona.name}
                  </h4>
                  <p 
                    className="text-sm mb-2"
                    style={{ color: '#94a3b8' }}
                  >
                    {persona.description}
                  </p>
                  <div 
                    className="text-xs px-2 py-1 rounded inline-block"
                    style={{
                      background: 'rgba(163, 230, 53, 0.1)',
                      color: '#a3e635',
                      border: '1px solid rgba(163, 230, 53, 0.3)',
                    }}
                  >
                    Voice: {persona.voice}
                  </div>
                </div>
                
                {isSelected && (
                  <div 
                    className="ml-3 flex-shrink-0"
                    style={{ color: '#f97316', fontSize: '1.5rem' }}
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
