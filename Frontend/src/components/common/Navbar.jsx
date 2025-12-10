import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserPlus, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Logo from "/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setRole("");
        } else {
          setIsLoggedIn(true);
          setRole(payload.role);
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setRole("");
      }
    } else {
      setIsLoggedIn(false);
      setRole("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole("");
    setUserDropdown(false);
    setIsOpen(false);
    navigate("/");
  };

  const menuItems = [
    { name: "Home", to: "/home" },
    { name: "Report Lost Item", to: "/report-lost-item" },
    { name: "Report Found Item", to: "/report-found-item" },
    { name: "Contact", to: "/contact" },
  ];

  const userOptions = [
    { name: "Dashboard", icon: <MdDashboard />, to: role === "admin" ? "/admin-dashboard" : "/user-dashboard" },
    { name: "Logout", icon: <FaSignOutAlt />, action: handleLogout },
  ];

  // Menu link classes (neon underline on hover)
  const neonLinkClasses =
    "relative px-3 py-2 text-gray-200 font-medium hover:text-orange-400 transition-all duration-300 " +
    "after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-[2px] after:bg-orange-400 after:transition-all after:duration-300 hover:after:w-full";

  // Button classes (solid neon border, no underline)
  const neonButtonClasses =
    "cursor-pointer flex items-center space-x-2 px-4 py-2 text-gray-200 font-semibold border-2 border-orange-400 rounded-full hover:text-orange-400 hover:border-orange-400 transition-all duration-300 ";

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-black/40 backdrop-blur-md text-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Campus Track Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-orange-400">Campus Track</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex xl:items-center justify-between w-full">
            <div className="flex justify-center flex-1 space-x-3">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={neonLinkClasses}
                  onClick={(e) => {
                    if (
                      role === "admin" &&
                      (item.name === "Report Lost Item" || item.name === "Report Found Item")
                    ) {
                      e.preventDefault();
                      navigate("/admin-dashboard");
                    }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="ml-4 relative flex items-center">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className={neonButtonClasses}
                  >
                    <FaUserCircle size={24} />
                    <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  </button>

                  {/* Dropdown */}
                  {userDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-44 bg-black/80 backdrop-blur-md rounded-md shadow-lg py-2 z-50">
                      {userOptions.map((option) =>
                        option.to ? (
                          <Link
                            key={option.name}
                            to={option.to}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-200 hover:text-orange-400 transition-all duration-300"
                            onClick={() => setUserDropdown(false)}
                          >
                            <span>{option.icon}</span>
                            <span>{option.name}</span>
                          </Link>
                        ) : (
                          <button
                            key={option.name}
                            onClick={option.action}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-gray-200 hover:text-orange-400 transition-all duration-300"
                          >
                            <span>{option.icon}</span>
                            <span>{option.name}</span>
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin" className={neonButtonClasses}>
                  <FaUserPlus />
                  <span>Join Now</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            {isLoggedIn && !userDropdown && (
              <button
                onClick={() => {
                  setUserDropdown(true);
                  setIsOpen(false);
                }}
                className={neonButtonClasses + " px-2 py-1"}
              >
                <FaUserCircle size={20} />
                <span className="text-xs">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </button>
            )}
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setUserDropdown(false);
              }}
              className="focus:outline-none text-gray-200"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isLoggedIn && userDropdown && (
        <div className="xl:hidden bg-black/80 backdrop-blur-md py-2 flex flex-col items-center rounded-b-md">
          {userOptions.map((option) =>
            option.to ? (
              <Link
                key={option.name}
                to={option.to}
                className="flex items-center w-40 justify-start space-x-2 px-4 py-3 text-gray-200 hover:text-orange-400 transition-all duration-300"
                onClick={() => setUserDropdown(false)}
              >
                <span>{option.icon}</span>
                <span>{option.name}</span>
              </Link>
            ) : (
              <button
                key={option.name}
                onClick={option.action}
                className="flex items-center w-40 justify-start space-x-2 px-4 py-3 text-gray-200 hover:text-orange-400 transition-all duration-300"
              >
                <span>{option.icon}</span>
                <span>{option.name}</span>
              </button>
            )
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {!userDropdown && (
        <div
          className={`xl:hidden bg-black/80 backdrop-blur-md overflow-hidden transition-all duration-500 ${
            isOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="flex items-center space-x-3 px-6 py-4 border-b border-gray-800 text-gray-200 hover:text-orange-400 relative after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-[2px] after:bg-orange-400 after:transition-all after:duration-300 hover:after:w-full transition-all duration-300"
              onClick={(e) => {
                if (role === "admin" && (item.name === "Report Lost Item" || item.name === "Report Found Item")) {
                  e.preventDefault();
                  navigate("/admin-dashboard");
                }
                setIsOpen(false);
              }}
            >
              <span>{item.name}</span>
            </Link>
          ))}

          {!isLoggedIn && (
            <Link to="/signin" className={neonButtonClasses + " mx-6 my-3"}>
              <FaUserPlus />
              <span>Join Now</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
