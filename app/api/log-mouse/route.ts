// File: app/api/log-mouse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession, saveMouseData } from '@/lib/sessionUtils';
import { MouseEvent } from '@/lib/types';

export async function POST(request: NextRequest) {
  const sessionId = request.headers.get('session-id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }
  
  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }
  
  const data: MouseEvent[] = await request.json();
  saveMouseData(sessionId, data);
  
  return NextResponse.json({ status: 'success' });
}