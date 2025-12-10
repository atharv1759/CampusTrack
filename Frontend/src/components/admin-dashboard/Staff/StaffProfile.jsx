import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaUserTie,
  FaArrowLeft,
} from "react-icons/fa";
import { MdLocationOn, MdAccessTime } from "react-icons/md";
import Loader from "../../common/Loader/Loader";
import Banner from "../../../assets/admin-dashboard/banner.jpg";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/admin/staff-details`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!Array.isArray(data.staff)) {
          setError("No staff data found");
          setLoading(false);
          return;
        }

        const targetStaff = data.staff.find((s) => s._id === id);

        if (!targetStaff) setError("Staff not found");
        else setStaff(targetStaff);
      } catch (err) {
        console.error("Error loading staff:", err);
        setError("Failed to load staff details");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-orange-500 font-medium text-xl hover:underline cursor-pointer"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Banner + Profile Circle */}
      <div className="relative w-full mt-6">
        <div
          className="w-full h-40 sm:h-48 rounded-t-xl shadow-md bg-cover bg-center"
          style={{ backgroundImage: `url(${Banner})` }}
        ></div>

        <div className="absolute -bottom-10 left-4 sm:left-8 w-24 h-24 sm:w-30 sm:h-30 bg-zinc-900 rounded-full shadow-lg flex items-center justify-center">
          <div className="w-20 h-20 sm:w-26 sm:h-26 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold">
            {staff.fullName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="bg-zinc-900 shadow-md p-6 pt-14 sm:pt-16 mt-0 border border-gray-700 rounded-b-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {staff.fullName}
        </h1>

        <div className="mt-3 space-y-2">
          <p className="flex items-center gap-2 text-white">
            <FaEnvelope className="text-orange-400" /> {staff.email}
          </p>

          <p className="flex items-center gap-2 text-white">
            <FaUserTie className="text-orange-400" /> Staff ID: {staff.staffId}
          </p>

          <p className="flex items-center gap-2 text-white">
            <FaPhoneAlt className="text-orange-400" /> {staff.contactNumber}
          </p>

          <p className="flex items-center gap-2 text-white">
            <HiOutlineOfficeBuilding className="text-orange-400 text-xl" />{" "}
            Department: <span className="font-semibold">{staff.department}</span>
          </p>
        </div>
      </div>

      {/* Lost Items */}
      <div className="bg-zinc-900 shadow-md rounded-xl p-6 mt-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-orange-400 mb-3">
          Reported Lost Items
        </h2>

        {staff.lostItems?.length > 0 ? (
          <ul className="space-y-4">
            {staff.lostItems.map((item) => (
              <li
                key={item._id}
                className="p-4 bg-black rounded-lg border border-gray-700"
              >
                <p className="font-medium text-white">{item.itemName}</p>
                <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-2 text-white">
                  <span className="flex items-center gap-2">
                    <MdLocationOn className="text-orange-400" /> {item.location}
                  </span>
                  <span className="hidden sm:block">|</span>
                  <span className="flex items-center gap-2">
                    <MdAccessTime className="text-orange-400" /> {item.timeRange}
                  </span>
                </div>
                <p className="mt-1 text-white">
                  Description: {item.itemDescription}
                </p>
                {item.identificationMark && (
                  <p className="mt-1 text-white">
                    Identification Mark: {item.identificationMark}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No lost items reported</p>
        )}
      </div>

      {/* Found Items */}
      <div className="bg-zinc-900 shadow-md rounded-xl p-6 mt-6 border border-gray-700 mb-10">
        <h2 className="text-xl font-semibold text-orange-400 mb-3">
          Reported Found Items
        </h2>

        {staff.foundItems?.length > 0 ? (
          <ul className="space-y-4">
            {staff.foundItems.map((item) => (
              <li
                key={item._id}
                className="p-4 bg-black rounded-lg border border-gray-700"
              >
                <p className="font-medium text-white">{item.itemName}</p>
                <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-2 text-white">
                  <span className="flex items-center gap-2">
                    <MdLocationOn className="text-green-500" /> {item.placeFound}
                  </span>
                  <span className="hidden sm:block">|</span>
                  <span className="flex items-center gap-2">
                    <MdAccessTime className="text-green-500" /> {item.timeFound}
                  </span>
                </div>
                <p className="mt-1 text-white">
                  Description: {item.itemDescription}
                </p>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.itemName}
                    className="mt-2 w-58 h-56 object-cover rounded-lg"
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No found items reported</p>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;
