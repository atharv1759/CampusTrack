import React, { useEffect, useRef } from "react";
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

const RecentReportedItems = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const recentItems = [
    { id: 1, name: "Wallet", icon: <FaWallet />, color: "bg-blue-800 text-blue-300" },
    { id: 2, name: "Mobile Phone", icon: <FaMobileAlt />, color: "bg-green-800 text-green-300" },
    { id: 3, name: "Keys", icon: <FaKey />, color: "bg-yellow-800 text-yellow-300" },
    { id: 4, name: "Book", icon: <FaBook />, color: "bg-purple-800 text-purple-300" },
    { id: 5, name: "ID Card", icon: <FaIdCard />, color: "bg-pink-800 text-pink-300" },
    { id: 6, name: "Headphones", icon: <FaHeadphones />, color: "bg-orange-800 text-orange-300" },
  ];

  // Initialize chart
  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");

    const labels = recentItems.map(item => item.name);
    const values = [12, 18, 9, 7, 5, 11];

    const data = {
      labels,
      datasets: [
        {
          label: "Lost Items",
          data: values,
          backgroundColor: "#f97316", // orange accent
          borderWidth: 0,
          borderRadius: 6,
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
        animation: {
          duration: 1200,
          easing: "easeInOutQuart",
          delay: ctx => (ctx.type === "data" && ctx.mode === "default" ? ctx.dataIndex * 120 : 0),
        },
        plugins: {
          legend: { display: true, position: "top", labels: { color: "#f4f4f5" } },
          tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#f4f4f5",
            bodyColor: "#f4f4f5",
            borderColor: "#f97316",
            borderWidth: 1,
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#f4f4f5" } },
          y: { beginAtZero: true, grid: { drawBorder: false, color: "rgba(255,255,255,0.1)" }, ticks: { color: "#f4f4f5" } },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full overflow-hidden">

      {/* LEFT SIDE: Recently Reported Items */}
      <div className="bg-black rounded-2xl p-5 border border-gray-700
                      w-full lg:w-[40%] flex-shrink min-h-[250px] sm:min-h-[300px] lg:min-h-[380px] overflow-hidden">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
          Recently Reported Items
        </h2>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full">
          {recentItems.map(item => (
            <div key={item.id} className="flex flex-col items-center bg-zinc-800
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
