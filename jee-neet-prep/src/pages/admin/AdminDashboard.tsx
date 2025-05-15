import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  HiUsers, 
  HiUserCircle, 
  HiDocumentText,
  HiClipboardList,
  HiChartBar
} from 'react-icons/hi';
import RoleBadge from '../../components/RoleBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface UserCounts {
  _id: string;
  count: number;
}

interface Registration {
  _id: string;
  count: number;
}

interface ActivityLog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  type: string;
  details: any;
  timestamp: string;
  performedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminDashboard() {
  const token = useAuthStore(state => state.token);
  const [userCounts, setUserCounts] = useState<UserCounts[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUserCounts(data.userCounts || []);
          setRecentActivity(data.recentActivity || []);
          setRegistrations(data.registrations || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Format chart data
  const chartData = registrations.map(item => ({
    date: item._id,
    Users: item.count
  }));

  // Calculate user type totals
  const totalUsers = userCounts.reduce((sum, item) => sum + item.count, 0);
  const getUserCountByRole = (role: string) => {
    const found = userCounts.find(count => count._id === role);
    return found ? found.count : 0;
  };

  // Format activity type for display
  const formatActivityType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <ProtectedRoute allowedRoles={['Developer', 'Admin']}>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card bg-blue-50 dark:bg-blue-900/30 p-4 flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-800/50 rounded-full">
                  <HiUsers className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
              </div>
              
              <div className="card bg-green-50 dark:bg-green-900/30 p-4 flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-full">
                  <HiUserCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
                  <p className="text-2xl font-bold">{getUserCountByRole('Student')}</p>
                </div>
              </div>
              
              <div className="card bg-purple-50 dark:bg-purple-900/30 p-4 flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-800/50 rounded-full">
                  <HiDocumentText className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Teachers</p>
                  <p className="text-2xl font-bold">{getUserCountByRole('Teacher')}</p>
                </div>
              </div>
              
              <div className="card bg-yellow-50 dark:bg-yellow-900/30 p-4 flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-800/50 rounded-full">
                  <HiClipboardList className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
                  <p className="text-2xl font-bold">{getUserCountByRole('Admin') + getUserCountByRole('Developer')}</p>
                </div>
              </div>
            </div>
            
            {/* User Registration Chart */}
            <div className="card p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <HiChartBar className="mr-2 h-5 w-5 text-primary-600" />
                User Registrations (Last 30 Days)
              </h2>
              <div className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="Users" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No registration data available
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="card p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <Link to="/admin/activity" className="text-primary-600 text-sm hover:underline">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Activity</th>
                      <th>Time</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.length > 0 ? (
                      recentActivity.map(activity => (
                        <tr key={activity._id}>
                          <td className="py-2">
                            {activity.userId ? (
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                  {activity.userId.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">{activity.userId.name}</div>
                                  <div className="text-xs text-gray-500">
                                    <RoleBadge role={activity.userId.role} />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Unknown User</span>
                            )}
                          </td>
                          <td>{formatActivityType(activity.type)}</td>
                          <td>{new Date(activity.timestamp).toLocaleString()}</td>
                          <td>
                            {activity.details && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-primary-600">View Details</summary>
                                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
                                  {JSON.stringify(activity.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-500">
                          No recent activity recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/users" className="card p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <h3 className="font-semibold flex items-center">
                  <HiUsers className="mr-2 h-5 w-5 text-primary-600" />
                  User Management
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  View and manage all users, update roles and permissions
                </p>
              </Link>
              
              <Link to="/admin/activity" className="card p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <h3 className="font-semibold flex items-center">
                  <HiClipboardList className="mr-2 h-5 w-5 text-primary-600" />
                  Activity Logs
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  View detailed logs of all user activities and system events
                </p>
              </Link>
              
              <Link to="/admin/reports" className="card p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <h3 className="font-semibold flex items-center">
                  <HiChartBar className="mr-2 h-5 w-5 text-primary-600" />
                  Reports
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Access and generate reports on student progress and system usage
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 