import React, { useEffect } from "react";

export default function contact() {
  useEffect(() => {
    // If AOS is loaded globally, this works. Otherwise install/import AOS.
    if (typeof window !== "undefined" && window.AOS) {
      window.AOS.init({ duration: 800, once: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black font-serif">
      {/* Loader */}
      <div
        id="loader"
        className="hidden fixed inset-0 z-50 items-center justify-center bg-white/80"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
      <main>
        {/* Header */}
        <section
          className="px-6 py-14 text-center"
          data-aos="fade-up"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Get In Touch With Us
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            We&apos;re here to answer your questions and guide you on your next adventure.
          </p>
        </section>

        {/* Contact Layout */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 sm:p-10">
              {/* Info */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 border-b border-gray-200 pb-3">
                  Contact Information
                </h2>

                <ul className="mt-8 space-y-6 text-gray-700">
                  <li className="flex items-start gap-4">
                    <i className="fas fa-map-marker-alt text-slate-900 mt-1" />
                    <span className="leading-relaxed">
                      120, 120A, Pannipitiya Road,
                      <br />
                      Battaramulla, Sri Lanka
                    </span>
                  </li>

                  <li className="flex items-start gap-4">
                    <i className="fas fa-phone text-slate-900 mt-1" />
                    <span className="leading-relaxed">+94 (0) 114 700 600</span>
                  </li>

                  <li className="flex items-start gap-4">
                    <i className="fas fa-fax text-slate-900 mt-1" />
                    <span className="leading-relaxed">+94 (0) 112 687 175</span>
                  </li>

                  <li className="flex items-start gap-4">
                    <i className="fas fa-envelope text-slate-900 mt-1" />
                    <span className="leading-relaxed">info@dbpmco.com</span>
                  </li>
                </ul>
              </div>

              {/* Form */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 border-b border-gray-200 pb-3">
                  Send Us a Message
                </h2>

                <form
                  className="mt-8 space-y-5"
                  action="#"
                  method="POST"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full rounded-md border border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address"
                    required
                    className="w-full rounded-md border border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    required
                    className="w-full rounded-md border border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    required
                    className="w-full min-h-[160px] resize-y rounded-md border border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-slate-900/20"
                  />

                  <button
                    type="submit"
                    className="w-full rounded-md bg-slate-900 px-4 py-3 text-base font-semibold uppercase tracking-wide text-white hover:bg-blue-600 transition"
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Column 1 */}
            <div>
              <h4 className="text-lg font-bold uppercase mb-6">Information</h4>
              <ul className="space-y-3 text-[0.95rem] text-slate-300">
                <li>
                  <a href="pages/tourism.html" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Tourism
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Hiking
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Best Options
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Shopping
                  </a>
                </li>
                <li>
                  <a href="contact.html" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Contact us
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-lg font-bold uppercase mb-6">Availability</h4>
              <ul className="space-y-3 text-[0.95rem] text-slate-300">
                <li>
                  <a href="#" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Gifts
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Camping Items
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Fancy items
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Booking
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Transport
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-white transition">
                    <i className="fas fa-caret-right text-white mr-3 text-sm" />
                    Others
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-lg font-bold uppercase mb-6">Contact Us</h4>
              <ul className="space-y-4 text-[0.95rem] text-slate-300">
                <li className="flex items-start gap-4">
                  <i className="fas fa-map-marker-alt text-white mt-1" />
                  <span className="leading-relaxed">
                    120, 120A, Pannipitiya Road,
                    <br />
                    Battaramulla, Sri Lanka
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <i className="fas fa-phone text-white mt-1" />
                  <span className="leading-relaxed">Tel: +94(0)114700600</span>
                </li>
                <li className="flex items-start gap-4">
                  <i className="fas fa-fax text-white mt-1" />
                  <span className="leading-relaxed">Fax: +94(0)112687175</span>
                </li>
                <li className="flex items-start gap-4">
                  <i className="fas fa-envelope text-white mt-1" />
                  <span className="leading-relaxed">Mail: info@dbpmco.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 text-sm text-slate-400">
            <p>© 2025. All rights reserved.</p>
            <p>
              Designed by{" "}
              <a href="index.html" className="text-white font-medium hover:underline">
                Perfect Guide
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

