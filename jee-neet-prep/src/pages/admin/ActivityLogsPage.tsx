import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import ProtectedRoute from '../../components/ProtectedRoute';
import RoleBadge from '../../components/RoleBadge';
import { HiRefresh, HiFilter, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface ActivityLog {
  _id: string;
  userId: User;
  type: string;
  details: any;
  timestamp: string;
  performedBy?: User;
  ipAddress?: string;
  userAgent?: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const ACTIVITY_TYPES = [
  // Authentication actions
  'login', 'logout', 'signup', 'password_reset',
  
  // User management actions
  'user_created', 'user_updated', 'user_deleted', 'role_changed', 'status_changed',
  
  // Content actions
  'test_started', 'test_submitted', 'question_added', 'question_updated', 'question_deleted',
  
  // Educational actions
  'chapter_viewed', 'chapter_completed', 'progress_updated'
];

export default function ActivityLogsPage() {
  const token = useAuthStore(state => state.token);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 25,
    pages: 0
  });
  const [userOptions, setUserOptions] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users for the dropdown
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserOptions(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, [token]);

  useEffect(() => {
    fetchLogs();
  }, [token, pagination.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      if (userFilter) params.append('user', userFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      
      const res = await fetch(`/api/admin/activity?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const formatActivityType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const nextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <ProtectedRoute allowedRoles={['Developer', 'Admin']}>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
        
        {/* Filters */}
        <div className="card p-4 mb-6">
          <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Activity Type</label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="select w-full"
              >
                <option value="">All Activities</option>
                {ACTIVITY_TYPES.map(type => (
                  <option key={type} value={type}>
                    {formatActivityType(type)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">User</label>
              <select
                value={userFilter}
                onChange={e => setUserFilter(e.target.value)}
                className="select w-full"
              >
                <option value="">All Users</option>
                {userOptions.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="input w-full"
              />
            </div>
            
            <div className="flex items-end space-x-3 md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="btn btn-primary flex items-center"
              >
                <HiFilter className="mr-1 h-4 w-4" /> Apply Filters
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setTypeFilter('');
                  setUserFilter('');
                  setStartDate('');
                  setEndDate('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                  setTimeout(fetchLogs, 0);
                }}
                className="btn btn-secondary flex items-center"
              >
                <HiRefresh className="mr-1 h-4 w-4" /> Reset
              </button>
            </div>
          </form>
        </div>
        
        {/* Activity Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                    <th className="p-3">User</th>
                    <th className="p-3">Activity</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Performed By</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map(log => (
                      <tr key={log._id} className="border-t dark:border-gray-700">
                        <td className="p-3">
                          {log.userId ? (
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                {log.userId.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{log.userId.name}</div>
                                <div className="text-xs text-gray-500">
                                  <RoleBadge role={log.userId.role} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Unknown User</span>
                          )}
                        </td>
                        <td className="p-3">{formatActivityType(log.type)}</td>
                        <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-3">
                          {log.performedBy ? (
                            <div className="text-sm">
                              <div>{log.performedBy.name}</div>
                              <div className="text-xs text-gray-500">
                                <RoleBadge role={log.performedBy.role} />
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">System</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">{log.ipAddress || '-'}</td>
                        <td className="p-3">
                          {log.details && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-primary-600">View Details</summary>
                              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto max-w-md">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        No activity logs found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex justify-between items-center border-t dark:border-gray-700 p-3">
                <div className="text-sm text-gray-500">
                  Showing {logs.length} of {pagination.total} logs
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={pagination.page === 1}
                    className={`p-2 rounded ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <HiChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex items-center px-3 py-1 border rounded dark:border-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </div>
                  <button
                    onClick={nextPage}
                    disabled={pagination.page === pagination.pages}
                    className={`p-2 rounded ${pagination.page === pagination.pages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <HiChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 