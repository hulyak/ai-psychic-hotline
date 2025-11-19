'use client';

import { useState } from 'react';
import './FateMeter.css';

type FateChoice = 'accept' | 'defy' | null;

interface FateMeterProps {
  onFateChoice: (choice: FateChoice, extraSentence: string) => void;
}

export default function FateMeter({ onFateChoice }: FateMeterProps) {
  const [choice, setChoice] = useState<FateChoice>(null);

  const handleChoice = (selectedChoice: 'accept' | 'defy') => {
    setChoice(selectedChoice);

    const extraSentences = {
      accept: "The spirits nod in quiet approval of your resolve.",
      defy: "The spirits watch with a crooked smile as you defy their warning."
    };

    onFateChoice(selectedChoice, extraSentences[selectedChoice]);
  };

  const getFateMeterText = () => {
    if (!choice) return null;

    return choice === 'accept'
      ? "Fate meter: Blessed (for now…)"
      : "Fate meter: Tempting the spirits…";
  };

  return (
    <div className="fate-meter-container">
      <div className="fate-meter-glow" />

      {!choice ? (
        <>
          {/* Question */}
          <h3 className="fate-meter-question">
            How will you face this omen?
          </h3>

          {/* Choice Buttons */}
          <div className="fate-meter-buttons">
            <button
              type="button"
              onClick={() => handleChoice('accept')}
              className="fate-accept-btn"
            >
              ✨ Accept the Omen
            </button>

            <button
              type="button"
              onClick={() => handleChoice('defy')}
              className="fate-defy-btn"
            >
              ⚡ Defy the Omen
            </button>
          </div>
        </>
      ) : (
        /* Fate Meter Display */
        <div className="fate-meter-result">
          <p className={`fate-meter-text ${choice}`}>
            {getFateMeterText()}
          </p>
        </div>
      )}
    </div>
  );
}
