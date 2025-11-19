/**
 * ShareImageService - Generate shareable images of tarot readings
 * Creates 1200x630px social media optimized images with cards, fortune, and branding
 */

interface Card {
  id: string;
  name: string;
  orientation: 'upright' | 'reversed';
  imageUrl: string;
}

interface ShareImageOptions {
  cards: Card[];
  fortune: string;
  realm: string;
  deckName: string;
  date: Date;
}

export class ShareImageService {
  private readonly WIDTH = 1200;
  private readonly HEIGHT = 630;
  private readonly CARD_WIDTH = 150;
  private readonly CARD_HEIGHT = 250;
  
  /**
   * Generate a shareable image of the reading
   */
  async generateImage(options: ShareImageOptions): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = this.WIDTH;
    canvas.height = this.HEIGHT;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Draw background
    await this.drawBackground(ctx);
    
    // Draw cards
    await this.drawCards(ctx, options.cards);
    
    // Draw fortune text
    this.drawFortune(ctx, options.fortune);
    
    // Draw metadata (realm, deck, date)
    this.drawMetadata(ctx, options);
    
    // Draw branding
    this.drawBranding(ctx);
    
    // Convert to data URL
    return canvas.toDataURL('image/png', 1.0);
  }

  /**
   * Draw gradient background with mystical atmosphere
   */
  private async drawBackground(ctx: CanvasRenderingContext2D): Promise<void> {
    // Dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, this.HEIGHT);
    gradient.addColorStop(0, '#0b1120');
    gradient.addColorStop(0.5, '#020617');
    gradient.addColorStop(1, '#0b1120');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    
    // Add subtle noise/texture
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * this.WIDTH;
      const y = Math.random() * this.HEIGHT;
      const size = Math.random() * 2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1.0;
  }

  /**
   * Draw tarot cards in a spread
   */
  private async drawCards(ctx: CanvasRenderingContext2D, cards: Card[]): Promise<void> {
    const cardCount = Math.min(cards.length, 5);
    const totalWidth = cardCount * this.CARD_WIDTH + (cardCount - 1) * 20;
    const startX = (this.WIDTH - totalWidth) / 2;
    const startY = 50;

    for (let i = 0; i < cardCount; i++) {
      const card = cards[i];
      const x = startX + i * (this.CARD_WIDTH + 20);
      const y = startY;

      // Draw card background
      ctx.fillStyle = '#020617';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      
      // Rounded rectangle for card
      this.roundRect(ctx, x, y, this.CARD_WIDTH, this.CARD_HEIGHT, 10);
      ctx.fill();
      ctx.stroke();

      // Draw card name
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center';
      
      // Wrap card name if too long
      const maxWidth = this.CARD_WIDTH - 20;
      const words = card.name.split(' ');
      let line = '';
      let lineY = y + 30;
      
      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), x + this.CARD_WIDTH / 2, lineY);
          line = word + ' ';
          lineY += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), x + this.CARD_WIDTH / 2, lineY);

      // Draw orientation indicator
      ctx.font = '12px system-ui';
      ctx.fillStyle = card.orientation === 'upright' ? '#a3e635' : '#f97316';
      ctx.fillText(
        card.orientation === 'upright' ? '↑ Upright' : '↓ Reversed',
        x + this.CARD_WIDTH / 2,
        y + this.CARD_HEIGHT - 15
      );

      // Add glow effect
      ctx.shadowColor = card.orientation === 'upright' ? '#a3e635' : '#f97316';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = card.orientation === 'upright' ? '#a3e635' : '#f97316';
      ctx.lineWidth = 2;
      this.roundRect(ctx, x, y, this.CARD_WIDTH, this.CARD_HEIGHT, 10);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  /**
   * Draw fortune text with proper wrapping
   */
  private drawFortune(ctx: CanvasRenderingContext2D, fortune: string): void {
    const maxWidth = this.WIDTH - 100;
    const x = 50;
    const y = 350;
    
    // Truncate fortune if too long
    const maxChars = 300;
    const displayFortune = fortune.length > maxChars 
      ? fortune.substring(0, maxChars) + '...'
      : fortune;

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px system-ui';
    ctx.textAlign = 'left';
    
    // Word wrap
    const words = displayFortune.split(' ');
    let line = '';
    let lineY = y;
    const lineHeight = 28;
    const maxLines = 6;
    let lineCount = 0;

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line.trim(), x, lineY);
        line = word + ' ';
        lineY += lineHeight;
        lineCount++;
        
        if (lineCount >= maxLines) break;
      } else {
        line = testLine;
      }
    }
    
    if (lineCount < maxLines) {
      ctx.fillText(line.trim(), x, lineY);
    }
  }

  /**
   * Draw metadata (realm, deck, date)
   */
  private drawMetadata(ctx: CanvasRenderingContext2D, options: ShareImageOptions): void {
    const y = this.HEIGHT - 60;
    
    // Realm icon and name
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'left';
    
    const realmEmoji = this.getRealmEmoji(options.realm);
    const realmText = `${realmEmoji} ${this.capitalizeRealm(options.realm)}`;
    ctx.fillText(realmText, 50, y);
    
    // Deck name
    ctx.fillStyle = '#a3e635';
    ctx.fillText(`• ${options.deckName}`, 50, y + 25);
    
    // Date
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'right';
    const dateStr = options.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    ctx.fillText(dateStr, this.WIDTH - 50, y + 12);
  }

  /**
   * Draw branding
   */
  private drawBranding(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 20px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText('AI Psychic Hotline', this.WIDTH - 50, 40);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px system-ui';
    ctx.fillText('🔮', this.WIDTH - 50, 60);
  }

  /**
   * Helper: Draw rounded rectangle
   */
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Helper: Get realm emoji
   */
  private getRealmEmoji(realm: string): string {
    const emojis: Record<string, string> = {
      love: '💕',
      fate: '⚡',
      shadows: '🌑'
    };
    return emojis[realm.toLowerCase()] || '🔮';
  }

  /**
   * Helper: Capitalize realm name
   */
  private capitalizeRealm(realm: string): string {
    return realm.charAt(0).toUpperCase() + realm.slice(1);
  }

  /**
   * Download the generated image
   */
  downloadImage(dataUrl: string, filename: string = 'tarot-reading.png'): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
}
