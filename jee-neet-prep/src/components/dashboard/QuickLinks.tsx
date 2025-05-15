import { Link } from 'react-router-dom';
import { 
  HiBookOpen, 
  HiDocumentText, 
  HiQuestionMarkCircle, 
  HiChartBar, 
  HiArrowRight 
} from 'react-icons/hi';

const QuickLinks = () => {
  const links = [
    {
      icon: HiBookOpen,
      title: 'Track Preparation',
      description: 'Monitor your progress chapter-wise for each subject',
      path: '/preparation',
      color: 'primary',
      emoji: '📚',
    },
    {
      icon: HiDocumentText,
      title: 'Custom Test',
      description: 'Create personalized practice tests with selected topics',
      path: '/custom-test',
      color: 'secondary',
      emoji: '📝',
    },
    {
      icon: HiQuestionMarkCircle,
      title: 'Question Bank',
      description: 'Access previous years questions with detailed solutions',
      path: '/question-bank',
      color: 'accent',
      emoji: '🧠',
    },
    {
      icon: HiChartBar,
      title: 'Analytics',
      description: 'View detailed performance insights and improvement areas',
      path: '/analytics',
      color: 'primary',
      emoji: '📊',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {links.map((link, index) => (
        <Link
          key={link.path}
          to={link.path}
          className="block h-full group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="h-full border border-gray-100 dark:border-gray-700 p-6 rounded-xl bg-transparent dark:bg-dark-surface shadow-soft transition-all duration-300 hover:border-primary-200 relative overflow-hidden hover:-translate-y-1 transform">
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Emoji in top right corner */}
            <div className="absolute top-4 right-4 text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
              {link.emoji}
            </div>
            
            <div className="relative z-10">
              <div className={`w-12 h-12 inline-flex items-center justify-center rounded-xl bg-${link.color}-100 text-${link.color}-500 mb-5 transition-all duration-300 group-hover:scale-110 transform group-hover:bg-${link.color}-200`}>
                <link.icon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-dark-text group-hover:text-primary-600 transition-colors">{link.title}</h2>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-300 mb-5">{link.description}</p>
              <div className="flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all -mb-6 group-hover:mb-0">
                <span>Explore</span>
                <HiArrowRight className="ml-1 h-4 w-4 transition-transform transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickLinks; 