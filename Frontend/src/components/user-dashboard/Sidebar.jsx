import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBoxOpen,
  FaSignOutAlt,
  FaSearch,
  FaLink,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import logo from "/logo.png";
import { MdDashboard } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unread = response.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "My Lost Items", icon: <FaBoxOpen />, path: "/user-dashboard/my-lost-items" },
    { name: "My Found Items", icon: <FaSearch />, path: "/user-dashboard/my-found-items" },
    { name: "My Matches", icon: <FaLink />, path: "/user-dashboard/my-matches" },
    { name: "Dashboard", icon: <MdDashboard />, path: "/user-dashboard" },
    { name: "Notification", icon: <IoNotifications />, path: "/user-dashboard/notification", badge: unreadCount },
    { name: "Logout", icon: <FaSignOutAlt />, action: handleLogout },
  ];

  const handleClick = (item) => {
    if (item.path) {
      navigate(item.path);
      setIsOpen(false);
      // Refresh notification count when clicking notification
      if (item.name === "Notification") {
        setTimeout(fetchUnreadCount, 1000);
      }
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
              className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-200 relative ${
                item.path && location.pathname === item.path
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-zinc-800/50 text-gray-200 hover:bg-orange-500/20 hover:text-orange-400 border border-gray-700/50'
              }`}
            >
              {item.icon}
              {item.name}
              {item.badge > 0 && (
                <span className="absolute right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}
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
