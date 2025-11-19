# 🔮 AI Psychic Hotline

> *Ask a question. Draw the cards. Hear what the spirits say.*

A spooky, immersive fortune-telling web app that combines tarot card readings with AI-generated fortunes, voice interaction, 3D atmospheric effects, and movie recommendations. Built for a Halloween hackathon using spec-driven development with Kiro.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

## ✨ Features

### Core Experience
- 🎴 **Tarot Card Readings** - Draw 3-5 cards from a complete Major Arcana deck
- 🌙 **Three Mystical Realms** - Love, Fate, or Shadows, each with distinct tone and personality
- 🤖 **AI-Generated Fortunes** - Personalized readings using Claude AI that reference your cards
- 🎙️ **Voice Input** - Speak your question using Whisper speech-to-text
- 🔊 **Spooky Voice Output** - Hear fortunes read aloud in eerie voices using OpenAI TTS
- 🎬 **Movie Oracle** - Get horror/thriller movie recommendations matching your reading's themes

### Immersive Atmosphere
- 🌫️ **3D Volumetric Fog** - Vanta.js fog effects with custom orange/green color palette
- 🎵 **Ambient Soundscape** - Low-volume atmospheric audio with card flip sound effects
- 🎨 **Dark Mystical UI** - Candlelit séance aesthetic (no purple!)
- ✨ **Smooth Animations** - Card reveals, transitions, and interactive elements

### Advanced Features
- 🎭 **Multiple Personas** - Choose from Mystic, Wise Witch, Corporate Oracle, or Kind Therapist
- 📚 **Multiple Decks** - Tarot or Career Guidance deck
- ⚖️ **Fate Meter** - Accept or defy your omen with consequences
- 🖼️ **AI-Generated Card Art** - Optional DALL-E 3 generated unique tarot card images
- 📤 **Share Readings** - Export and share your fortune

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for Whisper, TTS, DALL-E)
- Anthropic API key (for Claude)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-psychic-hotline.git
cd ai-psychic-hotline

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional (defaults provided)
LLM_MODEL=claude-3-5-sonnet-20241022
LLM_TIMEOUT=5000
MIN_CARDS=3
MAX_CARDS=5
TAROT_DECK_PATH=./data/tarot.json
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to experience the mystical journey.

### Build for Production

```bash
npm run build
npm start
```

## 🎮 How to Use

1. **Select Your Realm** - Choose Love (💕), Fate (⚡), or Shadows (🌑)
2. **Ask Your Question** - Type or speak your question to the spirits
3. **Draw the Cards** - Watch as 3-5 tarot cards are revealed
4. **Receive Your Fortune** - Read or listen to your personalized mystical reading
5. **Get a Movie Recommendation** - Discover a film that matches your reading's energy
6. **Face Your Fate** - Choose to accept or defy the omen

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5.9
- **Styling**: Tailwind CSS 4, Custom CSS, Vanta.js + Three.js
- **AI/APIs**: Anthropic Claude, OpenAI (Whisper, TTS, DALL-E 3)
- **Testing**: Jest 30, React Testing Library
- **Quality**: Custom MCP tools for domain-specific validation

### Project Structure

```
ai-psychic-hotline/
├── .kiro/
│   ├── specs/              # Spec-driven development docs
│   │   └── ai-psychic-hotline/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   ├── steering/           # Project guidance docs
│   │   ├── colors.md       # Color palette (no purple!)
│   │   ├── psychic-persona.md
│   │   └── engineering.md
│   ├── hooks/              # Automation hooks
│   └── mcp/                # Custom MCP server
│       └── psychic-hotline-server.js
├── src/
│   ├── app/
│   │   ├── api/            # Next.js API routes
│   │   │   ├── fortune/
│   │   │   ├── speak/
│   │   │   └── transcribe/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # React components
│   ├── services/           # Business logic
│   │   ├── FortuneService.ts
│   │   ├── TarotDeck.ts
│   │   ├── VoiceService.ts
│   │   └── WhisperService.ts
│   └── types/              # TypeScript types
├── data/
│   ├── tarot.json          # Tarot card definitions
│   ├── career.json         # Career guidance deck
│   └── movies.json         # Movie database
├── public/
│   ├── cards/              # Tarot card SVG images
│   └── sounds/             # Audio files
└── scripts/
    ├── test-fortune-api.js
    └── test-with-mcp-tools.js
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# CI mode (single run)
npm run test:ci

# Fortune API smoke test
node scripts/test-fortune-api.js

# MCP quality validation
node scripts/test-with-mcp-tools.js
```

