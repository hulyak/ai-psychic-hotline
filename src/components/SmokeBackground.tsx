'use client';

import { useEffect, useRef } from 'react';

export default function SmokeBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    // Dynamically import Vanta and Three.js only on client side
    const loadVanta = async () => {
      try {
        const THREE = await import('three');
        const VANTA = await import('vanta/dist/vanta.fog.min.js');
        
        if (vantaRef.current && !vantaEffect.current) {
          vantaEffect.current = (VANTA as any).default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0xf97316,  // Candlelight orange
            midtoneColor: 0x1a1a1a,    // Dark grey
            lowlightColor: 0x020617,   // Deep blue-black
            baseColor: 0x0a0a0a,       // Very dark base
            blurFactor: 0.6,           // Subtle blur
            speed: 0.5,                // Slow movement
            zoom: 0.8,                 // Slight zoom out
            opacity: 0.3               // Low opacity for readability
          });
        }
      } catch (error) {
        console.error('Failed to load Vanta effect:', error);
      }
    };

    loadVanta();

    // Cleanup
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 w-full h-full"
      style={{
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
