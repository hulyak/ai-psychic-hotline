# Requirements Document

## Introduction

The AI Psychic Hotline is a web-based "digital psychic" experience that demonstrates the Frankenstein theme by stitching together multiple AI services (LLM, STT, TTS, and tarot visuals) into one seamless, spooky fortune-telling application. Users ask questions via text or voice and receive tarot card spreads with AI-generated fortunes that can optionally be read aloud in an eerie voice.

## Glossary

- **System**: The AI Psychic Hotline web application (frontend and backend)
- **User**: Any person interacting with the web frontend
- **Reading**: One completed cycle of user question → tarot card selection → fortune generation → display
- **LLM**: External large language model API used to generate fortune text
- **STT**: Speech-to-text service used to convert audio questions to text
- **TTS**: Text-to-speech service used to read fortunes aloud
- **Tarot Deck**: Structured data containing card identifiers, names, meanings, and images
- **Card**: A single tarot card with properties including id, name, upright meaning, reversed meaning, and image
- **Spread**: A collection of 3 to 5 tarot cards selected for a single reading
- **Fortune**: The AI-generated text response based on the user's question and selected cards

## Requirements

### Requirement 1

**User Story:** As a user, I want to select a mystical realm before asking my question, so that I receive guidance tailored to my specific concern

#### Acceptance Criteria

1. WHEN the user first loads the application, THE System SHALL display a realm selection interface with three realm options
2. THE System SHALL provide the following realm choices: Realm of Love (relationships and emotions), Realm of Fate (career and decisions), and Realm of Shadows (fears and anxieties)
3. WHEN the user selects a realm, THE System SHALL store the selected realm mode and transition to the question input interface
4. THE System SHALL display the selected realm name and description above the question input area
5. THE System SHALL provide a control to change the selected realm and return to realm selection

### Requirement 2

**User Story:** As a user, I want to enter my question as text, so that I can receive a psychic reading without using my voice

#### Acceptance Criteria

1. THE System SHALL provide a text input field for the user to enter a question
2. WHEN the user attempts to submit an empty question, THE System SHALL prevent submission and display a validation message
3. THE System SHALL accept questions containing alphanumeric characters, punctuation, and spaces
4. WHEN the user submits a valid non-empty question, THE System SHALL initiate the reading generation process

### Requirement 3

**User Story:** As a user, I want to see a tarot card spread with my fortune, so that I can receive mystical guidance on my question

#### Acceptance Criteria

1. WHEN the System generates a reading, THE System SHALL select between 3 and 5 tarot cards from the deck
2. WHEN the System selects cards for a reading, THE System SHALL ensure no card appears more than once in the same reading
3. WHEN the System selects cards for a reading, THE System SHALL randomly determine each card's orientation as either upright or reversed
4. WHEN the System displays a reading, THE System SHALL show each card's name, orientation, and associated image
5. WHEN the System displays a reading, THE System SHALL present the AI-generated fortune text below the card spread

### Requirement 11

**User Story:** As a user, I want the AI to generate a spooky fortune based on my question and the cards drawn, so that I receive a personalized mystical experience

#### Acceptance Criteria

1. WHEN the System generates a fortune, THE System SHALL construct an LLM prompt containing the user's question, selected realm mode, selected card names, card meanings, and tone instructions
2. WHEN the System constructs an LLM prompt for the Realm of Love, THE System SHALL use romantic and emotional language focused on relationships
3. WHEN the System constructs an LLM prompt for the Realm of Fate, THE System SHALL use practical and destiny-focused language about choices and paths
4. WHEN the System constructs an LLM prompt for the Realm of Shadows, THE System SHALL use dark and ominous language about fears and hidden truths
5. WHEN the System receives an LLM response, THE System SHALL parse the response into a fortune text string
6. WHEN the LLM API call fails or times out, THE System SHALL display a user-friendly error message and provide a retry control
7. THE System SHALL generate and display a complete reading within 5 seconds in 90 percent of cases under normal network conditions

### Requirement 11

**User Story:** As a user, I want to start a new reading after viewing my current one, so that I can ask multiple questions in one session

#### Acceptance Criteria

1. WHEN a reading is displayed, THE System SHALL provide a control to start a new reading
2. WHEN the user activates the new reading control, THE System SHALL clear the currently displayed cards and fortune text
3. WHEN the user activates the new reading control, THE System SHALL return the interface to the question input state
4. THE System SHALL not persist reading data beyond the current browser session

### Requirement 11

