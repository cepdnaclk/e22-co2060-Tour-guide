# PERFECT GUIDE – Tourism & Travel Recommendation Engine

[![Live Application](https://img.shields.io/badge/Live_Demo-Netlify-brightgreen?style=for-the-badge&logo=netlify)](https://travel-guide-webapp.netlify.app/)
[![React Version](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-v11-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Course](https://img.shields.io/badge/Course-CO2060-purple?style=for-the-badge)](https://projects.ce.pdn.ac.lk)

---

## 📌 Project Overview
**PERFECT GUIDE** is a modern, single-page web application engineered to revolutionize domestic and international travel planning across Sri Lanka[cite: 1, 2]. Built using React 19, Vite, Tailwind CSS v4, and Firebase, the platform combines interactive map exploration, AI conversational assistance, deterministic trip-planning algorithms, and real-time community engagement into a cohesive user experience[cite: 1, 2].

The application addresses common tourist challenges—such as budget mismanagement, fragmented destination information, and isolated real-time updates—by delivering centralized district data, automated route pacing, cost transparency, and regional live chatrooms[cite: 1, 2].

---

## ✨ Key Features

* 🗺️ **District-Based Navigation & Dynamic Maps:** Interactive geographic visualization powered by Leaflet and OpenStreetMap, featuring district-wise filtering and custom map pins for 36+ locations across Sri Lanka[cite: 1, 2].
* 🤖 **AI-Powered Travel Assistant:** Conversational travel helper utilizing Google Gemini 1.5 Flash API with built-in regular expression NLP fallback parsing for offline resilience.
* 🧠 **Smart Algorithmic Trip Planner:** Deterministic itinerary engine using the **Haversine formula** to calculate distance, pace day-by-day travel schedules, and enforce budget constraints with fuel cost estimations.
* 💬 **Real-Time Community Chatrooms:** District-segregated live messaging channels built on Cloud Firestore for peer-to-peer travel advice and local updates[cite: 1, 2].
* 🛠️ **Essential Infrastructure Directory:** Location-aware spatial search for accommodations, fuel stations, vehicle repair centers, food/dining, and medical facilities[cite: 1, 2].
* 🔐 **Authentication & Route Guarding:** Secure account creation, login, and protected route access managed via Firebase Authentication and custom React route wrappers.

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 7 | Component-driven UI architecture with fast module reloading[cite: 1, 2] |
| **Styling & UI** | Tailwind CSS v4 + Framer Motion | Utility-first responsive styling and micro-interactions[cite: 1, 2] |
| **Maps & GIS** | Leaflet / React-Leaflet | Open-source interactive maps, polyline routes, and custom markers[cite: 1, 2] |
| **AI Integration** | `@google/generative-ai` | Gemini 1.5 Flash API integration for natural language intent parsing |
| **Backend & Auth** | Firebase Auth + Cloud Firestore | User session management and real-time NoSQL cloud database |

---

## 📁 Repository & Codebase Structure

```text
frontend/
├── src/
│   ├── assets/              # District images, static media, and banners
│   ├── components/          # Reusable UI components (Navbar, PlacesMap, ProtectedRoute)
│   ├── context/             # Global state providers (AuthContext.jsx)
│   ├── hooks/               # Custom React hooks (useUserLocation, useRateLimit)
│   ├── pages/               # Primary view routes (tripplan, chat, Explore, District pages)
│   ├── services/            # Core business logic (TripEngine.js, GeminiService.js)
│   ├── firebase.js          # Firebase SDK initialization & handle exports
│   ├── main.jsx             # React DOM entry point & Router provider
│   └── App.jsx              # Master route registry & access controls
├── uploadData.js            # Node.js script for Firestore database seeding
├── firestore.rules          # Firestore database security rules
└── package.json             # Project metadata and dependencies
