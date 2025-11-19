# Future Features Implementation Plan

## Overview

This document outlines the implementation plan for expanding the AI Psychic Hotline with new features focused on personalization, multiple use cases, and enhanced user experience.

## Feature Categories

### 1. Card Shuffling Animation ✅ PRIORITY
**Status**: Not implemented  
**Complexity**: Low  
**Impact**: High (immediate UX improvement)

### 2. Multiple Decks/Modes ⚠️ PARTIALLY IMPLEMENTED
**Status**: Backend ready, needs UI  
**Complexity**: Medium  
**Impact**: High (expands use cases)

### 3. Personality Presets ⚠️ PARTIALLY IMPLEMENTED
**Status**: Backend ready, needs UI  
**Complexity**: Low  
**Impact**: Medium (personalization)

### 4. Shareable Readings ✅ IMPLEMENTED
**Status**: Basic text sharing works  
**Complexity**: Medium (for image generation)  
**Impact**: High (virality)

### 5. Journaling Mode 🔴 NOT IMPLEMENTED
**Status**: New feature  
**Complexity**: High  
**Impact**: High (retention)

### 6. Custom Decks 🔴 NOT IMPLEMENTED
**Status**: New feature  
**Complexity**: High  
**Impact**: High (B2B potential)

### 7. Multi-user/Group Ritual 🔴 NOT IMPLEMENTED
**Status**: New feature  
**Complexity**: Very High (requires real-time)  
**Impact**: Medium (niche use case)

### 8. Accessibility & Localization 🔴 NOT IMPLEMENTED
**Status**: New feature  
**Complexity**: High  
**Impact**: High (accessibility)

### 9. Serious Templates 🔴 NOT IMPLEMENTED
**Status**: New feature  
**Complexity**: Medium  
**Impact**: High (B2B pivot)

## Implementation Priority

### Phase 1: Quick Wins (1-2 days)
1. ✅ Card shuffling animation
2. ✅ Deck selector UI
3. ✅ Persona selector UI
4. ✅ Enhanced share with image generation

### Phase 2: Core Features (3-5 days)
5. Journaling mode (save readings + reflections)
6. Daily reading streaks
7. Multiple serious templates

### Phase 3: Advanced Features (1-2 weeks)
8. Custom deck builder
9. Accessibility improvements
10. Multi-language support

### Phase 4: Experimental (Future)
11. Multi-user group rituals
12. Advanced analytics
13. Mobile app

## Detailed Implementation Plans

---

## 1. Card Shuffling Animation

### User Story
As a user, I want to see a "Shuffling the deck..." animation while cards are being drawn, so that the experience feels more magical and provides feedback during loading.

### Requirements
- Display shuffling animation during API call
- Show card back images shuffling
- Smooth transition to card reveal
- Maintain existing card reveal animation

### Implementation Tasks

#### 1.1 Create Shuffling Component
- Create `src/components/ShufflingAnimation.tsx`
- Implement card back SVG
- Add shuffle animation (cards moving, rotating)
- Use CSS animations for performance

#### 1.2 Update Loading State
- Modify `src/app/page.tsx` to show shuffling during loading
- Replace generic "loading..." with ShufflingAnimation
- Add "Shuffling the deck..." text with mystical styling

#### 1.3 Timing & Transitions
- Ensure minimum 1 second shuffle animation
- Smooth fade transition to card reveal
- Maintain existing card stagger animation

---

## 2. Deck Selector UI

### User Story
As a user, I want to choose between different card decks (Tarot, Career, Product, Self-care), so that I can get guidance relevant to my specific needs.

### Requirements
- Display available decks with icons and descriptions
- Allow deck selection before or after realm selection
- Pass selected deck to API
- Backend already supports multiple decks

### Implementation Tasks

#### 2.1 Create Deck Data
- Create `data/product-decision.json` (new deck)
- Create `data/self-care.json` (new deck)
- Follow existing Card interface structure
- Add 15-20 cards per deck with meanings

