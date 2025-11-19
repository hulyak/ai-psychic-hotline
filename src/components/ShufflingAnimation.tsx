'use client';

import './ShufflingAnimation.css';

export default function ShufflingAnimation() {
  return (
    <div className="shuffling-container">
      <div className="shuffling-cards">
        {[0, 1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="shuffle-card"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <svg
              width="80"
              height="120"
              viewBox="0 0 80 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Card background */}
              <rect
                width="80"
                height="120"
                rx="4"
                fill="#0b1120"
                stroke="#f97316"
                strokeWidth="2"
              />
              
              {/* Inner border */}
              <rect
                x="6"
                y="6"
                width="68"
                height="108"
                rx="2"
                fill="none"
                stroke="#a3e635"
                strokeWidth="1"
                opacity="0.6"
              />
              
              {/* Mystical pattern */}
              <circle
                cx="40"
                cy="60"
                r="20"
                fill="none"
                stroke="#f97316"
                strokeWidth="1.5"
                opacity="0.4"
              />
              <circle
                cx="40"
                cy="60"
                r="15"
                fill="none"
                stroke="#a3e635"
                strokeWidth="1"
                opacity="0.3"
              />
              <circle
                cx="40"
                cy="60"
                r="10"
                fill="none"
                stroke="#f97316"
                strokeWidth="1"
                opacity="0.5"
              />
              
              {/* Center star */}
              <path
                d="M40 50 L42 56 L48 56 L43 60 L45 66 L40 62 L35 66 L37 60 L32 56 L38 56 Z"
                fill="#f97316"
                opacity="0.6"
              />
            </svg>
          </div>
        ))}
      </div>
      
      <div className="shuffling-text loading-pulse">
        <span className="shuffle-word">Shuffling</span>
        <span className="shuffle-word">the</span>
        <span className="shuffle-word">deck</span>
        <span className="shuffle-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
}
