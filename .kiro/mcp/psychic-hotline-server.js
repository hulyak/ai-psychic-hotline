#!/usr/bin/env node

/**
 * MCP Server for AI Psychic Hotline
 * Provides project-specific tools for Kiro
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs');
const path = require('path');

// Tool implementations
const tools = {
  /**
   * Validate tarot deck data structure and completeness
   */
  validate_tarot_deck: async () => {
    try {
      const tarotPath = path.join(process.cwd(), 'data/tarot.json');
      const tarotData = JSON.parse(fs.readFileSync(tarotPath, 'utf-8'));
      
      const issues = [];
      const warnings = [];
      
      // Check structure
      if (!tarotData.cards || !Array.isArray(tarotData.cards)) {
        issues.push('Missing or invalid cards array');
        return { success: false, issues, warnings };
      }
      
      // Validate each card
      const requiredFields = ['id', 'name', 'uprightMeaning', 'reversedMeaning', 'imageUrl'];
      const cardNames = new Set();
      
      tarotData.cards.forEach((card, index) => {
        // Check required fields
        requiredFields.forEach(field => {
          if (!card[field]) {
            issues.push(`Card ${index}: Missing ${field}`);
          }
        });
        
        // Check for duplicates
        if (cardNames.has(card.name)) {
          issues.push(`Duplicate card name: ${card.name}`);
        }
        cardNames.add(card.name);
        
        // Check image file exists
        if (card.imageUrl) {
          const imagePath = path.join(process.cwd(), 'public', card.imageUrl);
          if (!fs.existsSync(imagePath)) {
            warnings.push(`Card "${card.name}": Image not found at ${card.imageUrl}`);
          }
        }
        
        // Check meaning length
        if (card.uprightMeaning && card.uprightMeaning.length < 10) {
          warnings.push(`Card "${card.name}": Upright meaning seems too short`);
        }
        if (card.reversedMeaning && card.reversedMeaning.length < 10) {
          warnings.push(`Card "${card.name}": Reversed meaning seems too short`);
        }
      });
      
      // Check card count
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

  /**
   * Test fortune generation quality
   */
  test_fortune_quality: async (args) => {
    const { question = 'What does the future hold?', realm = 'fate' } = args;
    
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
      
      // Quality checks
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

  /**
   * Check all card images exist
   */
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

  /**
   * Analyze realm consistency across multiple fortunes
   */
  analyze_realm_consistency: async (args) => {
    const { realm = 'fate', sampleSize = 3 } = args;
    
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
      
      // Analyze consistency
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

// Create MCP server
const server = new Server(
  {
    name: 'psychic-hotline-tools',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'validate_tarot_deck',
        description: 'Validates tarot.json structure, checks for missing fields, duplicate cards, and missing images',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'test_fortune_quality',
        description: 'Tests fortune generation quality by calling the API and checking against persona guidelines',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'Question to ask the fortune teller',
              default: 'What does the future hold?'
            },
            realm: {
              type: 'string',
              enum: ['love', 'fate', 'shadows'],
              description: 'Realm to test',
              default: 'fate'
            }
          },
        },
      },
      {
        name: 'check_card_images',
        description: 'Checks that all card images referenced in tarot.json actually exist in the public folder',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'analyze_realm_consistency',
        description: 'Tests multiple fortunes in a realm to check for consistent tone, length, and quality',
        inputSchema: {
          type: 'object',
          properties: {
            realm: {
              type: 'string',
              enum: ['love', 'fate', 'shadows'],
              description: 'Realm to analyze',
              default: 'fate'
            },
            sampleSize: {
              type: 'number',
              description: 'Number of fortunes to test',
              default: 3,
              minimum: 1,
              maximum: 5
            }
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (!tools[name]) {
    throw new Error(`Unknown tool: ${name}`);
  }
  
  const result = await tools[name](args || {});
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Psychic Hotline MCP server running');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
