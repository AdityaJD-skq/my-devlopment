import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import ProtectedRoute from '../../components/ProtectedRoute';
import { HiSearch, HiRefresh, HiEye, HiChartSquareBar, HiClock } from 'react-icons/hi';
import { Link } from 'react-router-dom';

interface Student {
  _id: string;
  name: string;
  email: string;
  registrationDate: string;
  isActive: boolean;
}

interface StudentProgress {
  testsCompleted: number;
  avgScore: number;
  lastActive: string;
  chaptersCompleted: number;
}

export default function TeacherStudentsPage() {
  const { token } = useAuthStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [progressData, setProgressData] = useState<Record<string, StudentProgress>>({});

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/teacher/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        
        // For demo purposes, generate random progress data
        // In a real app, this would come from the backend
        const progress: Record<string, StudentProgress> = {};
        data.forEach((student: Student) => {
          progress[student._id] = {
            testsCompleted: Math.floor(Math.random() * 20),
            avgScore: Math.floor(Math.random() * 60) + 40,
            lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            chaptersCompleted: Math.floor(Math.random() * 15)
          };
        });
        setProgressData(progress);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter locally for demo, in a real app would fetch from backend
  };

  const filteredStudents = searchQuery
    ? students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  const getLastActiveText = (date: string) => {
    const lastActive = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <ProtectedRoute allowedRoles={['Developer', 'Admin', 'Teacher']}>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Students</h1>
        
        {/* Search and Filters */}
        <div className="card p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
            <div className="flex-grow">
              <label className="block text-sm font-medium mb-1">Search Students</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input pr-10 w-full"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <HiSearch className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={fetchStudents}
              className="flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <HiRefresh className="h-4 w-4 mr-1" /> Refresh
            </button>
          </form>
        </div>
        
        {/* Students Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map(student => (
                  <div key={student._id} className="card p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <Link
                          to={`/admin/students/${student._id}`}
                          className="p-1 text-gray-500 hover:text-primary-600"
                          title="View Student Details"
                        >
                          <HiEye className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <HiChartSquareBar className="h-3 w-3 mr-1" /> Tests Completed
                        </div>
                        <div className="font-semibold">{progressData[student._id]?.testsCompleted || 0}</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <HiChartSquareBar className="h-3 w-3 mr-1" /> Avg. Score
                        </div>
                        <div className="font-semibold">{progressData[student._id]?.avgScore || 0}%</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <HiClock className="h-3 w-3 mr-1" /> Last Active
                        </div>
                        <div className="font-semibold">
                          {progressData[student._id] ? getLastActiveText(progressData[student._id].lastActive) : 'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <HiChartSquareBar className="h-3 w-3 mr-1" /> Chapters Done
                        </div>
                        <div className="font-semibold">{progressData[student._id]?.chaptersCompleted || 0}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Overall Progress</span>
                        <span>
                          {Math.floor((progressData[student._id]?.chaptersCompleted || 0) / 15 * 100)}%
                        </span>
                      </div>
                      <div className="progress-container">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${Math.floor((progressData[student._id]?.chaptersCompleted || 0) / 15 * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <div className="text-gray-500">No students found.</div>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-primary-600 hover:underline mt-2"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
} 