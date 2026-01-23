import React from "react";
import { Info, Target, AlertCircle, Calendar, Star, CheckCircle, BookOpen } from "lucide-react";
import CourseReviews from "../Reviews/CourseReviews";

export default function LessonTabsSection({
  activeTab,
  setActiveTab,
  activeVideo,
}) {
  const tabs = [
    { id: "description", icon: Info, label: "Overview" },
    { id: "outcomes", icon: Target, label: "Learning Outcomes" },
    { id: "requirements", icon: AlertCircle, label: "Requirements" },
    { id: "schedule", icon: Calendar, label: "Schedule" },
    { id: "reviews", icon: Star, label: "Reviews" },
  ];

  const course = activeVideo?.course;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tabs Header */}
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all relative whitespace-nowrap ${activeTab === tab.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                About This Lesson
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {activeVideo?.description ||
                  "This lesson will help you understand the key concepts covered in this section of the course. Make sure to take notes and practice along with the video."}
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Course Details
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-4">
                {course?.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Course Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-medium capitalize">{course?.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">{course?.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Videos:</span>
                      <span className="font-medium">{course?.numVideos}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Outcomes Tab */}
        {activeTab === "outcomes" && (
          <div className="animate-in fade-in duration-300 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              What You'll Learn
            </h3>
            {course?.learningOutcomes && course.learningOutcomes.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {outcome}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No learning outcomes specified.</p>
            )}
          </div>
        )}

        {/* Requirements Tab */}
        {activeTab === "requirements" && (
          <div className="animate-in fade-in duration-300 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Requirements
            </h3>
            {course?.requirements && course.requirements.length > 0 ? (
              <div className="space-y-3">
                {course.requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">
                      {req}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specific requirements.</p>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="animate-in fade-in duration-300 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Learning Schedule
            </h3>
            {course?.learningSchedule ? (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Recommended Study Plan
                    </h4>
                    <p className="text-sm text-gray-600">
                      Follow this schedule for optimal learning
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {course.learningSchedule}
                </div>

                {course.hoursPerWeek > 0 && course.durationWeeks > 0 && (
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total commitment:</span>
                      <span className="font-semibold text-gray-900">
                        {course.durationWeeks} weeks × {course.hoursPerWeek}{" "}
                        hours/week
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No specific schedule provided.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-in fade-in duration-300">
            <CourseReviews
              course={{
                ...activeVideo?.course,
                reviews: activeVideo?.course?.reviews || [],
                // Ensure isEnrolled is passed down if needed by CourseReviews, 
                // though CoursePlayerPage users are always enrolled.
                isEnrolled: true,
              }}
              user={activeVideo?.user}
              openReviewForm={activeVideo?.openReviewForm}
              openDeleteModal={activeVideo?.openDeleteModal}
              teacherId={activeVideo?.course?.teacher_id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
