// File: lib/types.ts
export interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number;
  type: string;
}

export interface QuizLevel {
  name: string;
  timeLimit: number;
  questions: Question[];
}

export interface MouseEvent {
  timestamp: number;
  x: number;
  y: number;
  eventType?: 'move' | 'click' | 'drag';
  velocity?: number;
  distance?: number;
  button?: number;
}

export interface Progress {
  level: number;
  totalLevels: number;
  question: number;
  totalQuestions: number;
}

export interface QuizData {
  question: Question;
  timeLimit: number;
  difficulty: string;
  progress: Progress;
}

export interface AnswerData {
  questionId: number;
  answerIndex: number;
  stressLevel: number;
  timeTaken: number;
}

export interface SessionMetadata {
  sessionId: string;
  startTime: string;
  currentLevel: number;
  currentQuestion: number;
  endTime?: string;
}