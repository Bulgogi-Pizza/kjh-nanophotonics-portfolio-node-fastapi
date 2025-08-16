import React from 'react';

function HeroSection() {
  return (
      // 각 섹션의 최상위 div에 id를 부여하는 것이 중요합니다. (react-scroll이 이 id를 찾아갑니다)
      <div id="home"
           className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to My Portfolio
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Exploring the frontiers of nanophotonics and its applications.
          </p>
        </div>
      </div>
  );
}

export default HeroSection;