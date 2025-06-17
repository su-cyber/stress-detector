// File: app/api/submit-answer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession, saveAnswer, updateSession } from '@/lib/sessionUtils';

export async function POST(request: NextRequest) {
  const sessionId = request.headers.get('session-id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }
  
  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }
  
  const data = await request.json();
  saveAnswer(sessionId, {
    ...data,
    timestamp: new Date().toISOString(),
    difficultyLevel: session.currentLevel,
    questionIndex: session.currentQuestion
  });
  
  // Move to next question
  updateSession({
    ...session,
    currentQuestion: session.currentQuestion + 1
  });
  
  return NextResponse.json({ status: 'success', next: '/get-question' });
}