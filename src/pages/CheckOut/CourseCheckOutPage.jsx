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
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const path = location.pathname;
  const currentStep = path.includes("payment")
    ? "payment"
    : path.includes("confirmation")
      ? "confirmation"
      : "checkout";

  useEffect(() => {
    fetchCourseDetails();
    if (currentStep === "payment" && !enrollmentId) {
      checkEnrollmentStatus();
    }
  }, [courseId, currentStep]);

  const checkEnrollmentStatus = async () => {
    try {
      const response = await fetch(
        `${API.CHECK_ENROLLMENT}?course_id=${courseId}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      if (data.has_pending_enrollment) {
        setEnrollmentId(data.enrollment.id);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

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

  const handleProceedToPayment = async () => {
    try {
      setCreatingOrder(true);

      // Create course order/enrollment
      const formData = new FormData();
      formData.append("teacher_id", teacherId);
      formData.append("course_id", courseId);

      const response = await fetch(API.CREATE_COURSE_ORDER, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setEnrollmentId(data.enrollment_id);
        navigate(`/course/checkout/payment/${teacherId}/${courseId}`);
      } else {
        toast.error(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to proceed to payment");
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    if (!enrollmentId) {
      toast.error("Order not found. Please go back and try again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("enrollment_id", enrollmentId);
      formData.append("payment_method", selectedPayment);
      formData.append("frontend_url", window.location.origin);

      const response = await fetch(API.CONFIRM_COURSE_PAYMENT, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("text/html")) {
        // eSewa payment - response is HTML form
        const html = await response.text();

        toast("Redirecting to eSewa payment gateway...");
        const formContainer = document.createElement("div");
        formContainer.style.display = "none";
        formContainer.innerHTML = html;
        document.body.appendChild(formContainer);

        setTimeout(() => {
          const form = formContainer.querySelector("form");
          if (form) {
            form.submit();
          } else {
            toast.error("Payment form error. Please try again.");
          }
        }, 100);

        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.success) {
          if (data.redirect_to_esewa === false) {
            toast.success("Payment successful! Redirecting...");
            navigate(`/course/checkout/confirmation/${teacherId}/${courseId}`);
          }
        } else {
          toast.error(data.error || "Payment failed");
        }
      }
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
          isLoading={creatingOrder}
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
          enrollmentId={enrollmentId}
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
