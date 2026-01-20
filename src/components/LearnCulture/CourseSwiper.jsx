import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "../cardlayout/CourseCard";

const CourseSwiper = () => {
  const scrollRef = useRef(null);

  const courses = [
    {
      id: 1,
      title: "Complete Web Design: from Figma to Webflow to Freelancing",
      instructor: "Vako Shvili",
      description:
        "3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.",
      rating: 4.7,
      students: "16,741",
      price: "14,99€",
      originalPrice: "89,99€",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800",
      badge: "Bestseller",
    },
    {
      id: 2,
      title: "Master Traditional Nepali Dance",
      instructor: "Maya Tamang",
      description:
        "Learn authentic Nepali folk dances with expert guidance and cultural insights.",
      rating: 4.8,
      students: "8,234",
      price: "Rs.1,999",
      originalPrice: "Rs.4,999",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",
    },
    {
      id: 3,
      title: "Madal Playing for Beginners",
      instructor: "Rajesh Maharjan",
      description:
        "Master the traditional Nepali drum with step-by-step lessons from basic to advanced.",
      rating: 4.6,
      students: "5,421",
      price: "Rs.2,499",
      originalPrice: "Rs.5,999",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800",
    },
    {
      id: 4,
      title: "Traditional Thangka Painting",
      instructor: "Karma Lama",
      description:
        "Learn the ancient art of Thangka painting with traditional techniques and modern applications.",
      rating: 4.9,
      students: "3,156",
      price: "Rs.3,999",
      originalPrice: "Rs.7,999",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
      badge: "Popular",
    },
    {
      id: 5,
      title: "Nepali Folk Songs Masterclass",
      instructor: "Sita Gurung",
      description:
        "Discover and master beautiful Nepali folk songs with vocal training and cultural context.",
      rating: 4.7,
      students: "6,892",
      price: "Rs.1,799",
      originalPrice: "Rs.3,999",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    },
    {
      id: 6,
      title: "Advanced React & TypeScript",
      instructor: "John Anderson",
      description:
        "Build scalable applications with React 18, TypeScript, and modern development practices.",
      rating: 4.8,
      students: "12,456",
      price: "19,99€",
      originalPrice: "99,99€",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Popular Courses
        </h2>
        <p className="text-gray-500">
          Explore our most loved courses and start learning today
        </p>
      </div>

      <div className="relative group">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>

        {/* Swiper Container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex gap-6 pb-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 w-80"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSwiper;