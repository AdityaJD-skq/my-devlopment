import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import ProgressSummary from '../../components/dashboard/ProgressSummary';
import QuickLinks from '../../components/dashboard/QuickLinks';

// Import icons
import { 
  HiLightningBolt, 
  HiClock, 
  HiCalendar, 
  HiTrendingUp, 
  HiFire 
} from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  // Current time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    document.title = 'Dashboard | JEE NEET Prep';
  }, []);

  // Mock data for today's stats
  const todayStats = [
    { label: 'Study Time', value: '2hr 15min', icon: HiClock, color: 'primary' },
    { label: 'Questions Solved', value: '32', icon: HiLightningBolt, color: 'secondary' },
    { label: 'Streak', value: '5 days', icon: HiFire, color: 'accent' },
    { label: 'Improvement', value: '+12%', icon: HiTrendingUp, color: 'green' },
  ];

  return (
    <div>
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-gray-600">
              Your JEE/NEET preparation journey is on track
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              <HiCalendar className="mr-1 h-4 w-4" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Today's stats */}
      <section className="mb-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {todayStats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="bg-white dark:bg-dark-surface rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md hover:border-gray-200"
              style={{ animationDelay: `${(index + 1) * 50}ms` }}
            >
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-500`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">{stat.label}</h3>
                  <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-dark-text">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📊</span> Subject Progress
          </h2>
          <span className="text-sm text-primary-600 hover:underline cursor-pointer">View All</span>
        </div>
        <ProgressSummary />
      </section>

      <section className="mb-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="mr-2">🚀</span> Quick Links
          </h2>
        </div>
        <QuickLinks />
      </section>

      <section className="mt-10 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="bg-white dark:bg-dark-surface shadow-soft rounded-xl p-6 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4 flex items-center">
            <span className="mr-2">🔔</span> Recent Activity
          </h2>
          <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-6">
            <div className="relative">
              <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white"></div>
              <div>
                <div className="flex items-center">
                  <p className="text-sm bg-primary-50 text-primary-700 px-2 py-1 rounded-md">Yesterday</p>
                  <div className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    85% Score
                  </div>
                </div>
                <p className="mt-1 text-gray-700 dark:text-gray-300">Completed <span className="font-medium">Electrostatics</span> chapter test</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-secondary-500 ring-4 ring-white"></div>
              <div>
                <div className="flex items-center">
                  <p className="text-sm bg-secondary-50 text-secondary-700 px-2 py-1 rounded-md">3 days ago</p>
                </div>
                <p className="mt-1 text-gray-700 dark:text-gray-300">Added notes to <span className="font-medium">Organic Chemistry</span> chapter</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-accent-500 ring-4 ring-white"></div>
              <div>
                <div className="flex items-center">
                  <p className="text-sm bg-accent-50 text-accent-700 px-2 py-1 rounded-md">1 week ago</p>
                  <div className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                    30 Questions
                  </div>
                </div>
                <p className="mt-1 text-gray-700">Created a custom test for <span className="font-medium">Physics</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 