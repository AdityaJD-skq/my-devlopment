import { create } from 'zustand';

// Define the types
export interface Chapter {
  id: string;
  name: string;
  progress: number;
  totalQuestions: number;
  completedQuestions: number;
  isBookmarked: boolean;
  hasNotes: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  progress: number;
  chapters: Chapter[];
}

interface SubjectsState {
  subjects: Subject[];
  updateChapterProgress: (subjectId: string, chapterId: string, completedQuestions: number) => void;
  toggleBookmark: (subjectId: string, chapterId: string) => void;
  toggleNotes: (subjectId: string, chapterId: string) => void;
}

// Initial data
const initialSubjects: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    code: 'PHY',
    progress: 45,
    chapters: [
      {
        id: 'phy1',
        name: 'Mechanics',
        progress: 75,
        totalQuestions: 120,
        completedQuestions: 90,
        isBookmarked: true,
        hasNotes: true,
      },
      {
        id: 'phy2',
        name: 'Electrostatics',
        progress: 60,
        totalQuestions: 100,
        completedQuestions: 60,
        isBookmarked: false,
        hasNotes: true,
      },
      {
        id: 'phy3',
        name: 'Optics',
        progress: 30,
        totalQuestions: 80,
        completedQuestions: 24,
        isBookmarked: true,
        hasNotes: false,
      },
      {
        id: 'phy4',
        name: 'Modern Physics',
        progress: 15,
        totalQuestions: 90,
        completedQuestions: 14,
        isBookmarked: false,
        hasNotes: false,
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    code: 'CHEM',
    progress: 35,
    chapters: [
      {
        id: 'chem1',
        name: 'Organic Chemistry',
        progress: 40,
        totalQuestions: 150,
        completedQuestions: 60,
        isBookmarked: true,
        hasNotes: true,
      },
      {
        id: 'chem2',
        name: 'Inorganic Chemistry',
        progress: 35,
        totalQuestions: 120,
        completedQuestions: 42,
        isBookmarked: false,
        hasNotes: false,
      },
      {
        id: 'chem3',
        name: 'Physical Chemistry',
        progress: 30,
        totalQuestions: 100,
        completedQuestions: 30,
        isBookmarked: false,
        hasNotes: true,
      },
    ],
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    code: 'MATH',
    progress: 50,
    chapters: [
      {
        id: 'math1',
        name: 'Calculus',
        progress: 65,
        totalQuestions: 130,
        completedQuestions: 85,
        isBookmarked: true,
        hasNotes: true,
      },
      {
        id: 'math2',
        name: 'Algebra',
        progress: 55,
        totalQuestions: 110,
        completedQuestions: 61,
        isBookmarked: true,
        hasNotes: false,
      },
      {
        id: 'math3',
        name: 'Coordinate Geometry',
        progress: 40,
        totalQuestions: 90,
        completedQuestions: 36,
        isBookmarked: false,
        hasNotes: true,
      },
      {
        id: 'math4',
        name: 'Trigonometry',
        progress: 35,
        totalQuestions: 80,
        completedQuestions: 28,
        isBookmarked: false,
        hasNotes: false,
      },
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    code: 'BIO',
    progress: 55,
    chapters: [
      {
        id: 'bio1',
        name: 'Cell Biology',
        progress: 70,
        totalQuestions: 120,
        completedQuestions: 84,
        isBookmarked: true,
        hasNotes: true,
      },
      {
        id: 'bio2',
        name: 'Human Physiology',
        progress: 65,
        totalQuestions: 140,
        completedQuestions: 91,
        isBookmarked: true,
        hasNotes: true,
      },
      {
        id: 'bio3',
        name: 'Genetics',
        progress: 45,
        totalQuestions: 110,
        completedQuestions: 50,
        isBookmarked: false,
        hasNotes: true,
      },
      {
        id: 'bio4',
        name: 'Ecology',
        progress: 40,
        totalQuestions: 90,
        completedQuestions: 36,
        isBookmarked: false,
        hasNotes: false,
      },
    ],
  },
];

// Create the store
const useSubjectsStore = create<SubjectsState>((set) => ({
  subjects: initialSubjects,
  
  updateChapterProgress: (subjectId, chapterId, completedQuestions) => 
    set((state) => {
      const newSubjects = state.subjects.map(subject => {
        if (subject.id === subjectId) {
          const newChapters = subject.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              const progress = Math.round((completedQuestions / chapter.totalQuestions) * 100);
              return { ...chapter, completedQuestions, progress };
            }
            return chapter;
          });
          
          // Calculate overall subject progress
          const totalQuestions = newChapters.reduce((acc, chapter) => acc + chapter.totalQuestions, 0);
          const totalCompleted = newChapters.reduce((acc, chapter) => acc + chapter.completedQuestions, 0);
          const progress = Math.round((totalCompleted / totalQuestions) * 100);
          
          return { ...subject, chapters: newChapters, progress };
        }
        return subject;
      });
      
      return { subjects: newSubjects };
    }),
    
  toggleBookmark: (subjectId, chapterId) =>
    set((state) => {
      const newSubjects = state.subjects.map(subject => {
        if (subject.id === subjectId) {
          const newChapters = subject.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              return { ...chapter, isBookmarked: !chapter.isBookmarked };
            }
            return chapter;
          });
          return { ...subject, chapters: newChapters };
        }
        return subject;
      });
      
      return { subjects: newSubjects };
    }),
    
  toggleNotes: (subjectId, chapterId) =>
    set((state) => {
      const newSubjects = state.subjects.map(subject => {
        if (subject.id === subjectId) {
          const newChapters = subject.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              return { ...chapter, hasNotes: !chapter.hasNotes };
            }
            return chapter;
          });
          return { ...subject, chapters: newChapters };
        }
        return subject;
      });
      
      return { subjects: newSubjects };
    }),
}));

export default useSubjectsStore; 