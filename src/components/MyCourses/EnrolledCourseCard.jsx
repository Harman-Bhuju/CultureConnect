import React from "react";
import { Star } from "lucide-react";
import { BASE_URL } from "../../Configs/ApiEndpoints";

const EnrolledCourseCard = ({ course, onContinue }) => {
  const handleContinue = (e) => {
    e.stopPropagation();
    onContinue(course);
  };

  // Data normalization
  const courseTitle = course.courseTitle || course.title || "Unnamed Course";
  const teacherName = course.teacherName || course.teacher_name || "Instructor";
  const rating =
    course.averageRating || course.average_rating || course.rating || 0;
  const reviews =
    course.reviews || course.totalReviews || course.total_reviews || 0;
  const progress = course.progress || 0;
  const description = course.description || "";

  // Image handling
  const getFirstImage = () => {
    const img = course.images?.[0] || course.thumbnail || course.image;
    if (img) return img;
    return null;
  };

  const rawImage = getFirstImage();
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BASE_URL}/uploads/teacher_datas/course_thumbnails/${rawImage}`
    : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 h-full flex flex-col group shadow-sm cursor-pointer"
      onClick={handleContinue}>
      {/* Course Image */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={courseTitle}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Course Content */}
      <div className="p-5 space-y-1 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-gray-900 text-base font-semibold leading-snug line-clamp-1">
          {courseTitle}
        </h3>

        {/* Instructor */}
        <p className="text-gray-500 text-sm font-medium">{teacherName}</p>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-1 flex-1">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-gray-900 text-sm font-bold">
            {rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? "#f59e0b" : "none"}
                className={
                  i < Math.floor(rating) ? "text-amber-500" : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-gray-400 text-sm">({reviews} reviews)</span>
        </div>

        {/* Progress Bar (Replacing Price) */}
        <div className="pt-2 space-y-1">
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress === 100 ? "bg-green-500" : "bg-blue-600"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
