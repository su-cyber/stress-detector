// File: lib/quizConfig.ts
import { QuizLevel } from './types';

export const QUIZ_CONFIG = {
  difficultyLevels: [
    {
      name: "Easy",
      timeLimit: 45,
      questions: [
        {
          id: 1,
          text: "What is 15% of 200?",
          options: ["15", "30", "45", "60"],
          answer: 1,
          type: "math"
        },
        {
          id: 2,
          text: "Which of these is a prime number?",
          options: ["15", "21", "29", "33"],
          answer: 2,
          type: "math"
        }
      ]
    },
    {
      name: "Medium",
      timeLimit: 30,
      questions: [
        {
          id: 3,
          text: "Solve: (17 × 19) - (12² + 15) = ?",
          options: ["120", "134", "142", "156"],
          answer: 1,
          type: "math"
        },
        {
          id: 4,
          text: "Which pattern comes next? △◯□△◯□△",
          options: ["△", "◯", "□", "◇"],
          answer: 1,
          type: "logic"
        }
      ]
    },
    {
      name: "Hard",
      timeLimit: 20,
      questions: [
        {
          id: 5,
          text: "If all Bloops are Razzies and some Razzies are Loppies, then:",
          options: [
            "Some Bloops are Loppies",
            "All Razzies are Bloops",
            "No Bloops are Loppies",
            "Insufficient information"
          ],
          answer: 3,
          type: "logic"
        },
        {
          id: 6,
          text: "Which number comes next: 2, 6, 12, 20, 30, ?",
          options: ["42", "44", "46", "48"],
          answer: 0,
          type: "pattern"
        }
      ]
    }
  ] as QuizLevel[]
};

export const STAI_QUESTIONS = [
  "I feel calm",
  "I feel tense",
  "I feel upset",
  "I am relaxed",
  "I feel content",
  "I am worried"
];