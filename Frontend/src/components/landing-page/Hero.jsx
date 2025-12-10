import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import image1 from "../../assets/Landing Page/image1.png";
import image2 from "../../assets/Landing Page/image4.png";

export const Hero = () => {
  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const arrowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 1, duration: 1 } },
  };

  return (
    <>
      {/* Hide hero images below 1428px */}
      <style>
        {`
          @media (max-width: 1430px) {
            .hero-image {
              display: none !important;
            }
          }
        `}
      </style>

      <section className="relative flex items-center justify-center text-center overflow-hidden bg-black py-20 sm:py-24 md:py-28 pb-40 sm:pb-32 md:pb-28">
        {/* Subtle Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "#000000",
            backgroundImage: `
              linear-gradient(-90deg, transparent calc(5em - 1px), rgba(255,255,255,0.07) 1px, rgba(255,255,255,0.07) 5em),
              linear-gradient(0deg, transparent calc(5em - 1px), rgba(255,255,255,0.07) 1px, rgba(255,255,255,0.07) 5em)
            `,
            backgroundSize: "5em 5em",
          }}
        ></div>

        {/* Decorative orbs */}
        <div className="absolute -top-40 -left-40 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Left Hero Image */}
        <motion.img
          src={image1}
          alt="Left Illustration"
          className="hero-image hidden xl:block absolute left-20 bottom-10 w-72 sm:w-80 md:w-[380px] object-contain z-0"
          style={{
            maskImage:
              "linear-gradient(to top, transparent 0%, black 50%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 50%, black 100%)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        />

        {/* Right Hero Image */}
        <motion.img
          src={image2}
          alt="Hero Illustration"
          className="hero-image hidden xl:block absolute right-0 bottom-10 w-96 sm:w-[28rem] md:w-[700px] object-contain z-0"
          style={{
            maskImage:
              "linear-gradient(to top, transparent 0%, black 50%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 50%, black 100%)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-10"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-orange-400 leading-snug mb-4 ">
            Campus Track
            <br />
            <span className="text-white">Intelligent Lost and Found Locator</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="inline-block px-3 py-1 sm:px-4 sm:py-2 text-sm font-semibold bg-orange-500/20 text-orange-300 rounded-full backdrop-blur-md border border-orange-500/40 shadow-[0_0_10px_rgba(255,140,0,0.6)] mb-4 sm:mb-6"
          >
            ⚡ AI-Powered Item Matching System
          </motion.p>

          <p className="text-gray-300 text-sm sm:text-lg md:text-xl mb-8 sm:mb-10 mt-2 px-2">
            Report lost or found items instantly. Powered by{" "}
            <span className="text-orange-400 font-semibold">
              intelligent AI matching
            </span>{" "}
            to help you reconnect with your belongings faster.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/signup"
              className="px-5 py-3 sm:px-6 sm:py-3 bg-orange-600 text-white font-semibold rounded-full shadow-md "
            >
              Get Started
            </Link>
            <a
              href="#learn-more"
              className="px-5 py-3 sm:px-6 sm:py-3 border-2 border-orange-600 text-orange-400 font-semibold rounded-full hover:text-white hover:border-white transition-all duration-300"
            >
              Learn More
            </a>
          </div>

          <motion.div
            className="mt-10 sm:mt-12 animate-bounce"
            initial="hidden"
            animate="visible"
            variants={arrowVariants}
          >
            <button
              onClick={() => {
                const featuresSection = document.getElementById("features");
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-orange-400 hover:text-orange-200 cursor-pointer"
            >
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};
