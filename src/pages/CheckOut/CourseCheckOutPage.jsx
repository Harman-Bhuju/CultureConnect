import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../Configs/ApiEndpoints";
import Loading from "../../components/Common/Loading";

// Import updated components
import CourseCheckout from "./CourseCheckout";
import CoursePaymentPage from "./CoursePaymentPage";
import CourseConfirmationPage from "./CourseConfirmationPage";

export default function CourseCheckOutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teacherId, courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const path = location.pathname;
  const currentStep = path.includes("payment")
    ? "payment"
    : path.includes("confirmation")
      ? "confirmation"
      : "checkout";

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API.GET_COURSE_DETAILS}?course_id=${courseId}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (data.status === "success" && data.course) {
        setCourse(data.course);
      } else {
        toast.error("Failed to load course details");
        navigate(`/courses/${teacherId}/${courseId}`);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Network error");
      navigate(`/courses/${teacherId}/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    navigate(`/course/checkout/payment/${teacherId}/${courseId}`);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    // Add your payment processing logic here
    // For now, we'll just simulate success
    try {
      // Example API call structure (uncomment and modify as needed):
      /*
      const response = await fetch(API.ENROLL_COURSE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          course_id: courseId,
          payment_method: selectedPayment,
        }),
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        toast.success("Payment successful! Redirecting...");
        navigate(`/course/checkout/confirmation/${teacherId}/${courseId}`);
      } else {
        toast.error(data.message || "Payment failed");
      }
      */

      // Temporary success simulation
      toast.success("Payment successful! Redirecting...");
      navigate(`/course/checkout/confirmation/${teacherId}/${courseId}`);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment processing failed. Please try again.");
    }
  };

  if (loading) return <Loading message="Preparing checkout..." />;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === "checkout" && (
        <CourseCheckout
          course={course}
          teacherId={teacherId}
          courseId={courseId}
          navigate={navigate}
          onProceed={handleProceedToPayment}
        />
      )}

      {currentStep === "payment" && (
        <CoursePaymentPage
          course={course}
          teacherId={teacherId}
          courseId={courseId}
          navigate={navigate}
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
          onConfirm={handleConfirmPayment}
        />
      )}

      {currentStep === "confirmation" && (
        <CourseConfirmationPage
          course={course}
          teacherId={teacherId}
          courseId={courseId}
          navigate={navigate}
          selectedPayment={selectedPayment}
        />
      )}
    </div>
  );
}
