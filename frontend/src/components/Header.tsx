import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  title?: string;
  showHome?: boolean;
  showProfile?: boolean;
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showHome = true,
  showProfile = true,
  showLogout = true,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language } = useLanguage();

  const handleLogout = () => {
    const confirmMsg = language === 'hi'
      ? 'क्या आप लॉगआउट करना चाहते हैं?'
      : 'Are you sure you want to logout?';

    if (window.confirm(confirmMsg)) {
      logout();
      navigate('/');
    }
  };

  const handleHome = () => {
    if (user?.role === 'labour') {
      navigate('/labour-home');
    } else {
      navigate('/employer-home');
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="bg-primary-600 text-white p-4">
      <div className="flex items-center justify-between">
        {/* Left: App Name */}
        <button
          onClick={handleHome}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🏗️</span>
          <div>
            <h1 className="text-lg font-bold">Labour Chowk</h1>
            <p className="text-xs text-primary-100 font-hindi">लेबर चौक</p>
          </div>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {showHome && (
            <button
              onClick={handleHome}
              className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
              title={language === 'hi' ? 'होम' : 'Home'}
            >
              <span className="text-xl">🏠</span>
            </button>
          )}

          {showProfile && (
            <button
              onClick={handleProfile}
              className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
              title={language === 'hi' ? 'प्रोफाइल' : 'Profile'}
            >
              <span className="text-xl">👤</span>
            </button>
          )}

          {showLogout && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              {language === 'hi' ? 'लॉगआउट' : 'Logout'}
            </button>
          )}
        </div>
      </div>

      {/* Optional Title */}
      {title && (
        <h2 className={`text-xl font-bold mt-3 ${language === 'hi' ? 'font-hindi' : ''}`}>
          {title}
        </h2>
      )}
    </div>
  );
};
