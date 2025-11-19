#!/usr/bin/env node

/**
 * Security verification script
 * Checks that API keys are not exposed and security measures are in place
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Running security verification...\n');

let hasErrors = false;

// Check 1: Verify .env.local exists and is in .gitignore
console.log('✓ Checking environment configuration...');
const gitignorePath = path.join(process.cwd(), '.gitignore');
const envLocalPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  if (!gitignoreContent.includes('.env.local') && !gitignoreContent.includes('.env*.local')) {
    console.error('  ❌ .env.local is not in .gitignore!');
    hasErrors = true;
  } else {
    console.log('  ✓ .env.local is properly ignored');
  }
} else {
  console.error('  ❌ .gitignore not found!');
  hasErrors = true;
}

// Check 2: Verify API keys are not in source code
console.log('\n✓ Checking for exposed API keys in source code...');
const srcDir = path.join(process.cwd(), 'src');

function searchForApiKeys(dir) {
  const files = fs.readdirSync(dir);
  const exposedKeys = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip test directories
      if (file === '__tests__' || file === 'tests') {
        continue;
      }
      exposedKeys.push(...searchForApiKeys(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      // Skip test files
      if (file.includes('.test.') || file.includes('.spec.')) {
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check for hardcoded API keys (actual keys, not test keys)
      const patterns = [
        /sk-[a-zA-Z0-9]{40,}/g,  // Real OpenAI keys (longer)
        /sk-ant-api-[a-zA-Z0-9-]{40,}/g,  // Real Anthropic keys
      ];
      
      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          exposedKeys.push({ file: filePath, matches });
        }
      }
    }
  }
  
  return exposedKeys;
}

const exposedKeys = searchForApiKeys(srcDir);
if (exposedKeys.length > 0) {
  console.error('  ❌ Found potential exposed API keys:');
  exposedKeys.forEach(({ file, matches }) => {
    console.error(`    ${file}: ${matches.join(', ')}`);
  });
  hasErrors = true;
} else {
  console.log('  ✓ No exposed API keys found in source code');
}

// Check 3: Verify middleware exists
console.log('\n✓ Checking security middleware...');
const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');
  
  const requiredFeatures = [
    { name: 'Rate limiting', pattern: /rateLimitStore|checkRateLimit/i },
    { name: 'Security headers', pattern: /Content-Security-Policy|X-Frame-Options/i },
    { name: 'CORS configuration', pattern: /Access-Control-Allow-Origin/i },
  ];
  
  for (const feature of requiredFeatures) {
    if (feature.pattern.test(middlewareContent)) {
      console.log(`  ✓ ${feature.name} implemented`);
    } else {
      console.error(`  ❌ ${feature.name} not found`);
      hasErrors = true;
    }
  }
} else {
  console.error('  ❌ Middleware not found!');
  hasErrors = true;
}

// Check 4: Verify input sanitization
console.log('\n✓ Checking input sanitization...');
const sanitizePath = path.join(process.cwd(), 'src', 'utils', 'sanitize.ts');
if (fs.existsSync(sanitizePath)) {
  const sanitizeContent = fs.readFileSync(sanitizePath, 'utf-8');
  
  const requiredFunctions = [
    'sanitizeText',
    'sanitizeQuestion',
    'validateTextSafety',
    'validateAudioFile'
  ];
  
  for (const func of requiredFunctions) {
    if (sanitizeContent.includes(`function ${func}`) || sanitizeContent.includes(`export function ${func}`)) {
      console.log(`  ✓ ${func} implemented`);
    } else {
      console.error(`  ❌ ${func} not found`);
      hasErrors = true;
    }
  }
} else {
  console.error('  ❌ Sanitization utilities not found!');
  hasErrors = true;
}

// Check 5: Verify API routes use sanitization
console.log('\n✓ Checking API routes for sanitization...');
const apiDir = path.join(process.cwd(), 'src', 'app', 'api');

function checkApiRoutes(dir) {
  const files = fs.readdirSync(dir);
  const issues = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      issues.push(...checkApiRoutes(filePath));
    } else if (file === 'route.ts') {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check if route imports sanitization utilities
      if (content.includes('request.json()') || content.includes('formData()')) {
        if (!content.includes('sanitize') && !content.includes('validate')) {
          issues.push(filePath);
        }
      }
    }
  }
  
  return issues;
}

const unsanitizedRoutes = checkApiRoutes(apiDir);
if (unsanitizedRoutes.length > 0) {
  console.error('  ⚠️  Routes that may need sanitization:');
  unsanitizedRoutes.forEach(route => {
    console.error(`    ${route}`);
  });
} else {
  console.log('  ✓ All API routes appear to use sanitization');
}

// Check 6: Verify HTTPS enforcement in production
console.log('\n✓ Checking HTTPS enforcement...');
const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
if (fs.existsSync(nextConfigPath)) {
  const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
  
  if (configContent.includes('Strict-Transport-Security') || configContent.includes('redirects')) {
    console.log('  ✓ HTTPS enforcement configured');
  } else {
    console.error('  ❌ HTTPS enforcement not found in next.config.ts');
    hasErrors = true;
  }
} else {
  console.error('  ❌ next.config.ts not found!');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ Security verification FAILED');
  console.error('Please fix the issues above before deploying to production.');
  process.exit(1);
} else {
  console.log('✅ Security verification PASSED');
  console.log('All security measures are in place.');
}
