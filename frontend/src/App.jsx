import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx"
import About from "./pages/about.jsx"
import Contact from "./pages/contact.jsx"
import Tourism from "./pages/tourism.jsx"
import Delights from "./pages/delights.jsx"
import Fancy from "./pages/fancy.jsx"

import Puttalam from "./pages/districts/puttalam";

import Wilpattu from "./pages/attractions/wilpattu";
import SaltPans from "./pages/attractions/saltpans";
import KalpitiyaFort from "./pages/attractions/kalpitiyafort";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tourism" element={<Tourism />} />
        <Route path="/delights" element={<Delights />} />
        <Route path="/fancy" element={<Fancy />} />

        <Route path="/tourism/puttalam" element={<Puttalam />} />

        <Route path="/tourism/puttalam/wilpattu" element={<Wilpattu />} />
        <Route path="/tourism/puttalam/salt-pans" element={<SaltPans />} />
        <Route path="/tourism/puttalam/kalpitiya-fort" element={<KalpitiyaFort />} />

      </Routes>
    </>
  );
}
