import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, MapPin, Wallet, Fuel, Clock, Users, Car, Navigation,
  Sparkles, Map as MapIcon, Camera, ChevronRight, Trash2, RefreshCw,
  Database, Zap, AlertTriangle, ArrowRight, Bookmark, RotateCcw, CheckCircle2
} from 'lucide-react';

import { GeminiService } from '../services/GeminiService';
import { TripOptimizationEngine, VEHICLE_RATES } from '../services/TripEngine';
import { attractions } from './tourism/attractionsData';

// --- STYLES & UTILS ---
const glassmorphismClass = "bg-white/85 backdrop-blur-md border border-white/50 shadow-xl rounded-3xl";
const gradientTextClass = "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent";

// --- QUICK DEMO PROMPTS ---
const QUICK_PROMPTS = [
  {
    label: "🌊 Batticaloa → Galle (Rs. 10,000)",
    context: { origin: "Batticaloa", destination: "Galle", budget: 10000, vehicleType: "Car", personCount: 4, interests: ["Beach", "Heritage"] }
  },
  {
    label: "🚗 Colombo → Jaffna (Rs. 15,000)",
    context: { origin: "Colombo", destination: "Jaffna", budget: 15000, vehicleType: "Car", personCount: 4, interests: ["Historical", "Beach"] }
  },
  {
    label: "🏍️ Kandy → Kurunegala (Rs. 5,000)",
    context: { origin: "Kandy", destination: "Kurunegala", budget: 5000, vehicleType: "Bike", personCount: 2, interests: ["Nature", "Historical"] }
  }
];

const VEHICLE_OPTIONS = [
  { id: "Bike", label: "🏍️ Bike", desc: "Rs. 10/km • 2 Persons" },
  { id: "Car", label: "🚗 Car", desc: "Rs. 25/km • 1-6 Persons" },
  { id: "TukTuk", label: "🛺 TukTuk", desc: "Rs. 15/km • 3 Persons" },
  { id: "Van", label: "🚐 Van", desc: "Rs. 35/km • 6-10 Persons" },
  { id: "Bus", label: "🚌 Bus", desc: "Rs. 45/km • Group" }
];

const PERSON_OPTIONS = [1, 2, 3, 4, 5, 6];

const INTEREST_OPTIONS = [
  { id: "Beach", label: "🏖️ Beach" },
  { id: "Historical", label: "🏰 Heritage & Forts" },
  { id: "Nature", label: "🌿 Nature & Parks" },
  { id: "Waterfall", label: "🌊 Waterfalls" },
  { id: "Religious", label: "🛕 Religious" }
];

// --- SUB-COMPONENTS ---

