import React from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar/>
        <main>
          <Outlet/>
        </main>

        {/* 푸터 */}
        <footer
            className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>&copy; 2025 Joohoon Kim. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}

export default Layout;
