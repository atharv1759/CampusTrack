import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import LostFoundChart from "./main-dashboard/LostFoundChart";

const TopSection = () => {
  const [lostItems, setLostItems] = useState(0);
  const [foundItems, setFoundItems] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Admin token not found");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [lostRes, foundRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/lost-items`, config),
          axios.get(`${API_BASE_URL}/found-items`, config),
          axios.get(`${API_BASE_URL}/users/stats`, config)
        ]);

        const lostItemsData = lostRes.data.items || [];
        const foundItemsData = foundRes.data.items || [];

        setLostItems(lostItemsData.length);
        setFoundItems(foundItemsData.length);
        setStudentCount(usersRes.data.totalStudents || 0);
        setStaffCount(usersRes.data.totalStaff || 0);

        // Process data for chart - last 7 days
        const processChartData = () => {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const today = new Date();
          const last7Days = [];
          const labels = [];

          // Get last 7 days
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            last7Days.push(date.toDateString());
            labels.push(days[date.getDay()]);
          }

          // Count items per day
          const lostCounts = new Array(7).fill(0);
          const foundCounts = new Array(7).fill(0);
          const returnedCounts = new Array(7).fill(0);
          const unclaimedCounts = new Array(7).fill(0);

          lostItemsData.forEach(item => {
            const itemDate = new Date(item.dateLost || item.createdAt).toDateString();
            const index = last7Days.indexOf(itemDate);
            if (index !== -1) {
              lostCounts[index]++;
              if (item.status === 'claimed' || item.status === 'returned') {
                returnedCounts[index]++;
              } else if (item.status === 'unclaimed') {
                unclaimedCounts[index]++;
              }
            }
          });

          foundItemsData.forEach(item => {
            const itemDate = new Date(item.dateFound || item.createdAt).toDateString();
            const index = last7Days.indexOf(itemDate);
            if (index !== -1) {
              foundCounts[index]++;
            }
          });

          return {
            labels,
            lostCounts,
            foundCounts,
            returnedCounts,
            unclaimedCounts
          };
        };

        setChartData(processChartData());
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

      {chartData && <LostFoundChart chartData={chartData} darkMode={true} />}
    </div>
  );
};

export default TopSection;
