import React from 'react';
import HeroSlider from '../components/HeroSlider/HeroSlider';
import DestinationGrid from '../components/DestinationGrid/DestinationGrid';
import Footer from '../components/Footer/Footer';
import './tourism.css'; 

const tourism = () => {
  return (
    <div className="tourism-page-wrapper">
      <HeroSlider />
      
      <main>
        {/* This container will handle the centering */}
        <div className="tourism-intro-container">
            <h1 className="tourism-main-title">Explore Unique Districts</h1>
            <p className="tourism-main-subtitle">
                Select a district to discover its unique beauty, history, and curated travel guides.
            </p>
        </div>

        <DestinationGrid />

        <Footer />
      </main>
    </div>
  );
};

export default tourism;