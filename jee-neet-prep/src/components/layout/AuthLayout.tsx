import { Outlet } from 'react-router-dom';
import ThemeToggle from '../theme/ThemeToggle';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-dark-bg dark:to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl shadow-md flex items-center justify-center text-white text-2xl font-bold mb-2">
            JN
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-dark-text mt-4">JEE NEET Prep</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
          Your ultimate preparation companion for JEE and NEET exams
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-surface py-8 px-4 shadow-soft dark:shadow-dark-soft sm:rounded-xl sm:px-10 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg dark:hover:shadow-dark-card">
          <Outlet />
        </div>
        <div className="text-center mt-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800/50 transition-colors duration-200">
            📚 Trusted by 10,000+ students
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 