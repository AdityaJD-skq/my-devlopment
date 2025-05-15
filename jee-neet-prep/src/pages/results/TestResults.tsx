import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
}

const TestResults: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // If no state was passed, display a fallback
  if (!state) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Results Not Found</h1>
          <p className="mb-6">The test results could not be found. Please try accessing your results from the dashboard.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, answers } = state;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Determine performance category based on percentage
  let performanceCategory = '';
  let performanceColor = '';
  
  if (percentage >= 90) {
    performanceCategory = 'Excellent';
    performanceColor = 'text-green-600';
  } else if (percentage >= 70) {
    performanceCategory = 'Good';
    performanceColor = 'text-blue-600';
  } else if (percentage >= 50) {
    performanceCategory = 'Average';
    performanceColor = 'text-yellow-600';
  } else {
    performanceCategory = 'Needs Improvement';
    performanceColor = 'text-red-600';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark-surface shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-dark-text">Test Results</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-md">
            <p className="text-gray-500 dark:text-gray-300 mb-2">Score</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">{score}/{totalQuestions}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-md">
            <p className="text-gray-500 dark:text-gray-300 mb-2">Percentage</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">{percentage}%</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-md">
            <p className="text-gray-500 dark:text-gray-300 mb-2">Performance</p>
            <p className={`text-3xl font-bold ${performanceColor}`}>{performanceCategory}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Subject-wise Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Physics</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">15/20 correct</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Chemistry</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: '65%'}}></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">13/20 correct</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Biology</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">9/20 correct</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Mathematics</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{width: '85%'}}></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">17/20 correct</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
          
          <button
            onClick={() => navigate('/analytics')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            View Detailed Analytics
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recommended Focus Areas</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h3 className="font-medium">Organic Chemistry</h3>
            <p className="text-gray-600">Focus on reaction mechanisms and functional groups</p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h3 className="font-medium">Electrostatics</h3>
            <p className="text-gray-600">Practice problems on electric fields and potential</p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-medium">Integration</h3>
            <p className="text-gray-600">Review integration by parts and substitution methods</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults; 