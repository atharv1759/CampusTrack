import React, { useState, useEffect } from "react";
import signinImg from "../assets/signin/signin.png";
import signinImg1 from "../assets/signin/signin1.png";
import signinImg2 from "../assets/signin/signin2.png";
import SigninLeft from "../components/signin/SigninLeft";
import SigninForm from "../components/signin/SigninForm";

function Signin() {
  const images = [signinImg, signinImg1, signinImg2];
  const [currentImage, setCurrentImage] = useState(0);

  // Dropdown states
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (value) => {
    setRole(value);
    setOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SigninLeft images={images} currentImage={currentImage} />
      <SigninForm role={role} open={open} setOpen={setOpen} handleSelect={handleSelect} />
    </div>
  );
}

export default Signin;
