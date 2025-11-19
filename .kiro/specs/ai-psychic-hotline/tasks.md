# Implementation Plan

- [x] 1. Set up project structure and configuration
  - Initialize Next.js project with TypeScript
  - Configure Tailwind CSS for styling
  - Create directory structure: `/src/components`, `/src/services`, `/src/types`, `/src/app/api`, `/public/cards`, `/data`
  - Set up environment variables file with placeholders for API keys
  - Create `.gitignore` to exclude `.env.local` and `node_modules`
  - _Requirements: 9.3, 9.4_

- [x] 2. Create tarot deck data and type definitions
  - Define TypeScript interfaces for Card, ReadingResponse, and FortuneRequest in `/src/types/tarot.ts`
  - Create `tarot.json` in `/data` directory with at least 22 Major Arcana cards including id, name, uprightMeaning, reversedMeaning, and imageUrl
  - Add placeholder card images to `/public/cards` directory (can use simple colored rectangles with card names for MVP)
  - _Requirements: 7.1, 7.2_

- [x] 3. Implement backend TarotDeck service
  - Create `TarotDeck` class in `/src/services/TarotDeck.ts`
  - Implement `loadDeck()` method to read and validate tarot.json
  - Implement `drawCards(count: number)` method that randomly selects cards without replacement and assigns random orientations
  - Ensure card selection logic prevents duplicates within a single reading
  - _Requirements: 2.1, 2.2, 2.3, 7.3, 7.4_

- [x] 4. Implement backend FortuneService
  - Create `FortuneService` class in `/src/services/FortuneService.ts`
  - Implement `buildPrompt()` method that constructs LLM prompt with question, cards, meanings, and spooky tone instructions
  - Implement `callLLM()` method with OpenAI API integration, 5-second timeout, and error handling
  - Implement `generateFortune()` method that orchestrates prompt building and LLM calling
  - Parse and clean LLM response to extract fortune text
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Create backend API endpoint for fortune generation
  - Create `/src/app/api/fortune/route.ts` API route handler
  - Implement request validation (non-empty question, max 500 characters)
  - Integrate TarotDeck service to draw 3-5 cards
  - Integrate FortuneService to generate fortune based on question and cards
  - Return JSON response with cards array and fortune text
  - Implement error handling for validation errors (400), LLM failures (502), and server errors (500)
  - Add request logging without PII
  - _Requirements: 1.4, 2.4, 2.5, 3.4, 9.5, 10.1, 10.4_

- [x] 6. Implement frontend AppShell component
  - Create `AppShell` component in `/src/components/AppShell.tsx`
  - Implement dark theme with Halloween color palette (purples, blacks, oranges)
  - Add responsive layout that works on mobile and desktop
  - Manage global view state (input, loading, display, error)
  - Add spooky background styling and optional animated effects
  - _Requirements: 8.1, 8.2, 8.4_

- [x] 7. Implement QuestionInputPanel component
  - Create `QuestionInputPanel` component in `/src/components/QuestionInputPanel.tsx`
  - Add textarea for question input with character limit display
  - Implement "Summon the Spirits" submit button (disabled when empty or loading)
  - Add client-side validation for non-empty questions
  - Display validation error message when user tries to submit empty question
  - Handle loading state with visual feedback (spinner or disabled state)
  - _Requirements: 1.1, 1.2, 1.3, 8.3_

- [x] 8. Implement TarotSpreadView component
  - Create `TarotSpreadView` component in `/src/components/TarotSpreadView.tsx`
  - Display cards in horizontal or arc layout with responsive grid for mobile
  - Show card image, name, and orientation indicator (upright/reversed) for each card
  - Implement card flip animation on reveal
  - Handle loading state while cards are being generated
  - _Requirements: 2.4, 2.5, 8.1_

- [x] 9. Implement FortuneView component
  - Create `FortuneView` component in `/src/components/FortuneView.tsx`
  - Display fortune text with mystical typography and fade-in animation
  - Add "New Reading" button that clears current reading and returns to input state
  - Implement state management for clearing cards and fortune on new reading request
  - _Requirements: 2.5, 4.1, 4.2, 4.3_

- [x] 10. Implement ErrorBanner component
  - Create `ErrorBanner` component in `/src/components/ErrorBanner.tsx`
  - Display user-friendly error messages with themed styling (mystical purple/orange, not harsh red)
  - Add retry button that re-triggers the failed operation
  - Make banner dismissible
  - Map technical errors to user-friendly messages ("The spirits are silent", "The veil has torn", etc.)
  - _Requirements: 3.4, 10.1, 10.2_

