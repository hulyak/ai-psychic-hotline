import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { prompt, realm } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'The spirits require a vision to manifest' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'The spirits cannot manifest at this time' },
        { status: 500 }
      );
    }

    // Enhance prompt based on realm
    const realmStyles: Record<string, string> = {
      love: 'romantic, warm pink and red tones, hearts and roses, soft lighting',
      fate: 'mystical, golden and purple tones, cosmic elements, dramatic lighting',
      shadows: 'dark, ominous, deep blacks and purples, haunting atmosphere, eerie lighting'
    };

    const style = realmStyles[realm] || 'mystical, dark atmospheric';
    const enhancedPrompt = `${prompt} Style: ${style}, tarot card aesthetic, ornate borders, mystical symbols, high quality digital art`;

    console.log('Generating reading image with DALL-E 3...');

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    const duration = Date.now() - startTime;
    console.log(`Reading image generated in ${duration}ms`);

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('Reading image generation failed:', error);

    return NextResponse.json(
      { error: 'The spirits could not manifest your vision' },
      { status: 500 }
    );
  }
}