**User Story:** As a user, I want to ask my question using my voice, so that I can interact with the psychic hotline hands-free

#### Acceptance Criteria

1. WHERE voice input is enabled, THE System SHALL provide a control to activate voice input
2. WHEN the user activates voice input, THE System SHALL request microphone permissions from the browser
3. WHEN the user grants microphone permissions, THE System SHALL capture audio from the user's microphone
4. WHEN audio capture completes, THE System SHALL send the audio to the STT service
5. WHEN the STT service returns a transcript, THE System SHALL populate the question input field with the transcribed text
6. WHEN the STT service fails or times out, THE System SHALL display a user-friendly error message and allow the user to continue with text input

### Requirement 11

**User Story:** As a user, I want to hear my fortune read aloud in a creepy voice, so that the experience feels more immersive and atmospheric

#### Acceptance Criteria

1. WHERE text-to-speech is enabled, WHEN a reading is displayed, THE System SHALL provide a control to play audio of the fortune
2. WHEN the user activates the TTS control, THE System SHALL send the fortune text to the TTS service or browser TTS engine
3. WHEN the TTS service returns audio, THE System SHALL play the audio using an eerie or low-tone voice profile
4. WHEN TTS playback fails, THE System SHALL display a user-friendly error message and allow the user to continue reading the text fortune

### Requirement 11

**User Story:** As a developer, I want the tarot deck to be stored as structured data, so that cards can be reliably selected and displayed

#### Acceptance Criteria

1. THE System SHALL store the tarot deck as structured data containing card identifier, card name, upright meaning text, reversed meaning text, and image path or URL
2. THE System SHALL ensure the tarot deck data is deterministic and version-controlled
3. WHEN the System selects cards, THE System SHALL draw from the complete tarot deck dataset
4. THE System SHALL load tarot deck data before processing any reading requests

### Requirement 11

**User Story:** As a user, I want the application to work on my mobile device, so that I can get readings anywhere

#### Acceptance Criteria

1. THE System SHALL render a responsive layout that adapts to mobile and desktop screen sizes
2. THE System SHALL function on the latest versions of Chrome, Firefox, Safari, and Edge browsers
3. THE System SHALL present the main question submission action within two steps from application load
4. THE System SHALL use a dark theme with Halloween color palette for visual styling

### Requirement 11

**User Story:** As a user, I want my privacy protected, so that my questions remain confidential

#### Acceptance Criteria

1. THE System SHALL not store personally identifiable information beyond the current browser session
2. THE System SHALL communicate with external APIs via HTTPS
3. THE System SHALL store API keys and tokens on the server side only
4. THE System SHALL not expose API keys or tokens to the frontend client
5. WHEN the System logs requests, THE System SHALL not include full user question text in logs

### Requirement 11

**User Story:** As a user, I want clear error messages when something goes wrong, so that I understand what happened and can try again

#### Acceptance Criteria

1. WHEN any external API call fails, THE System SHALL display a user-friendly error message without technical stack traces
2. WHEN the System encounters an error, THE System SHALL provide a control to retry the failed operation
3. WHEN external services are unavailable, THE System SHALL degrade gracefully and preserve basic text input functionality
4. THE System SHALL log all errors with timestamp, endpoint, and failure reason for debugging purposes

### Requirement 12

**User Story:** As a user, I want to receive a horror movie recommendation that matches the themes of my reading, so that I can explore the mystical energy through film

#### Acceptance Criteria

1. THE System SHALL maintain a curated database of 10 to 15 horror, thriller, or supernatural films with thematic tags
2. WHEN the System generates a reading, THE System SHALL analyze the reading themes based on selected realm, drawn cards, and fortune text
3. WHEN the System identifies matching themes, THE System SHALL select one movie whose tags overlap most with the reading themes
4. WHEN a movie match is found, THE System SHALL include the movie title, release year, and one-sentence non-spoilery description in the reading response
5. WHEN the System displays a reading with a movie recommendation, THE System SHALL present the recommendation below the fortune text with the header "This reading feels like..."
6. THE System SHALL style the movie recommendation card to match the existing altar UI using dark backgrounds and orange or green accent colors

### Requirement 13

**User Story:** As a user, I want to choose how I will face my fortune, so that I can interact with the reading and see consequences of my choice

#### Acceptance Criteria

