import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black">
      {/* Uiverse Loader Animation */}
      <div className="loadingspinner">
        <div id="square1"></div>
        <div id="square2"></div>
        <div id="square3"></div>
        <div id="square4"></div>
        <div id="square5"></div>
      </div>

      {/* Text Below Loader */}
      <h1 className="text-5xl font-extrabold text-orange-500 tracking-wide">
        Campus Track
      </h1>
    </div>
  );
};

export default Loader;
