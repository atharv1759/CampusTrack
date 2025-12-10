import React from "react";
import { FaUser } from "react-icons/fa";

function RoleDropdown({ role, open, setOpen, handleSelect }) {
  return (
    <div className="relative">
      <FaUser className="absolute top-3 md:top-4 left-3 md:left-4 text-orange-400" />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-xl border border-gray-600
          focus:ring-2 focus:ring-orange-500 outline-none text-gray-100 shadow-sm 
          text-sm md:text-base bg-black flex items-center"
      >
        <span className="flex-1 text-left">
          {role ? role : "Select Role"}
        </span>
      </button>
      {open && (
        <ul className="absolute z-10 w-full text-gray-100 pt-1 bg-black rounded-xl shadow-md border border-gray-600 mt-1">
          {["Student", "Staff", "Admin"].map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-2 hover:bg-gray-900 cursor-pointer"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoleDropdown;