const ChatBubble = ({ message, isAI }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[85%] md:max-w-[75%] items-end gap-2 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isAI 
            ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100' 
            : 'bg-indigo-600 text-white rounded-br-none'
        }`}>
          {message}
        </div>
      </div>
    </motion.div>
  );
};

const TripSummaryCard = ({ summary }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`${glassmorphismClass} p-6 mb-8 mt-4 border-indigo-100`}
  >
    <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
      <div>
        <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <MapIcon className="text-indigo-600" /> Trip Cost Breakdown
        </h3>
        <p className="text-xs text-gray-500">Realistic per-person travel expenses & fuel calculations</p>
      </div>
      
      {/* Per Person Highlight Badge */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-2xl shadow-md flex items-center gap-2">
        <Users className="w-4 h-4" />
        <div>
          <div className="text-[10px] opacity-80 uppercase tracking-wider font-semibold">Cost Per Person</div>
          <div className="text-lg font-black">{summary.costPerPerson} <span className="text-xs font-normal">/ person ({summary.personCount} travelers)</span></div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
      <div className="flex flex-col bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1 font-medium"><MapPin className="w-3.5 h-3.5 text-blue-600"/> Route & Distance</span>
        <span className="font-bold text-gray-800 text-sm">{summary.origin} → {summary.destination}</span>
        <span className="text-xs text-blue-700 font-semibold mt-1">{summary.distance}</span>
      </div>

      <div className="flex flex-col bg-green-50/60 p-3 rounded-2xl border border-green-100">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1 font-medium"><Wallet className="w-3.5 h-3.5 text-green-600"/> Total Trip Cost</span>
        <span className="font-bold text-green-700 text-base">{summary.totalCost}</span>
        <span className="text-xs text-gray-500">User Budget: {summary.budget}</span>
      </div>

      <div className="flex flex-col bg-amber-50/60 p-3 rounded-2xl border border-amber-100">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1 font-medium"><Fuel className="w-3.5 h-3.5 text-amber-600"/> Vehicle & Fuel Rate</span>
        <span className="font-bold text-gray-800 text-sm">{summary.vehicleType} ({summary.ratePerKm})</span>
        <span className="text-xs text-amber-700 font-semibold mt-1">Est. Fuel: {summary.fuelCost}</span>
      </div>

      <div className="flex flex-col bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1 font-medium"><Clock className="w-3.5 h-3.5 text-purple-600"/> Attraction Tickets</span>
        <span className="font-bold text-gray-800 text-sm">{summary.ticketCost}</span>
        <span className="text-xs text-purple-700 font-semibold mt-1">{summary.attractionCount} Stops En-Route</span>
      </div>
    </div>
  </motion.div>
);

const getRelevantImage = (stop, index) => {
  if (stop.imageUrl) return stop.imageUrl;
  if (stop.image) return stop.image;
  
  if (stop.name) {
    const nameMatch = attractions.find(a => 
      a.name.toLowerCase() === stop.name.toLowerCase() || 
      a.name.toLowerCase().includes(stop.name.toLowerCase()) ||
      stop.name.toLowerCase().includes(a.name.toLowerCase())
    );
    if (nameMatch && nameMatch.image) return nameMatch.image;
  }
  
  // High-quality relevant images mapped by Sri Lankan districts
  const districtImageMap = {
    colombo: "https://images.unsplash.com/photo-1549491740-496fa4a34bba?auto=format&fit=crop&w=800&q=80",
    gampaha: "https://images.unsplash.com/photo-1549491740-496fa4a34bba?auto=format&fit=crop&w=800&q=80",
    kandy: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
    matale: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=800&q=80",
    dambulla: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=800&q=80",
    nuwara: "https://images.unsplash.com/photo-1545284929-de966378e945?auto=format&fit=crop&w=800&q=80",
    badulla: "https://images.unsplash.com/photo-1545284929-de966378e945?auto=format&fit=crop&w=800&q=80",
    ella: "https://images.unsplash.com/photo-1545284929-de966378e945?auto=format&fit=crop&w=800&q=80",
    galle: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    matara: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    hambantota: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    jaffna: "https://images.unsplash.com/photo-1601009088656-78e7f8f90240?auto=format&fit=crop&w=800&q=80",
    kilinochchi: "https://images.unsplash.com/photo-1601009088656-78e7f8f90240?auto=format&fit=crop&w=800&q=80",
    vavuniya: "https://images.unsplash.com/photo-1601009088656-78e7f8f90240?auto=format&fit=crop&w=800&q=80",
    mannar: "https://images.unsplash.com/photo-1601009088656-78e7f8f90240?auto=format&fit=crop&w=800&q=80",
    mullaitivu: "https://images.unsplash.com/photo-1601009088656-78e7f8f90240?auto=format&fit=crop&w=800&q=80",
    batticaloa: "https://images.unsplash.com/photo-1538356312445-5df040f7fdbb?auto=format&fit=crop&w=800&q=80",
    trincomalee: "https://images.unsplash.com/photo-1538356312445-5df040f7fdbb?auto=format&fit=crop&w=800&q=80",
    ampara: "https://images.unsplash.com/photo-1538356312445-5df040f7fdbb?auto=format&fit=crop&w=800&q=80",
    kurunegala: "https://images.unsplash.com/photo-1554904494-b15234de5bc3?auto=format&fit=crop&w=800&q=80",
    puttalam: "https://images.unsplash.com/photo-1554904494-b15234de5bc3?auto=format&fit=crop&w=800&q=80",
    anuradhapura: "https://images.unsplash.com/photo-1620393246325-3b91bc0bb25f?auto=format&fit=crop&w=800&q=80",
    polonnaruwa: "https://images.unsplash.com/photo-1620393246325-3b91bc0bb25f?auto=format&fit=crop&w=800&q=80",
    ratnapura: "https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=800&q=80",
    kegalle: "https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=800&q=80",
    monaragala: "https://images.unsplash.com/photo-1558234907-8e100913cb9e?auto=format&fit=crop&w=800&q=80",
    kalutara: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
  };

  if (stop.district) {
    const distLower = stop.district.toLowerCase();
    for (const key of Object.keys(districtImageMap)) {
      if (distLower.includes(key)) {
        return districtImageMap[key];
      }
    }
  }
  
  const fallbacks = [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1545284929-de966378e945?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
  ];
  return fallbacks[index % fallbacks.length];
};

const Timeline = ({ stops, onRemove }) => (
  <div className="relative pl-4 md:pl-0">
    <div className="absolute left-6 md:left-[50%] top-4 bottom-4 w-0.5 bg-indigo-100 rounded-full transform md:-translate-x-1/2"></div>
    
    <div className="flex flex-col gap-6">
      {stops.map((stop, index) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          key={stop.id || index} 
          className={`flex flex-col md:flex-row relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
          <div className="absolute left-2 md:left-1/2 transform -translate-x-1/2 mt-4 md:mt-0 md:top-1/2 md:-translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-4 border-white flex items-center justify-center z-10 shadow-lg overflow-hidden">
            <img 
              src={getRelevantImage(stop, index)} 
              alt={stop.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=100&q=80' }}
            />
          </div>
          
          <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-10' : 'md:pr-10 text-left md:text-right'}`}>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group overflow-hidden">
              <div className="w-full h-32 md:h-40 relative">
                <img 
                  src={getRelevantImage(stop, index)} 
                  alt={stop.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80' }}
                />
              </div>
              
              <div className="p-5 text-left">
                <h4 className="font-extrabold text-gray-800 text-lg leading-tight mb-1">{stop.name}</h4>
                <p className="text-xs text-gray-500 font-medium mb-3">{stop.district}</p>
                
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-600 justify-start md:justify-start">
                  <Clock className="w-3.5 h-3.5" /> Arrive: {stop.arrivalTime} • Stay: {stop.estimatedVisitTime}m
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-600 justify-start md:justify-start mb-4 bg-gray-50 p-2 rounded-xl">
                  <span className="font-semibold text-green-700 flex items-center gap-1"><Wallet className="w-3 h-3 text-green-600" /> Ticket: Rs. {stop.ticketPrice}</span>
                  <span>•</span>
                  <span className="text-gray-500">Dist: {stop.travelDistance}</span>
                </div>
                
                <div className="flex gap-2 justify-start md:justify-start">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.name + ', ' + stop.district)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-colors font-medium"
                  >
                    <MapPin className="w-3 h-3" /> View on Map
                  </a>
                  <button 
                    onClick={() => onRemove(stop.id)}
                    className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors font-medium"
                  >
                    <Trash2 className="w-3 h-3" /> Remove Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function TripPlanner() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello 👋 \n\nTell me about your trip", isAI: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Intelligence Layer States
  const [tripContext, setTripContext] = useState({});
  const [itinerary, setItinerary] = useState(null);
  const [budgetWarning, setBudgetWarning] = useState(null);
  
  // Saved Trips History
  const [savedTrips, setSavedTrips] = useState([]);

  const messagesEndRef = useRef(null);

  // Load saved trips from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("saved_trips");
      if (stored) {
        setSavedTrips(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, budgetWarning]);

  // Main Trip Generation Function (Auto-jumps upon completion)
  const handleGenerateTrip = async (contextOverride) => {
    setIsGenerating(true);
    setBudgetWarning(null);
    try {
      const targetContext = contextOverride || tripContext;
      const result = await TripOptimizationEngine.generateTrip(targetContext);

      if (!result.isFeasible) {
        // Budget Warning Alert logic
        setBudgetWarning(result.warning);
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            text: `⚠️ Budget Warning! Fuel cost alone for ${targetContext.origin} → ${targetContext.destination} (${result.warning.roundTripDistance} km round trip) is ~Rs. ${result.warning.estFuelCost.toLocaleString()} by ${result.warning.vehicleType}. Your budget is Rs. ${result.warning.userBudget.toLocaleString()}.`, 
            isAI: true 
          }
        ]);
      } else {
        setItinerary(result);
        
        // Save trip to localStorage
        const newTripRecord = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          summary: result.summary,
          timeline: result.timeline,
          context: targetContext
        };
        const updatedSaved = [newTripRecord, ...savedTrips.filter(t => t.summary.destination !== result.summary.destination).slice(0, 4)];
        setSavedTrips(updatedSaved);
        localStorage.setItem("saved_trips", JSON.stringify(updatedSaved));
      }
    } catch (error) {
      console.error("Failed to generate trip:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const processChatMessage = async (userText, updatedContextOverride) => {
    const userMsg = { id: Date.now(), text: userText, isAI: false };
    const updatedHistory = [...messages, userMsg];
    
    setMessages(updatedHistory);
    setInputValue("");
    setIsTyping(true);

    try {
      const currentCtx = updatedContextOverride || tripContext;
      const aiResult = await GeminiService.processChat(updatedHistory, currentCtx);
      
      setTripContext(aiResult.extractedContext);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResult.nextMessage, isAI: true }]);
      
      // AUTO-JUMP TO GENERATED ITINERARY AUTOMATICALLY!
      if (aiResult.isComplete) {
        await handleGenerateTrip(aiResult.extractedContext);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    processChatMessage(inputValue);
  };

  // Interactive Button Click Handlers
  const handleSelectVehicle = (vId) => {
    const nextCtx = { ...tripContext, vehicleType: vId };
    if (vId === "Bike") nextCtx.personCount = 2;
    setTripContext(nextCtx);
    processChatMessage(`Traveling by ${vId}`, nextCtx);
  };

  const handleSelectPersons = (count) => {
    const nextCtx = { ...tripContext, personCount: count };
    setTripContext(nextCtx);
    processChatMessage(`${count} travelers`, nextCtx);
  };

  const handleSelectInterest = (intId) => {
    const currentInts = tripContext.interests || [];
    const nextInts = currentInts.includes(intId) ? currentInts.filter(i => i !== intId) : [...currentInts, intId];
    const nextCtx = { ...tripContext, interests: nextInts };
    setTripContext(nextCtx);
  };

  const handleSelectAlternativeDestination = (alt) => {
    const nextCtx = { ...tripContext, destination: alt.district };
    setTripContext(nextCtx);
    setBudgetWarning(null);
    processChatMessage(`Let's go to ${alt.district} instead!`, nextCtx);
  };

  const handleContinueWithIncreasedBudget = () => {
    if (!budgetWarning) return;
    const requiredBudget = budgetWarning.estFuelCost + 3000;
    const nextCtx = { ...tripContext, budget: requiredBudget, allowOverBudget: true };
    setTripContext(nextCtx);
    setBudgetWarning(null);
    handleGenerateTrip(nextCtx);
  };

  const handleRemovePlace = (placeId) => {
    if (!itinerary) return;
    const newTimeline = itinerary.timeline.filter(p => p.id !== placeId);
    const updatedTicketCost = newTimeline.reduce((acc, curr) => acc + (curr.ticketPrice || 0), 0);
    
    setItinerary({
      ...itinerary,
      timeline: newTimeline,
      summary: {
        ...itinerary.summary,
        attractionCount: newTimeline.length,
        ticketCost: `Rs. ${updatedTicketCost.toLocaleString()}`
      }
    });
  };

  const reloadSavedTrip = (saved) => {
    setItinerary({
      summary: saved.summary,
      timeline: saved.timeline
    });
  };

  const resetPlanner = () => {
    setItinerary(null);
    setBudgetWarning(null);
    setTripContext({});
    setMessages([{ id: 1, text: "Hello 👋 I'm your Smart Travel Assistant powered by Firebase Firestore & Per-Person Cost Engine.\n\nTell me about your trip, or select quick interactive buttons below!", isAI: true }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 font-sans text-gray-800 pb-16">
      
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        
        <AnimatePresence mode="wait">
          {!itinerary ? (
            /* --- CHAT INTERFACE --- */
            <motion.div 
              key="chat-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${glassmorphismClass} flex flex-col h-[78vh] overflow-hidden`}
            >
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/40">
                <div className="flex items-center gap-3"> 
                  <div>
                    <h2 className="font-bold text-gray-800">Trip Plan</h2>
                  </div>
                </div>
              </div>

              {/* Quick Preset Prompts */}
              <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100/50 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
                <span className="font-semibold text-indigo-900 flex items-center gap-1 whitespace-nowrap">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Presets:
                </span>
                {QUICK_PROMPTS.map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTripContext(pill.context);
                      handleGenerateTrip(pill.context);
                    }}
                    className="bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full font-medium transition-all shadow-sm whitespace-nowrap flex-shrink-0"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Chat Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50/30">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg.text} isAI={msg.isAI} />
                ))}

                {/* --- DYNAMIC INTERACTIVE ACTION BUTTONS --- */}
                
                {/* 1. Vehicle Mode Selector */}
                {(!tripContext.vehicleType && tripContext.origin && tripContext.destination && tripContext.budget) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-white rounded-3xl border border-indigo-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-1">
                      <Car className="w-4 h-4 text-indigo-600" /> Select Mode of Travel:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {VEHICLE_OPTIONS.map(v => (
                        <button
                          key={v.id}
                          onClick={() => handleSelectVehicle(v.id)}
                          className="flex flex-col items-center p-3 rounded-2xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/60 transition-all text-center"
                        >
                          <span className="font-bold text-sm text-gray-800">{v.label}</span>
                          <span className="text-[10px] text-gray-500 mt-1">{v.desc}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 2. Person Count Selector */}
                {(tripContext.vehicleType && tripContext.vehicleType !== "Bike" && !tripContext.personCount && tripContext.origin && tripContext.destination) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-white rounded-3xl border border-indigo-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-1">
                      <Users className="w-4 h-4 text-indigo-600" /> How many people are traveling in your {tripContext.vehicleType}?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PERSON_OPTIONS.map(num => (
                        <button
                          key={num}
                          onClick={() => handleSelectPersons(num)}
                          className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-700 font-bold rounded-2xl text-sm transition-all"
                        >
                          {num} {num === 1 ? 'Person' : 'Persons'}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 3. Budget Warning Alert Card */}
                {budgetWarning && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-5 bg-amber-50/90 border border-amber-200 rounded-3xl shadow-md">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-amber-500 text-white rounded-2xl">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-amber-900 text-sm">Budget Warning for {tripContext.origin} → {tripContext.destination}</h4>
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                          Round trip distance is <strong>{budgetWarning.roundTripDistance} km</strong>. Estimated fuel cost by {budgetWarning.vehicleType} ({budgetWarning.ratePerKm}) is <strong>Rs. {budgetWarning.estFuelCost.toLocaleString()}</strong>, which exceeds your budget of <strong>Rs. {budgetWarning.userBudget.toLocaleString()}</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-col gap-2">
                      <p className="text-xs font-bold text-amber-900">Recommended Alternate Destinations Within Your Rs. {budgetWarning.userBudget.toLocaleString()} Budget:</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                        {budgetWarning.altDestinations.map((alt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelectAlternativeDestination(alt)}
                            className="flex flex-col p-3 bg-white hover:bg-amber-600 hover:text-white rounded-2xl border border-amber-200 text-left transition-all"
                          >
                            <span className="font-bold text-xs">{alt.district} ({alt.oneWayKm} km)</span>
                            <span className="text-[10px] opacity-80 mt-1">Fuel Est: Rs. {alt.estFuelCost.toLocaleString()}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleContinueWithIncreasedBudget}
                        className="mt-2 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-2xl transition-all shadow-sm"
                      >
                        ⚡ Increase Budget to Rs. {(budgetWarning.estFuelCost + 3000).toLocaleString()} & Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {(isTyping || isGenerating) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start w-full mb-4"
                  >
                    <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-xs text-gray-600 font-medium">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                      </div>
                      <span>{isGenerating ? "Routing highway corridor & computing per-person expenses..." : "Thinking..."}</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Text Input */}
              <div className="p-4 bg-white/60 border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type trip details... e.g., 'Batticaloa to Galle, budget 10000, 4 people by car'" 
                    className="w-full bg-white border border-gray-200 rounded-full py-3.5 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isTyping || isGenerating}
                    className="absolute right-2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* --- ITINERARY VIEW --- */
            <motion.div 
              key="itinerary-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-3xl font-black ${gradientTextClass}`}>Optimized Trip Itinerary</h2>
                  <p className="text-gray-500 text-xs mt-1">Realistic en-route pitstops with per-person expense splitting.</p>
                </div>
                <button 
                  onClick={resetPlanner}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-2xl transition-all shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start New Trip
                </button>
              </div>

              <TripSummaryCard summary={itinerary.summary} />

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 px-2 flex items-center justify-between">
                  <span>En-Route Attractions & Timeline</span>
                  <span className="text-xs font-normal text-gray-500">{itinerary.timeline.length} Planned Pitstops</span>
                </h3>
                <Timeline 
                  stops={itinerary.timeline} 
                  onRemove={handleRemovePlace} 
                />
              </div>

              <div className="flex justify-center mt-10">
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(itinerary.summary.origin)}&destination=${encodeURIComponent(itinerary.summary.destination)}&waypoints=${encodeURIComponent(itinerary.timeline.map(stop => stop.name).join('|'))}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm"
                >
                  <Navigation className="w-5 h-5 text-indigo-400" /> Start Navigation in Google Maps
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- RECENT SAVED TRIPS HISTORY SECTION (ALWAYS ACCESSIBLE BELOW CHAT) --- */}
        {savedTrips.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200/60">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-600" /> Saved Trip History
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTrips.map((saved) => (
                <div key={saved.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-extrabold text-gray-800 text-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {saved.summary.origin} → {saved.summary.destination}
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{saved.date}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600 my-2">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">{saved.summary.costPerPerson} / person</span>
                      <span className="text-gray-500">{saved.summary.personCount} Travelers ({saved.summary.vehicleType})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => reloadSavedTrip(saved)}
                    className="mt-3 w-full py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    View / Edit Saved Route <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}