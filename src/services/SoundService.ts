/**
 * SoundService - Manages ambient and UI sound effects
 */
export class SoundService {
  private static instance: SoundService;
  private ambientAudio: HTMLAudioElement | null = null;
  private cardFlipAudio: HTMLAudioElement | null = null;
  private audioStarted = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      // Initialize ambient audio
      this.ambientAudio = new Audio('/sounds/ambient.mp3');
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.3; // Low volume for background

      // Initialize card flip sound
      this.cardFlipAudio = new Audio('/sounds/card-flip.mp3');
      this.cardFlipAudio.volume = 0.5;
    }
  }

  static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  /**
   * Start ambient audio (call on first user interaction)
   */
  startAmbient(): void {
    if (this.ambientAudio && !this.audioStarted) {
      this.ambientAudio.play().catch(err => {
        console.log('Ambient audio autoplay prevented:', err);
      });
      this.audioStarted = true;
    }
  }

  /**
   * Stop ambient audio
   */
  stopAmbient(): void {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
      this.audioStarted = false;
    }
  }

  /**
   * Play card flip sound
   */
  playCardFlip(): void {
    if (this.cardFlipAudio) {
      this.cardFlipAudio.currentTime = 0;
      this.cardFlipAudio.play().catch(err => {
        console.log('Card flip sound failed:', err);
      });
    }
  }

  /**
   * Set ambient volume (0.0 to 1.0)
   */
  setAmbientVolume(volume: number): void {
    if (this.ambientAudio) {
      this.ambientAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Check if audio has started
   */
  isAudioStarted(): boolean {
    return this.audioStarted;
  }
}
