import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import Loader from "../common/Loader/Loader";
import { FaCamera, FaTrash } from "react-icons/fa";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [lostCount, setLostCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const getOrdinal = (num) => {
    if (!num) return "N/A";
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        // Save to localStorage for persistence
        localStorage.setItem('userProfilePic', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfilePic(null);
    localStorage.removeItem('userProfilePic');
  };

  useEffect(() => {
    // Load saved profile pic from localStorage
    const savedPic = localStorage.getItem('userProfilePic');
    if (savedPic) {
      setProfilePic(savedPic);
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get(`${API_BASE_URL}/auth/me`, config);
        setUser(res.data.user);

        const lostRes = await axios.get(
          `${API_BASE_URL}/items/my-lost-items`,
          config
        );
        const foundRes = await axios.get(
          `${API_BASE_URL}/items/my-found-items`,
          config
        );

        setLostCount(lostRes.data.items.length);
        setFoundCount(foundRes.data.items.length);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return <p className="text-red-500 p-4 text-center">{error}</p>;

  return (
    <div className="pb-6 pt-16 lg:pt-0 md:pt-0 min-h-screen px-4 sm:px-6">
      {/* Profile Picture at Top Center */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-4 border-orange-500">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-5xl sm:text-6xl font-bold text-orange-400">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* Camera Icon for Upload */}
          <label
            htmlFor="profile-upload"
            className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all"
          >
            <FaCamera size={18} />
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {/* Remove Icon (only show if profile pic exists) */}
          {profilePic && (
            <button
              onClick={handleRemoveImage}
              className="absolute bottom-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all"
              title="Remove profile picture"
            >
              <FaTrash size={16} />
            </button>
          )}
        </div>
      </div>

      {/* User Name */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8">
        {user.fullName}
      </h1>

      {/* Profile Info Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Email Card */}
        <div className="bg-zinc-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-500/20 transition-all">
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Email</p>
          <p className="text-lg font-medium text-white break-words">{user.email}</p>
        </div>

        {/* Role Card */}
        <div className="bg-zinc-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-500/20 transition-all">
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Role</p>
          <p className="text-lg font-medium text-white capitalize">{user.role}</p>
        </div>

        {/* Department Card (if exists) */}
        {user.department && (
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-500/20 transition-all">
            <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Department</p>
            <p className="text-lg font-medium text-white">{user.department}</p>
          </div>
        )}

        {/* Enrollment Number Card (if exists) */}
        {user.enrollmentNumber && (
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-500/20 transition-all">
            <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Enrollment No</p>
            <p className="text-lg font-medium text-white">{user.enrollmentNumber}</p>
          </div>
        )}

        {/* Staff ID Card (if exists) */}
        {user.staffId && (
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-500/20 transition-all">
            <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Staff ID</p>
            <p className="text-lg font-medium text-white">{user.staffId}</p>
          </div>
        )}

        {/* Contact Card (if exists) */}
        {user.contactNumber && (
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-500/20 transition-all">
            <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Contact</p>
            <p className="text-lg font-medium text-white">{user.contactNumber}</p>
          </div>
        )}

        {/* Semester/Year Card (if exists) */}
        {(user.semester || user.year) && (
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-500/20 transition-all">
            <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Semester | Year</p>
            <p className="text-lg font-medium text-white">
              {getOrdinal(user.semester)} Semester | {getOrdinal(user.year)} Year
            </p>
          </div>
        )}

        {/* Lost Items Card */}
        <div className="bg-zinc-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-500/20 transition-all">
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Lost Items Reported</p>
          <p className="text-3xl font-bold text-orange-400">{lostCount}</p>
        </div>

        {/* Found Items Card */}
        <div className="bg-zinc-900 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-orange-500/20 transition-all">
          <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Found Items Reported</p>
          <p className="text-3xl font-bold text-orange-400">{foundCount}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
