'use client';

import { useState, useRef } from 'react';
import './SpiritSpeaker.css';

interface SpiritSpeakerProps {
  fortuneText: string;
  enabled?: boolean;
  voiceId?: string;
}

export default function SpiritSpeaker({ fortuneText, enabled = false, voiceId = 'onyx' }: SpiritSpeakerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = async () => {
    if (isPlaying) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);

      // Use the provided voiceId or default to onyx
      const selectedVoice = voiceId || 'onyx';
      console.log('Using voice:', selectedVoice);

      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: fortuneText,
          voice: selectedVoice
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
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      alert('The spirits cannot speak at this time.');
    }
  };

  if (!enabled) {
    return null;
  }

  return (
    <div className="spirit-speaker-container">
      <button
        type="button"
        onClick={playAudio}
        disabled={isPlaying}
        className={`spirit-speaker-button ${isPlaying ? 'playing' : ''}`}
      >
        <span className="spirit-speaker-icon">
          {isPlaying ? '⏸️' : '🔊'}
        </span>
        <span className="spirit-speaker-text">
          {isPlaying ? 'The Spirits Speak...' : 'Hear the Spirits'}
        </span>
      </button>
    </div>
  );
}
