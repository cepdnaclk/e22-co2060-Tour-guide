import React, { useState, useEffect } from 'react';
import './heroslider.css';

const HeroSlider = () => {
    // 1. All images stay in this ONE file
    const puttalamImages = [
        "/images/tourism/tourism1.jpg",
        "/images/tourism/tourism2.jpg",
        "/images/tourism/tourism3.jpg",
        "/images/tourism/tourism4.jpg"
    ];

    const colomboImages = [
        "/images/colombo1.jpg", 
        "/images/colombo2.jpg"
    ];

    // 2. This line checks the URL (e.g., "/colombo" or "/")
    const currentPath = window.location.pathname;

    // 3. Logic: If the URL is "colombo", use colomboImages. Otherwise, use Puttalam.
    let images = puttalamImages; 
    let title = "Your Island Adventure Starts Here";
    let subtitle = "Explore hidden gems, ancient ruins, and pristine beaches with local experts.";

    if (currentPath.includes("colombo")) {
        images = colomboImages;
        title = "Welcome to Colombo City";
    }

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images]);

    return (
        
        <div className="slider-wrapper">
            
            <section 
                className="hero-carousel-section" 
                style={{ backgroundImage: `url(${images[currentIndex]})` }}
            >
                <div className="hero-overlay-text">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>
            </section>
        </div>
    );
};

export default HeroSlider;