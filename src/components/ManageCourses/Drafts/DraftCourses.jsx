import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, Search, Grid, List, Filter } from "lucide-react";
import API from "../../../Configs/ApiEndpoints";
import { useAuth } from "../../../context/AuthContext";
import CourseGrid from "../CourseDisplay/CourseGrid";
import CourseList from "../CourseDisplay/CourseList";
import PublishCourseModal from "../Modals/PublishCourseModal";

const categories = ["All Categories", "Dance", "Music", "Art", "Singing"];

const sortOptions = ["Latest", "Oldest"];
const seatsOptions = ["All Seats", "Available", "Full"];

const DraftCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teacherId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortOption, setSortOption] = useState("Latest");

  const [seatsFilter, setSeatsFilter] = useState("All Seats");
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [courseToPublish, setCourseToPublish] = useState(null);

  // Fetch drafts from API
  useEffect(() => {
    const loadDrafts = async () => {
      setLoading(true);
      try {
        const response = await fetch(API.GET_DRAFT_COURSES, {
          credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
          // Map backend data to expected format
          const drafts = (data.drafts || []).map((course) => ({
            id: course.id,
            title: course.title,
            category: course.category,
            seats: 100, // Default seats for courses
            price: course.price,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            images: course.image ? [`${API.COURSE_THUMBNAILS}/${course.image}`] : [],
            status: "Draft",
            duration: course.duration,
            level: course.level,
            video_count: course.video_count,
          }));
          setCourses(drafts);
        } else {
          console.warn("Failed to fetch drafts:", data.error);
          toast.error(data.error || "Failed to load drafts");
          setCourses([]);
        }
      } catch (error) {
        console.error("Error loading drafts:", error);
        toast.error("Failed to load drafts");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadDrafts();
  }, []);

  // Filtering
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch = (course.title || course.productName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" ||
        course.category === categoryFilter;
      // Mock seats logic
      const seats = parseInt(course.seats || course.stock || 0);
      let matchesSeats = true;
      if (seatsFilter === "Available") matchesSeats = seats > 0;
      if (seatsFilter === "Full") matchesSeats = seats === 0;

      return matchesSearch && matchesCategory && matchesSeats;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOption === "Latest" ? dateB - dateA : dateA - dateB;
    });

  const handleEdit = (course) => {
    // Determine ID from object or direct ID
    const id = course.id || course;
    navigate(`/teacher/classes/edit/${teacherId}/${id}`);
  };

  const handleView = (course) => {
    const id = course.id || course;
    // App.jsx route is /courses/:teacherId/:id
    navigate(`/courses/${teacherId}/${id}`);
  };

  const handlePublish = (course) => {
    setCourseToPublish(course);
    setPublishModalOpen(true);
  };

  const confirmPublish = async () => {
    if (!courseToPublish) return;
    const id = courseToPublish.id || courseToPublish;

    try {
      const response = await fetch(API.UPDATE_COURSE_STATUS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ course_id: id, status: "published" }),
      });
      const data = await response.json();

      if (data.status === "success") {
        toast.success("Course Published Successfully");
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error(data.message || "Failed to publish course");
      }
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish course");
    } finally {
      setPublishModalOpen(false);
      setCourseToPublish(null);
    }
  };

  const handleDelete = async (course) => {
    const id = course.id || course;
    if (!window.confirm("Delete this draft?")) return;

    try {
      const response = await fetch(`${API.DELETE_COURSE}?course_id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.status === "success") {
        toast.success("Draft deleted successfully");
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error(data.message || "Failed to delete draft");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete draft");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Draft Courses
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your unpublished courses
            </p>
          </div>
          <button
            onClick={() => navigate(`/teacher/manageclasses/${teacherId}`)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Back
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-6 mb-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium">
                Total Draft Courses
              </p>
              <p className="text-3xl font-bold mt-1">{courses.length}</p>
            </div>
            <FileText className="w-12 h-12 text-gray-200 opacity-50" />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search drafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}>
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}>
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
              {sortOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={seatsFilter}
              onChange={(e) => setSeatsFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
              {seatsOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Drafts Found
            </h3>
            <p className="text-gray-600">Try adjusting yours filters.</p>
          </div>
        ) : viewMode === "grid" ? (
          <CourseGrid
            courses={filteredCourses}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
            isDraftMode={true}
          />
        ) : (
          <CourseList
            courses={filteredCourses}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
            isDraftMode={true}
          />
        )}
      </div>

      {/* Publish Modal */}
      {publishModalOpen && courseToPublish && (
        <PublishCourseModal
          course={courseToPublish}
          onClose={() => {
            setPublishModalOpen(false);
            setCourseToPublish(null);
          }}
          onPublish={confirmPublish}
        />
      )}
    </div>
  );
};

export default DraftCourses;
