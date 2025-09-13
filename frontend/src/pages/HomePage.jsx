import React from 'react';
import HeroSection from '../sections/HeroSection';
import PublicationsSection from '../sections/PublicationsSection';
import ResearchSection from "../sections/ResearchSection.jsx";
import CoverArtsSection from "../sections/CoverArtsSection.jsx";

function HomePage() {
  return (
      <div>
        <HeroSection/>
        <ResearchSection/>
        <CoverArtsSection/>
        <PublicationsSection/>
      </div>
  );
}

export default HomePage;
