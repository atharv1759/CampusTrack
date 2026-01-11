import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import AIChatBot from "./AIChatBot";

const AISupportButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating AI Support Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 z-40 transition-all hover:scale-110 group"
        title="AI Support"
      >
        <FaComments size={24} />
        <span className="font-semibold text-sm hidden group-hover:inline-block">AI Support</span>
      </button>

      {/* Chat Bot */}
      <AIChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default AISupportButton;
