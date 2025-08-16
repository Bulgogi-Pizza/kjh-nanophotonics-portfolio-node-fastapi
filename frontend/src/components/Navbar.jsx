import React from 'react';
import {NavLink} from 'react-router-dom';

function Navbar() {
  const menuItems = [
    {name: 'Home', to: '/'},
    {name: 'Publications', to: '/publications'},
    // { name: 'CV', to: '/cv' },
  ];

  // NavLink에 적용할 스타일. active 상태일 때 파란색으로 변경됩니다.
  const linkStyle = ({isActive}) => ({
    fontWeight: isActive ? 'bold' : 'semibold',
    color: isActive ? '#3b82f6' : '#374151', // active: blue-500, inactive: gray-700
  });

  return (
      <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <h1 className="text-xl font-bold">
          <NavLink to="/">Joohoon Kim Portfolio</NavLink>
        </h1>
        <div className="flex items-center space-x-6">
          {menuItems.map((item) => (
              <NavLink
                  key={item.name}
                  to={item.to}
                  style={linkStyle}
              >
                {item.name}
              </NavLink>
          ))}
        </div>
      </nav>
  );
}

export default Navbar;