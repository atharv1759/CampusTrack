import React, { useEffect, useRef } from "react";
import {
  FaBook,
  FaUtensils,
  FaUmbrella,
  FaLaptop,
  FaGlasses,
  FaBriefcase,
} from "react-icons/fa";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const RecentFoundItems = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const foundItems = [
    { id: 1, name: "Books", icon: <FaBook />, color: "bg-purple-800 text-purple-300" },
    { id: 2, name: "Lunch Box", icon: <FaUtensils />, color: "bg-yellow-800 text-yellow-300" },
    { id: 3, name: "Umbrella", icon: <FaUmbrella />, color: "bg-blue-800 text-blue-300" },
    { id: 4, name: "Laptop", icon: <FaLaptop />, color: "bg-green-800 text-green-300" },
    { id: 5, name: "Spectacles", icon: <FaGlasses />, color: "bg-pink-800 text-pink-300" },
    { id: 6, name: "Office Bag", icon: <FaBriefcase />, color: "bg-orange-800 text-orange-300" },
  ];

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    const labels = foundItems.map((item) => item.name);
    const values = [4, 7, 3, 2, 6, 1];

    const data = {
      labels,
      datasets: [
        {
          label: "Found Items",
          data: values,
          backgroundColor: "#22c55e",
          borderRadius: 6,
          borderWidth: 0,
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
          delay: (ctx) =>
            ctx.type === "data" && ctx.mode === "default" ? ctx.dataIndex * 120 : 0,
        },
        plugins: {
          legend: { display: true, position: "top", labels: { color: "#f4f4f5" } },
          tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#f4f4f5",
            bodyColor: "#f4f4f5",
            borderColor: "#22c55e",
            borderWidth: 1,
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#f4f4f5" } },
          y: {
            beginAtZero: true,
            grid: { drawBorder: false, color: "rgba(255,255,255,0.1)" },
            ticks: { color: "#f4f4f5" },
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full overflow-hidden">

      {/* LEFT — Found Items Grid */}
      <div className="bg-black rounded-2xl p-5 border border-gray-700
                      w-full lg:w-[40%] flex-shrink-0 min-h-[280px] md:min-h-[330px] lg:min-h-[380px] overflow-hidden">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
          Recently Found Items
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
          {foundItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center bg-zinc-800 border border-gray-700 
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
