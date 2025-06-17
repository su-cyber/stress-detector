// File: app/api/get-question/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession, getNextQuestion, updateSession } from '@/lib/sessionUtils';

export async function GET(request: NextRequest) {
  const sessionId = request.headers.get('session-id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }
  
  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }
  
  const nextQuestion = getNextQuestion(session);
  if (!nextQuestion) {
    return NextResponse.json({ status: 'complete' });
  }
  
  // Update session state
  updateSession({
    ...session,
    currentLevel: nextQuestion.progress.level - 1,
    currentQuestion: nextQuestion.progress.question - 1
  });
  
  return NextResponse.json(nextQuestion);
}