#### 2.2 Create Deck Configuration
- Update `src/config/decks.ts` with all deck info
- Add deck icons/emojis
- Add deck descriptions
- Define deck-specific themes

#### 2.3 Create DeckSelection Component
- Create `src/components/DeckSelection.tsx`
- Grid layout with deck cards
- Hover effects and selection state
- Similar styling to RealmSelection

#### 2.4 Update Main Flow
- Add deck selection step to `src/app/page.tsx`
- Update view state machine: realm → deck → input → loading → display
- Pass deckType to API in fortune request
- Store selected deck in state

#### 2.5 Update UI Labels
- Show selected deck name in UI
- Update "Change Realm" to include deck change
- Add deck icon to reading display

---

## 3. Persona Selector UI

### User Story
As a user, I want to choose different AI personas (Wise Witch, Corporate Oracle, Kind Therapist), so that I can receive guidance in a style that resonates with me.

### Requirements
- Display available personas with descriptions
- Allow persona selection in settings or before reading
- Pass personaType to API
- Backend already supports personas

### Implementation Tasks

#### 3.1 Create PersonaSelection Component
- Create `src/components/PersonaSelection.tsx`
- Card-based layout with persona info
- Show persona name, description, voice type
- Preview sample fortune snippet

#### 3.2 Add Settings Panel
- Create `src/components/SettingsPanel.tsx`
- Slide-out panel or modal
- Include persona selector
- Include other preferences (TTS, images, etc.)

#### 3.3 Update Main Flow
- Add settings button to header
- Store selected persona in state
- Pass personaType to API
- Use voiceRecommendation for TTS

---

## 4. Enhanced Shareable Readings

### User Story
As a user, I want to generate a beautiful share image of my reading, so that I can post it on social media or save it for later.

### Requirements
- Generate image with cards, fortune, and branding
- Support both image download and text share
- Include permalink option
- Maintain existing text share functionality

### Implementation Tasks

#### 4.1 Create Share Image Generator
- Create `src/services/ShareImageService.ts`
- Use HTML Canvas API to generate image
- Include: cards, fortune text, realm, date, branding
- Export as PNG or JPEG

#### 4.2 Update ShareReading Component
- Add "Download Image" option
- Add "Copy Link" option (if permalinks implemented)
- Keep existing text share
- Show preview of generated image

#### 4.3 Optional: Permalink System
- Create `src/app/reading/[id]/page.tsx`
- Store readings in database or localStorage
- Generate shareable URLs
- Display shared readings in read-only mode

---

## 5. Journaling Mode

### User Story
As a user, I want to save my readings with personal reflections, so that I can track patterns and insights over time.

### Requirements
- Save readings to browser localStorage or database
- Add reflection notes to saved readings
- View reading history
- Track daily reading streaks
- Export journal as text or PDF

### Implementation Tasks

#### 5.1 Create Reading Storage Service
- Create `src/services/ReadingStorageService.ts`
- Use localStorage for MVP (IndexedDB for future)
- Store: date, question, cards, fortune, realm, deck, persona, reflection
- Implement CRUD operations

#### 5.2 Create Journal Components
- Create `src/components/JournalEntry.tsx` - Single entry display
- Create `src/components/JournalList.tsx` - List of all entries
- Create `src/components/ReflectionInput.tsx` - Add reflection notes
- Create `src/app/journal/page.tsx` - Journal view page

#### 5.3 Add Save Reading Flow
- Add "Save to Journal" button after reading
- Show reflection input modal
- Save reading with timestamp
- Show confirmation

#### 5.4 Implement Daily Streaks
- Track consecutive days with readings
- Display streak counter
- Show daily reading prompt
- Celebrate milestones (7 days, 30 days, etc.)

#### 5.5 Export Functionality
- Export journal as JSON
- Export as formatted text
- Optional: Export as PDF with styling

---

## 6. Custom Deck Builder

