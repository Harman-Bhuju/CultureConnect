import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { BarChart3 } from "lucide-react";

const TopSellingChart = ({ selectedPeriod, topProducts, loading }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (
      !chartRef.current ||
      loading ||
      !topProducts ||
      topProducts.length === 0
    ) {
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: topProducts.map((p) =>
          p.status === "deleted"
            ? `${p.product_name} (deleted)`
            : p.product_name,
        ),
        datasets: [
          {
            label:
              selectedPeriod === "This month"
                ? "Units sold this month"
                : selectedPeriod === "This year"
                  ? "Units sold this year"
                  : "Total units sold",
            data: topProducts.map((p) => p.units_sold),
            backgroundColor: topProducts.map((p) =>
              p.status === "deleted" ? "#9ca3af" : "#2d3748",
            ),
            borderRadius: 4,
            barThickness: 20,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a202c",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.parsed.x} units sold`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: { size: 11 },
            },
            grid: {
              color: "#f3f4f6",
            },
          },
          y: {
            ticks: {
              color: "#4a5568",
              font: { size: 11 },
              callback: function (value) {
                const label = this.getLabelForValue(value);
                // Truncate long labels on mobile
                return label.length > 20
                  ? label.substring(0, 20) + "..."
                  : label;
              },
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [topProducts, selectedPeriod, loading]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-lg shadow-sm p-4 sm:p-6 h-full">
        <div
          className="flex justify-center items-center"
          style={{ height: "300px" }}>
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-600"></div>
        </div>
      </div>
    );
  }

  if (!topProducts || topProducts.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-lg shadow-sm p-4 sm:p-6 h-full">
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Top Selling Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {selectedPeriod === "This month"
              ? "Units sold this month"
              : selectedPeriod === "This year"
                ? "Units sold this year"
                : "Total units sold"}
          </p>
        </div>
        <div
          className="flex flex-col justify-center items-center"
          style={{ height: "250px" }}>
          <div className="bg-gray-100 rounded-full p-4 mb-3">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-sm sm:text-base">
            No sales data available
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 text-center px-4">
            Start selling products to see analytics
          </p>
        </div>
      </div>
    );
  }

  // Calculate dynamic height based on number of products
  const baseHeight = 60; // per product
  const minHeight = 250;
  const maxHeight = 500;
  const dynamicHeight = Math.min(
    Math.max(topProducts.length * baseHeight, minHeight),
    maxHeight,
  );
  const isScrollable = topProducts.length > 8;

  return (
    <div className="bg-white rounded-xl sm:rounded-lg shadow-sm p-4 sm:p-6 h-full flex flex-col">
      <div className="mb-3 sm:mb-4 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Top Selling Products
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {selectedPeriod === "This month"
            ? "Units sold this month"
            : selectedPeriod === "This year"
              ? "Units sold this year"
              : "Total units sold"}
        </p>
        {isScrollable && (
          <p className="text-[10px] sm:text-xs text-blue-600 mt-1">
            📊 Showing {topProducts.length} products - scroll to view all
          </p>
        )}
      </div>

      <div
        className="w-full overflow-y-auto flex-1"
        style={{ maxHeight: `${maxHeight}px` }}>
        <div
          style={{ height: `${dynamicHeight}px`, minHeight: `${minHeight}px` }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default TopSellingChart;
