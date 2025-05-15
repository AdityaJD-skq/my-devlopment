import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  HiHome, 
  HiBookOpen, 
  HiDocumentText, 
  HiQuestionMarkCircle, 
  HiChartBar, 
  HiMenu, 
  HiX, 
  HiLogout,
  HiBell,
  HiUser,
  HiOutlineChevronDown
} from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import ThemeToggle from '../theme/ThemeToggle';

// Motivational quotes to display
const MOTIVATIONAL_QUOTES = [
  "The expert in anything was once a beginner. – Helen Hayes",
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
  "The difference between ordinary and extraordinary is that little extra. – Jimmy Johnson",
  "The only place where success comes before work is in the dictionary. – Vidal Sassoon",
  "Don't wish it were easier. Wish you were better. – Jim Rohn",
  "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt"
];

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  useEffect(() => {
    // Set random motivational quote
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HiHome },
    { name: 'Preparation', href: '/preparation', icon: HiBookOpen },
    { name: 'Custom Test', href: '/custom-test', icon: HiDocumentText },
    { name: 'Question Bank', href: '/question-bank', icon: HiQuestionMarkCircle },
    { name: 'Analytics', href: '/analytics', icon: HiChartBar },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 flex z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-opacity-85 backdrop-blur-sm transition-opacity" 
             onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-dark-surface shadow-xl transition-all transform">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <HiX className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-6">
              <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg shadow-md flex items-center justify-center text-white text-lg font-bold">
                JN
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-dark-text">JEE NEET Prep</h1>
            </div>
            
            <div className="mt-8 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => 
                    `${isActive 
                      ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    } group flex items-center px-4 py-3 text-base font-medium rounded-md transition-all duration-150 ease-in-out`
                  }
                >
                  <item.icon className={`mr-4 h-5 w-5 transition-colors duration-150 ease-in-out`} />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="px-6 py-4 bg-primary-50 dark:bg-primary-900/20 rounded-md mx-3 mb-5">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium italic">"{quote}"</p>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="h-9 w-9 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 flex items-center justify-center rounded-full">
                <HiUser className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || 'User'}</div>
                <button 
                  onClick={handleLogout}
                  className="flex mt-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150"
                >
                  <HiLogout className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface shadow-sm">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6">
                <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg shadow-md flex items-center justify-center text-white text-lg font-bold">
                  JN
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-dark-text">JEE NEET Prep</h1>
              </div>
              
              <div className="px-6 py-4 bg-primary-50 dark:bg-primary-900/20 rounded-md mx-3 mt-8">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium italic">"{quote}"</p>
              </div>
              
              <nav className="mt-8 flex-1 px-3 bg-white dark:bg-dark-surface space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => 
                      `${isActive 
                        ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                      } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-150 ease-in-out`
                    }
                  >
                    <item.icon className={`mr-3 h-5 w-5 transition-colors duration-150 ease-in-out`} />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="h-9 w-9 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 flex items-center justify-center rounded-full">
                  <HiUser className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || 'User'}</div>
                  <button 
                    onClick={handleLogout}
                    className="flex mt-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150"
                  >
                    <HiLogout className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            className="md:hidden px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400 flex items-center"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <HiMenu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <ThemeToggle className="mr-3" />
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none">
                <span className="sr-only">View notifications</span>
                <div className="relative">
                  <HiBell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center text-xs text-white">
                    3
                  </span>
                </div>
              </button>

              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:flex ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name || 'User'} <HiOutlineChevronDown className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-dark-bg">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="animate-fade-in">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 