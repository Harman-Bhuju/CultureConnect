import { useState, useEffect } from "react";
import API from "../Configs/ApiEndpoints";

const useTeacherCourses = (teacherId) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    averageRating: 0,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API.GET_TEACHER_COURSES}${teacherId ? `?teacher_id=${teacherId}` : ""}`,
          { credentials: "include" }
        );

        const data = await response.json();

        if (data.success) {
          setCourses(data.courses || []);
          setStats(data.stats || {
            totalCourses: 0,
            activeCourses: 0,
            totalStudents: 0,
            averageRating: 0,
          });
        } else {
          console.warn("Courses fetch failed:", data.error);
          setError(data.error || "Failed to fetch courses");
        }
      } catch (err) {
        console.error("Courses fetch error:", err);
        setError(err.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [teacherId]);

  return { courses, stats, loading, error, setCourses };
};

export default useTeacherCourses;
