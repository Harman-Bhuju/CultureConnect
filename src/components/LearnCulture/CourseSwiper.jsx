import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Mousewheel, Autoplay, Pagination } from "swiper/modules";
import CourseCard from "../cardlayout/CourseCard";
import API from "../../Configs/ApiEndpoints";

const CourseSwiper = () => {
  const swiperRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await fetch(`${API.GET_POPULAR_COURSES}?limit=10`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error("Failed to fetch popular courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (courses.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 lg:py-16">
      {/* Header with responsive typography */}
      <div className="mb-5 sm:mb-6 md:mb-8 text-center md:text-left px-1">
        <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Popular Courses
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base">
          Explore our most loved courses and start learning today
        </p>
      </div>

      <div className="relative group px-1 sm:px-2 md:px-0">
        {/* Navigation Buttons - Hidden on mobile, shown on lg+ hover with improved styling */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-10 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg hidden lg:flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-xl hover:scale-110 hover:border-teal-100 opacity-0 group-hover:opacity-100">
          <ChevronLeft size={20} className="text-gray-600 lg:hidden" />
          <ChevronLeft size={24} className="text-gray-700 hidden lg:block" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-10 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg hidden lg:flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-xl hover:scale-110 hover:border-teal-100 opacity-0 group-hover:opacity-100">
          <ChevronRight size={20} className="text-gray-600 lg:hidden" />
          <ChevronRight size={24} className="text-gray-700 hidden lg:block" />
        </button>

        {/* Swiper Container with enhanced responsive breakpoints */}
        <div className="relative swiper-custom-pagination">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Mousewheel, Autoplay, Pagination]}
            mousewheel={{ forceToAxis: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={10}
            loop={courses.length > 4}
            grabCursor
            breakpoints={{
              1536: { slidesPerView: 4.5, spaceBetween: 24, pagination: false },
              1280: { slidesPerView: 4, spaceBetween: 22, pagination: false },
              1024: { slidesPerView: 3.2, spaceBetween: 20, pagination: false },
              768: { slidesPerView: 2.5, spaceBetween: 16 },
              640: { slidesPerView: 2.2, spaceBetween: 14 },
              480: { slidesPerView: 1.8, spaceBetween: 12 },
              320: { slidesPerView: 1.4, spaceBetween: 10 },
              0: { slidesPerView: 1.15, spaceBetween: 8 },
            }}
            className="pb-10 sm:pb-8 md:pb-4">
            {courses.map((course) => (
              <SwiperSlide key={course.id} className="h-full">
                <div className="w-full flex justify-center py-1 sm:py-2">
                  <CourseCard
                    course={course}
                    teacherId={course.teacherId}
                    teacherName={course.teacher_name}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile swipe hint */}
        <div className="flex sm:hidden justify-center mt-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <span>Swipe to explore</span>
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
    </div>
  );
};

export default CourseSwiper;