### MCP Quality Tools

Custom MCP server provides domain-specific quality validation:

- **validate_tarot_deck** - Validates deck structure and completeness
- **test_fortune_quality** - Tests fortunes against persona guidelines
- **check_card_images** - Verifies all card images exist
- **analyze_realm_consistency** - Tests tone consistency across realms

These tools caught quality issues that standard tests missed, resulting in a 33% reduction in fortune length and 90%+ compliance with guidelines.

## 🎨 Customization

### Adding New Realms

1. Update `src/types/tarot.ts` with new realm type
2. Add realm context in `src/services/FortuneService.ts`
3. Create realm-specific UI in `src/components/RealmSelection.tsx`
4. Update persona guidelines in `.kiro/steering/psychic-persona.md`

### Adding New Decks

1. Create deck JSON in `data/` following the Card interface
2. Add deck info to `src/config/decks.ts`
3. Update `TAROT_DECK_PATH` env var or add deck selector UI

### Customizing Personas

1. Define persona in `src/config/personas.ts`
2. Add system prompt and voice preference
3. Update `FortuneService` to use persona presets

### Audio Files

Place audio files in `public/sounds/`:
- `ambient.mp3` - Background atmosphere (30% volume)
- `card-flip.mp3` - Card reveal sound (50% volume)

Run `./scripts/setup-audio.sh` for guidance on finding audio files.

## 🚀 Deployment

### Hosting Options

The AI Psychic Hotline can be deployed to various platforms. Here are the recommended options:

#### Vercel (Recommended)

Vercel is the easiest option for Next.js applications:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/ai-psychic-hotline.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local.example`
   - Required: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
   - Click "Save"

**Vercel Features:**
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Automatic deployments on git push
- ✅ Free tier available

#### Netlify

Alternative hosting with similar features:

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18+

2. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required variables
   - Deploy

**Netlify Features:**
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Free tier available

#### Railway

For more control and database options:

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure**
   - Add environment variables
   - Railway will auto-detect Next.js
   - Deploy

**Railway Features:**
- ✅ Automatic HTTPS
- ✅ Database support (if needed later)
- ✅ Custom domains
- ✅ Usage-based pricing

#### Docker Deployment

For self-hosting or custom infrastructure:

```dockerfile
# Dockerfile (create this file)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t ai-psychic-hotline .
docker run -p 3000:3000 --env-file .env.local ai-psychic-hotline
```

### Deployment Checklist

Before deploying to production:

- [ ] Set all required environment variables
- [ ] Test fortune generation with production API keys
- [ ] Verify HTTPS is enabled
- [ ] Configure CORS allowed origins
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Enable rate limiting
- [ ] Test on mobile devices
- [ ] Verify audio files are accessible
- [ ] Check card images load correctly
- [ ] Run security verification: `npm run verify-security`
- [ ] Test all three realms (Love, Fate, Shadows)
- [ ] Test voice input and output features
- [ ] Monitor API costs for first few days

### Environment Variables for Production

Required variables:
```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
NODE_ENV=production
```

Recommended variables:
```env
LLM_MODEL=claude-3-5-sonnet-20241022
LLM_TIMEOUT=5000
MIN_CARDS=3
MAX_CARDS=5
TAROT_DECK_PATH=./data/tarot.json
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

### Post-Deployment

After deploying:

1. **Test the Live Site**
   - Complete a full reading
   - Test voice features
   - Check mobile responsiveness
   - Verify error handling

2. **Monitor Costs**
   - Check Anthropic dashboard for Claude usage
   - Check OpenAI dashboard for Whisper/TTS/DALL-E usage
   - Set up billing alerts

3. **Set Up Analytics** (Optional)
   - Google Analytics
   - Vercel Analytics
   - Custom event tracking

4. **Error Monitoring** (Optional)
   - Sentry for error tracking
   - LogRocket for session replay
   - Custom logging service

### Troubleshooting Deployment

**Build Fails**
- Check Node.js version (18+ required)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally

**API Errors in Production**
- Verify environment variables are set correctly
- Check API keys are valid and have credits
- Review server logs for detailed errors
- Ensure CORS is configured for your domain

**Images Not Loading**
- Verify `public/cards/` directory is included in build
- Check image paths are correct
- Ensure CDN is serving static files

**Audio Not Playing**
- Verify `public/sounds/` directory is included
- Check HTTPS is enabled (required for audio)
- Test audio files locally first

