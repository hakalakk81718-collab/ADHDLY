import { NextResponse } from 'next/server';
import { aiEngine } from '@/lib/aiEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const response = aiEngine.askAssistant(query);
    return NextResponse.json({
      answer: response,
      disclaimer: 'ADHDLY is an executive-function productivity assistant, not a medical or therapeutic diagnostic service.'
    });
  } catch (error) {
    return NextResponse.json(
      { answer: "I'm here to support you. Let's pick one small 2-minute step to begin." },
      { status: 200 }
    );
  }
}
