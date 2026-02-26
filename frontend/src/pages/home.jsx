// src/pages/home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

// District placeholder images (from /public)
const colomboImg = "/kandy.jpg";
const gampahaImg = "/kandy.jpg";
const kalutaraImg = "/kandy.jpg";
const kandyImg = "/kandy.jpg";
const mataleImg = "/kandy.jpg";
const nuwaraEliyaImg = "/kandy.jpg";
const galleImg = "/galle.jpg";
const mataraImg = "/kandy.jpg";
const hambantotaImg = "/kandy.jpg";
const jaffnaImg = "/kandy.jpg";
const kilinochchiImg = "/kandy.jpg";
const mannarImg = "/kandy.jpg";
const mullaitivuImg = "/kandy.jpg";
const vavuniyaImg = "/kandy.jpg";
const trincoImg = "/kandy.jpg";
const batticaloaImg = "/kandy.jpg";
const amparaImg = "/kandy.jpg";
const puttalamImg = "/kandy.jpg";
const kurunegalaImg = "/kandy.jpg";
const anuradhapuraImg = "/kandy.jpg";
const polonnaruwaImg = "/kandy.jpg";
const badullaImg = "/kandy.jpg";
const monaragalaImg = "/kandy.jpg";
const ratnapuraImg = "/kandy.jpg";
const kegalleImg = "/kandy.jpg";

const districts = [
  { name: "Colombo", slug: "colombo", image: colomboImg },
  { name: "Gampaha", slug: "gampaha", image: gampahaImg },
  { name: "Kalutara", slug: "kalutara", image: kalutaraImg },
  { name: "Kandy", slug: "kandy", image: kandyImg },
  { name: "Matale", slug: "matale", image: mataleImg },
  { name: "Nuwara Eliya", slug: "nuwara-eliya", image: nuwaraEliyaImg },
  { name: "Galle", slug: "galle", image: galleImg },
  { name: "Matara", slug: "matara", image: mataraImg },
  { name: "Hambantota", slug: "hambantota", image: hambantotaImg },
  { name: "Jaffna", slug: "jaffna", image: jaffnaImg },
  { name: "Kilinochchi", slug: "kilinochchi", image: kilinochchiImg },
  { name: "Mannar", slug: "mannar", image: mannarImg },
  { name: "Mullaitivu", slug: "mullaitivu", image: mullaitivuImg },
  { name: "Vavuniya", slug: "vavuniya", image: vavuniyaImg },
  { name: "Trincomalee", slug: "trincomalee", image: trincoImg },
  { name: "Batticaloa", slug: "batticaloa", image: batticaloaImg },
  { name: "Ampara", slug: "ampara", image: amparaImg },
  { name: "Puttalam", slug: "puttalam", image: puttalamImg },
  { name: "Kurunegala", slug: "kurunegala", image: kurunegalaImg },
  { name: "Anuradhapura", slug: "anuradhapura", image: anuradhapuraImg },
  { name: "Polonnaruwa", slug: "polonnaruwa", image: polonnaruwaImg },
  { name: "Badulla", slug: "badulla", image: badullaImg },
  { name: "Monaragala", slug: "monaragala", image: monaragalaImg },
  { name: "Ratnapura", slug: "ratnapura", image: ratnapuraImg },
  { name: "Kegalle", slug: "kegalle", image: kegalleImg },
];

export default function HomePage() {
  const navigate = useNavigate();

  // ✅ Hero slideshow images (from /public)
  const heroImages = ["/beach.jpg", "/lagoon.jpeg", "/sunset.jpeg"];
  const [heroIndex, setHeroIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // ✅ Smooth fade slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out

      setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % heroImages.length);
        setFade(true); // fade in
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="home">
      {/* HERO (fade slideshow + blur overlay) */}
      <header className="relative max-w-6xl mx-auto mt-8 rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={heroImages[heroIndex]}
          alt="Trip Banner"
          className={`w-full h-[420px] object-cover transition-opacity duration-700 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Blur + Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold drop-shadow-lg">
            Your Trip Starts Here
          </h1>

          <div className="flex gap-10 mt-6 text-lg">
            <div className="flex items-center gap-2">
              <span className="bg-green-500 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">
                ✓
              </span>
              <span>Secure payment</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-green-500 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">
                ✓
              </span>
              <span>Support in approx. 30s</span>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/tourism")}
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Explore Tourism
            </button>

            <button
              onClick={() => navigate("/tripplan")}
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold border border-white hover:bg-gray-800 transition"
            >
              Trip Plan
            </button>
          </div>
        </div>
      </header>

      {/* DISTRICT NAV */}
      <section className="districtSection">
        <div className="districtGrid">
          {districts.map((d) => (
            <button
              key={d.slug}
              className="districtCard"
              onClick={() => navigate(`/district/${d.slug}`)}
              title={`Open ${d.name}`}
            >
              <img src={d.image} alt={d.name} className="districtImage" />
              <div className="districtLabel">
                <span>{d.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Perfect Guide • Built with React</p>
      </footer>
    </div>
  );
}