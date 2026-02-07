import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, GraduationCap } from "lucide-react";
import API from "../../Configs/ApiEndpoints";

const TeacherSpotlight = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestedTeachers();
  }, []);

  const fetchSuggestedTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API.GET_SUGGESTED_TEACHERS, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setTeachers(data.teachers || []);
      } else {
        setError(data.error || "Failed to load teachers");
      }
    } catch (err) {
      console.error("Fetch suggested teachers error:", err);
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 bg-gray-50 px-3 sm:px-6 md:px-10">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] md:w-[320px] bg-white rounded-xl p-4 animate-pulse flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return null;
  }

  return (
    <div className="py-8 sm:py-10 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-0 max-w-7xl mx-auto">
      {/* Header with responsive typography */}
      <div className="mb-4 sm:mb-5 md:mb-6 text-center md:text-left px-1">
        <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">
          Suggested Instructors
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-500">
          Learn from master practitioners
        </p>
      </div>

      {/* Enhanced Horizontal Scroll Container */}
      <div className="relative group/scroll">
        {/* Scroll fade indicators */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity" />
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity" />

        <div className="flex overflow-x-auto gap-2.5 xs:gap-3 sm:gap-3.5 md:gap-4 pb-4 sm:pb-5 md:pb-4 scrollbar-hide snap-x snap-mandatory -mx-3 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
          {teachers.map((teacher, index) => (
            <Link
              key={teacher.id}
              to={`/teacherprofile/${teacher.id}`}
              style={{ animationDelay: `${index * 60}ms` }}
              className="flex-shrink-0 w-[200px] xs:w-[220px] sm:w-[260px] md:w-[280px] lg:w-[320px] snap-start bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/80 p-2.5 xs:p-3 sm:p-3.5 md:p-4 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-teal-100 flex items-center gap-2.5 xs:gap-3 sm:gap-3.5 md:gap-4 group active:scale-[0.98]">
              {/* Profile image with enhanced sizing */}
              <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shrink-0 ring-2 ring-white shadow-sm">
                <img
                  src={`${API.TEACHER_PROFILE_PICTURES}/${teacher.profile_picture}`}
                  alt={teacher.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1544717305-27a734ef1904?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
              </div>

              {/* Content with fluid typography */}
              <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                <h3 className="font-bold text-gray-900 truncate text-xs xs:text-sm sm:text-sm md:text-base group-hover:text-teal-600 transition-colors">
                  {teacher.name}
                </h3>
                <p className="text-[10px] xs:text-xs sm:text-xs text-gray-500 truncate">
                  {teacher.specialty}
                </p>

                {/* Stats row with responsive layout */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] xs:text-[10px] sm:text-xs flex-wrap">
                  <span className="flex items-center gap-0.5 text-yellow-500 font-semibold">
                    <Star size={10} className="sm:hidden" fill="currentColor" />
                    <Star
                      size={12}
                      className="hidden sm:block"
                      fill="currentColor"
                    />
                    {teacher.rating}
                  </span>
                  <span className="text-gray-200 hidden xs:inline">•</span>
                  <span className="text-gray-500 hidden xs:inline">
                    {teacher.courses} Courses
                  </span>
                  <span className="text-gray-200 hidden sm:inline">•</span>
                  <span className="text-gray-500 hidden sm:inline">
                    {teacher.total_students >= 1000
                      ? `${(teacher.total_students / 1000).toFixed(1)}k`
                      : teacher.total_students}{" "}
                    Students
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="flex sm:hidden justify-center mt-1">
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <span>Swipe for more</span>
          <svg
            className="w-3 h-3 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TeacherSpotlight;
