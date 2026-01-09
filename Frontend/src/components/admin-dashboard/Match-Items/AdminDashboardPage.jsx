import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRobot } from "react-icons/fa";
import { API_BASE_URL } from "../../../config";
import MatchItemPage from "./MatchItemPage";
import Loader from "../../common/Loader/Loader";
import Button from "./Button";

const AdminDashboardPage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMatches, setShowMatches] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Admin token not found");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [lostRes, foundRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/lost-items`, config),
          axios.get(`${API_BASE_URL}/found-items`, config),
        ]);

        setLostItems(lostRes.data.items || []);
        setFoundItems(foundRes.data.items || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAIAnalyze = () => {
    setShowMatches(true);
  };

  if (showMatches) return <MatchItemPage />;

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 p-4">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-6 lg:p-8">
      {/* AI Analyzer Button */}
      <div className="flex flex-col items-center mb-6 sm:mb-10">
        <Button onClick={handleAIAnalyze} />
      </div>

      {/* Lost & Found Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Lost Items */}
        <div className="bg-black backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-orange-400 overflow-x-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-orange-400 mb-4 sm:mb-6">
            Lost Items
          </h2>
          <table className="min-w-full divide-y divide-gray-700 text-xs sm:text-sm md:text-base">
            <thead className="bg-zinc-800/60">
              <tr>
                {["Item", "Date Lost", "Time", "Location"].map((head) => (
                  <th
                    key={head}
                    className="px-2 sm:px-3 py-2 text-left font-medium text-gray-300 whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {lostItems.map((item) => (
                <tr key={item._id} className="hover:bg-zinc-800/50 transition">
                  <td className="px-2 sm:px-3 py-2">{item.itemName}</td>
                  <td className="px-2 sm:px-3 py-2">
                    {new Date(item.dateLost).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-2 sm:px-3 py-2">{item.timeRange}</td>
                  <td className="px-2 sm:px-3 py-2">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Found Items */}
        <div className="bg-black backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border border-green-400 overflow-x-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-green-400 mb-4 sm:mb-6">
            Found Items
          </h2>
          <table className="min-w-full divide-y divide-gray-700 text-xs sm:text-sm md:text-base">
            <thead className="bg-zinc-800/60">
              <tr>
                {["Item", "Date Found", "Time", "Place"].map((head) => (
                  <th
                    key={head}
                    className="px-2 sm:px-3 py-2 text-left font-medium text-gray-300 whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {foundItems.map((item) => (
                <tr key={item._id} className="hover:bg-zinc-800/50 transition">
                  <td className="px-2 sm:px-3 py-2">{item.itemName}</td>
                  <td className="px-2 sm:px-3 py-2">
                    {new Date(item.dateFound).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-2 sm:px-3 py-2">{item.timeFound}</td>
                  <td className="px-2 sm:px-3 py-2">{item.placeFound}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
