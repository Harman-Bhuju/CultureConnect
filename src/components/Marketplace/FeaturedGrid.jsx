import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import API from "../../Configs/ApiEndpoints";
import { Loader } from "lucide-react";
import { revealOnScroll } from "../../utils/animations";

const FeaturedGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cultural-clothes");
  const containerRef = useRef(null);

  const tabs = [
    { id: "cultural-clothes", label: "Trending Clothes" },
    { id: "musical-instruments", label: "Popular Instruments" },
    { id: "handicraft-decors", label: "Handicrafts" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API.GET_TRENDING_PRODUCTS}?category=${activeTab}`
      );
      const data = await response.json();

      if (data.success && data.products) {
        setProducts(data.products.slice(0, 8)); // Limit to 8 for the grid
      }
    } catch (error) {
      console.error("Failed to fetch featured products", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Collections
          </h2>
          <p className="text-gray-500 mt-1">
            Hand-picked items gaining popularity
          </p>
        </div>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg self-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id}
                className="opacity-0 reveal-card" // Class for animation trigger
                ref={(el) => {
                  if (el) revealOnScroll(el, { delay: index * 0.05, y: 30 });
                }}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              No featured products found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeaturedGrid;
