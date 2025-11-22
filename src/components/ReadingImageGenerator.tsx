'use client';

import { useState } from 'react';
import RunestoneButton from './RunestoneButton';

interface Card {
  id: string;
  name: string;
  orientation: 'upright' | 'reversed';
}

interface ReadingImageGeneratorProps {
  fortune: string;
  cards: Card[];
  realm: string;
}

export default function ReadingImageGenerator({
  fortune,
  cards,
  realm
}: ReadingImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Create a prompt based on the reading
      const cardNames = cards.map(c => c.name).join(', ');
      const prompt = `A mystical tarot reading visualization for the ${realm} realm. Cards drawn: ${cardNames}. ${fortune.substring(0, 200)}. Dark atmospheric style with glowing effects.`;

      const response = await fetch('/api/generate-reading-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, realm }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error('Image generation error:', err);
      setError(err.message || 'The spirits could not manifest an image');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      // Try to fetch with CORS
      const response = await fetch(imageUrl, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tarot-reading-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (err) {
      console.error('Download error:', err);
      
      // Fallback: open in new tab if CORS fails
      try {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = `tarot-reading-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackErr) {
        console.error('Fallback download error:', fallbackErr);
        alert('Could not download image. Please right-click the image and select "Save Image As..."');
      }
    }
  };

  return (
    <div style={{ 
      position: 'relative',
      padding: '2rem 1.75rem',
      marginTop: '2.5rem',
      borderRadius: '1.25rem',
      background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.45) 0%, rgba(17, 24, 39, 0.5) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(249, 115, 22, 0.35)',
      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.45), 0 0 40px rgba(249, 115, 22, 0.15)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '8rem',
        height: '8rem',
        opacity: 0.1,
        background: 'radial-gradient(circle at top left, #f97316 0%, transparent 70%)',
        filter: 'blur(25px)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        marginBottom: '1.25rem',
        position: 'relative',
        zIndex: 10
      }}>
        <span style={{ 
          fontSize: '1.875rem',
          lineHeight: 1,
          filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))'
        }}>
          🎨
        </span>
        <h3 style={{ 
          fontFamily: 'var(--font-heading)',
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#f97316',
          textShadow: '0 0 12px rgba(249, 115, 22, 0.3)',
          letterSpacing: '0.02em',
          margin: 0
        }}>
          Manifest Your Reading
        </h3>
      </div>

      {/* Description */}
      <p style={{ 
        fontFamily: 'var(--font-body)',
        fontSize: '1rem',
        fontStyle: 'italic',
        lineHeight: 1.6,
        color: '#94a3b8',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
        marginBottom: '1.5rem',
        position: 'relative',
        zIndex: 10
      }}>
        Create a unique AI-generated visualization of your tarot reading
      </p>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '0.75rem',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          fontSize: '0.875rem',
          position: 'relative'
        }}>
          {error}
        </div>
      )}

      {imageUrl ? (
        <div style={{ position: 'relative' }}>
          <div style={{
            padding: '1rem',
            background: 'rgba(2, 6, 23, 0.6)',
            borderRadius: '1rem',
            marginBottom: '1.5rem'
          }}>
            <img 
              src={imageUrl} 
              alt="AI-generated visualization of your tarot reading"
              style={{
                width: '100%',
                maxWidth: '512px',
                height: 'auto',
                margin: '0 auto',
                display: 'block',
                borderRadius: '0.75rem',
                border: '2px solid rgba(249, 115, 22, 0.5)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 40px rgba(249, 115, 22, 0.2)'
              }}
            />
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <RunestoneButton onClick={downloadImage} variant="primary">
              <span>⬇️</span>
              <span> Download</span>
            </RunestoneButton>
            <RunestoneButton onClick={() => setImageUrl(null)} variant="secondary">
              <span>🔄</span>
              <span> New Image</span>
            </RunestoneButton>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <RunestoneButton 
            onClick={generateImage} 
            variant="primary"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span> Manifesting...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span> Generate Image</span>
              </>
            )}
          </RunestoneButton>
          <p style={{
            marginTop: '1rem',
            fontSize: '0.8rem',
            color: '#a68a6d',
            fontStyle: 'italic'
          }}>
            Takes ~30 seconds to generate
          </p>
        </div>
      )}
    </div>
  );
}
