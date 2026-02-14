import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const images = [
    "/images/beach.jpg",
    "/images/gifts.jpg",
    "/images/town.jpg",
    "/images/diamond.webp",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Loader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Carousel auto change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {loading && (
        <div id="loader">
          <div className="spinner"></div>
        </div>
      )}

      <section className="hero-section">
        <div className="hero-content">
          <h2>Explore Our Guides</h2>
          <p>
            Discover comprehensive guides on tourism, local delights,
            and luxury experiences tailored just for you.
          </p>
        </div>

        <div className="hero-image-carousel">
          <img
            src={images[currentIndex]}
            alt="Dynamic content"
          />

          <div className="carousel-controls">
            {images.map((_, index) => (
              <span
                key={index}
                className={`control-dot ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      <div className="content-blocks">
        <div className="content-block">
          <h3>An Extraordinary Journey</h3>
          <ul>
            <li>Embark on unparalleled adventures.</li>
            <li>
              Our guides provide unique insights, hidden gems, and local
              secrets to transform every trip into a memorable story.
            </li>
          </ul>
        </div>

        <div className="content-block">
          <h3>Capable Across the Globe</h3>
          <ul>
            <li>
              From bustling city centers to serene mountain trails,
              our guides equip you with the knowledge to navigate
              and enjoy any destination with confidence.
            </li>
          </ul>
        </div>

        <div className="content-block">
          <h3>Composed & Refined</h3>
          <ul>
            <li>
              Three meticulously curated sections – tourism,
              delights, and fancy – inform a design brought
              to life by the finest experiences.
            </li>
          </ul>
        </div>

        <div className="content-block">
          <h3>Going Above & Beyond</h3>
          <ul>
            <li>
              Pushing every conceivable boundary, each guide
              exceeds the one before in excitement and performance.
            </li>
          </ul>
        </div>
      </div>

      <section className="info-section">
        <Link to="/tourism" className="section-link">
          <div className="info-text">
            <h3>Tourism: Extraordinary Journeys</h3>
            <ul>
              <li>Planning your next great escape starts here.</li>
              <li>Discover global landmarks and hidden gems.</li>
              <li>Practical tips for seamless journeys.</li>
            </ul>
          </div>

          <div className="info-image">
            <img
              src="/images/beach.jpg"
              alt="Tourism section"
            />
          </div>
        </Link>
      </section>
    </>
  );
}
