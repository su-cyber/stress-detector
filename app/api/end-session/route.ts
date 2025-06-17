// File: app/api/end-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession, endSession } from '@/lib/sessionUtils';

export async function POST(request: NextRequest) {
  const sessionId = request.headers.get('session-id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }
  
  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }
  
  endSession(sessionId);
  return NextResponse.json({ status: 'complete' });
}