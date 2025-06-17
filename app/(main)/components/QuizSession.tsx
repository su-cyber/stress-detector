// File: app/(main)/components/QuizSession.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import MouseTracker from './MouseTracker';
import QuestionDisplay from './QuestionDisplay';
import StressInput from './StressInput';
import { QuizData } from '@/lib/types';

interface QuizSessionProps {
  sessionId: string;
  onComplete: () => void;
}

type QuizStage = 'loading' | 'question' | 'stress-input' | 'complete';

const QuizSession: React.FC<QuizSessionProps> = ({ sessionId, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizData | null>(null);
  const [sessionStage, setSessionStage] = useState<QuizStage>('loading');
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Calculate progress safely
  const progressWidth = useMemo(() => {
    if (!currentQuestion?.progress) return 0;
    
    const { level, question, totalQuestions, totalLevels } = currentQuestion.progress;
    
    // Ensure valid numbers
    const levelProgress = level - 1;
    const questionProgress = question / totalQuestions;
    const totalProgress = (levelProgress + questionProgress) / totalLevels;
    
    return Math.max(0, Math.min(100, totalProgress * 100));
  }, [currentQuestion]);

  // Initialize session
  useEffect(() => {
    fetchQuestion();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleTimeExpired();
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive]);

  const fetchQuestion = async () => {
    try {
      setSessionStage('loading');
      
      const response = await fetch('/api/get-question', {
        headers: { 'session-id': sessionId },
      });
      
      const data = await response.json();
      
      if (data.status === 'complete') {
        setSessionStage('complete');
        return;
      }
      
      setCurrentQuestion(data);
      setTimeLeft(data.timeLimit);
      setTimerActive(true);
      setUserAnswer(null);
      setStressLevel(null);
      setQuestionStartTime(Date.now());
      setSessionStage('question');
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleAnswerSelect = (index: number) => {
    setUserAnswer(index);
    setTimerActive(false);
    setSessionStage('stress-input');
  };

  const handleTimeExpired = () => {
    setTimerActive(false);
    setSessionStage('stress-input');
  };

  const handleStressSubmit = async () => {
    if (stressLevel === null || !currentQuestion) return;
    
    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Prepare answer data
    const answerData = {
      questionId: currentQuestion.question.id,
      answerIndex: userAnswer !== null ? userAnswer : -1, // Handle unanswered
      stressLevel: stressLevel,
      timeTaken: Math.min(timeTaken, currentQuestion.timeLimit)
    };
    
    // Submit answer
    await fetch('/api/submit-answer', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'session-id': sessionId
      },
      body: JSON.stringify(answerData)
    });
    
    // Move to next question
    fetchQuestion();
  };

  if (sessionStage === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (sessionStage === 'complete') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Session Complete!</h2>
        <p className="text-gray-700 mb-6">
          You have completed all cognitive tasks. Thank you for your participation!
        </p>
        <button
          onClick={onComplete}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow"
        >
          Finish Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <MouseTracker sessionId={sessionId} />
      
      {currentQuestion && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress bar - Safely rendered */}
          <div className="h-2 bg-gray-200">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
          
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentQuestion.progress ? 
                  `Level ${currentQuestion.progress.level}: ${currentQuestion.difficulty}` : 
                  currentQuestion.difficulty}
              </div>
              <div className="text-lg font-bold text-gray-700">
                Time: <span className="text-red-600">{timeLeft}s</span>
              </div>
            </div>
            
            {currentQuestion.progress && (
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  Question {currentQuestion.progress.question}/{currentQuestion.progress.totalQuestions}
                </span>
                <span>
                  Level {currentQuestion.progress.level}/{currentQuestion.progress.totalLevels}
                </span>
              </div>
            )}
          </div>
          
          {sessionStage === 'question' && (
            <QuestionDisplay 
              question={currentQuestion.question} 
              onAnswerSelect={handleAnswerSelect}
            />
          )}
          
          {sessionStage === 'stress-input' && (
            <StressInput 
              stressLevel={stressLevel}
              setStressLevel={setStressLevel}
              onSubmit={handleStressSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default QuizSession;