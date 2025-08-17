import React, {createContext, useContext, useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PublicationsPage from './pages/PublicationsPage';
import CVPage from './pages/CVPage';
import AwardsPage from './pages/AwardsPage';
import ConferencesPage from './pages/ConferencesPage';
import MediaPage from './pages/MediaPage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
      <ThemeContext.Provider value={{isDarkMode, toggleDarkMode}}>
        <BrowserRouter>
          <div
              className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Routes>
              <Route path="/" element={<Layout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="publications" element={<PublicationsPage/>}/>
                <Route path="cv" element={<CVPage/>}/>
                <Route path="awards" element={<AwardsPage/>}/>
                <Route path="conferences" element={<ConferencesPage/>}/>
                <Route path="media" element={<MediaPage/>}/>
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeContext.Provider>
  );
}

export default App;
