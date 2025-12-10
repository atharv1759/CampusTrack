import React, { useState, useEffect } from "react";
import signupImg from "../assets/signup/signup.png";
import signupImg1 from "../assets/signup/signup1.png";
import signupImg2 from "../assets/signup/signup2.png";
import SignupLeft from "../components/signup/SignupLeft";
import SignupForm from "../components/signup/SignupForm";

function Signup() {
  const images = [signupImg, signupImg1, signupImg2];
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
      <SignupLeft images={images} currentImage={currentImage} />
      <SignupForm
        role={role}
        open={open}
        setOpen={setOpen}
        handleSelect={handleSelect}
      />
    </div>
  );
}

export default Signup;
