import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBoxOpen,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "/logo.png";
import { MdDashboard } from "react-icons/md";
import { GiPuzzle } from "react-icons/gi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleUsersDropdown = () => setUsersDropdownOpen(!usersDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    {
      name: "Lost Items",
      icon: <FaBoxOpen />,
      path: "/admin-dashboard/lost-items",
    },
    {
      name: "Found Items",
      icon: <FaSearch />,
      path: "/admin-dashboard/found-items",
    },
    { name: "Users", icon: <FaUser />, dropdown: ["Students", "Staff"] },
    { name: "Dashboard", icon: <MdDashboard />, path: "/admin-dashboard" },
    { name: "AI Match", icon: <GiPuzzle />, path: "/admin-dashboard/matchAI" },
    { name: "Logout", icon: <FaSignOutAlt />, action: handleLogout },
  ];

  const handleClick = (item) => {
    if (item.dropdown) {
      toggleUsersDropdown();
    } else if (item.path) {
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
        className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-gray-700 shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
              <h1 className="text-xl font-bold text-orange-400">Campus Track</h1>
            </Link>
          </div>
          <button className="md:hidden text-orange-400" onClick={toggleSidebar}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex flex-col mt-5 space-y-3 px-4">
          {menuItems.map((item) => (
            <div key={item.name}>
              <button
                onClick={() => handleClick(item)}
                className={`cursor-pointer w-full flex items-center justify-between gap-3 p-2 rounded-md font-medium transition-colors ${
                  item.path && location.pathname === item.path
                    ? 'bg-orange-500/20 text-orange-400 border-l-4 border-orange-400'
                    : 'text-gray-200 hover:text-orange-400 hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.name}
                </span>
                {item.dropdown && (
                  <FaChevronDown
                    className={`${
                      usersDropdownOpen ? "rotate-180" : ""
                    } transition-transform text-gray-200`}
                  />
                )}
              </button>

              {/* Dropdown */}
              {item.dropdown && usersDropdownOpen && (
                <div className="ml-8 mt-1 flex flex-col space-y-1">
                  {item.dropdown.map((subItem) => (
                    <button
                      key={subItem}
                      className={`p-1 text-md font-semibold cursor-pointer rounded-md text-left transition-colors ${
                        location.pathname === `/admin-dashboard/${subItem.toLowerCase()}`
                          ? 'text-orange-400 bg-orange-500/10'
                          : 'text-gray-400 hover:text-orange-400'
                      }`}
                      onClick={() => {
                        navigate(`/admin-dashboard/${subItem.toLowerCase()}`);
                        setIsOpen(false);
                        setUsersDropdownOpen(false);
                      }}
                    >
                      {subItem}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile/Tablet Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black shadow-md flex items-center justify-between px-4 md:hidden z-40 border-b border-gray-700">
        <button onClick={toggleSidebar} className="text-orange-400">
          <FaBars size={25} />
        </button>
        <span className="text-gray-200 font-medium mr-4">Hello Admin</span>
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
