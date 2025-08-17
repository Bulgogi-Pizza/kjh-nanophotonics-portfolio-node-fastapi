import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {useTheme} from '../App';

function Navbar() {
  const {isDarkMode, toggleDarkMode} = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {name: 'Home', to: '/'},
    {name: 'Publications', to: '/publications'},
    {name: 'CV', to: '/cv'},
    {name: 'Awards', to: '/awards'},
    {name: 'Conferences', to: '/conferences'},
    {name: 'Media', to: '/media'},
  ];

  const getLinkClasses = ({isActive}) => `
    relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg
    ${isActive
      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
      : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
  }
  `;

  return (
      <nav
          className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <NavLink
                to="/"
                className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              JoohoonKimasdasd
            </NavLink>

            {/* 데스크탑 메뉴 */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                  <NavLink
                      key={item.name}
                      to={item.to}
                      className={getLinkClasses}
                  >
                    {item.name}
                  </NavLink>
              ))}
            </div>

            {/* 다크모드 토글 & 모바일 메뉴 버튼 */}
            <div className="flex items-center space-x-3">
              {/* 다크모드 토글 */}
              <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                    <svg className="w-5 h-5 text-yellow-500"
                         fill="currentColor"
                         viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                            clipRule="evenodd"/>
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-700"
                         fill="currentColor"
                         viewBox="0 0 20 20">
                      <path
                          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                )}
              </button>

              {/* 모바일 메뉴 버튼 */}
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                    <svg className="w-5 h-5" fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                )}
              </button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMobileMenuOpen && (
              <div
                  className="lg:hidden border-t border-gray-200 dark:border-gray-700">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {menuItems.map((item) => (
                      <NavLink
                          key={item.name}
                          to={item.to}
                          className={({isActive}) => `
                  block px-3 py-2 text-base font-medium rounded-lg transition-colors
                  ${isActive
                              ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                              : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                          }
                `}
                          onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </NavLink>
                  ))}
                </div>
              </div>
          )}
        </div>
      </nav>
  );
}

export default Navbar;
