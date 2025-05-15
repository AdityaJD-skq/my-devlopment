import { HiBookmark, HiOutlineBookmark, HiDocumentText, HiOutlineDocumentText } from 'react-icons/hi';
import { Chapter } from '../../store/subjectsStore';

interface ChapterCardProps {
  chapter: Chapter;
  subjectId: string;
  onToggleBookmark: (chapterId: string) => void;
  onToggleNotes: (chapterId: string) => void;
  onViewPYQs: (chapterId: string, chapterName: string) => void;
}

const ChapterCard = ({ 
  chapter, 
  subjectId, 
  onToggleBookmark, 
  onToggleNotes, 
  onViewPYQs 
}: ChapterCardProps) => {
  return (
    <div className="card border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">{chapter.name}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => onToggleBookmark(chapter.id)} 
            className="text-gray-400 hover:text-yellow-500 focus:outline-none"
            aria-label={chapter.isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {chapter.isBookmarked ? <HiBookmark className="w-5 h-5 text-yellow-500" /> : <HiOutlineBookmark className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => onToggleNotes(chapter.id)} 
            className="text-gray-400 hover:text-primary-500 focus:outline-none"
            aria-label={chapter.hasNotes ? "View notes" : "Add notes"}
          >
            {chapter.hasNotes ? <HiDocumentText className="w-5 h-5 text-primary-500" /> : <HiOutlineDocumentText className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>{chapter.completedQuestions} / {chapter.totalQuestions} questions</span>
          <span>{chapter.progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              chapter.progress >= 75 ? 'bg-green-500' : 
              chapter.progress >= 50 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} 
            style={{ width: `${chapter.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <button 
          onClick={() => onViewPYQs(chapter.id, chapter.name)}
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View Chapter PYQs
        </button>
        
        <div className="flex items-center text-sm text-gray-500">
          <div
            className={`w-3 h-3 mr-2 rounded-full ${
              chapter.progress >= 75 ? 'bg-green-500' : 
              chapter.progress >= 25 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
          ></div>
          <span>{chapter.progress >= 75 ? 'Good Progress' : chapter.progress >= 25 ? 'Average' : 'Needs Focus'}</span>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard; 