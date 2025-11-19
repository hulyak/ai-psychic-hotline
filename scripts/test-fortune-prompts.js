#!/usr/bin/env node

/**
 * Fortune Prompt QA Script
 * Tests fortune generation with canned questions to verify tone and quality
 */

const testQuestions = [
  {
    realm: 'love',
    question: 'Will I find true love this year?',
    expectedTone: 'romantic, emotional, hopeful'
  },
  {
    realm: 'fate',
    question: 'Should I change careers?',
    expectedTone: 'wise, practical, destiny-focused'
  },
  {
    realm: 'shadows',
    question: 'What am I afraid to face?',
    expectedTone: 'dark, ominous, psychologically intense'
  }
];

async function testFortune(question, realm) {
  try {
    const response = await fetch('http://localhost:3000/api/fortune', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        question,
        mode: realm,
        generateImages: false
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error testing ${realm}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🔮 Fortune Prompt QA Check\n');
  console.log('Testing fortune generation with canned questions...\n');
  console.log('=' .repeat(80));

  for (const test of testQuestions) {
    console.log(`\n📝 Realm: ${test.realm.toUpperCase()}`);
    console.log(`❓ Question: "${test.question}"`);
    console.log(`🎭 Expected Tone: ${test.expectedTone}`);
    console.log('-'.repeat(80));

    const result = await testFortune(test.question, test.realm);

    if (result) {
      console.log(`\n🃏 Cards Drawn: ${result.cards.length}`);
      result.cards.forEach((card, i) => {
        console.log(`   ${i + 1}. ${card.name} (${card.orientation})`);
      });
      
      console.log(`\n🔮 Fortune:`);
      console.log(`   "${result.fortune}"\n`);

      // Check for common issues
      const issues = [];
      if (result.fortune.includes('*')) {
        issues.push('Contains asterisks (roleplay actions)');
      }
      if (result.fortune.includes('Ah,')) {
        issues.push('Contains "Ah," prefix');
      }
      if (result.fortune.length < 50) {
        issues.push('Fortune too short');
      }
      if (result.fortune.length > 500) {
        issues.push('Fortune too long');
      }

      if (issues.length > 0) {
        console.log('⚠️  Issues detected:');
        issues.forEach(issue => console.log(`   - ${issue}`));
      } else {
        console.log('✅ Fortune looks good!');
      }

      if (result.movieRecommendation) {
        console.log(`\n🎬 Movie: ${result.movieRecommendation.title} (${result.movieRecommendation.year})`);
      }
    }

    console.log('=' .repeat(80));
  }

  console.log('\n✨ Prompt QA check complete!\n');
}

// Check if dev server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/fortune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'test', mode: 'fate' })
    });
    return true;
  } catch (error) {
    console.error('❌ Dev server not running on localhost:3000');
    console.error('   Run: npm run dev');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
  process.exit(0);
})();
