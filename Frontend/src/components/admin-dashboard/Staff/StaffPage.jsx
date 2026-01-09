import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import { FaUserTie, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import Loader from "../../common/Loader/Loader";
import SearchBar from "../../common/SearchBar";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import noperson from "../../../assets/admin-dashboard/noperson.png";

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch staff and items in parallel
        const [staffRes, lostRes, foundRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/staff-details`, config),
          axios.get(`${API_BASE_URL}/lost-items`, { headers: config.headers }),
          axios.get(`${API_BASE_URL}/found-items`, { headers: config.headers })
        ]);

        if (staffRes.status === 401) {
          setError("Unauthorized access. Please login as admin.");
          setLoading(false);
          return;
        }

        const staffData = await staffRes.json();

        if (Array.isArray(staffData.staff)) {
          setStaff(staffData.staff);
        } else {
          setStaff([]);
          setError("No staff data found");
        }

        setLostItems(lostRes.data.items || []);
        setFoundItems(foundRes.data.items || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load staff data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count items for each staff member
  const getItemCounts = (staffEmail) => {
    const lostCount = lostItems.filter(item => item.userEmail === staffEmail).length;
    const foundCount = foundItems.filter(item => item.userEmail === staffEmail).length;
    return { lostCount, foundCount };
  };

  const filteredStaff = staff.filter(
    (member) =>
      member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;
  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-medium">{error}</p>
    );

  return (
    <div className="relative min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black"></div>
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-orange-500/20 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
      {/* Search Bar */}
      <div className="flex justify-center mt-20 lg:mt-4 md:mt-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search staff here..."
        />
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full mt-6">
        {filteredStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center col-span-full mt-20">
            <img src={noperson} alt="No staff" className="w-82" />
            <p className="text-white mt-4 text-lg">
              No staff found matching your search
            </p>
          </div>
        ) : (
          filteredStaff.map((member) => {
            const { lostCount, foundCount } = getItemCounts(member.email);
            return (
            <div
              key={member._id}
              className="relative bg-zinc-900 shadow-md rounded-xl border border-gray-700 p-5 hover:shadow-lg transition-all duration-200"
            >
              {/* Desktop View Profile Button */}
              <button
                onClick={() =>
                  navigate(`/admin-dashboard/staff-profile/${member.id || member._id}`)
                }
                className="
                  cursor-pointer absolute top-4 right-4 
                  px-3 py-1.5 text-sm font-medium 
                  bg-orange-500 hover:bg-orange-600 text-white 
                  rounded-md shadow-sm transition
                  hidden sm:block
                "
              >
                View Profile
              </button>

              {/* Mobile Arrow */}
              <button
                onClick={() =>
                  navigate(`/admin-dashboard/staff-profile/${member.id || member._id}`)
                }
                className="
                  cursor-pointer absolute top-4 right-4 
                  text-orange-500 
                  sm:hidden
                  text-2xl
                "
              >
                <MdArrowForward />
              </button>

              {/* Card Header */}
              <div className="flex gap-4 items-stretch">
                <div
                  className="
                    w-16 md:w-20 lg:w-24 
                    flex-shrink-0
                    rounded-xl bg-orange-500 text-white 
                    text-2xl md:text-3xl font-bold 
                    flex items-center justify-center p-2
                  "
                >
                  {member.fullName?.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col justify-between gap-1 flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-white">
                    {member.fullName}
                  </h2>

                  <p className="flex items-center gap-2 text-white text-sm break-all">
                    <FaEnvelope className="text-orange-400" /> {member.email}
                  </p>

                  {member.contactNumber && (
                    <p className="flex items-center gap-2 text-white text-sm break-all">
                      <FaPhoneAlt className="text-orange-400" />
                      {member.contactNumber}
                    </p>
                  )}

                  <p className="flex items-center gap-2 text-white text-sm break-all">
                    <HiOutlineOfficeBuilding className="text-orange-400 text-xl" />
                    Department: {member.department}
                  </p>
                </div>
              </div>

              {/* Lost & Found Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() =>
                    navigate(`/admin-dashboard/staff-profile/${member.id || member._id}`, { state: { activeTab: 'lost' } })
                  }
                  className="cursor-pointer px-4 py-2 text-sm rounded-lg text-white bg-red-500 hover:bg-red-600 transition flex items-center gap-2"
                >
                  Lost Items
                  {lostCount > 0 && (
                    <span className="bg-white text-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {lostCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin-dashboard/staff-profile/${member.id || member._id}`, { state: { activeTab: 'found' } })
                  }
                  className="cursor-pointer px-4 py-2 text-sm rounded-lg text-white bg-green-500 hover:bg-green-600 transition flex items-center gap-2"
                >
                  Found Items
                  {foundCount > 0 && (
                    <span className="bg-white text-green-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {foundCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
};

export default StaffPage;
