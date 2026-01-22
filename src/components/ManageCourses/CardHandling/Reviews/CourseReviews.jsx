import React from "react";
import {
  Star,
  StarHalf,
  MessageCircle,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import API from "../../../../Configs/ApiEndpoints";

const CourseReviews = ({
  course,
  user,
  openReviewForm,
  openDeleteModal,
  teacherId,
}) => {
  const reviews = course?.reviews || [];

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating;
      const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;
      if (isHalf) {
        stars.push(
          <StarHalf
            key={i}
            className="w-5 h-5 fill-yellow-400 text-yellow-400"
          />,
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={`w-5 h-5 ${filled ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
          />,
        );
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-5xl font-black text-gray-900 leading-none">
              {course.averageRating?.toFixed(1) || "0.0"}
            </span>
            <div className="flex justify-center mt-2">
              {renderStars(course.averageRating)}
            </div>
          </div>
          <div className="h-12 w-px bg-gray-100 hidden md:block" />
          <div>
            <p className="text-lg font-bold text-gray-900">
              {course.totalReviews || 0} Reviews
            </p>
            <p className="text-sm text-gray-500">Average student rating</p>
          </div>
        </div>

        {/* Show Write Review button if enrolled and hasn't reviewed yet */}
        {user &&
          course.isEnrolled &&
          !reviews.some((r) => r.userId === user.id) && (
            <button
              onClick={() => openReviewForm()}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              Write a Review
            </button>
          )}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => {
            const isMyReview = user && review.userId === user.id;
            const avatarUrl = review.userImage
              ? review.userImage.startsWith("http")
                ? review.userImage
                : `${API.BASE_URL}/uploads/${review.userImage}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author || "User")}&background=random`;

            return (
              <div
                key={review.id}
                className={`group p-6 rounded-2xl transition-all duration-300 ${
                  isMyReview
                    ? "bg-blue-50/50 border-2 border-blue-100 ring-4 ring-blue-50/20"
                    : "bg-white border border-gray-50 shadow-sm"
                }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={avatarUrl}
                      alt={review.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">
                          {review.author}
                        </h4>
                        {isMyReview && (
                          <span className="px-2 py-0.5 bg-blue-600 text-[10px] text-white font-extra-bold uppercase tracking-wider rounded-full">
                            Your Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-medium">
                        {formatDate(review.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    {isMyReview && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openReviewForm(review)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Edit review">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(review.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Delete review">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pl-16">
                  <p className="text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Teacher Replies */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {review.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-white">
                              {reply.teacherImage ? (
                                <img
                                  src={`${API.TEACHER_PROFILE_PICTURES}/${reply.teacherImage}`}
                                  alt={reply.teacherName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-gray-900">
                                  {reply.teacherName}
                                </span>
                                <span className="px-1.5 py-0.5 bg-blue-100 text-[10px] text-blue-700 font-bold uppercase rounded">
                                  Teacher
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 font-medium">
                                {formatDate(reply.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 pl-11">
                            {reply.replyText}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No reviews yet</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-1">
            Be the first to share your learning experience with others!
          </p>
          {user && course.isEnrolled && (
            <button
              onClick={() => openReviewForm()}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
              Write the First Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseReviews;
