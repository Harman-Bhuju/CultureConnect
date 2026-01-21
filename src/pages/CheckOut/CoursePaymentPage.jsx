import React from "react";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import API from "../../Configs/ApiEndpoints";

export default function CoursePaymentPage({
  course,
  teacherId,
  courseId,
  navigate,
  selectedPayment,
  setSelectedPayment,
  onConfirm,
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-0">
          {/* Left Section - Payment Options */}
          <div className="col-span-2 p-8 border-r border-gray-200">
            <ArrowLeft
              className="text-black mb-6 cursor-pointer hover:text-gray-700"
              size={24}
              onClick={() =>
                navigate(`/course/checkout/${teacherId}/${courseId}`)
              }
            />
            <h1 className="text-3xl font-bold text-black mb-8">
              Payment Method
            </h1>

            <div className="space-y-4">
              {/* eSewa */}
              <button
                onClick={() => setSelectedPayment("esewa")}
                className={`w-full p-6 rounded-lg border-2 transition-all ${
                  selectedPayment === "esewa"
                    ? "border-black bg-gray-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">eSewa</span>
                    </div>
                    <div className="text-left">
                      <span className="text-black font-semibold text-lg block">
                        eSewa
                      </span>
                      <span className="text-gray-600 text-sm">
                        Pay securely with eSewa wallet
                      </span>
                    </div>
                  </div>
                  {selectedPayment === "esewa" && (
                    <Check className="text-black" size={28} />
                  )}
                </div>
              </button>
            </div>

            {/* Important Note */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> Your enrollment
                request will be processed immediately after payment
                confirmation.
              </p>
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="bg-gray-50 p-8">
            <h2 className="text-xl font-semibold text-black mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {/* Course Info */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
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
                    <p className="font-medium text-sm line-clamp-2">
                      {course.course_title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {course.total_videos} Lessons
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-black">
                  <span className="text-gray-700">Course Price</span>
                  <span className="font-medium">Rs. {course.price}</span>
                </div>

                <div className="flex items-center justify-between text-black">
                  <span className="text-gray-700">Platform Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-black">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-lg font-bold">
                      Rs. {course.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onConfirm}
              disabled={!selectedPayment}
              className={`w-full font-semibold py-4 rounded-lg transition-colors mb-3 ${
                selectedPayment
                  ? "bg-black hover:bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}>
              {selectedPayment
                ? `Confirm & Pay Rs. ${course.price}`
                : "Select Payment Method"}
            </button>

            <button
              onClick={() =>
                navigate(`/course/checkout/${teacherId}/${courseId}`)
              }
              className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-black py-3 rounded-lg transition-colors font-medium">
              Back to Checkout
            </button>

            <p className="text-xs text-gray-600 text-center mt-3">
              Secure payment processing guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
