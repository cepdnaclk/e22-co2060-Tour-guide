import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx"
import About from "./pages/about.jsx"
import Contact from "./pages/contact.jsx"
import Tourism from "./pages/tourism.jsx"
import Explore from "./pages/Explore.jsx"
import TripPlan from "./pages/tripplan.jsx"



import DistrictPage from "./pages/DistrictPage";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tourism" element={<Tourism />} />
        <Route path="/Explore" element={<Explore />} />
        <Route path="/tripplan" element={<TripPlan />} />

           
        <Route path="/district/:slug" element={<DistrictPage />} />


        <Route path="/" element={<Home />} />
        <Route path="/attractions/:id" element={<div style={{ padding: 20 }}>Attraction Details Page (build next)</div>} />
      </Routes>
    </>
  );
}