**Rate Limiting Issues**
- Adjust `RATE_LIMIT_MAX_REQUESTS` if needed
- Consider implementing user authentication
- Monitor for abuse patterns

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[docs/SECURITY.md](docs/SECURITY.md)** - Security implementation details
- **[docs/HACKATHON_WRITEUP.md](docs/HACKATHON_WRITEUP.md)** - Development story
- **[.kiro/specs/ai-psychic-hotline/](/.kiro/specs/ai-psychic-hotline/)** - Complete specifications

## 🛠️ Development with Kiro

This project was built using **spec-driven development** with Kiro:

1. **Specs First** - Started with PRD, SRS, and SDD documents
2. **Kiro Spec Generation** - Kiro converted docs into structured specs
3. **Steering Docs** - Used steering docs to maintain consistency (especially colors!)
4. **MCP Tools** - Built custom quality validation tools
5. **Hooks** - Automated testing on file save

### Key Steering Docs

- **colors.md** - Enforces orange/green palette, bans purple
- **psychic-persona.md** - Fortune generation guidelines (3-6 sentences, max 120 words)
- **engineering.md** - Architecture patterns (service-driven design)
- **structure.md** - File organization and naming conventions

### Kiro Hooks

- **test-after-service-change** - Runs tests when service files are saved

## 🔧 Troubleshooting

### Common Issues

#### "The spirits are silent" / Fortune Generation Fails

**Symptoms**: Error message when trying to get a reading

