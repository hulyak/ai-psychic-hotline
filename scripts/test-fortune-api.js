#!/usr/bin/env node

/**
 * Fortune API Smoke Test
 * Quick validation that the fortune endpoint works after changes
 */

async function smokeTest() {
  console.log('🔥 Fortune API Smoke Test\n');

  const testCases = [
    {
      name: 'Basic fortune request',
      body: {
        question: 'What does the future hold?',
        mode: 'fate'
      }
    },
    {
      name: 'Love realm',
      body: {
        question: 'Will I find love?',
        mode: 'love'
      }
    },
    {
      name: 'Shadows realm',
      body: {
        question: 'What am I hiding from?',
        mode: 'shadows'
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    process.stdout.write(`Testing: ${test.name}... `);

    try {
      const startTime = Date.now();
      const response = await fetch('http://localhost:3000/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.body),
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        const error = await response.json();
        console.log(`❌ FAILED (${response.status})`);
        console.log(`   Error: ${error.error}`);
        failed++;
        continue;
      }

      const result = await response.json();

      // Validate response structure
      if (!result.cards || !Array.isArray(result.cards)) {
        console.log('❌ FAILED - Missing cards array');
        failed++;
        continue;
      }

      if (!result.fortune || typeof result.fortune !== 'string') {
        console.log('❌ FAILED - Missing fortune text');
        failed++;
        continue;
      }

      if (result.cards.length < 3 || result.cards.length > 5) {
        console.log(`❌ FAILED - Invalid card count: ${result.cards.length}`);
        failed++;
        continue;
      }

      console.log(`✅ PASSED (${duration}ms)`);
      console.log(`   Cards: ${result.cards.length}, Fortune: ${result.fortune.length} chars`);
      passed++;

    } catch (error) {
      console.log(`❌ FAILED - ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(60) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await fetch('http://localhost:3000');
    return true;
  } catch (error) {
    console.error('❌ Dev server not running on localhost:3000');
    console.error('   Run: npm run dev\n');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await smokeTest();
  } else {
    process.exit(1);
  }
})();
