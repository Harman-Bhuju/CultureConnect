import React from "react";
import EnrolledCourseListRow from "./EnrolledCourseListRow";
import { BookOpen } from "lucide-react";

const EnrolledCourseList = ({ courses, onContinue }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    {/* Table Header */}
    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
      <div className="col-span-1 text-xs font-semibold text-blue-900 uppercase tracking-wide">
        Image
      </div>
      <div className="col-span-4 text-xs font-semibold text-blue-900 uppercase tracking-wide">
        Course Details
      </div>
      <div className="col-span-2 text-xs font-semibold text-blue-900 uppercase tracking-wide">
        Category
      </div>
      <div className="col-span-3 text-xs font-semibold text-blue-900 uppercase tracking-wide">
        Progress
      </div>
      <div className="col-span-2 text-xs font-semibold text-blue-900 uppercase tracking-wide text-right">
        Action
      </div>
    </div>

    {/* Table Body */}
    <div className="divide-y divide-gray-100">
      {courses.map((course) => (
        <EnrolledCourseListRow
          key={course.id}
          course={course}
          onContinue={onContinue}
        />
      ))}
    </div>

    {/* Empty State */}
    {courses.length === 0 && (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No courses found
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          You haven't enrolled in any courses yet. Explore our catalog to find
          courses that interest you.
        </p>
      </div>
    )}
  </div>
);

export default EnrolledCourseList;
