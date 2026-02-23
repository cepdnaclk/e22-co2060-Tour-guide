import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";


const baseHero = "/home-base.png";

const colomboImg = "/kandy.jpg";
const gampahaImg = "/kandy.jpg";
const kalutaraImg = "/kandy.jpg";
const kandyImg = "/kandy.jpg";
const mataleImg = "/kandy.jpg";
const nuwaraEliyaImg = "/kandy.jpg";
const galleImg = "/kandy.jpg";
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

  return (
    <div className="home">
      {/* HERO: uses your screenshot as the base */}
      <header className="hero">
        <img className="heroImage" src={baseHero} alt="Perfect Guide Home" />
        <div className="heroOverlay">
          <h1>Perfect Guide</h1>
          <p>Discover places, food, and luxury experiences across all districts.</p>

          <div className="heroActions">
            <button onClick={() => navigate("/tourism")}>Tourism</button>
            <button onClick={() => navigate("/delights")}>Delights</button>
            <button onClick={() => navigate("/tripplan")}>Trip Plan</button>
          </div>
        </div>
      </header>

      {/* DISTRICT NAV */}
      <section className="districtSection">
        <div className="sectionTitleRow">
          
          
        </div>

        <div className="districtGrid">
          {districts.map((d) => (
            <button
              key={d.slug}
              className="districtCard"
              onClick={() => navigate(`/district/${d.slug}`)}
              title={`Open ${d.name}`}
            >
              <img src={d.image} alt={d.name} />
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