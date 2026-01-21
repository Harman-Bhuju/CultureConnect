import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LessonNavigation({
  currentIndex,
  totalVideos,
  onPrevious,
  onNext,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          disabled={currentIndex === 0}
          onClick={onPrevious}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
            currentIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 shadow-sm"
          }`}>
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Lesson Counter */}
        <div className="flex-1 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Lesson{" "}
            <span className="text-gray-900 font-bold">{currentIndex + 1}</span>{" "}
            of <span className="text-gray-900 font-bold">{totalVideos}</span>
          </p>
        </div>

        {/* Next Button */}
        <button
          disabled={currentIndex === totalVideos - 1}
          onClick={onNext}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md ${
            currentIndex === totalVideos - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-200 active:scale-95"
          }`}>
          <span className="hidden sm:inline">Next Lesson</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
