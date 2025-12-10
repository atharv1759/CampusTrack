import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import foundimage from "../assets/found-item/foundimage.png"; 
import ReportFoundItemForm from "../components/Report-Found-Item/ReportFoundItemForm";

const ReportFoundItem = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black flex flex-col pt-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-8 py-10 gap-10">
          {/* Left - Image */}
          <div className="hidden lg:flex w-1/2 justify-center items-center">
            <img
              src={foundimage}
              alt="Found item illustration"
              className="w-full max-w-xl h-[550px] object-contain mr-24 drop-shadow-2xl"
            />
          </div>

          {/* Right - Form */}
          <div className="w-full lg:w-[600px] bg-black p-8 rounded-2xl shadow-md border border-orange-100">
            <h2 className="text-3xl font-bold mb-6 text-white border-b border-orange-100 pb-2 text-center lg:text-left">
              Report Found Item
            </h2>

            <ReportFoundItemForm />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ReportFoundItem;
