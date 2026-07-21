import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, MapPin, Wallet, Fuel, Clock, Users, Car, Sun, CloudRain, Navigation,
  Sparkles, Map as MapIcon, Coffee, Bed, Camera, ChevronRight, Info, Trash2, RefreshCw
} from 'lucide-react';

import { GeminiService } from '../services/GeminiService';
import { TripOptimizationEngine } from '../services/TripEngine';

// --- STYLES & UTILS ---
const glassmorphismClass = "bg-white/70 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl";
const gradientTextClass = "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent";

// --- SUB-COMPONENTS ---

const ChatBubble = ({ message, isAI }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[80%] md:max-w-[70%] items-end gap-2 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
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
    className={`${glassmorphismClass} p-6 mb-8 mt-4`}
  >
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <MapIcon className="text-indigo-500" /> Trip Overview
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex flex-col bg-blue-50/50 p-3 rounded-xl">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3"/> Route</span>
        <span className="font-semibold text-gray-800 text-sm">{summary.origin} → {summary.destination}</span>
      </div>
      <div className="flex flex-col bg-green-50/50 p-3 rounded-xl">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Wallet className="w-3 h-3"/> Budget</span>
        <span className="font-semibold text-gray-800 text-sm text-green-700">{summary.totalCost} / {summary.budget}</span>
      </div>
      <div className="flex flex-col bg-purple-50/50 p-3 rounded-xl">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Clock className="w-3 h-3"/> Travel Time</span>
        <span className="font-semibold text-gray-800 text-sm">{summary.duration} ({summary.distance})</span>
      </div>
      <div className="flex flex-col bg-orange-50/50 p-3 rounded-xl">
        <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Fuel className="w-3 h-3"/> Fuel Est.</span>
        <span className="font-semibold text-gray-800 text-sm">{summary.fuelCost}</span>
      </div>
    </div>
  </motion.div>
);

const Timeline = ({ stops, onRemove, onReplace }) => (
  <div className="relative pl-4 md:pl-0">
    {/* Vertical Line */}
    <div className="absolute left-6 md:left-[50%] top-4 bottom-4 w-0.5 bg-indigo-100 rounded-full transform md:-translate-x-1/2"></div>
    
    <div className="flex flex-col gap-6">
      {stops.map((stop, index) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          key={stop.id} 
          className={`flex flex-col md:flex-row relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Center Dot */}
          <div className="absolute left-2 md:left-1/2 transform -translate-x-1/2 mt-4 md:mt-0 md:top-1/2 md:-translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center z-10 shadow-sm">
            <Camera className="w-4 h-4 text-indigo-500" />
          </div>
          
          <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-10' : 'md:pr-10 text-left md:text-right'}`}>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-indigo-600 justify-start md:justify-start">
                <Clock className="w-3 h-3" /> Arrive: {stop.arrivalTime} (Stay: {stop.estimatedVisitTime}m)
              </div>
              <h4 className="font-bold text-gray-800 mb-1">{stop.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-start md:justify-start mb-3">
                <Wallet className="w-3 h-3" /> Ticket: Rs. {stop.ticketPrice}
              </div>
              
              {/* User Overrides */}
              <div className={`flex gap-2 justify-start md:justify-start opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity`}>
                <button 
                  onClick={() => onRemove(stop.id)}
                  className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
                <button 
                  onClick={() => onReplace(stop.id)}
                  className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Replace
                </button>
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
    { id: 1, text: "Hello 👋 I'm your Smart Travel Assistant.\n\nTell me about your trip. (e.g. 'I'm travelling from Kandy to Kurunegala tomorrow. Budget is Rs.2500. I'm riding my bike.')", isAI: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Intelligence Layer States
  const [tripContext, setTripContext] = useState({});
  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, isAI: false };
    const updatedHistory = [...messages, userMsg];
    
    setMessages(updatedHistory);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call Gemini Service for natural language extraction
      const aiResult = await GeminiService.processChat(updatedHistory, tripContext);
      
      setTripContext(aiResult.extractedContext);
      
      setMessages(prev => [...prev, { id: Date.now(), text: aiResult.nextMessage, isAI: true }]);
      
      if (aiResult.isComplete) {
        setIsReadyToGenerate(true);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now(), text: "I'm having trouble connecting to my brain. Please try again.", isAI: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateTrip = () => {
    // Generate trip using the Engine (No Gemini involved here)
    const generatedTrip = TripOptimizationEngine.generateTrip(tripContext);
    setItinerary(generatedTrip);
  };

  const handleRemovePlace = (placeId) => {
    if (!itinerary) return;
    const newTimeline = itinerary.timeline.filter(p => p.id !== placeId);
    
    // Simplistic recalculation (a real app would run generateTimeline again)
    const updatedTicketCost = newTimeline.reduce((acc, curr) => acc + curr.ticketPrice, 0);
    
    setItinerary({
      ...itinerary,
      timeline: newTimeline,
      summary: {
        ...itinerary.summary,
        attractionCount: newTimeline.length,
        ticketCost: `Rs. ${updatedTicketCost}`
      }
    });
  };

  const handleReplacePlace = (placeId) => {
    alert("Replace feature would fetch the next best scored place from the Engine and swap it.");
    // Implementation would call TripEngine to find an alternative.
  };

  const resetPlanner = () => {
    setItinerary(null);
    setIsReadyToGenerate(false);
    setTripContext({});
    setMessages([{ id: 1, text: "Hello 👋 I'm your Smart Travel Assistant. Tell me about your trip.", isAI: true }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 font-sans text-gray-800">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Travel<span className="text-indigo-600">AI</span></h1>
        </div>
        <button className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
          Profile
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        
        <AnimatePresence mode="wait">
          {!itinerary ? (
            /* --- CHAT INTERFACE --- */
            <motion.div 
              key="chat-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${glassmorphismClass} flex flex-col h-[75vh] overflow-hidden`}
            >
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">AI Decision Engine</h2>
                    <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span> Online
                    </p>
                  </div>
                </div>
                
                {isReadyToGenerate && (
                  <button 
                    onClick={handleGenerateTrip}
                    className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Generate Route <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50/30">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg.text} isAI={msg.isAI} />
                ))}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start w-full mb-4"
                  >
                    <div className="flex items-center gap-2 bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Mobile Generate Button */}
              {isReadyToGenerate && (
                <div className="md:hidden p-4 bg-white/40 border-t border-gray-100">
                  <button 
                    onClick={handleGenerateTrip}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-shadow shadow-md"
                  >
                    Generate Route <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 bg-white/60 border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your trip details naturally..." 
                    className="w-full bg-white border border-gray-200 rounded-full py-3 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
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
              className="pb-20"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-3xl font-extrabold ${gradientTextClass}`}>Optimized Itinerary</h2>
                  <p className="text-gray-500 mt-1">Generated by constraints, powered by algorithms.</p>
                </div>
                <button 
                  onClick={resetPlanner}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
                >
                  Start Over
                </button>
              </div>

              <TripSummaryCard summary={itinerary.summary} />

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 px-2">Generated Route</h3>
                <Timeline 
                  stops={itinerary.timeline} 
                  onRemove={handleRemovePlace} 
                  onReplace={handleReplacePlace}
                />
              </div>

              <div className="flex justify-center mt-10">
                <button className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                  <Navigation className="w-5 h-5" /> Start Navigation in Maps
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}