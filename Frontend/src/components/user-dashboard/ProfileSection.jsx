import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import Banner from "../../assets/admin-dashboard/banner.jpg";
import Loader from "../common/Loader/Loader";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [lostCount, setLostCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getOrdinal = (num) => {
    if (!num) return "N/A";
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  useEffect(() => {
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
    <div className="pb-6 bg-black pt-16 lg:pt-0 md:pt-0 min-h-screen">
      {/* Banner + Profile Header */}
      <div className="relative w-full">
        {/* Banner */}
        <div
          className="w-full h-40 sm:h-48 rounded-t-xl shadow-md bg-cover bg-center"
          style={{ backgroundImage: `url(${Banner})` }}
        ></div>

        {/* Floating Profile Circle */}
        <div className="absolute -bottom-12 left-4 sm:left-8 w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 text-orange-500 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="bg-zinc-900 shadow-md p-6 sm:p-8 pt-16 sm:pt-20 mt-0 border border-gray-700 rounded-b-xl text-white">
        <h1 className="text-3xl font-bold">{user.fullName}</h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 uppercase">Email</p>
              <p className="text-lg font-medium truncate max-w-[260px] sm:max-w-full">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 uppercase">Role</p>
              <p className="text-lg font-medium">{user.role}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 uppercase">Lost Items Reported</p>
              <p className="text-lg font-medium">{lostCount}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 uppercase">Found Items Reported</p>
              <p className="text-lg font-medium">{foundCount}</p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {user.department && (
              <div>
                <p className="text-sm text-gray-400 uppercase">Department</p>
                <p className="text-lg font-medium">{user.department}</p>
              </div>
            )}

            {user.enrollmentNumber && (
              <div>
                <p className="text-sm text-gray-400 uppercase">Enrollment No</p>
                <p className="text-lg font-medium">{user.enrollmentNumber}</p>
              </div>
            )}

            {user.staffId && (
              <div>
                <p className="text-sm text-gray-400 uppercase">Staff ID</p>
                <p className="text-lg font-medium">{user.staffId}</p>
              </div>
            )}

            {user.contactNumber && (
              <div>
                <p className="text-sm text-gray-400 uppercase">Contact</p>
                <p className="text-lg font-medium">{user.contactNumber}</p>
              </div>
            )}

            {(user.semester || user.year) && (
              <div>
                <p className="text-sm text-gray-400 uppercase">Semester | Year</p>
                <p className="text-lg font-medium">
                  {getOrdinal(user.semester)} Semester &nbsp;|&nbsp; {getOrdinal(user.year)} Year
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
