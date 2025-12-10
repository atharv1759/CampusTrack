import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import LostFoundChart from "./main-dashboard/LostFoundChart";

const TopSection = () => {
  const [lostItems, setLostItems] = useState(0);
  const [foundItems, setFoundItems] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Admin token not found");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const lostRes = await axios.get(`${API_BASE_URL}/lost-items`, config);
        const foundRes = await axios.get(`${API_BASE_URL}/found-items`, config);
        const usersRes = await axios.get(`${API_BASE_URL}/users/stats`, config);

        setLostItems(lostRes.data.items.length);
        setFoundItems(foundRes.data.items.length);
        setStudentCount(usersRes.data.totalStudents);
        setStaffCount(usersRes.data.totalStaff);
      } catch (err) {
        console.error(
          "Error fetching dashboard data:",
          err.response?.data || err.message
        );
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pt-8 px-6 bg-black min-h-screen">
      <div className="pt-12 lg:pt-0 md:pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Lost Items */}
        <div className="p-6 rounded-xl shadow-sm bg-black border-2 border-orange-400 hover:shadow-md transition-all duration-200">
          <h2 className="text-md font-semibold text-orange-400">
            Total Lost Items
          </h2>
          <p className="text-4xl font-bold mt-3 text-orange-400">{lostItems}</p>
        </div>

        {/* Found Items */}
        <div className="p-6 rounded-xl shadow-sm bg-black border-2 border-orange-400 hover:shadow-md transition-all duration-200">
          <h2 className="text-md font-semibold text-orange-400">
            Total Found Items
          </h2>
          <p className="text-4xl font-bold mt-3 text-orange-400">{foundItems}</p>
        </div>

        {/* Staff */}
        <div className="p-6 rounded-xl shadow-sm bg-black border-2 border-orange-400 hover:shadow-md transition-all duration-200">
          <h2 className="text-md font-semibold text-orange-400">Total Staff</h2>
          <p className="text-4xl font-bold mt-3 text-orange-400">{staffCount}</p>
        </div>

        {/* Students */}
        <div className="p-6 rounded-xl shadow-sm bg-black border-2 border-orange-400 hover:shadow-md transition-all duration-200">
          <h2 className="text-md font-semibold text-orange-400">
            Total Students
          </h2>
          <p className="text-4xl font-bold mt-3 text-orange-400">{studentCount}</p>
        </div>
      </div>

      <LostFoundChart darkMode={true} />
    </div>
  );
};

export default TopSection;
