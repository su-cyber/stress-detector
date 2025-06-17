// File: app/(main)/components/SessionStart.tsx
import React from 'react';

interface SessionStartProps {
  onStart: () => void;
}

const SessionStart: React.FC<SessionStartProps> = ({ onStart }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Cognitive Performance Study
        </h2>
        
        <div className="prose prose-indigo mb-6">
          <p className="text-gray-600">
            This study examines the relationship between cognitive tasks and physiological responses. 
            You will complete a series of progressively challenging puzzles while we measure your interaction patterns.
          </p>
          
          <h3 className="font-semibold mt-4">What to expect:</h3>
          <ul className="list-disc pl-5 text-gray-600">
            <li>3 difficulty levels with decreasing time limits</li>
            <li>Self-report stress levels after each question</li>
            <li>Mouse movement tracking during tasks</li>
            <li>Approximately 15-20 minutes to complete</li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-700">
              <span className="font-bold">Note:</span> All data is anonymized and used solely for research purposes.
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={onStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            Begin Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionStart;