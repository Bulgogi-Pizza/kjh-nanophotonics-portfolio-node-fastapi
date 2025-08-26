import React from 'react';
import HeroSection from '../sections/HeroSection';
import PublicationsSection from '../sections/PublicationsSection';
import ResearchSection from "../sections/ResearchSection.jsx";

function HomePage() {
  return (
      <div>
        <HeroSection/>
        <ResearchSection/>
        <PublicationsSection/>
      </div>
  );
}

export default HomePage;