### User Story
As a team lead or facilitator, I want to create custom card decks for my team's retrospectives or workshops, so that we can use the same engaging format for our specific needs.

### Requirements
- Create custom decks with custom cards
- Define card names, meanings, and images
- Save and load custom decks
- Share custom decks with others
- Use custom decks in readings

### Implementation Tasks

#### 6.1 Create Deck Builder UI
- Create `src/app/deck-builder/page.tsx`
- Form to create new deck (name, description, theme)
- Card editor: add/edit/delete cards
- Card fields: name, upright meaning, reversed meaning, image URL
- Preview deck

#### 6.2 Create Deck Storage Service
- Create `src/services/CustomDeckService.ts`
- Store custom decks in localStorage
- Validate deck structure
- Import/export deck as JSON

#### 6.3 Integrate Custom Decks
- Show custom decks in deck selector
- Load custom deck data for readings
- Handle custom deck in TarotDeck service
- Support custom card images

#### 6.4 Deck Sharing
- Generate shareable deck JSON
- Import deck from JSON
- Optional: Deck gallery/marketplace

---

## 7. Serious Templates

### User Story
As a professional, I want to use the same engaging card-based format for coaching, retrospectives, or brainstorming, so that I can leverage the tool in non-spooky contexts.

### Requirements
- Multiple visual themes (professional, minimal, colorful)
- Different use cases (coaching, retro, ideation)
- Same engine, different styling and copy
- Easy theme switching

### Implementation Tasks

#### 7.1 Create Theme System
- Create `src/config/themes.ts`
- Define themes: spooky (default), professional, minimal, playful
- Theme includes: colors, fonts, copy, animations
- Store theme in context or state

#### 7.2 Create Template Configurations
- Create `src/config/templates.ts`
- Templates: Coaching Bot, Retro Board, Idea Generator, Decision Helper
- Each template has: name, description, default deck, default persona, theme
- Template-specific copy and prompts

#### 7.3 Update Styling System
- Make colors themeable (CSS variables)
- Make copy themeable (i18n-style keys)
- Make animations optional/themeable
- Update all components to use theme

#### 7.4 Create Template Selector
- Create `src/components/TemplateSelector.tsx`
- Show available templates
- Preview template styling
- Switch between templates

#### 7.5 Update Persona Prompts
- Add professional personas (Coach, Facilitator, Advisor)
- Remove spooky language for serious templates
- Maintain structure and quality

---

## 8. Accessibility & Localization

### User Story
As a user with accessibility needs or who speaks another language, I want to use the app in my preferred language with proper accessibility support, so that I can have an inclusive experience.

### Requirements
- Multi-language support (English, Spanish, French, etc.)
- Screen reader compatibility
- Keyboard navigation
- High contrast mode
- Adjustable text size
- Better TTS options

### Implementation Tasks

#### 8.1 Internationalization Setup
- Install next-intl or react-i18next
- Create translation files for each language
- Translate all UI text
- Translate fortune prompts (or use multilingual LLM)

#### 8.2 Accessibility Improvements
- Add ARIA labels to all interactive elements
- Ensure keyboard navigation works
- Add skip links
- Test with screen readers
- Add focus indicators

#### 8.3 High Contrast Mode
- Create high contrast theme
- Ensure WCAG AA compliance
- Add theme toggle
- Respect system preferences

#### 8.4 Enhanced TTS Options
- Add voice selection UI
- Support multiple TTS providers
- Add speed control
- Add volume control
- Add pause/resume

---

## 9. Multi-user Group Ritual

### User Story
As a group of friends, we want to do a reading together where we all see the same cards and can discuss the interpretation, so that we can share the mystical experience.

### Requirements
- Create group rooms with unique IDs
- Real-time synchronization of card draws
- Multiple users can join same room
- Chat or reactions
- Host controls (draw cards, end session)

### Implementation Tasks

