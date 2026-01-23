import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Star,
  StarHalf,
  MessageCircle,
  User,
  Edit,
  Trash2,
  Reply,
  Send,
  X,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../../../Configs/ApiEndpoints";

const CourseReviews = ({
  course,
  user,
  teacherId,
  openReviewForm: parentOpenReviewForm,
  openDeleteModal: parentOpenDeleteModal,
  onRefresh,
}) => {
  const reviews = course?.reviews || [];

  // Teacher Reply states
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyId, setReplyId] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(false);

  // Student Review Edit states (In-place)
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isUpdatingReview, setIsUpdatingReview] = useState(false);

  // Deletion states
  const [itemToDelete, setItemToDelete] = useState(null); // { id, type: 'review' | 'reply' }
  const [isDeleting, setIsDeleting] = useState(false);

  const isTeacher =
    user?.teacher_id &&
    teacherId &&
    parseInt(user.teacher_id) === parseInt(teacherId);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;

    try {
      setSubmittingReply(true);
      const response = await fetch(API.TEACHER_REPLY_COURSE_REVIEW, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          review_id: reviewId,
          reply_text: replyText,
          reply_id: replyId,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success(replyId ? "Reply updated" : "Reply posted successfully");
        setReplyingTo(null);
        setReplyText("");
        setReplyId(null);
        handleRefresh();
      } else {
        toast.error(data.message || "Failed to post reply");
      }
    } catch (error) {
      console.error("Reply error:", error);
      toast.error("Failed to post reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleUpdateReview = async (reviewId) => {
    if (editRating === 0 || editText.trim().length < 10) {
      toast.error("Please provide a rating and a comment (min 10 chars)");
      return;
    }

    try {
      setIsUpdatingReview(true);
      const formData = new FormData();
      formData.append("course_id", course.id);
      formData.append("rating", editRating);
      formData.append("comment", editText.trim());
      formData.append("review_id", reviewId);

      const response = await fetch(API.SUBMIT_COURSE_REVIEW, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Review updated!");
        setEditingReviewId(null);
        handleRefresh();
      } else {
        toast.error(data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Review update error:", error);
      toast.error("An error occurred");
    } finally {
      setIsUpdatingReview(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      if (itemToDelete.type === "review") {
        const response = await fetch(API.DELETE_COURSE_REVIEW, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ review_id: itemToDelete.id }),
        });
        const data = await response.json();
        if (data.status === "success") {
          toast.success("Review deleted");
          handleRefresh();
        } else {
          toast.error(data.message || "Failed to delete review");
        }
      } else {
        const response = await fetch(API.TEACHER_DELETE_COURSE_REPLY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reply_id: itemToDelete.id }),
        });
        const data = await response.json();
        if (data.status === "success") {
          toast.success("Reply deleted");
          handleRefresh();
        } else {
          toast.error("Failed to delete reply");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Error during deletion");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const renderStars = (rating = 0, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setEditRating(i)}
            className="transition-transform hover:scale-110 focus:outline-none">
            <Star
              className={`w-6 h-6 ${i <= (hoverRating || editRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
            />
          </button>,
        );
      } else {
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
              onClick={() =>
                parentOpenReviewForm ? parentOpenReviewForm() : null
              }
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
            const isEditing = editingReviewId === review.id;
            const isReplying = replyingTo === review.id;

            const myReply = review.replies?.find(
              (r) => r.teacherId === parseInt(teacherId),
            );

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
                  {!isEditing && (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>

                      {/* Actions: Edit/Delete for User, Reply for Teacher */}
                      <div className="flex gap-2">
                        {isMyReview && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingReviewId(review.id);
                                setEditText(review.comment);
                                setEditRating(review.rating);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                              title="Edit review">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setItemToDelete({
                                  id: review.id,
                                  type: "review",
                                })
                              }
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
                              title="Delete review">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {isTeacher &&
                          !isReplying &&
                          (myReply ? (
                            <button
                              onClick={() => {
                                setReplyingTo(review.id);
                                setReplyText(myReply.replyText);
                                setReplyId(myReply.id);
                              }}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex items-center gap-1">
                              <Edit className="w-4 h-4" />
                              <span className="text-xs font-semibold">
                                Edit Reply
                              </span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setReplyingTo(review.id);
                                setReplyText("");
                                setReplyId(null);
                              }}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex items-center gap-1">
                              <Reply className="w-4 h-4" />
                              <span className="text-xs font-semibold">
                                Reply
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pl-16">
                  {isEditing ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Rating:
                        </span>
                        <div className="flex">{renderStars(0, true)}</div>
                      </div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all text-gray-700"
                        rows="4"
                        placeholder="Edit your review..."
                        autoFocus
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditingReviewId(null)}
                          className="px-5 py-2 text-gray-500 font-bold hover:text-gray-700 transition"
                          disabled={isUpdatingReview}>
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateReview(review.id)}
                          disabled={
                            isUpdatingReview || editText.trim().length < 10
                          }
                          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100">
                          {isUpdatingReview ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-600 leading-relaxed">
                        {review.comment}
                      </p>

                      {/* Reply Input (New or Edit) */}
                      {isReplying && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full p-3 border-2 border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all text-sm text-gray-700"
                            rows="3"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyId(null);
                                setReplyText("");
                              }}
                              className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium">
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReplySubmit(review.id)}
                              disabled={submittingReply || !replyText.trim()}
                              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-100 flex items-center gap-2">
                              {submittingReply ? (
                                "Saving..."
                              ) : (
                                <>
                                  <Send className="w-3 h-3" />{" "}
                                  {replyId ? "Update Reply" : "Post Reply"}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Teacher Replies */}
                      {review.replies && review.replies.length > 0 && (
                        <div className="mt-6 space-y-4">
                          {review.replies.map((reply) => {
                            const isEditingThisReply =
                              isReplying && reply.id === replyId;

                            // If we are editing this specific reply, don't show the static version
                            if (isEditingThisReply) return null;

                            return (
                              <div
                                key={reply.id}
                                className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative group/reply">
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

                                  {isTeacher && (
                                    <button
                                      onClick={() =>
                                        setItemToDelete({
                                          id: reply.id,
                                          type: "reply",
                                        })
                                      }
                                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 pl-11">
                                  {reply.replyText}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
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
            Student reviews will appear here. No reviews have been submitted
            yet.
          </p>
          {user && course.isEnrolled && (
            <button
              onClick={() =>
                parentOpenReviewForm ? parentOpenReviewForm() : null
              }
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
              Write the First Review
            </button>
          )}
        </div>
      )}

      {/* Local Delete Confirmation Modal (Portaled) */}
      {itemToDelete &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in duration-200 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Delete {itemToDelete.type === "review" ? "Review" : "Reply"}
                  </h2>
                </div>
                <button
                  onClick={() => setItemToDelete(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-900 leading-relaxed font-medium">
                    {itemToDelete.type === "review"
                      ? "Are you sure you want to delete your review? This will also delete any teacher replies to this review. This action cannot be undone."
                      : "Are you sure you want to delete this reply? This action cannot be undone."}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition"
                  disabled={isDeleting}>
                  Go Back
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-100"
                  disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default CourseReviews;
