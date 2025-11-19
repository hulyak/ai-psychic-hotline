'use client';

import { PersonaType } from '@/types/tarot';
import { PERSONA_PRESETS } from '@/config/personas';

interface PersonaSelectorProps {
  selectedPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
}

export default function PersonaSelector({ selectedPersona, onSelectPersona }: PersonaSelectorProps) {
  const personas = Object.values(PERSONA_PRESETS);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium" style={{ color: '#94a3b8' }}>
        Choose Your Guide
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onSelectPersona(persona.id)}
            className="p-4 rounded-lg text-left transition-all"
            style={{
              background: selectedPersona === persona.id 
                ? 'rgba(163, 230, 53, 0.2)' 
                : 'rgba(15, 23, 42, 0.6)',
              border: selectedPersona === persona.id
                ? '2px solid #a3e635'
                : '2px solid rgba(163, 230, 53, 0.3)',
              boxShadow: selectedPersona === persona.id
                ? '0 0 20px rgba(163, 230, 53, 0.4)'
                : 'none'
            }}
          >
            <div className="font-semibold mb-2" style={{ color: '#e2e8f0' }}>
              {persona.name}
            </div>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              {persona.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
