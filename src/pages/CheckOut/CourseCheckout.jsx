import React from "react";
import { BookOpen, Clock, Globe, Check } from "lucide-react";
import API from "../../Configs/ApiEndpoints";

export default function CourseCheckout({
  course,
  teacherId,
  courseId,
  navigate,
  onProceed,
  isLoading = false,
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-0">
          {/* Left Section - Course Details */}
          <div className="col-span-2 p-8 border-r border-gray-200">
            <h1 className="text-3xl font-bold text-black mb-8">
              Course Checkout
            </h1>

            {/* Course Card */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-black" size={24} />
                <h2 className="text-xl font-semibold text-black">
                  Course Details
                </h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex gap-4">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={`${API.COURSE_THUMBNAILS}/${course.thumbnail}`}
                      alt={course.course_title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2 uppercase">
                      {course.category}
                    </span>
                    <h3 className="font-bold text-black text-lg mb-2">
                      {course.course_title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span>{course.total_videos} Lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{course.duration_weeks} Weeks</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span>{course.language}</span>
                      </div>
                    </div>
                    {course.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black text-lg">
                      Rs. {course.price}
                    </p>
                    <p className="text-gray-600 text-sm">Course Price</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">
                What's Included
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Mobile & Desktop Access</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Progress Tracking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="bg-gray-50 p-8">
            <h2 className="text-xl font-semibold text-black mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-black">
                <span className="text-gray-700">Course Price</span>
                <span className="font-medium">Rs. {course.price}</span>
              </div>

              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between text-black">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-lg font-bold">Rs. {course.price}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onProceed}
              disabled={isLoading}
              className={`w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-lg transition-colors mb-3 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {isLoading ? "Creating Order..." : "Proceed to Payment"}
            </button>

            <p className="text-xs text-gray-600 text-center">
              By proceeding, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
