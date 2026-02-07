import React from "react";
import { Edit2, Trash2, Upload, Star, ChevronRight } from "lucide-react";
import { BASE_URL } from "../../../Configs/ApiEndpoints";

const CourseListRow = ({
  course,
  onView,
  onEdit,
  onDelete,
  onPublish,
  isDraftMode,
}) => {
  const handleRowClick = () => {
    onView(course);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(course);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(course);
  };

  const handlePublish = (e) => {
    e.stopPropagation();
    onPublish(course);
  };

  // Average rating calculation
  const calculateAverageRating = () => {
    if (!course.reviews || course.reviews.length === 0) {
      return course.rating || course.average_rating || 0;
    }
    const total = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / course.reviews.length) * 10) / 10;
  };

  const avgRating = calculateAverageRating();
  const reviewCount =
    course.reviews?.length ||
    course.totalReviews ||
    course.total_reviews ||
    (course.rating || course.average_rating ? 1 : 0);

  // Image
  const courseImage = course.images?.[0] || course.thumbnail || course.image;
  const imageUrl = courseImage
    ? courseImage.startsWith("http")
      ? courseImage
      : `${BASE_URL}/uploads/teacher_datas/course_thumbnails/${courseImage}`
    : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";

  const courseTitle = course.courseTitle || course.title || "Unnamed Course";

  // Price formatting
  const formattedPrice =
    typeof course.price === "number"
      ? `Rs. ${course.price.toLocaleString()}`
      : `Rs. ${parseFloat(course.price || 0).toLocaleString()}`;

  return (
    <>
      {/* Desktop Row - Hidden on mobile */}
      <div
        onClick={handleRowClick}
        className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-orange-50 transition-colors cursor-pointer group relative">
        {/* Image */}
        <div className="col-span-1 relative">
          <img
            src={imageUrl}
            alt={courseTitle}
            className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";
            }}
          />
        </div>

        {/* Course Details */}
        <div className="col-span-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {courseTitle}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">
            {course.description}
          </p>
        </div>

        {/* Category */}
        <div className="col-span-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
            {course.category}
          </span>
        </div>

        {/* Price */}
        <div className="col-span-1">
          <span className="font-bold text-orange-600 text-sm">
            {formattedPrice}
          </span>
        </div>

        {/* Rating */}
        <div className="col-span-2">
          {reviewCount > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900">
                {avgRating}
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.floor(avgRating) ? "#f59e0b" : "none"}
                    stroke={i < Math.floor(avgRating) ? "#f59e0b" : "#d1d5db"}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">No reviews</span>
          )}
        </div>

        {/* Status */}
        <div className="col-span-1">
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
              course.status === "Active" || course.status === "published"
                ? "bg-green-100 text-green-700"
                : course.status === "Draft" || course.status === "draft"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}>
            {course.status}
          </span>
        </div>

        {/* Actions */}
        <div className="col-span-1">
          <div className="flex gap-1 justify-end">
            {isDraftMode && (
              <button
                onClick={handlePublish}
                className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-100 transition-all"
                title="Publish Course">
                <Upload className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleEdit}
              className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100 transition-all"
              title="Edit Course">
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 transition-all"
              title="Delete Course">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Card Row */}
      <div
        onClick={handleRowClick}
        className="lg:hidden flex flex-col p-4 border-b border-gray-100 hover:bg-orange-50 transition-colors cursor-pointer group space-y-3">
        <div className="flex items-start gap-4">
          {/* Thumbnail */}
          <img
            src={imageUrl}
            alt={courseTitle}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm flex-shrink-0"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";
            }}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-orange-600 transition-colors mb-1">
                {courseTitle}
              </h3>
              {/* Status Badge */}
              <span
                className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${
                  course.status === "Active" || course.status === "published"
                    ? "bg-green-100 text-green-700"
                    : course.status === "Draft" || course.status === "draft"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}>
                {course.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-1 mb-2">
              {course.category}
            </p>

            <div className="flex items-center gap-3">
              <span className="font-bold text-orange-600 text-base">
                {formattedPrice}
              </span>
              <div className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-0.5 rounded-md">
                <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                <span className="font-medium text-gray-700">{avgRating}</span>
                <span className="text-gray-400">({reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            {isDraftMode && (
              <button
                onClick={handlePublish}
                className="p-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-all flex items-center gap-1 text-xs font-medium"
                title="Publish">
                <Upload className="w-4 h-4" /> Publish
              </button>
            )}
            <button
              onClick={handleEdit}
              className="p-2 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all"
              title="Edit">
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-all"
              title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            View Details <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseListRow;
