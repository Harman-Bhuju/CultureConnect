import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext";
import TeacherCourseDetailPage from "../../../ManageCourses/CardHandling/TeacherCourseDetailPage/TeacherCourseDetailPage";
import StudentCourseDetailPage from "../../../ManageCourses/CardHandling/StudentCourseDetailPage/StudentCourseDetailPage";
import CoursePlayerPage from "../../../ManageCourses/CardHandling/EnrolledStudentCourseDetailPage/CoursePlayerPage";
import API from "../../../../Configs/ApiEndpoints";

const CourseDetailRouter = () => {
  const { id: courseId, teacherId } = useParams();
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const isTeacher = user?.teacher_id && user.teacher_id == teacherId;

  useEffect(() => {
    if (user && !isTeacher) {
      checkEnrollmentStatus();
    } else {
      setLoading(false);
    }
  }, [courseId, user, isTeacher]);

  const checkEnrollmentStatus = async () => {
    try {
      const response = await fetch(
        `${API.CHECK_ENROLLMENT}?course_id=${courseId}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setIsEnrolled(data.is_enrolled);
    } catch (error) {
      console.error("Error checking enrollment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && user && !isTeacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isTeacher) {
    return <TeacherCourseDetailPage />;
  } else if (isEnrolled) {
    return <CoursePlayerPage />;
  } else {
    return <StudentCourseDetailPage />;
  }
};

export default CourseDetailRouter;
