'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import VoiceInput from './VoiceInput';
import { RealmMode } from '@/types/tarot';
import './QuestionInputPanel.css';

interface QuestionInputPanelProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  voiceEnabled?: boolean;
  realm?: RealmMode;
}

const SUGGESTED_QUESTIONS: Record<RealmMode, string[]> = {
  love: [
    "Will I find love this year?",
    "Is my current relationship meant to last?",
    "How can I heal from heartbreak?",
    "Should I take a chance on someone new?"
  ],
  fate: [
    "Should I take this new job opportunity?",
    "What does my future hold?",
    "Am I on the right path in life?",
    "Will my hard work pay off?"
  ],
  shadows: [
    "What am I most afraid of?",
    "What hidden truth am I avoiding?",
    "What darkness lurks in my future?",
    "What secret will soon be revealed?"
  ]
};

export default function QuestionInputPanel({
  onSubmit,
  isLoading,
  voiceEnabled = false,
  realm
}: QuestionInputPanelProps) {
  const [questionText, setQuestionText] = useState('');
  const [validationError, setValidationError] = useState('');
  const maxLength = 500;

  const suggestedQuestions = realm ? SUGGESTED_QUESTIONS[realm] : [];

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuestionText(value);

    if (validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmed = questionText.trim();

    if (trimmed.length === 0) {
      setValidationError('Please enter a question to consult the spirits.');
      return;
    }

    if (trimmed.length > maxLength) {
      setValidationError(`Your question is too long. Please keep it under ${maxLength} characters.`);
      return;
    }

    onSubmit(trimmed);
  };

  const remainingChars = maxLength - questionText.length;

  return (
    <div className="question-input-container">
      <form onSubmit={handleSubmit} className="question-form">
        {/* Validation error */}
        {validationError && (
          <div className="question-error">
            {validationError}
          </div>
        )}

        {/* Input container */}
        <div className={`question-input-box ${validationError ? 'question-input-error' : ''}`}>
          {/* Decorative glow */}
          <div className="question-input-glow" />

          {/* Label with icon and voice input */}
          <div className="flex items-center justify-between mb-2">
            <label className="question-label">
              <span className="question-label-icon">🔮</span>
              <span>Ask the Spirits</span>
            </label>
            
            {voiceEnabled && (
              <VoiceInput 
                onTranscription={(text) => setQuestionText(text)}
                disabled={isLoading}
              />
            )}
          </div>

          <textarea
            value={questionText}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="What mysteries shall we unveil..."
            rows={3}
            maxLength={maxLength}
            className="question-textarea"
          />

          {/* Character count */}
          <div className="question-char-count">
            {remainingChars} / {maxLength}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || questionText.trim().length === 0}
          className={`question-submit-button ${
            isLoading || questionText.trim().length === 0 ? 'disabled' : ''
          }`}
        >
          {/* Shimmer effect */}
          {!isLoading && questionText.trim().length > 0 && (
            <div className="question-button-shimmer" />
          )}

          <span className="question-button-content">
            {isLoading ? (
              <>
                <svg className="question-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Consulting the Spirits</span>
              </>
            ) : (
              <>
                <span className="question-button-icon">✨</span>
                <span>Summon Reading</span>
              </>
            )}
          </span>
        </button>

        {/* Suggested questions */}
        {!isLoading && questionText.trim().length === 0 && suggestedQuestions.length > 0 && (
          <div className="mt-4">
            <p className="text-sm mb-3" style={{ color: '#a68a6d' }}>
              Or choose a question:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setQuestionText(question)}
                  className="suggested-question-button"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hint text */}
        {!isLoading && questionText.trim().length === 0 && suggestedQuestions.length === 0 && (
          <p className="question-hint">
            The spirits await your question...
          </p>
        )}
      </form>
    </div>
  );
}
