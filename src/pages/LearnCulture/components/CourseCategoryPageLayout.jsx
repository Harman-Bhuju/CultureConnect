import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Loader2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import CourseCard from "../../../components/cardlayout/CourseCard";
import API from "../../../Configs/ApiEndpoints";

const CourseCategoryPageLayout = ({ category, title, description }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Mobile filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters State
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [priceInput, setPriceInput] = useState({ min: "", max: "" });
  const [priceError, setPriceError] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Pagination from API
  const [pagination, setPagination] = useState({
    total_items: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  const levelOptions = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
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
        if (selectedLevel !== "all") params.append("level", selectedLevel);

        const response = await fetch(
          `${API.GET_CATEGORY_COURSES}?${params.toString()}`,
          { credentials: "include" },
        );
        const data = await response.json();

        if (data.success) {
          setCourses(data.courses);
          setPagination(data.pagination);
        } else {
          setError(data.error || "Failed to load courses");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchCourses();
  }, [
    category,
    sortBy,
    currentPage,
    priceRange,
    selectedRatings,
    selectedLevel,
    itemsPerPage,
    searchQuery,
  ]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedRatings, selectedLevel, sortBy, searchQuery]);

  // Close filter drawer when screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsFilterOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when filter drawer is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

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
    setSelectedLevel("all");
    setCurrentPage(1);
  };

  const applyPriceFilter = () => {
    const minVal = priceInput.min ? parseFloat(priceInput.min) : null;
    const maxVal = priceInput.max ? parseFloat(priceInput.max) : null;

    if (minVal !== null && maxVal === null) {
      setPriceError("Please enter a maximum price");
      return;
    }

    if (minVal !== null && maxVal !== null && maxVal < minVal) {
      setPriceError("Maximum price cannot be less than minimum");
      return;
    }

    setPriceError("");

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

      if (newRatings.length > 0) {
        setSortBy("rating");
      }

      return newRatings;
    });
  };

  const hasActiveFilters =
    priceRange.min !== "" ||
    priceRange.max !== "" ||
    selectedRatings.length > 0 ||
    selectedLevel !== "all";

  const activeFilterCount =
    (priceRange.min || priceRange.max ? 1 : 0) +
    selectedRatings.length +
    (selectedLevel !== "all" ? 1 : 0);

  // Filter Panel Component (shared between sidebar and drawer)
  const FilterPanel = ({ isMobile = false }) => (
    <div className={`space-y-6 ${isMobile ? "pb-24" : ""}`}>
      {/* Level Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider border-l-4 border-teal-600 pl-2 sm:pl-3">
          Experience Level
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {levelOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedLevel(option.value)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedLevel === option.value
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 border border-gray-200"
              }`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider border-l-4 border-teal-600 pl-2 sm:pl-3">
          Course Price
        </h3>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="number"
            placeholder="Min"
            step="100"
            min="0"
            className="w-full p-2.5 sm:p-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
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
          <span className="text-gray-400 font-light text-sm">to</span>
          <input
            type="number"
            placeholder="Max"
            step="100"
            min="0"
            className="w-full p-2.5 sm:p-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
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
        <div className="flex gap-2 mt-2 sm:mt-3">
          <button
            onClick={applyPriceFilter}
            className="flex-1 py-2 bg-teal-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
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
              className="px-3 sm:px-4 py-2 border border-gray-200 text-gray-600 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider border-l-4 border-teal-600 pl-2 sm:pl-3">
          Course Rating
        </h3>
        <div className="space-y-1.5 sm:space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 sm:gap-3 w-full group hover:bg-teal-50 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all -ml-1.5 sm:-ml-2 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(rating)}
                  onChange={() => toggleRating(rating)}
                  className="peer appearance-none w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer"
                />
                <Check
                  size={10}
                  className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity sm:hidden"
                />
                <Check
                  size={12}
                  className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity hidden sm:block"
                />
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < rating ? "currentColor" : "none"}
                    className={`sm:hidden ${
                      i < rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                  />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < rating ? "currentColor" : "none"}
                    className={`hidden sm:block ${
                      i < rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-600 group-hover:text-teal-700 font-medium ml-auto">
                {rating}+
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-[1440px] mx-auto py-6 sm:py-8 md:py-10 px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white z-50 lg:hidden shadow-2xl transform transition-transform duration-300">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
                <FilterPanel isMobile={true} />
              </div>
              {/* Fixed bottom actions */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setIsFilterOpen(false);
                    }}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
                  Show Results
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 space-y-6 self-start sticky top-24 pr-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
                Filtering
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] font-bold text-teal-600 hover:text-teal-700 uppercase tracking-tighter">
                  Clear All
                </button>
              )}
            </div>
            <FilterPanel />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] sm:text-xs font-bold mb-3 sm:mb-4">
                EXPLORE TRADITIONS
              </div>
              <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                {description}
              </p>
            </div>

            {/* Top Bar - Filter button, count, and sort */}
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10 pb-4 sm:pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <SlidersHorizontal size={16} />
                  <span className="hidden xs:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center bg-teal-600 text-white text-xs font-bold rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <span className="text-gray-500 text-sm sm:text-base font-medium tracking-wide">
                  <span className="text-gray-900 font-bold">
                    {pagination.total_items}
                  </span>{" "}
                  <span className="hidden xs:inline">
                    {pagination.total_items === 1 ? "course" : "courses"}
                  </span>
                  <span className="xs:hidden">results</span>
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 sm:gap-3 w-full xs:w-auto">
                <span className="text-xs sm:text-sm text-gray-400 font-medium hidden sm:inline">
                  Sort:
                </span>
                <div className="relative flex-1 xs:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full xs:w-auto bg-white border border-gray-100 pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-teal-500 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                    <option value="newest">Newest</option>
                    <option value="popular">Popular</option>
                    <option value="price-low">Price: Low</option>
                    <option value="price-high">Price: High</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="relative min-h-[300px] sm:min-h-[400px]">
              {loading && !initialLoading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-teal-600" />
                </div>
              )}

              {error ? (
                <div className="text-center py-12 sm:py-20">
                  <p className="text-red-600 mb-4 font-medium text-sm sm:text-base">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 sm:px-8 py-2 bg-teal-600 text-white text-sm rounded-full hover:bg-teal-700 transition-all">
                    Retry
                  </button>
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      teacherId={course.teacherId}
                      teacherName={course.teacher_name}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 sm:py-24 md:py-32 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
                  <div className="bg-gray-50 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Search className="text-gray-300 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 px-4">
                    {searchQuery
                      ? `"${searchQuery}" not found`
                      : "No courses found"}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 md:mb-10 max-w-md mx-auto leading-relaxed px-6">
                    Try adjusting your filters or search to discover our
                    masterclasses.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-6">
                    {searchQuery && (
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(location.search);
                          params.delete("q");
                          navigate(`${location.pathname}?${params.toString()}`);
                        }}
                        className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all font-bold text-sm shadow-lg shadow-teal-100 active:scale-95">
                        Clear Search
                      </button>
                    )}
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-white border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-50 transition-all font-bold text-sm active:scale-95">
                        Reset Filters
                      </button>
                    )}
                    {!searchQuery && !hasActiveFilters && (
                      <button
                        onClick={() => navigate("/learnculture")}
                        className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-gray-900 text-white rounded-full hover:bg-black transition-all font-bold text-sm active:scale-95">
                        Explore All
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="mt-10 sm:mt-14 md:mt-20 flex justify-center items-center gap-1.5 sm:gap-2 md:gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.has_prev}
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-teal-600 hover:text-teal-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft size={16} className="sm:hidden" />
                  <ChevronLeft
                    size={18}
                    className="hidden sm:block md:hidden"
                  />
                  <ChevronLeft size={20} className="hidden md:block" />
                </button>

                {/* Smart pagination with ellipsis for many pages */}
                {pagination.total_pages <= 5 ? (
                  Array.from(
                    { length: pagination.total_pages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-100 scale-105 sm:scale-110"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      }`}>
                      {page}
                    </button>
                  ))
                ) : (
                  <>
                    {/* First page */}
                    <button
                      onClick={() => handlePageChange(1)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                        currentPage === 1
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-100 scale-105 sm:scale-110"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      }`}>
                      1
                    </button>

                    {currentPage > 3 && (
                      <span className="px-1 sm:px-2 text-gray-400">...</span>
                    )}

                    {/* Middle pages */}
                    {Array.from({ length: 3 }, (_, i) => {
                      const page = Math.max(
                        2,
                        Math.min(
                          currentPage - 1 + i,
                          pagination.total_pages - 1,
                        ),
                      );
                      return page;
                    })
                      .filter(
                        (page, index, arr) =>
                          arr.indexOf(page) === index &&
                          page > 1 &&
                          page < pagination.total_pages,
                      )
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                            currentPage === page
                              ? "bg-teal-600 text-white shadow-lg shadow-teal-100 scale-105 sm:scale-110"
                              : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                          }`}>
                          {page}
                        </button>
                      ))}

                    {currentPage < pagination.total_pages - 2 && (
                      <span className="px-1 sm:px-2 text-gray-400">...</span>
                    )}

                    {/* Last page */}
                    <button
                      onClick={() => handlePageChange(pagination.total_pages)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                        currentPage === pagination.total_pages
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-100 scale-105 sm:scale-110"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      }`}>
                      {pagination.total_pages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center border border-gray-200 rounded-full hover:border-teal-600 hover:text-teal-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight size={16} className="sm:hidden" />
                  <ChevronRight
                    size={18}
                    className="hidden sm:block md:hidden"
                  />
                  <ChevronRight size={20} className="hidden md:block" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseCategoryPageLayout;
