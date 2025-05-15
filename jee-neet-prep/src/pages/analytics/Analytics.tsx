import React, { useState } from 'react';

interface TestResult {
  id: string;
  date: string;
  name: string;
  score: number;
  totalQuestions: number;
  subjects: {
    [key: string]: {
      score: number;
      total: number;
    }
  };
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  // Mock data for test results
  const testResults: TestResult[] = [
    {
      id: '1',
      date: '2023-10-15',
      name: 'Physics Full Test',
      score: 78,
      totalQuestions: 100,
      subjects: {
        Physics: { score: 78, total: 100 }
      }
    },
    {
      id: '2',
      date: '2023-10-22',
      name: 'Chemistry Mock Test',
      score: 65,
      totalQuestions: 90,
      subjects: {
        Chemistry: { score: 65, total: 90 }
      }
    },
    {
      id: '3',
      date: '2023-11-05',
      name: 'JEE Full Mock',
      score: 410,
      totalQuestions: 500,
      subjects: {
        Physics: { score: 130, total: 160 },
        Chemistry: { score: 142, total: 170 },
        Mathematics: { score: 138, total: 170 }
      }
    },
    {
      id: '4',
      date: '2023-11-12',
      name: 'NEET Practice Test',
      score: 580,
      totalQuestions: 720,
      subjects: {
        Physics: { score: 140, total: 180 },
        Chemistry: { score: 160, total: 180 },
        Biology: { score: 280, total: 360 }
      }
    },
    {
      id: '5',
      date: '2023-11-18',
      name: 'Mathematics Sectional',
      score: 85,
      totalQuestions: 100,
      subjects: {
        Mathematics: { score: 85, total: 100 }
      }
    },
  ];
  
  // Calculate average scores by subject
  const subjectData = {
    Physics: { total: 0, count: 0, scores: [] as number[] },
    Chemistry: { total: 0, count: 0, scores: [] as number[] },
    Mathematics: { total: 0, count: 0, scores: [] as number[] },
    Biology: { total: 0, count: 0, scores: [] as number[] },
  };
  
  testResults.forEach(result => {
    Object.entries(result.subjects).forEach(([subject, data]) => {
      if (subjectData[subject as keyof typeof subjectData]) {
        const percentage = (data.score / data.total) * 100;
        subjectData[subject as keyof typeof subjectData].total += percentage;
        subjectData[subject as keyof typeof subjectData].count += 1;
        subjectData[subject as keyof typeof subjectData].scores.push(percentage);
      }
    });
  });
  
  // Calculate overall average
  let overallTotal = 0;
  let overallCount = 0;
  
  Object.values(subjectData).forEach(data => {
    overallTotal += data.total;
    overallCount += data.count;
  });
  
  const overallAverage = overallCount > 0 ? Math.round(overallTotal / overallCount) : 0;
  
  // Calculate metrics for recent trend
  const latestTestResult = testResults[testResults.length - 1];
  const latestTestPercentage = Math.round((latestTestResult.score / latestTestResult.totalQuestions) * 100);
  const previousTestResult = testResults[testResults.length - 2];
  const previousTestPercentage = Math.round((previousTestResult.score / previousTestResult.totalQuestions) * 100);
  const percentageChange = latestTestPercentage - previousTestPercentage;

  // Calculate strongest and weakest subjects
  const subjectAverages: { name: string, average: number }[] = [];
  
  Object.entries(subjectData).forEach(([subject, data]) => {
    if (data.count > 0) {
      subjectAverages.push({
        name: subject,
        average: Math.round(data.total / data.count)
      });
    }
  });
  
  subjectAverages.sort((a, b) => b.average - a.average);
  
  const strongestSubject = subjectAverages[0];
  const weakestSubject = subjectAverages[subjectAverages.length - 1];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Overall Performance */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6" style={{ backgroundColor: '#1e293b' }}>
          <h2 className="text-lg font-semibold mb-4">Overall Performance</h2>
          <div className="flex justify-center items-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#e6e6e6" strokeWidth="3"></circle>
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.91549430918954" 
                  fill="transparent" 
                  stroke="#3b82f6" 
                  strokeWidth="3" 
                  strokeDasharray={`${overallAverage} ${100 - overallAverage}`}
                  strokeDashoffset="25">
                </circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{overallAverage}%</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">Based on all test results</p>
          </div>
        </div>
        
        {/* Recent Trend */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6" style={{ backgroundColor: '#1e293b' }}>
          <h2 className="text-lg font-semibold mb-4">Recent Trend</h2>
          <div className="flex justify-center items-center h-32">
            <div className="text-center">
              <p className="text-3xl font-bold mb-2">{latestTestPercentage}%</p>
              <p className={`text-sm font-medium ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange)}% from previous test
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{latestTestResult.name}</p>
            </div>
          </div>
        </div>
        
        {/* Subject Strengths */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6" style={{ backgroundColor: '#1e293b' }}>
          <h2 className="text-lg font-semibold mb-4">Subject Analysis</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Strongest: {strongestSubject?.name}</span>
                <span className="text-sm font-medium text-green-600">{strongestSubject?.average}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: `${strongestSubject?.average}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Weakest: {weakestSubject?.name}</span>
                <span className="text-sm font-medium text-red-600">{weakestSubject?.average}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{width: `${weakestSubject?.average}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 mb-6" style={{ backgroundColor: '#1e293b' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Test History</h2>
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              style={{ backgroundColor: '#0f172a', color: '#fff' }}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="year">Last Year</option>
            </select>
            
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              style={{ backgroundColor: '#0f172a', color: '#fff' }}
            >
              <option value="all">All Subjects</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="mathematics">Mathematics</option>
              <option value="biology">Biology</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full flex h-64 items-end">
            {/* Bar chart display */}
            {testResults.map((result, index) => (
              <div key={index} className="flex flex-col items-center mx-2">
                <div 
                  className="w-16 bg-blue-500 rounded-t"
                  style={{
                    height: `${Math.round((result.score / result.totalQuestions) * 100) * 2}px`,
                    backgroundColor: index === testResults.length - 1 ? '#3b82f6' : '#93c5fd'
                  }}
                ></div>
                <div className="mt-2 text-xs text-gray-600 whitespace-nowrap">
                  {new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Analysis */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6" style={{ backgroundColor: '#1e293b' }}>
          <h2 className="text-lg font-semibold mb-4">Topic Analysis</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Mechanics (Physics)</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Organic Chemistry</span>
                <span className="text-sm font-medium">62%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '62%'}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Calculus (Mathematics)</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Modern Physics</span>
                <span className="text-sm font-medium">55%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '55%'}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Thermodynamics</span>
                <span className="text-sm font-medium">71%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '71%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Tests */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6" style={{ backgroundColor: '#1e293b' }}>
          <h2 className="text-lg font-semibold mb-4">Recent Tests</h2>
          <div className="space-y-4">
            {testResults.slice(-4).reverse().map((result, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium">{result.name}</h3>
                  <span className={`text-sm font-medium ${
                    (result.score / result.totalQuestions) >= 0.7 ? 'text-green-600' : 
                    (result.score / result.totalQuestions) >= 0.5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round((result.score / result.totalQuestions) * 100)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(result.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(result.subjects).map(([subject, data], i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: '#0f172a', color: '#fff' }}
                    >
                      {subject}: {Math.round((data.score / data.total) * 100)}%
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-primary-600 text-sm font-medium hover:underline">
              View All Test Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 