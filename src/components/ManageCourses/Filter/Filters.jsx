import React, { useState } from "react";
import {
  Search,
  Grid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

const Filters = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  sortOption,
  setSortOption,
  stockFilter,
  setStockFilter,
  priceFilter,
  setPriceFilter,
  categories,
  sortOptions,
  stockOptions,
  priceOptions,
  filteredCount,
  viewMode,
  setViewMode,
}) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Count active filters
  const activeFilterCount =
    (categoryFilter !== "All Categories" ? 1 : 0) +
    (priceFilter !== "All pricing" ? 1 : 0) +
    (sortOption !== "Latest" ? 1 : 0);

  return (
    <>
      <div className="bg-white rounded-xl sm:rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 mb-4 sm:mb-6">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-3 sm:hidden">
          {/* Search + Filter Button Row */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50"
              />
            </div>
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative">
              <SlidersHorizontal size={18} className="text-gray-600" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Results + View Toggle Row */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {filteredCount}
              </span>{" "}
              courses
            </p>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop/Tablet Layout */}
        <div className="hidden sm:flex flex-wrap gap-3 lg:gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 min-w-[180px] lg:min-w-[240px] max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors">
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Price Filter */}
          {priceOptions && (
            <div className="relative">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors">
                {priceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors">
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Results Count + View Toggle */}
          <div className="flex items-center gap-3 ml-auto">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">
                {filteredCount}
              </span>{" "}
              courses
            </p>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 sm:hidden"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-[320px] bg-white z-50 sm:hidden shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Filters & Sort
              </h2>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-4 space-y-5 overflow-y-auto h-[calc(100%-140px)]">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-sm font-medium">
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing */}
              {priceOptions && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Pricing
                  </label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-sm font-medium">
                    {priceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Sort By
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-sm font-medium">
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fixed bottom actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setCategoryFilter("All Categories");
                    setPriceFilter("All pricing");
                    setSortOption("Latest");
                  }}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                  Reset
                </button>
              )}
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-md">
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Filters;
