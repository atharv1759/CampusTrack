import React from "react";
import { VscSparkle } from "react-icons/vsc"; 
import './Button.css'

const Button = ({ onClick, text = "AI Analyzer" }) => {
  return (
    <button1 onClick={onClick} className="cursor-pointer flex items-center gap-2 mt-16 lg:mt-0 md:mt-0">
      <VscSparkle className="text-white text-3xl" /> {/* left icon */}
      {text}
    </button1>
  );
};

export default Button;
