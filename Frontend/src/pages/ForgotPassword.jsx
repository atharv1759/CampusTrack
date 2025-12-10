import React, { useState, useEffect } from "react";
import LeftSection from "../components/forgot-password/LeftSection";
import RightSection from "../components/forgot-password/RightSection";
import illustration1 from '../assets/forgot-password/illustration1.png'
import illustration2 from '../assets/forgot-password/illustration2.png'
import illustration3 from '../assets/forgot-password/illustration3.png'

function ForgotPassword() {
  const images = [illustration1, illustration2, illustration3];
  const [currentImage, setCurrentImage] = useState(0);

  // Automatically change images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval); 
  }, [images.length]);

  return (
    <div className="flex min-h-screen">
      <LeftSection images={images} currentImage={currentImage} />
      <RightSection />
    </div>
  );
}

export default ForgotPassword;
