import React from "react";
import { ArrowLeft, Trophy, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CoursePlayerHeader({
  course,
  teacherId,
  courseId,
  progress,
  completedVideos,
  totalVideos,
}) {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="h-16 flex items-center justify-between">
          {/* Left: Back Button & Course Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 flex-shrink-0"
              title="Back to Course Details">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-gray-200 flex-shrink-0"></div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">
                {course.course_title}
              </h1>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>Your Learning Journey</span>
              </p>
            </div>
          </div>

          {/* Center: Progress Bar (Hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-4 flex-1 justify-center max-w-md mx-8">
            <BarChart3 className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="w-full">
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                <span>Progress</span>
                <span className="text-blue-600">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 shadow-sm"
                  style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>

          {/* Right: Status Badge & Home Button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold">Enrolled</span>
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden pb-4">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <div className="flex-1 flex justify-between text-xs font-semibold text-gray-600">
              <span>Course Progress</span>
              <span className="text-blue-600">{progress}%</span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>
              {completedVideos} of {totalVideos} lessons completed
            </span>
            <span>{totalVideos - completedVideos} remaining</span>
          </div>
        </div>
      </div>
    </header>
  );
}
