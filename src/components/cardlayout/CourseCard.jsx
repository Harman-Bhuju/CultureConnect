import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { BASE_URL } from "../../Configs/ApiEndpoints";
import { useAuth } from "../../context/AuthContext";

const CourseCard = ({ course }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle various ID formats from API or mocks
  const instructorId =
    course.teacherId ||
    course.teacher_id ||
    course.instructorId ||
    course.instructor_id;
  const courseId = course.id || course.courseId || course.course_id;

  const courseLink = `/courses/${instructorId}/${courseId}`;

  // Flexible image handling
  const getFirstImage = () => {
    if (course.images?.length > 0) {
      return Array.isArray(course.images) ? course.images[0] : course.images;
    }
    return course.image || course.image_url || course.imageUrl || null;
  };

  const rawImage = getFirstImage();
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BASE_URL}/uploads/course_images/${rawImage}`
    : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";

  // Course title fallback
  const courseTitle =
    course.courseName ||
    course.name ||
    course.title ||
    course.course_name ||
    "Complete Web Design: from Figma to Webflow";

  // Instructor name fallback
  const instructorName =
    course.instructor ||
    course.instructorName ||
    course.instructor_name ||
    "Vako Shvili";

  // Description fallback
  const description =
    course.description ||
    "3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.";

  // Price formatting
  const price = (() => {
    const p = course.price;
    if (typeof p === "number") return `${p.toLocaleString()}€`;
    if (typeof p === "string") return p.includes("€") ? p : `${p}€`;
    return "14,99€";
  })();

  // Rating normalization
  const rating = course.averageRating ?? course.rating ?? 4.7;
  const students =
    course.totalStudents ?? course.students ?? course.studentCount ?? "16,741";

  const handleCardClick = () => {
    // Validate required IDs before navigation
    if (!courseId || !instructorId) {
      console.error("Missing required IDs for navigation:", {
        courseId,
        instructorId,
        course,
      });
      return;
    }

    const currentLocation = location.pathname + (location.search || "");
    console.log("Navigating to:", courseLink);
    navigate(courseLink, { state: { from: currentLocation } });
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 h-full flex flex-col group shadow-sm cursor-pointer"
      onClick={handleCardClick}>
      {/* Course Image */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";
          }}
        />
      </div>

      {/* Course Content */}
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-gray-900 text-base font-semibold leading-snug line-clamp-1">
          {courseTitle}
        </h3>

        {/* Instructor */}
        <p className="text-gray-500 text-sm font-medium">{instructorName}</p>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-1 flex-1">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-gray-900 text-sm font-bold">{rating}</span>
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
          <span className="text-gray-400 text-sm">({students})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-gray-900 text-xl font-bold">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