#### 9.1 Backend Infrastructure
- Set up WebSocket server (Socket.io or Pusher)
- Create room management system
- Handle real-time events (join, leave, draw, react)
- Store active rooms in memory or Redis

#### 9.2 Create Group Room UI
- Create `src/app/group/[roomId]/page.tsx`
- Room creation flow
- Join room with code
- Participant list
- Synchronized card display

#### 9.3 Real-time Features
- Broadcast card draws to all participants
- Show who's in the room
- Reactions or votes on interpretations
- Chat functionality (optional)

#### 9.4 Host Controls
- Designate room host
- Host can draw cards
- Host can end session
- Host can kick participants (optional)

---

## Testing Strategy

### Unit Tests
- Test new services (ReadingStorage, CustomDeck, ShareImage)
- Test new components (DeckSelection, PersonaSelection, Journal)
- Test theme system
- Test i18n

### Integration Tests
- Test full journaling flow
- Test custom deck creation and usage
- Test group room functionality
- Test theme switching

### MCP Quality Tools
- Add MCP tool: `validate_custom_deck`
- Add MCP tool: `test_template_consistency`
- Add MCP tool: `check_accessibility`
- Add MCP tool: `validate_translations`

### Manual Testing
- Test all new flows end-to-end
- Test on mobile devices
- Test with screen readers
- Test in different languages

---

## Migration & Backward Compatibility

### Data Migration
- Existing readings remain compatible
- New fields are optional
- Graceful degradation for old data

### API Compatibility
- All new parameters are optional
- Existing API contracts unchanged
- New endpoints for new features

### User Experience
- New features are opt-in
- Default behavior unchanged
- Progressive enhancement

---

## Documentation Updates

### User Documentation
- Update README with new features
- Create user guide for journaling
- Create guide for custom decks
- Document templates and themes

### Developer Documentation
- Update design.md with new architecture
- Document theme system
- Document i18n setup
- Document WebSocket setup (if implemented)

### API Documentation
- Document new endpoints
- Document new request parameters
- Document new response fields
- Update OpenAPI spec (if exists)

---

## Deployment Considerations

### Environment Variables
```env
# Existing
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...

# New (optional)
WEBSOCKET_URL=...           # For group rituals
DATABASE_URL=...            # For persistent storage
STORAGE_PROVIDER=...        # localStorage, indexeddb, or database
DEFAULT_LANGUAGE=en
ENABLE_CUSTOM_DECKS=true
ENABLE_GROUP_MODE=false
```

### Feature Flags
- Use feature flags for gradual rollout
- Enable/disable features per environment
- A/B test new features

### Performance
- Lazy load new features
- Code split by route
- Optimize bundle size
- Cache translations

---

## Success Metrics

### Engagement
- Daily active users
- Reading completion rate
- Journal entry rate
- Custom deck creation rate

### Retention
- Daily streak length
- Return user rate
- Journal entries per user
- Shared readings count

### Quality
- Accessibility score (Lighthouse)
- Translation coverage
- Error rate
- Load time

---

## Timeline Estimate

### Phase 1: Quick Wins (1-2 days)
- Card shuffling: 2-3 hours
- Deck selector UI: 3-4 hours
- Persona selector UI: 2-3 hours
- Enhanced share: 4-5 hours

### Phase 2: Core Features (3-5 days)
- Journaling mode: 2 days
- Daily streaks: 1 day
- Serious templates: 2 days

### Phase 3: Advanced Features (1-2 weeks)
- Custom deck builder: 3-4 days
- Accessibility: 2-3 days
- Localization: 2-3 days

### Phase 4: Experimental (Future)
- Group rituals: 1 week
- Advanced features: Ongoing

**Total Estimated Time**: 3-4 weeks for Phases 1-3

---

## Next Steps

1. Review this plan and prioritize features
2. Create detailed tasks.md for Phase 1
3. Implement Phase 1 features
4. Test and validate with MCP tools
5. Deploy and gather feedback
6. Iterate to Phase 2

