// File: app/(main)/components/QuestionDisplay.tsx
import React, { useEffect } from 'react';
import { Question } from '@/lib/types';

interface QuestionDisplayProps {
  question: Question;
  onAnswerSelect: (index: number) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, onAnswerSelect }) => {
  // Scroll to top on new question
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [question]);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">{question.text}</h3>
      
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <span className="text-indigo-800 font-medium">{String.fromCharCode(65 + index)}</span>
              </div>
              <span className="text-gray-700">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;