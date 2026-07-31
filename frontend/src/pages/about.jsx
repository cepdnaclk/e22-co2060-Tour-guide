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
      {/* ABOUT SECTION */}
      <section className="py-20 px-4 flex flex-col items-center gap-6 relative">

        <span className="px-3 py-1 bg-teal-50 border border-teal-100 text-teal-700 text-[11px] font-bold uppercase tracking-wider rounded-full">
          Features
        </span>

        <h2 className="text-3xl md:text-[42px] font-bold text-slate-900 max-w-xl text-center leading-tight uppercase tracking-wide">
          Our Story, Our Mission.
        </h2>

        <p className="text-base leading-relaxed text-slate-600 max-w-xl text-center font-sans">
          Perfect Guide was founded on the belief that extraordinary experiences
          shouldn't be a secret. We empower travelers and enthusiasts with
          expertly curated information across luxury, adventure, and local
          culture.
        </p>

        {/* FEATURE CARDS */}
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-white border border-slate-100 rounded-2xl p-6 space-y-4 hover:-translate-y-1 transition duration-300 shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl text-slate-900">{feature.title}</h3>

              {typeof feature.description === "object" ? (
                <div className="text-sm text-slate-600 space-y-3 font-sans">
                  <p className="leading-relaxed">{feature.description.intro}</p>
                  <ul className="list-disc list-inside space-y-1 leading-relaxed">
                    {feature.description.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed font-sans">{feature.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* VERY CLOSE BANNER */}
        <div className="flex justify-center mt-10 w-full">
          <div className="flex items-center justify-center space-x-3 max-w-md py-3 px-6 rounded-xl font-medium text-sm text-teal-900 bg-teal-50 border border-teal-100 shadow-xs text-center">
            <p>
              Ready to Explore the World with Confidence?{" "}
              <span className="underline cursor-pointer font-bold hover:text-teal-700" onClick={() => navigate("/explore")}>Get started</span>
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
                stroke="var(--color-brand-teal)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* CLICK ME BUTTON */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/explore")}
            className="bg-brand-teal text-white hover:bg-teal-700 rounded-full px-8 py-3.5 font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer tracking-wider"
          >
            DISCOVER OUR GUIDES TODAY
          </button>
        </div>
      </section>
    </>
  );
}