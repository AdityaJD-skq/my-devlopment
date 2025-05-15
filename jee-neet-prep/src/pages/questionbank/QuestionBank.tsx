import React, { useState } from 'react';

interface Question {
  id: string;
  text: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QuestionBank: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // Mock data for subjects, topics, and questions
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  
  const topics = {
    Physics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics'],
    Chemistry: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry'],
    Mathematics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Statistics'],
    Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Physiology']
  };
  
  const mockQuestions: Question[] = [
    {
      id: '1',
      text: 'Which of the following is NOT a vector quantity?',
      subject: 'Physics',
      topic: 'Mechanics',
      difficulty: 'Easy',
      options: ['Velocity', 'Force', 'Energy', 'Momentum'],
      correctAnswer: 2,
      explanation: 'Energy is a scalar quantity because it has only magnitude and no direction. Velocity, force, and momentum are all vector quantities having both magnitude and direction.'
    },
    {
      id: '2',
      text: 'Calculate the pH of a 0.01M HCl solution.',
      subject: 'Chemistry',
      topic: 'Physical Chemistry',
      difficulty: 'Medium',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1,
      explanation: 'For a strong acid like HCl, pH = -log[H+]. Since [H+] = 0.01M, pH = -log(0.01) = -log(10^-2) = 2.'
    },
    {
      id: '3',
      text: 'Find the derivative of f(x) = x³ + 2x² - 5x + 3.',
      subject: 'Mathematics',
      topic: 'Calculus',
      difficulty: 'Medium',
      options: ['3x² + 4x - 5', '3x² + 2x - 5', '3x² + 4x + 5', '3x² - 5'],
      correctAnswer: 0,
      explanation: 'The derivative of f(x) = x³ + 2x² - 5x + 3 is f\'(x) = 3x² + 4x - 5 using the power rule and the linearity of differentiation.'
    },
    {
      id: '4',
      text: 'Which organelle is known as the "powerhouse of the cell"?',
      subject: 'Biology',
      topic: 'Cell Biology',
      difficulty: 'Easy',
      options: ['Nucleus', 'Endoplasmic Reticulum', 'Mitochondria', 'Golgi Apparatus'],
      correctAnswer: 2,
      explanation: 'Mitochondria are known as the "powerhouse of the cell" because they generate most of the cell\'s supply of ATP, which is used as a source of chemical energy.'
    },
  ];
  
  const toggleQuestionExpansion = (id: string) => {
    const newSet = new Set(expandedQuestions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedQuestions(newSet);
  };
  
  // Filter questions based on current selections
  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSubject = selectedSubject === 'All' || question.subject === selectedSubject;
    const matchesTopic = selectedTopic === 'All' || question.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'All' || question.difficulty === selectedDifficulty;
    const matchesSearch = searchQuery === '' || 
      question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesTopic && matchesDifficulty && matchesSearch;
  });
  
  // Handle topic selection based on subject
  const filteredTopics = selectedSubject === 'All' 
    ? [] 
    : topics[selectedSubject as keyof typeof topics] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Question Bank</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ backgroundColor: '#1e293b' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic('All'); // Reset topic when subject changes
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              style={{ backgroundColor: '#0f172a', color: '#fff' }}
            >
              <option value="All">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              disabled={selectedSubject === 'All'}
              style={{ backgroundColor: '#0f172a', color: '#fff' }}
            >
              <option value="All">All Topics</option>
              {filteredTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              style={{ backgroundColor: '#0f172a', color: '#fff' }}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              style={{ backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
        </div>
        
        <div className="text-right mb-4">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Create Custom Test
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6" style={{ backgroundColor: '#1e293b' }}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-dark-text">
          Questions ({filteredQuestions.length})
        </h2>
        
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No questions match your current filters. Try adjusting your criteria.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuestions.map(question => (
              <div key={question.id} className="border rounded-md overflow-hidden dark:border-gray-700">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => toggleQuestionExpansion(question.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        question.difficulty === 'Easy' 
                          ? 'bg-green-100 text-green-800' 
                          : question.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{question.subject} | {question.topic}</span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-dark-text">{question.text}</p>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedQuestions.has(question.id) ? 'transform rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {expandedQuestions.has(question.id) && (
                  <div className="p-4 bg-gray-50 dark:bg-dark-bg border-t dark:border-gray-700">
                    <div className="mb-4">
                      <h3 className="font-medium mb-2 text-gray-900 dark:text-dark-text">Options:</h3>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div 
                            key={index} 
                            className={`p-2 rounded ${
                              index === question.correctAnswer 
                                ? 'bg-green-100 border border-green-600' 
                                : 'bg-white dark:bg-dark-surface border dark:border-gray-700'
                            }`}
                          >
                            <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                            {option}
                            {index === question.correctAnswer && (
                              <span className="ml-2 text-green-600 text-sm font-medium">✓ Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Explanation:</h3>
                      <p className="text-gray-700">{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {filteredQuestions.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Load More Questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank; 