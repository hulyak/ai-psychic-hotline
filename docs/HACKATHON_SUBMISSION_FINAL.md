# AI Psychic Hotline 🔮

## Inspiration

I wanted to build something ridiculous and fun for Halloween: a psychic hotline where an AI reads tarot cards and speaks fortunes in a spooky voice. The idea started with a simple question: what if you could get a tarot reading from an AI that actually understands the symbolism?

I saw this as a chance to combine multiple AI APIs in one project - Claude for generating fortunes, OpenAI's Whisper for voice input, TTS for creepy voice output, and DALL-E for custom card art. My goal was to create something that feels like a real séance, not just another chatbot.

On the technical side, I wanted to demonstrate spec-driven development with Kiro. I wrote proper PRD/SRS/SDD documents first, then used Kiro's steering documents, custom MCP tools, and agent hooks to maintain quality throughout the hackathon.

## What it does

AI Psychic Hotline is a web app where you ask questions and get tarot readings from AI fortune tellers.

### How it works

1. Pick a realm (Love, Fate, or Shadows) - each has a different personality
2. Type or speak your question
3. Watch 3-5 tarot cards get drawn with animations
4. Read your AI-generated fortune that references the specific cards
5. Listen to it spoken in a spooky voice
6. Get a horror movie recommendation that matches your reading

### Features I built

- 4 AI personas with different voices and tones
- Traditional tarot deck (78 cards)
- Voice input via Whisper
- Text-to-speech with persona-matched voices
- DALL-E generated card art (optional)
- Movie recommendations based on card symbolism
- Share readings as text or images
- Responsive design for mobile

### The tech

- Claude generates fortunes based on cards, question, and realm
- Whisper converts speech to text
- OpenAI TTS reads fortunes aloud
- DALL-E creates custom card images
- Algorithm matches movies to card meanings

## How I built it

### Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS + custom CSS
- Claude API, OpenAI APIs
- Jest for testing
- Kiro IDE

### My approach

**Started with specs**

I wrote PRD, SRS, and SDD documents before coding. Then I had Kiro transform them into implementation specs with requirements, design docs, and 30+ tasks.

**Service-driven architecture**

I kept business logic in services (`TarotDeck`, `FortuneService`, `MovieOracle`, etc.) and components pure UI. API routes stay thin and just delegate to services.

**Steering documents**

I created 6 steering docs that Kiro followed:
- Engineering standards (architecture, TypeScript patterns)
- Psychic persona guidelines (fortune tone, length, quality)
- Color rules (orange/green only, absolutely no purple)
- Tech stack documentation
- File organization patterns
- Core features and UX principles

**Custom MCP tools**

I built 4 validation tools:
- Validate tarot deck structure
- Test fortune quality (length, tone, artifacts)
- Check card images exist
- Analyze realm consistency

These caught issues my regular tests missed. For example, they revealed fortunes were too verbose (660-897 characters). After fixing the prompts, I got a 33% length reduction and 90%+ compliance.

**Agent hooks**

I set up 3 automated workflows:
- Auto-run tests when I save service files
- Smoke test the API after route changes
- Test fortune quality across all realms

This saved me 15+ hours of manual testing.

### Key implementation details

**Fortune generation:**
```typescript
const personaPreset = getPersonaPreset(selectedPersonaType);
const fortuneService = new FortuneService(
  apiKey,
  model,
  timeout,
  personaPreset.systemPrompt
);
const fortune = await fortuneService.generateFortune({
  question,
  mode: realm,
  cards: drawnCards
});
```

**Movie matching:**
The algorithm scores movies based on card symbolism, realm tone, and question context. Death card → transformation themes, Shadows realm → psychological horror.

**3D atmosphere:**
Vanta.js fog with warm orange/gold colors creates the séance vibe.

## Challenges

**Fortune quality control**

Initial fortunes were too long (660-897 chars) and had roleplay artifacts like `*speaks in a low tone*` and `Ah, the seeker...`

I fixed this by:
- Writing detailed persona guidelines in steering docs
- Building MCP tools to quantify issues
- Adding explicit "never" rules with examples
- Reducing max_tokens from 400 to 250

Result: 33% shorter, 90%+ compliance, zero artifacts.

**Kiro's purple addiction**

Every component Kiro generated had purple accents. My app needed orange/green for the candle-lit theme.

I created `colors.md` with explicit rules:
```markdown
## CRITICAL: NO PURPLE ALLOWED
Do not use purple/violet/fuchsia under any circumstances.
If you're about to choose purple, STOP. Use #ff8c00 (orange) or #fbbf24 (gold).
```

Result: 0% purple violations after that.

**Voice input browser compatibility**

Browser autoplay policies blocked ambient audio. Microphone permissions varied across browsers.

I implemented user interaction triggers, graceful degradation, clear permission prompts, and fallback to text input.

**API response time**

DALL-E takes 20-30 seconds to generate images.

I made it optional (checkbox), used default SVG cards for speed, ran parallel Promise.all() for multiple images, and added clear loading states with shuffling animation.

