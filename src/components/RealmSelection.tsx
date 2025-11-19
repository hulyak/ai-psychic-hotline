'use client';

import { RealmMode, Realm } from '@/types/tarot';
import './RealmSelection.css';

interface RealmSelectionProps {
  onSelectRealm: (mode: RealmMode) => void;
}

const realms: Realm[] = [
  {
    id: 'love',
    name: 'Realm of Love',
    description: 'Explore matters of the heart, relationships, and emotional connections',
    icon: '💕',
    color: '#fb923c' // warm orange
  },
  {
    id: 'fate',
    name: 'Realm of Fate',
    description: 'Discover your path through career choices and life-defining decisions',
    icon: '⚡',
    color: '#f97316' // golden orange
  },
  {
    id: 'shadows',
    name: 'Realm of Shadows',
    description: 'Confront hidden fears, anxieties, and the truths that lurk in darkness',
    icon: '🌑',
    color: '#a3e635' // eerie green
  }
];

export default function RealmSelection({ onSelectRealm }: RealmSelectionProps) {
  return (
    <div className="realm-selection-container">
      {/* Header */}
      <div className="realm-header">
        <h2 className="realm-heading">
          Choose Your Realm
        </h2>
        <p className="realm-subtitle">
          Each realm holds different mysteries...
        </p>
      </div>

      {/* Realm Cards Grid */}
      <div className="realm-grid">
        {realms.map((realm) => (
          <button
            key={realm.id}
            onClick={() => onSelectRealm(realm.id)}
            className={`realm-card realm-card-${realm.id}`}
            style={{
              '--realm-color': realm.color,
            } as React.CSSProperties}
          >
            {/* Glow effect on hover */}
            <div className="realm-card-glow" />

            {/* Card Content */}
            <div className="realm-card-content">
              {/* Icon + Name Row */}
              <div className="realm-card-header">
                <span className="realm-icon">
                  {realm.icon}
                </span>
                <h3 className="realm-name">
                  {realm.name}
                </h3>
              </div>

              {/* Description */}
              <p className="realm-description">
                {realm.description}
              </p>

              {/* Call to Action */}
              <div className="realm-cta">
                <span>Enter Realm</span>
                <span className="realm-arrow">→</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom hint */}
      <p className="realm-hint">
        Choose wisely... each realm reveals different truths
      </p>
    </div>
  );
}
