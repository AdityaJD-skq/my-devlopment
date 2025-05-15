import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import ProtectedRoute from '../ProtectedRoute';
import { 
  HiHome, 
  HiUsers, 
  HiClipboardList, 
  HiDocumentReport,
  HiAcademicCap,
  HiLogout,
  HiMenu,
  HiX
} from 'react-icons/hi';
import ThemeToggle from '../theme/ThemeToggle';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: HiHome },
    { name: 'User Management', href: '/admin/users', icon: HiUsers },
    { name: 'Activity Logs', href: '/admin/activity', icon: HiClipboardList },
  ];

  const teacherNavigation = [
    { name: 'Dashboard', href: '/admin', icon: HiHome },
    { name: 'My Students', href: '/admin/students', icon: HiAcademicCap },
  ];

  // Determine which navigation to use based on user role
  const navigation = ['Developer', 'Admin'].includes(user?.role || '') 
    ? adminNavigation 
    : teacherNavigation;

  return (
    <ProtectedRoute allowedRoles={['Developer', 'Admin', 'Teacher']}>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            {/* Sidebar component */}
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto border-r dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between flex-shrink-0 px-4 mb-5">
                <div className="font-bold text-xl text-primary-600">JEE/NEET Prep</div>
                <ThemeToggle />
              </div>
              
              <div className="flex flex-col flex-grow px-2">
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`
                      }
                      end={item.href === '/admin'}
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
              
              <div className="px-3 mt-6">
                <div className="px-2 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full mt-2 px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <HiLogout className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Mobile sidebar */}
        <div className="md:hidden">
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 flex">
              {/* Background overlay */}
              <div 
                className="fixed inset-0 bg-gray-600 bg-opacity-75" 
                onClick={() => setSidebarOpen(false)}
              ></div>
              
              {/* Sidebar */}
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <HiX className="h-6 w-6 text-white" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between flex-shrink-0 px-4 pt-4 pb-2">
                  <div className="font-bold text-xl text-primary-600">JEE/NEET Prep</div>
                  <ThemeToggle />
                </div>
                
                <div className="flex-1 px-2 pb-4 space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`
                      }
                      end={item.href === '/admin'}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                
                <div className="px-3 mb-6">
                  <div className="px-2 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full mt-2 px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <HiLogout className="w-4 h-4 mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 md:hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open sidebar</span>
                <HiMenu className="h-6 w-6" />
              </button>
              <div className="font-bold text-lg text-primary-600">JEE/NEET Prep</div>
              <ThemeToggle />
            </div>
          </header>
          
          {/* Page content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 