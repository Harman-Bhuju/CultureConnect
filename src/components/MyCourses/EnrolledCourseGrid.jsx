import React from "react";
import EnrolledCourseCard from "./EnrolledCourseCard";
import { BookOpen } from "lucide-react";

const EnrolledCourseGrid = ({ courses, onContinue }) => (
  <div className="space-y-6">
    {courses.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <EnrolledCourseCard
            key={course.id}
            course={course}
            onContinue={onContinue}
          />
        ))}
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center py-16 px-4">
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

    {courses.length > 0 && (
      <div className="flex items-center justify-center pt-2">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">{courses.length}</span>{" "}
          {courses.length === 1 ? "course" : "courses"}
        </p>
      </div>
    )}
  </div>
);

export default EnrolledCourseGrid;
