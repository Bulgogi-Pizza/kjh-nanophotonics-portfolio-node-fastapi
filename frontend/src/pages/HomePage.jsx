import React from 'react';
import HeroSection from '../sections/HeroSection';
import PublicationsSection from '../sections/PublicationsSection';
import AwardsSection from '../sections/AwardsSection';
import ConferencesSection from '../sections/ConferencesSection';
import MediaSection from '../sections/MediaSection';

function HomePage() {
  return (
      <div>
        <HeroSection/>
        <PublicationsSection/>
        <AwardsSection/>
        <ConferencesSection/>
        <MediaSection/>
      </div>
  );
}

export default HomePage;
