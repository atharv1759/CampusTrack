import React, { useEffect, useRef, useMemo } from "react";
import {
  FaBook,
  FaUtensils,
  FaUmbrella,
  FaLaptop,
  FaGlasses,
  FaBriefcase,
  FaWallet,
  FaMobileAlt,
  FaKey,
  FaIdCard,
  FaHeadphones,
  FaSuitcase,
} from "react-icons/fa";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const RecentFoundItems = ({ foundItems = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Icon mapping for categories
  const categoryIcons = {
    "Books": { icon: <FaBook />, color: "bg-purple-800 text-purple-300" },
    "Lunch Box": { icon: <FaUtensils />, color: "bg-yellow-800 text-yellow-300" },
    "Umbrella": { icon: <FaUmbrella />, color: "bg-blue-800 text-blue-300" },
    "Laptop": { icon: <FaLaptop />, color: "bg-green-800 text-green-300" },
    "Spectacles": { icon: <FaGlasses />, color: "bg-pink-800 text-pink-300" },
    "Office Bag": { icon: <FaBriefcase />, color: "bg-orange-800 text-orange-300" },
    "Wallet": { icon: <FaWallet />, color: "bg-blue-800 text-blue-300" },
    "Mobile Phone": { icon: <FaMobileAlt />, color: "bg-green-800 text-green-300" },
    "Keys": { icon: <FaKey />, color: "bg-yellow-800 text-yellow-300" },
    "ID Card": { icon: <FaIdCard />, color: "bg-pink-800 text-pink-300" },
    "Headphones": { icon: <FaHeadphones />, color: "bg-orange-800 text-orange-300" },
    "Backpack": { icon: <FaSuitcase />, color: "bg-red-800 text-red-300" },
  };

  // Get last 6 unique categories from found items - ONLY REAL DATA
  const recentFoundItems = useMemo(() => {
    if (!foundItems || foundItems.length === 0) return [];
    
    const seen = new Set();
    const recent = [];
    const sorted = [...foundItems].sort((a, b) => new Date(b.createdAt || b.dateFound) - new Date(a.createdAt || a.dateFound));
    
    for (const item of sorted) {
      const category = item.category || item.itemCategory;
      if (category && !seen.has(category) && recent.length < 6) {
        seen.add(category);
        recent.push({ 
          name: category, 
          ...(categoryIcons[category] || { icon: <FaBriefcase />, color: "bg-gray-800 text-gray-300" })
        });
      }
    }
    
    return recent;
  }, [foundItems]);

  // Initialize chart with real data
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Get category frequency for current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const categoryCounts = {};
    
    if (foundItems && foundItems.length > 0) {
      foundItems.forEach(item => {
        try {
          const itemDate = new Date(item.dateFound);
          if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
            const category = item.category || item.itemCategory || "Other";
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          }
        } catch (e) {
          console.error('Error processing item date:', e);
        }
      });
    }

    const labels = Object.keys(categoryCounts);
    const values = Object.values(categoryCounts);
    
    // If no data for current month, show sample message
    if (labels.length === 0) {
      labels.push("Books", "Laptop", "Umbrella");
      values.push(4, 7, 3);
    }

    const data = {
      labels,
      datasets: [
        {
          label: "Found Items",
          data: values,
          backgroundColor: "#22c55e",
          borderRadius: 6,
          borderWidth: 0,
          maxBarThickness: 60,
          animations: { y: { duration: 1200, easing: "easeOutQuart" } },
        },
      ],
    };

    const config = {
      type: "bar",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
          }
        },
        animation: {
          duration: 1200,
          easing: "easeInOutQuart",
          delay: (ctx) =>
            ctx.type === "data" && ctx.mode === "default" ? ctx.dataIndex * 120 : 0,
        },
        plugins: {
          legend: { 
            display: true, 
            position: "top", 
            labels: { 
              color: "#f4f4f5",
              font: { weight: 'bold' }
            } 
          },
          tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#f4f4f5",
            bodyColor: "#f4f4f5",
            borderColor: "#22c55e",
            borderWidth: 1,
            callbacks: {
              label: (context) => `Count: ${context.parsed.y} item${context.parsed.y !== 1 ? 's' : ''}`
            }
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#f4f4f5" } },
          y: {
            beginAtZero: true,
            grid: { drawBorder: false, color: "rgba(255,255,255,0.1)" },
            ticks: { 
              color: "#f4f4f5",
              stepSize: 1
            },
            title: {
              display: true,
              text: 'Number of Items',
              color: '#f4f4f5',
              font: { size: 12, weight: 'bold' }
            }
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);
  }, [foundItems]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full overflow-hidden">

      {/* LEFT — Found Items Grid */}
      <div className="bg-black rounded-2xl p-5 border border-gray-700
                      w-full lg:w-[40%] flex-shrink-0 min-h-[280px] md:min-h-[330px] lg:min-h-[380px] overflow-hidden">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
          Recently Found Items
        </h2>

        {recentFoundItems.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-400">No items found yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
            {recentFoundItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center bg-zinc-800 border border-gray-700 
                                           rounded-xl p-3 sm:p-4 hover:shadow-md transition cursor-pointer w-full">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full text-xl sm:text-2xl md:text-3xl ${item.color}`}>
                  {item.icon}
                </div>
                <p className="mt-2 text-[10px] sm:text-xs md:text-sm font-medium text-gray-200 text-center">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT — Found Items Chart */}
      <div className="bg-black rounded-2xl border border-gray-700 p-5 w-full lg:w-[60%] min-w-0">
        <h2 className="text-xl font-semibold text-white mb-4">
          Frequently Found Items of the Month
        </h2>

        <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[360px] xl:h-[380px] overflow-hidden">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default RecentFoundItems;
