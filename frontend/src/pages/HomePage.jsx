import React from 'react';
import PublicationsSection from "../sections/PublicationsSection.jsx";
import HeroSection from "../sections/HeroSection.jsx";

function HomePage() {
  return (
      <>
        <HeroSection/>
        {/* <ResearchSection /> */}
        <PublicationsSection/>
        {/* <MediaSection /> */}
      </>
  );
}

export default HomePage;