import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import Loader from "../../common/Loader/Loader";
import noitems from "../../../assets/admin-dashboard/noitems.png";

const MyLostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          `${API_BASE_URL}/items/my-lost-items`,
          config
        );
        setItems(res.data.items || []);
      } catch (err) {
        console.error(
          "Error fetching lost items:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-6 mt-10 md:mt-0 text-white min-h-screen">
      {items.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] text-gray-400">
          <img src={noitems} alt="No items" className="w-58 mb-4 opacity-80" />
          <p className="text-lg">You haven’t reported any lost items yet.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-2xl font-bold text-orange-500 mb-6">
            My Lost Items
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black border-b-2 border-orange-500 text-left">
                  <th className="py-3 px-4 text-orange-500 uppercase text-sm">
                    Status
                  </th>
                  <th className="py-3 px-4 text-orange-500 uppercase text-sm">
                    Item
                  </th>
                  <th className="py-3 px-4 text-orange-500 uppercase text-sm">
                    Category
                  </th>
                  <th className="py-3 px-4 text-orange-500 uppercase text-sm">
                    Description
                  </th>
                  <th className="py-3 px-4 text-orange-500 uppercase text-sm">
                    Date Lost
                  </th>
                  <th className="py-3 px-4 text-orange-500 uppercase text-sm">
                    Time
                  </th>
                  <th className="py-3 px-4 text-orange-500 uppercase text-sm">
                    Location
                  </th>
                  <th className="py-3 px-4 text-orange-500 uppercase text-sm">
                    Identification Mark
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="bg-black">
                    <td className="py-3 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        item.status === 'received' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500' 
                          : item.status === 'claimed'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                      }`}>
                        {item.status === 'received' ? 'RECEIVED' : item.status === 'claimed' ? 'CLAIMED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {item.itemName || "Unnamed Item"}
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-black text-orange-500 border border-orange-500 text-sm px-3 py-1 rounded-full">
                        {item.itemCategory || "General"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-orange-300 max-w-xs break-words">
                      {item.itemDescription || "No description"}
                    </td>

                    <td className="py-3 px-4 text-orange-300">
                      {formatDate(item.dateLost)}
                    </td>

                    <td className="py-3 px-4 text-orange-300">{item.timeRange}</td>

                    <td className="py-3 px-4 text-orange-300">
                      {item.location || "Not specified"}
                    </td>

                    <td className="py-3 px-4 text-orange-300">
                      {item.identificationMark || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLostItems;
