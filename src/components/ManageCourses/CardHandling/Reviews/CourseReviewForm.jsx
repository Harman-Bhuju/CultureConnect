import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Star, X } from "lucide-react";

const CourseReviewForm = ({
  isOpen,
  onClose,
  course,
  reviewRating,
  setReviewRating,
  reviewText,
  setReviewText,
  isSubmitting,
  handleSubmitReview,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
          {/* Rating Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Overall Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setReviewRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none">
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || reviewRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {reviewRating > 0 && (
              <p className="text-sm font-medium text-blue-600">
                {reviewRating === 1 && "Poor"}
                {reviewRating === 2 && "Fair"}
                {reviewRating === 3 && "Good"}
                {reviewRating === 4 && "Very Good"}
                {reviewRating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <label
              htmlFor="review"
              className="block text-sm font-semibold text-gray-700">
              Review Comment
            </label>
            <textarea
              id="review"
              rows="5"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you like or dislike about this course? Share your learning experience..."
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <p>{reviewText.length} / 500 characters</p>
              {reviewText.length < 10 && reviewText.length > 0 && (
                <p className="text-red-500 font-medium">
                  Minimum 10 characters required
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition"
              disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                reviewRating === 0 ||
                reviewText.trim().length < 10
              }
              className="flex-[2] px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default CourseReviewForm;
