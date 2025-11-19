#!/usr/bin/env node

/**
 * Test script that uses the same logic as the MCP server tools
 * This allows us to test the tools without needing MCP protocol
 */

const fs = require('fs');
const path = require('path');

// Import the tool implementations from the MCP server
const tools = {
  validate_tarot_deck: async () => {
    try {
      const tarotPath = path.join(process.cwd(), 'data/tarot.json');
      const tarotData = JSON.parse(fs.readFileSync(tarotPath, 'utf-8'));
      
      const issues = [];
      const warnings = [];
      
      if (!tarotData.cards || !Array.isArray(tarotData.cards)) {
        issues.push('Missing or invalid cards array');
        return { success: false, issues, warnings };
      }
      
      const requiredFields = ['id', 'name', 'uprightMeaning', 'reversedMeaning', 'imageUrl'];
      const cardNames = new Set();
      
      tarotData.cards.forEach((card, index) => {
        requiredFields.forEach(field => {
          if (!card[field]) {
            issues.push(`Card ${index}: Missing ${field}`);
          }
        });
        
        if (cardNames.has(card.name)) {
          issues.push(`Duplicate card name: ${card.name}`);
        }
        cardNames.add(card.name);
        
        if (card.imageUrl) {
          const imagePath = path.join(process.cwd(), 'public', card.imageUrl);
          if (!fs.existsSync(imagePath)) {
            warnings.push(`Card "${card.name}": Image not found at ${card.imageUrl}`);
          }
        }
        
        if (card.uprightMeaning && card.uprightMeaning.length < 10) {
          warnings.push(`Card "${card.name}": Upright meaning seems too short`);
        }
        if (card.reversedMeaning && card.reversedMeaning.length < 10) {
          warnings.push(`Card "${card.name}": Reversed meaning seems too short`);
        }
      });
      
      if (tarotData.cards.length < 22) {
        warnings.push(`Only ${tarotData.cards.length} cards (Major Arcana should have 22)`);
      }
      
      return {
        success: issues.length === 0,
        cardCount: tarotData.cards.length,
        issues,
        warnings,
        summary: issues.length === 0 
          ? `✅ Tarot deck valid: ${tarotData.cards.length} cards`
          : `❌ Found ${issues.length} issues and ${warnings.length} warnings`
      };
    } catch (error) {
      return {
        success: false,
        issues: [`Failed to validate: ${error.message}`],
        warnings: []
      };
    }
  },

  test_fortune_quality: async (question, realm) => {
    try {
      const response = await fetch('http://localhost:3000/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, mode: realm, generateImages: false }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.error || 'API request failed',
          statusCode: response.status
        };
      }
      
      const data = await response.json();
      const fortune = data.fortune;
      
      const checks = {
        length: {
          pass: fortune.length >= 100 && fortune.length <= 600,
          value: fortune.length,
          expected: '100-600 characters'
        },
        wordCount: {
          pass: fortune.split(/\s+/).length >= 20 && fortune.split(/\s+/).length <= 120,
          value: fortune.split(/\s+/).length,
          expected: '20-120 words'
        },
        noAsterisks: {
          pass: !fortune.includes('*'),
          value: fortune.includes('*') ? 'Contains asterisks' : 'Clean',
          expected: 'No asterisks'
        },
        noAhPrefix: {
          pass: !fortune.match(/^Ah,?\s/i),
          value: fortune.match(/^Ah,?\s/i) ? 'Has "Ah," prefix' : 'Clean',
          expected: 'No "Ah," prefix'
        },
        cardReferences: {
          pass: data.cards.some(card => fortune.includes(card.name)),
          value: data.cards.filter(card => fortune.includes(card.name)).length,
          expected: 'At least 1 card referenced'
        },
        completeSentences: {
          pass: !fortune.match(/\.\.\.$/) && fortune.trim().endsWith('.'),
          value: fortune.trim().endsWith('.') ? 'Complete' : 'Incomplete',
          expected: 'Ends with period'
        }
      };
      
      const passedChecks = Object.values(checks).filter(c => c.pass).length;
      const totalChecks = Object.keys(checks).length;
      
      return {
        success: true,
        question,
        realm,
        fortune,
        cards: data.cards.map(c => `${c.name} (${c.orientation})`),
        qualityScore: `${passedChecks}/${totalChecks}`,
        checks,
        summary: passedChecks === totalChecks 
          ? `✅ Fortune passes all quality checks`
          : `⚠️  Fortune passes ${passedChecks}/${totalChecks} checks`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        hint: 'Is the dev server running? (npm run dev)'
      };
    }
  },

  check_card_images: async () => {
    try {
      const tarotPath = path.join(process.cwd(), 'data/tarot.json');
      const tarotData = JSON.parse(fs.readFileSync(tarotPath, 'utf-8'));
      
      const results = {
        total: tarotData.cards.length,
        found: 0,
        missing: [],
        checked: []
      };
      
      tarotData.cards.forEach(card => {
        const imagePath = path.join(process.cwd(), 'public', card.imageUrl);
        const exists = fs.existsSync(imagePath);
        
        if (exists) {
          results.found++;
          results.checked.push({ name: card.name, path: card.imageUrl, status: '✅' });
        } else {
          results.missing.push({ name: card.name, path: card.imageUrl });
          results.checked.push({ name: card.name, path: card.imageUrl, status: '❌' });
        }
      });
      
      return {
        success: results.missing.length === 0,
        ...results,
        summary: results.missing.length === 0
          ? `✅ All ${results.total} card images found`
          : `❌ Missing ${results.missing.length}/${results.total} card images`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  analyze_realm_consistency: async (realm, sampleSize) => {
    const testQuestions = {
      love: [
        'Will I find true love?',
        'Is my relationship healthy?',
        'Should I open my heart again?'
      ],
      fate: [
        'What does my future hold?',
        'Should I change careers?',
        'Am I on the right path?'
      ],
      shadows: [
        'What am I afraid to face?',
        'What darkness lurks within?',
        'What truth am I hiding from?'
      ]
    };
    
    const questions = testQuestions[realm] || testQuestions.fate;
    const samplesToTest = questions.slice(0, sampleSize);
    
    try {
      const results = [];
      
      for (const question of samplesToTest) {
        const response = await fetch('http://localhost:3000/api/fortune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, mode: realm, generateImages: false }),
        });
        
        if (response.ok) {
          const data = await response.json();
          results.push({
            question,
            fortune: data.fortune,
            length: data.fortune.length,
            wordCount: data.fortune.split(/\s+/).length
          });
        }
      }
      
      const avgLength = results.reduce((sum, r) => sum + r.length, 0) / results.length;
      const avgWords = results.reduce((sum, r) => sum + r.wordCount, 0) / results.length;
      
      return {
        success: true,
        realm,
        sampleSize: results.length,
        results,
        analysis: {
          averageLength: Math.round(avgLength),
          averageWords: Math.round(avgWords),
          lengthVariance: Math.max(...results.map(r => r.length)) - Math.min(...results.map(r => r.length)),
          consistent: results.every(r => r.length >= 100 && r.length <= 600)
        },
        summary: `Tested ${results.length} fortunes in ${realm} realm. Avg: ${Math.round(avgWords)} words`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        hint: 'Is the dev server running? (npm run dev)'
      };
    }
  }
};

// Run all tests
async function runAllTests() {
  console.log('🔮 AI Psychic Hotline - MCP Tools Test Suite\n');
  
  // Test 1: Validate Tarot Deck
  console.log('📋 Test 1: Validate Tarot Deck');
  console.log('═'.repeat(60));
  const deckValidation = await tools.validate_tarot_deck();
  console.log(deckValidation.summary);
  if (deckValidation.issues.length > 0) {
    console.log('\n❌ Issues:');
    deckValidation.issues.forEach(issue => console.log(`  - ${issue}`));
  }
  if (deckValidation.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    deckValidation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  console.log('');
  
  // Test 2: Check Card Images
  console.log('🖼️  Test 2: Check Card Images');
  console.log('═'.repeat(60));
  const imageCheck = await tools.check_card_images();
  console.log(imageCheck.summary);
  console.log(`Found: ${imageCheck.found}/${imageCheck.total}`);
  if (imageCheck.missing && imageCheck.missing.length > 0) {
    console.log('\n❌ Missing images:');
    imageCheck.missing.forEach(card => console.log(`  - ${card.name}: ${card.path}`));
  }
  console.log('');
  
  // Test 3: Test Fortune Quality (one per realm)
  console.log('✨ Test 3: Fortune Quality Tests');
  console.log('═'.repeat(60));
  
  const realms = ['love', 'fate', 'shadows'];
  for (const realm of realms) {
    console.log(`\n${realm.toUpperCase()} Realm:`);
    const result = await tools.test_fortune_quality(
      `What guidance do you have for me?`,
      realm
    );
    
    if (result.success) {
      console.log(`  ${result.summary}`);
      console.log(`  Quality Score: ${result.qualityScore}`);
      console.log(`  Cards: ${result.cards.join(', ')}`);
      
      // Show failed checks
      const failedChecks = Object.entries(result.checks)
        .filter(([_, check]) => !check.pass);
      if (failedChecks.length > 0) {
        console.log('  ⚠️  Failed checks:');
        failedChecks.forEach(([name, check]) => {
          console.log(`    - ${name}: ${check.value} (expected: ${check.expected})`);
        });
      }
    } else {
      console.log(`  ❌ ${result.error}`);
      if (result.hint) console.log(`  💡 ${result.hint}`);
    }
  }
  console.log('');
  
  // Test 4: Realm Consistency Analysis
  console.log('🎯 Test 4: Realm Consistency Analysis');
  console.log('═'.repeat(60));
  
  for (const realm of realms) {
    console.log(`\n${realm.toUpperCase()} Realm Consistency:`);
    const result = await tools.analyze_realm_consistency(realm, 3);
    
    if (result.success) {
      console.log(`  ${result.summary}`);
      console.log(`  Average Length: ${result.analysis.averageLength} chars`);
      console.log(`  Length Variance: ${result.analysis.lengthVariance} chars`);
      console.log(`  Consistent: ${result.analysis.consistent ? '✅' : '❌'}`);
    } else {
      console.log(`  ❌ ${result.error}`);
      if (result.hint) console.log(`  💡 ${result.hint}`);
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('✅ MCP Tools Test Suite Complete');
}

runAllTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
