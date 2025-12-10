import React, { useRef, useEffect } from "react";
import video from '../../assets/signin/video.mp4';

function SigninLeft() {
  const videoRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;

    const handleTimeUpdate = () => {
      if (vid.currentTime >= vid.duration - 3) {
        vid.currentTime = 0;
        vid.play();
      }
    };

    vid.addEventListener("timeupdate", handleTimeUpdate);

    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-black ">
      <video 
        ref={videoRef}
        src={video} 
        autoPlay 
        muted 
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

export default SigninLeft;
