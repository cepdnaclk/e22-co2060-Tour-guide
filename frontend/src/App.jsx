import Navbar from "../src/components/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx"
import About from "./pages/about.jsx"
function Contact() { return <div className="p-6">Contact</div>; }
function Tourism() { return <div className="p-6">Tourism</div>; }
function Delights() { return <div className="p-6">Delights</div>; }
function Fancy() { return <div className="p-6">Fancy</div>; }

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tourism" element={<Tourism />} />
        <Route path="/delights" element={<Delights />} />
        <Route path="/fancy" element={<Fancy />} />
      </Routes>
    </>
  );
}
