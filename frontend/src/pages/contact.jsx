import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (typeof window !== "undefined" && window.AOS) {
      window.AOS.init({ duration: 800, once: true });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;
      const cleanName = (formData.name.trim() || "Anonymous").replace(/[\/\#\?\[\]]/g, "_");
      const docId = `${cleanName}_${formattedDate}`;

      await setDoc(doc(db, "massages", docId), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        submittedAt: now.toLocaleString(),
      });

      setStatusMsg({
        type: "success",
        text: "Your message has been sent successfully!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error saving message to Firestore: ", error);
      const isPermissionDenied = error?.code === "permission-denied";
      setStatusMsg({
        type: "error",
        text: isPermissionDenied
          ? "Permission denied: Firebase Security Rules are blocking writes to the 'massages' collection."
          : `Failed to send message: ${error.message || "Please try again."}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <main>
        {/* Header */}
        <section className="px-6 py-14 text-center" data-aos="fade-up">

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get In Touch With Us
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            We're here to answer your questions and guide you on your next adventure.
          </p>
        </section>

        {/* Contact Layout */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mx-auto max-w-6xl bg-[#f5f3ff] rounded-xl shadow-md border border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 sm:p-10">

              {/* Contact Info */}
              <div>
                <h2
                  className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 tracking-tight"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  Contact Information
                </h2>

                <ul className="mt-8 space-y-6 text-slate-800 font-sans text-base">
                  <li className="flex items-start gap-4">
                    <i className="fas fa-map-marker-alt text-slate-900 mt-1" />
                    <span>
                      Bambaragammanaa Road,<br />
                      Wariyapola, Sri Lanka
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <i className="fas fa-phone text-slate-900 mt-1" />
                    <span>+94 703 384 648</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <i className="fas fa-fax text-slate-900 mt-1" />
                    <span>+94 720 562 086</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <i className="fas fa-envelope text-slate-900 mt-1" />
                    <span>chamodharshana31@gmail.com</span>
                  </li>
                </ul>
              </div>

              {/* Contact Form */}
              <div>
                <h2
                  className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 tracking-tight"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  Send Us a Message
                </h2>
                <p className="mt-3 text-sm font-medium text-slate-900 leading-relaxed">
                  We value your feedback! Share your comments, ideas, and suggestions to help us continuously improve your experience for future adventures.
                </p>

                {statusMsg.text && (
                  <div
                    className={`mt-4 p-3.5 rounded-lg text-sm font-medium ${
                      statusMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {statusMsg.text}
                  </div>
                )}

                <form
                  className="mt-6 space-y-5"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    autoComplete="name"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email Address"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                  />

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    autoComplete="off"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                  />

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    autoComplete="off"
                    required
                    className="w-full min-h-[160px] resize-y rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-slate-900 px-4 py-3.5 font-bold uppercase tracking-wider text-white hover:bg-slate-800 active:bg-slate-950 transition-all shadow-sm disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Message"}
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
