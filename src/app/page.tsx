'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import RealmSelection from '@/components/RealmSelection';
import RealmBanner from '@/components/RealmBanner';
import QuestionInputPanel from '@/components/QuestionInputPanel';
import TarotSpreadView from '@/components/TarotSpreadView';
import ShufflingAnimation from '@/components/ShufflingAnimation';
import SpiritSpeaker from '@/components/SpiritSpeaker';
import FortuneView from '@/components/FortuneView';
import ErrorBanner from '@/components/ErrorBanner';
import SettingsPanel from '@/components/SettingsPanel';
import { RealmMode, DeckType, PersonaType } from '@/types/tarot';

interface Card {
  id: string;
  name: string;
  orientation: 'upright' | 'reversed';
  imageUrl: string;
}

interface ReadingData {
  cards: Card[];
  fortune: string;
  movieRecommendation?: {
    id: string;
    title: string;
    year: number;
    oneSentenceBlurb: string;
  };
  voiceRecommendation?: string;
}

type ViewState = 'realm-selection' | 'input' | 'loading' | 'display' | 'error';

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('realm-selection');
  const [selectedDeck] = useState<DeckType>('tarot'); // Always use tarot deck
  const [selectedRealm, setSelectedRealm] = useState<RealmMode | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('mystic');
  const [readingData, setReadingData] = useState<ReadingData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastQuestion, setLastQuestion] = useState<string>('');
  const [useAIImages, setUseAIImages] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const handleSelectRealm = (mode: RealmMode) => {
    setSelectedRealm(mode);
    setViewState('input');
  };

  const handleChangeRealm = () => {
    setViewState('realm-selection');
    setSelectedRealm(null);
    setReadingData(null);
    setErrorMessage('');
    setLastQuestion('');
  };

  const handleSubmitQuestion = async (question: string) => {
    if (!selectedRealm) return;

    setLastQuestion(question);
    setViewState('loading');
    setErrorMessage('');

    console.log('Submitting with persona:', selectedPersona);

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question,
          mode: selectedRealm,
          deckType: selectedDeck,
          generateImages: useAIImages,
          personaType: selectedPersona
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reading');
      }

      console.log('Received voiceRecommendation:', data.voiceRecommendation);

      setReadingData(data);
      setViewState('display');
    } catch (error: any) {
      console.error('Error fetching fortune:', error);
      setErrorMessage(error.message || 'The veil between worlds has torn. Please try again later.');
      setViewState('error');
    }
  };

  const handleNewReading = () => {
    setViewState('input');
    setReadingData(null);
    setErrorMessage('');
    setLastQuestion('');
  };

  const handleRetry = () => {
    if (lastQuestion) {
      handleSubmitQuestion(lastQuestion);
    } else {
      setViewState('input');
      setErrorMessage('');
    }
  };

  const handleDismissError = () => {
    setErrorMessage('');
    setViewState('input');
  };

  const handleSelectPersona = (persona: PersonaType) => {
    console.log('Persona changed to:', persona);
    console.log('Note: Get a NEW reading to hear the new voice');
    setSelectedPersona(persona);
  };

  return (
    <>
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        selectedPersona={selectedPersona}
        onSelectPersona={handleSelectPersona}
      />
      
      <AppShell onOpenSettings={() => setSettingsOpen(true)}>
      {/* Realm Selection View */}
      {viewState === 'realm-selection' && (
        <div
          className="flex items-center justify-center view-transition-enter"
          style={{ minHeight: '60vh' }}
        >
          <RealmSelection onSelectRealm={handleSelectRealm} />
        </div>
      )}

      {/* Main altar panel - shown after realm selection */}
      {viewState !== 'realm-selection' && (
        <div 
          className="rounded-3xl p-8 md:p-12 backdrop-blur-sm view-transition-enter"
        >
          {/* Error banner */}
          {viewState === 'error' && errorMessage && (
            <div className="mb-6">
              <ErrorBanner 
                message={errorMessage}
                onRetry={handleRetry}
                onDismiss={handleDismissError}
              />
            </div>
          )}

          {/* Single column centered layout */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Realm info */}
            {selectedRealm && (
              <div className="flex justify-center" style={{ marginTop: '2rem' }}>
                <RealmBanner 
                  mode={selectedRealm} 
                  onChangeRealm={handleChangeRealm}
                />
              </div>
            )}

            {/* Question area - only show when input */}
            {viewState === 'input' && (
              <div className="fade-in-up">
                <QuestionInputPanel
                  onSubmit={handleSubmitQuestion}
                  isLoading={false}
                  voiceEnabled={true}
                  realm={selectedRealm || undefined}
                />
                
                {/* AI Features Toggle */}
                <div className="mt-6 flex justify-center">
                  <label 
                    className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: 'rgba(249, 115, 22, 0.1)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={useAIImages}
                      onChange={(e) => setUseAIImages(e.target.checked)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                      ✨ Generate unique card images with DALL-E (slower)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Shuffling animation - show when loading */}
            {viewState === 'loading' && (
              <div className="fade-in-up">
                <ShufflingAnimation />
              </div>
            )}
            
            {/* Results area - cards and fortune */}
            {viewState === 'display' && readingData && (
              <div className="fade-in-up">
                <TarotSpreadView cards={readingData.cards} />

                {/* Spirit Speaker - Audio button */}
                <SpiritSpeaker
                  fortuneText={readingData.fortune}
                  enabled={true}
                  voiceId={readingData.voiceRecommendation}
                />

                <FortuneView
                  fortune={readingData.fortune}
                  movieRecommendation={readingData.movieRecommendation}
                  onNewReading={handleNewReading}
                  cards={readingData.cards}
                  realm={selectedRealm || 'fate'}
                  deckName="Traditional Tarot"
                />
              </div>
            )}
          </div>
        </div>
      )}
      </AppShell>
    </>
  );
}