**Realm tone consistency**

Fortunes sometimes drifted from realm personality.

I defined explicit tone guidelines for each realm, created an MCP tool to test consistency, tested multiple fortunes per realm, and refined prompts with realm-specific examples.

**Testing AI content**

Standard tests couldn't validate fortune quality.

I built custom MCP tools for domain-specific validation with quality checklists (length, word count, artifacts, card references), statistical analysis, and quantified improvements.

## What I'm proud of

**Production architecture in 3 days**

I built 4,500 lines of maintainable code with clean service separation, comprehensive TypeScript types, stable API contracts, proper error handling, and security best practices.

**MCP tools that work**

My custom validation tools caught issues standard tests missed, provided quantifiable metrics (33% length reduction), integrated with Kiro chat, enabled rapid iteration, and can be reused for other AI projects.

**Steering docs that eliminate repetition**

My steering docs eliminated 90% of code review issues, maintained consistency across 30+ components, prevented purple from appearing, kept fortunes in character, and saved 23+ hours of corrections.

**Four distinct AI personas**

Each personality has a unique system prompt, matched TTS voice, consistent character, seamless realm integration, and professional output quality.

**Immersive atmosphere**

The app feels like a real séance with 3D fog, ambient sound, card animations, spooky voices, in-character error messages, and attention to every detail.

**Smart movie recommendations**

The matching algorithm understands tarot symbolism (Death → transformation), maps realm tones to genres, considers question context, and provides surprisingly relevant suggestions.

**Rapid development without sacrificing quality**

I achieved 462% ROI on Kiro tooling time, saved 60+ hours through automation, got 90%+ of code ready immediately, accumulated zero technical debt, and have comprehensive test coverage.

## What I learned

**Spec-driven development works**

Starting with PRD/SRS/SDD and letting Kiro transform them created a solid foundation that prevented drift and rework. Architecture stayed consistent, API contracts didn't break, and new features integrated cleanly.

**Steering documents are essential**

Explicit "never" rules with examples eliminate 90% of repetitive corrections. Kiro needs clear guidelines to maintain consistency. This improved my code-ready rate from 60% to 90% and saved 23+ hours.

**Domain-specific validation needs custom tools**

Standard tests can't validate AI content quality. I needed domain-specific tools that understand my requirements. MCP tools caught issues that would have shipped to production and improved fortune quality from 20% to 95% compliance.

**Hybrid approach works best**

I used specs for architecture and critical paths, vibe coding for creativity and polish. Don't force everything into one approach. This enabled fast iteration on UI/UX while maintaining a solid technical foundation.

**Automation pays off immediately**

Agent hooks that auto-run tests on save catch regressions instantly. The time investment (1 hour) paid back within hours. I caught 3 breaking changes during development and saved 15+ hours of manual testing.

**AI content needs explicit constraints**

LLMs will be verbose and add roleplay artifacts unless you explicitly tell them not to. Quality guidelines must be in the prompt itself. Fortunes went from rambling (897 chars) to concise (463 chars) with explicit constraints.

**Color consistency requires vigilance**

AI assistants have aesthetic preferences. I needed explicit rules to override them. This achieved perfect visual consistency across 30+ components.

**UX details matter**

Shuffling animation, ambient sound, voice output, and atmospheric effects transform a functional app into an immersive experience. The app feels professional and polished, not like a hackathon project.

**Testing AI integrations is different**

You can't just mock AI APIs. I needed smoke tests that hit real endpoints to validate behavior. This discovered prompt issues that unit tests couldn't catch.

**Documentation is development**

Writing steering docs, specs, and quality guidelines isn't overhead. It's how you communicate requirements to AI assistants. Better documentation = better code generation = faster development.

## What's next

**Phase 2: Journaling (planned)**
- Save reading history with timestamps
- Daily one-card draws
- Streak tracking
- Pattern analysis in questions and cards
- Bookmark favorite readings

**Phase 3: Social features (planned)**
- Generate beautiful share images for social media
- Curated themed readings
- Anonymous shared fortunes
- Weekly reading challenges

**Phase 4: Advanced features (planned)**
- Custom user-created decks
- Different spread patterns (Celtic Cross, etc.)
- Animated fortune delivery
- Multi-language support
- API access for developers

**Technical improvements**
- Optimize LLM response time
- Cache DALL-E images
- Add analytics
- A/B test fortune styles
- Implement rate limiting

**Quality enhancements**
- Add 6+ new personas
- Expand to 10+ decks
- Improve movie algorithm
- More TTS voices
- Enhanced card animations

---

## Final thoughts

I built a production-quality app with sophisticated AI integrations in a hackathon timeframe by using spec-driven architecture, steering documents, custom validation tools, and automated workflows.

The combination of Claude for fortunes, OpenAI for voice features, and Kiro for development created a workflow that was both fast and rigorous. I didn't sacrifice quality for speed.

The result is an app that's technically solid, genuinely fun to use, and demonstrates what's possible with AI-powered entertainment.

**The spirits await your questions.** 🔮
