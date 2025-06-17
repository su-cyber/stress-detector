// File: app/(main)/components/StressInput.tsx
import React, { useState } from 'react';

interface StressInputProps {
  stressLevel: number | null;
  setStressLevel: (level: number) => void;
  onSubmit: () => void;
}

const StressInput: React.FC<StressInputProps> = ({ stressLevel, setStressLevel, onSubmit }) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(stressLevel);
  
  const handleSubmit = () => {
    if (selectedLevel !== null) {
      setStressLevel(selectedLevel);
      onSubmit();
    }
  };
  
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">How stressed did you feel during that question?</h3>
      <p className="text-gray-600 mb-6">Select your stress level on a scale from 1 to 5</p>
      
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 ${
              selectedLevel === level
                ? 'bg-red-500 text-white transform scale-110 shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span>Calm</span>
        <span>Moderate</span>
        <span>Stressed</span>
      </div>
      
      <div className="w-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 h-2 rounded-full mb-8"></div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={selectedLevel === null}
          className={`px-6 py-3 rounded-lg font-medium ${
            selectedLevel === null
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StressInput;