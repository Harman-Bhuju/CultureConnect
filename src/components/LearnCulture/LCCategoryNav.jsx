import React from "react";
import { Link } from "react-router-dom";
import { Music, Palette, Users, BookOpen } from "lucide-react";

const categories = [
  {
    id: "dances",
    title: "Traditional Dances",
    path: "/learnculture/dances",
    icon: Users,
    count: "30+ Masterclasses",
    color: "bg-teal-50 text-teal-600",
  },
  {
    id: "singing",
    title: "Vocal & Singing",
    path: "/learnculture/singing",
    icon: Music,
    count: "45+ Courses",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "instruments",
    title: "Musical Instruments",
    path: "/learnculture/instruments",
    icon: BookOpen,
    count: "60+ Tutorials",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    id: "art",
    title: "Arts & Crafts",
    path: "/learnculture/art",
    icon: Palette,
    count: "40+ Workshops",
    color: "bg-indigo-50 text-indigo-600",
  },
];

const LCCategoryNav = () => {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
      {categories.map((cat, index) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.id}
            to={cat.path}
            style={{ animationDelay: `${index * 80}ms` }}
            className="group relative w-full p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 bg-white/60 backdrop-blur-xl rounded-xl xs:rounded-2xl sm:rounded-2xl md:rounded-3xl border border-white/30 shadow-[0_2px_12px_0_rgba(31,38,135,0.04)] hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.12)] hover:bg-white/80 hover:border-teal-100/50 transition-all duration-500 ease-out overflow-hidden flex flex-col items-center text-center lg:items-start lg:text-left h-full transform hover:-translate-y-1 active:scale-[0.98]">
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-teal-50/30 via-transparent to-emerald-50/30 pointer-events-none" />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            {/* Icon container with enhanced responsiveness */}
            <div
              className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 ${cat.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm ring-2 ring-white/50 shrink-0`}>
              <Icon
                className="size-4 xs:size-5 sm:size-5 md:size-6 lg:size-8"
                strokeWidth={2.2}
              />
            </div>

            {/* Content with fluid typography */}
            <div className="flex-1 space-y-0.5 xs:space-y-1 sm:space-y-1.5">
              <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-gray-950 transition-colors line-clamp-2 leading-tight">
                {cat.title}
              </h3>
              <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-gray-400 group-hover:text-teal-600 transition-colors">
                {cat.count}
              </p>
            </div>

            {/* Hover indicator arrow - hidden on small screens */}
            <div className="hidden sm:flex absolute bottom-3 right-3 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6 w-6 h-6 md:w-8 md:h-8 rounded-full bg-teal-50 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default LCCategoryNav;
