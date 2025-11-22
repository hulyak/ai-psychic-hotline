'use client';

import { useState, useEffect } from 'react';
import { MovieRecommendation } from '@/types/tarot';
import MovieOracle from './MovieOracle';
import FateMeter from './FateMeter';
import ShareReading from './ShareReading';
import TypewriterText from './TypewriterText';
import RunestoneButton from './RunestoneButton';
import ReadingImageGenerator from './ReadingImageGenerator';
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
}

export default function FortuneView({
  fortune,
  movieRecommendation,
  onNewReading,
  cards,
  realm,
  deckName
}: FortuneViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedFortune, setDisplayedFortune] = useState(fortune);
  const [showTypewriter, setShowTypewriter] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [fortune]);



  const handleFateChoice = (choice: 'accept' | 'defy' | null, extraSentence: string) => {
    if (choice) {
      setDisplayedFortune(fortune + ' ' + extraSentence);
      setShowTypewriter(true); // Re-enable typewriter for new text
    } else {
      setDisplayedFortune(fortune);
      setShowTypewriter(true);
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
        <RunestoneButton onClick={onNewReading} variant="primary">
          <span className="fortune-btn-icon">🔮</span>
          <span> New Reading</span>
        </RunestoneButton>
      </div>

      {/* Movie Oracle */}
      {movieRecommendation && (
        <MovieOracle movieRecommendation={movieRecommendation} />
      )}

      {/* Reading Image Generator */}
      <ReadingImageGenerator
        fortune={displayedFortune}
        cards={cards}
        realm={realm}
      />

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
