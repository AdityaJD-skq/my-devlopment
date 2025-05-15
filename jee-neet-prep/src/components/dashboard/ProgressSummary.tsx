import { Link } from 'react-router-dom';
import useSubjectsStore from '../../store/subjectsStore';

const ProgressSummary = () => {
  const { subjects } = useSubjectsStore();

  // Function to get appropriate color for progress
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'accent';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'secondary';
    return 'red';
  };

  // Progress status text based on percentage
  const getProgressStatus = (progress: number) => {
    if (progress >= 75) return 'Excellent';
    if (progress >= 50) return 'Good';
    if (progress >= 25) return 'Fair';
    return 'Just Started';
  };

  // Subject icons (emojis)
  const subjectIcons: Record<string, string> = {
    physics: '⚛️',
    chemistry: '🧪',
    mathematics: '📐',
    biology: '🧬',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {subjects.map((subject, index) => {
        const colorClass = getProgressColor(subject.progress);
        
        return (
          <div 
            key={subject.id} 
            className="bg-white dark:bg-dark-surface rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`h-2 bg-${colorClass}-500 w-full`}></div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${colorClass}-100 text-${colorClass}-600`}>
                    <span className="text-lg">{subjectIcons[subject.id] || '📚'}</span>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-dark-text">{subject.name}</h3>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${colorClass}-100 text-${colorClass}-800`}>
                  {subject.progress}%
                </span>
              </div>
              
              <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full bg-${colorClass}-500 transition-all duration-1000 ease-out`} 
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>{getProgressStatus(subject.progress)}</span>
                <span>{subject.progress}/100</span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {subject.chapters.length} Chapters
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {subject.chapters.reduce((acc, chapter) => acc + chapter.completedQuestions, 0)} / 
                  {subject.chapters.reduce((acc, chapter) => acc + chapter.totalQuestions, 0)}
                </span>
              </div>
              
              <Link
                to={`/preparation?subject=${subject.id}`}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center transition-colors"
              >
                View chapters
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSummary; 