1. WHEN a reading is displayed, THE System SHALL present a fate choice prompt asking "How will you face this omen?"
2. THE System SHALL provide two choice controls: "Accept the Omen" and "Defy the Omen"
3. WHEN the user selects "Accept the Omen", THE System SHALL display the fate meter as "Fate meter: Blessed (for now…)" and append the sentence "The spirits nod in quiet approval of your resolve." to the fortune display
4. WHEN the user selects "Defy the Omen", THE System SHALL display the fate meter as "Fate meter: Tempting the spirits…" and append the sentence "The spirits watch with a crooked smile as you defy their warning." to the fortune display
5. THE System SHALL style the fate choice controls as pill-shaped buttons with clear hover states matching the orange and green accent colors
6. THE System SHALL implement the fate meter logic entirely in the frontend without requiring backend API changes
7. WHEN the user starts a new reading, THE System SHALL reset the fate choice state to allow a new decision

### Requirement 14

**User Story:** As a user, I want an immersive atmospheric experience with 3D effects and ambient sound, so that the reading feels like a focused séance space

#### Acceptance Criteria

1. THE System SHALL render a 3D volumetric fog background using Vanta.js and Three.js
2. THE System SHALL configure the fog effect with subtle, low-opacity smoke that does not obscure content
3. THE System SHALL use orange (#f97316) and lime green (#a3e635) as highlight colors in the fog effect matching the app's color palette
4. THE System SHALL provide ambient audio consisting of a low-volume hum or distant wind sound that loops seamlessly
5. WHEN the user first interacts with the application, THE System SHALL start the ambient audio to comply with browser autoplay policies
6. THE System SHALL set ambient audio volume to 30 percent to remain subtle and non-intrusive
7. WHEN cards are revealed in a reading, THE System SHALL play a soft card flip sound effect for each card
8. THE System SHALL set card flip sound volume to 50 percent
9. THE System SHALL gracefully degrade if audio files are missing without breaking the application
10. THE System SHALL allow users to control audio through standard browser controls

### Requirement 15

**User Story:** As a developer, I want the system to support multiple card decks, so that different symbolic systems can be used for guidance

#### Acceptance Criteria

1. THE System SHALL define a DeckType type supporting 'tarot', 'career', 'product', and 'self-care' deck identifiers
2. THE System SHALL define a DeckInfo interface containing deck id, name, description, icon, and data file path
3. THE System SHALL store each deck as a separate JSON file in the data directory following the same Card interface structure
4. THE System SHALL provide the following deck options:
   - Traditional Tarot (🔮): Classic Major Arcana for mystical guidance
   - Career Guidance (💼): Professional insights and career wisdom
   - Product Decisions (🚀): Strategic guidance for product choices
   - Self-Care Oracle (🌸): Wellness and mental health guidance
5. THE System SHALL allow the TarotDeck service to load any deck by accepting a deck path in its constructor
6. WHEN the System loads a deck, THE System SHALL validate that all cards contain required fields: id, name, uprightMeaning, reversedMeaning, and imageUrl
7. THE System SHALL support an optional deckType parameter in the fortune API request
8. WHEN no deckType is specified, THE System SHALL default to the 'tarot' deck
9. THE System SHALL maintain backward compatibility with existing API contracts when deck selection is not used

### Requirement 15

**User Story:** As a user, I want to experience different AI personas, so that I can receive guidance in different styles and tones

#### Acceptance Criteria

1. THE System SHALL define a PersonaType type supporting 'mystic', 'wise-witch', 'corporate-oracle', and 'kind-therapist' persona identifiers
2. THE System SHALL define a PersonaPreset interface containing persona id, name, description, system prompt, and TTS voice preference
3. THE System SHALL support four persona presets:
   - Mystic: Deep spooky voice (onyx), eerie cryptic tone, current psychic persona
   - Wise Witch: Warm wise voice (fable), nurturing mystical tone, grandmother witch guidance
   - Corporate Oracle: Professional clear voice (echo), business-focused practical tone, executive coach insights
   - Kind Therapist: Gentle supportive voice (nova), compassionate healing tone, therapeutic card symbolism
4. THE System SHALL allow FortuneService to accept an optional system prompt parameter in its constructor
5. WHEN a system prompt is provided, THE System SHALL use it to set the overall persona voice while maintaining realm-specific tone adjustments
6. THE System SHALL support an optional personaType parameter in the fortune API request
7. WHEN no personaType is specified, THE System SHALL default to the 'mystic' persona
8. WHEN a persona is specified, THE System SHALL include a voiceRecommendation field in the response indicating the suggested TTS voice
9. THE System SHALL maintain backward compatibility with existing API contracts when persona selection is not used
