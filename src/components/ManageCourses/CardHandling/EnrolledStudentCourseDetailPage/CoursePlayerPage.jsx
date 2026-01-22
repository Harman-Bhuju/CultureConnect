import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../../../Configs/ApiEndpoints";
import Loading from "../../../Common/Loading";

// Import components
import CoursePlayerHeader from "./CoursePlayerHeader";
import VideoPlayerSection from "./VideoPlayerSection";
import LessonTabsSection from "./LessonTabsSection";
import LessonNavigation from "./LessonNavigation";
import ProgressStatsCard from "./ProgressStatsCard";
import CurriculumSidebar from "./CurriculumSidebar";

export default function CoursePlayerPage() {
  const { teacherId, id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    checkEnrollment();
  }, [courseId]);

  useEffect(() => {
    if (isEnrolled) {
      fetchCourseData();
    }
  }, [courseId, isEnrolled]);

  const checkEnrollment = async () => {
    try {
      const response = await fetch(
        `${API.CHECK_ENROLLMENT}?course_id=${courseId}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (data.is_enrolled || data.isEnrolled) {
        setIsEnrolled(true);
      } else {
        toast.error("You are not enrolled in this course");
        navigate(`/courses/${teacherId}/${courseId}`);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
      toast.error("Failed to verify enrollment");
      navigate(`/courses/${teacherId}/${courseId}`);
    }
  };

  const fetchCourseData = async () => {
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
        // Transform course data
        const transformedCourse = {
          ...data.course,
          videos: (data.videos || []).map((video) => ({
            id: video.id,
            video_title: video.video_title,
            description: video.description || video.video_description || "",
            duration: video.duration,
            thumbnail: video.thumbnail,
            video_filename: video.video_filename,
            order_in_course: video.order_in_course || 0,
          })).sort((a, b) => a.order_in_course - b.order_in_course),
        };

        setCourse(transformedCourse);

        // Find first video to play
        if (transformedCourse.videos.length > 0) {
          setActiveVideo(transformedCourse.videos[0]);
        }
      } else {
        toast.error("Course access denied or not found");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load learning environment");
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoCompletion = (videoId) => {
    setCompletedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId],
    );
  };

  const calculateProgress = () => {
    if (!course || !course.total_videos) return 0;
    const progress = (completedVideos.length / course.total_videos) * 100;
    return Math.round(progress);
  };

  const handleVideoSelect = (video) => {
    setActiveVideo(video);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousLesson = () => {
    const currentVideos = course.videos || [];
    const currentIndex = currentVideos.findIndex(
      (v) => v.id === activeVideo?.id,
    );
    if (currentIndex > 0) {
      setActiveVideo(currentVideos[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextLesson = () => {
    const currentVideos = course.videos || [];
    const currentIndex = currentVideos.findIndex(
      (v) => v.id === activeVideo?.id,
    );
    if (currentIndex < currentVideos.length - 1) {
      setActiveVideo(currentVideos[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading || !isEnrolled) return <Loading message="Entering classroom..." />;
  if (!course) return null;

  const currentVideos = course.videos || [];
  const currentIndex = currentVideos.findIndex((v) => v.id === activeVideo?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      <CoursePlayerHeader
        course={course}
        teacherId={teacherId}
        courseId={courseId}
        progress={calculateProgress()}
        completedVideos={completedVideos.length}
        totalVideos={course.total_videos}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video & Tabs (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayerSection
              activeVideo={activeVideo}
              course={course}
              completedVideos={completedVideos}
              toggleVideoCompletion={toggleVideoCompletion}
              currentIndex={currentIndex}
              totalVideos={currentVideos.length}
            />

            {/* Lesson Tabs */}
            <LessonTabsSection
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeVideo={activeVideo}
            />

            {/* Lesson Navigation */}
            <LessonNavigation
              currentIndex={currentIndex}
              totalVideos={currentVideos.length}
              onPrevious={handlePreviousLesson}
              onNext={handleNextLesson}
            />
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Stats */}
            <ProgressStatsCard
              progress={calculateProgress()}
              completedVideos={completedVideos.length}
              totalVideos={course.total_videos}
            />

            {/* Course Curriculum */}
            <div className="lg:sticky lg:top-24">
              <CurriculumSidebar
                videos={currentVideos}
                activeVideo={activeVideo}
                completedVideos={completedVideos}
                onVideoSelect={handleVideoSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
