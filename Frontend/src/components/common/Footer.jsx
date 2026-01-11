import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Logo from "/logo.png";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 border-t border-white/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo and About */}
        <div className="text-left">
          <Link
            to="/"
            className="flex items-center space-x-2 mb-3 group transition duration-300"
          >
            <img
              src={Logo}
              alt="Campus Track Logo"
              className="h-10 w-auto group-hover:brightness-125 transition"
            />
            <span className="text-xl font-bold text-orange-400 transition duration-300">
              Campus Track
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Campus Track is a smart lost and found system to recover lost
            belongings efficiently within the campus.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-left">
          <h3 className="text-lg font-semibold text-orange-400 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Home", to: "/home" },
              { name: "Report Lost Item", to: "/report-lost" },
              { name: "Report Found Item", to: "/report-found" },
              { name: "About", to: "/about" },
              { name: "Contact", to: "/contact" },
            ].map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.to}
                  className="relative group hover:text-orange-400 transition font-medium"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-400 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-left">
          <h3 className="text-lg font-semibold text-orange-400 mb-4">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <FaEnvelope className="text-orange-400" />
              <span>manishraj5411@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="text-left">
          <h3 className="text-lg font-semibold text-orange-400 mb-4">
            Connect With Us
          </h3>
          <div className="flex space-x-4">
            {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map(
              (Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 rounded-full bg-orange-500 text-black hover:bg-orange-400 hover:shadow-[0_0_15px_rgba(255,140,0,0.8)] transition-all"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Stay updated with our latest features and campus alerts.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/90 border-t border-white/20 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-orange-400">Campus Track</span>. All
        Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
