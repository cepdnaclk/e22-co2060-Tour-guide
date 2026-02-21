import React from "react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  const featuresData = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white transition-transform duration-300 feature-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"
          />
        </svg>
      ),
      title: "The History of Perfect Guide",
      description:
        "We started as a small blog in 2018, meticulously documenting hidden gems in Southeast Asia. Our commitment to authentic, high-quality content quickly resonated with a global audience. Over the years, we expanded our coverage, maintaining our core principle: providing unparalleled insights that enhance every journey. Today, Perfect Guide is recognized as a leading resource for discerning travelers who seek adventure without compromising on quality or experience.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white transition-transform duration-300 feature-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
          />
        </svg>
      ),
      title: "Why Choose Us?",
      description: {
        intro:
          "Our commitment is simple: to be the most trusted and reliable guide in travel and lifestyle.",
        points: [
          "Expert-led content and curated experiences.",
          "Focus on high-quality and sustainable tourism.",
          "Detailed guides covering 100+ destinations.",
          "Exclusive features on luxury and local delights.",
        ],
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white transition-transform duration-300 feature-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8m16-4V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2m16 0H4m16 0l-8 5-8-5"
          />
        </svg>
      ),
      title: "What We Offer",
      description: {
        intro: "Highlight our main services.",
        points: [
          "Custom tour packages",
          "Hotel & transport booking",
          "Adventure tours",
          "Cultural experiences",
          "Group and family trips",
        ],
      },
    },
  ];

  return (
    <>
      <style>
        {`@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
        * { font-family: "Poppins", sans-serif; }

        /* Icon pop & glow effect */
        .feature-card:hover .feature-icon {
          transform: scale(1.4);
          filter: drop-shadow(0 0 8px #00F5FF);
        }
      `}
      </style>

      {/* ABOUT SECTION */}
      <section className="py-20 px-4 bg-black flex flex-col items-center gap-6 relative">
        <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg">
          Features
        </button>

        <h2 className="text-3xl md:text-[40px]/12 font-medium text-gray-100 max-w-lg text-center leading-tight">
          OUR STORY, OUR MISSION.
        </h2>

        <p className="text-base/7 text-gray-300 max-w-xl text-center">
          Perfect Guide was founded on the belief that extraordinary experiences
          shouldn't be a secret. We empower travelers and enthusiasts with
          expertly curated information across luxury, adventure, and local
          culture.
        </p>

        {/* FEATURE CARDS */}
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-gradient-to-b from-[#020204] to-[#191130] border border-gray-700 rounded-lg p-6 space-y-3 hover:-translate-y-1 transition duration-300"
            >
              {feature.icon}
              <p className="font-medium text-lg text-gray-100">{feature.title}</p>

              {typeof feature.description === "object" ? (
                <div className="text-sm text-gray-300 space-y-3">
                  <p>{feature.description.intro}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {feature.description.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-300">{feature.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* VERY CLOSE BANNER */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center justify-center space-x-2 max-w-md py-2 px-4 rounded-lg font-medium text-sm text-white text-center bg-gradient-to-r from-violet-500 via-[#9938CA] to-[#E0724A] shadow-lg">
            <p>
              Ready to Explore the World with Confidence?{" "}
              <span className="underline cursor-pointer">Get started</span>
            </p>
            <svg
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5.5h13.092M8.949 1l5.143 4.5L8.949 10"
                stroke="#eeeaea"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* CLICK ME BUTTON VERY CLOSE TO BANNER WITH HOVER COLOR */}
        <div className="flex justify-center -mt-0.5 bg-black">
          <div className="relative inline-block rounded-full p-0.5 overflow-hidden button-wrapper">
            {/* Spinning gradient behind the button */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,_#00F5FF,_#00F5FF30,_#00F5FF)] animate-spin-slow rounded-full"></div>
           <button
               onClick={() => navigate("/")}
               className="relative z-10 bg-gray-800 text-white rounded-full px-8 py-3 font-medium text-sm hover:bg-gray-700 transition-colors duration-300"
          >
            DISCOVER OUR GUIDES TODAY
          </button>
          </div>
        </div>

        {/* Custom spin animation */}
        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }
        `}</style>
      </section>
    </>
    
  );
}