'use client';

import { useState } from 'react';
import { ShareImageService } from '@/services/ShareImageService';
import RunestoneButton from './RunestoneButton';

interface Card {
  id: string;
  name: string;
  orientation: 'upright' | 'reversed';
  imageUrl: string;
}

interface ShareReadingProps {
  fortune: string;
  cards: Card[];
  realm: string;
  deckName: string;
}

export default function ShareReading({ fortune, cards, realm, deckName }: ShareReadingProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const generateShareText = () => {
    const cardList = cards.map(c => `${c.name} (${c.orientation})`).join(', ');
    return `🔮 My ${realm} reading:\n\nCards: ${cardList}\n\n"${fortune}"\n\n✨ Get your own reading at AI Psychic Hotline`;
  };

  const handleShareText = async () => {
    const shareText = generateShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Psychic Reading',
          text: shareText
        });
      } catch (error) {
        // User cancelled or error occurred
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const handleGenerateImage = async () => {
    setGenerating(true);
    
    try {
      const shareImageService = new ShareImageService();
      const imageDataUrl = await shareImageService.generateImage({
        cards,
        fortune,
        realm,
        deckName,
        date: new Date()
      });
      
      setPreviewImage(imageDataUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (!previewImage) return;
    
    const shareImageService = new ShareImageService();
    const filename = `tarot-reading-${Date.now()}.png`;
    shareImageService.downloadImage(previewImage, filename);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginTop: '4rem' }}>
      {/* Action buttons */}
      <div className="flex flex-wrap justify-center" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Share text button */}
        <RunestoneButton onClick={handleShareText} variant="secondary">
          {copied ? '✓ Copied!' : '📤 Share Text'}
        </RunestoneButton>

        {/* Generate image button */}
        <RunestoneButton 
          onClick={handleGenerateImage} 
          disabled={generating}
          variant="primary"
        >
          {generating ? '⏳ Generating...' : '🖼️ Generate Image'}
        </RunestoneButton>

        {/* Download button (shown when image is ready) */}
        {previewImage && (
          <RunestoneButton onClick={handleDownloadImage} variant="primary">
            ⬇️ Download Image
          </RunestoneButton>
        )}
      </div>

      {/* Image preview */}
      {previewImage && (
        <div className="mt-8">
          <p 
            className="text-center mb-3 text-sm"
            style={{ color: '#94a3b8' }}
          >
            Preview:
          </p>
          <div 
            className="rounded-lg overflow-hidden"
            style={{
              border: '2px solid rgba(249, 115, 22, 0.3)',
              boxShadow: '0 0 20px rgba(249, 115, 22, 0.2)'
            }}
          >
            <img 
              src={previewImage} 
              alt="Reading preview" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
