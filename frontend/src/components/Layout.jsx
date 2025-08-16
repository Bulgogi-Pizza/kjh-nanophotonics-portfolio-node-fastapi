import React from 'react';
import Navbar from './Navbar';
import {Outlet} from 'react-router-dom';

function Layout() {
  return (
      <div>
        <Navbar/>
        <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet/>
        </main>
      </div>
  );
}

export default Layout;