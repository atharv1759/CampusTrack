import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaUniversity,
  FaArrowLeft,
} from "react-icons/fa";
import { MdLocationOn, MdAccessTime } from "react-icons/md";
import Loader from "../../common/Loader/Loader";
import Banner from "../../../assets/admin-dashboard/banner.jpg";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lostItemsRef = useRef(null);
  const foundItemsRef = useRef(null);

  const [student, setStudent] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [expandedLostItems, setExpandedLostItems] = useState({});
  const [expandedFoundItems, setExpandedFoundItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        };

        // Fetch student details
        const studentsRes = await fetch(`${API_BASE_URL}/admin/students-details`, {
          headers: config.headers,
        });

        const studentsData = await studentsRes.json();

        if (!Array.isArray(studentsData.students)) {
          setError("No student data found");
          setLoading(false);
          return;
        }

        // Find student by id (not _id, backend returns "id")
        const targetStudent = studentsData.students.find((s) => s.id === id);

        if (!targetStudent) {
          setError("Student not found");
          setLoading(false);
          return;
        }

        setStudent(targetStudent);

        // Fetch all lost and found items
        const [lostRes, foundRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/lost-items`, config),
          axios.get(`${API_BASE_URL}/found-items`, config)
        ]);

        // Filter items for this specific student by email
        const userLostItems = (lostRes.data.items || []).filter(
          item => item.userEmail === targetStudent.email
        );
        const userFoundItems = (foundRes.data.items || []).filter(
          item => item.userEmail === targetStudent.email
        );

        setLostItems(userLostItems);
        setFoundItems(userFoundItems);

        // Try to fetch matches, but don't fail if endpoint doesn't exist
        try {
          const matchesRes = await axios.get(`${API_BASE_URL}/matches`, config);
          setMatches(matchesRes.data || []);
        } catch (matchError) {
          console.log('Matches endpoint not available:', matchError);
          setMatches([]);
        }

      } catch (err) {
        console.error("Error loading student:", err);
        setError("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  // Scroll to the appropriate section when page loads
  useEffect(() => {
    if (!loading && student && location.state?.activeTab) {
      setTimeout(() => {
        if (location.state.activeTab === 'lost' && lostItemsRef.current) {
          lostItemsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (location.state.activeTab === 'found' && foundItemsRef.current) {
          foundItemsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [loading, student, location.state]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  const getOrdinal = (num) => {
    if (!num) return "N/A";
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Get real-time status for a lost item based on its match
  const getLostItemStatus = (item) => {
    // Find if this item has a match
    const match = matches.find(m => m.lostItemId === item.id);
    
    if (!match) {
      return { status: 'Pending', color: 'bg-yellow-500 text-black' };
    }

    // Check handover status
    if (match.handoverStatus === 'received_by_owner') {
      return { status: 'Collected', color: 'bg-green-500 text-white' };
    } else if (match.handoverStatus === 'submitted_by_finder') {
      return { status: 'Ready for Pickup', color: 'bg-blue-500 text-white' };
    } else if (match.status === 'claimed') {
      return { status: 'Claimed', color: 'bg-orange-500 text-white' };
    } else if (match.status === 'rejected') {
      return { status: 'Rejected', color: 'bg-red-500 text-white' };
    }
    
    return { status: 'Matched', color: 'bg-purple-500 text-white' };
  };

  // Get real-time status for a found item based on its match
  const getFoundItemStatus = (item) => {
    // Find if this item has a match
    const match = matches.find(m => m.foundItemId === item.id);
    
    if (!match) {
      return { status: 'Available', color: 'bg-blue-500 text-white' };
    }

    // Check handover status
    if (match.handoverStatus === 'received_by_owner') {
      return { status: 'Handed Over', color: 'bg-green-500 text-white' };
    } else if (match.handoverStatus === 'submitted_by_finder') {
      return { status: 'Submitted', color: 'bg-orange-500 text-white' };
    } else if (match.status === 'claimed') {
      return { status: 'Claimed', color: 'bg-purple-500 text-white' };
    }
    
    return { status: 'Matched', color: 'bg-yellow-500 text-black' };
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* Simple Professional Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black"></div>
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-orange-500/20 to-transparent"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-orange-500 font-medium text-xl hover:underline cursor-pointer"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Profile Picture at Top Center */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-2xl border-4 border-orange-500 ring-4 ring-orange-500/20">
          {student.fullName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* User Name */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-2">
        {student.fullName}
      </h1>
      <p className="text-center text-gray-400 text-sm uppercase mb-8">Student Profile</p>

      {/* Profile Details Cards */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-xl font-semibold text-orange-400 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Email Card */}
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg hover:shadow-orange-500/30 hover:border-orange-500/30 transition-all duration-300">
            <p className="text-sm text-gray-400 uppercase font-semibold mb-2 flex items-center gap-2">
              <FaEnvelope className="text-orange-400" /> Email
            </p>
            <p className="text-base font-medium text-white break-words">{student.email}</p>
          </div>

          {/* Contact Card */}
          {student.contactNumber && (
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg hover:shadow-orange-500/30 hover:border-orange-500/30 transition-all duration-300">
              <p className="text-sm text-gray-400 uppercase font-semibold mb-2 flex items-center gap-2">
                <FaPhoneAlt className="text-orange-400" /> Contact Number
              </p>
              <p className="text-base font-medium text-white">{student.contactNumber}</p>
            </div>
          )}

          {/* Department Card */}
          {student.department && (
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg hover:shadow-orange-500/30 hover:border-orange-500/30 transition-all duration-300">
              <p className="text-sm text-gray-400 uppercase font-semibold mb-2 flex items-center gap-2">
                <FaUniversity className="text-orange-400" /> Department
              </p>
              <p className="text-base font-medium text-white">{student.department}</p>
            </div>
          )}

          {/* Enrollment Number Card */}
          {student.enrollmentNumber && (
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg hover:shadow-orange-500/30 hover:border-orange-500/30 transition-all duration-300">
              <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Enrollment Number</p>
              <p className="text-base font-medium text-white">{student.enrollmentNumber}</p>
            </div>
          )}

          {/* Year Card */}
          {student.year && (
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg hover:shadow-orange-500/30 hover:border-orange-500/30 transition-all duration-300">
              <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Year</p>
              <p className="text-base font-medium text-white">{getOrdinal(student.year)} Year</p>
            </div>
          )}

          {/* Semester Card */}
          {student.semester && (
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg hover:shadow-orange-500/30 hover:border-orange-500/30 transition-all duration-300">
              <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Semester</p>
              <p className="text-base font-medium text-white">{getOrdinal(student.semester)} Semester</p>
            </div>
          )}

          {/* Lost Items Count Card */}
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg hover:shadow-orange-500/30 hover:border-orange-500/30 transition-all duration-300">
            <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Lost Items Reported</p>
            <p className="text-3xl font-bold text-red-400">{lostItems.length}</p>
          </div>

          {/* Found Items Count Card */}
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg hover:shadow-orange-500/30 hover:border-orange-500/30 transition-all duration-300">
            <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Found Items Reported</p>
            <p className="text-3xl font-bold text-green-400">{foundItems.length}</p>
          </div>

          {/* Role Card */}
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 shadow-lg hover:shadow-orange-500/30 hover:border-orange-500/30 transition-all duration-300">
            <p className="text-sm text-gray-400 uppercase font-semibold mb-2">Role</p>
            <p className="text-base font-medium text-white capitalize">{student.role || 'Student'}</p>
          </div>
        </div>
      </div>

      {/* Lost Items */}
      <div 
        ref={lostItemsRef}
        className="max-w-6xl mx-auto bg-zinc-900/80 backdrop-blur-sm shadow-md rounded-xl p-6 mt-6 border border-gray-700/50 scroll-mt-20"
      >
        <h2 className="text-2xl font-semibold text-orange-400 mb-1 flex items-center gap-2">
          Reported Lost Items
          {lostItems.length > 0 && (
            <span className="bg-red-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
              {lostItems.length}
            </span>
          )}
        </h2>
        <p className="text-gray-400 text-sm mb-4">Items reported as lost by this student</p>

        {lostItems.length > 0 ? (
          <ul className="space-y-4">
            {lostItems.map((item) => {
              const itemStatus = getLostItemStatus(item);
              const isExpanded = expandedLostItems[item.id];
              return (
              <li
                key={item.id}
                className="p-4 bg-black/40 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-orange-500/40 transition-all duration-300"
              >
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => setExpandedLostItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-white hover:text-orange-400 transition-colors">
                      {item.itemName}
                      <span className="ml-2 text-xs text-gray-400">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                    </p>
                    {!isExpanded && (
                      <p className="text-sm text-gray-400">Category: {item.itemCategory}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${itemStatus.color}`}>
                    {itemStatus.status}
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-400">Category: {item.itemCategory}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-gray-300">
                      <span className="flex items-center gap-2">
                        <MdLocationOn className="text-orange-400" /> {item.location || 'N/A'}
                      </span>
                      <span className="hidden sm:block">|</span>
                      <span className="flex items-center gap-2">
                        <MdAccessTime className="text-orange-400" />
                        {new Date(item.dateLost).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>

                    <p className="text-gray-300">
                      <span className="font-medium">Description:</span> {item.description || item.itemDescription || 'No description provided'}
                    </p>
                    {item.identificationMark && (
                      <p className="text-gray-300">
                        <span className="font-medium">Identification Mark:</span> {item.identificationMark}
                      </p>
                    )}
                    {item.itemImage && (
                      <img
                        src={item.itemImage}
                        alt={item.itemName}
                        className="mt-2 w-58 h-56 object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}
              </li>
            );
            })}
          </ul>
        ) : (
          <p className="text-gray-400 text-center py-4">No lost items reported by this student</p>
        )}
      </div>

      {/* Found Items */}
      <div 
        ref={foundItemsRef}
        className="max-w-6xl mx-auto bg-zinc-900/80 backdrop-blur-sm shadow-md rounded-xl p-6 mt-6 border border-gray-700/50 mb-10 scroll-mt-20"
      >
        <h2 className="text-2xl font-semibold text-orange-400 mb-1 flex items-center gap-2">
          Reported Found Items
          {foundItems.length > 0 && (
            <span className="bg-green-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
              {foundItems.length}
            </span>
          )}
        </h2>
        <p className="text-gray-400 text-sm mb-4">Items reported as found by this student</p>

        {foundItems.length > 0 ? (
          <ul className="space-y-4">
            {foundItems.map((item) => {
              const itemStatus = getFoundItemStatus(item);
              const isExpanded = expandedFoundItems[item.id];
              return (
              <li
                key={item.id}
                className="p-4 bg-black/40 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-green-500/40 transition-all duration-300"
              >
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => setExpandedFoundItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-white hover:text-orange-400 transition-colors">
                      {item.itemName}
                      <span className="ml-2 text-xs text-gray-400">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                    </p>
                    {!isExpanded && (
                      <p className="text-sm text-gray-400">Category: {item.category || item.itemCategory || 'N/A'}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${itemStatus.color}`}>
                    {itemStatus.status}
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-400">Category: {item.category || item.itemCategory || 'N/A'}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-gray-300">
                      <span className="flex items-center gap-2">
                        <MdLocationOn className="text-green-500" />
                        {item.placeFound || item.location || 'N/A'}
                      </span>
                      <span className="hidden sm:block">|</span>
                      <span className="flex items-center gap-2">
                        <MdAccessTime className="text-green-500" />
                        {new Date(item.dateFound || item.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>

                    <p className="text-gray-300">
                      <span className="font-medium">Description:</span> {item.description || item.itemDescription || 'No description provided'}
                    </p>

                    {(item.image || item.imageUrl) && (
                      <img
                        src={item.image || `${API_BASE_URL}${item.imageUrl}`}
                        alt={item.itemName}
                        className="mt-3 w-full max-w-md h-64 object-cover rounded-lg border border-gray-600"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                )}
              </li>
            );
            })}
          </ul>
        ) : (
          <p className="text-gray-400 text-center py-4">No found items reported by this student</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default StudentProfile;
