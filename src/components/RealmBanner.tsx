'use client';

import { RealmMode } from '@/types/tarot';
import './RealmBanner.css';

interface RealmBannerProps {
  mode: RealmMode;
  onChangeRealm: () => void;
}

const realmInfo = {
  love: {
    name: 'Realm of Love',
    description: 'You are consulting the spirits of connection and emotion',
    icon: '💕',
    color: '#fb923c'
  },
  fate: {
    name: 'Realm of Fate',
    description: 'You are consulting the spirits of destiny and choice',
    icon: '⚡',
    color: '#f97316'
  },
  shadows: {
    name: 'Realm of Shadows',
    description: 'You are consulting the spirits of fear and hidden truths',
    icon: '🌑',
    color: '#a3e635'
  }
};

export default function RealmBanner({ mode, onChangeRealm }: RealmBannerProps) {
  const realm = realmInfo[mode];

  return (
    <div
      className={`realm-banner realm-banner-${mode}`}
      style={{
        '--realm-color': realm.color,
      } as React.CSSProperties}
    >
      {/* Decorative glow */}
      <div className="realm-banner-glow" />

      <div className="realm-banner-content">
        <div className="realm-banner-info">
          <div className="realm-banner-icon">
            {realm.icon}
          </div>
          <div>
            <h3 className="realm-banner-title">
              {realm.name}
            </h3>
            <p className="realm-banner-description">
              {realm.description}
            </p>
          </div>
        </div>

        <button
          onClick={onChangeRealm}
          className="realm-banner-button"
        >
          Change Realm
        </button>
      </div>
    </div>
  );
}
