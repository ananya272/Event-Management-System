import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { LogOut, Bell, User, Calendar, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { notifications } = useData();

  // Theme state
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  React.useEffect(() => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const unreadNotifications = notifications.filter(n => !n.read && n.userId === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <nav className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-2xl border-b border-blue-200 dark:border-gray-700 sticky top-0 z-30 rounded-b-2xl mx-2 mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Calendar className="w-10 h-10 text-blue-700 drop-shadow-lg mr-3 animate-pulse" />
                <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight drop-shadow-md">EventManager</h1>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="mr-2 px-3 py-2 rounded-full bg-blue-50 dark:bg-gray-800 text-xl shadow hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors duration-200"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <div className="relative group">
                <Bell className="w-7 h-7 text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-200" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-md animate-bounce">
                    {unreadNotifications.length}
                  </span>
                )}
              </div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full shadow-sm">
                    <User className="w-6 h-6 text-blue-400" />
                    <span className="text-base font-semibold text-blue-900">{user?.name}</span>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full capitalize font-bold">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-blue-500 hover:text-red-600 transition-colors duration-200 bg-white/60 px-3 py-1 rounded-lg shadow hover:shadow-lg border border-blue-100 hover:border-red-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <a href="/login" className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-colors duration-200">Login</a>
                  <a href="/signup" className="px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-full font-semibold shadow hover:from-blue-500 hover:to-purple-600 transition-colors duration-200">Sign Up</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;