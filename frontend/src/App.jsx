import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Tourism from "./pages/tourism/tourism.jsx";
import Beaches from "./pages/tourism/Beaches.jsx";
import Mountains from "./pages/tourism/Mountains.jsx";
import Heritage from "./pages/tourism/Heritage.jsx";
import Wildlife from "./pages/tourism/Wildlife.jsx";
import Waterfalls from "./pages/tourism/Waterfalls.jsx";
import City from "./pages/tourism/City.jsx";
import AttractionDetails from "./pages/tourism/AttractionDetails.jsx";
import Explore from "./pages/Explore.jsx";
import TripPlan from "./pages/tripplan.jsx";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DistrictPage from "./pages/DistrictPage";
import Chat from "./pages/chat.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tourism" element={<ProtectedRoute><Tourism /></ProtectedRoute>} />
        <Route path="/tourism/beaches" element={<ProtectedRoute><Beaches /></ProtectedRoute>} />
        <Route path="/tourism/mountains" element={<ProtectedRoute><Mountains /></ProtectedRoute>} />
        <Route path="/tourism/heritage" element={<ProtectedRoute><Heritage /></ProtectedRoute>} />
        <Route path="/tourism/wildlife" element={<ProtectedRoute><Wildlife /></ProtectedRoute>} />
        <Route path="/tourism/waterfalls" element={<ProtectedRoute><Waterfalls /></ProtectedRoute>} />
        <Route path="/tourism/city" element={<ProtectedRoute><City /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/tripplan" element={<ProtectedRoute><TripPlan /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/district/:slug" element={<DistrictPage />} />
        <Route
          path="/attractions/:category/:id"
          element={<ProtectedRoute><AttractionDetails /></ProtectedRoute>}
        />
      </Routes>
    </>
  );
}