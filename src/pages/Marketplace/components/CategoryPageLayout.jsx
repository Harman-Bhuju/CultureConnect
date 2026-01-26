import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Loader2,
  Search,
  Filter,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../../components/cardLayout/Card";
import API from "../../../Configs/ApiEndpoints";

const CategoryPageLayout = ({
  category,
  title,
  description,
  showAudienceFilter = false,
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filters State
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [priceInput, setPriceInput] = useState({ min: "", max: "" }); // Local state for typing
  const [priceError, setPriceError] = useState(""); // Validation error
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState(null); // null means "All"
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination from API
  const [pagination, setPagination] = useState({
    total_items: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  // Audience options for cultural-clothes
  const audienceOptions = [
    { value: null, label: "All" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "boy", label: "Boys" },
    { value: "girl", label: "Girls" },
  ];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          category: category,
          sort: sortBy,
          page: currentPage,
          per_page: itemsPerPage,
        });

        if (searchQuery) params.append("q", searchQuery);
        if (priceRange.min) params.append("min_price", priceRange.min);
        if (priceRange.max) params.append("max_price", priceRange.max);
        if (selectedRatings.length > 0)
          params.append("ratings", selectedRatings.join(","));
        if (selectedAudience) params.append("audience", selectedAudience);

        const response = await fetch(
          `${API.GET_CATEGORY_PRODUCTS}?${params.toString()}`,
          { credentials: "include" },
        );
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
          setPagination(data.pagination);
        } else {
          setError(data.error || "Failed to load products");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchProducts();
  }, [
    category,
    sortBy,
    currentPage,
    priceRange,
    selectedRatings,
    selectedAudience,
    itemsPerPage,
    searchQuery,
  ]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedRatings, selectedAudience, sortBy, searchQuery]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearAllFilters = () => {
    setPriceRange({ min: "", max: "" });
    setPriceInput({ min: "", max: "" });
    setPriceError("");
    setSelectedRatings([]);
    setSelectedAudience(null);
    setCurrentPage(1);
  };

  // Apply price filter with validation
  const applyPriceFilter = () => {
    const minVal = priceInput.min ? parseFloat(priceInput.min) : null;
    const maxVal = priceInput.max ? parseFloat(priceInput.max) : null;

    // Validation: only min provided without max
    if (minVal !== null && maxVal === null) {
      setPriceError("Please enter a maximum price");
      return;
    }

    // Validation: max < min
    if (minVal !== null && maxVal !== null && maxVal < minVal) {
      setPriceError("Maximum price cannot be less than minimum");
      return;
    }

    // Clear error
    setPriceError("");

    // If only max provided, auto-set min to 0
    if (minVal === null && maxVal !== null) {
      setPriceInput({ min: "0", max: priceInput.max });
      setPriceRange({ min: "0", max: priceInput.max });
    } else {
      setPriceRange({ ...priceInput });
    }
  };

  const handlePriceKeyDown = (e) => {
    if (e.key === "Enter") {
      applyPriceFilter();
    }
  };

  const toggleRating = (rating) => {
    setSelectedRatings((prev) => {
      const isSelected = prev.includes(rating);
      let newRatings;
      if (isSelected) {
        newRatings = prev.filter((r) => r !== rating);
      } else {
        newRatings = [...prev, rating];
      }

      // Automatically sort by rating if any rating is selected
      if (newRatings.length > 0) {
        setSortBy("rating");
      }

      return newRatings;
    });
  };

  if (initialLoading) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  const hasActiveFilters =
    priceRange.min !== "" ||
    priceRange.max !== "" ||
    selectedRatings.length > 0 ||
    selectedAudience !== null;

  const FilterContent = ({ isMobile = false }) => (
    <div className={`space-y-8 ${isMobile ? "p-6 bg-white" : ""}`}>
      {!isMobile && (
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
            Filtering
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-tighter">
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Audience Filter - Only for cultural-clothes */}
      {showAudienceFilter && (
        <div>
          <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-red-600 pl-3">
            Shop For
          </h3>
          <div className="flex flex-wrap gap-2">
            {audienceOptions.map((option) => (
              <button
                key={option.value || "all"}
                onClick={() => {
                  setSelectedAudience(option.value);
                  if (isMobile) setIsMobileFilterOpen(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedAudience === option.value
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                }`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-red-600 pl-3">
          Price Range
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            step="100"
            min="0"
            className="w-full p-3 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-gray-400"
            value={priceInput.min}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || parseFloat(val) >= 0) {
                setPriceInput({ ...priceInput, min: val });
                setPriceError("");
              }
            }}
            onKeyDown={handlePriceKeyDown}
          />
          <span className="text-gray-300 font-light">to</span>
          <input
            type="number"
            placeholder="Max"
            step="100"
            min="0"
            className="w-full p-3 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all placeholder-gray-400"
            value={priceInput.max}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || parseFloat(val) >= 0) {
                setPriceInput({ ...priceInput, max: val });
                setPriceError("");
              }
            }}
            onKeyDown={handlePriceKeyDown}
          />
        </div>
        {priceError && (
          <p className="text-xs text-red-500 mt-2">{priceError}</p>
        )}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => {
              applyPriceFilter();
              if (isMobile) setIsMobileFilterOpen(false);
            }}
            className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
            Apply
          </button>
          {(priceRange.min ||
            priceRange.max ||
            priceInput.min ||
            priceInput.max) && (
            <button
              onClick={() => {
                setPriceInput({ min: "", max: "" });
                setPriceRange({ min: "", max: "" });
                setPriceError("");
              }}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider border-l-4 border-red-600 pl-3">
          Customer Rating
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 w-full group hover:bg-red-50 p-2 rounded-lg transition-all -ml-2 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(rating)}
                  onChange={() => {
                    toggleRating(rating);
                    // Don't close on rating toggle for multiple selection
                  }}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-red-600 checked:border-red-600 transition-all cursor-pointer"
                />
                <Check
                  size={12}
                  className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < rating ? "currentColor" : "none"}
                    className={
                      i < rating
                        ? "text-yellow-400 drop-shadow-sm"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-red-700 font-medium ml-auto">
                {rating} Star{rating > 1 ? "s" : ""}
              </span>
            </label>
          ))}
        </div>
      </div>
      {isMobile && (
        <button
          onClick={() => setIsMobileFilterOpen(false)}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl mt-4">
          View Results
        </button>
      )}
    </div>
  );
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 self-start sticky top-24 pr-4">
            <FilterContent />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Category Header */}
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mx-auto sm:mx-0 max-w-md">
                {description}
              </p>
            </div>

            {/* Top Bar - Enhanced for Mobile */}
            <div className="flex flex-col xs:flex-row justify-between items-center gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between w-full xs:w-auto gap-4">
                <span className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">
                  Showing{" "}
                  <span className="text-black font-bold">
                    {pagination.total_items}
                  </span>{" "}
                  {pagination.total_items === 1 ? "result" : "results"}
                </span>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 shadow-sm active:scale-95 transition-all">
                  <Filter size={14} />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-red-600 rounded-full" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 w-full xs:w-auto justify-end">
                <span className="text-[10px] sm:text-sm text-gray-400 font-medium uppercase tracking-wider">
                  Sort by:
                </span>
                <div className="relative group flex-1 xs:flex-initial">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-red-500 cursor-pointer hover:bg-gray-50 transition-colors">
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rating</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="relative min-h-[400px]">
              {loading && !initialLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                  <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                </div>
              )}

              {error ? (
                <div className="text-center py-20">
                  <p className="text-red-600 mb-4 font-medium">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all">
                    Retry
                  </button>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="group">
                      <Card product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-gray-300 w-10 h-10" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-2xl mb-3">
                    {searchQuery
                      ? `"${searchQuery}" not found`
                      : "No results match your criteria"}
                  </h3>
                  <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                    We couldn't find any products matching your current search
                    or filters. Try adjusting your selection to find what you're
                    looking for.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    {searchQuery && (
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(location.search);
                          params.delete("q");
                          navigate(`${location.pathname}?${params.toString()}`);
                        }}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all text-sm font-bold shadow-lg shadow-red-100 active:scale-95">
                        Clear Search Query
                      </button>
                    )}
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-50 transition-all text-sm font-bold active:scale-95">
                        Reset All Filters
                      </button>
                    )}
                    {!searchQuery && !hasActiveFilters && (
                      <button
                        onClick={() => navigate("/marketplace")}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-900 text-white rounded-full hover:bg-black transition-all text-sm font-bold active:scale-95">
                        Go to Shop
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination - Touch Friendly */}
            {pagination.total_pages > 1 && (
              <div className="mt-12 sm:mt-20 flex justify-center items-center gap-2 sm:gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.has_prev}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-red-600 hover:text-red-600 transition-all disabled:opacity-30">
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1.5 sm:gap-3">
                  {Array.from(
                    { length: pagination.total_pages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-red-600 text-white shadow-md shadow-red-200 scale-105"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent"
                      }`}>
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-red-600 hover:text-red-600 transition-all disabled:opacity-30">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          {/* Sliding Drawer */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-[32px] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <p className="text-xs text-gray-500">Refine results</p>
              </div>
              <div className="flex items-center gap-4">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-red-600">
                    Reset
                  </button>
                )}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
            </div>
            <FilterContent isMobile={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPageLayout;
