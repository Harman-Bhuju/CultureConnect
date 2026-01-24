import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Grid,
  List,
  GraduationCap,
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react";
import EnrolledCourseGrid from "../../components/MyCourses/EnrolledCourseGrid";
import EnrolledCourseList from "../../components/MyCourses/EnrolledCourseList";

// Mock data for enrolled courses (frontend-only)
const mockEnrolledCourses = [
  {
    id: 1,
    title: "Traditional Nepali Dance - Maruni",
    category: "Dance",
    teacherName: "Maya Gurung",
    description:
      "Learn the elegant movements of the Maruni dance, a traditional Nepali dance form...",
    thumbnail:
      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800",
    averageRating: 4.8,
    progress: 75,
    totalVideos: 12,
    completedVideos: 9,
    teacherId: 1,
  },
  {
    id: 2,
    title: "Nepali Folk Music - Sarangi Basics",
    category: "Music",
    teacherName: "Ram Bahadur",
    description:
      "Master the fundamentals of the Sarangi, a unique Nepali string instrument...",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    averageRating: 4.5,
    progress: 40,
    totalVideos: 10,
    completedVideos: 4,
    teacherId: 2,
  },
  {
    id: 3,
    title: "Thangka Painting Fundamentals",
    category: "Art",
    teacherName: "Tenzin Lama",
    description:
      "Discover the spiritual art of Thangka painting and learn to create your own...",
    thumbnail:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
    averageRating: 4.9,
    progress: 100,
    totalVideos: 8,
    completedVideos: 8,
    teacherId: 3,
  },
  {
    id: 4,
    title: "Newari Cuisine Masterclass",
    category: "Cooking",
    teacherName: "Sarita Maharjan",
    description:
      "Cook authentic Newari dishes with traditional recipes passed down through generations...",
    thumbnail:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
    averageRating: 4.7,
    progress: 0,
    totalVideos: 15,
    completedVideos: 0,
    teacherId: 4,
  },
  {
    id: 5,
    title: "Nepali Language for Beginners",
    category: "Language",
    teacherName: "Binod Sharma",
    description:
      "Start speaking Nepali with confidence. Learn essential vocabulary and grammar...",
    thumbnail:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
    averageRating: 4.6,
    progress: 25,
    totalVideos: 20,
    completedVideos: 5,
    teacherId: 5,
  },
  {
    id: 6,
    title: "Traditional Dhaka Weaving",
    category: "Craft",
    teacherName: "Parbati Rai",
    description:
      "Learn the intricate art of Dhaka weaving and create beautiful handwoven textiles...",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    averageRating: 4.4,
    progress: 60,
    totalVideos: 6,
    completedVideos: 4,
    teacherId: 6,
  },
];

const categories = [
  "All Categories",
  "Dance",
  "Music",
  "Art",
  "Cooking",
  "Language",
  "Craft",
];

const progressFilters = [
  { label: "All Courses", value: "all" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Not Started", value: "not-started" },
];

const MyCourses = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [progressFilter, setProgressFilter] = useState("all");

  // Filter courses based on search, category, and progress
  const filteredCourses = mockEnrolledCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All Categories" || course.category === categoryFilter;
    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "completed" && course.progress === 100) ||
      (progressFilter === "in-progress" &&
        course.progress > 0 &&
        course.progress < 100) ||
      (progressFilter === "not-started" && course.progress === 0);

    return matchesSearch && matchesCategory && matchesProgress;
  });

  // Stats
  const stats = {
    total: mockEnrolledCourses.length,
    inProgress: mockEnrolledCourses.filter(
      (c) => c.progress > 0 && c.progress < 100,
    ).length,
    completed: mockEnrolledCourses.filter((c) => c.progress === 100).length,
    notStarted: mockEnrolledCourses.filter((c) => c.progress === 0).length,
  };

  const handleContinueCourse = (course) => {
    navigate(`/courses/${course.teacherId}/${course.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-blue-600" />
                My Courses
              </h1>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">
                  In Progress
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-900">
                {stats.inProgress}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {stats.completed}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">
                  Not Started
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.notStarted}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search your courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Progress Filter */}
              <select
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {progressFilters.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex gap-2 ml-auto">
                <p className="text-gray-500 py-2">
                  {filteredCourses.length} courses
                </p>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}>
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}>
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === "grid" ? (
          <EnrolledCourseGrid
            courses={filteredCourses}
            onContinue={handleContinueCourse}
          />
        ) : (
          <EnrolledCourseList
            courses={filteredCourses}
            onContinue={handleContinueCourse}
          />
        )}
      </main>
    </div>
  );
};

export default MyCourses;
