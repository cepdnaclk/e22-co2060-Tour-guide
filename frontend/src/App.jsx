import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import Landing from "./pages/landing.jsx"; // Import new landing page
import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Tourism from "./pages/tourism.jsx";
import Explore from "./pages/Explore.jsx";
import TripPlan from "./pages/tripplan.jsx";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DistrictPage from "./pages/DistrictPage";
import Chat from "./pages/chat.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();

  // Hide Navbar on Landing, Login, and Signup pages
  const hideNavbarOn = ["/", "/login", "/signup"];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Full-screen Hero Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Home page updated to /home */}
        <Route path="/home" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tourism" element={<ProtectedRoute><Tourism /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/tripplan" element={<ProtectedRoute><TripPlan /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/district/:slug" element={<DistrictPage />} />
        <Route
          path="/attractions/:id"
          element={<div style={{ padding: 20 }}>Attraction Details Page (build next)</div>}
        />
      </Routes>
    </>
  );
}