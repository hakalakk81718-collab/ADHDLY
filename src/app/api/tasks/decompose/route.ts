import { NextResponse } from 'next/server';
import { aiEngine } from '@/lib/aiEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category } = body;
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const steps = aiEngine.decomposeTask(title, category);
    return NextResponse.json({ steps });
  } catch (error: any) {
    console.error('Decompose error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to decompose task.' },
      { status: 500 }
    );
  }
}
