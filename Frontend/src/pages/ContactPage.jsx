import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhoneAlt, FaCommentDots } from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const toastId = toast.loading("Sending...", {
    style: {
      background: "#1F1F1F",
      color: "#FFA500",
      fontWeight: "bold",
    },
  });

  try {
    await axios.post(`${API_BASE_URL}/contact`, formData);

    toast.success("Message sent successfully!", {
      id: toastId,
      style: {
        background: "#1F1F1F",
        color: "#00FF00",
        fontWeight: "bold",
      },
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
  } catch (err) {
    toast.error("Failed to send message!", {
      id: toastId,
      style: {
        background: "#1F1F1F",
        color: "#FF4500",
        fontWeight: "bold",
      },
    });
  }
};


  return (
    <>
      <Navbar />

      <div className="bg-black text-gray-100 px-4 sm:px-6 md:px-12 py-10 min-h-screen flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center text-center md:text-left px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-6">
              Contact Us
            </h1>

            <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-6">
              We'd love to hear from you. Whether you have a question, need assistance,
              or want to share feedback — reach out anytime.
            </p>

            <div className="space-y-3 text-gray-300 text-sm sm:text-base">
              <p>
                <span className="text-orange-500 font-semibold">Email:</span>{" "}
                manishraj5411@gmail.com
              </p>
              <p>
                <span className="text-orange-500 font-semibold">Address:</span>{" "}
                Bengaluru, India
              </p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="w-full bg-black border border-orange-500 rounded-xl p-6 sm:p-8 shadow-[0_0_15px_#ff6a00]"
          >
            {/* NAME */}
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 text-white rounded-lg py-3 pl-10 focus:outline-none focus:ring focus:ring-orange-600 text-sm sm:text-base"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 text-white rounded-lg py-3 pl-10 focus:outline-none focus:ring focus:ring-orange-600 text-sm sm:text-base"
                required
              />
            </div>

            {/* PHONE */}
            <div className="relative mb-4">
              <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 text-white rounded-lg py-3 pl-10 focus:outline-none focus:ring focus:ring-orange-600 text-sm sm:text-base"
                required
              />
            </div>

            {/* MESSAGE */}
            <div className="relative mb-5">
              <FaCommentDots className="absolute left-3 top-4 text-orange-400" />
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-black border border-orange-500 text-white rounded-lg py-3 pl-10 focus:outline-none focus:ring focus:ring-orange-600 text-sm sm:text-base"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-orange-700 py-3 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ContactPage;