**Solutions**:
1. Check `ANTHROPIC_API_KEY` is set correctly in `.env.local`
2. Verify the API key is valid at [console.anthropic.com](https://console.anthropic.com)
3. Check you have sufficient API credits
4. Restart the development server after adding/changing keys
5. Check server logs for detailed error messages
6. Verify network connectivity to Anthropic API

#### Voice Input Not Working

**Symptoms**: Microphone button doesn't work or transcription fails

**Solutions**:
1. Grant microphone permissions in your browser
2. Check `OPENAI_API_KEY` is set in `.env.local`
3. Verify you're using HTTPS or localhost (required for microphone access)
4. Test microphone in browser settings
5. Check OpenAI API credits
6. Try a different browser (Chrome/Firefox recommended)
7. Check browser console for permission errors

#### Voice Output Not Playing

**Symptoms**: "Hear the Spirits" button doesn't work

**Solutions**:
1. Check `OPENAI_API_KEY` is set in `.env.local`
2. Verify OpenAI API credits are available
3. Check browser audio is not muted
4. Try clicking the button after user interaction (autoplay policy)
5. Check browser console for audio errors
6. Verify HTTPS is enabled (required for some browsers)

#### DALL-E Card Generation Fails

**Symptoms**: Cards don't generate or show errors

**Solutions**:
1. Verify `OPENAI_API_KEY` is set and valid
2. Check OpenAI API credits (DALL-E is expensive)
3. Wait longer - DALL-E can take 15-30 seconds per card
4. Check rate limits on OpenAI account
5. Try generating fewer cards (uncheck the option)
6. Use default SVG cards instead (faster and free)

#### Cards Not Displaying

**Symptoms**: Blank spaces where cards should be

**Solutions**:
1. Check `public/cards/` directory contains SVG files
2. Verify image paths in `data/tarot.json` are correct
3. Check browser console for 404 errors
4. Ensure build includes public directory
5. Clear browser cache and reload

#### Ambient Sound Not Playing

**Symptoms**: No background audio or card flip sounds

**Solutions**:
1. Check `public/sounds/` directory contains audio files
2. Run `./scripts/setup-audio.sh` for audio setup guidance
3. Interact with the page first (browser autoplay policy)
4. Check browser audio is not muted
5. Verify audio files are in MP3 format
6. Check browser console for audio loading errors

#### 3D Fog Effect Not Showing

**Symptoms**: Plain background instead of animated fog

**Solutions**:
1. Check browser supports WebGL (required for Three.js)
2. Update graphics drivers
3. Try a different browser
4. Check browser console for Three.js errors
5. Disable browser extensions that might block WebGL
6. Verify JavaScript is enabled

#### Build Errors

**Symptoms**: `npm run build` fails

**Solutions**:
1. Delete `node_modules` and `.next` directories
2. Run `npm install` again
3. Check Node.js version (18+ required)
4. Verify all environment variables are set
5. Check for TypeScript errors: `npx tsc --noEmit`
6. Review error messages for missing dependencies
7. Clear npm cache: `npm cache clean --force`

#### Rate Limiting Errors

**Symptoms**: "Too many requests" errors

**Solutions**:
1. Wait 1 minute before trying again
2. Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env.local`
3. Check for infinite loops in code
4. Monitor API usage in dashboards
5. Consider implementing user authentication

#### Movie Recommendations Not Showing

**Symptoms**: No movie card appears after reading

**Solutions**:
1. Check `data/movies.json` exists and is valid JSON
2. Verify movie tags match reading themes
3. Check browser console for errors
4. Some readings may not match any movies (by design)
5. Try different realms or questions

#### Fate Meter Not Responding

**Symptoms**: Accept/Defy buttons don't work

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify React state is updating
3. Try refreshing the page
4. Check for CSS conflicts hiding buttons
5. Test in different browser

### Getting Help

If you're still experiencing issues:

1. **Check the Logs**
   - Browser console (F12 → Console tab)
   - Server logs (terminal where `npm run dev` is running)
   - Look for error messages and stack traces

2. **Verify Environment**
   - Node.js version: `node --version` (should be 18+)
   - npm version: `npm --version`
   - All environment variables are set

3. **Test Components Individually**
   - Test fortune API: `node scripts/test-fortune-api.js`
   - Test MCP tools: `node scripts/test-with-mcp-tools.js`
   - Run security checks: `npm run verify-security`

4. **Check API Status**
   - [Anthropic Status](https://status.anthropic.com/)
   - [OpenAI Status](https://status.openai.com/)

5. **Open an Issue**
   - Include error messages
   - Describe steps to reproduce
   - Share relevant logs (remove API keys!)
   - Mention your environment (OS, Node version, browser)

### Performance Issues

**Slow Fortune Generation**
- Normal: 2-5 seconds
- Check network latency to API
- Verify API timeout settings
- Monitor API dashboard for issues

**Slow DALL-E Generation**
- Normal: 15-30 seconds per card
- This is expected behavior
- Consider using default cards for faster experience
- DALL-E 3 is inherently slow

**Slow Page Load**
- Check bundle size: `npm run build` and review output
- Optimize images in `public/cards/`
- Consider lazy loading components
- Check network tab in browser DevTools

## 🔒 Security

The application implements comprehensive security measures to protect against common web vulnerabilities:

### Security Features

- **Input Sanitization** - All user inputs sanitized to prevent XSS and injection attacks
- **Rate Limiting** - 10 requests per minute per IP to prevent abuse
- **CORS Configuration** - Whitelist-based origin control for production
- **Content Security Policy** - Strict CSP headers to prevent XSS
- **Security Headers** - HSTS, X-Frame-Options, X-Content-Type-Options, etc.
- **API Key Protection** - Keys stored server-side only, never exposed to frontend
- **HTTPS Enforcement** - Automatic redirect to HTTPS in production

### Security Verification

Run the security verification script before deployment:

```bash
npm run verify-security
```

This checks for:
- API keys in source code
- Proper .gitignore configuration
- Security middleware implementation
- Input sanitization in API routes
- HTTPS enforcement

For detailed security documentation, see [docs/SECURITY.md](docs/SECURITY.md).

## 🎯 Quality Metrics

- ✅ **Test Coverage**: 28/28 tests passing (including security tests)
- ✅ **Fortune Quality**: 5-6/6 MCP checks passing
- ✅ **Length Compliance**: 90%+ fortunes within 100-600 character limit
- ✅ **Card Images**: 22/22 images present
- ✅ **Deck Validation**: Complete Major Arcana
- ✅ **TypeScript**: Strict mode, no errors
- ✅ **Security**: All checks passing
- ✅ **Purple Incidents**: 0 (after steering doc) 🎉

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Kiro** - For spec-driven development and steering docs
- **Anthropic Claude** - For mystical fortune generation
- **OpenAI** - For Whisper, TTS, and DALL-E
- **Vanta.js** - For atmospheric 3D fog effects

## 🔗 Links

- [Kiro Documentation](https://kiro.ai/docs)
- [Hackathon Writeup](HACKATHON_WRITEUP.md)
- [Live Demo](#) (coming soon)

## 📧 Contact

Questions? Issues? Want to share your fortune?

- Open an issue on GitHub
- Or consult the spirits... 🔮

---

*"The cards whisper of code well-written and tests that pass. Trust the process, for the spirits of good architecture guide your path."* 🕯️👻
