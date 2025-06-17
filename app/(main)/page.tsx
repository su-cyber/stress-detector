// File: app/(main)/page.tsx
'use client';

import { useState } from 'react';
import SessionStart from './components/SessionStart';
import QuizSession from './components/QuizSession';

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStage, setSessionStage] = useState<'pre-session' | 'quiz' | 'complete'>('pre-session');
  
  const startSession = async () => {
    const response = await fetch('/api/init-session', {
      method: 'POST',
    });
    const data = await response.json();
    setSessionId(data.sessionId);
    setSessionStage('quiz');
  };

  const endSession = async () => {
    if (sessionId) {
      await fetch('/api/end-session', {
        method: 'POST',
        headers: { 'session-id': sessionId },
      });
    }
    setSessionStage('complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-indigo-800">Cognitive Stress Study</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {sessionStage === 'pre-session' && (
          <SessionStart onStart={startSession} />
        )}
        
        {sessionStage === 'quiz' && sessionId && (
          <QuizSession 
            sessionId={sessionId} 
            onComplete={endSession} 
          />
        )}
        
        {sessionStage === 'complete' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Session Complete!</h2>
            <p className="text-gray-700 mb-6">
              Thank you for participating in our cognitive stress research study. 
              Your data will help advance our understanding of stress detection.
            </p>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-green-700">
                Session ID: <span className="font-mono">{sessionId}</span>
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Human-Computer Interaction Research Lab © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}