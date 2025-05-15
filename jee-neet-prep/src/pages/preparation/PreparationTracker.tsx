import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useSubjectsStore from '../../store/subjectsStore';
import ChapterCard from '../../components/preparation/ChapterCard';

const PreparationTracker = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSubject = searchParams.get('subject') || 'physics';
  const [activeSubject, setActiveSubject] = useState(initialSubject);
  const { subjects, toggleBookmark, toggleNotes } = useSubjectsStore();

  // Get the current active subject object
  const currentSubject = subjects.find(subject => subject.id === activeSubject) || subjects[0];

  useEffect(() => {
    document.title = 'Preparation Tracker | JEE NEET Prep';
  }, []);

  const handleSubjectChange = (subjectId: string) => {
    setActiveSubject(subjectId);
    navigate(`/preparation?subject=${subjectId}`);
  };

  const handleToggleBookmark = (chapterId: string) => {
    toggleBookmark(activeSubject, chapterId);
  };

  const handleToggleNotes = (chapterId: string) => {
    toggleNotes(activeSubject, chapterId);
  };

  const handleViewPYQs = (chapterId: string, chapterName: string) => {
    navigate(`/question-bank?subject=${activeSubject}&chapter=${chapterId}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Chapter-wise Preparation</h1>
        <p className="text-gray-600 mb-6">
          Track your progress across subjects and chapters. Update your progress, add notes, and bookmark important chapters.
        </p>

        {/* Subject Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeSubject === subject.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                onClick={() => handleSubjectChange(subject.id)}
              >
                {subject.name}
                <span
                  className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                    activeSubject === subject.id ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {subject.progress}%
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overall subject progress */}
        <div className="p-4 rounded-lg shadow-sm border border-gray-200 mb-8" style={{ backgroundColor: '#1e293b' }}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-gray-900">{currentSubject.name} Overall Progress</h2>
            <span className="text-sm font-medium text-gray-500">
              {currentSubject.chapters.reduce((acc, chapter) => acc + chapter.completedQuestions, 0)} / 
              {currentSubject.chapters.reduce((acc, chapter) => acc + chapter.totalQuestions, 0)} questions
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                currentSubject.progress >= 75 ? 'bg-green-500' : 
                currentSubject.progress >= 50 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`} 
              style={{ width: `${currentSubject.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Chapter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSubject.chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              subjectId={currentSubject.id}
              onToggleBookmark={handleToggleBookmark}
              onToggleNotes={handleToggleNotes}
              onViewPYQs={handleViewPYQs}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreparationTracker; 