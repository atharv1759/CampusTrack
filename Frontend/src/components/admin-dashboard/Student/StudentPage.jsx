import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config";
import { FaEnvelope, FaPhoneAlt, FaUniversity } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import axios from "axios";
import noperson from "../../../assets/admin-dashboard/noperson.png";
import Loader from "../../common/Loader/Loader";
import SearchBar from "../../common/SearchBar";
import { useNavigate } from "react-router-dom";

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [studentItemCounts, setStudentItemCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch students
        const studentsRes = await fetch(`${API_BASE_URL}/admin/students-details`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (studentsRes.status === 401) {
          setError("Unauthorized access. Please login as admin.");
          setLoading(false);
          return;
        }

        const studentsData = await studentsRes.json();
        if (!Array.isArray(studentsData.students)) {
          setStudents([]);
          setError("No student data found");
          setLoading(false);
          return;
        }

        setStudents(studentsData.students);

        // Fetch lost and found items for counting
        const [lostRes, foundRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/lost-items`, config),
          axios.get(`${API_BASE_URL}/found-items`, config)
        ]);

        const lostItems = lostRes.data.items || [];
        const foundItems = foundRes.data.items || [];

        // Count items per student by email
        const counts = {};
        studentsData.students.forEach(student => {
          const lostCount = lostItems.filter(item => item.userEmail === student.email).length;
          const foundCount = foundItems.filter(item => item.userEmail === student.email).length;
          counts[student.id] = { lost: lostCount, found: foundCount };
        });

        setStudentItemCounts(counts);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.fullName?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.department?.toLowerCase().includes(term)
    );
  });

  if (loading) return <Loader />;

  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-medium">{error}</p>
    );

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black"></div>
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-orange-500/20 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
      <div className="flex justify-center mt-20 lg:mt-4 md:mt-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search students here..."
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full mt-6">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center col-span-full mt-10">
            <img src={noperson} alt="No students" className="w-88" />
            <p className="text-gray-400 text-lg font-medium">
              No students found
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="relative bg-zinc-900 shadow-md rounded-xl border border-gray-700 p-5 hover:shadow-lg transition-all duration-200"
            >
              <button
                onClick={() =>
                  navigate(`/admin-dashboard/student-profile/${student.id}`)
                }
                className="absolute top-4 right-4 px-3 py-1.5 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm transition hidden sm:block"
              >
                View Profile
              </button>

              <button
                onClick={() =>
                  navigate(`/admin-dashboard/student-profile/${student.id}`)
                }
                className="absolute top-4 right-4 text-orange-500 sm:hidden text-2xl"
              >
                <MdArrowForward />
              </button>

              <div className="flex gap-4 items-stretch">
                <div className="w-16 md:w-20 lg:w-24 flex-shrink-0 rounded-xl bg-orange-500 text-white text-2xl md:text-3xl font-bold flex items-center justify-center p-2">
                  {student.fullName?.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col justify-between gap-1 flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-white">
                    {student.fullName}
                  </h2>

                  <p className="text-gray-300 text-sm flex items-center gap-2 break-all">
                    <FaEnvelope className="text-orange-400" /> {student.email}
                  </p>

                  <p className="text-gray-300 text-sm flex items-center gap-2 break-all">
                    <FaUniversity className="text-orange-400" />
                    {student.department} | Year {student.year} | Sem{" "}
                    {student.semester}
                  </p>

                  <p className="text-gray-300 text-sm flex items-center gap-2 break-words">
                    <FaPhoneAlt className="text-orange-400" />
                    {student.contactNumber}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() =>
                    navigate(`/admin-dashboard/student-profile/${student.id}`, {
                      state: { activeTab: 'lost' }
                    })
                  }
                  className="px-4 py-2 text-sm rounded-lg text-white bg-red-500 hover:bg-red-600 transition font-medium flex items-center gap-2"
                >
                  Lost Items
                  {studentItemCounts[student.id]?.lost > 0 && (
                    <span className="bg-red-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {studentItemCounts[student.id].lost}
                    </span>
                  )}
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin-dashboard/student-profile/${student.id}`, {
                      state: { activeTab: 'found' }
                    })
                  }
                  className="px-4 py-2 text-sm rounded-lg text-white bg-green-500 hover:bg-green-600 transition font-medium flex items-center gap-2"
                >
                  Found Items
                  {studentItemCounts[student.id]?.found > 0 && (
                    <span className="bg-green-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {studentItemCounts[student.id].found}
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default StudentPage;
