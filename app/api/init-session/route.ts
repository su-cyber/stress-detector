// File: app/api/init-session/route.ts
import { NextResponse } from 'next/server';
import { createSession } from '@/lib/sessionUtils';

export async function POST() {
  const session = createSession();
  return NextResponse.json({
    sessionId: session.sessionId,
    nextStep: '/get-question'
  });
}