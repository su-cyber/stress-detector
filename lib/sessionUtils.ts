// File: lib/sessionUtils.ts
import fs from 'fs';
import path from 'path';
import { MouseEvent, SessionMetadata } from './types';
import { QUIZ_CONFIG } from './quizConfig';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Session storage
const sessions: Record<string, SessionMetadata> = {};

export function createSession(): SessionMetadata {
  const sessionId = Date.now().toString();
  const sessionData: SessionMetadata = {
    sessionId,
    startTime: new Date().toISOString(),
    currentLevel: 0,
    currentQuestion: 0,
  };
  
  sessions[sessionId] = sessionData;
  
  // Create session directory
  const sessionDir = path.join(DATA_DIR, sessionId);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir);
  }
  
  return sessionData;
}

export function getSession(sessionId: string): SessionMetadata | null {
  return sessions[sessionId] || null;
}

export function updateSession(session: SessionMetadata) {
  sessions[session.sessionId] = session;
}

export function saveMouseData(sessionId: string, data: MouseEvent[]) {
  if (!data.length) return;
  
  const filePath = path.join(DATA_DIR, sessionId, 'mouse.json');
  const dataToSave = data.map(d => JSON.stringify(d)).join('\n') + '\n';
  fs.appendFileSync(filePath, dataToSave);
}

export function saveAnswer(sessionId: string, answerData: any) {
  const filePath = path.join(DATA_DIR, sessionId, 'answers.jsonl');
  fs.appendFileSync(filePath, JSON.stringify(answerData) + '\n');
}

export function endSession(sessionId: string) {
  const session = sessions[sessionId];
  if (!session) return;
  
  session.endTime = new Date().toISOString();
  
  // Save metadata
  const metadata = {
    ...session,
    totalQuestions: QUIZ_CONFIG.difficultyLevels.reduce(
      (sum, level) => sum + level.questions.length, 0
    )
  };
  
  fs.writeFileSync(
    path.join(DATA_DIR, sessionId, 'metadata.json'),
    JSON.stringify(metadata)
  );
  
  delete sessions[sessionId];
}

export function getNextQuestion(session: SessionMetadata) {
  let { currentLevel, currentQuestion } = session;
  
  // Handle level progression
  while (currentLevel < QUIZ_CONFIG.difficultyLevels.length) {
    const level = QUIZ_CONFIG.difficultyLevels[currentLevel];
    
    // Check if we have questions left in current level
    if (currentQuestion < level.questions.length) {
      const question = level.questions[currentQuestion];
      
      return {
        question,
        timeLimit: level.timeLimit,
        difficulty: level.name,
        progress: {
          level: currentLevel + 1,
          totalLevels: QUIZ_CONFIG.difficultyLevels.length,
          question: currentQuestion + 1,
          totalQuestions: level.questions.length
        }
      };
    }
    
    // Move to next level
    currentLevel++;
    currentQuestion = 0;
  }
  
  // If all levels completed
  return null;
}