'use client';

import { useState, useEffect } from 'react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [message]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  return (
    <div className={`
      w-full
      transform transition-all duration-300
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
    `}>
      <div 
        className="rounded-2xl p-4"
        style={{
          background: '#1f2933',
          border: '1px solid #7f1d1d'
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 text-2xl">
            ⚠️
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 
              className="text-base font-medium mb-1"
              style={{ color: '#fca5a5' }}
            >
              The spirits are silent
            </h3>
            <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>
              {message}
            </p>
          </div>

          {/* Dismiss button */}
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 transition-colors"
              style={{ color: '#9ca3af' }}
              aria-label="Dismiss"
              onMouseEnter={(e) => e.currentTarget.style.color = '#fca5a5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
        </div>

        {/* Retry button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onRetry}
            className="px-6 py-2 rounded-full font-medium transition-all duration-300"
            style={{
              background: 'var(--accent-primary)',
              color: '#020617',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fb923c';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(249, 115, 22, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(249, 115, 22, 0.3)';
            }}
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
