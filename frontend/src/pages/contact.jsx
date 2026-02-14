import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.AOS) {
      window.AOS.init({ duration: 800, once: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black font-serif">
      <main>
        {/* Header */}
        <section className="px-6 py-14 text-center" data-aos="fade-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Get In Touch With Us
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            We're here to answer your questions and guide you on your next adventure.
          </p>
        </section>

        {/* Contact Layout */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 sm:p-10">

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 border-b border-gray-200 pb-3">
                  Contact Information
                </h2>

                <ul className="mt-8 space-y-6 text-gray-700">
                  <li className="flex items-start gap-4">
                    <i className="fas fa-map-marker-alt text-slate-900 mt-1" />
                    <span>
                      120, 120A, Pannipitiya Road,<br />
                      Battaramulla, Sri Lanka
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <i className="fas fa-phone text-slate-900 mt-1" />
                    <span>+94 (0) 114 700 600</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <i className="fas fa-fax text-slate-900 mt-1" />
                    <span>+94 (0) 112 687 175</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <i className="fas fa-envelope text-slate-900 mt-1" />
                    <span>info@dbpmco.com</span>
                  </li>
                </ul>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 border-b border-gray-200 pb-3">
                  Send Us a Message
                </h2>

                <form
                  className="mt-8 space-y-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    autoComplete="name"
                    required
                    className="w-full rounded-md border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-slate-900/20 outline-none"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address"
                    autoComplete="email"
                    required
                    className="w-full rounded-md border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-slate-900/20 outline-none"
                  />

                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    autoComplete="off"
                    required
                    className="w-full rounded-md border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-slate-900/20 outline-none"
                  />

                  <textarea
                    name="message"
                    placeholder="Your Message"
                    autoComplete="off"
                    required
                    className="w-full min-h-[160px] resize-y rounded-md border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-slate-900/20 outline-none"
                  />

                  <button
                    type="submit"
                    className="w-full rounded-md bg-slate-900 px-4 py-3 font-semibold uppercase tracking-wide text-white hover:bg-blue-600 transition"
                  >
                    Submit Message
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div>
              <h4 className="text-lg font-bold uppercase mb-6">Information</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link to="/tourism" className="hover:text-white">Tourism</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold uppercase mb-6">Availability</h4>
              <ul className="space-y-3 text-slate-300">
                <li>Gifts</li>
                <li>Camping Items</li>
                <li>Fancy Items</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold uppercase mb-6">Contact</h4>
              <p className="text-slate-300 text-sm">
                120, Pannipitiya Road,<br />
                Battaramulla, Sri Lanka
              </p>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-white/10 text-sm text-slate-400 text-right">
            © 2025 Perfect Guide
          </div>
        </div>
      </footer>
    </div>
  );
}
