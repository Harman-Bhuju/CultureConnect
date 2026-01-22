import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag, Save, Eye, Info, Loader2, Edit } from "lucide-react";
import VideoDetailEdit from "./VideoDetailEdit";
import CourseEditHeader from "./CourseEditHeader";
import MediaEditSection from "./MediaEditSection";
import BasicInfoForm from "./BasicInfoForm";
import AdditionalInfoForm from "./AdditionalInfoForm";
import PublishCourseModal from "../../Modals/PublishCourseModal";
import EditCourseConfirmationModal from "../../Modals/EditCourseConfirmationModal";
import toast from "react-hot-toast";
import API from "../../../../Configs/ApiEndpoints";

// Helper function to get video duration
function getVideoDuration(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(Math.floor(video.duration));
    };
    video.onerror = () => {
      resolve(0); // Return 0 if can't read duration
    };
    video.src = URL.createObjectURL(file);
  });
}

// Helper to format duration (seconds to HH:MM:SS or MM:SS)
function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "0:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Helper to convert seconds to hours and minutes
function secondsToHoursMinutes(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes };
}

// Main Course Edit Component
export default function TeacherCourseEditPage() {
  const { id: courseId, teacherId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [deletedVideoIds, setDeletedVideoIds] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const draggedIndexRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoDetailOpen, setVideoDetailOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [currentEditingVideo, setCurrentEditingVideo] = useState(null);
  const [courseThumbnailFile, setCourseThumbnailFile] = useState(null);
  const [courseThumbnailUrl, setCourseThumbnailUrl] = useState(null);
  const [submissionType, setSubmissionType] = useState(null);
  const [courseStatus, setCourseStatus] = useState(null); // 'published' or 'draft'
  const [editConfirmationModalOpen, setEditConfirmationModalOpen] = useState(false);
  const [confirmationActionType, setConfirmationActionType] = useState("saveAsDraft"); // 'saveAsDraft' or 'editCourse'
  const [originalFormData, setOriginalFormData] = useState(null);
  const [originalVideos, setOriginalVideos] = useState([]);
  const [originalThumbnailUrl, setOriginalThumbnailUrl] = useState(null);

  const [formData, setFormData] = useState({
    courseTitle: "",
    category: "",
    skillLevel: "",
    price: "",
    recommendedWeeks: "",
    hoursPerWeek: "",
    hoursPerWeek: "",
    description: "",
    tags: [],
    whatYouWillLearn: "",
    requirements: "",
    learningSchedule: "",
    language: "English",
  });

  const [tagInput, setTagInput] = useState("");

  // Calculate total video duration
  const getTotalVideoDuration = () => {
    return videos.reduce((total, vid) => total + (vid.duration || 0), 0);
  };

  const totalDurationSeconds = getTotalVideoDuration();
  const { hours: totalHours, minutes: totalMinutes } =
    secondsToHoursMinutes(totalDurationSeconds);

  // Check if form has been modified
  const hasFormChanged = useCallback(() => {
    if (!originalFormData) return false;

    // Check form data changes
    const formChanged = JSON.stringify(formData) !== JSON.stringify(originalFormData);

    // Check videos changes (count, order, or content)
    const videosChanged =
      videos.length !== originalVideos.length ||
      videos.some((vid, idx) => {
        const orig = originalVideos[idx];
        if (!orig) return true;
        return (
          vid.title !== orig.title ||
          vid.description !== orig.description ||
          vid.dbId !== orig.dbId ||
          vid.duration !== orig.duration
        );
      }) ||
      deletedVideoIds.length > 0;

    // Check thumbnail changes
    const thumbnailChanged =
      (courseThumbnailFile !== null) ||
      (courseThumbnailUrl !== originalThumbnailUrl && courseThumbnailUrl !== null);

    return formChanged || videosChanged || thumbnailChanged;
  }, [formData, originalFormData, videos, originalVideos, deletedVideoIds, courseThumbnailFile, courseThumbnailUrl, originalThumbnailUrl]);

  // Fetch existing course data on mount
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        toast.error("Course ID is required");
        navigate(-1);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${API.GET_COURSE_DETAILS}?course_id=${courseId}`,
          { credentials: "include" }
        );
        const data = await response.json();

        if (data.status === "success") {
          setCourseData(data.course);
          setCourseStatus(data.course.status || "draft"); // Store course status

          // Populate form with existing data
          const initialFormData = {
            courseTitle: data.course.course_title || "",
            category: data.course.category || "",
            skillLevel: data.course.skill_level?.toLowerCase() || "",
            price: data.course.price || "",
            recommendedWeeks: data.course.duration_weeks || "",
            hoursPerWeek: data.course.hours_per_week || "",
            description: data.course.description || "",
            tags: data.course.tags || [],
            whatYouWillLearn: data.course.what_you_will_learn || "",
            requirements: data.course.requirements || "",
            learningSchedule: data.course.learning_schedule || "",
            language: data.course.language || "English",
          };
          setFormData(initialFormData);
          setOriginalFormData(JSON.parse(JSON.stringify(initialFormData))); // Deep copy for comparison

          // Set thumbnail URL if exists
          const thumbnailUrl = data.course.thumbnail
            ? `${API.COURSE_THUMBNAILS}/${data.course.thumbnail}`
            : null;
          if (thumbnailUrl) {
            setCourseThumbnailUrl(thumbnailUrl);
            setOriginalThumbnailUrl(thumbnailUrl);
          }

          // Transform video data
          if (data.videos && data.videos.length > 0) {
            const transformedVideos = data.videos.map((vid) => ({
              id: vid.id,
              dbId: vid.id, // Keep track of database ID for updates
              title: vid.video_title,
              description: vid.description || "",
              duration: parseDurationToSeconds(vid.duration),
              durationFormatted: vid.duration,
              thumbnail: vid.thumbnail,
              thumbnailUrl: vid.thumbnail
                ? `${API.COURSE_THUMBNAILS}/${vid.thumbnail}`
                : null,
              video_filename: vid.video_filename,
              url: vid.video_filename
                ? `${API.COURSE_VIDEOS}/${vid.video_filename}`
                : null,
              isExisting: true, // Mark as existing video
            }));
            setVideos(transformedVideos);
            setOriginalVideos(JSON.parse(JSON.stringify(transformedVideos))); // Deep copy for comparison
          }
        } else {
          toast.error(data.message || "Failed to load course");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error loading course:", error);
        toast.error("Failed to load course data");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, navigate]);

  // Helper to parse duration string to seconds
  function parseDurationToSeconds(durationStr) {
    if (!durationStr) return 0;
    const parts = durationStr.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 0;
  }

  // Cleanup effect
  useEffect(() => {
    return () => {
      videos.forEach((vid) => {
        if (vid.url && !vid.isExisting) URL.revokeObjectURL(vid.url);
      });
      if (courseThumbnailUrl && courseThumbnailFile) URL.revokeObjectURL(courseThumbnailUrl);
    };
  }, []);

  useEffect(() => {
    if (selectedVideo > videos.length - 1 && videos.length > 0) {
      setSelectedVideo(videos.length - 1);
    } else if (videos.length === 0) {
      setSelectedVideo(0);
    }
  }, [videos.length, selectedVideo]);

  const handleVideoUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);

    try {
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("video/")) {
          toast.error(`${file.name} is not a video file`);
          return false;
        }
        if (file.size > 500 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 500MB)`);
          return false;
        }
        return true;
      });

      if (!validFiles.length) {
        setIsUploading(false);
        return;
      }

      const newVideos = await Promise.all(
        validFiles.map(async (file) => {
          const duration = await getVideoDuration(file);
          return {
            id: `${Date.now()}-${Math.random()}`,
            url: URL.createObjectURL(file),
            file,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            duration: duration,
            durationFormatted: formatDuration(duration),
            title: file.name.replace(/\.[^/.]+$/, ""),
            description: "",
          };
        }),
      );

      setVideos((prev) => {
        const total = [...prev, ...newVideos];
        if (total.length > 20) {
          toast.error("Maximum 20 videos allowed");
          total.slice(20).forEach((vid) => {
            if (vid.url) URL.revokeObjectURL(vid.url);
          });
          return total.slice(0, 20);
        }
        return total;
      });

      setErrors((prev) => {
        if (prev.videos) {
          const { videos: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error uploading videos:", error);
      toast.error("Failed to process videos");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }, []);

  const removeVideo = useCallback((id) => {
    setVideos((prev) => {
      const removedIndex = prev.findIndex((v) => v.id === id);
      const vid = prev[removedIndex];

      // Track deleted video IDs for existing videos
      if (vid && vid.dbId) {
        setDeletedVideoIds((prevDeleted) => [...prevDeleted, vid.dbId]);
      }

      if (vid && vid.url && !vid.isExisting) URL.revokeObjectURL(vid.url);

      const newVideos = prev.filter((v) => v.id !== id);

      setSelectedVideo((current) => {
        if (removedIndex === current && current >= newVideos.length) {
          return Math.max(0, newVideos.length - 1);
        } else if (removedIndex < current) {
          return current - 1;
        }
        return current;
      });

      return newVideos;
    });
  }, []);

  const handleDragStart = useCallback((index) => {
    draggedIndexRef.current = index;
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((dropIndex) => {
    const dragIndex = draggedIndexRef.current;
    if (dragIndex === null || dragIndex === dropIndex) return;

    setVideos((prev) => {
      const newVids = [...prev];
      const [moved] = newVids.splice(dragIndex, 1);
      newVids.splice(dropIndex, 0, moved);

      setSelectedVideo((current) => {
        if (current === dragIndex) return dropIndex;
        if (current === dropIndex)
          return dragIndex < dropIndex ? current + 1 : current - 1;
        if (dragIndex < current && dropIndex >= current) return current - 1;
        if (dragIndex > current && dropIndex <= current) return current + 1;
        return current;
      });

      return newVids;
    });

    draggedIndexRef.current = null;
    setIsDragging(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    draggedIndexRef.current = null;
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const commitTag = useCallback((value) => {
    const tag = value.trim();
    if (!tag) return;

    if (tag.length > 50) {
      setErrors((prev) => ({
        ...prev,
        tags: "Tag must be less than 50 characters",
      }));
      return;
    }

    setFormData((prev) => {
      if (prev.tags.includes(tag)) {
        setErrors((prevErr) => ({ ...prevErr, tags: "Tag already exists" }));
        return prev;
      }

      if (prev.tags.length >= 10) {
        setErrors((prevErr) => ({
          ...prevErr,
          tags: "Maximum 10 tags allowed",
        }));
        return prev;
      }

      setErrors((prevErr) => {
        const { tags: _, ...rest } = prevErr;
        return rest;
      });

      return { ...prev, tags: [...prev.tags, tag] };
    });

    setTagInput("");
  }, []);

  const handleTagKeyDown = useCallback(
    (e) => {
      if (e.key === " " || e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        commitTag(tagInput);
      } else if (e.key === "Backspace" && !tagInput && formData.tags.length) {
        e.preventDefault();
        setFormData((prev) => ({ ...prev, tags: prev.tags.slice(0, -1) }));
      }
    },
    [tagInput, formData.tags, commitTag],
  );

  const handleTagBlur = useCallback(() => {
    if (tagInput.trim()) {
      commitTag(tagInput);
    }
  }, [tagInput, commitTag]);

  const removeTag = useCallback((tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const handleCourseThumbnailChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file for course thumbnail");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Course thumbnail must be under 5MB");
        return;
      }

      if (courseThumbnailUrl) {
        URL.revokeObjectURL(courseThumbnailUrl);
      }

      const url = URL.createObjectURL(file);
      setCourseThumbnailFile(file);
      setCourseThumbnailUrl(url);
      setErrors((prev) => {
        const { courseThumbnail, ...rest } = prev;
        return rest;
      });
      e.target.value = "";
    },
    [courseThumbnailUrl],
  );

  const removeCourseThumbnail = useCallback(() => {
    if (courseThumbnailUrl) {
      URL.revokeObjectURL(courseThumbnailUrl);
    }
    setCourseThumbnailFile(null);
    setCourseThumbnailUrl(null);
  }, [courseThumbnailUrl]);

  const validateForPublish = useCallback(() => {
    const newErrors = {};

    if (!videos.length) {
      newErrors.videos = "Please upload at least one course video.";
    }

    const videosWithoutTitle = videos.filter((v) => !v.title?.trim());
    const videosWithoutDescription = videos.filter(
      (v) => !v.description?.trim(),
    );
    const videosWithoutThumbnail = videos.filter(
      (v) => !(v.thumbnailUrl || v.thumbnailFile || v.thumbnail),
    );

    if (videosWithoutTitle.length > 0) {
      newErrors.videos = `${videosWithoutTitle.length} video(s) missing title.`;
    } else if (videosWithoutDescription.length > 0) {
      newErrors.videos = `${videosWithoutDescription.length} video(s) missing description.`;
    } else if (videosWithoutThumbnail.length > 0) {
      newErrors.videos = `${videosWithoutThumbnail.length} video(s) missing thumbnail.`;
    }

    const titleTrimmed = formData.courseTitle.trim();
    if (!titleTrimmed) {
      newErrors.courseTitle = "Course title is required.";
    } else if (titleTrimmed.length < 3) {
      newErrors.courseTitle = "Course title must be at least 3 characters.";
    } else if (titleTrimmed.length > 255) {
      newErrors.courseTitle = "Course title must not exceed 255 characters.";
    }

    if (!formData.category) {
      newErrors.category = "Select a category.";
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = "Select a skill level.";
    }

    if (formData.price) {
      const priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.price = "Enter a valid price (0 or greater).";
      } else if (priceNum > 999999999) {
        newErrors.price = "Price must not exceed 999,999,999.";
      }
    }

    if (!formData.recommendedWeeks) {
      newErrors.recommendedWeeks = "Required.";
    } else {
      const weeks = Number(formData.recommendedWeeks);
      if (isNaN(weeks) || weeks < 1) {
        newErrors.recommendedWeeks = "Min 1 week.";
      } else if (weeks > 52) {
        newErrors.recommendedWeeks = "Max 52 weeks.";
      }
    }

    if (!formData.hoursPerWeek) {
      newErrors.hoursPerWeek = "Required.";
    } else {
      const hours = Number(formData.hoursPerWeek);
      if (isNaN(hours) || hours < 1) {
        newErrors.hoursPerWeek = "Min 1 hour.";
      } else if (hours > 40) {
        newErrors.hoursPerWeek = "Max 40 hours.";
      }
    }

    const descTrimmed = formData.description.trim();
    if (!descTrimmed) {
      newErrors.description = "Description is required.";
    } else if (descTrimmed.length < 20) {
      newErrors.description = "Min 20 characters.";
    }

    if (!formData.whatYouWillLearn?.trim()) {
      newErrors.whatYouWillLearn = "Required.";
    }

    if (!formData.requirements?.trim()) {
      newErrors.requirements = "Required.";
    }

    if (!formData.learningSchedule?.trim()) {
      newErrors.learningSchedule = "Required.";
    }

    if (!(courseThumbnailFile || courseThumbnailUrl)) {
      newErrors.courseThumbnail = "Course thumbnail is required.";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "Add at least one tag.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [videos, formData, courseThumbnailFile, courseThumbnailUrl]);

  const validateForDraft = useCallback(() => {
    const newErrors = {};

    // Draft Requirements: Title + 1 Video + Logic validity
    if (!videos.length) {
      newErrors.videos = "Upload at least one video for draft.";
    }

    if (!formData.courseTitle.trim()) {
      newErrors.courseTitle = "Course title is required.";
    }

    // Logic checks (fields not required, but if present must be valid)
    if (formData.price) {
      const priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.price = "Invalid price.";
      }
    }

    if (formData.recommendedWeeks) {
      const weeks = Number(formData.recommendedWeeks);
      if (isNaN(weeks) || weeks < 1 || weeks > 52) {
        newErrors.recommendedWeeks = "Invalid weeks (1-52).";
      }
    }

    if (formData.hoursPerWeek) {
      const hours = Number(formData.hoursPerWeek);
      if (isNaN(hours) || hours < 1 || hours > 40) {
        newErrors.hoursPerWeek = "Invalid hours (1-40).";
      }
    }

    if (formData.description && formData.description.length > 5000) {
      newErrors.description = "Description too long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [videos, formData]);

  const handlePublishClick = useCallback(() => {
    if (!validateForPublish()) {
      const errorCount = Object.keys(errors).length || "multiple";
      toast.error(`Please fix ${errorCount} validation errors`);
      // Optionally verify if we need to switch tabs to show errors
      const basicInfoErrors = [
        "courseTitle",
        "category",
        "skillLevel",
        "price",
        "recommendedWeeks",
        "hoursPerWeek",
        "description",
        "tags",
      ];
      const hasBasicErrors = basicInfoErrors.some((key) => errors[key]);
      if (hasBasicErrors && activeTab !== "basic") {
        setActiveTab("basic");
      }
      return;
    }
    setPublishModalOpen(true);
  }, [validateForPublish, errors, activeTab]);

  const confirmPublish = useCallback(async () => {
    if (isSubmitting) return;
    setPublishModalOpen(false);

    setIsSubmitting(true);
    setSubmissionType("publish");
    const toastId = toast.loading("Publishing course...");

    try {
      const fd = new FormData();
      fd.append("course_id", courseId);
      fd.append("courseTitle", formData.courseTitle);
      fd.append("category", formData.category);
      fd.append("skillLevel", formData.skillLevel);
      fd.append("price", formData.price || 0);
      fd.append("durationWeeks", formData.recommendedWeeks);
      fd.append("hoursPerWeek", formData.hoursPerWeek || "");
      fd.append("accessDuration", formData.accessDuration || "lifetime");
      fd.append("description", formData.description);
      fd.append("whatYouWillLearn", formData.whatYouWillLearn);
      fd.append("requirements", formData.requirements);
      fd.append("learningSchedule", formData.learningSchedule || "");
      fd.append("language", formData.language || "English");
      fd.append("status", "published");
      fd.append("tags", JSON.stringify(formData.tags));
      fd.append("deleted_video_ids", JSON.stringify(deletedVideoIds));

      if (courseThumbnailFile) {
        fd.append("course_thumbnail", courseThumbnailFile);
      }

      // Send existing video IDs and updated metadata
      videos.forEach((vid, idx) => {
        if (vid.dbId) fd.append("video_ids[]", vid.dbId);
        fd.append("video_titles[]", vid.title || "");
        fd.append("video_descriptions[]", vid.description || "");
        fd.append("video_durations[]", vid.duration || 0);
      });

      const response = await fetch(API.UPDATE_COURSE, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Course published successfully!", { id: toastId });
        navigate(`/teacher/manageclasses/${teacherId}`);
      } else {
        throw new Error(data.message || "Failed to publish course");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to publish course", { id: toastId });
    } finally {
      setIsSubmitting(false);
      setSubmissionType(null);
    }
  }, [
    isSubmitting,
    courseId,
    teacherId,
    videos,
    formData,
    courseThumbnailFile,
    deletedVideoIds,
    navigate,
  ]);

  const handleSaveDraftFromPublished = useCallback(async () => {
    setEditConfirmationModalOpen(false);
    if (isSubmitting) return;

    if (!validateForDraft()) {
      toast.error("Please provide Title and at least 1 Video for draft");
      if (!formData.courseTitle.trim() && activeTab !== "basic") {
        setActiveTab("basic");
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionType("draft");
    const toastId = toast.loading("Saving as draft...");

    try {
      const fd = new FormData();
      fd.append("course_id", courseId);
      fd.append("courseTitle", formData.courseTitle);
      fd.append("category", formData.category);
      fd.append("skillLevel", formData.skillLevel);
      fd.append("price", formData.price || 0);
      fd.append("durationWeeks", formData.recommendedWeeks || "");
      fd.append("hoursPerWeek", formData.hoursPerWeek || "");
      fd.append("accessDuration", formData.accessDuration || "lifetime");
      fd.append("description", formData.description);
      fd.append("whatYouWillLearn", formData.whatYouWillLearn);
      fd.append("requirements", formData.requirements);
      fd.append("learningSchedule", formData.learningSchedule || "");
      fd.append("language", formData.language || "English");
      fd.append("status", "draft");
      fd.append("tags", JSON.stringify(formData.tags));
      fd.append("deleted_video_ids", JSON.stringify(deletedVideoIds));

      if (courseThumbnailFile) {
        fd.append("course_thumbnail", courseThumbnailFile);
      }

      videos.forEach((vid) => {
        if (vid.dbId) fd.append("video_ids[]", vid.dbId);
        fd.append("video_titles[]", vid.title || "");
        fd.append("video_descriptions[]", vid.description || "");
        fd.append("video_durations[]", vid.duration || 0);
      });

      const response = await fetch(API.UPDATE_COURSE, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Course saved as draft!", { id: toastId });
        navigate(`/teacher/manageclasses/${teacherId}`);
      } else {
        throw new Error(data.message || "Failed to save as draft");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save as draft", { id: toastId });
    } finally {
      setIsSubmitting(false);
      setSubmissionType(null);
    }
  }, [isSubmitting, validateForDraft, courseId, teacherId, videos, formData, courseThumbnailFile, deletedVideoIds, activeTab, navigate]);

  const handleEditPublishedCourse = useCallback(async () => {
    setEditConfirmationModalOpen(false);
    if (!validateForPublish()) {
      const errorCount = Object.keys(errors).length || "multiple";
      toast.error(`Please fix ${errorCount} validation errors`);
      const basicInfoErrors = [
        "courseTitle",
        "category",
        "skillLevel",
        "price",
        "recommendedWeeks",
        "hoursPerWeek",
        "description",
        "tags",
      ];
      const hasBasicErrors = basicInfoErrors.some((key) => errors[key]);
      if (hasBasicErrors && activeTab !== "basic") {
        setActiveTab("basic");
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionType("publish");
    const toastId = toast.loading("Updating course...");

    try {
      const fd = new FormData();
      fd.append("course_id", courseId);
      fd.append("courseTitle", formData.courseTitle);
      fd.append("category", formData.category);
      fd.append("skillLevel", formData.skillLevel);
      fd.append("price", formData.price || 0);
      fd.append("durationWeeks", formData.recommendedWeeks);
      fd.append("hoursPerWeek", formData.hoursPerWeek || "");
      fd.append("accessDuration", formData.accessDuration || "lifetime");
      fd.append("description", formData.description);
      fd.append("whatYouWillLearn", formData.whatYouWillLearn);
      fd.append("requirements", formData.requirements);
      fd.append("learningSchedule", formData.learningSchedule || "");
      fd.append("language", formData.language || "English");
      fd.append("status", "published"); // Keep as published
      fd.append("tags", JSON.stringify(formData.tags));
      fd.append("deleted_video_ids", JSON.stringify(deletedVideoIds));

      if (courseThumbnailFile) {
        fd.append("course_thumbnail", courseThumbnailFile);
      }

      videos.forEach((vid, idx) => {
        if (vid.dbId) fd.append("video_ids[]", vid.dbId);
        fd.append("video_titles[]", vid.title || "");
        fd.append("video_descriptions[]", vid.description || "");
        fd.append("video_durations[]", vid.duration || 0);
      });

      const response = await fetch(API.UPDATE_COURSE, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Course updated successfully!", { id: toastId });
        navigate(`/teacher/manageclasses/${teacherId}`);
      } else {
        throw new Error(data.message || "Failed to update course");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update course", { id: toastId });
    } finally {
      setIsSubmitting(false);
      setSubmissionType(null);
    }
  }, [isSubmitting, validateForPublish, courseId, teacherId, videos, formData, courseThumbnailFile, deletedVideoIds, errors, activeTab, navigate]);

  const handleSaveDraft = useCallback(async () => {
    if (isSubmitting) return;

    if (!validateForDraft()) {
      toast.error("Please provide Title and at least 1 Video for draft");
      if (!formData.courseTitle.trim() && activeTab !== "basic") {
        setActiveTab("basic");
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionType("draft");
    const toastId = toast.loading("Saving changes...");

    try {
      const fd = new FormData();
      fd.append("course_id", courseId);
      fd.append("courseTitle", formData.courseTitle);
      fd.append("category", formData.category);
      fd.append("skillLevel", formData.skillLevel);
      fd.append("price", formData.price || 0);
      fd.append("durationWeeks", formData.recommendedWeeks || "");
      fd.append("hoursPerWeek", formData.hoursPerWeek || "");
      fd.append("accessDuration", formData.accessDuration || "lifetime");
      fd.append("description", formData.description);
      fd.append("whatYouWillLearn", formData.whatYouWillLearn);
      fd.append("requirements", formData.requirements);
      fd.append("learningSchedule", formData.learningSchedule || "");
      fd.append("language", formData.language || "English");
      fd.append("status", "draft");
      fd.append("tags", JSON.stringify(formData.tags));
      fd.append("deleted_video_ids", JSON.stringify(deletedVideoIds));

      if (courseThumbnailFile) {
        fd.append("course_thumbnail", courseThumbnailFile);
      }

      // Send existing video IDs and updated metadata
      videos.forEach((vid) => {
        if (vid.dbId) fd.append("video_ids[]", vid.dbId);
        fd.append("video_titles[]", vid.title || "");
        fd.append("video_descriptions[]", vid.description || "");
        fd.append("video_durations[]", vid.duration || 0);
      });

      const response = await fetch(API.UPDATE_COURSE, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Changes saved successfully!", { id: toastId });
        navigate(`/teacher/manageclasses/${teacherId}`);
      } else {
        throw new Error(data.message || "Failed to save changes");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save changes", { id: toastId });
    } finally {
      setIsSubmitting(false);
      setSubmissionType(null);
    }
  }, [
    isSubmitting,
    validateForDraft,
    courseId,
    teacherId,
    videos,
    formData,
    courseThumbnailFile,
    deletedVideoIds,
    activeTab,
    navigate,
  ]);

  // Show loading screen while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <CourseEditHeader
          onBack={() => navigate(-1)}
          isSubmitting={isSubmitting}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Videos */}
          <div className="space-y-6">
            <MediaEditSection
              videos={videos}
              selectedVideo={selectedVideo}
              setSelectedVideo={setSelectedVideo}
              isUploading={isUploading}
              handleVideoUpload={handleVideoUpload}
              removeVideo={removeVideo}
              isDragging={isDragging}
              draggedIndexRef={draggedIndexRef}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragEnd={handleDragEnd}
              onEditVideo={(vid) => {
                setCurrentEditingVideo(vid);
                setVideoDetailOpen(true);
              }}
              courseThumbnailUrl={courseThumbnailUrl}
              courseThumbnailFile={courseThumbnailFile}
              handleCourseThumbnailChange={handleCourseThumbnailChange}
              removeCourseThumbnail={removeCourseThumbnail}
              errors={errors}
              totalHours={totalHours}
              totalMinutes={totalMinutes}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column - Course Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition ${activeTab === "basic"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}>
                  <Tag className="w-4 h-4" />
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 py-4 font-semibold flex items-center justify-center gap-2 transition ${activeTab === "details"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}>
                  <Info className="w-4 h-4" />
                  Details
                </button>
              </div>

              <div className="p-6 space-y-6  overflow-y-auto">
                {activeTab === "basic" && (
                  <BasicInfoForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    handleTagKeyDown={handleTagKeyDown}
                    handleTagBlur={handleTagBlur}
                    removeTag={removeTag}
                    totalHours={totalHours}
                    totalMinutes={totalMinutes}
                  />
                )}

                {activeTab === "details" && (
                  <AdditionalInfoForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-4">
                {courseStatus === "published" ? (
                  <>
                    {/* Published Course: Show Save as Draft and Edit Course */}
                    <button
                      onClick={() => {
                        setConfirmationActionType("saveAsDraft");
                        setEditConfirmationModalOpen(true);
                      }}
                      disabled={isSubmitting || isUploading}
                      className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting && submissionType === "draft" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save as Draft
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (hasFormChanged()) {
                          setConfirmationActionType("editCourse");
                          setEditConfirmationModalOpen(true);
                        }
                      }}
                      disabled={isSubmitting || isUploading || !hasFormChanged()}
                      className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${hasFormChanged()
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}>
                      {isSubmitting && submissionType === "publish" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit className="w-5 h-5" />
                          Edit Course
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Draft Course: Show Save as Draft and Publish Course */}
                    <button
                      onClick={handleSaveDraft}
                      disabled={isSubmitting || isUploading || !hasFormChanged()}
                      className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting && submissionType === "draft" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Draft
                        </>
                      )}
                    </button>
                    <button
                      onClick={handlePublishClick}
                      disabled={isSubmitting || isUploading || !hasFormChanged()}
                      className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${hasFormChanged()
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}>
                      {isSubmitting && submissionType === "publish" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Eye className="w-5 h-5" />
                          Publish Course
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Detail Modal */}
      <VideoDetailEdit
        video={currentEditingVideo}
        isOpen={videoDetailOpen}
        onClose={() => {
          setVideoDetailOpen(false);
          setCurrentEditingVideo(null);
        }}
        onSave={(updatedData) => {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === updatedData.id
                ? {
                  ...v,
                  title: updatedData.title,
                  description: updatedData.description,
                  thumbnailUrl: updatedData.thumbnailUrl,
                  thumbnailFile: updatedData.thumbnailFile,
                }
                : v,
            ),
          );
          setVideoDetailOpen(false);
          setCurrentEditingVideo(null);
          toast.success("Video details updated!");
        }}
        isSaving={isSubmitting}
      />

      {/* Publish Confirmation Modal */}
      {publishModalOpen && (
        <PublishCourseModal
          course={{ title: formData.courseTitle }}
          onClose={() => setPublishModalOpen(false)}
          onPublish={confirmPublish}
        />
      )}

      {/* Edit Course Confirmation Modal (for published courses) */}
      {editConfirmationModalOpen && courseStatus === "published" && (
        <EditCourseConfirmationModal
          course={{ title: formData.courseTitle, courseTitle: formData.courseTitle }}
          onClose={() => setEditConfirmationModalOpen(false)}
          onConfirm={
            confirmationActionType === "saveAsDraft"
              ? handleSaveDraftFromPublished
              : handleEditPublishedCourse
          }
          actionType={confirmationActionType}
        />
      )}
    </div>
  );
}
