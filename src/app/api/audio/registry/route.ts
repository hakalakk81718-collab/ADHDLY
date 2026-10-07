import { NextResponse } from 'next/server';
import { AUDIO_LICENSE_REGISTRY } from '@/lib/storage';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    legalNotice: 'All audio in ADHDLY is 100% synthetically generated in client hardware via Web Audio API or CC0 Public Domain. Zero copyrighted commercial music is hosted or scraped.',
    registry: AUDIO_LICENSE_REGISTRY,
    lastAuditDate: '2026-10-06'
  });
}
