import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

const LostFoundChart = ({ chartData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    const data = {
      labels: chartData.labels,
      datasets: [
        // BAR Dataset (Found Items)
        {
          label: "Found Items",
          data: chartData.foundCounts,
          type: "bar",
          backgroundColor: "#22c55e",
          borderWidth: 0,
          borderRadius: 6,
          maxBarThickness: 60,
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#22c55e',
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => value > 0 ? value : ''
          },
          animations: {
            y: { duration: 1200, easing: "easeOutQuart" },
          },
        },

        // Line for Lost Items
        {
          label: "Lost Items",
          data: chartData.lostCounts,
          type: "line",
          borderColor: "#3b82f6",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          pointRadius: 5,
          pointHoverRadius: 7,
          datalabels: {
            align: 'top',
            color: '#3b82f6',
            font: {
              weight: 'bold',
              size: 11
            },
            formatter: (value) => value > 0 ? value : ''
          },
          animations: {
            tension: { duration: 1500, easing: "easeInOutQuart", from: 0.1, to: 0.4 },
          },
        },

        // Line for Returned Items
        {
          label: "Returned Items",
          data: chartData.returnedCounts,
          type: "line",
          borderColor: "#f97316",
          borderWidth: 3,
          pointBackgroundColor: "#f97316",
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          datalabels: {
            display: false
          },
          animations: {
            tension: { duration: 1500, easing: "easeInOutQuart", from: 0.1, to: 0.4 },
          },
        },

        // Line for Unclaimed
        {
          label: "Unclaimed",
          data: chartData.unclaimedCounts,
          type: "line",
          borderColor: "#f43f5e",
          borderWidth: 3,
          pointBackgroundColor: "#f43f5e",
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          datalabels: {
            display: false
          },
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
        layout: { 
          padding: {
            top: 30,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        plugins: {
          datalabels: {
            display: true
          },
          legend: {
            display: true,
            position: "top",
            labels: { 
              color: "#f4f4f5",
              font: {
                size: 13,
                weight: 'bold'
              },
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#f4f4f5",
            bodyColor: "#f4f4f5",
            borderColor: "#f97316",
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y + ' items';
                return label;
              }
            }
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { 
              color: "#f4f4f5",
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(255,255,255,0.1)", drawBorder: false },
            ticks: { 
              color: "#f4f4f5",
              font: {
                size: 12,
                weight: 'bold'
              },
              stepSize: 1
            },
            title: {
              display: true,
              text: 'Number of Items',
              color: '#f4f4f5',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);
  }, [chartData]);

  return (
    <div className="bg-black rounded-2xl shadow-lg w-full mt-8 p-5 border border-gray-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-200 mb-2">
          Lost & Found Report (Last 7 Days)
        </h2>
        <p className="text-sm text-gray-400">
          <span className="text-green-400 font-semibold">Green Bars:</span> Items found each day • 
          <span className="text-blue-400 font-semibold ml-2">Blue Line:</span> Items lost each day • 
          <span className="text-orange-400 font-semibold ml-2">Orange Line:</span> Items returned • 
          <span className="text-red-400 font-semibold ml-2">Red Line:</span> Unclaimed items
        </p>
      </div>

      <div className="relative w-full max-w-full overflow-x-hidden h-[350px] md:h-[450px] lg:h-[500px]">
        <canvas ref={chartRef} className="w-full max-w-full"></canvas>
      </div>
    </div>
  );
};

export default LostFoundChart;
