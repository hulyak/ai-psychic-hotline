'use client';

import { useState, useEffect, useRef } from 'react';
import { MovieRecommendation } from '@/types/tarot';
import MovieOracle from './MovieOracle';
import FateMeter from './FateMeter';
import ShareReading from './ShareReading';
import TypewriterText from './TypewriterText';
import RunestoneButton from './RunestoneButton';
import './FortuneView.css';

interface Card {
  id: string;
  name: string;
  orientation: 'upright' | 'reversed';
  imageUrl: string;
}

interface FortuneViewProps {
  fortune: string;
  movieRecommendation?: MovieRecommendation;
  onNewReading: () => void;
  cards: Card[];
  realm: string;
  deckName: string;
  ttsEnabled?: boolean;
  voiceId?: string;
}

export default function FortuneView({
  fortune,
  movieRecommendation,
  onNewReading,
  cards,
  realm,
  deckName,
  ttsEnabled = false,
  voiceId = 'onyx'
}: FortuneViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedFortune, setDisplayedFortune] = useState(fortune);
  const [showTypewriter, setShowTypewriter] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [fortune]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleFateChoice = (choice: 'accept' | 'defy' | null, extraSentence: string) => {
    if (choice) {
      setDisplayedFortune(fortune + ' ' + extraSentence);
      setShowTypewriter(true); // Re-enable typewriter for new text
    } else {
      setDisplayedFortune(fortune);
      setShowTypewriter(true);
    }
  };

  const handlePlayAudio = async () => {
    // Stop current audio if playing
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsPlayingAudio(true);
      setAudioError('');

      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: displayedFortune,
          voice: voiceId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        setAudioError('The spirits cannot speak at this time.');
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlayingAudio(false);
      setAudioError('The spirits cannot speak at this time.');
    }
  };

  return (
    <div className={`fortune-view-container ${isVisible ? 'visible' : ''}`}>
      {/* Fortune Box */}
      <div className="fortune-box">
        <div className="fortune-box-glow" />

        {/* Intro line */}
        <div className="fortune-intro">
          <div className="fortune-pulse-dot" />
          <p className="fortune-intro-text">
            The cards whisper…
          </p>
        </div>

        {/* Fortune text with typewriter effect */}
        <p className="fortune-text">
          {showTypewriter ? (
            <TypewriterText 
              text={displayedFortune}
              speed={30}
              onComplete={() => setShowTypewriter(false)}
            />
          ) : (
            displayedFortune
          )}
        </p>
      </div>

      {/* Controls */}
      <div className="fortune-controls">
        {ttsEnabled && (
          <RunestoneButton 
            onClick={handlePlayAudio} 
            variant="secondary"
            disabled={isPlayingAudio}
          >
            <span className="fortune-btn-icon">
              {isPlayingAudio ? '⏸️' : '🔊'}
            </span>
            <span> {isPlayingAudio ? 'The Spirits Speak...' : 'Hear Your Fortune'}</span>
          </RunestoneButton>
        )}
        
        <RunestoneButton onClick={onNewReading} variant="primary">
          <span className="fortune-btn-icon">🔮</span>
          <span> New Reading</span>
        </RunestoneButton>
      </div>

      {/* Audio Error Message */}
      {audioError && (
        <div className="audio-error-message">
          {audioError}
        </div>
      )}

      {/* Movie Oracle */}
      {movieRecommendation && (
        <MovieOracle movieRecommendation={movieRecommendation} />
      )}

      {/* Fate Meter */}
      <FateMeter onFateChoice={handleFateChoice} />

      {/* Share Reading - with extra spacing */}
      <div className="mt-16">
        <ShareReading
          fortune={displayedFortune}
          cards={cards}
          realm={realm}
          deckName={deckName}
        />
      </div>
    </div>
  );
}
