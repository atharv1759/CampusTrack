import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <div className="flex mb-6">
      <div className="relative w-64 sm:w-80 md:w-[28rem] lg:w-[42rem]">
        <FaSearch className="absolute left-4 top-3.5 text-orange-400 text-lg" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder || "Search here..."}
          className="w-full pl-12 pr-5 py-3 text-base border border-gray-700 bg-black rounded-3xl 
                     focus:outline-none focus:ring-2 focus:ring-orange-500 transition 
                     placeholder-gray-400 text-gray-200 shadow-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;
