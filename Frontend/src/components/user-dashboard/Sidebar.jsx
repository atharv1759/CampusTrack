import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBoxOpen,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { MdDashboard } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "My Lost Items", icon: <FaBoxOpen />, path: "/user-dashboard/my-lost-items" },
    { name: "My Found Items", icon: <FaSearch />, path: "/user-dashboard/my-found-items" },
    { name: "Dashboard", icon: <MdDashboard />, path: "/user-dashboard" },
    { name: "Notification", icon: <IoNotifications />, path: "/user-dashboard/notification" },
    { name: "Logout", icon: <FaSignOutAlt />, action: handleLogout },
  ];

  const handleClick = (item) => {
    if (item.path) {
      navigate(item.path);
      setIsOpen(false);
    } else if (item.action) {
      item.action();
      setIsOpen(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-gray-800 shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold text-orange-400">Campus Track</h1>
          </Link>
          <button className="md:hidden text-orange-400" onClick={toggleSidebar}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex flex-col mt-5 space-y-3 px-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              className="cursor-pointer w-full flex items-center gap-3 p-2 rounded-md hover:text-orange-400 text-gray-200 font-medium transition-colors"
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black shadow-md flex items-center justify-between px-4 md:hidden z-40 border-b border-gray-700">
        <button onClick={toggleSidebar} className="text-orange-400">
          <FaBars size={25} />
        </button>
        <span className="text-gray-200 font-medium mr-4">Hello User</span>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
