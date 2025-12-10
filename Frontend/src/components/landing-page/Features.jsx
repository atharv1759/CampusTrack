import React from "react";
import { FaBolt, FaLock, FaUserFriends, FaHeadset, FaSyncAlt, FaCloud } from "react-icons/fa";
import { motion } from "framer-motion";

export const Features = () => {
  const features = [
    {
      icon: <FaBolt className="h-8 w-8 text-orange-400" />,
      title: "Lightning Fast",
      description:
        "Optimized for performance so you can report lost or found items in seconds.",
    },
    {
      icon: <FaLock className="h-8 w-8 text-orange-400" />,
      title: "Secure by Design",
      description:
        "End-to-end encrypted reports ensuring privacy and security for all users.",
    },
    {
      icon: <FaUserFriends className="h-8 w-8 text-orange-400" />,
      title: "Intuitive Interface",
      description:
        "User-friendly design so anyone can report and find items easily.",
    },
    {
      icon: <FaHeadset className="h-8 w-8 text-orange-400" />,
      title: "24/7 Support",
      description:
        "Our team is ready to assist students and campus staff anytime.",
    },
    {
      icon: <FaSyncAlt className="h-8 w-8 text-orange-400" />,
      title: "Regular Updates",
      description:
        "Continuous improvements with new features rolled out frequently.",
    },
    {
      icon: <FaCloud className="h-8 w-8 text-orange-400" />,
      title: "Reliable & Uptime",
      description:
        "Cloud-based system ensuring your campus never loses track of items.",
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, type: "spring", stiffness: 50 },
    }),
  };

  return (
    <div className="bg-black text-gray-200" id="features">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <span className="text-orange-400 font-semibold text-lg">WHY CHOOSE US</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-orange-400">
            Our Key Features
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Discover what makes Campus Track the perfect solution for your campus.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="bg-black/70 backdrop-blur-md border border-orange-400 p-8 rounded-xl shadow-lg hover:shadow-[0_0_25px_#ff9900] transition-shadow duration-300 text-left"
            >
              <div className="w-14 h-14 bg-black/60 border border-orange-400 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-orange-400 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
