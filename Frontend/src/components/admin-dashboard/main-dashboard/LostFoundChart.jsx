import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const LostFoundChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    const data = {
      labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        // BAR Dataset (Found Items)
        {
          label: "Found Items",
          data: [40, 25, 60, 70, 50, 35, 30],
          type: "bar",
          backgroundColor: "#22c55e",
          borderWidth: 0,
          borderRadius: 6,
          animations: {
            y: { duration: 1200, easing: "easeOutQuart" },
          },
        },

        // Line for Lost Items
        {
          label: "Lost Items",
          data: [60, 45, 80, 90, 75, 55, 40],
          type: "line",
          borderColor: "#3b82f6",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          animations: {
            tension: { duration: 1500, easing: "easeInOutQuart", from: 0.1, to: 0.4 },
          },
        },

        // Line for Returned Items
        {
          label: "Returned Items",
          data: [10, 20, 15, 30, 25, 15, 18],
          type: "line",
          borderColor: "#f97316",
          borderWidth: 2,
          pointBackgroundColor: "#f97316",
          tension: 0.4,
          animations: {
            tension: { duration: 1500, easing: "easeInOutQuart", from: 0.1, to: 0.4 },
          },
        },

        // Line for Unclaimed
        {
          label: "Unclaimed",
          data: [5, 10, 8, 12, 10, 6, 9],
          type: "line",
          borderColor: "#f43f5e",
          borderWidth: 2,
          pointBackgroundColor: "#f43f5e",
          tension: 0.4,
          animations: {
            tension: { duration: 1500, easing: "easeInOutQuart", from: 0.1, to: 0.4 },
          },
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
          delay: (context) => {
            let delay = 0;
            if (context.type === "data" && context.mode === "default") {
              delay = context.dataIndex * 120;
            }
            return delay;
          },
        },
        layout: { padding: 0 },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: { color: "#f4f4f5" }, // legend text color
          },
          tooltip: {
            backgroundColor: "#1f2937", // dark tooltip background
            titleColor: "#f4f4f5",
            bodyColor: "#f4f4f5",
            borderColor: "#f97316",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#f4f4f5" }, // x-axis labels
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(255,255,255,0.1)", drawBorder: false },
            ticks: { color: "#f4f4f5" }, // y-axis labels
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);
  }, []);

  return (
    <div className="bg-black rounded-2xl shadow-lg w-full mt-8 p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-200">
          Lost & Found Report
        </h2>
      </div>

      <div className="relative w-full max-w-full overflow-x-hidden h-[300px] md:h-[400px] lg:h-[450px]">
        <canvas ref={chartRef} className="w-full max-w-full"></canvas>
      </div>
    </div>
  );
};

export default LostFoundChart;
