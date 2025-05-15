import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

const TestScreen: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch questions from API
    const mockQuestions: Question[] = [
      {
        id: '1',
        text: 'A particle moves in a straight line with constant acceleration. If the velocity changes from 10 m/s to 20 m/s in 5 seconds, the acceleration is:',
        options: ['1 m/s²', '2 m/s²', '3 m/s²', '4 m/s²'],
        correctAnswer: 1
      },
      {
        id: '2',
        text: 'The value of universal gas constant R is:',
        options: ['8.314 J/mol·K', '1.38 × 10⁻²³ J/K', '6.023 × 10²³ mol⁻¹', '9.81 m/s²'],
        correctAnswer: 0
      },
      {
        id: '3',
        text: 'Which of the following is a vector quantity?',
        options: ['Mass', 'Temperature', 'Displacement', 'Energy'],
        correctAnswer: 2
      },
    ];
    
    setQuestions(mockQuestions);
    setLoading(false);
  }, [testId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    // Calculate score
    const score = questions.reduce((total, question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        return total + 1;
      }
      return total;
    }, 0);
    
    // In a real app, send results to backend
    // For now, navigate to results with score in state
    navigate(`/results/${testId}`, { 
      state: { 
        score,
        totalQuestions: questions.length,
        answers: selectedAnswers
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test #{testId}</h1>
        <div className="text-xl font-semibold">
          Time remaining: <span className="text-primary-600">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full ${
                  index === currentQuestionIndex 
                    ? 'bg-primary-600 text-white' 
                    : selectedAnswers[questions[index].id] !== undefined
                    ? 'bg-green-100 text-green-800 border border-green-600' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg mb-4">{currentQuestion.text}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                className={`p-3 border rounded-md cursor-pointer ${
                  selectedAnswers[currentQuestion.id] === index
                    ? 'bg-primary-100 border-primary-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitTest}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestScreen; 