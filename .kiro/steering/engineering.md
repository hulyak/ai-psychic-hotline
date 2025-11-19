---
inclusion: always
---

# Engineering Standards

## Code Style & Patterns

### TypeScript
- Use TypeScript for all backend and frontend code
- Enable strict mode (`strict: true` in tsconfig.json)
- Define explicit types for function parameters and return values
- Use interfaces for data structures, types for unions/primitives
- Avoid `any` - use `unknown` if type is truly unknown

### Async Patterns
- Prefer `async/await` over callbacks and raw promises
- Always handle errors with try/catch in async functions
- Use Promise.all() for parallel operations
- Avoid blocking operations in request handlers

### Architecture (Service-Driven Design)

#### Service Layer
- All business logic lives in services (`src/services/`)
- Services are instantiated in API routes, NOT in components
- Each service has a single responsibility:
  - `TarotDeck`: Card drawing and deck management
  - `FortuneService`: LLM integration for fortune generation
  - `VoiceService`: Text-to-speech
  - `WhisperService`: Speech-to-text
  - `CardImageService`: DALL-E image generation
  - `MovieOracle`: Movie recommendation matching

#### API Routes
- Keep routes thin - delegate to services
- Validate input at the route level
- Return consistent JSON responses
- Use appropriate HTTP status codes
- Log errors without exposing internals

#### Components
- Components handle UI and user interaction only
- No business logic in components
- Use props for data flow (no prop drilling beyond 2 levels)
- Keep components focused and small (<200 lines)
- Colocate CSS files with components

### Function Design
- Keep functions small and focused (single responsibility)
- Prefer pure functions when possible (no side effects)
- Use descriptive names (verb + noun: `generateFortune`, `drawCards`)
- Document complex functions with JSDoc comments
- Limit function parameters to 3-4 (use objects for more)

### Error Handling
- Always validate user input
- Provide user-friendly error messages that stay in character
- Log detailed errors server-side
- Never expose API keys or internal errors to users
- Use try/catch for all async operations

### API Contracts
- Do NOT change API contracts defined in the SRS without discussion
- Maintain backward compatibility
- Version APIs if breaking changes are needed
- Document all endpoints with request/response examples

## File Organization

### Naming Conventions
- React components: PascalCase (`AppShell.tsx`)
- Services: PascalCase (`FortuneService.ts`)
- Types: camelCase (`tarot.ts`)
- API routes: lowercase (`route.ts`)
- CSS files: match component name (`AppShell.css`)
- Hooks: kebab-case (`test-after-service-change.json`)

### Import Order
1. External dependencies (React, Next.js, etc.)
2. Internal services
3. Internal components
4. Types
5. Styles

Example:
```typescript
import { useState } from 'react';
import { FortuneService } from '@/services/FortuneService';
import AppShell from '@/components/AppShell';
import { RealmMode } from '@/types/tarot';
import './styles.css';
```

## Testing

### Test Coverage
- Write tests for all services
- Test API routes with sample requests
- Test error handling paths
- Use Jest for unit tests
- Use React Testing Library for component tests

### Test Structure
- Arrange-Act-Assert pattern
- One assertion per test when possible
- Descriptive test names: `it('should return 3-5 cards when drawing')`
- Mock external dependencies (LLM APIs, etc.)

## Performance

### Optimization Guidelines
- Cache expensive operations (DALL-E images, etc.)
- Use parallel processing where possible (Promise.all)
- Lazy load components when appropriate
- Optimize images (use Next.js Image component)
- Minimize bundle size (tree shaking, code splitting)

### API Efficiency
- Set reasonable timeouts (5s for LLM, 30s for DALL-E)
- Implement rate limiting in production
- Use streaming for large responses when possible
- Cache static data (tarot deck, movies)

## Security

### API Keys
- Never commit API keys to git
- Use environment variables (`.env.local`)
- Validate all user input
- Sanitize data before passing to LLMs
- Use HTTPS in production

### Data Handling
- No PII in logs
- Sanitize error messages
- Validate file uploads
- Use Content Security Policy headers
- Implement CORS properly

## Code Quality

### Before Committing
- Run linter: `npm run lint`
- Run tests: `npm run test:ci`
- Check TypeScript: `tsc --noEmit`
- Format code consistently
- Remove console.logs (except intentional logging)

### Code Review Checklist
- [ ] TypeScript types are explicit
- [ ] Error handling is present
- [ ] No business logic in components
- [ ] Services are properly separated
- [ ] Tests are included
- [ ] API contracts are maintained
- [ ] User-facing errors stay in character
- [ ] No API keys in code

## Common Patterns

### Service Initialization
```typescript
// In API route
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  return NextResponse.json(
    { error: 'Service unavailable' },
    { status: 500 }
  );
}

const service = new FortuneService(apiKey);
```

### Error Response
```typescript
try {
  // operation
} catch (error: any) {
  console.error('Detailed error:', error);
  return NextResponse.json(
    { error: 'User-friendly message in character' },
    { status: 500 }
  );
}
```

### Component Props
```typescript
interface ComponentProps {
  data: DataType;
  onAction: (param: string) => void;
  isLoading?: boolean;
}

export default function Component({ 
  data, 
  onAction, 
  isLoading = false 
}: ComponentProps) {
  // component logic
}
```

## Dependencies

### Adding New Dependencies
- Check bundle size impact
- Verify license compatibility
- Prefer well-maintained packages
- Update package.json with exact versions
- Document why the dependency is needed

### Updating Dependencies
- Test thoroughly after updates
- Check for breaking changes
- Update types if needed
- Run full test suite

## Documentation

### Code Comments
- Explain WHY, not WHAT
- Document complex algorithms
- Add JSDoc for public APIs
- Keep comments up to date

### README Updates
- Document new features
- Update setup instructions
- Add troubleshooting tips
- Include examples

## Deployment

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Environment variables documented
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Security review complete
- [ ] API keys secured
- [ ] Logs sanitized

### Production Considerations
- Use production API keys
- Enable error monitoring (Sentry, etc.)
- Set up analytics
- Configure rate limiting
- Enable caching
- Use CDN for static assets
