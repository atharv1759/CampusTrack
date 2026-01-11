import React, { useEffect, useRef, useMemo } from "react";
import {
  FaWallet,
  FaMobileAlt,
  FaKey,
  FaBook,
  FaIdCard,
  FaHeadphones,
} from "react-icons/fa";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const RecentReportedItems = ({ lostItems = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Icon mapping for categories
  const categoryIcons = {
    "Wallet": { icon: <FaWallet />, color: "bg-blue-800 text-blue-300" },
    "Mobile Phone": { icon: <FaMobileAlt />, color: "bg-green-800 text-green-300" },
    "Keys": { icon: <FaKey />, color: "bg-yellow-800 text-yellow-300" },
    "Book": { icon: <FaBook />, color: "bg-purple-800 text-purple-300" },
    "ID Card": { icon: <FaIdCard />, color: "bg-pink-800 text-pink-300" },
    "Headphones": { icon: <FaHeadphones />, color: "bg-orange-800 text-orange-300" },
  };

  // Get last 6 unique categories from lost items - ONLY REAL DATA
  const recentItems = useMemo(() => {
    if (!lostItems || lostItems.length === 0) return [];
    
    const seen = new Set();
    const recent = [];
    const sorted = [...lostItems].sort((a, b) => new Date(b.createdAt || b.dateLost) - new Date(a.createdAt || a.dateLost));
    
    for (const item of sorted) {
      const category = item.itemCategory;
      if (category && !seen.has(category) && recent.length < 6) {
        seen.add(category);
        recent.push({ 
          name: category, 
          ...(categoryIcons[category] || { icon: <FaKey />, color: "bg-gray-800 text-gray-300" })
        });
      }
    }
    
    return recent;
  }, [lostItems]);

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
    
    if (lostItems && lostItems.length > 0) {
      lostItems.forEach(item => {
        try {
          const itemDate = new Date(item.dateLost);
          if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
            const category = item.itemCategory || "Other";
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          }
        } catch (e) {
          console.error('Error processing item date:', e);
        }
      });
    }

    const labels = Object.keys(categoryCounts);
    const values = Object.values(categoryCounts);
    
    // If no data for current month, use sample data
    if (labels.length === 0) {
      labels.push("Wallet", "Mobile Phone", "Keys");
      values.push(12, 18, 9);
    }

    const data = {
      labels,
      datasets: [
        {
          label: "Lost Items",
          data: values,
          backgroundColor: "#f97316", // orange accent
          borderWidth: 0,
          borderRadius: 6,
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
          delay: ctx => (ctx.type === "data" && ctx.mode === "default" ? ctx.dataIndex * 120 : 0),
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
            borderColor: "#f97316",
            borderWidth: 1,
            callbacks: {
              label: (context) => `Count: ${context.parsed.y} item${context.parsed.y !== 1 ? 's' : ''}`
            }
          },
        },
        scales: {
          x: { 
            grid: { display: false }, 
            ticks: { color: "#f4f4f5" } 
          },
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
  }, [lostItems]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full overflow-hidden">

      {/* LEFT SIDE: Recently Reported Items */}
      <div className="bg-black rounded-2xl p-5 border border-gray-700
                      w-full lg:w-[40%] flex-shrink min-h-[250px] sm:min-h-[300px] lg:min-h-[380px] overflow-hidden">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
          Recently Reported Items
        </h2>

        {recentItems.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-400">No items reported yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full">
            {recentItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center bg-zinc-800
                                           border border-gray-700 rounded-lg
                                           p-3 sm:p-4 hover:shadow-md transition cursor-pointer w-full">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center 
                                rounded-full text-xl sm:text-2xl ${item.color}`}>
                  {item.icon}
                </div>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-200 text-center">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Chart */}
      <div className="bg-black rounded-2xl border border-gray-700 p-5 
                      w-full lg:w-[60%] min-w-0">
        <h2 className="text-xl font-semibold text-white mb-4">
          Frequent Lost Items of the Month
        </h2>

        <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[360px] xl:h-[380px] overflow-hidden">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default RecentReportedItems;
