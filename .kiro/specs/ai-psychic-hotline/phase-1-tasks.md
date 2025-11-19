# Phase 1 Implementation Tasks: Quick Wins

## Overview
Implement high-impact, low-complexity features that enhance the user experience immediately.

**Estimated Time**: 1-2 days  
**Features**: Card shuffling animation, Deck selector UI, Persona selector UI, Enhanced sharing

---

## Task List

- [x] 1. Card Shuffling Animation
  - [x] 1.1 Create ShufflingAnimation component with card back SVG and CSS animations
  - [x] 1.2 Update loading state in page.tsx to show shuffling animation
  - [x] 1.3 Add smooth transition from shuffling to card reveal
  - _Requirements: Future Features §1_

- [x] 2. Create Additional Deck Data Files
  - [x] 2.1 Create data/product-decision.json with 15-20 cards for product decisions
  - [x] 2.2 Create data/self-care.json with 15-20 cards for self-care guidance
  - [x] 2.3 Validate deck structure matches Card interface
  - _Requirements: Future Features §2_

- [x] 3. Deck Selector UI
  - [x] 3.1 Update src/config/decks.ts with all available decks (tarot, career, product, self-care)
  - [x] 3.2 Create src/components/DeckSelection.tsx with grid layout and hover effects
  - [x] 3.3 Update page.tsx view state machine to include deck selection step
  - [x] 3.4 Pass deckType parameter to /api/fortune
  - [x] 3.5 Display selected deck name and icon in UI
  - _Requirements: Future Features §2_

- [x] 4. Persona Selector UI
  - [x] 4.1 Create src/components/PersonaSelection.tsx with persona cards
  - [x] 4.2 Create src/components/SettingsPanel.tsx as slide-out panel
  - [x] 4.3 Add settings button to AppShell header
  - [x] 4.4 Store selected persona in state and pass to API
  - [x] 4.5 Use voiceRecommendation from response for TTS
  - _Requirements: Future Features §3_

- [x] 5. Enhanced Share with Image Generation
  - [x] 5.1 Create src/services/ShareImageService.ts using Canvas API
  - [x] 5.2 Generate image with cards, fortune, realm, date, and branding
  - [x] 5.3 Update ShareReading component with "Download Image" button
  - [x] 5.4 Add image preview before download
  - [x] 5.5 Maintain existing text share functionality
  - _Requirements: Future Features §4_

- [ ] 6. Testing & Quality
  - [ ] 6.1 Add unit tests for new components
  - [ ] 6.2 Test deck switching functionality
  - [ ] 6.3 Test persona switching and voice changes
  - [ ] 6.4 Test share image generation on different screen sizes
  - [ ] 6.5 Run MCP quality tools to validate
  - _Requirements: Future Features §Testing_

- [ ] 7. Documentation
  - [ ] 7.1 Update README.md with new features
  - [ ] 7.2 Document deck data format
  - [ ] 7.3 Document persona configuration
  - [ ] 7.4 Add screenshots of new UI elements
  - _Requirements: Future Features §Documentation_

---

## Implementation Notes

### Card Shuffling Animation
- Use CSS transforms for performance (translateX, translateY, rotate)
- Minimum 1 second animation duration
- Show 5-7 card backs shuffling
- Fade out shuffling, fade in actual cards

### Deck Data Format
Follow existing structure:
```json
{
  "cards": [
    {
      "id": "unique-id",
      "name": "Card Name",
      "uprightMeaning": "Positive interpretation",
      "reversedMeaning": "Challenging interpretation",
      "imageUrl": "/cards/card-name.svg"
    }
  ]
}
```

### Deck Configuration
```typescript
interface DeckInfo {
  id: DeckType;
  name: string;
  description: string;
  icon: string;
  dataPath: string;
  theme?: string;
}
```

### Persona Configuration
Already exists in `src/config/personas.ts`:
```typescript
interface PersonaPreset {
  id: PersonaType;
  name: string;
  description: string;
  systemPrompt: string;
  voice: VoiceType;
}
```

### Share Image Specifications
- Canvas size: 1200x630px (social media optimal)
- Background: Dark with fog effect
- Include: 3-5 card images, fortune text (truncated if needed), realm icon, date, logo
- Export as PNG with high quality

---

## Testing Checklist

### Functional Testing
- [ ] Shuffling animation plays during loading
- [ ] Can select different decks
- [ ] Deck selection affects card meanings
- [ ] Can select different personas
- [ ] Persona affects fortune tone and TTS voice
- [ ] Share image generates correctly
- [ ] Share image downloads with correct filename
- [ ] Text share still works

### Visual Testing
- [ ] Shuffling animation is smooth
- [ ] Deck selector matches app theme
- [ ] Persona selector matches app theme
- [ ] Share image looks good on social media
- [ ] All new UI elements follow color guidelines (no purple!)

### Accessibility Testing
- [ ] Keyboard navigation works for new selectors
- [ ] Screen reader announces deck/persona changes
- [ ] Share buttons have proper ARIA labels
- [ ] Focus indicators visible

### Performance Testing
- [ ] Shuffling animation doesn't block UI
- [ ] Deck switching is instant
- [ ] Image generation completes in < 2 seconds
- [ ] No memory leaks from canvas

---

## Success Criteria

- ✅ Shuffling animation enhances loading experience
- ✅ Users can easily switch between 4 decks
- ✅ Users can choose from 4 personas
- ✅ Share images look professional and branded
- ✅ All tests pass
- ✅ No purple colors introduced
- ✅ Performance remains excellent
- ✅ Backward compatible with existing features

---

## Next Steps After Phase 1

Once Phase 1 is complete and tested:
1. Gather user feedback on new features
2. Measure engagement with deck/persona switching
3. Track share image downloads
4. Plan Phase 2: Journaling mode and daily streaks
5. Consider A/B testing different deck themes