- [x] 11. Wire up main page with complete reading flow
  - Create main page component in `/src/app/page.tsx`
  - Integrate AppShell, QuestionInputPanel, TarotSpreadView, FortuneView, and ErrorBanner
  - Implement state management for question, reading data, loading, and errors
  - Connect QuestionInputPanel submit to `/api/fortune` endpoint
  - Handle API response and update UI with cards and fortune
  - Implement error handling and display errors in ErrorBanner
  - Ensure "New Reading" button resets state and returns to input view
  - Verify complete flow: question input → loading → cards + fortune display → new reading
  - _Requirements: 1.4, 2.5, 4.1, 4.2, 4.3, 10.2, 10.3_

- [x] 12. Add basic end-to-end tests for core reading flow
  - Set up testing framework (Jest + React Testing Library)
  - Write test for complete reading flow: submit question → display cards and fortune
  - Write test for validation: empty question shows error
  - Write test for new reading: clears previous reading and returns to input
  - Write test for error handling: API failure shows error banner with retry
  - _Requirements: 1.2, 1.4, 4.2, 10.1, 10.2_

- [x] 13. Implement optional STT service and API endpoint
  - Create `STTService` class in `/src/services/STTService.ts` with OpenAI Whisper integration
  - Create `/src/app/api/stt/route.ts` API route that accepts audio blob and returns transcript
  - Implement timeout and error handling for STT API calls
  - Add configuration flag to enable/disable STT feature
  - _Requirements: 5.4, 5.6_

- [x] 14. Add voice input to QuestionInputPanel
  - Add "Speak Your Question" button to QuestionInputPanel (conditionally rendered if STT enabled)
  - Implement browser microphone permission request
  - Capture audio from microphone using Web Audio API
  - Send audio blob to `/api/stt` endpoint
  - Populate question input field with returned transcript
  - Display error message if STT fails, allow fallback to text input
  - Show recording indicator while capturing audio
  - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6_

- [x] 15. Implement optional TTS service and API endpoint
  - Create `TTSService` class in `/src/services/TTSService.ts` with TTS API integration (OpenAI TTS or ElevenLabs)
  - Create `/src/app/api/tts/route.ts` API route that accepts fortune text and returns audio URL or stream
  - Configure eerie/low-tone voice profile
  - Implement timeout and error handling for TTS API calls
  - Add configuration flag to enable/disable TTS feature
  - _Requirements: 6.2, 6.4_

- [x] 16. Add audio playback to FortuneView
  - Add "Hear Your Fortune" button to FortuneView (conditionally rendered if TTS enabled)
  - Send fortune text to `/api/tts` endpoint when button clicked
  - Play returned audio using Web Audio API
  - Show playing indicator during audio playback
  - Display error message if TTS fails, allow user to continue reading text
  - _Requirements: 6.1, 6.3, 6.4_

- [x] 17. Polish UI and add final styling touches
  - Refine dark theme colors and ensure consistent Halloween palette throughout
  - Add smooth transitions between view states (input → loading → display)
  - Enhance card flip animations and fortune fade-in effects
  - Add optional atmospheric effects (floating particles, fog, subtle animations)
  - Ensure all interactive elements have hover and focus states
  - Verify responsive design on various screen sizes
  - _Requirements: 8.1, 8.4_

- [x] 18. Add configuration and logging utilities
  - Create `Config` class in `/src/services/Config.ts` to load and validate environment variables
  - Create `Logger` class in `/src/services/Logger.ts` for structured logging
  - Ensure no PII (question text) is logged
  - Add performance timing logs for API calls
  - Validate all required API keys on application startup
  - _Requirements: 9.5, 10.4_

- [x] 19. Implement security measures
  - Add input sanitization for user questions before sending to LLM
  - Implement rate limiting on API endpoints to prevent abuse
  - Add CORS configuration for production
  - Add Content Security Policy headers
  - Verify API keys are never exposed to frontend
  - Test HTTPS enforcement in production environment
  - _Requirements: 9.2, 9.3, 9.4_

- [x] 20. Create deployment documentation
  - Document required environment variables in README
  - Create example `.env.local.example` file
  - Document hosting options (Vercel, Netlify, Railway)
  - Add instructions for obtaining API keys (OpenAI, etc.)
  - Document how to add/modify tarot deck data
  - Include troubleshooting section for common issues
  - _Requirements: 9.3_
