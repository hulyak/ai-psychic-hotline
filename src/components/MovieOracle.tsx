'use client';

import { MovieRecommendation } from '@/types/tarot';
import './MovieOracle.css';

interface MovieOracleProps {
  movieRecommendation: MovieRecommendation;
}

export default function MovieOracle({ movieRecommendation }: MovieOracleProps) {
  return (
    <div className="movie-oracle-container">
      <div className="movie-oracle-glow" />

      {/* Header */}
      <div className="movie-oracle-header">
        <span className="movie-oracle-icon">🎬</span>
        <h3 className="movie-oracle-title">
          This reading feels like...
        </h3>
      </div>

      {/* Movie Info */}
      <div className="movie-oracle-content">
        <h4 className="movie-title">
          {movieRecommendation.title} ({movieRecommendation.year})
        </h4>
        <p className="movie-blurb">
          {movieRecommendation.oneSentenceBlurb}
        </p>
      </div>
    </div>
  );
}
