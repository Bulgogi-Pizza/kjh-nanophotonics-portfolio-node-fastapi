import React, {useEffect, useState} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {useTheme} from '../App';

function Navbar() {
  const {isDarkMode, toggleDarkMode} = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [researchDropdownOpen, setResearchDropdownOpen] = useState(false);
  const [researchAreas, setResearchAreas] = useState([]);
  const location = useLocation();

  // Research areas 데이터 로드
  useEffect(() => {
    fetch('/api/research-areas/')
    .then(res => res.json())
    .then(data => setResearchAreas(data))
    .catch(error => console.error('Error fetching research areas:', error));
  }, []);

  const menuItems = [
    {name: 'Home', to: '/'},
    {name: 'Research', to: '/research', hasDropdown: true},
    {name: 'CV', to: '/cv'},
    {name: 'Publications', to: '/publications'},
    {name: 'Awards', to: '/awards'},
    {name: 'Conferences', to: '/conferences'},
  ];

  const getLinkClasses = ({isActive}) => `
    px-4 py-2 text-md xl:text-lg font-medium transition-all duration-200
    ${isActive
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
  }
  `;

  return (
      <nav
          className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="relative container mx-auto px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <NavLink
                to="/"
                className="text-xl xl:text-2xl font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Joohoon Kim
            </NavLink>

            {/* 데스크탑 메뉴 */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                  <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => item.hasDropdown
                          && setResearchDropdownOpen(true)}
                      onMouseLeave={() => item.hasDropdown
                          && setResearchDropdownOpen(false)}
                  >
                    <NavLink
                        to={item.to}
                        className={getLinkClasses}
                    >
                      {item.name}
                    </NavLink>

                    {/* Research 드롭다운 메뉴 */}
                    {item.hasDropdown && researchDropdownOpen
                        && researchAreas.length > 0 && (
                            <div
                                className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg py-2 z-50">
                              {researchAreas.map((area) => (
                                  <NavLink
                                      key={area.slug}
                                      to={`/research/${area.slug}`}
                                      className="block px-4 py-2 text-sm xl:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  >
                                    {area.title}
                                  </NavLink>
                              ))}
                            </div>
                        )}
                  </div>
              ))}
            </div>

            {/* 우측 메뉴 아이콘 */}
            <div className="flex items-center space-x-4">
              {/* 다크모드 토글 */}
              <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                    <svg className="w-5 h-5" fill="currentColor"
                         viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                            clipRule="evenodd"/>
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor"
                         viewBox="0 0 20 20">
                      <path
                          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                )}
              </button>

              {/* 모바일 메뉴 버튼 */}
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMobileMenuOpen && (
              <div
                  className="lg:hidden border-t border-gray-200 dark:border-gray-700">
                <div className="px-4 pt-2 pb-4 space-y-1">
                  {menuItems.map((item) => (
                      <div key={item.name}>
                        <NavLink
                            to={item.to}
                            className={({isActive}) => `
                        block px-3 py-2 text-base font-medium transition-colors
                        ${isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                            }
                      `}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </NavLink>

                        {/* 모바일 Research 서브메뉴 */}
                        {item.hasDropdown && (
                            <div className="ml-4 space-y-1">
                              {researchAreas.map((area) => (
                                  <NavLink
                                      key={area.slug}
                                      to={`/research/${area.slug}`}
                                      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {area.title}
                                  </NavLink>
                              ))}
                            </div>
                        )}
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      </nav>
  );
}

export default Navbar;
